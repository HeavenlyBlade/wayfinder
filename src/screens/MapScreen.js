import "react-native-gesture-handler";
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View, Text, TouchableOpacity, StyleSheet,
  Dimensions, Animated,
} from "react-native";
import {
  IconSearch, IconMic, IconMicOff,
  IconEye, IconLayers, IconArrowLeft,
} from "../components/icons/index";
import { SafeAreaView } from "react-native-safe-area-context";

import CampusMapSVG     from "../components/CampusMapSVG";
import { BUILDINGS }    from "../constants/buildings";
import { NODES }        from "../constants/campusGraph";
import { distanceTo }   from "../utils/arMath";
import { aStar, getWaypoints, nearestNode } from "../utils/pathfinding";
import { fetchRoute }   from "../services/api";
import StatusChips      from "../components/StatusChips";
import BuildingCard     from "../components/BuildingCard";
import BottomPanel      from "../components/BottomPanel";
import SearchModal      from "../components/SearchModal";
import useVoiceCommand  from "../hooks/useVoiceCommand";
import useLocation      from "../hooks/useLocation";
import { useSettings }  from "../context/SettingsContext";

const { height: H } = Dimensions.get("window");

// How close (metres) to destination before auto-clearing route on map
const ARRIVAL_DIST = 10;

// ── Resolve route waypoints (server → local A* fallback) ────────────────────
async function resolveRoute(userLat, userLng, destinationId) {
  // 1. Try server
  try {
    const wps = await fetchRoute(userLat, userLng, destinationId);
    if (wps && wps.length > 0) return wps;
  } catch (_) {}

  // 2. Local A*
  const startNode = nearestNode(userLat, userLng);
  const pathIds   = aStar(startNode, destinationId);
  if (pathIds.length > 0) return getWaypoints(pathIds);

  // 3. Straight line to destination node
  const dest = NODES[destinationId];
  if (dest) return [{ lat: userLat, lng: userLng }, { lat: dest.lat, lng: dest.lng }];

  return [];
}

// ─────────────────────────────────────────────────────────────────────────────

