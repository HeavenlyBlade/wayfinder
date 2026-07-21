import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import {
  IconArrowLeft,
  IconCompass,
  IconUser,
  IconChevronRight,
} from "../components/icons/index";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

const GREEN = "#00C853";

const TECH_STACK = [
  "React Native",
  "Expo SDK",
  "Three.js",
  "expo-gl",
  "FastAPI",
  "PostgreSQL",
  "PostGIS",
  "Whisper STT",
  "LLaMA 3.1",
  "Groq API",
  "A* Pathfinding",
];

export default function AboutScreen({ navigation }) {
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
          <Text style={s.headerTitle}>About</Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        >
          {/* App identity */}
          <View style={s.identityCard}>
            <View style={s.logoWrap}>
              <IconCompass size={30} color="#00C853" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.appName}>WAYFINDER</Text>
              <Text style={s.appVersion}>Version 1.0.0 · SACLI Campus</Text>
            </View>
          </View>

          {/* Description */}
          <View style={s.card}>
            <Text style={s.cardTitle}>ABOUT THE APP</Text>
            <Text style={s.cardText}>
              An augmented reality campus navigation system for St. Anne College
              Lucena, Inc. Designed to help students, faculty, and visitors find
              buildings, rooms, and facilities with ease using GPS, AR orb
              trails, and AI voice commands.
            </Text>
          </View>

          {/* Tech stack */}
          <View style={s.card}>
            <Text style={s.cardTitle}>TECH STACK</Text>
            <View style={s.tags}>
              {TECH_STACK.map((t) => (
                <View key={t} style={s.tag}>
                  <Text style={s.tagText}>{t}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Developer */}
          <View style={s.card}>
            <Text style={s.cardTitle}>DEVELOPER</Text>
            <View style={s.devRow}>
              <View style={s.avatar}>
                <IconUser size={20} color="#00C853" />
              </View>
              <View>
                <Text style={s.devName}>Benjamine Andrei R. Panganiban</Text>
                <Text style={s.devRole}>Developer · SACLI Thesis 2026</Text>
              </View>
            </View>
          </View>

          {/* School */}
          <View style={s.card}>
            <Text style={s.cardTitle}>INSTITUTION</Text>
            <Text style={s.cardText}>
              St. Anne College Lucena, Inc., {"\t"}
              Diversion Road, {"\t"}
              Gulang-Gulang, {"\t"}
              Lucena City, {"\t"}
              Quezon Province
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
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

  identityCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: "rgba(0,200,83,0.06)",
    borderWidth: 1,
    borderColor: "rgba(0,200,83,0.15)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  logoWrap: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: "rgba(0,200,83,0.12)",
    borderWidth: 1,
    borderColor: "rgba(0,200,83,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  appName: { fontSize: 18, fontWeight: "900", color: GREEN, letterSpacing: 2 },
  appVersion: { fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 3 },

  card: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 9,
    fontWeight: "800",
    color: "rgba(0,200,83,0.6)",
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  cardText: {
    fontSize: 13,
    color: "rgba(255,255,255,0.45)",
    lineHeight: 20,
  },

  tags: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: "rgba(0,200,83,0.1)",
    borderWidth: 1,
    borderColor: "rgba(0,200,83,0.2)",
  },
  tagText: { fontSize: 11, fontWeight: "700", color: GREEN },

  devRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,200,83,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  devName: { fontSize: 13, fontWeight: "800", color: "#e0e8e0" },
  devRole: { fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 2 },
});
