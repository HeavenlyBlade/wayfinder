import React, { useRef, useState, useEffect, useImperativeHandle, forwardRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  PanResponder,
  Dimensions,
} from "react-native";
import { colors } from "../constants/theme";
import { BUILDING_LIST, QUICK_DESTINATIONS } from "../constants/buildings";
import BuildingIcon from "./BuildingIcon";
import { IconMap, IconNavigation, IconInfo } from "./icons/index";

const { height: H } = Dimensions.get("window");

// Three snap positions (distance from bottom of screen)
const SNAP = {
  collapsed: 58, // just the handle + peek text visible
  half: H * 0.42, // quick destinations grid visible
  full: H * 0.82, // all buildings list visible
};

const GREEN = "#00C853";

const TABS = ["EXPLORE", "ROUTE", "ABOUT"];

const BottomPanel = forwardRef(function BottomPanel({
  onBuildingSelect,
  selectedBuilding,
  onStartNav,
  onPanelChange,
}, ref) {
  const [activeTab, setActiveTab] = useState("EXPLORE");
  const [panelHeight, setPanelHeight] = useState(SNAP.collapsed);
  const animHeight = useRef(new Animated.Value(SNAP.collapsed)).current;
  const lastHeight = useRef(SNAP.collapsed);

  // Expose snapToRoute so MapScreen can open the ROUTE tab on polygon tap
  useImperativeHandle(ref, () => ({
    openRoute() {
      setActiveTab("ROUTE");
      snapTo(SNAP.half);
    },
  }));

  // Notify parent of height changes so FABs can reposition
  useEffect(() => {
    onPanelChange?.(panelHeight);
  }, [panelHeight, onPanelChange]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 5,

      onPanResponderMove: (_, g) => {
        const next = Math.max(
          SNAP.collapsed,
          Math.min(SNAP.full, lastHeight.current - g.dy),
        );
        animHeight.setValue(next);
      },

      onPanResponderRelease: (_, g) => {
        const current = lastHeight.current - g.dy;
        const velocity = -g.vy; // negative because dragging up is negative dy

        let target;
        if (velocity > 0.5) {
          // Fast swipe up → go to next snap
          if (lastHeight.current === SNAP.collapsed) target = SNAP.half;
          else target = SNAP.full;
        } else if (velocity < -0.5) {
          // Fast swipe down → go to prev snap
          if (lastHeight.current === SNAP.full) target = SNAP.half;
          else target = SNAP.collapsed;
        } else {
          // Snap to nearest
          const distances = Object.values(SNAP).map((s) => ({
            snap: s,
            dist: Math.abs(current - s),
          }));
          target = distances.reduce((a, b) => (a.dist < b.dist ? a : b)).snap;
        }

        snapTo(target);
      },
    }),
  ).current;

  function snapTo(target) {
    lastHeight.current = target;
    setPanelHeight(target);
    Animated.spring(animHeight, {
      toValue: target,
      tension: 65,
      friction: 11,
      useNativeDriver: false, // height animation can't use native driver
    }).start();
  }

  function handleTabPress(tab) {
    setActiveTab(tab);
    if (panelHeight === SNAP.collapsed) snapTo(SNAP.half);
  }

  // Expanded view shows list, half shows grid
  const isExpanded = panelHeight >= SNAP.full * 0.85;

  return (
    <Animated.View style={[s.panel, { height: animHeight }]}>
      {/* Drag handle */}
      <View {...panResponder.panHandlers} style={s.handleArea}>
        <View style={s.handle} />

        {/* Peek text — only visible when collapsed */}
        {panelHeight <= SNAP.collapsed + 10 && (
          <View style={s.peekRow}>
            <IconMap size={14} color={GREEN} />
            <Text style={s.peekText}>Swipe up for destinations</Text>
            <Text style={s.peekArrow}>↑</Text>
          </View>
        )}
      </View>

      {/* Tabs — hidden when collapsed */}
      {panelHeight > SNAP.collapsed + 10 && (
        <View style={s.tabs}>
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={s.tab}
              onPress={() => handleTabPress(tab)}
              activeOpacity={0.7}
            >
              <Text style={[s.tabText, activeTab === tab && s.tabActive]}>
                {tab}
              </Text>
              {activeTab === tab && <View style={s.tabIndicator} />}
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Content */}
      {panelHeight > SNAP.collapsed + 10 && (
        <ScrollView
          style={s.scroll}
          showsVerticalScrollIndicator={false}
          scrollEnabled={isExpanded}
          contentContainerStyle={{ paddingBottom: 30 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* EXPLORE TAB */}
          {activeTab === "EXPLORE" && (
            <View>
              <Text style={s.sectionLabel}>
                {isExpanded ? "ALL BUILDINGS" : "QUICK DESTINATIONS"}
              </Text>

              {isExpanded ? (
                // Full list view
                <View style={s.list}>
                  {BUILDING_LIST.map((b, i) => (
                    <TouchableOpacity
                      key={b.id}
                      style={[
                        s.listItem,
                        i < BUILDING_LIST.length - 1 && s.listItemBorder,
                      ]}
                      onPress={() => onBuildingSelect(b)}
                      activeOpacity={0.7}
                    >
                      <View
                        style={[
                          s.listIcon,
                          { backgroundColor: b.color + "55" },
                        ]}
                      >
                        <BuildingIcon
                          iconKey={b.icon}
                          size={16}
                          color={GREEN}
                        />
                      </View>
                      <View style={s.listInfo}>
                        <Text style={s.listName}>{b.name}</Text>
                        <Text style={s.listSub} numberOfLines={1}>
                          {b.facilities?.slice(0, 3).join(" · ")}
                        </Text>
                      </View>
                      <Text style={s.listDist}>{b.dist_label ?? b.dist ?? "—"}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                // Grid view
                <View style={s.grid}>
                  {QUICK_DESTINATIONS.map((b) => (
                    <TouchableOpacity
                      key={b.id}
                      style={s.gridCard}
                      onPress={() => onBuildingSelect(b)}
                      activeOpacity={0.75}
                    >
                      <View
                        style={[
                          s.gridIcon,
                          { backgroundColor: b.color + "55" },
                        ]}
                      >
                        <BuildingIcon
                          iconKey={b.icon}
                          size={18}
                          color={GREEN}
                        />
                      </View>
                      <Text style={s.gridName}>{b.name}</Text>
                      <Text style={s.gridDist}>{b.dist_label ?? b.dist ?? "—"}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          )}

          {/* ROUTE TAB */}
          {activeTab === "ROUTE" && (
            <View>
              {!selectedBuilding ? (
                <View style={s.empty}>
                  <IconNavigation size={32} color="rgba(255,255,255,0.1)" />
                  <Text style={s.emptyText}>Select a destination first</Text>
                  <Text style={s.emptySub}>
                    Tap a building on the map or search above
                  </Text>
                </View>
              ) : (
                <View>
                  {/* Destination row */}
                  <View style={s.destRow}>
                    <View
                      style={[
                        s.destIcon,
                        { backgroundColor: selectedBuilding.color + "55" },
                      ]}
                    >
                      <BuildingIcon
                        iconKey={selectedBuilding.icon}
                        size={20}
                        color={GREEN}
                      />
                    </View>
                    <View style={s.destInfo}>
                      <Text style={s.destName}>{selectedBuilding.name}</Text>
                      <Text style={s.destSub}>{selectedBuilding.subtitle}</Text>
                    </View>
                    <Text style={s.destDist}>
                      {selectedBuilding.dist_label ?? selectedBuilding.dist ?? "—"}
                    </Text>
                  </View>

                  {/* Direction steps */}
                  {selectedBuilding.directions?.map((d, i) => (
                    <View key={i} style={s.step}>
                      <Text style={s.stepIcon}>→</Text>
                      <Text style={s.stepText}>{d.text}</Text>
                      <Text style={s.stepDist}>{d.dist}</Text>
                    </View>
                  ))}

                  {/* Start button */}
                  <TouchableOpacity
                    style={s.startBtn}
                    onPress={() => onStartNav(selectedBuilding)}
                    activeOpacity={0.85}
                  >
                    <Text style={s.startBtnText}>▶ Start Navigation</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}

          {/* ABOUT TAB */}
          {activeTab === "ABOUT" && (
            <View>
              <Text style={[s.sectionLabel, { marginBottom: 10 }]}>
                WAYFINDER v1.0
              </Text>
              <Text style={s.aboutText}>
                AR Campus Navigation with AI Voice Assistance for St. Anne
                College Lucena, Inc.
              </Text>
              <View style={s.techRow}>
                {["React Native", "Expo", "Three.js", "FastAPI", "LLaMA 3"].map(
                  (t) => (
                    <View key={t} style={s.techTag}>
                      <Text style={s.techText}>{t}</Text>
                    </View>
                  ),
                )}
              </View>
            </View>
          )}
        </ScrollView>
      )}
    </Animated.View>
  );
});

export default BottomPanel;

const s = StyleSheet.create({
  panel: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(10,20,12,0.97)",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 1,
    borderColor: "rgba(0,200,83,0.15)",
    overflow: "hidden",
  },

  // Handle
  handleArea: {
    paddingBottom: 4,
  },
  handle: {
    width: 36,
    height: 4,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 10,
  },

  // Peek row (collapsed state)
  peekRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 8,
  },
  peekText: {
    flex: 1,
    fontSize: 12,
    fontWeight: "700",
    color: "rgba(255,255,255,0.4)",
  },
  peekArrow: { fontSize: 14, color: GREEN },

  // Tabs
  tabs: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.07)",
    paddingHorizontal: 16,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    position: "relative",
  },
  tabText: {
    fontSize: 11,
    fontWeight: "800",
    color: "rgba(255,255,255,0.3)",
    letterSpacing: 0.5,
  },
  tabActive: { color: GREEN },
  tabIndicator: {
    position: "absolute",
    bottom: 0,
    left: "15%",
    right: "15%",
    height: 2,
    backgroundColor: GREEN,
    borderRadius: 1,
  },

  // Scroll
  scroll: { flex: 1, paddingHorizontal: 16, paddingTop: 12 },

  // Section label
  sectionLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: "rgba(255,255,255,0.3)",
    letterSpacing: 1.2,
    marginBottom: 10,
  },

  // Grid (half state)
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  gridCard: {
    width: "47.5%",
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
    borderRadius: 12,
    padding: 10,
  },
  gridIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 7,
  },
  gridName: { fontSize: 11, fontWeight: "800", color: "#e0e8e0" },
  gridDist: { fontSize: 10, color: "rgba(255,255,255,0.3)", marginTop: 2 },

  // List (full state)
  list: { gap: 0 },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 11,
  },
  listItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },
  listIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  listInfo: { flex: 1 },
  listName: { fontSize: 13, fontWeight: "800", color: "#e0e8e0" },
  listSub: { fontSize: 10, color: "rgba(255,255,255,0.3)", marginTop: 2 },
  listDist: { fontSize: 12, fontWeight: "700", color: GREEN },

  // Route tab
  empty: {
    alignItems: "center",
    paddingVertical: 30,
    gap: 10,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: "800",
    color: "rgba(255,255,255,0.2)",
  },
  emptySub: {
    fontSize: 12,
    color: "rgba(255,255,255,0.15)",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  destRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.06)",
    marginBottom: 10,
  },
  destIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  destInfo: { flex: 1 },
  destName: { fontSize: 13, fontWeight: "800", color: "#e0e8e0" },
  destSub: { fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 2 },
  destDist: { fontSize: 13, fontWeight: "700", color: GREEN },
  step: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.04)",
  },
  stepIcon: { fontSize: 16, color: GREEN },
  stepText: { flex: 1, fontSize: 12, color: "rgba(255,255,255,0.5)" },
  stepDist: { fontSize: 11, color: "rgba(255,255,255,0.3)" },
  startBtn: {
    backgroundColor: GREEN,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 14,
  },
  startBtnText: { fontSize: 14, fontWeight: "900", color: "#071209" },

  // About tab
  aboutText: {
    fontSize: 12,
    color: "rgba(255,255,255,0.4)",
    lineHeight: 20,
    marginBottom: 12,
  },
  techRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  techTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: "rgba(0,200,83,0.1)",
    borderWidth: 1,
    borderColor: "rgba(0,200,83,0.2)",
  },
  techText: { fontSize: 10, fontWeight: "700", color: GREEN },
});
