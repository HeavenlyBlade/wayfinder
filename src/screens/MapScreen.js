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

const { height: H } = Dimensions.get("window");

// ── Building polygon footprints ──────────────────────────────────────────────
// Replace coordinates after campus GPS survey
const BUILDING_POLYGONS = {
  gate: {
    buildingId: "gate",
    name: "Main Gate",
    coordinates: [
      { latitude: 13.960949, longitude: 121.611362 },
      { latitude: 13.960937, longitude: 121.611389 },
      { latitude: 13.960906, longitude: 121.611378 },
      { latitude: 13.960913, longitude: 121.611362 },
    ],
    labelCoord: { latitude: 13.96093, longitude: 121.611373 },
  },
  motor_parkinglot: {
    buildingId: "motorcycle_parking",
    name: "Motorcycle Parking Lot",
    coordinates: [
      { latitude: 13.961333, longitude: 121.611513 },
      { latitude: 13.960937, longitude: 121.611389 },
      { latitude: 13.960906, longitude: 121.611378 },
      { latitude: 13.960913, longitude: 121.611362 },
    ],
    labelCoord: { latitude: 13.96093, longitude: 121.611373 },
  },
  potenciano: {
    buildingId: "main_building",
    name: "Potenciano Hall",
    coordinates: [
      { latitude: 13.93255, longitude: 121.61835 },
      { latitude: 13.93255, longitude: 121.61875 },
      { latitude: 13.93235, longitude: 121.61875 },
      { latitude: 13.93235, longitude: 121.61835 },
    ],
    labelCoord: { latitude: 13.93245, longitude: 121.61855 },
  },
  academic: {
    buildingId: "new_building",
    name: "New Building",
    coordinates: [
      { latitude: 13.93275, longitude: 121.6183 },
      { latitude: 13.93275, longitude: 121.6186 },
      { latitude: 13.93258, longitude: 121.6186 },
      { latitude: 13.93258, longitude: 121.6183 },
    ],
    labelCoord: { latitude: 13.93267, longitude: 121.61845 },
  },
  ea_tower: {
    buildingId: "ea_tower",
    name: "EA Tower Hall",
    coordinates: [
      { latitude: 13.9329, longitude: 121.61865 },
      { latitude: 13.9329, longitude: 121.619 },
      { latitude: 13.93268, longitude: 121.619 },
      { latitude: 13.93268, longitude: 121.61865 },
    ],
    labelCoord: { latitude: 13.93279, longitude: 121.61882 },
  },
  ibed: {
    buildingId: "ibed",
    name: "IBED Building",
    coordinates: [
      { latitude: 13.9328, longitude: 121.6182 },
      { latitude: 13.9328, longitude: 121.61835 },
      { latitude: 13.9326, longitude: 121.61835 },
      { latitude: 13.9326, longitude: 121.6182 },
    ],
    labelCoord: { latitude: 13.9327, longitude: 121.61827 },
  },
  canteen: {
    buildingId: "canteen",
    name: "Big Canteen",
    coordinates: [
      { latitude: 13.93228, longitude: 121.61835 },
      { latitude: 13.93228, longitude: 121.6186 },
      { latitude: 13.93218, longitude: 121.6186 },
      { latitude: 13.93218, longitude: 121.61835 },
    ],
    labelCoord: { latitude: 13.93223, longitude: 121.61847 },
  },
  kitchen_hall: {
    buildingId: "kitchen_hall",
    name: "Kitchen Hall",
    coordinates: [
      { latitude: 13.9325, longitude: 121.61875 },
      { latitude: 13.9325, longitude: 121.61895 },
      { latitude: 13.93232, longitude: 121.61895 },
      { latitude: 13.93232, longitude: 121.61875 },
    ],
    labelCoord: { latitude: 13.93241, longitude: 121.61885 },
  },
  sr_building: {
    buildingId: "sr_building",
    name: "SR Building",
    coordinates: [
      { latitude: 13.93295, longitude: 121.61838 },
      { latitude: 13.93295, longitude: 121.61858 },
      { latitude: 13.9328, longitude: 121.61858 },
      { latitude: 13.9328, longitude: 121.61838 },
    ],
    labelCoord: { latitude: 13.93287, longitude: 121.61848 },
  },
};

// Campus center — map opens here
const CAMPUS_CENTER = {
  latitude: 13.93255,
  longitude: 121.61858,
  latitudeDelta: 0.0018,
  longitudeDelta: 0.0015,
};

export default function MapScreen({ navigation, route }) {
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [selectedPolygon,  setSelectedPolygon]  = useState(null);
  const [panelHeight,      setPanelHeight]      = useState(58);
  const [searchVisible,    setSearchVisible]    = useState(false);

  const cardAnim = useRef(new Animated.Value(0)).current;
  const mapRef   = useRef(null);

  // Settings
  const { settings } = useSettings();

  // Voice command hook
  const {
    isListening,
    aiReply,
    destId,
    startListening,
    stopListening,
  } = useVoiceCommand();

  // When AI returns a destination, auto-show building card
  useEffect(() => {
    if (destId && BUILDINGS[destId]) {
      selectBuilding(destId, BUILDINGS[destId]);
    }
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
                isSelected
                  ? "rgba(0,200,83,0.35)"
                  : "rgba(0,200,83,0.12)"
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
              style={[
                s.mapLabel,
                selectedPolygon === id && s.mapLabelSelected,
              ]}
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
              {selectedBuilding
                ? selectedBuilding.name
                : "Search buildings..."}
            </Text>

            {/* Mic button — respects voiceCommands setting */}
            <TouchableOpacity
              style={[
                s.micBtn,
                !settings.voiceCommands && s.micBtnDisabled,
              ]}
              onPress={handleMicPress}
              activeOpacity={settings.voiceCommands ? 0.8 : 1}
            >
              {isListening ? (
                <IconMicOff size={14} color="#071209" />
              ) : (
                <IconMic
                  size={14}
                  color={
                    settings.voiceCommands
                      ? "#071209"
                      : "rgba(0,0,0,0.3)"
                  }
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
                  inputRange:  [0, 1],
                  outputRange: [40, 0],
                }),
              },
            ],
          }}
        >
          <BuildingCard
            building={selectedBuilding}
            onClose={closeCard}
            onNavigate={startNavigation}
          />
        </Animated.View>
      )}

      {/* ── Bottom panel ── */}
      <BottomPanel
        onBuildingSelect={(b) => {
          const polyId = Object.entries(BUILDING_POLYGONS).find(
            ([, p]) => p.buildingId === b.id
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
            ([, p]) => p.buildingId === building.id
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
    top: 0, left: 0, right: 0,
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
    width: 38, height: 38,
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
    width: 28, height: 28,
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
    width: 46, height: 46,
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