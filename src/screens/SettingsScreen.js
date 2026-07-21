import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useSettings } from "../context/SettingsContext";
import {
  IconArrowLeft,
  IconEye,
  IconPin,
  IconMic,
  IconGlobe,
  IconInfo,
  IconChevronRight,
} from "../components/icons/index";

const GREEN = "#00C853";

// ── Sub-components defined OUTSIDE the parent so React never remounts them ───

function SectionLabel({ label }) {
  return <Text style={s.sectionLabel}>{label}</Text>;
}

function ToggleItem({ icon, name, sub, value, onValueChange }) {
  return (
    <View style={s.item}>
      <View style={s.itemIcon}>{icon}</View>
      <View style={s.itemInfo}>
        <Text style={s.itemName}>{name}</Text>
        {sub ? <Text style={s.itemSub}>{sub}</Text> : null}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: "rgba(255,255,255,0.15)", true: GREEN }}
        thumbColor="#ffffff"
        ios_backgroundColor="rgba(255,255,255,0.15)"
      />
    </View>
  );
}

function ChevronItem({ icon, name, sub, onPress }) {
  return (
    <TouchableOpacity style={s.item} onPress={onPress} activeOpacity={0.7}>
      <View style={s.itemIcon}>{icon}</View>
      <View style={s.itemInfo}>
        <Text style={s.itemName}>{name}</Text>
        {sub ? <Text style={s.itemSub}>{sub}</Text> : null}
      </View>
      <IconChevronRight size={16} color="rgba(255,255,255,0.25)" />
    </TouchableOpacity>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

export default function SettingsScreen({ navigation }) {
  const { settings, updateSetting } = useSettings();

  return (
    <View style={s.container}>
      <StatusBar style="light" />
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={s.header}>
          <TouchableOpacity
            style={s.backBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <IconArrowLeft size={18} color="#ffffff" />
          </TouchableOpacity>
          <Text style={s.headerTitle}>Settings</Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        >
          <SectionLabel label="NAVIGATION" />
          <View style={s.group}>
            <ToggleItem
              icon={<IconEye size={18} color="rgba(255,255,255,0.5)" />}
              name="AR Mode"
              sub="Launch AR camera when navigating"
              value={settings.arMode}
              onValueChange={(val) => updateSetting("arMode", val)}
            />
            <View style={s.divider} />
            <ToggleItem
              icon={<IconPin size={18} color="rgba(255,255,255,0.5)" />}
              name="GPS Tracking"
              sub="Enable locate-me button on map"
              value={settings.gpsTracking}
              onValueChange={(val) => updateSetting("gpsTracking", val)}
            />
          </View>

          <SectionLabel label="AI ASSISTANT" />
          <View style={s.group}>
            <ToggleItem
              icon={<IconMic size={18} color="rgba(255,255,255,0.5)" />}
              name="Voice Commands"
              sub="Say where you want to go"
              value={settings.voiceCommands}
              onValueChange={(val) => updateSetting("voiceCommands", val)}
            />
            <View style={s.divider} />
            <ToggleItem
              icon={<IconGlobe size={18} color="rgba(255,255,255,0.5)" />}
              name="Offline Mode"
              sub="Use offline voice when ON, auto-detect when OFF"
              value={settings.offlineMode}
              onValueChange={(val) => updateSetting("offlineMode", val)}
            />
          </View>

          <SectionLabel label="APP" />
          <View style={s.group}>
            <ChevronItem
              icon={<IconInfo size={18} color="rgba(255,255,255,0.5)" />}
              name="About WAYFINDER"
              sub="Version 1.0.0"
              onPress={() => navigation.navigate("About")}
            />
          </View>

          <SectionLabel label="DEV TOOLS" />
          <View style={s.group}>
            <ChevronItem
              icon={<IconPin size={18} color="rgba(255,255,255,0.5)" />}
              name="GPS Survey Tool"
              sub="Record campus coordinates for campusGraph.js"
              onPress={() => navigation.navigate("Survey")}
            />
          </View>

          {/* Live status preview */}
          <SectionLabel label="CURRENT STATUS" />
          <View style={s.statusCard}>
            <StatusRow label="AR Mode"       on={settings.arMode}       />
            <View style={s.divider} />
            <StatusRow label="GPS Tracking"  on={settings.gpsTracking}  />
            <View style={s.divider} />
            <StatusRow label="Voice Commands" on={settings.voiceCommands} />
            <View style={s.divider} />
            <View style={s.statusRow}>
              <Text style={s.statusLabel}>Offline Mode</Text>
              <View style={[
                s.statusBadge,
                { backgroundColor: settings.offlineMode ? "rgba(255,193,7,0.15)" : "rgba(0,200,83,0.15)" },
              ]}>
                <Text style={[
                  s.statusValue,
                  { color: settings.offlineMode ? "#ffc107" : GREEN },
                ]}>
                  {settings.offlineMode ? "OFFLINE" : "AUTO"}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

// Small helper for the ON/OFF status rows — also outside the parent
function StatusRow({ label, on }) {
  return (
    <View style={s.statusRow}>
      <Text style={s.statusLabel}>{label}</Text>
      <View style={[
        s.statusBadge,
        { backgroundColor: on ? "rgba(0,200,83,0.15)" : "rgba(255,255,255,0.06)" },
      ]}>
        <Text style={[s.statusValue, { color: on ? GREEN : "rgba(255,255,255,0.3)" }]}>
          {on ? "ON" : "OFF"}
        </Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#071209" },

  header: {
    backgroundColor: "#0d1a10",
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,200,83,0.1)",
  },
  backBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.06)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { fontSize: 16, fontWeight: "900", color: "#ffffff" },

  sectionLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: "rgba(0,200,83,0.6)",
    letterSpacing: 1.2,
    marginTop: 20,
    marginBottom: 8,
  },

  group: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
    borderRadius: 14,
    overflow: "hidden",
  },

  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
  },
  itemIcon: { width: 24, alignItems: "center", justifyContent: "center" },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 13, fontWeight: "700", color: "#e0e8e0" },
  itemSub:  { fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 2 },

  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.05)",
    marginLeft: 52,
  },

  statusCard: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
    borderRadius: 14,
    overflow: "hidden",
    paddingHorizontal: 14,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  statusLabel: { fontSize: 13, fontWeight: "600", color: "rgba(255,255,255,0.5)" },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  statusValue: { fontSize: 11, fontWeight: "800", letterSpacing: 0.5 },
});
