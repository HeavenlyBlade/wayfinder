import { useState, useEffect, useRef } from 'react';
import * as Location from 'expo-location';
import { Magnetometer } from 'expo-sensors';

// Number of magnetometer samples to average for heading smoothness.
// Higher = smoother but slightly more lag. 8 is a good balance.
const HEADING_SAMPLES = 8;

export default function useLocation() {
  const [location, setLocation] = useState(null);      // { lat, lng }
  const [heading,  setHeading]  = useState(0);          // compass degrees (smoothed)
  const [error,    setError]    = useState(null);
  const subRef      = useRef(null);
  const magRef      = useRef(null);
  const headingBuf  = useRef([]);  // circular buffer of recent raw heading samples

  useEffect(() => {
    let active = true;

    async function start() {
      // Request permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Location permission denied');
        return;
      }

      // Get initial position fast
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

      // Watch position continuously
      subRef.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 1000,
          distanceInterval: 0.5,
        },
        pos => {
          if (active) {
            setLocation({
              lat:      pos.coords.latitude,
              lng:      pos.coords.longitude,
              altitude: pos.coords.altitude ?? 0,  // metres above sea level
            });
          }
        }
      );

// ── 1. Fix: compass bearing must be north-referenced (0°=north, clockwise)
//    atan2(y, x) is east-referenced and gives 90° wrong heading.
//    Correct formula for compass from magnetometer: atan2(-x, y)
//
// ── 2. Smooth heading with a circular mean over HEADING_SAMPLES readings.
//    Plain average breaks at the 0°/360° wraparound (e.g. averaging 1° and
//    359° gives 180° instead of 0°). Circular mean handles this correctly.
      magRef.current = Magnetometer.addListener(({ x, y }) => {
        let raw = Math.atan2(-x, y) * (180 / Math.PI);
        raw = (raw + 360) % 360;

        // Push into buffer, evict oldest when full
        headingBuf.current.push(raw);
        if (headingBuf.current.length > HEADING_SAMPLES) {
          headingBuf.current.shift();
        }

        // Circular mean: convert each sample to a unit vector, average, then back to angle
        const buf = headingBuf.current;
        const sinSum = buf.reduce((s, a) => s + Math.sin(a * Math.PI / 180), 0);
        const cosSum = buf.reduce((s, a) => s + Math.cos(a * Math.PI / 180), 0);
        const smoothed = (Math.atan2(sinSum, cosSum) * 180 / Math.PI + 360) % 360;

        if (active) setHeading(smoothed);
      });
    }

    start().catch(e => setError(e.message));

    return () => {
      active = false;
      subRef.current?.remove();
      magRef.current?.remove();
    };
  }, []);

  return { location, heading, error };
}