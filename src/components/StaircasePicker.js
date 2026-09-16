// ─────────────────────────────────────────────────────────────────────────────
// WAYFINDER — StaircasePicker
//
// Shown after AR arrival for buildings with 2 staircases/entrances.
// Asks the user which staircase is closest before giving indoor directions.
//
// Props:
//   visible        {boolean}
//   buildingId     {string}   e.g. "main_building"
//   buildingName   {string}   e.g. "Main Building"
//   lang           {string}   "en" | "fil"
//   onSelect       {function} (staircaseKey: "staircase_1" | "staircase_2") => void
//   onDismiss      {function} called when user closes without picking
//
// Image slots:
//   Pass image URIs via stair1Image / stair2Image props once you have photos.
//   Until then, placeholder boxes with a camera icon are shown.
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { t } from "../constants/i18n";

const { width: W } = Dimensions.get("window");
const GREEN = "#00C853";

// Buildings that use "Front / 2nd Entrance" labels instead of "Staircase 1 / 2"
const ENTRANCE_LABEL_BUILDINGS = new Set([
  "main_building",
  "ea_tower",
  "sr_building",
]);

export default function StaircasePicker({
  visible,
  buildingId,
  buildingName,
  lang = "en",
  onSelect,
  onDismiss,
  stair1Image = null,
  stair2Image = null,
}) {
  const useEntranceLabels = ENTRANCE_LABEL_BUILDINGS.has(buildingId);

  const label1 = useEntranceLabels
    ? t("staircase.front", lang)
    : t("staircase.stair1", lang);

  const label2 = useEntranceLabels
    ? t("staircase.back", lang)
    : t("staircase.stair2", lang);

  return (
    <Modal
      transparent
      animationType="slide"
      visible={visible}
      statusBarTranslucent
      onRequestClose={onDismiss}
    >
      <View style={s.backdrop}>
        <View style={s.sheet}>

          {/* Header */}
          <View style={s.header}>
            <Text style={s.title}>{t("staircase.title", lang)}</Text>
            <Text style={s.sub}>{t("staircase.sub", lang)}</Text>
          </View>

          {/* Building name badge */}
          <View style={s.buildingBadge}>
            <Text style={s.buildingName} numberOfLines={1}>{buildingName}</Text>
          </View>

          {/* Staircase options */}
          <View style={s.optionsRow}>

            {/* Staircase 1 */}
            <TouchableOpacity
              style={s.option}
              onPress={() => onSelect("staircase_1")}
              activeOpacity={0.8}
            >
              <View style={s.imageSlot}>
                {stair1Image
                  ? <Image source={{ uri: stair1Image }} style={s.image} resizeMode="cover" />
                  : <View style={s.imagePlaceholder}>
                      <Text style={s.cameraIcon}>📷</Text>
                      <Text style={s.placeholderText}>Photo{"\n"}Coming Soon</Text>
                    </View>
                }
              </View>
              <View style={s.optionFooter}>
                <Text style={s.optionLabel}>{label1}</Text>
                <View style={s.selectBtn}>
                  <Text style={s.selectBtnText}>Select</Text>
                </View>
              </View>
            </TouchableOpacity>

            {/* Staircase 2 */}
            <TouchableOpacity
              style={s.option}
              onPress={() => onSelect("staircase_2")}
              activeOpacity={0.8}
            >
              <View style={s.imageSlot}>
                {stair2Image
                  ? <Image source={{ uri: stair2Image }} style={s.image} resizeMode="cover" />
                  : <View style={s.imagePlaceholder}>
                      <Text style={s.cameraIcon}>📷</Text>
                      <Text style={s.placeholderText}>Photo{"\n"}Coming Soon</Text>
                    </View>
                }
              </View>
              <View style={s.optionFooter}>
                <Text style={s.optionLabel}>{label2}</Text>
                <View style={s.selectBtn}>
                  <Text style={s.selectBtnText}>Select</Text>
                </View>
              </View>
            </TouchableOpacity>

          </View>

          {/* Dismiss */}
          <TouchableOpacity style={s.dismissBtn} onPress={onDismiss} activeOpacity={0.7}>
            <Text style={s.dismissText}>
              {lang === "fil" ? "Isara" : "Skip for now"}
            </Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
}

const CARD_W = (W - 48 - 12) / 2; // two cards side by side with gap

const s = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.75)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#0d1a10",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: "rgba(0,200,83,0.2)",
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 36,
    gap: 16,
  },

  // Header
  header: { gap: 4, alignItems: "center" },
  title: {
    fontSize: 17, fontWeight: "900",
    color: "#ffffff", textAlign: "center",
    lineHeight: 24,
  },
  sub: {
    fontSize: 12, color: "rgba(255,255,255,0.45)",
    textAlign: "center",
  },

  // Building badge
  buildingBadge: {
    alignSelf: "center",
    backgroundColor: "rgba(0,200,83,0.1)",
    borderWidth: 1,
    borderColor: "rgba(0,200,83,0.25)",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 5,
  },
  buildingName: {
    fontSize: 12, fontWeight: "800",
    color: GREEN,
  },

  // Options row
  optionsRow: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "center",
  },

  // Single option card
  option: {
    width: CARD_W,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    borderRadius: 16,
    overflow: "hidden",
  },

  // Image slot
  imageSlot: {
    width: "100%",
    height: CARD_W * 0.75,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imagePlaceholder: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.04)",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.06)",
  },
  cameraIcon:       { fontSize: 28 },
  placeholderText:  {
    fontSize: 10, color: "rgba(255,255,255,0.3)",
    textAlign: "center", lineHeight: 15,
  },

  // Option label + select button
  optionFooter: {
    padding: 12, gap: 10, alignItems: "center",
  },
  optionLabel: {
    fontSize: 13, fontWeight: "800",
    color: "#e0e8e0", textAlign: "center",
  },
  selectBtn: {
    width: "100%",
    backgroundColor: GREEN,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
  },
  selectBtnText: {
    fontSize: 12, fontWeight: "900", color: "#071209",
  },

  // Dismiss
  dismissBtn: {
    alignSelf: "center",
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  dismissText: {
    fontSize: 12, fontWeight: "700",
    color: "rgba(255,255,255,0.3)",
  },
});
