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

export default function useLocation() {
  const [location, setLocation] = useState(null);
  const [heading,  setHeading]  = useState(0);
  const [error,    setError]    = useState(null);
  const subRef      = useRef(null);
  const magRef      = useRef(null);
  const headingBuf  = useRef([]);

  // Gyroscope / Accelerometer fusion refs
  const gyroRef          = useRef(null);
  const accelRef         = useRef(null);
  const fusedHeadingRef  = useRef(null); // null = not yet initialized
  const lastTimestampRef = useRef(null);
  const accelDataRef     = useRef({ x: 0, y: 0, z: -1 }); // default: phone upright
  const magHeadingRef    = useRef(null);

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
        setLocation({
          lat:      pos.coords.latitude,
          lng:      pos.coords.longitude,
          altitude: pos.coords.altitude ?? 0,
        });
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
            setLocation({
              lat:      pos.coords.latitude,
              lng:      pos.coords.longitude,
              altitude: pos.coords.altitude ?? 0,
            });
          }
        }
      );

      // Set sensor update intervals
      Gyroscope.setUpdateInterval(33);
      Accelerometer.setUpdateInterval(33);
      Magnetometer.setUpdateInterval(50);

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

        if (active) setHeading(corrected);
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
        if (active) setHeading(corrected);
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

  return { location, heading, error };
}
