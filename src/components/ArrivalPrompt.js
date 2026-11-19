// ─────────────────────────────────────────────────────────────────────────────
// WAYFINDER — ArrivalPrompt
//
// Shows after AR arrival for buildings that have indoor direction data.
// 3-step flow:
//   Step 1 — What are you looking for? (search input + suggestions)
//   Step 2 — Which floor are you on? (floor buttons)
//   Step 3 — Directions result card
//
// Props:
//   visible        {boolean}
//   buildingId     {string}   e.g. "main_building"
//   buildingName   {string}
//   lang           {string}   "en" | "fil"
//   staircase      {string}   "staircase_1" | "staircase_2" | "any" — from StaircasePicker
//   onClose        {function}
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import * as Speech from "expo-speech";
import { t } from "../constants/i18n";
import { INDOOR_DIRECTIONS, getDirections, getRoomNames } from "../constants/indoorDirections";
import { BUILDINGS } from "../constants/buildings";

const { width: W } = Dimensions.get("window");
const GREEN = "#00C853";

// Floor options per building — derived from buildings.js floors array
function getFloorsForBuilding(buildingId) {
  const building = BUILDINGS[buildingId];
  if (!building?.floors?.length) return [];
  return building.floors.map((f) => ({
    key:   f.label.toLowerCase().replace(" ", ""),  // "gf", "1f", "2f" etc.
    label: f.level,
    short: f.label,
  }));
}

// Floor key normalizer — maps label to the key used in indoorDirections.js
function normalizeFloorKey(label) {
  const map = { GF: "gf", "1F": "1f", "2F": "2f", "3F": "3f", "4F": "4f" };
  return map[label] ?? label.toLowerCase().replace(" floor", "").replace(" ", "");
}

// ── Step 1: Room search ───────────────────────────────────────────────────────
function StepSearch({ buildingId, lang, onSelect }) {
  const [query, setQuery] = useState("");

  const allRooms = useMemo(() => getRoomNames(buildingId), [buildingId]);

  const filtered = useMemo(() => {
    if (!query.trim()) return allRooms.slice(0, 10);
    const q = query.toLowerCase();
    return allRooms.filter((r) => r.toLowerCase().includes(q)).slice(0, 12);
  }, [query, allRooms]);

  const hasData = allRooms.length > 0;

  return (
    <View style={s.stepContainer}>
      <Text style={s.stepTitle}>{t("arrival.whatLooking", lang)}</Text>

      {hasData ? (
        <>
          <TextInput
            style={s.searchInput}
            placeholder={t("arrival.searchHint", lang)}
            placeholderTextColor="rgba(255,255,255,0.3)"
            value={query}
            onChangeText={setQuery}
            autoFocus
            returnKeyType="search"
          />
          <ScrollView style={s.suggestionList} keyboardShouldPersistTaps="handled">
            {filtered.map((room) => (
              <TouchableOpacity
                key={room}
                style={s.suggestionRow}
                onPress={() => onSelect(room)}
                activeOpacity={0.7}
              >
                <Text style={s.suggestionText}>{room}</Text>
                <Text style={s.chevron}>›</Text>
              </TouchableOpacity>
            ))}
            {filtered.length === 0 && (
              <Text style={s.noResults}>{t("arrival.notFound", lang)}</Text>
            )}
          </ScrollView>
        </>
      ) : (
        <View style={s.noDataBox}>
          <Text style={s.noDataText}>{t("arrival.noData", lang)}</Text>
        </View>
      )}
    </View>
  );
}