export default function MapScreen({ navigation, route }) {
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [selectedPolygon,  setSelectedPolygon]  = useState(null);
  const [panelHeight,      setPanelHeight]      = useState(58);
  const [searchVisible,    setSearchVisible]    = useState(false);
  const [routeWaypoints,   setRouteWaypoints]   = useState(null); // drawn on SVG map

  const cardAnim = useRef(new Animated.Value(0)).current;

  const { settings }                    = useSettings();
  const { location: userLocation }      = useLocation();
  const {
    isListening, aiReply, destId,
    isOffline, startListening, stopListening,
  } = useVoiceCommand();

  // ── Building selection helpers (defined first — used by effects below) ─────
  const selectBuilding = useCallback((idOrPolyKey, building) => {
    setSelectedPolygon(idOrPolyKey);
    setSelectedBuilding(building);
    Animated.spring(cardAnim, {
      toValue: 1, useNativeDriver: true, tension: 80, friction: 10,
    }).start();
  }, [cardAnim]);

  const closeCard = useCallback(() => {
    Animated.timing(cardAnim, {
      toValue: 0, duration: 180, useNativeDriver: true,
    }).start(() => {
      setSelectedBuilding(null);
      setSelectedPolygon(null);
    });
  }, [cardAnim]);

  // ── Voice command → auto-select building ──────────────────────────────────
  useEffect(() => {
    if (!destId || !BUILDINGS[destId]) return;
    selectBuilding(destId, BUILDINGS[destId]);
  }, [destId, selectBuilding]);

  // ── Deep-link from Home search ────────────────────────────────────────────
  useEffect(() => {
    const openId = route?.params?.openBuilding;
    if (openId && BUILDINGS[openId]) {
      setTimeout(() => selectBuilding(openId, BUILDINGS[openId]), 300);
    }
  }, [route?.params?.openBuilding, selectBuilding]);

  // ── Auto-clear route on arrival ───────────────────────────────────────────
  useEffect(() => {
    if (!userLocation || !selectedBuilding) return;
    const node = NODES[selectedBuilding.id];
    if (!node) return;
    const d = distanceTo(userLocation.lat, userLocation.lng, node.lat, node.lng);
    if (d < ARRIVAL_DIST) {
      setRouteWaypoints(null);
    }
  }, [userLocation, selectedBuilding]);

  // ── Start navigation ──────────────────────────────────────────────────────
  const startNavigation = useCallback(async (building) => {
    closeCard();

    // Draw route on SVG map regardless of AR setting
    if (userLocation) {
      const wps = await resolveRoute(
        userLocation.lat, userLocation.lng, building.id,
      );
      setRouteWaypoints(wps.length > 0 ? wps : null);
    }

    if (settings.arMode) {
      navigation.navigate("AR", { destinationId: building.id });
    }
    // If AR off — user sees the route line on the SVG map
  }, [userLocation, settings.arMode, navigation, closeCard]);

  function handleMicPress() {
    if (!settings.voiceCommands) return;
    isListening ? stopListening() : startListening();
  }

  return (
    <View style={s.container}>

      {/* ── Offline SVG Campus Map ── */}
      <CampusMapSVG
        userLocation={settings.gpsTracking ? userLocation : null}
        routeWaypoints={routeWaypoints}
        selectedBuildingId={selectedPolygon}
        onBuildingPress={(buildingId) => {
          const building = BUILDINGS[buildingId];
          if (building) selectBuilding(buildingId, building);
        }}
      />

      {/* ── Top overlay ── */}
      <SafeAreaView style={s.topOverlay} edges={["top"]}>
        <View style={s.searchRow}>
          {/* Back */}
          <TouchableOpacity
            style={s.backBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <IconArrowLeft size={18} color="#ffffff" />
          </TouchableOpacity>

          {/* Search pill */}
          <TouchableOpacity
            style={s.searchPill}
            onPress={() => setSearchVisible(true)}
            activeOpacity={0.8}
          >
            <IconSearch size={16} color="rgba(0,0,0,0.4)" />
            <Text style={s.searchText}>
              {selectedBuilding ? selectedBuilding.name : "Search buildings..."}
            </Text>
            <TouchableOpacity
              style={[s.micBtn, !settings.voiceCommands && s.micBtnDisabled]}
              onPress={handleMicPress}
              activeOpacity={settings.voiceCommands ? 0.8 : 1}
            >
              {isListening
                ? <IconMicOff size={14} color="#071209" />
                : <IconMic   size={14} color={settings.voiceCommands ? "#071209" : "rgba(0,0,0,0.3)"} />}
            </TouchableOpacity>
          </TouchableOpacity>
        </View>

        {/* Status chips */}
        <StatusChips 
          arActive={settings.arMode} 
          isOffline={isOffline} 
          offlineModeEnabled={settings.offlineMode}
        />

        {/* AI / voice reply bubble */}
        {aiReply ? (
          <View style={s.aiBubble}>
            <Text style={s.aiText}>
              {isOffline ? "📵" : "🤖"} {aiReply}
            </Text>
          </View>
        ) : null}
      </SafeAreaView>

      {/* ── FABs ── */}
      {panelHeight < H * 0.75 && (
        <View style={[s.fabs, { bottom: panelHeight + 12 }]}>
          {/* Clear route */}
          {routeWaypoints && (
            <TouchableOpacity
              style={s.fab}
              onPress={() => setRouteWaypoints(null)}
              activeOpacity={0.8}
            >
              <IconLayers size={20} color="#1a3a1a" />
            </TouchableOpacity>
          )}

          {/* AR toggle */}
          <TouchableOpacity
            style={[s.fab, s.fabAR, !settings.arMode && s.fabAROff]}
            onPress={() => {
              if (!settings.arMode) return;
              navigation.navigate("AR", {
                destinationId: selectedBuilding?.id ?? "main_building",
              });
            }}
            activeOpacity={settings.arMode ? 0.8 : 1}
          >
            <IconEye
              size={20}
              color={settings.arMode ? "#071209" : "rgba(255,255,255,0.4)"}
            />
          </TouchableOpacity>
        </View>
      )}

      {/* ── Building card ── */}
      {selectedBuilding && (
        <Animated.View
          style={{
            opacity: cardAnim,
            transform: [{
              translateY: cardAnim.interpolate({
                inputRange: [0, 1], outputRange: [40, 0],
              }),
            }],
          }}
        >
          <BuildingCard
            building={selectedBuilding}
            userLocation={userLocation}
            onClose={closeCard}
            onNavigate={startNavigation}
          />
        </Animated.View>
      )}

      {/* ── Bottom panel ── */}
      <BottomPanel
        onBuildingSelect={(b) => selectBuilding(b.id, b)}
        selectedBuilding={selectedBuilding}
        onStartNav={startNavigation}
        onPanelChange={setPanelHeight}
      />

      {/* ── Search modal ── */}
      <SearchModal
        visible={searchVisible}
        onClose={() => setSearchVisible(false)}
        onSelect={(building) => {
          setSearchVisible(false);
          selectBuilding(building.id, building);
        }}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#071209" },

  topOverlay: {
    position: "absolute",
    top: 0, left: 0, right: 0,
    paddingHorizontal: 14,
    paddingBottom: 10,
    backgroundColor: "rgba(7,18,9,0.88)",
  },
  searchRow: {
    flexDirection: "row", alignItems: "center",
    gap: 8, marginBottom: 8,
  },
  backBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center", justifyContent: "center",
    flexShrink: 0,
  },
  searchPill: {
    flex: 1, flexDirection: "row", alignItems: "center", gap: 8,
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 999, paddingHorizontal: 12, paddingVertical: 9,
  },
  searchText: {
    flex: 1, fontSize: 13, fontWeight: "600", color: "rgba(0,0,0,0.45)",
  },
  micBtn: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: "#00C853",
    alignItems: "center", justifyContent: "center",
  },
  micBtnDisabled: { backgroundColor: "rgba(0,200,83,0.3)" },

  aiBubble: {
    backgroundColor: "rgba(0,200,83,0.1)",
    borderWidth: 1, borderColor: "rgba(0,200,83,0.25)",
    borderRadius: 12, padding: 8, marginTop: 6,
  },
  aiText: { fontSize: 12, color: "#00C853", fontWeight: "600" },

  fabs: { position: "absolute", right: 14, gap: 10 },
  fab: {
    width: 46, height: 46, borderRadius: 23,
    backgroundColor: "rgba(255,255,255,0.95)",
    alignItems: "center", justifyContent: "center",
    shadowColor: "#000", shadowOpacity: 0.3, shadowRadius: 8, elevation: 6,
  },
  fabAR:  { backgroundColor: "#00C853" },
  fabAROff: { backgroundColor: "rgba(0,200,83,0.3)" },
});
