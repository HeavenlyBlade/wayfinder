import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  IconSearch,
  IconCompass,
  IconSettings,
} from "../components/icons/index";
import SearchModal from "../components/SearchModal";
import BuildingIcon from "../components/BuildingIcon";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { QUICK_DESTINATIONS } from "../constants/buildings";

const GREEN  = "#00C853";
const { width: W, height: H } = Dimensions.get("window");

// ── Tutorial steps ────────────────────────────────────────────────────────────
// lang: "en" only for now — Tagalog will be added later.
// Keep messages short, 1–2 sentences max.
const TUTORIAL_STEPS = [
  {
    title: "Welcome to WAYFINDER 👋",
    message:
      "This is your campus navigation app for SACLI. Let's walk you through how it works.",
  },
  {
    title: "Search for any place 🔍",
    message:
      "Tap the search bar to find any building, office, or room on campus by name.",
  },
  {
    title: "Open Campus Map 🗺️",
    message:
      "Tap the green button to open the interactive campus map. You can see all buildings and your live location.",
  },
  {
    title: "AR Navigation 📷",
    message:
      "Once you pick a destination on the map, you can follow floating green orbs in your camera view that guide you there step by step.",
  },
  {
    title: "Voice Commands 🎤",
    message:
      "On the map screen, tap the mic button and say where you want to go. The AI understands natural speech like \u2018Take me to the registrar.\u2019",
  },
  {
    title: "Quick Destinations ⚡",
    message:
      "Use the cards below to jump straight to the most common buildings on campus with one tap.",
  },
  {
    title: "You're all set! ✅",
    message:
      "You can revisit this guide anytime from Settings. Enjoy navigating SACLI!",
  },
];

// ── Tutorial overlay ──────────────────────────────────────────────────────────
function TutorialOverlay({ onFinish }) {
  const [step, setStep] = useState(0);
  const total = TUTORIAL_STEPS.length;
  const current = TUTORIAL_STEPS[step];
  const isLast = step === total - 1;

  return (
    <Modal transparent animationType="fade" visible statusBarTranslucent>
      {/* Dark backdrop */}
      <View style={t.backdrop}>

        {/* Tooltip card — anchored near top of screen */}
        <View style={t.card}>

          {/* Step counter + skip */}
          <View style={t.cardHeader}>
            <Text style={t.stepCount}>{step + 1} of {total}</Text>
            <TouchableOpacity onPress={onFinish} hitSlop={12}>
              <Text style={t.skipText}>Skip</Text>
            </TouchableOpacity>
          </View>

          {/* Title */}
          <Text style={t.title}>{current.title}</Text>

          {/* Message */}
          <Text style={t.message}>{current.message}</Text>

          {/* Dot indicators */}
          <View style={t.dotsRow}>
            {TUTORIAL_STEPS.map((_, i) => (
              <View
                key={i}
                style={[t.dot, i === step && t.dotActive]}
              />
            ))}
          </View>

          {/* Navigation buttons */}
          <View style={t.btnRow}>
            {step > 0 ? (
              <TouchableOpacity
                style={t.btnBack}
                onPress={() => setStep(s => s - 1)}
                activeOpacity={0.7}
              >
                <Text style={t.btnBackText}>← Back</Text>
              </TouchableOpacity>
            ) : (
              <View style={{ flex: 1 }} />
            )}

            <TouchableOpacity
              style={t.btnNext}
              onPress={isLast ? onFinish : () => setStep(s => s + 1)}
              activeOpacity={0.85}
            >
              <Text style={t.btnNextText}>
                {isLast ? "Got it!" : "Next →"}
              </Text>
            </TouchableOpacity>
          </View>

        </View>

        {/* Downward arrow pointer */}
        <View style={t.arrow} />

      </View>
    </Modal>
  );
}

// ── Status chips ──────────────────────────────────────────────────────────────
const STATUS_CHIPS = [
  {
    label: "GPS Active",
    color: GREEN,
    bg: "rgba(0,200,83,0.12)",
    border: "rgba(0,200,83,0.3)",
  },
  {
    label: "AI Ready",
    color: "#8aabff",
    bg: "rgba(138,171,255,0.1)",
    border: "rgba(138,171,255,0.3)",
  },
  {
    label: "AR Standby",
    color: "#ffc107",
    bg: "rgba(255,193,7,0.1)",
    border: "rgba(255,193,7,0.3)",
  },
];

