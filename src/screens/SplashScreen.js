import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, Dimensions } from "react-native";
import { IconCompass } from "../components/icons/index";
import { StatusBar } from "expo-status-bar";

const { width: W, height: H } = Dimensions.get("window");

export default function SplashScreen({ onFinish }) {
  const logoScale = useRef(new Animated.Value(0.7)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const dotAnim1 = useRef(new Animated.Value(0.3)).current;
  const dotAnim2 = useRef(new Animated.Value(0.3)).current;
  const dotAnim3 = useRef(new Animated.Value(0.3)).current;
  const ringScale1 = useRef(new Animated.Value(0.8)).current;
  const ringScale2 = useRef(new Animated.Value(0.6)).current;
  const ringOpacity1 = useRef(new Animated.Value(0)).current;
  const ringOpacity2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Step 1 — rings expand from center
    Animated.parallel([
      Animated.timing(ringOpacity1, {
        toValue: 1, duration: 600, useNativeDriver: true,
      }),
      Animated.timing(ringScale1, {
        toValue: 1, duration: 600, useNativeDriver: true,
      }),
      Animated.timing(ringOpacity2, {
        toValue: 1, duration: 800, useNativeDriver: true,
      }),
      Animated.timing(ringScale2, {
        toValue: 1, duration: 800, useNativeDriver: true,
      }),
    ]).start();

    // Step 2 — logo pops in
    Animated.sequence([
      Animated.delay(300),
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1, tension: 80, friction: 7, useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1, duration: 300, useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Step 3 — text fades in
    Animated.sequence([
      Animated.delay(600),
      Animated.timing(textOpacity, {
        toValue: 1, duration: 400, useNativeDriver: true,
      }),
    ]).start();

    // Step 4 — loading dots pulse (store ref so we can stop it on unmount)
    const dotLoop = Animated.loop(
      Animated.stagger(180, [
        Animated.sequence([
          Animated.timing(dotAnim1, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.timing(dotAnim1, { toValue: 0.3, duration: 300, useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.timing(dotAnim2, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.timing(dotAnim2, { toValue: 0.3, duration: 300, useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.timing(dotAnim3, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.timing(dotAnim3, { toValue: 0.3, duration: 300, useNativeDriver: true }),
        ]),
      ]),
    );
    const dotDelayedLoop = Animated.sequence([Animated.delay(900), dotLoop]);
    dotDelayedLoop.start();

    // Step 5 — navigate after 3 seconds
    const timer = setTimeout(() => onFinish(), 3000);

    return () => {
      clearTimeout(timer);
      dotLoop.stop();
    };
  }, [onFinish]);

  return (
    <View style={s.container}>
      <StatusBar style="light" />

      {/* Background rings */}
      <Animated.View
        style={[
          s.ring,
          s.ring1,
          { opacity: ringOpacity1, transform: [{ scale: ringScale1 }] },
        ]}
      />
      <Animated.View
        style={[
          s.ring,
          s.ring2,
          { opacity: ringOpacity2, transform: [{ scale: ringScale2 }] },
        ]}
      />

      {/* Logo */}
      <Animated.View
        style={[
          s.logoWrap,
          { opacity: logoOpacity, transform: [{ scale: logoScale }] },
        ]}
      >
        <IconCompass size={44} color="#00C853" />
      </Animated.View>

      {/* Text */}
      <Animated.View style={{ opacity: textOpacity, alignItems: "center" }}>
        <Text style={s.title}>WAYFINDER</Text>
        <Text style={s.subtitle}>AR Campus Navigation</Text>
      </Animated.View>

      {/* Loading dots */}
      <Animated.View style={[s.dotsRow, { opacity: textOpacity }]}>
        <Animated.View style={[s.dot, { opacity: dotAnim1 }]} />
        <Animated.View style={[s.dot, s.dotWide, { opacity: dotAnim2 }]} />
        <Animated.View style={[s.dot, { opacity: dotAnim3 }]} />
      </Animated.View>

      {/* School name */}
      <Text style={s.school}>St. Anne College Lucena, Inc.</Text>
    </View>
  );
}

const GREEN = "#00C853";

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#071209",
    alignItems: "center",
    justifyContent: "center",
  },

  // Background decorative rings
  ring: {
    position: "absolute",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(0,200,83,0.1)",
  },
  ring1: {
    width: W * 1.1,
    height: W * 1.1,
    top: -W * 0.2,
    left: -W * 0.05,
  },
  ring2: {
    width: W * 0.8,
    height: W * 0.8,
    bottom: -W * 0.15,
    right: -W * 0.15,
  },

  // Logo box
  logoWrap: {
    width: 88,
    height: 88,
    borderRadius: 24,
    backgroundColor: "rgba(0,200,83,0.1)",
    borderWidth: 1.5,
    borderColor: "rgba(0,200,83,0.3)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },

  // Title
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: GREEN,
    letterSpacing: 6,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 11,
    fontWeight: "600",
    color: "rgba(255,255,255,0.35)",
    letterSpacing: 2.5,
    textTransform: "uppercase",
  },

  // Loading dots
  dotsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 40,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: GREEN,
  },
  dotWide: {
    width: 14,
  },

  // School name at bottom
  school: {
    position: "absolute",
    bottom: 40,
    fontSize: 10,
    color: "rgba(255,255,255,0.2)",
    letterSpacing: 0.5,
    textAlign: "center",
  },
});
