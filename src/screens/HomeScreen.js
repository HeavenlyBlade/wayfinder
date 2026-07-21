import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import {
  IconSearch,
  IconMic,
  IconCompass,
  IconSettings,
} from "../components/icons/index";
import SearchModal from "../components/SearchModal";
import BuildingIcon from "../components/BuildingIcon";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { QUICK_DESTINATIONS } from "../constants/buildings";

const GREEN = "#00C853";

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

export default function HomeScreen({ navigation }) {
  const [searchVisible, setSearchVisible] = useState(false);
  return (
    <View style={s.container}>
      <StatusBar style="light" />
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
            <View style={s.micBtn}>
              <IconMic size={14} color="#071209" />
            </View>
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
                onPress={() => navigation.navigate("Map", { openBuilding: b.id })}
                activeOpacity={0.75}
              >
                <View style={[s.quickIcon, { backgroundColor: b.color + "55" }]}>
                  <BuildingIcon iconKey={b.icon} size={20} color="#00C853" />
                </View>
                <Text style={s.quickName}>{b.name}</Text>
                <Text style={s.quickDist}>{b.dist_label ?? b.dist} away</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* SearchModal lives outside the scroll/grid so it covers the full screen */}
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

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#071209" },
  scroll: { flex: 1, paddingHorizontal: 16 },

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
  micBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: GREEN,
    alignItems: "center",
    justifyContent: "center",
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
