import "react-native-gesture-handler";
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
} from "react-native";
import {
  IconSearch,
  IconMic,
  IconMicOff,
  IconEye,
  IconLocate,
  IconLayers,
  IconArrowLeft,
} from "../components/icons/index";
import MapView, { Polygon, Marker, UrlTile } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../constants/theme";
import { BUILDINGS } from "../constants/buildings";
import StatusChips from "../components/StatusChips";
import BuildingCard from "../components/BuildingCard";
import BottomPanel from "../components/BottomPanel";
import useVoiceCommand from "../hooks/useVoiceCommand";
import SearchModal from "../components/SearchModal";
import { useSettings } from "../context/SettingsContext";
import useLocation from "../hooks/useLocation";

const { height: H } = Dimensions.get("window");

// ── Building polygon footprints ──────────────────────────────────────────────
// Replace coordinates after campus GPS survey
const BUILDING_POLYGONS = {
  main_gate: {
    buildingId: "gate",
    name: "Main Gate",
    coordinates: [
      { latitude: 13.960973, longitude: 121.611242 },
      { latitude: 13.960945, longitude: 121.611378 },
      { latitude: 13.960904, longitude: 121.611376 },
      { latitude: 13.960923, longitude: 121.611214 },
    ],
    labelCoord: { latitude: 13.960958, longitude: 121.611279 },
  },
  motor_parkinglot: {
    buildingId: "motorcycle_parking",
    name: "Motorcycle Parking Lot",
    coordinates: [
      { latitude: 13.961333, longitude: 121.611508 },
      { latitude: 13.961294, longitude: 121.611572 },
      { latitude: 13.961197, longitude: 121.611539 },
      { latitude: 13.961181, longitude: 121.611431 },
    ],
    labelCoord: { latitude: 13.961253, longitude: 121.611517 },
  },
  parking_lot: {
    buildingId: "parking_lot",
    name: "Parking Area",
    coordinates: [
      { latitude: 13.961133, longitude: 121.611678 },
      { latitude: 13.961108, longitude: 121.612531 },
      { latitude: 13.961036, longitude: 121.612508 },
      { latitude: 13.961031, longitude: 121.612394 },
      { latitude: 13.960892, longitude: 121.612375 },
      { latitude: 13.960914, longitude: 121.611722 },
    ],
    labelCoord: { latitude: 13.961022, longitude: 121.612058 },
  },
  main_building: {
    buildingId: "main_building",
    name: "Main Building",
    coordinates: [
      { latitude: 13.962275, longitude: 121.612361 },
      { latitude: 13.962236, longitude: 121.612714 },
      { latitude: 13.962069, longitude: 121.612697 },
      { latitude: 13.962075, longitude: 121.612522 },
      { latitude: 13.961722, longitude: 121.612481 },
      { latitude: 13.961739, longitude: 121.6123 },
    ],
    labelCoord: { latitude: 13.962011, longitude: 121.612419 },
  },
  new_building: {
    buildingId: "new_building",
    name: "New Building",
    coordinates: [
      { latitude: 13.961325, longitude: 121.611739 },
      { latitude: 13.961303, longitude: 121.612431 },
      { latitude: 13.961197, longitude: 121.612422 },
      { latitude: 13.961222, longitude: 121.611717 },
    ],
    labelCoord: { latitude: 13.961281, longitude: 121.612078 },
  },
  ea_tower: {
    buildingId: "ea_tower",
    name: "EA Tower Hall",
    coordinates: [
      { latitude: 13.962092, longitude: 121.612728 },
      { latitude: 13.962053, longitude: 121.612906 },
      { latitude: 13.961753, longitude: 121.612811 },
      { latitude: 13.961792, longitude: 121.612653 },
    ],
    labelCoord: { latitude: 13.961942, longitude: 121.612789 },
  },
  ibed: {
    buildingId: "ibed",
    name: "IBED Building",
    coordinates: [
      { latitude: 13.961578, longitude: 121.611967 },
      { latitude: 13.961572, longitude: 121.612086 },
      { latitude: 13.961478, longitude: 121.612083 },
      { latitude: 13.961472, longitude: 121.612356 },
      { latitude: 13.961556, longitude: 121.612369 },
      { latitude: 13.96155, longitude: 121.612453 },
      { latitude: 13.961317, longitude: 121.612447 },
      { latitude: 13.961331, longitude: 121.611961 },
    ],
    labelCoord: { latitude: 13.961389, longitude: 121.612211 },
  },
  canteen_one: {
    buildingId: "canteen",
    name: "Canteen 1",
    coordinates: [
      { latitude: 13.961622, longitude: 121.611911 },
      { latitude: 13.961528, longitude: 121.611944 },
      { latitude: 13.961331, longitude: 121.611958 },
      { latitude: 13.961339, longitude: 121.611581 },
    ],
    labelCoord: { latitude: 13.961397, longitude: 121.611861 },
  },
  kindergarten: {
    buildingId: "kindergarten",
    name: "Kindergarten Building",
    coordinates: [
      { latitude: 13.962078, longitude: 121.612144 },
      { latitude: 13.96205, longitude: 121.612256 },
      { latitude: 13.961672, longitude: 121.612122 },
      { latitude: 13.961703, longitude: 121.612008 },
    ],
    labelCoord: { latitude: 13.961817, longitude: 121.612114 },
  },
  chapel: {
    buildingId: "chapel",
    name: "Chapel",
    coordinates: [
      { latitude: 13.961694, longitude: 121.612006 },
      { latitude: 13.961672, longitude: 121.612097 },
      { latitude: 13.961633, longitude: 121.612083 },
      { latitude: 13.961633, longitude: 121.611989 },
    ],
    labelCoord: { latitude: 13.961664, longitude: 121.612053 },
  },
  kitchen_hall: {
    buildingId: "kitchen_hall",
    name: "Kitchen Hall",
    coordinates: [
      { latitude: 13.962481, longitude: 121.612853 },
      { latitude: 13.962472, longitude: 121.612969 },
      { latitude: 13.962144, longitude: 121.612936 },
      { latitude: 13.962156, longitude: 121.612822 },
    ],
    labelCoord: { latitude: 13.962342, longitude: 121.612903 },
  },
  canteen_two: {
    buildingId: "canteen_two",
    name: "Canteen 2",
    coordinates: [
      { latitude: 13.961736, longitude: 121.612842 },
      { latitude: 13.961708, longitude: 121.612911 },
      { latitude: 13.961558, longitude: 121.612836 },
      { latitude: 13.961578, longitude: 121.61275 },
    ],
    labelCoord: { latitude: 13.96165, longitude: 121.612831 },
  },
  sr_building: {
    buildingId: "sr_building",
    name: "SR Building",
    coordinates: [
      { latitude: 13.961581, longitude: 121.612667 },
      { latitude: 13.961561, longitude: 121.612783 },
      { latitude: 13.961169, longitude: 121.612678 },
      { latitude: 13.961192, longitude: 121.612569 },
    ],
    labelCoord: { latitude: 13.961367, longitude: 121.612669 },
  },
  ccss_building: {
    buildingId: "ccss",
    name: "CCSS Building",
    coordinates: [
      { latitude: 13.961031, longitude: 121.612428 },
      { latitude: 13.961028, longitude: 121.612486 },
      { latitude: 13.960922, longitude: 121.612481 },
      { latitude: 13.960928, longitude: 121.612406 },
    ],
    labelCoord: { latitude: 13.960983, longitude: 121.612456 },
  },
};

