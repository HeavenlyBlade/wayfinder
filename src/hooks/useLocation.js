import { useState, useEffect, useRef } from 'react';
import * as Location from 'expo-location';
import { Magnetometer, Gyroscope, Accelerometer } from 'expo-sensors';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Number of magnetometer samples to average for heading smoothness.
const HEADING_SAMPLES = 8;

// Storage key for the user-adjustable compass offset
const COMPASS_OFFSET_KEY = 'wayfinder_compass_offset';

// Default offset — set to 0; users can fine-tune via the CAL button in AR screen.
const DEFAULT_COMPASS_OFFSET = 0;

// Load persisted compass offset — falls back to calibrated default if not set
let _compassOffset = DEFAULT_COMPASS_OFFSET;
AsyncStorage.getItem(COMPASS_OFFSET_KEY).then(val => {
  if (val !== null) _compassOffset = parseFloat(val) || DEFAULT_COMPASS_OFFSET;
});

export function setCompassOffset(degrees) {
  _compassOffset = degrees;
  AsyncStorage.setItem(COMPASS_OFFSET_KEY, String(degrees));
}

export function getCompassOffset() {
  return _compassOffset;
}

// GPS smoothing — 3-sample buffer with recency decay to eliminate pedestrian position lag
const GPS_BUFFER_SIZE = 3;

// GPS course blending
// When the device is moving, Location.watchPositionAsync provides pos.coords.heading
// (0–360°, true north, -1 when stationary) and pos.coords.speed (m/s).
// Below COURSE_MIN_SPEED we rely entirely on the magnetometer.
// Above COURSE_FULL_SPEED GPS course dominates fully.
// In between, the two sources are blended by speed-proportional weight.
const COURSE_MIN_SPEED  = 0.5;  // m/s — below this: magnetometer only
const COURSE_FULL_SPEED = 1.2;  // m/s — above this: GPS course fully trusted

// Compute smoothed lat/lng with exponential recency weighting:
// Most recent fix gets the highest weight so pedestrian position does not lag behind.
function smoothedPosition(buffer) {
  if (buffer.length === 0) return null;
  let wSum = 0;
  let latSum = 0;
  let lngSum = 0;
  const n = buffer.length;
  for (let i = 0; i < n; i++) {
    const fix = buffer[i];
    // Age factor: 1.0 for newest fix, decaying for older fixes
    const ageFactor = Math.pow(0.5, (n - 1) - i);
    const w = (1 / Math.max(1, fix.accuracy)) * ageFactor;
    wSum   += w;
    latSum += fix.lat * w;
    lngSum += fix.lng * w;
  }
  return { lat: latSum / wSum, lng: lngSum / wSum };
}

