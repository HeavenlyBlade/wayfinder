import { useState, useEffect, useRef } from 'react';
import * as Location from 'expo-location';
import { Magnetometer } from 'expo-sensors';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Number of magnetometer samples to average for heading smoothness.
const HEADING_SAMPLES = 8;

// Storage key for the user-adjustable compass offset
const COMPASS_OFFSET_KEY = 'wayfinder_compass_offset';

// Default offset calibrated at SACLI campus (National Diversion Highway side).
// -260 degrees corrects the magnetometer for outdoor use at this location.
// Users can still fine-tune via the CAL button in AR screen if needed.
const DEFAULT_COMPASS_OFFSET = -260;

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
          distanceInterval: 0.5,
        },
        pos => {
          if (active) {
            setLocation({
              lat:      pos.coords.latitude,
              lng:      pos.coords.longitude,
              altitude: pos.coords.altitude ?? 0,
            });
          }
        }
      );

      magRef.current = Magnetometer.addListener(({ x, y }) => {
        let raw = Math.atan2(-x, y) * (180 / Math.PI);
        raw = (raw + 360) % 360;

        headingBuf.current.push(raw);
        if (headingBuf.current.length > HEADING_SAMPLES) {
          headingBuf.current.shift();
        }

        const buf = headingBuf.current;
        const sinSum = buf.reduce((s, a) => s + Math.sin(a * Math.PI / 180), 0);
        const cosSum = buf.reduce((s, a) => s + Math.cos(a * Math.PI / 180), 0);
        const smoothed = (Math.atan2(sinSum, cosSum) * 180 / Math.PI + 360) % 360;

        // Apply user compass offset correction
        const corrected = (smoothed + _compassOffset + 360) % 360;

        if (active) setHeading(corrected);
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