// Campus center — map opens here
const CAMPUS_CENTER = {
  latitude: 13.961706,
  longitude: 121.612236,
  latitudeDelta: 0.018,
  longitudeDelta: 0.018,
};

export default function MapScreen({ navigation, route }) {
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [selectedPolygon, setSelectedPolygon] = useState(null);
  const [panelHeight, setPanelHeight] = useState(58);
  const [searchVisible, setSearchVisible] = useState(false);

  const cardAnim = useRef(new Animated.Value(0)).current;
  const mapRef = useRef(null);

  // Settings
  const { settings } = useSettings();

  // Live GPS location (used to compute live distances in BuildingCard)
  const { location: userLocation } = useLocation();

  // Voice command hook
  const { isListening, aiReply, destId, startListening, stopListening } =
    useVoiceCommand();

  // When AI returns a destination, auto-show building card.
  // We look up the matching polygon key so the polygon also highlights.
  useEffect(() => {
    if (!destId || !BUILDINGS[destId]) return;
    const polyKey = Object.entries(BUILDING_POLYGONS).find(
      ([, p]) => p.buildingId === destId,
    )?.[0] ?? destId;
    selectBuilding(polyKey, BUILDINGS[destId]);
  }, [destId]);

  // When navigated from Home search with a building pre-selected
  useEffect(() => {
    const openId = route?.params?.openBuilding;
    if (openId && BUILDINGS[openId]) {
      setTimeout(() => selectBuilding(openId, BUILDINGS[openId]), 400);
    }
  }, [route?.params?.openBuilding]);

  function selectBuilding(polygonId, building) {
    setSelectedPolygon(polygonId);
    setSelectedBuilding(building);
    Animated.spring(cardAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 80,
      friction: 10,
    }).start();
  }

  function closeCard() {
    Animated.timing(cardAnim, {
      toValue: 0,
      duration: 180,
      useNativeDriver: true,
    }).start(() => {
      setSelectedBuilding(null);
      setSelectedPolygon(null);
    });
  }

  function startNavigation(building) {
    closeCard();
    // Respect AR Mode setting
    if (settings.arMode) {
      navigation.navigate("AR", { destinationId: building.id });
    } else {
      // AR is off — stay on map, show route in bottom panel
      setSelectedBuilding(building);
    }
  }

  function recenter() {
    if (!settings.gpsTracking) return;
    mapRef.current?.animateToRegion(CAMPUS_CENTER, 800);
  }

  function handleMicPress() {
    if (!settings.voiceCommands) return;
    isListening ? stopListening() : startListening();
  }

  return (
    <View style={s.container}>
      {/* ── Map ── */}
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFillObject}
        initialRegion={CAMPUS_CENTER}
        mapType="satellite"
        showsUserLocation={settings.gpsTracking}
        showsMyLocationButton={false}
        showsCompass={false}
        rotateEnabled={false}
        toolbarEnabled={false}
      >
        {/* OpenStreetMap tile overlay */}
        <UrlTile
          urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          maximumZ={19}
          flipY={false}
          opacity={0}
        />

        {/* Building polygons */}
        {Object.entries(BUILDING_POLYGONS).map(([id, poly]) => {
          const isSelected = selectedPolygon === id;
          return (
            <Polygon
              key={id}
              coordinates={poly.coordinates}
              strokeColor={isSelected ? "#00C853" : "rgba(0,200,83,0.8)"}
              strokeWidth={isSelected ? 3 : 1.5}
              fillColor={
                isSelected ? "rgba(0,200,83,0.35)" : "rgba(0,200,83,0.12)"
              }
              tappable={true}
              onPress={() => {
                const building = BUILDINGS[poly.buildingId];
                if (building) selectBuilding(id, building);
              }}
            />
          );
        })}

        {/* Building label markers */}
        {Object.entries(BUILDING_POLYGONS).map(([id, poly]) => (
          <Marker
            key={`label-${id}`}
            coordinate={poly.labelCoord}
            anchor={{ x: 0.5, y: 0.5 }}
            tracksViewChanges={false}
            onPress={() => {
              const building = BUILDINGS[poly.buildingId];
              if (building) selectBuilding(id, building);
            }}
          >
            <View
              style={[s.mapLabel, selectedPolygon === id && s.mapLabelSelected]}
            >
              <Text style={s.mapLabelText}>{poly.name}</Text>
            </View>
          </Marker>
        ))}
      </MapView>

      {/* ── Top overlay ── */}
      <SafeAreaView style={s.topOverlay} edges={["top"]}>
        <View style={s.searchRow}>
          {/* Back to Home */}
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

            {/* Mic button — respects voiceCommands setting */}
            <TouchableOpacity
              style={[s.micBtn, !settings.voiceCommands && s.micBtnDisabled]}
              onPress={handleMicPress}
              activeOpacity={settings.voiceCommands ? 0.8 : 1}
            >
              {isListening ? (
                <IconMicOff size={14} color="#071209" />
              ) : (
                <IconMic
                  size={14}
                  color={settings.voiceCommands ? "#071209" : "rgba(0,0,0,0.3)"}
                />
              )}
            </TouchableOpacity>
          </TouchableOpacity>
        </View>

        {/* Status chips */}
        <StatusChips arActive={settings.arMode} />

        {/* AI reply bubble */}
        {aiReply ? (
          <View style={s.aiBubble}>
            <Text style={s.aiText}>🤖 {aiReply}</Text>
          </View>
        ) : null}
      </SafeAreaView>

      {/* ── FABs — hide when panel is fully expanded ── */}
      {panelHeight < H * 0.75 && (
        <View style={[s.fabs, { bottom: panelHeight + 12 }]}>
          {/* Layers button */}
          <TouchableOpacity style={s.fab} activeOpacity={0.8}>
            <IconLayers size={20} color="#1a3a1a" />
          </TouchableOpacity>

          {/* Locate me — disabled when GPS tracking is off */}
          <TouchableOpacity
            style={[s.fab, !settings.gpsTracking && s.fabDisabled]}
            onPress={recenter}
            activeOpacity={settings.gpsTracking ? 0.8 : 1}
          >
            <IconLocate
              size={20}
              color={settings.gpsTracking ? "#1a3a1a" : "rgba(0,0,0,0.25)"}
            />
          </TouchableOpacity>

          {/* AR toggle — disabled when AR mode is off */}
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
            transform: [
              {
                translateY: cardAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [40, 0],
                }),
              },
            ],
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
        onBuildingSelect={(b) => {
          const polyId = Object.entries(BUILDING_POLYGONS).find(
            ([, p]) => p.buildingId === b.id,
          )?.[0];
          selectBuilding(polyId ?? b.id, b);
        }}
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
          const polyId = Object.entries(BUILDING_POLYGONS).find(
            ([, p]) => p.buildingId === building.id,
          )?.[0];
          selectBuilding(polyId ?? building.id, building);
        }}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#071209" },

  // Top overlay
  topOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 14,
    paddingBottom: 10,
    backgroundColor: "rgba(7,18,9,0.88)",
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  searchPill: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  searchText: {
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
    color: "rgba(0,0,0,0.45)",
  },
  micBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#00C853",
    alignItems: "center",
    justifyContent: "center",
  },
  micBtnDisabled: {
    backgroundColor: "rgba(0,200,83,0.3)",
  },
  aiBubble: {
    backgroundColor: "rgba(0,200,83,0.1)",
    borderWidth: 1,
    borderColor: "rgba(0,200,83,0.25)",
    borderRadius: 12,
    padding: 8,
    marginTop: 6,
  },
  aiText: { fontSize: 12, color: "#00C853", fontWeight: "600" },

  // Map labels
  mapLabel: {
    backgroundColor: "rgba(0,0,0,0.72)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(0,200,83,0.4)",
  },
  mapLabelSelected: {
    backgroundColor: "rgba(0,200,83,0.2)",
    borderColor: "#00C853",
  },
  mapLabelText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#ffffff",
    letterSpacing: 0.3,
  },

  // FABs
  fabs: {
    position: "absolute",
    right: 14,
    gap: 10,
  },
  fab: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "rgba(255,255,255,0.95)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  fabDisabled: {
    backgroundColor: "rgba(255,255,255,0.4)",
  },
  fabAR: {
    backgroundColor: "#00C853",
  },
  fabAROff: {
    backgroundColor: "rgba(0,200,83,0.3)",
  },
});