// ── Main screen ───────────────────────────────────────────────────────────────
export default function HomeScreen({ navigation }) {
  const [searchVisible,   setSearchVisible]   = useState(false);
  const [showTutorial,    setShowTutorial]    = useState(false);

  // Show tutorial only on first launch
  useEffect(() => {
    AsyncStorage.getItem("wayfinder_tutorial_done").then((val) => {
      if (val !== "true") setShowTutorial(true);
    });
  }, []);

  async function handleTutorialFinish() {
    await AsyncStorage.setItem("wayfinder_tutorial_done", "true");
    setShowTutorial(false);
  }

  return (
    <View style={s.container}>
      <StatusBar style="light" />

      {/* Tutorial overlay — shown on first launch only */}
      {showTutorial && <TutorialOverlay onFinish={handleTutorialFinish} />}

      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={s.header}>
          <View style={s.titleRow}>
            <Text style={s.appName}>WAYFINDER</Text>
            <TouchableOpacity
              style={s.settingsBtn}
              onPress={() => navigation.navigate("Settings")}
              activeOpacity={0.7}
            >
              <IconSettings size={20} color="rgba(255,255,255,0.6)" />
            </TouchableOpacity>
          </View>

          {/* Search bar */}
          <TouchableOpacity
            style={s.searchBar}
            onPress={() => setSearchVisible(true)}
            activeOpacity={0.8}
          >
            <IconSearch size={18} color="rgba(255,255,255,0.3)" />
            <Text style={s.searchPlaceholder}>Where do you want to go?</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={s.scroll}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 32 }}
        >
          {/* Status chips */}
          <View style={s.chipsRow}>
            {STATUS_CHIPS.map((chip) => (
              <View
                key={chip.label}
                style={[
                  s.chip,
                  {
                    backgroundColor: chip.bg,
                    borderColor: chip.border,
                  },
                ]}
              >
                <View style={[s.chipDot, { backgroundColor: chip.color }]} />
                <Text style={[s.chipText, { color: chip.color }]}>
                  {chip.label}
                </Text>
              </View>
            ))}
          </View>

          {/* Main navigate CTA */}
          <TouchableOpacity
            style={s.navCTA}
            onPress={() => navigation.navigate("Map")}
            activeOpacity={0.85}
          >
            <IconCompass size={32} color="#071209" />
            <View style={{ flex: 1 }}>
              <Text style={s.navCTATitle}>Open Campus Map</Text>
              <Text style={s.navCTASub}>Tap to start navigating →</Text>
            </View>
          </TouchableOpacity>

          {/* Quick destinations */}
          <Text style={s.sectionLabel}>QUICK DESTINATIONS</Text>
          <View style={s.grid}>
            {QUICK_DESTINATIONS.map((b) => (
              <TouchableOpacity
                key={b.id}
                style={s.quickCard}
                onPress={() =>
                  navigation.navigate("Map", { openBuilding: b.id })
                }
                activeOpacity={0.75}
              >
                <View
                  style={[
                    s.quickIcon,
                    { backgroundColor: b.color + "55" },
                  ]}
                >
                  <BuildingIcon iconKey={b.icon} size={20} color="#00C853" />
                </View>
                <Text style={s.quickName}>{b.name}</Text>
                <Text style={s.quickDist}>{b.dist_label ?? b.dist} away</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* SearchModal lives outside the scroll so it covers the full screen */}
      <SearchModal
        visible={searchVisible}
        onClose={() => setSearchVisible(false)}
        onSelect={(building) => {
          setSearchVisible(false);
          navigation.navigate("Map", { openBuilding: building.id });
        }}
      />
    </View>
  );
}

// ── Tutorial styles ───────────────────────────────────────────────────────────
const t = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.75)",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  card: {
    width: "100%",
    backgroundColor: "#0d1a10",
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    borderColor: "rgba(0,200,83,0.25)",
    shadowColor: GREEN,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  stepCount: {
    fontSize: 11,
    fontWeight: "700",
    color: "rgba(0,200,83,0.5)",
    letterSpacing: 0.5,
  },
  skipText: {
    fontSize: 12,
    fontWeight: "700",
    color: "rgba(255,255,255,0.3)",
  },
  title: {
    fontSize: 18,
    fontWeight: "900",
    color: "#ffffff",
    marginBottom: 10,
    lineHeight: 24,
  },
  message: {
    fontSize: 14,
    color: "rgba(255,255,255,0.65)",
    lineHeight: 22,
    marginBottom: 18,
  },
  dotsRow: {
    flexDirection: "row",
    gap: 6,
    justifyContent: "center",
    marginBottom: 18,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "rgba(0,200,83,0.2)",
  },
  dotActive: {
    backgroundColor: GREEN,
  },
  btnRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  btnBack: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
  },
  btnBackText: {
    fontSize: 13,
    fontWeight: "700",
    color: "rgba(255,255,255,0.4)",
  },
  btnNext: {
    flex: 2,
    paddingVertical: 13,
    borderRadius: 999,
    backgroundColor: GREEN,
    alignItems: "center",
  },
  btnNextText: {
    fontSize: 13,
    fontWeight: "900",
    color: "#071209",
  },
  arrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 12,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "rgba(0,200,83,0.25)",
    marginTop: -1,
  },
});

// ── Home screen styles ────────────────────────────────────────────────────────
const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#071209" },
  scroll:    { flex: 1, paddingHorizontal: 16 },

  // Header
  header: {
    backgroundColor: "#0d1a10",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,200,83,0.1)",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  appName: {
    fontSize: 22,
    fontWeight: "900",
    color: GREEN,
    letterSpacing: 3,
  },
  settingsBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.06)",
    alignItems: "center",
    justifyContent: "center",
  },

  // Search bar
  searchBar: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(0,200,83,0.2)",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: 13,
    color: "rgba(255,255,255,0.3)",
    fontWeight: "600",
  },

  // Status chips
  chipsRow: {
    flexDirection: "row",
    gap: 6,
    marginTop: 16,
    marginBottom: 14,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
  },
  chipDot: { width: 5, height: 5, borderRadius: 3 },
  chipText: { fontSize: 10, fontWeight: "800", letterSpacing: 0.3 },

  // Main CTA
  navCTA: {
    backgroundColor: GREEN,
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },
  navCTATitle: { fontSize: 15, fontWeight: "900", color: "#071209" },
  navCTASub:   { fontSize: 11, color: "rgba(7,18,9,0.6)", marginTop: 2 },

  // Section label
  sectionLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: "rgba(255,255,255,0.3)",
    letterSpacing: 1.2,
    marginBottom: 10,
  },

  // Quick destination grid
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 20,
  },
  quickCard: {
    width: "47.5%",
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
    borderRadius: 14,
    padding: 12,
  },
  quickIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  quickName: {
    fontSize: 12,
    fontWeight: "800",
    color: "#e0e8e0",
    marginBottom: 2,
  },
  quickDist: {
    fontSize: 10,
    color: "rgba(255,255,255,0.3)",
  },
});
