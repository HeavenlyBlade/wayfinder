import "react-native-gesture-handler";
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View, Text, TouchableOpacity, StyleSheet,
  Dimensions,
} from "react-native";
import {
  IconSearch,
  IconPin, IconLayers, IconArrowLeft,
} from "../components/icons/index";
import { SafeAreaView } from "react-native-safe-area-context";

import { BUILDINGS }    from "../constants/buildings";
import { NODES }        from "../constants/campusGraph";
import { distanceTo }   from "../utils/arMath";
import { aStar, getWaypoints, nearestNode } from "../utils/pathfinding";
import { fetchRoute }   from "../services/api";
import StatusChips      from "../components/StatusChips";
import BottomPanel      from "../components/BottomPanel";
import SearchModal      from "../components/SearchModal";
import BuildingCard     from "../components/BuildingCard";
import CampusMap        from "../components/CampusMap";
import useLocation      from "../hooks/useLocation";
import { useSettings }  from "../context/SettingsContext";
import { t } from "../constants/i18n";

const { height: H } = Dimensions.get("window");

// Campus center — used as initial map region
const CAMPUS_CENTER = {
  latitude:       13.961706,
  longitude:      121.612236,
  latitudeDelta:  0.0035,
  longitudeDelta: 0.0030,
};

// How close (metres) to destination before auto-clearing route on map
const ARRIVAL_DIST = 10;

