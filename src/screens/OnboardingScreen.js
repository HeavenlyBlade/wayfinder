import React, { useRef, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Animated, Dimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Svg, { Circle, Path, Line, Rect, G } from 'react-native-svg';

const { width: W, height: H } = Dimensions.get('window');
const GREEN = '#00C853';

// ── Custom slide illustrations ──────────────────────────────────────────────

function IllustrationMap() {
  return (
    <Svg width={200} height={180} viewBox="0 0 200 180">
      {/* Map background */}
      <Rect x="20" y="20" width="160" height="140" rx="12"
        fill="rgba(0,200,83,0.08)" stroke="rgba(0,200,83,0.3)" strokeWidth="1.5"/>
      {/* Grid lines */}
      <Line x1="20" y1="65" x2="180" y2="65" stroke="rgba(0,200,83,0.15)" strokeWidth="1"/>
      <Line x1="20" y1="110" x2="180" y2="110" stroke="rgba(0,200,83,0.15)" strokeWidth="1"/>
      <Line x1="70" y1="20" x2="70" y2="160" stroke="rgba(0,200,83,0.15)" strokeWidth="1"/>
      <Line x1="130" y1="20" x2="130" y2="160" stroke="rgba(0,200,83,0.15)" strokeWidth="1"/>
      {/* Buildings */}
      <Rect x="35" y="35" width="28" height="22" rx="3"
        fill="rgba(0,200,83,0.2)" stroke={GREEN} strokeWidth="1.5"/>
      <Rect x="80" y="30" width="40" height="28" rx="3"
        fill="rgba(0,200,83,0.15)" stroke={GREEN} strokeWidth="1.5"/>
      <Rect x="140" y="38" width="24" height="20" rx="3"
        fill="rgba(0,200,83,0.2)" stroke={GREEN} strokeWidth="1.5"/>
      <Rect x="35" y="78" width="22" height="20" rx="3"
        fill="rgba(0,200,83,0.15)" stroke={GREEN} strokeWidth="1.5"/>
      <Rect x="140" y="75" width="26" height="24" rx="3"
        fill="rgba(0,200,83,0.2)" stroke={GREEN} strokeWidth="1.5"/>
      {/* Path */}
      <Path d="M63 46 L80 46 L80 90 L130 90 L130 48 L140 48"
        stroke={GREEN} strokeWidth="2.5" strokeLinecap="round"
        strokeDasharray="5,3" fill="none"/>
      {/* User dot */}
      <Circle cx="63" cy="90" r="6" fill={GREEN}/>
      <Circle cx="63" cy="90" r="11" fill="none"
        stroke={GREEN} strokeWidth="1.5" strokeOpacity="0.4"/>
      {/* Destination pin */}
      <Path d="M153 48 C153 42 147 36 153 30 C159 36 153 42 153 48z"
        fill={GREEN}/>
      <Circle cx="153" cy="36" r="3.5" fill="#071209"/>
    </Svg>
  );
}

function IllustrationAR() {
  return (
    <Svg width={200} height={180} viewBox="0 0 200 180">
      {/* Camera frame corners */}
      <Path d="M30 60 L30 30 L60 30" stroke={GREEN} strokeWidth="2.5"
        strokeLinecap="round" fill="none"/>
      <Path d="M140 30 L170 30 L170 60" stroke={GREEN} strokeWidth="2.5"
        strokeLinecap="round" fill="none"/>
      <Path d="M170 120 L170 150 L140 150" stroke={GREEN} strokeWidth="2.5"
        strokeLinecap="round" fill="none"/>
      <Path d="M60 150 L30 150 L30 120" stroke={GREEN} strokeWidth="2.5"
        strokeLinecap="round" fill="none"/>
      {/* Ground perspective lines */}
      <Line x1="100" y1="100" x2="30" y2="160"
        stroke="rgba(0,200,83,0.2)" strokeWidth="1"/>
      <Line x1="100" y1="100" x2="170" y2="160"
        stroke="rgba(0,200,83,0.2)" strokeWidth="1"/>
      {/* Orbs in perspective */}
      <Circle cx="100" cy="140" r="5"
        fill={GREEN} fillOpacity="0.9"/>
      <Circle cx="100" cy="140" r="9"
        fill="none" stroke={GREEN} strokeWidth="1" strokeOpacity="0.4"/>
      <Circle cx="100" cy="115" r="7"
        fill={GREEN} fillOpacity="0.85"/>
      <Circle cx="100" cy="115" r="12"
        fill="none" stroke={GREEN} strokeWidth="1" strokeOpacity="0.35"/>
      <Circle cx="100" cy="85" r="10"
        fill={GREEN} fillOpacity="0.8"/>
      <Circle cx="100" cy="85" r="16"
        fill="none" stroke={GREEN} strokeWidth="1.5" strokeOpacity="0.3"/>
      <Circle cx="100" cy="50" r="14"
        fill={GREEN} fillOpacity="0.6"/>
      <Circle cx="100" cy="50" r="22"
        fill="none" stroke={GREEN} strokeWidth="1.5" strokeOpacity="0.2"/>
      {/* Label */}
      <Rect x="60" y="32" width="80" height="18" rx="9"
        fill="rgba(0,200,83,0.15)" stroke={GREEN} strokeWidth="1"/>
      <Line x1="72" y1="41" x2="128" y2="41"
        stroke={GREEN} strokeWidth="1.5" strokeLinecap="round"/>
    </Svg>
  );
}

function IllustrationVoice() {
  return (
    <Svg width={200} height={180} viewBox="0 0 200 180">
      {/* Mic body */}
      <Rect x="85" y="20" width="30" height="55" rx="15"
        fill="rgba(0,200,83,0.15)" stroke={GREEN} strokeWidth="2"/>
      {/* Mic stand arc */}
      <Path d="M60 75 Q60 110 100 110 Q140 110 140 75"
        fill="none" stroke={GREEN} strokeWidth="2.5" strokeLinecap="round"/>
      {/* Mic stand line */}
      <Line x1="100" y1="110" x2="100" y2="135"
        stroke={GREEN} strokeWidth="2.5" strokeLinecap="round"/>
      {/* Base */}
      <Line x1="75" y1="135" x2="125" y2="135"
        stroke={GREEN} strokeWidth="2.5" strokeLinecap="round"/>
      {/* Sound waves left */}
      <Path d="M55 60 Q45 75 55 90"
        fill="none" stroke={GREEN} strokeWidth="2"
        strokeLinecap="round" strokeOpacity="0.7"/>
      <Path d="M42 52 Q28 75 42 98"
        fill="none" stroke={GREEN} strokeWidth="2"
        strokeLinecap="round" strokeOpacity="0.4"/>
      {/* Sound waves right */}
      <Path d="M145 60 Q155 75 145 90"
        fill="none" stroke={GREEN} strokeWidth="2"
        strokeLinecap="round" strokeOpacity="0.7"/>
      <Path d="M158 52 Q172 75 158 98"
        fill="none" stroke={GREEN} strokeWidth="2"
        strokeLinecap="round" strokeOpacity="0.4"/>
      {/* AI response bubble */}
      <Rect x="55" y="145" width="90" height="24" rx="12"
        fill="rgba(0,200,83,0.12)" stroke={GREEN} strokeWidth="1"/>
      <Line x1="68" y1="157" x2="132" y2="157"
        stroke={GREEN} strokeWidth="1.5" strokeLinecap="round"/>
    </Svg>
  );
}

// ────────────────────────────────────────────────────────────────────────────

const SLIDES = [
  {
    id: '1',
    Illustration: IllustrationMap,
    title: 'Navigate the SACLI Campus',
    desc: 'Find any building, room, or facility on campus instantly with our interactive satellite map.',
    bg: '#0d2015',
  },
  {
    id: '2',
    Illustration: IllustrationAR,
    title: 'Follow AR Orbs in Real Time',
    desc: 'Point your camera and follow glowing green orbs that guide you turn by turn to your destination.',
    bg: '#0d1a10',
  },
  {
    id: '3',
    Illustration: IllustrationVoice,
    title: 'Just Say Where to Go',
    desc: 'Tap the mic and say "Take me to the library" — AI understands you and navigates instantly.',
    bg: '#102a20',
  },
];

export default function OnboardingScreen({ onFinish }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const fadeAnim  = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  function animateTransition(callback) {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 0, duration: 150, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: -20, duration: 150, useNativeDriver: true }),
    ]).start(() => {
      callback();
      slideAnim.setValue(20);
      Animated.parallel([
        Animated.timing(fadeAnim,  { toValue: 1, duration: 250, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 250, useNativeDriver: true }),
      ]).start();
    });
  }

  function goNext() {
    if (currentIndex < SLIDES.length - 1) {
      animateTransition(() => setCurrentIndex(i => i + 1));
    } else {
      onFinish();
    }
  }

  function goBack() {
    if (currentIndex > 0) {
      animateTransition(() => setCurrentIndex(i => i - 1));
    }
  }

  const slide  = SLIDES[currentIndex];
  const isLast = currentIndex === SLIDES.length - 1;
  const { Illustration } = slide;

  return (
    <View style={s.container}>
      <StatusBar style="light" />

      {/* Illustration area */}
      <View style={[s.illustrationArea, { backgroundColor: slide.bg }]}>
        <Animated.View style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
          alignItems: 'center',
        }}>
          <Illustration />
        </Animated.View>
      </View>

      {/* Content panel */}
      <View style={s.content}>

        {/* Dots */}
        <View style={s.dots}>
          {SLIDES.map((_, i) => (
            <View key={i} style={[s.dot, i === currentIndex && s.dotActive]} />
          ))}
        </View>

        {/* Text */}
        <Animated.View style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}>
          <Text style={s.title}>{slide.title}</Text>
          <Text style={s.desc}>{slide.desc}</Text>
        </Animated.View>

        {/* Buttons */}
        <View style={s.actions}>
          <TouchableOpacity
            style={s.btnSecondary}
            onPress={currentIndex === 0 ? onFinish : goBack}
            activeOpacity={0.7}
          >
            <Text style={s.btnSecondaryText}>
              {currentIndex === 0 ? 'Skip' : 'Back'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={s.btnPrimary}
            onPress={goNext}
            activeOpacity={0.85}
          >
            <Text style={s.btnPrimaryText}>
              {isLast ? 'Get Started' : 'Next →'}
            </Text>
          </TouchableOpacity>
        </View>

      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container:         { flex: 1, backgroundColor: '#071209' },
  illustrationArea:  {
    height: H * 0.48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    backgroundColor: '#0d1a10',
    padding: 28,
    paddingTop: 24,
    justifyContent: 'space-between',
  },
  dots:      { flexDirection: 'row', gap: 6 , justifyContent: 'center'},
  dot:       { width: 7, height: 7, borderRadius: 4,
               backgroundColor: 'rgba(0,200,83,0.25)' },
  dotActive: { width: 22, backgroundColor: GREEN },
  title: {
    fontSize: 24, fontWeight: '900',
    color: '#ffffff', marginBottom: 10, lineHeight: 30,
  },
  desc: {
    fontSize: 14, color: 'rgba(255,255,255,0.45)', lineHeight: 22,
  },
  actions:         { flexDirection: 'row', gap: 10 },
  btnSecondary: {
    flex: 1, paddingVertical: 14, borderRadius: 999,
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center', justifyContent: 'center',
  },
  btnSecondaryText: { fontSize: 13, fontWeight: '700',
                      color: 'rgba(255,255,255,0.4)' },
  btnPrimary: {
    flex: 2, paddingVertical: 14, borderRadius: 999,
    backgroundColor: GREEN, alignItems: 'center', justifyContent: 'center',
  },
  btnPrimaryText: { fontSize: 13, fontWeight: '900', color: '#071209' },
});