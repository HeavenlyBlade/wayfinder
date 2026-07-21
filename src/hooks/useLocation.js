import { useState, useEffect, useRef } from 'react';
import * as Location from 'expo-location';
import { Magnetometer } from 'expo-sensors';

export default function useLocation() {
  const [location, setLocation] = useState(null);      // { lat, lng }
  const [heading,  setHeading]  = useState(0);          // compass degrees
  const [error,    setError]    = useState(null);
  const subRef = useRef(null);
  const magRef = useRef(null);

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
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      }

      // Watch position continuously
      subRef.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 1000,       // update every 1 second
          distanceInterval: 0.5,    // or every 0.5 metres
        },
        pos => {
          if (active) {
            setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          }
        }
      );

// ── 1. Fix: compass bearing must be north-referenced (0°=north, clockwise)
//    atan2(y, x) is east-referenced and gives 90° wrong heading.
//    Correct formula for compass from magnetometer: atan2(-x, y)
      magRef.current = Magnetometer.addListener(({ x, y }) => {
        let angle = Math.atan2(-x, y) * (180 / Math.PI);
        angle = (angle + 360) % 360;
        if (active) setHeading(angle);
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