// ── Building polygon overlay data ─────────────────────────────────────────────
// Coordinates mirror BUILDING_POLYGONS in CampusMapSVG.
// color    = fill (semi-transparent)
// stroke   = border
const BUILDING_OVERLAYS = [
  { id: 'gate',               name: 'Main Gate',
    coordinates: [{ latitude: 13.960973, longitude: 121.611242 },{ latitude: 13.960945, longitude: 121.611378 },{ latitude: 13.960904, longitude: 121.611376 },{ latitude: 13.960923, longitude: 121.611214 }] },
  { id: 'motorcycle_parking', name: 'Moto Parking',
    coordinates: [{ latitude: 13.961333, longitude: 121.611508 },{ latitude: 13.961294, longitude: 121.611572 },{ latitude: 13.961197, longitude: 121.611539 },{ latitude: 13.961181, longitude: 121.611431 }] },
  { id: 'parking_lot',        name: 'Parking Lot',
    coordinates: [{ latitude: 13.961133, longitude: 121.611678 },{ latitude: 13.961108, longitude: 121.612531 },{ latitude: 13.961036, longitude: 121.612508 },{ latitude: 13.961031, longitude: 121.612394 },{ latitude: 13.960892, longitude: 121.612375 },{ latitude: 13.960914, longitude: 121.611722 }] },
  { id: 'main_building',      name: 'Main Building',
    coordinates: [{ latitude: 13.962275, longitude: 121.612361 },{ latitude: 13.962236, longitude: 121.612714 },{ latitude: 13.962069, longitude: 121.612697 },{ latitude: 13.962075, longitude: 121.612522 },{ latitude: 13.961722, longitude: 121.612481 },{ latitude: 13.961739, longitude: 121.6123 }] },
  { id: 'new_building',       name: 'New Building',
    coordinates: [{ latitude: 13.961325, longitude: 121.611739 },{ latitude: 13.961303, longitude: 121.612431 },{ latitude: 13.961197, longitude: 121.612422 },{ latitude: 13.961222, longitude: 121.611717 }] },
  { id: 'ea_tower',           name: 'EA Tower',
    coordinates: [{ latitude: 13.962092, longitude: 121.612728 },{ latitude: 13.962053, longitude: 121.612906 },{ latitude: 13.961753, longitude: 121.612811 },{ latitude: 13.961792, longitude: 121.612653 }] },
  { id: 'ibed',               name: 'IBED',
    coordinates: [{ latitude: 13.961578, longitude: 121.611967 },{ latitude: 13.961572, longitude: 121.612086 },{ latitude: 13.961478, longitude: 121.612083 },{ latitude: 13.961472, longitude: 121.612356 },{ latitude: 13.961556, longitude: 121.612369 },{ latitude: 13.96155, longitude: 121.612453 },{ latitude: 13.961317, longitude: 121.612447 },{ latitude: 13.961331, longitude: 121.611961 }] },
  { id: 'canteen',            name: 'Canteen 1',
    coordinates: [{ latitude: 13.961622, longitude: 121.611911 },{ latitude: 13.961528, longitude: 121.611944 },{ latitude: 13.961331, longitude: 121.611958 },{ latitude: 13.961339, longitude: 121.611581 }] },
  { id: 'kindergarten',       name: 'Kindergarten',
    coordinates: [{ latitude: 13.962078, longitude: 121.612144 },{ latitude: 13.96205, longitude: 121.612256 },{ latitude: 13.961672, longitude: 121.612122 },{ latitude: 13.961703, longitude: 121.612008 }] },
  { id: 'chapel',             name: 'Chapel',
    coordinates: [{ latitude: 13.961694, longitude: 121.612006 },{ latitude: 13.961672, longitude: 121.612097 },{ latitude: 13.961633, longitude: 121.612083 },{ latitude: 13.961633, longitude: 121.611989 }] },
  { id: 'kitchen_hall',       name: 'Kitchen Hall',
    coordinates: [{ latitude: 13.962481, longitude: 121.612853 },{ latitude: 13.962472, longitude: 121.612969 },{ latitude: 13.962144, longitude: 121.612936 },{ latitude: 13.962156, longitude: 121.612822 }] },
  { id: 'canteen_two',        name: 'Canteen 2',
    coordinates: [{ latitude: 13.961736, longitude: 121.612842 },{ latitude: 13.961708, longitude: 121.612911 },{ latitude: 13.961558, longitude: 121.612836 },{ latitude: 13.961578, longitude: 121.61275 }] },
  { id: 'sr_building',        name: 'SR Building',
    coordinates: [{ latitude: 13.961581, longitude: 121.612667 },{ latitude: 13.961561, longitude: 121.612783 },{ latitude: 13.961169, longitude: 121.612678 },{ latitude: 13.961192, longitude: 121.612569 }] },
  { id: 'ccss',               name: 'CCSS',
    coordinates: [{ latitude: 13.961031, longitude: 121.612428 },{ latitude: 13.961028, longitude: 121.612486 },{ latitude: 13.960922, longitude: 121.612481 },{ latitude: 13.960928, longitude: 121.612406 }] },
  { id: 'gymnasium',          name: 'Gymnasium',
    coordinates: [
      { latitude: 13.962278, longitude: 121.612417 },
      { latitude: 13.962472, longitude: 121.612417 },
      { latitude: 13.962472, longitude: 121.612806 },
      { latitude: 13.962278, longitude: 121.612778 },
    ] },
  { id: 'engineering',        name: 'New IBED Building',
    coordinates: [
      { latitude: 13.962050, longitude: 121.612260 },
      { latitude: 13.962048, longitude: 121.612330 },
      { latitude: 13.961659, longitude: 121.612290 },
      { latitude: 13.961672, longitude: 121.612145 },
    ] },
];

import { getHardcodedRoute } from '../constants/hardcodedRoutes';

// ── Resolve route waypoints — hardcoded first, then server, then local A* ──
async function resolveRoute(userLat, userLng, destinationId) {
  // Hardcoded routes are always correct — use them first, no backend needed
  const hardcoded = getHardcodedRoute(destinationId);
  if (hardcoded) return hardcoded;

  try {
    const wps = await fetchRoute(userLat, userLng, destinationId);
    if (wps && wps.length > 0) return wps;
  } catch (_) {}

  const startNode = nearestNode(userLat, userLng);
  const pathIds   = aStar(startNode, destinationId);
  if (pathIds.length > 0) return getWaypoints(pathIds);

  const dest = NODES[destinationId];
  if (dest) return [{ lat: userLat, lng: userLng }, { lat: dest.lat, lng: dest.lng }];

  return [];
}

