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

// GPS smoothing — rolling weighted-average buffer (last 5 accepted fixes)
const GPS_BUFFER_SIZE = 5;

// GPS course blending
// When the device is moving, Location.watchPositionAsync provides pos.coords.heading
// (0–360°, true north, -1 when stationary) and pos.coords.speed (m/s).
// Below COURSE_MIN_SPEED we rely entirely on the magnetometer.
// Above COURSE_FULL_SPEED GPS course dominates fully.
// In between, the two sources are blended by speed-proportional weight.
const COURSE_MIN_SPEED  = 0.5;  // m/s — below this: magnetometer only
const COURSE_FULL_SPEED = 1.2;  // m/s — above this: GPS course fully trusted

// Compute smoothed lat/lng from buffer using 1/accuracy weighting
function smoothedPosition(buffer) {
  if (buffer.length === 0) return null;
  let wSum = 0;
  let latSum = 0;
  let lngSum = 0;
  for (const fix of buffer) {
    const w = 1 / fix.accuracy;
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

  const subRef      = useRef(null);
  const magRef      = useRef(null);
  const headingBuf  = useRef([]);

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
          distanceInterval: 3, // 3m minimum — 0.5m caused GPS noise jitter
        },
        pos => {
          if (pos.coords.accuracy > 25) return; // skip readings worse than 25m accuracy
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

      // Set sensor update intervals
      Gyroscope.setUpdateInterval(33);
      Accelerometer.setUpdateInterval(33);
      Magnetometer.setUpdateInterval(50);

      // Blend magnetometer-derived heading with GPS course heading.
      // When stationary (gpsCourseRef is null) returns the mag heading unchanged.
      // As speed rises from COURSE_MIN_SPEED to COURSE_FULL_SPEED, GPS course
      // weight rises linearly from 0 to 1. Uses shortest-path circular interpolation
      // so the blend never snaps across the 0°/360° boundary.
      function blendWithGpsCourse(magHeading) {
        const gpsCourse = gpsCourseRef.current;
        if (gpsCourse === null) return magHeading; // stationary: magnetometer only

        // Speed at the moment of the last GPS fix — used as a proxy for current speed.
        // We read it from the most recent watchPositionAsync result via gpsCourseRef.
        // Weight: 0 at COURSE_MIN_SPEED, 1 at COURSE_FULL_SPEED.
        // (The ref stores the course; speed is implicit — if the ref is non-null, we
        // know speed >= COURSE_MIN_SPEED at the last fix. We track speed separately.)
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
        // ── Tilt-compensated heading ──────────────────────────────────────
        const { x: ax, y: ay, z: az } = accelDataRef.current;
        const mx = x;
        const my = y;
        const mz = z != null ? z : 0; // z may not be provided — fall back to 0

        const pitch = Math.atan2(-ax, Math.sqrt(ay * ay + az * az));
        const roll  = Math.atan2(ay, az);
        const Xh = mx * Math.cos(pitch) + mz * Math.sin(pitch);
        const Yh = mx * Math.sin(roll) * Math.sin(pitch) + my * Math.cos(roll) - mz * Math.sin(roll) * Math.cos(pitch);
        let magHeading = Math.atan2(-Yh, Xh) * (180 / Math.PI);
        magHeading = (magHeading + 360) % 360;

        // Store latest tilt-compensated heading for gyro fusion
        magHeadingRef.current = magHeading;

        // Smooth via circular buffer
        headingBuf.current.push(magHeading);
        if (headingBuf.current.length > HEADING_SAMPLES) {
          headingBuf.current.shift();
        }

        const buf = headingBuf.current;
        const sinSum = buf.reduce((s, a) => s + Math.sin(a * Math.PI / 180), 0);
        const cosSum = buf.reduce((s, a) => s + Math.cos(a * Math.PI / 180), 0);
        const smoothed = (Math.atan2(sinSum, cosSum) * 180 / Math.PI + 360) % 360;

        // Initialize fused heading on first reading
        if (fusedHeadingRef.current === null) {
          fusedHeadingRef.current = smoothed;
        }

        // Apply user compass offset correction
        const corrected = (smoothed + _compassOffset + 360) % 360;

        if (active) setHeading(blendWithGpsCourse(corrected));
      });

      // Accelerometer subscriber — feeds tilt compensation
      accelRef.current = Accelerometer.addListener(({ x, y, z }) => {
        accelDataRef.current = { x, y, z };
      });

      // Gyroscope subscriber — complementary filter fusion
      gyroRef.current = Gyroscope.addListener(({ z: gz }) => {
        const now = Date.now();
        const dt = lastTimestampRef.current !== null
          ? (now - lastTimestampRef.current) / 1000
          : 0.016;
        lastTimestampRef.current = now;

        const magH = magHeadingRef.current;
        if (magH === null) return; // not yet initialized

        const prev = fusedHeadingRef.current !== null ? fusedHeadingRef.current : magH;
        const ALPHA = 0.98;
        // Negate gz: expo-sensors positive gz = CCW, compass convention positive = CW
        let gyroContrib = prev + (-gz) * (180 / Math.PI) * dt;
        // Normalize gyro contribution to [0, 360)
        gyroContrib = ((gyroContrib % 360) + 360) % 360;
        // Shortest-path correction to avoid 0°/360° wrap-around snap
        let diff = magH - gyroContrib;
        if (diff >  180) diff -= 360;
        if (diff < -180) diff += 360;
        let fused = ((gyroContrib + (1 - ALPHA) * diff) + 360) % 360;
        fusedHeadingRef.current = fused;

        // Apply user compass offset correction and update heading state
        const corrected = (fused + _compassOffset + 360) % 360;
        if (active) setHeading(blendWithGpsCourse(corrected));
      });
    }

    start().catch(e => setError(e.message));

    return () => {
      active = false;
      subRef.current?.remove();
      magRef.current?.remove();
      if (gyroRef.current) { gyroRef.current.remove(); gyroRef.current = null; }
      if (accelRef.current) { accelRef.current.remove(); accelRef.current = null; }
    };
  }, []);

  return { location, heading, error, gpsReady, gpsWarning, gpsQuality };
}