// ── Step 2: Floor picker ──────────────────────────────────────────────────────
function StepFloor({ buildingId, roomName, lang, onSelect, onBack }) {
  const floors = useMemo(() => getFloorsForBuilding(buildingId), [buildingId]);

  // If no floor data in buildings.js, show a simple list of what we know from directions
  const fallbackFloors = useMemo(() => {
    if (floors.length) return [];
    const room = INDOOR_DIRECTIONS[buildingId]?.[roomName];
    if (!room) return [];
    return Object.keys(room).map((k) => ({ key: k, label: k.toUpperCase(), short: k.toUpperCase() }));
  }, [buildingId, roomName, floors]);

  const displayFloors = floors.length ? floors : fallbackFloors;

  return (
    <View style={s.stepContainer}>
      <Text style={s.stepTitle}>{t("arrival.whichFloor", lang)}</Text>
      <Text style={s.roomBadgeText} numberOfLines={2}>{roomName}</Text>

      <View style={s.floorGrid}>
        {displayFloors.map((fl) => {
          const key = normalizeFloorKey(fl.short);
          const hasDir = !!INDOOR_DIRECTIONS[buildingId]?.[roomName]?.[key];
          return (
            <TouchableOpacity
              key={fl.key}
              style={[s.floorBtn, !hasDir && s.floorBtnDim]}
              onPress={() => onSelect(fl.short, key)}
              activeOpacity={0.75}
            >
              <Text style={[s.floorBtnShort, !hasDir && s.floorBtnTextDim]}>{fl.short}</Text>
              <Text style={[s.floorBtnLabel, !hasDir && s.floorBtnTextDim]} numberOfLines={2}>{fl.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity style={s.backLink} onPress={onBack}>
        <Text style={s.backLinkText}>{t("arrival.back", lang)}</Text>
      </TouchableOpacity>
    </View>
  );
}

// ── Step 3: Directions result ─────────────────────────────────────────────────
function StepResult({ buildingId, roomName, floorKey, staircase, lang, onBack, onClose }) {
  const direction = getDirections(buildingId, roomName, floorKey, staircase);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Stop speech when this step unmounts (user goes back or closes)
  useEffect(() => {
    return () => { Speech.stop(); };
  }, []);

  async function handleReadAloud() {
    if (!direction) return;
    const speaking = await Speech.isSpeakingAsync();
    if (speaking) {
      Speech.stop();
      setIsSpeaking(false);
      return;
    }
    setIsSpeaking(true);
    Speech.speak(direction, {
      language: lang === "fil" ? "fil-PH" : "en-US",
      rate: 0.92,
      onDone:  () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
      onStopped: () => setIsSpeaking(false),
    });
  }

  return (
    <View style={s.stepContainer}>
      <Text style={s.stepTitle}>{t("arrival.directions", lang)}</Text>

      {/* Room + floor summary */}
      <View style={s.resultHeader}>
        <Text style={s.resultRoom} numberOfLines={2}>{roomName}</Text>
        <Text style={s.resultFloor}>{floorKey.toUpperCase()}</Text>
      </View>

      {/* Direction text */}
      <ScrollView style={s.directionScroll} showsVerticalScrollIndicator={false}>
        <Text style={s.directionText}>
          {direction ?? t("arrival.notFound", lang)}
        </Text>
      </ScrollView>

      {/* Read aloud button — hidden when no direction text */}
      {!!direction && (
        <TouchableOpacity
          style={[s.readAloudBtn, isSpeaking && s.readAloudBtnActive]}
          onPress={handleReadAloud}
          activeOpacity={0.8}
        >
          <Text style={s.readAloudBtnText}>
            {isSpeaking
              ? `🔊 ${t("arrival.stopReading", lang)}`
              : `🔊 ${t("arrival.readAloud", lang)}`}
          </Text>
        </TouchableOpacity>
      )}

      {/* Actions */}
      <View style={s.resultActions}>
        <TouchableOpacity style={s.backBtn} onPress={onBack} activeOpacity={0.7}>
          <Text style={s.backBtnText}>{t("arrival.back", lang)}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.closeBtn} onPress={onClose} activeOpacity={0.85}>
          <Text style={s.closeBtnText}>{t("arrival.close", lang)}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function ArrivalPrompt({
  visible,
  buildingId,
  buildingName,
  lang = "en",
  staircase = "staircase_1",
  onClose,
}) {
  const [step,      setStep]      = useState(1); // 1 = search, 2 = floor, 3 = result
  const [roomName,  setRoomName]  = useState(null);
  const [floorKey,  setFloorKey]  = useState(null);

  function reset() {
    setStep(1);
    setRoomName(null);
    setFloorKey(null);
  }

  function handleClose() {
    Speech.stop();
    reset();
    onClose();
  }

  function handleRoomSelect(room) {
    setRoomName(room);
    setStep(2);
  }

  function handleFloorSelect(_label, key) {
    setFloorKey(key);
    setStep(3);
  }

  return (
    <Modal
      transparent
      animationType="slide"
      visible={visible}
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={s.backdrop}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={s.sheet}>

          {/* Header bar */}
          <View style={s.sheetHeader}>
            <View style={s.dragHandle} />
            <Text style={s.buildingTag} numberOfLines={1}>
              {buildingName}
            </Text>
            <TouchableOpacity style={s.closeX} onPress={handleClose} hitSlop={12}>
              <Text style={s.closeXText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Step content */}
          {step === 1 && (
            <StepSearch
              buildingId={buildingId}
              lang={lang}
              onSelect={handleRoomSelect}
            />
          )}
          {step === 2 && (
            <StepFloor
              buildingId={buildingId}
              roomName={roomName}
              lang={lang}
              onSelect={handleFloorSelect}
              onBack={() => setStep(1)}
            />
          )}
          {step === 3 && (
            <StepResult
              buildingId={buildingId}
              roomName={roomName}
              floorKey={floorKey}
              staircase={staircase}
              lang={lang}
              onBack={() => setStep(2)}
              onClose={handleClose}
            />
          )}

        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.65)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#0d1a10",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: "rgba(0,200,83,0.2)",
    maxHeight: "88%",
    paddingBottom: 32,
  },

  // Header
  sheetHeader: {
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
    position: "relative",
  },
  dragHandle: {
    width: 40, height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.15)",
    marginBottom: 10,
  },
  buildingTag: {
    fontSize: 13, fontWeight: "800",
    color: GREEN, textAlign: "center",
  },
  closeX: {
    position: "absolute", right: 16, top: 12,
    width: 28, height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.07)",
    alignItems: "center", justifyContent: "center",
  },
  closeXText: { fontSize: 13, color: "rgba(255,255,255,0.5)", fontWeight: "700" },

  // Step container
  stepContainer: {
    paddingHorizontal: 20,
    paddingTop: 18,
    minHeight: 300,
  },
  stepTitle: {
    fontSize: 17, fontWeight: "900",
    color: "#ffffff",
    marginBottom: 14,
  },

  // Search
  searchInput: {
    backgroundColor: "rgba(255,255,255,0.07)",
    borderWidth: 1,
    borderColor: "rgba(0,200,83,0.25)",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 14,
    color: "#ffffff",
    marginBottom: 12,
  },
  suggestionList: { maxHeight: 320 },
  suggestionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 13,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },
  suggestionText: { fontSize: 13, color: "#e0e8e0", flex: 1, fontWeight: "600" },
  chevron: { fontSize: 18, color: GREEN, marginLeft: 8 },
  noResults: {
    fontSize: 13, color: "rgba(255,255,255,0.35)",
    textAlign: "center", marginTop: 24, lineHeight: 20,
  },
  noDataBox: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 14, padding: 20, marginTop: 8,
  },
  noDataText: {
    fontSize: 13, color: "rgba(255,255,255,0.4)",
    textAlign: "center", lineHeight: 20,
  },

  // Room badge on floor step
  roomBadgeText: {
    fontSize: 13, fontWeight: "700",
    color: GREEN,
    marginBottom: 18,
  },

  // Floor grid
  floorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  floorBtn: {
    width: (W - 40 - 30) / 3,
    backgroundColor: "rgba(0,200,83,0.08)",
    borderWidth: 1,
    borderColor: "rgba(0,200,83,0.25)",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    gap: 4,
  },
  floorBtnDim: {
    backgroundColor: "rgba(255,255,255,0.03)",
    borderColor: "rgba(255,255,255,0.07)",
  },
  floorBtnShort: {
    fontSize: 20, fontWeight: "900", color: GREEN,
  },
  floorBtnLabel: {
    fontSize: 9, fontWeight: "600",
    color: "rgba(0,200,83,0.6)",
    textAlign: "center",
  },
  floorBtnTextDim: { color: "rgba(255,255,255,0.2)" },

  backLink: { marginTop: 18, alignSelf: "center" },
  backLinkText: { fontSize: 12, color: "rgba(255,255,255,0.3)", fontWeight: "700" },

  // Result
  resultHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(0,200,83,0.08)",
    borderWidth: 1,
    borderColor: "rgba(0,200,83,0.2)",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 16,
    gap: 10,
  },
  resultRoom: {
    flex: 1, fontSize: 13, fontWeight: "800", color: "#ffffff",
  },
  resultFloor: {
    fontSize: 12, fontWeight: "900", color: GREEN,
    backgroundColor: "rgba(0,200,83,0.15)",
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 999,
  },
  directionScroll: { maxHeight: 220 },
  directionText: {
    fontSize: 15, color: "rgba(255,255,255,0.85)",
    lineHeight: 26, fontWeight: "500",
  },
  readAloudBtn: {
    marginTop: 14,
    paddingVertical: 11,
    paddingHorizontal: 18,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: "rgba(0,200,83,0.4)",
    backgroundColor: "rgba(0,200,83,0.08)",
    alignItems: "center",
  },
  readAloudBtnActive: {
    borderColor: "#00C853",
    backgroundColor: "rgba(0,200,83,0.2)",
  },
  readAloudBtnText: {
    fontSize: 13, fontWeight: "800", color: "#00C853",
  },
  resultActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 20,
  },
  backBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
  },
  backBtnText: { fontSize: 13, fontWeight: "700", color: "rgba(255,255,255,0.4)" },
  closeBtn: {
    flex: 2,
    paddingVertical: 13,
    borderRadius: 999,
    backgroundColor: GREEN,
    alignItems: "center",
  },
  closeBtnText: { fontSize: 13, fontWeight: "900", color: "#071209" },
});
