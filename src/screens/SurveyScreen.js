import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, Alert, Vibration,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import { radius } from '../constants/theme';

// Accuracy threshold — only accept readings this good or better (metres)
const ACCURACY_THRESHOLD = 5;

export default function SurveyScreen({ navigation }) {
  const [accuracy,     setAccuracy]     = useState(null);
  const [altitude,     setAltitude]     = useState(null);
  const [speed,        setSpeed]        = useState(null);
  const [savedPoints,  setSavedPoints]  = useState([]);
  const [isLocked,     setIsLocked]     = useState(false);
  const [readings,     setReadings]     = useState([]);
  const [avgLat,       setAvgLat]       = useState(null);
  const [avgLng,       setAvgLng]       = useState(null);
  const [avgAcc,       setAvgAcc]       = useState(null);

  const subRef     = useRef(null);
  const readingBuf = useRef([]); // rolling buffer of last N readings for averaging

  useEffect(() => {
    let active = true;
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      subRef.current = await Location.watchPositionAsync(
        {
          accuracy:         Location.Accuracy.BestForNavigation,
          timeInterval:     500,   // update every 500ms
          distanceInterval: 0,     // update on any movement
        },
        pos => {
          if (!active) return;
          const { latitude, longitude, accuracy: acc, altitude: alt, speed: spd } = pos.coords;

          setAccuracy(acc);
          setAltitude(alt);
          setSpeed(spd);

          // Rolling average over last 10 readings for stable coordinate
          readingBuf.current.push({ lat: latitude, lng: longitude, acc });
          if (readingBuf.current.length > 10) readingBuf.current.shift();

          const buf = readingBuf.current;
          const meanLat = buf.reduce((s, r) => s + r.lat, 0) / buf.length;
          const meanLng = buf.reduce((s, r) => s + r.lng, 0) / buf.length;
          const meanAcc = buf.reduce((s, r) => s + r.acc, 0) / buf.length;
          setAvgLat(meanLat);
          setAvgLng(meanLng);
          setAvgAcc(meanAcc);
          setReadings([...buf]);

          if (acc <= ACCURACY_THRESHOLD) setIsLocked(true);
          else setIsLocked(false);
        },
      );
    })();
    return () => { active = false; subRef.current?.remove(); };
  }, []);

  function savePoint(pointLabel) {
    if (!avgLat || !avgLng) return;
    const name = pointLabel || `Point ${savedPoints.length + 1}`;
    const point = {
      id:   Date.now(),
      name,
      lat:  avgLat,
      lng:  avgLng,
      acc:  avgAcc,
      time: new Date().toLocaleTimeString(),
    };
    setSavedPoints(prev => [point, ...prev]);
    Vibration.vibrate(200);
    Alert.alert('✅ Saved', `${name}\n${avgLat.toFixed(7)}, ${avgLng.toFixed(7)}`);
  }

  function copyPoint(point) {
    const text = `{ latitude: ${point.lat.toFixed(7)}, longitude: ${point.lng.toFixed(7)} }`;
    Clipboard.setStringAsync(text);
    Alert.alert('Copied', text);
  }

  function copyAllAsJSON() {
    const json = JSON.stringify(
      savedPoints.map(p => ({
        name: p.name,
        lat:  parseFloat(p.lat.toFixed(7)),
        lng:  parseFloat(p.lng.toFixed(7)),
        acc:  parseFloat(p.acc?.toFixed(1)),
      })),
      null, 2,
    );
    Clipboard.setStringAsync(json);
    Alert.alert('Copied', `${savedPoints.length} points copied as JSON`);
  }

  function deletePoint(id) {
    setSavedPoints(prev => prev.filter(p => p.id !== id));
  }

  function clearAll() {
    Alert.alert('Clear all?', 'This removes all saved points.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: () => setSavedPoints([]) },
    ]);
  }

  const accColor = !accuracy ? '#666'
    : accuracy <= 3  ? '#00C853'
    : accuracy <= 8  ? '#ffc107'
    : '#ff5555';

  const lockLabel = isLocked ? '🔒 GPS LOCKED' : '⏳ Acquiring…';

  return (
    <View style={s.container}>
      <SafeAreaView style={{ flex: 1 }}>

        {/* Header */}
        <View style={s.header}>
          <TouchableOpacity
            style={s.backBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <Text style={s.backText}>←</Text>
          </TouchableOpacity>
          <Text style={s.headerTitle}>GPS Survey Tool</Text>
          <View style={[s.lockBadge, { backgroundColor: isLocked ? 'rgba(0,200,83,0.2)' : 'rgba(255,193,7,0.15)' }]}>
            <Text style={[s.lockText, { color: isLocked ? '#00C853' : '#ffc107' }]}>
              {lockLabel}
            </Text>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>

          {/* Live coordinate display */}
          <View style={s.coordCard}>
            <Text style={s.coordLabel}>AVERAGED COORDINATE (last 10 readings)</Text>
            <Text style={s.coordLat}>
              {avgLat != null ? avgLat.toFixed(8) : '—'}
            </Text>
            <Text style={s.coordLng}>
              {avgLng != null ? avgLng.toFixed(8) : '—'}
            </Text>

            {/* Accuracy meter */}
            <View style={s.accRow}>
              <View style={[s.accDot, { backgroundColor: accColor }]} />
              <Text style={[s.accText, { color: accColor }]}>
                {accuracy != null ? `±${accuracy.toFixed(1)}m accuracy` : 'No GPS signal'}
              </Text>
              {avgAcc != null && (
                <Text style={s.avgAccText}> · avg ±{avgAcc.toFixed(1)}m</Text>
              )}
            </View>

            {/* Extra info row */}
            <View style={s.extraRow}>
              {altitude != null && (
                <Text style={s.extraText}>Alt: {altitude.toFixed(1)}m</Text>
              )}
              {speed != null && (
                <Text style={s.extraText}>Speed: {(speed * 3.6).toFixed(1)}km/h</Text>
              )}
              <Text style={s.extraText}>Samples: {readings.length}/10</Text>
            </View>
          </View>

          {/* Accuracy guide */}
          <View style={s.guideRow}>
            <View style={s.guideDot} />
            <Text style={s.guideText}>Green ≤3m — excellent for building corners</Text>
          </View>
          <View style={s.guideRow}>
            <View style={[s.guideDot, { backgroundColor: '#ffc107' }]} />
            <Text style={s.guideText}>Yellow ≤8m — good for path junctions</Text>
          </View>
          <View style={s.guideRow}>
            <View style={[s.guideDot, { backgroundColor: '#ff5555' }]} />
            <Text style={s.guideText}>Red &gt;8m — wait for better signal</Text>
          </View>

          {/* Save button */}
          <TouchableOpacity
            style={[s.saveBtn, !avgLat && s.saveBtnDisabled]}
            onPress={() => savePoint(null)}
            activeOpacity={0.85}
            disabled={!avgLat}
          >
            <Text style={s.saveBtnText}>
              📍 Save This Point
            </Text>
            {avgAcc != null && (
              <Text style={s.saveBtnSub}>±{avgAcc.toFixed(1)}m accuracy</Text>
            )}
          </TouchableOpacity>

          {/* Quick save buttons for common survey points */}
          <Text style={s.quickLabel}>QUICK SAVE</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.quickScroll}>
            {[
              'Gate', 'Junction', 'Main Bldg', 'New Bldg',
              'EA Tower', 'IBED', 'SR Bldg', 'Canteen',
              'Canteen 2', 'Kitchen', 'Chapel', 'CCSS',
              'Kinder', 'Parking', 'Corner NW', 'Corner NE',
              'Corner SW', 'Corner SE', 'Entrance',
            ].map(name => (
              <TouchableOpacity
                key={name}
                style={s.quickBtn}
                onPress={() => savePoint(name)}
                activeOpacity={0.75}
              >
                <Text style={s.quickBtnText}>{name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Saved points */}
          {savedPoints.length > 0 && (
            <View>
              <View style={s.savedHeader}>
                <Text style={s.savedTitle}>SAVED POINTS ({savedPoints.length})</Text>
                <View style={s.savedActions}>
                  <TouchableOpacity onPress={copyAllAsJSON} style={s.actionBtn}>
                    <Text style={s.actionBtnText}>Copy JSON</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={clearAll} style={[s.actionBtn, s.actionBtnDanger]}>
                    <Text style={[s.actionBtnText, { color: '#ff5555' }]}>Clear</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {savedPoints.map(point => (
                <View key={point.id} style={s.pointRow}>
                  <View style={s.pointInfo}>
                    <Text style={s.pointName}>{point.name}</Text>
                    <Text style={s.pointCoord}>
                      {point.lat.toFixed(7)}, {point.lng.toFixed(7)}
                    </Text>
                    <Text style={s.pointMeta}>
                      ±{point.acc?.toFixed(1)}m · {point.time}
                    </Text>
                  </View>
                  <View style={s.pointBtns}>
                    <TouchableOpacity
                      style={s.pointBtn}
                      onPress={() => copyPoint(point)}
                    >
                      <Text style={s.pointBtnText}>Copy</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[s.pointBtn, s.pointBtnDelete]}
                      onPress={() => deletePoint(point.id)}
                    >
                      <Text style={[s.pointBtnText, { color: '#ff5555' }]}>✕</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#071209' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#0d1a10',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,200,83,0.1)',
    flexWrap: 'wrap',
  },
  backBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center', justifyContent: 'center',
  },
  backText:    { fontSize: 16, color: '#fff', fontWeight: '700' },
  headerTitle: { fontSize: 15, fontWeight: '900', color: '#fff', flex: 1 },
  lockBadge: {
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 20,
  },
  lockText: { fontSize: 11, fontWeight: '800' },

  // Coordinate card
  coordCard: {
    backgroundColor: '#0d1a10',
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(0,200,83,0.2)',
    padding: 18,
    marginBottom: 12,
  },
  coordLabel: {
    fontSize: 9, fontWeight: '800',
    color: 'rgba(0,200,83,0.5)',
    letterSpacing: 1, marginBottom: 8,
  },
  coordLat: {
    fontSize: 26, fontWeight: '900',
    color: '#00C853', letterSpacing: 0.5,
    fontVariant: ['tabular-nums'],
  },
  coordLng: {
    fontSize: 26, fontWeight: '900',
    color: '#00C853', letterSpacing: 0.5,
    fontVariant: ['tabular-nums'],
    marginBottom: 12,
  },
  accRow:    { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  accDot:    { width: 8, height: 8, borderRadius: 4 },
  accText:   { fontSize: 12, fontWeight: '700' },
  avgAccText: { fontSize: 11, color: 'rgba(255,255,255,0.35)' },
  extraRow:  { flexDirection: 'row', gap: 14, marginTop: 4, flexWrap: 'wrap' },
  extraText: { fontSize: 10, color: 'rgba(255,255,255,0.35)' },

  // Accuracy guide
  guideRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  guideDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#00C853' },
  guideText: { fontSize: 11, color: 'rgba(255,255,255,0.4)' },

  // Save button
  saveBtn: {
    backgroundColor: '#00C853',
    borderRadius: radius.md,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16, marginBottom: 4,
  },
  saveBtnDisabled: { backgroundColor: 'rgba(0,200,83,0.3)' },
  saveBtnText:     { fontSize: 16, fontWeight: '900', color: '#071209' },
  saveBtnSub:      { fontSize: 11, color: 'rgba(7,18,9,0.6)', marginTop: 2 },

  // Quick save
  quickLabel: {
    fontSize: 9, fontWeight: '800',
    color: 'rgba(255,255,255,0.3)',
    letterSpacing: 1,
    marginTop: 14, marginBottom: 8,
  },
  quickScroll: { marginBottom: 20 },
  quickBtn: {
    backgroundColor: 'rgba(0,200,83,0.1)',
    borderWidth: 1, borderColor: 'rgba(0,200,83,0.25)',
    borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 8,
    marginRight: 8,
  },
  quickBtnText: { fontSize: 12, fontWeight: '700', color: '#00C853' },

  // Saved points
  savedHeader: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  savedTitle:  { fontSize: 10, fontWeight: '800', color: 'rgba(255,255,255,0.3)', letterSpacing: 1 },
  savedActions: { flexDirection: 'row', gap: 8 },
  actionBtn: {
    paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
  },
  actionBtnDanger: { borderColor: 'rgba(255,85,85,0.3)' },
  actionBtnText:   { fontSize: 11, fontWeight: '700', color: 'rgba(255,255,255,0.6)' },

  pointRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)',
    borderRadius: 10, padding: 12, marginBottom: 8,
    gap: 10,
  },
  pointInfo:  { flex: 1 },
  pointName:  { fontSize: 13, fontWeight: '800', color: '#e0e8e0' },
  pointCoord: { fontSize: 10, color: '#00C853', marginTop: 2, fontVariant: ['tabular-nums'] },
  pointMeta:  { fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 2 },
  pointBtns:  { gap: 6 },
  pointBtn: {
    paddingHorizontal: 10, paddingVertical: 5,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 8,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
  },
  pointBtnDelete: { borderColor: 'rgba(255,85,85,0.2)' },
  pointBtnText:   { fontSize: 11, fontWeight: '700', color: 'rgba(255,255,255,0.6)' },
});