// ─────────────────────────────────────────────────────────────────────────────

export default function MapScreen({ navigation, route }) {
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [selectedPolygonId, setSelectedPolygonId] = useState(null);
  const [panelHeight,      setPanelHeight]      = useState(58);
  const [searchVisible,    setSearchVisible]    = useState(false);
  const [routeWaypoints,   setRouteWaypoints]   = useState(null);
  const [roomBanner,       setRoomBanner]       = useState(null); // { room, floor, floorLabel, buildingName }

  const panelRef  = useRef(null);

  const { settings }               = useSettings();
  const lang = settings?.language ?? "en";
  const { location: userLocation } = useLocation();

  // ── Building selection helpers ────────────────────────────────────────────
  const selectBuilding = useCallback((buildingId, building) => {
    setSelectedPolygonId(buildingId);
    setSelectedBuilding(building);
    // Bottom panel stays collapsed — BuildingCard handles the selection UI
  }, []);

  const closeCard = useCallback(() => {
    setSelectedBuilding(null);
    setSelectedPolygonId(null);
    setRoomBanner(null);
  }, []);

  // ── Deep-link from Home search ────────────────────────────────────────────
  useEffect(() => {
    const openId   = route?.params?.openBuilding;
    const openRoom = route?.params?.openRoom;
    if (openId && BUILDINGS[openId]) {
      setTimeout(() => {
        selectBuilding(openId, BUILDINGS[openId]);
        if (openRoom) {
          setRoomBanner({
            room:         openRoom.room,
            floor:        openRoom.floor,
            floorLabel:   openRoom.floorLabel,
            buildingName: BUILDINGS[openId].name,
          });
        }
      }, 300);
    }
  }, [route?.params?.openBuilding, route?.params?.openRoom, selectBuilding]);

  // ── Auto-clear route on arrival ───────────────────────────────────────────
  useEffect(() => {
    if (!userLocation || !selectedBuilding) return;
    const node = NODES[selectedBuilding.id];
    if (!node) return;
    const d = distanceTo(userLocation.lat, userLocation.lng, node.lat, node.lng);
    if (d < ARRIVAL_DIST) setRouteWaypoints(null);
  }, [userLocation, selectedBuilding]);

  // ── Start navigation — always launches AR ────────────────────────────────
  const startNavigation = useCallback(async (building) => {
    closeCard();
    if (userLocation) {
      const wps = await resolveRoute(userLocation.lat, userLocation.lng, building.id);
      setRouteWaypoints(wps.length > 0 ? wps : null);
    }
    navigation.navigate("AR", { destinationId: building.id });
  }, [userLocation, navigation, closeCard]);

  // Convert route waypoints for CampusMap (it accepts {lat,lng} format directly)
  const routeCoords = routeWaypoints ?? null;


  return (
    <View style={s.container}>

      {/* ── Room banner — shown when user searched for a room ── */}
      {roomBanner && (
        <View style={s.roomBanner}>
          <View style={s.roomBannerLeft}>
            <Text style={s.roomBannerTitle}>{roomBanner.room}</Text>
            <Text style={s.roomBannerSub}>
              {roomBanner.buildingName}  ·  {roomBanner.floor}
            </Text>
          </View>
          <TouchableOpacity onPress={() => setRoomBanner(null)} style={s.roomBannerClose}>
            <Text style={s.roomBannerCloseText}>✕</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ── Campus Map (SVG — no API key needed) ── */}
      <CampusMap
        style={StyleSheet.absoluteFill}
        selectedId={selectedPolygonId}
        userLocation={userLocation}
        routeWaypoints={routeWaypoints}
        onPressBuilding={(id) => {
          const building = BUILDINGS[id];
          if (building) selectBuilding(id, building);
        }}
      />

      {/* ── Top overlay ── */}
      <SafeAreaView style={s.topOverlay} edges={["top"]}>
        <View style={s.searchRow}>
          <TouchableOpacity
            style={s.backBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <IconArrowLeft size={18} color="#ffffff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={s.searchPill}
            onPress={() => setSearchVisible(true)}
            activeOpacity={0.8}
          >
            <IconSearch size={16} color="rgba(0,0,0,0.4)" />
            <Text style={s.searchText}>
              {selectedBuilding ? selectedBuilding.name : t('map.searchHint', lang)}
            </Text>
          </TouchableOpacity>
        </View>

        {/* GPS chip only — voice/AI/offline chips removed */}
        <StatusChips />
      </SafeAreaView>

      {/* ── FABs ── */}
      {panelHeight < H * 0.75 && (
        <View style={[s.fabs, { bottom: panelHeight + 12 }]}>
          {routeWaypoints && (
            <TouchableOpacity
              style={s.fab}
              onPress={() => setRouteWaypoints(null)}
              activeOpacity={0.8}
            >
              <IconLayers size={20} color="#1a3a1a" />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[s.fab, s.fabLocate]}
            onPress={() => {/* CampusMap auto-centers on GPS */}}
            activeOpacity={0.8}
          >
            <IconPin size={20} color="#071209" />
          </TouchableOpacity>
        </View>
      )}

      {/* ── BuildingCard ── */}
      {selectedBuilding && (
        <BuildingCard
          building={selectedBuilding}
          userLocation={userLocation}
          onClose={closeCard}
          onNavigate={startNavigation}
        />
      )}

      {/* ── Bottom panel ── */}
      <BottomPanel
        ref={panelRef}
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
        onSelectRoom={(roomEntry, building) => {
          setSearchVisible(false);
          setRoomBanner({
            room:         roomEntry.room,
            floor:        roomEntry.floor,
            floorLabel:   roomEntry.floorLabel,
            buildingName: roomEntry.buildingName,
          });
          selectBuilding(building.id, building);
        }}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#071209" },

  // Room search banner
  roomBanner: {
    position: "absolute",
    top: 0, left: 0, right: 0,
    zIndex: 50,
    backgroundColor: "rgba(255,193,7,0.95)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    paddingTop: 48, // below status bar
    gap: 10,
  },
  roomBannerLeft: { flex: 1 },
  roomBannerTitle: { fontSize: 13, fontWeight: "900", color: "#1a1000" },
  roomBannerSub:   { fontSize: 11, fontWeight: "600", color: "rgba(0,0,0,0.55)", marginTop: 1 },
  roomBannerClose: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.15)",
    alignItems: "center", justifyContent: "center",
  },
  roomBannerCloseText: { fontSize: 12, color: "#1a1000", fontWeight: "700" },

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

  fabs: { position: "absolute", right: 14, gap: 10 },
  fab: {
    width: 46, height: 46, borderRadius: 23,
    backgroundColor: "rgba(255,255,255,0.95)",
    alignItems: "center", justifyContent: "center",
    shadowColor: "#000", shadowOpacity: 0.3, shadowRadius: 8, elevation: 6,
  },
  fabLocate: { backgroundColor: "#00C853" },

  // Building label markers
  markerLabel: {
    backgroundColor: "rgba(0,0,0,0.65)",
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  markerLabelSel: {
    backgroundColor: "rgba(0,200,83,0.85)",
    borderColor: "#fff",
  },
  markerText: {
    fontSize: 10,
    fontWeight: "700",
    color: "rgba(255,255,255,0.9)",
  },
  markerTextSel: {
    color: "#071209",
  },

  // Route destination pin
  destPin: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#00C853",
    borderWidth: 2,
    borderColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  destPinInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#fff",
  },
});