export default function useLocation() {
  const [location,   setLocation]   = useState(null);
  const [heading,    setHeading]    = useState(0);
  const [error,      setError]      = useState(null);
  const [gpsReady,   setGpsReady]   = useState(false);
  const [gpsWarning, setGpsWarning] = useState(false);
  const [gpsQuality, setGpsQuality] = useState(null);

  const subRef        = useRef(null);
  const headingSubRef = useRef(null);
  const magRef        = useRef(null);
  const headingBuf    = useRef([]);

  // GPS smoothing buffer — stores { lat, lng, altitude, accuracy }
  const gpsBufRef        = useRef([]);
  // GPS course heading from watchPositionAsync (valid when moving)
  const gpsCourseRef     = useRef(null); // null = not yet received / stationary
  // Warm-up gate
  const gpsReadyRef      = useRef(false);
  const warmupTimerRef   = useRef(null);

  // Gyroscope / Accelerometer fusion refs
  const gyroRef          = useRef(null);
  const accelRef         = useRef(null);
  const fusedHeadingRef  = useRef(null); // null = not yet initialized
  const lastTimestampRef = useRef(null);
  const accelDataRef     = useRef({ x: 0, y: 0, z: -1 }); // default: phone upright
  const magHeadingRef    = useRef(null);
  const lastHeadingStateRef = useRef(0);
  const lastHeadingTimeRef  = useRef(0);

  // Warm-up gate — 12-second fallback timer
  useEffect(() => {
    warmupTimerRef.current = setTimeout(() => {
      if (!gpsReadyRef.current) {
        gpsReadyRef.current = true;
        setGpsReady(true);
        setGpsWarning(true);
      }
    }, 12000);
    return () => {
      if (warmupTimerRef.current) clearTimeout(warmupTimerRef.current);
    };
  }, []);

  useEffect(() => {
    let active = true;

    async function start() {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Location permission denied');
        return;
      }

      const pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      if (active) {
        const acc = pos.coords.accuracy ?? 999;
        const buf = gpsBufRef.current;
        buf.push({ lat: pos.coords.latitude, lng: pos.coords.longitude, altitude: pos.coords.altitude ?? 0, accuracy: acc });
        if (buf.length > GPS_BUFFER_SIZE) buf.shift();
        const smoothed = smoothedPosition(buf);
        if (smoothed) {
          setLocation({ lat: smoothed.lat, lng: smoothed.lng, altitude: pos.coords.altitude ?? 0 });
        }
        // Warm-up gate: first fix with accuracy <= 15m clears the timer
        if (acc <= 15 && !gpsReadyRef.current) {
          gpsReadyRef.current = true;
          setGpsReady(true);
          if (warmupTimerRef.current) { clearTimeout(warmupTimerRef.current); warmupTimerRef.current = null; }
        }
        // Quality
        setGpsQuality(acc <= 10 ? 'good' : acc <= 20 ? 'fair' : 'poor');
      }

      subRef.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 1000,
          distanceInterval: 1, // 1m for responsive pedestrian tracking without freeze
        },
        pos => {
          if (pos.coords.accuracy > 35) return; // accept fixes up to 35m (campus building proximity)
          if (active) {
            const acc   = pos.coords.accuracy;
            const speed = pos.coords.speed ?? 0;
            const course = pos.coords.heading; // 0–360 true north, or -1 when stationary

            // Store GPS course when moving; clear when stationary
            if (course != null && course >= 0 && speed >= COURSE_MIN_SPEED) {
              gpsCourseRef.current = course;
              gpsCourseRef._speed  = speed;
            } else if (speed < COURSE_MIN_SPEED) {
              gpsCourseRef.current = null;
              gpsCourseRef._speed  = 0;
            }

            // Add to rolling buffer and compute weighted average
            const buf = gpsBufRef.current;
            buf.push({ lat: pos.coords.latitude, lng: pos.coords.longitude, altitude: pos.coords.altitude ?? 0, accuracy: acc });
            if (buf.length > GPS_BUFFER_SIZE) buf.shift();
            const smoothed = smoothedPosition(buf);
            if (smoothed) {
              setLocation({ lat: smoothed.lat, lng: smoothed.lng, altitude: pos.coords.altitude ?? 0 });
            }
            // Warm-up gate: first fix with accuracy <= 15m clears the timer
            if (acc <= 15 && !gpsReadyRef.current) {
              gpsReadyRef.current = true;
              setGpsReady(true);
              if (warmupTimerRef.current) { clearTimeout(warmupTimerRef.current); warmupTimerRef.current = null; }
            }
            // Quality based on latest raw accuracy
            setGpsQuality(acc <= 10 ? 'good' : acc <= 20 ? 'fair' : 'poor');
          }
        }
      );

      // ── 1. Native OS Sensor Fusion Heading (Android Rotation Vector / iOS CoreLocation) ──
      let usingNativeHeading = false;
      try {
        headingSubRef.current = await Location.watchHeadingAsync((headingObj) => {
          if (!active) return;
          const h = (headingObj.trueHeading >= 0 ? headingObj.trueHeading : headingObj.magHeading);
          if (h != null && !isNaN(h)) {
            usingNativeHeading = true;
            const corrected = (h + _compassOffset + 360) % 360;
            // Native sensor fusion heading (hardware gyro+accel+mag) is already optimal;
            // do not override with noisy pedestrian GPS course when walking.
            commitHeading(corrected);
          }
        });
      } catch (err) {
        console.warn("[useLocation] watchHeadingAsync fallback to sensors", err);
      }

      // ── 2. Fallback Sensor Pipeline (Magnetometer + 3D Tilt + Gyroscope) ──
      const gyroAvailable = await Gyroscope.isAvailableAsync();

      // Set sensor update intervals
      if (gyroAvailable) Gyroscope.setUpdateInterval(33);
      Accelerometer.setUpdateInterval(33);
      Magnetometer.setUpdateInterval(50);

      // Throttled & deadbanded heading state updater
      // Caps UI updates to ~15 fps (66ms) and suppresses noise <0.75° to stop jitter
      function commitHeading(newHeading) {
        if (!active) return;
        const now = Date.now();
        const lastTime = lastHeadingTimeRef.current;
        const lastHeading = lastHeadingStateRef.current;

        // Throttle to at most ~15 updates/sec (66ms interval)
        if (now - lastTime < 66) return;

        let diff = Math.abs(newHeading - lastHeading);
        if (diff > 180) diff = 360 - diff;

        // Deadband: ignore fluctuations under 0.75° unless more than 250ms have elapsed
        if (diff < 0.75 && (now - lastTime < 250)) return;

        lastHeadingTimeRef.current = now;
        lastHeadingStateRef.current = newHeading;
        setHeading(newHeading);
      }

      // Blend magnetometer-derived heading with GPS course heading.
      // When stationary (gpsCourseRef is null) returns the mag heading unchanged.
      // As speed rises from COURSE_MIN_SPEED to COURSE_FULL_SPEED, GPS course
      // weight rises linearly from 0 to 1. Uses shortest-path circular interpolation
      // so the blend never snaps across the 0°/360° boundary.
      function blendWithGpsCourse(magHeading) {
        const gpsCourse = gpsCourseRef.current;
        if (gpsCourse === null) return magHeading; // stationary: magnetometer only

        const speed = gpsCourseRef._speed ?? COURSE_MIN_SPEED;
        const t = Math.min(1, Math.max(0,
          (speed - COURSE_MIN_SPEED) / (COURSE_FULL_SPEED - COURSE_MIN_SPEED)
        ));
        if (t <= 0) return magHeading;
        if (t >= 1) return gpsCourse;

        // Shortest-path circular interpolation
        let diff = gpsCourse - magHeading;
        if (diff >  180) diff -= 360;
        if (diff < -180) diff += 360;
        return ((magHeading + t * diff) + 360) % 360;
      }

      magRef.current = Magnetometer.addListener(({ x, y, z }) => {
        if (usingNativeHeading) return; // native heading takes precedence

        // ── Tilt-compensated heading ──────────────────────────────────────
        const { x: ax, y: ay, z: az } = accelDataRef.current;
        const mx = x;
        const my = y;
        const mz = z != null ? z : 0;

        const pitch = Math.atan2(-ax, Math.sqrt(ay * ay + az * az));
        const roll  = Math.atan2(ay, az);
        const Xh = mx * Math.cos(pitch) + mz * Math.sin(pitch);
        const Yh = mx * Math.sin(roll) * Math.sin(pitch) + my * Math.cos(roll) - mz * Math.sin(roll) * Math.cos(pitch);
        let magHeading = Math.atan2(-Yh, Xh) * (180 / Math.PI);
        magHeading = (magHeading + 360) % 360;

        // Smooth via circular buffer
        headingBuf.current.push(magHeading);
        if (headingBuf.current.length > HEADING_SAMPLES) {
          headingBuf.current.shift();
        }

        const buf = headingBuf.current;
        const sinSum = buf.reduce((s, a) => s + Math.sin(a * Math.PI / 180), 0);
        const cosSum = buf.reduce((s, a) => s + Math.cos(a * Math.PI / 180), 0);
        const smoothed = (Math.atan2(sinSum, cosSum) * 180 / Math.PI + 360) % 360;

        magHeadingRef.current = smoothed;

        if (fusedHeadingRef.current === null) {
          fusedHeadingRef.current = smoothed;
        }

        if (!gyroAvailable) {
          const corrected = (smoothed + _compassOffset + 360) % 360;
          commitHeading(blendWithGpsCourse(corrected));
        }
      });

      // Accelerometer subscriber — feeds tilt compensation
      accelRef.current = Accelerometer.addListener(({ x, y, z }) => {
        accelDataRef.current = { x, y, z };
      });

      // Gyroscope subscriber — 3D projection onto world vertical
      if (gyroAvailable) {
        gyroRef.current = Gyroscope.addListener(({ x: gx, y: gy, z: gz }) => {
          if (usingNativeHeading) return; // native heading takes precedence

          const now = Date.now();
          const dt = lastTimestampRef.current !== null
            ? (now - lastTimestampRef.current) / 1000
            : 0.016;
          lastTimestampRef.current = now;

          const magH = magHeadingRef.current;
          if (magH === null) return;

          const prev = fusedHeadingRef.current !== null ? fusedHeadingRef.current : magH;
          const ALPHA = 0.95;

          // Project 3D angular velocity onto gravity vector to get yaw rate in any phone orientation
          const { x: ax, y: ay, z: az } = accelDataRef.current;
          const gNorm = Math.hypot(ax, ay, az) || 1;
          const yawRate = (gx * (ax / gNorm) + gy * (ay / gNorm) + gz * (az / gNorm));

          let gyroContrib = prev + (-yawRate) * (180 / Math.PI) * dt;
          gyroContrib = ((gyroContrib % 360) + 360) % 360;

          let diff = magH - gyroContrib;
          if (diff >  180) diff -= 360;
          if (diff < -180) diff += 360;
          let fused = ((gyroContrib + (1 - ALPHA) * diff) + 360) % 360;
          fusedHeadingRef.current = fused;

          const corrected = (fused + _compassOffset + 360) % 360;
          commitHeading(blendWithGpsCourse(corrected));
        });
      }
    }

    start().catch(e => setError(e.message));

    return () => {
      active = false;
      subRef.current?.remove();
      headingSubRef.current?.remove();
      magRef.current?.remove();
      if (gyroRef.current) { gyroRef.current.remove(); gyroRef.current = null; }
      if (accelRef.current) { accelRef.current.remove(); accelRef.current = null; }
    };
  }, []);

  return { location, heading, error, gpsReady, gpsWarning, gpsQuality };
}
