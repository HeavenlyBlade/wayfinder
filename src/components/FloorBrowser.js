import React, { useState, useRef, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  Dimensions,
  Animated,
} from "react-native";
import { colors, radius } from "../constants/theme";

const { height: SCREEN_H } = Dimensions.get("window");
const SHEET_MAX_H = SCREEN_H * 0.82;

export default function FloorBrowser({ building, visible, onClose }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const slideY = useRef(new Animated.Value(SCREEN_H)).current;

  // Reset to first floor whenever a new building is opened
  useEffect(() => {
    if (visible) {
      setActiveIdx(0);
      Animated.spring(slideY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
    } else {
      Animated.timing(slideY, {
        toValue: SCREEN_H,
        duration: 220,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  // Guard activeIdx against buildings with fewer floors than the previous one
  useEffect(() => {
    if (building?.floors && activeIdx >= building.floors.length) {
      setActiveIdx(0);
    }
  }, [building, activeIdx]);

  if (!building) return null;

  const hasFloors = Array.isArray(building.floors) && building.floors.length > 0;
  // Safe fallback: if activeIdx is somehow stale, use floor 0
  const activeFloor = hasFloors
    ? (building.floors[activeIdx] ?? building.floors[0])
    : null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      {/* Backdrop */}
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={s.backdrop} />
      </TouchableWithoutFeedback>

      {/* Bottom sheet */}
      <Animated.View
        style={[s.sheet, { transform: [{ translateY: slideY }] }]}
      >
        {/* Drag handle */}
        <View style={s.handle} />

        {/* Header */}
        <View style={s.header}>
          <View style={{ flex: 1 }}>
            <Text style={s.buildingName} numberOfLines={1}>
              {building.name}
            </Text>
            <Text style={s.buildingSub} numberOfLines={1}>
              {building.subtitle}
            </Text>
          </View>
          <TouchableOpacity
            style={s.closeBtn}
            onPress={onClose}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={s.closeBtnText}>✕</Text>
          </TouchableOpacity>
        </View>

        {hasFloors ? (
          <>
            {/* Floor tab row */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={s.tabRow}
              style={s.tabScroll}
            >
              {building.floors.map((floor, idx) => {
                const isActive = idx === activeIdx;
                return (
                  <TouchableOpacity
                    key={floor.label}
                    style={[s.tab, isActive && s.tabActive]}
                    onPress={() => setActiveIdx(idx)}
                    activeOpacity={0.75}
                  >
                    <Text style={[s.tabLabel, isActive && s.tabLabelActive]}>
                      {floor.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Floor meta */}
            <View style={s.floorMeta}>
              <Text style={s.floorLevel}>{activeFloor.level}</Text>
              <View style={s.roomCountBadge}>
                <Text style={s.roomCountText}>
                  {activeFloor.rooms.length} room{activeFloor.rooms.length !== 1 ? "s" : ""}
                </Text>
              </View>
            </View>

            {/* Room list */}
            <ScrollView
              style={s.roomList}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 24 }}
            >
              {activeFloor.rooms.map((room, i) => (
                <View key={`${room}-${i}`} style={s.roomRow}>
                  <View style={s.roomDot} />
                  <Text style={s.roomName}>{room}</Text>
                </View>
              ))}
            </ScrollView>
          </>
        ) : (
          /* No floor data */
          <View style={s.emptyState}>
            <Text style={s.emptyIcon}>🏗️</Text>
            <Text style={s.emptyTitle}>Floor plan coming soon</Text>
            <Text style={s.emptySub}>
              We're still mapping {building.name}.{"\n"}Check back later.
            </Text>
          </View>
        )}

        {/* Close button */}
        <TouchableOpacity
          style={s.closeBarBtn}
          onPress={onClose}
          activeOpacity={0.85}
        >
          <Text style={s.closeBarBtnText}>Close</Text>
        </TouchableOpacity>
      </Animated.View>
    </Modal>
  );
}

const s = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.55)",
  },

  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: SHEET_MAX_H,
    backgroundColor: "#0d1a10",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: "rgba(0,200,83,0.15)",
    paddingBottom: 8,
  },

  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 4,
  },

  // ── Header ────────────────────────────────────────────────────────────────
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,200,83,0.1)",
  },
  buildingName: {
    fontSize: 16,
    fontWeight: "900",
    color: "#ffffff",
    marginBottom: 2,
  },
  buildingSub: {
    fontSize: 11,
    color: "rgba(255,255,255,0.35)",
    fontWeight: "600",
  },
  closeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
    marginTop: 2,
  },
  closeBtnText: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 13,
    fontWeight: "700",
  },

  // ── Floor tabs ────────────────────────────────────────────────────────────
  tabScroll: {
    flexGrow: 0,
    marginTop: 14,
  },
  tabRow: {
    paddingHorizontal: 16,
    gap: 8,
    paddingBottom: 4,
  },
  tab: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: radius.full,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  tabActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: "800",
    color: "rgba(255,255,255,0.45)",
    letterSpacing: 0.3,
  },
  tabLabelActive: {
    color: "#071209",
  },

  // ── Floor meta ────────────────────────────────────────────────────────────
  floorMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 20,
    marginTop: 16,
    marginBottom: 10,
  },
  floorLevel: {
    fontSize: 14,
    fontWeight: "800",
    color: "#ffffff",
  },
  roomCountBadge: {
    backgroundColor: "rgba(0,200,83,0.12)",
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: "rgba(0,200,83,0.2)",
  },
  roomCountText: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.primary,
  },

  // ── Room list ─────────────────────────────────────────────────────────────
  roomList: {
    flexGrow: 1,
    flexShrink: 1,
    paddingHorizontal: 20,
  },
  roomRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },
  roomDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.primary,
    flexShrink: 0,
  },
  roomName: {
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
    color: "rgba(255,255,255,0.8)",
    lineHeight: 18,
  },

  // ── Empty state ───────────────────────────────────────────────────────────
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
    paddingHorizontal: 32,
    gap: 10,
  },
  emptyIcon:  { fontSize: 44 },
  emptyTitle: { fontSize: 15, fontWeight: "800", color: "rgba(255,255,255,0.6)", textAlign: "center" },
  emptySub:   { fontSize: 12, color: "rgba(255,255,255,0.3)", textAlign: "center", lineHeight: 18 },

  // ── Bottom close bar ──────────────────────────────────────────────────────
  closeBarBtn: {
    marginHorizontal: 20,
    marginTop: 10,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 13,
    alignItems: "center",
  },
  closeBarBtnText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#071209",
  },
});
