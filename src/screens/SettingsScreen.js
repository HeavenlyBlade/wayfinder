import React, { useState } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, Alert, Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useSettings } from "../context/SettingsContext";
import { t } from "../constants/i18n";
import {
  IconArrowLeft, IconPin, IconInfo, IconGlobe, IconChevronRight,
} from "../components/icons/index";

const GREEN = "#00C853";

function SectionLabel({ label }) {
  return <Text style={s.sectionLabel}>{label}</Text>;
}

function ChevronItem({ icon, name, sub, onPress, rightLabel }) {
  return (
    <TouchableOpacity style={s.item} onPress={onPress} activeOpacity={0.7}>
      <View style={s.itemIcon}>{icon}</View>
      <View style={s.itemInfo}>
        <Text style={s.itemName}>{name}</Text>
        {sub ? <Text style={s.itemSub}>{sub}</Text> : null}
      </View>
      {rightLabel
        ? <Text style={s.rightLabel}>{rightLabel}</Text>
        : <IconChevronRight size={16} color="rgba(255,255,255,0.25)" />}
    </TouchableOpacity>
  );
}

function LanguagePicker({ visible, lang, onSelect, onClose }) {
  const options = [
    { code: "en",  label: "English" },
    { code: "fil", label: "Filipino" },
  ];
  return (
    <Modal transparent animationType="fade" visible={visible} statusBarTranslucent>
      <TouchableOpacity style={lp.backdrop} activeOpacity={1} onPress={onClose}>
        <View style={lp.sheet}>
          <Text style={lp.title}>{t("lang.selectTitle", lang)}</Text>
          {options.map((opt) => (
            <TouchableOpacity
              key={opt.code}
              style={[lp.option, lang === opt.code && lp.optionActive]}
              onPress={() => { onSelect(opt.code); onClose(); }}
              activeOpacity={0.75}
            >
              <Text style={[lp.optionText, lang === opt.code && lp.optionTextActive]}>
                {opt.label}
              </Text>
              {lang === opt.code && (
                <View style={lp.check}>
                  <Text style={lp.checkMark}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

export default function SettingsScreen({ navigation }) {
  const { settings, updateSetting } = useSettings();
  const lang = settings.language ?? "en";
  const [langPickerVisible, setLangPickerVisible] = useState(false);
  const langLabel = lang === "fil" ? "Filipino" : "English";

  return (
    <View style={s.container}>
      <StatusBar style="light" />
      <LanguagePicker
        visible={langPickerVisible}
        lang={lang}
        onSelect={(code) => updateSetting("language", code)}
        onClose={() => setLangPickerVisible(false)}
      />

      <SafeAreaView style={{ flex: 1 }}>
        <View style={s.header}>
          <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
            <IconArrowLeft size={18} color="#ffffff" />
          </TouchableOpacity>
          <Text style={s.headerTitle}>{t("settings.title", lang)}</Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        >
          {/* APP */}
          <SectionLabel label={t("settings.app", lang)} />
          <View style={s.group}>
            <ChevronItem
              icon={<IconGlobe size={18} color="rgba(255,255,255,0.5)" />}
              name={t("settings.language", lang)}
              sub={t("settings.language.sub", lang)}
              rightLabel={langLabel}
              onPress={() => setLangPickerVisible(true)}
            />
            <View style={s.divider} />
            <ChevronItem
              icon={<IconInfo size={18} color="rgba(255,255,255,0.5)" />}
              name={t("settings.about", lang)}
              sub={t("settings.about.sub", lang)}
              onPress={() => navigation.navigate("About")}
            />
          </View>

          {/* DEV TOOLS */}
          <SectionLabel label={t("settings.devTools", lang)} />
          <View style={s.group}>
            <ChevronItem
              icon={<IconPin size={18} color="rgba(255,255,255,0.5)" />}
              name={t("settings.surveyTool", lang)}
              sub={t("settings.surveyTool.sub", lang)}
              onPress={() => navigation.navigate("Survey")}
            />
            <View style={s.divider} />
            <ChevronItem
              icon={<IconInfo size={18} color="rgba(255,255,255,0.5)" />}
              name="Replay AR Tutorial"
              sub="Show the AR navigation guide again"
              onPress={() => {
                Alert.alert(
                  "Replay AR Tutorial",
                  "The AR navigation guide will appear next time you start navigation.",
                  [
                    { text: "Cancel", style: "cancel" },
                    {
                      text: "Reset",
                      onPress: async () => {
                        await AsyncStorage.removeItem("wayfinder_ar_tutorial_v6");
                        Alert.alert("Done", "AR tutorial will appear on your next navigation.");
                      },
                    },
                  ]
                );
              }}
            />
            <View style={s.divider} />
            <ChevronItem
              icon={<IconInfo size={18} color="rgba(255,255,255,0.5)" />}
              name={t("settings.tutorial", lang)}
              sub={t("settings.tutorial.sub", lang)}
              onPress={() => {
                Alert.alert(
                  t("settings.tutorial.title", lang),
                  t("settings.tutorial.body", lang),
                  [
                    { text: "Cancel", style: "cancel" },
                    {
                      text: t("settings.tutorial.reset", lang),
                      onPress: async () => {
                        await AsyncStorage.removeItem("wayfinder_home_tutorial_v3");
                        Alert.alert(
                          t("settings.tutorial.done", lang),
                          t("settings.tutorial.doneMsg", lang),
                        );
                      },
                    },
                  ]
                );
              }}
            />
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
    paddingHorizontal: 16, paddingVertical: 14,
    flexDirection: "row", alignItems: "center", gap: 12,
    borderBottomWidth: 1, borderBottomColor: "rgba(0,200,83,0.1)",
  },
  backBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.06)",
    alignItems: "center", justifyContent: "center",
  },
  headerTitle: { fontSize: 16, fontWeight: "900", color: "#ffffff" },
  sectionLabel: {
    fontSize: 10, fontWeight: "800",
    color: "rgba(0,200,83,0.6)", letterSpacing: 1.2,
    marginTop: 20, marginBottom: 8,
  },
  group: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1, borderColor: "rgba(255,255,255,0.07)",
    borderRadius: 14, overflow: "hidden",
  },
  item: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14 },
  itemIcon: { width: 24, alignItems: "center", justifyContent: "center" },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 13, fontWeight: "700", color: "#e0e8e0" },
  itemSub:  { fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 2 },
  rightLabel: { fontSize: 12, fontWeight: "700", color: GREEN },
  divider: { height: 1, backgroundColor: "rgba(255,255,255,0.05)", marginLeft: 52 },
});

const lp = StyleSheet.create({
  backdrop: {
    flex: 1, backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center", alignItems: "center", paddingHorizontal: 32,
  },
  sheet: {
    width: "100%", backgroundColor: "#0d1a10",
    borderRadius: 18, padding: 20,
    borderWidth: 1, borderColor: "rgba(0,200,83,0.2)",
  },
  title: { fontSize: 15, fontWeight: "900", color: "#ffffff", marginBottom: 16, textAlign: "center" },
  option: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingVertical: 14, paddingHorizontal: 12, borderRadius: 12, marginBottom: 8,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1, borderColor: "rgba(255,255,255,0.06)",
  },
  optionActive: { backgroundColor: "rgba(0,200,83,0.1)", borderColor: "rgba(0,200,83,0.3)" },
  optionText: { fontSize: 14, fontWeight: "700", color: "rgba(255,255,255,0.5)" },
  optionTextActive: { color: "#ffffff" },
  check: { width: 22, height: 22, borderRadius: 11, backgroundColor: GREEN, alignItems: "center", justifyContent: "center" },
  checkMark: { fontSize: 12, fontWeight: "900", color: "#071209" },
});
