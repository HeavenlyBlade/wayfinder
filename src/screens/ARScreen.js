import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Platform,
} from "react-native";
import { useCameraPermissions } from "expo-camera";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import useLocation from "../hooks/useLocation";
import { setCompassOffset, getCompassOffset } from "../hooks/useLocation";
import { bearingTo, distanceTo } from "../utils/arMath";
import { aStar, getWaypoints, nearestNode } from "../utils/pathfinding";
import { getIndoorStatus, TWO_STAIRCASE_BUILDINGS } from "../utils/indoorDetection";
import { NODES } from "../constants/campusGraph";
import { BUILDINGS } from "../constants/buildings";
import { IconArrowLeft } from "../components/icons/index";
import { useSettings } from "../context/SettingsContext";
import { t } from "../constants/i18n";
import StaircasePicker from "../components/StaircasePicker";
import ArrivalPrompt from "../components/ArrivalPrompt";
import BearingHUD from "../components/BearingHUD";
import CompassCalibrator from "../components/CompassCalibrator";
import ARTutorial from "../components/ARTutorial";
import ViroARNavScene from "../components/ViroARNavScene";
import StatusChips from "../components/StatusChips";

const { width: W, height: H } = Dimensions.get("window");
const GREEN      = "#00C853";

const ORB_SPACING_METRES = 6;
const ORB_ADVANCE_DIST   = 4;
const ARRIVAL_DIST        = 20;  // 20m — accounts for GPS inaccuracy near buildings
const ARRIVAL_CONFIRMATIONS = 3;  // 3 consecutive readings — reduces false positives from GPS jumps
const GPS_ACCURACY_FILTER  = 25;  // ignore readings worse than 25m accuracy
const APPROACHING_DIST      = 40;  // 40m — show "Almost there" approaching chip
const PREBEND_WARN_DIST     = 15;  // 15m — warn before sharp direction change

// ── Waypoint interpolation ────────────────────────────────────────────────────
function interpolateSegment(a, b, spacingM) {
  const total = distanceTo(a.lat, a.lng, b.lat, b.lng);
  const steps = Math.max(1, Math.floor(total / spacingM));
  const pts   = [];
  for (let i = 1; i <= steps; i++) {
    const ratio = i / steps;
    pts.push({
      lat: a.lat + (b.lat - a.lat) * ratio,
      lng: a.lng + (b.lng - a.lng) * ratio,
    });
  }
  return pts;
}

function buildOrbTrail(waypoints) {
  const orbs = [];
  for (let i = 0; i < waypoints.length - 1; i++) {
    orbs.push(...interpolateSegment(waypoints[i], waypoints[i + 1], ORB_SPACING_METRES));
  }
  if (waypoints.length > 0) {
    const last = waypoints[waypoints.length - 1];
    orbs.push({ lat: last.lat, lng: last.lng, isDestination: true });
  }
  return orbs;
}

const NO_INDOOR_PROMPT = new Set([
  "gate", "motorcycle_parking", "parking_lot",
  "main_building_2", "ea_tower_2", "sr_building_2",
]);

// ── Main screen ───────────────────────────────────────────────────────────────
export default function ARScreen({ route, navigation }) {
  const { destinationId = "main_building" } = route.params ?? {};
  const { settings } = useSettings();
  const lang = settings?.language ?? "en";

  const [permission, requestPermission] = useCameraPermissions();
  const { location, heading, error: locError, gpsReady, gpsWarning, gpsQuality } = useLocation();

  const [distToNext,             setDistToNext]             = useState(null);
  const [totalDist,              setTotalDist]              = useState(null);
  const [orbVersion,             setOrbVersion]             = useState(0);
  const [arrived,                setArrived]                = useState(false);
  const [routeReady,             setRouteReady]             = useState(false);
  const [nextAngle,              setNextAngle]              = useState(0);
  const [indoorStatus,           setIndoorStatus]           = useState(null);
  const [compassOffset,          setCompassOffsetState]     = useState(getCompassOffset());
  const [staircasePickerVisible, setStaircasePickerVisible] = useState(false);
  const [selectedStaircase,      setSelectedStaircase]      = useState(null);
  const [arrivalPromptVisible,   setArrivalPromptVisible]   = useState(false);
  const [isApproaching,          setIsApproaching]          = useState(false);
  const [isPreBend,              setIsPreBend]              = useState(false);
  const [gpsWarnDismissed,       setGpsWarnDismissed]       = useState(false);
  // Track whether user was already at destination when navigation started
  const startedAtDestRef = useRef(false);

  const orbTrailRef     = useRef([]);
  const waypointsRef    = useRef([]);
  const routeLoadedRef  = useRef(false);
  const arrivedRef      = useRef(false);
  const arrivalCountRef = useRef(0);
  const isReroutingRef  = useRef(false);

  function handleOffsetChange(newOffset) {
    setCompassOffset(newOffset);
    setCompassOffsetState(newOffset);
  }

  // ── Reset on new destination ──────────────────────────────────────────────
  useEffect(() => {
    orbTrailRef.current     = [];
    waypointsRef.current    = [];
    routeLoadedRef.current  = false;
    arrivedRef.current      = false;
    arrivalCountRef.current = 0;
    isReroutingRef.current  = false;
    startedAtDestRef.current = false;
    setRouteReady(false);
    setArrived(false);
    setDistToNext(null);
    setTotalDist(null);
    setNextAngle(0);
    setStaircasePickerVisible(false);
    setArrivalPromptVisible(false);
    setSelectedStaircase(null);
    setIsApproaching(false);
  }, [destinationId]);

  // ── Load route ────────────────────────────────────────────────────────────
  const loadRoute = useCallback(async (loc) => {
    if (routeLoadedRef.current) return;
    routeLoadedRef.current = true;
    let waypoints = [];

    const startNode = nearestNode(loc.lat, loc.lng);
    const pathIds   = aStar(startNode, destinationId);
    waypoints       = pathIds.length > 0 ? getWaypoints(pathIds) : [];

    if (!waypoints || waypoints.length === 0) {
      const dest = NODES[destinationId];
      waypoints = dest
        ? [{ lat: loc.lat, lng: loc.lng }, { lat: dest.lat, lng: dest.lng }]
        : [];
    }

    // ── Trim route to start from nearest waypoint to user ──────────────────
    // Finds the closest waypoint and starts from there — handles users already
    // inside campus, in a building, or anywhere along the route.
    if (waypoints.length > 1) {
      let nearestIdx = 0;
      let nearestDist = Infinity;
      for (let i = 0; i < waypoints.length - 1; i++) {
        const d = distanceTo(loc.lat, loc.lng, waypoints[i].lat, waypoints[i].lng);
        if (d < nearestDist) { nearestDist = d; nearestIdx = i; }
      }
      // Trim to nearest waypoint — no distance threshold.
      // If nearest is the gate (index 0) that's fine — user starts from gate.
      // If nearest is an interior node that's fine too — user starts from there.
      if (nearestIdx > 0) {
        waypoints = waypoints.slice(nearestIdx);
      }
    }

    orbTrailRef.current  = buildOrbTrail(waypoints);
    waypointsRef.current = waypoints;

    // Check if user started navigation already at/near the destination
    const dest = NODES[destinationId];
    if (dest) {
      const dToDest = distanceTo(loc.lat, loc.lng, dest.lat, dest.lng);
      startedAtDestRef.current = dToDest < ARRIVAL_DIST * 2; // within 40m = already there
    }

    let total = 0;
    for (let i = 0; i < waypoints.length - 1; i++) {
      total += distanceTo(
        waypoints[i].lat, waypoints[i].lng,
        waypoints[i + 1].lat, waypoints[i + 1].lng,
      );
    }
    setTotalDist(Math.round(total));
    setRouteReady(true);
  }, [destinationId]);

  useEffect(() => {
    if (location && !routeLoadedRef.current) loadRoute(location);
  }, [location, loadRoute]);

  // ── Indoor detection ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!location) return;
    setIndoorStatus(getIndoorStatus(location.lat, location.lng));
  }, [location]);

  // ── Re-route if off-path ──────────────────────────────────────────────────
  useEffect(() => {
    if (!location || !routeReady || arrivedRef.current) return;
    if (orbTrailRef.current.length === 0) return;
    const next    = orbTrailRef.current[0];
    const offDist = distanceTo(location.lat, location.lng, next.lat, next.lng);
    if (offDist > 40 && !isReroutingRef.current) {
      isReroutingRef.current = true;
      routeLoadedRef.current = false;
      loadRoute(location).finally(() => { isReroutingRef.current = false; });
    }
  }, [location, routeReady, loadRoute]);

  // ── Arrow angle + arrival check ───────────────────────────────────────────
  useEffect(() => {
    if (!location || orbTrailRef.current.length === 0 || arrivedRef.current) return;

    let advanced = false;
    while (orbTrailRef.current.length > 0) {
      const next = orbTrailRef.current[0];
      const d    = distanceTo(location.lat, location.lng, next.lat, next.lng);
      if (d < ORB_ADVANCE_DIST) { orbTrailRef.current.shift(); advanced = true; }
      else break;
    }
    if (advanced) setOrbVersion(v => v + 1);

    function handleArrival() {
      arrivedRef.current = true;
      setArrived(true);
      if (NO_INDOOR_PROMPT.has(destinationId)) return;
      // If user was already at the destination when navigation started,
      // skip the staircase picker and go straight to arrival prompt
      if (!startedAtDestRef.current && BUILDINGS[destinationId] && TWO_STAIRCASE_BUILDINGS.has(destinationId)) {
        setStaircasePickerVisible(true);
      } else {
        setArrivalPromptVisible(true);
      }
    }

    if (orbTrailRef.current.length === 0) { handleArrival(); return; }

    const dest = NODES[destinationId];
    if (dest) {
      const dApp = distanceTo(location.lat, location.lng, dest.lat, dest.lng);
      if (dApp < APPROACHING_DIST && dApp > ARRIVAL_DIST) {
        setIsApproaching(true);
      } else if (dApp >= APPROACHING_DIST) {
        setIsApproaching(false);
      }
    }

    if (dest) {
      const d = distanceTo(location.lat, location.lng, dest.lat, dest.lng);
      if (d < ARRIVAL_DIST) {
        arrivalCountRef.current += 1;
        if (arrivalCountRef.current >= ARRIVAL_CONFIRMATIONS) { handleArrival(); return; }
      } else {
        arrivalCountRef.current = 0;
      }
    }

    const next    = orbTrailRef.current[0];
    const bearing = bearingTo(location.lat, location.lng, next.lat, next.lng);
    let angle     = bearing - heading;
    if (angle >  180) angle -= 360;
    if (angle < -180) angle += 360;
    setNextAngle(angle);
    setDistToNext(Math.round(distanceTo(location.lat, location.lng, next.lat, next.lng)));

    // Pre-bend warning: if next waypoint is close and the one after it is a sharp turn
    if (orbTrailRef.current.length >= 2) {
      const dNext = distanceTo(location.lat, location.lng, next.lat, next.lng);
      if (dNext < PREBEND_WARN_DIST) {
        const after = orbTrailRef.current[1];
        const bearingNext  = bearingTo(next.lat, next.lng, after.lat, after.lng);
        let turnAngle = Math.abs(bearingNext - bearing);
        if (turnAngle > 180) turnAngle = 360 - turnAngle;
        setIsPreBend(turnAngle > 60); // warn if next turn > 60°
      } else {
        setIsPreBend(false);
      }
    }

  }, [location, heading, destinationId, indoorStatus]);

  // ── Destination info ──────────────────────────────────────────────────────
  const destBuilding = BUILDINGS[destinationId];
  const destName     = destBuilding?.name
    ?? (NODES[destinationId]
        ? destinationId.charAt(0).toUpperCase() + destinationId.slice(1).replace(/_/g, " ")
        : "Destination");

  // ── Permission gates ──────────────────────────────────────────────────────
  if (!permission) return <View style={s.fill} />;

  if (!permission.granted) {
    return (
      <View style={[s.fill, s.center]}>
        <StatusBar style="light" />
        <Text style={s.permIcon}>[CAM]</Text>
        <Text style={s.permText}>Camera access needed for AR navigation</Text>
        <TouchableOpacity style={s.permBtn} onPress={requestPermission} activeOpacity={0.85}>
          <Text style={s.permBtnText}>Grant Camera Permission</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.permBack} onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Text style={s.permBackText}>← Back to Map</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (locError) {
    return (
      <View style={[s.fill, s.center]}>
        <StatusBar style="light" />
        <Text style={s.permIcon}>[GPS]</Text>
        <Text style={s.permText}>Location access denied</Text>
        <TouchableOpacity style={s.permBack} onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Text style={s.permBackText}>← Back to Map</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isLoading = !gpsReady || !location || !routeReady;

  return (
    <View style={s.fill}>
      <StatusBar style="light" hidden />

      {/* ── ViroReact AR scene — fullscreen, behind everything ── */}
      <ViroARNavScene
        style={StyleSheet.absoluteFill}
        angleDiff={nextAngle}
        heading={heading}
        waypoints={orbTrailRef.current.slice(0, 5)}
        userLocation={location}
      />

      {/* ── HUD overlay ── */}
      <View style={s.hudOverlay} pointerEvents="box-none">

        {/* Loading */}
        {isLoading && !arrived && (
          <View style={s.loadingOverlay}>
            <Text style={s.loadingIcon}>[...]</Text>
            <Text style={s.loadingText}>
              {!location ? t("ar.gpsAcquiring", lang) : t("ar.plotting", lang)}
            </Text>
            <Text style={s.loadingSub}>{t("ar.pointAhead", lang)}</Text>
          </View>
        )}

        {/* Indoor banner */}
        {indoorStatus && !arrived && !isLoading && (
          <View style={s.indoorBanner}>
            <Text style={s.indoorBannerText}>
              {indoorStatus.buildingId === destinationId
                ? t('ar.indoor.title', lang)
                : `You are inside ${indoorStatus.buildingName} — keep going to ${destName}!`}
            </Text>
            <TouchableOpacity onPress={() => setIndoorStatus(null)}>
              <Text style={s.indoorBannerDismiss}>{t("ar.indoor.dismiss", lang)}</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* GPS weak-signal banner */}
        {gpsWarning && !gpsWarnDismissed && !isLoading && !arrived && (
          <View style={s.gpsWarnBanner}>
            <Text style={s.gpsWarnText}>{t('gps.weakSignal', lang)}</Text>
            <TouchableOpacity onPress={() => setGpsWarnDismissed(true)}>
              <Text style={s.gpsWarnDismiss}>✕</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* GPS quality chip */}
        {!isLoading && !arrived && (
          <View style={[s.gpsChipWrap, { top: Platform.OS === 'android' ? 36 : 8, right: 56 }]}>
            <StatusChips quality={gpsQuality} lang={lang} />
          </View>
        )}

        {/* Approaching chip */}
        {isApproaching && !arrived && !isLoading && (
          <View style={s.approachingChip}>
            <Text style={s.approachingText}>Almost there! {destName} is ahead</Text>
          </View>
        )}

        {/* Pre-bend warning — sharp turn coming up */}
        {isPreBend && !arrived && !isLoading && !isApproaching && (
          <View style={s.preBendChip}>
            <Text style={s.preBendText}>⚠ Turn ahead</Text>
          </View>
        )}

        {/* Bearing HUD */}
        {!isLoading && !arrived && (
          <SafeAreaView style={s.hudTop} edges={["top"]} pointerEvents="box-none">
            <BearingHUD
              angleDiff={nextAngle}
              distance={distToNext}
              destName={destName}
              lang={lang}
            />
          </SafeAreaView>
        )}

        {/* Distance chip */}
        {!isLoading && !arrived && distToNext !== null && (
          <View style={s.distChip} pointerEvents="none">
            <Text style={s.distVal}>{distToNext}m</Text>
            <Text style={s.distLabel}>{t("ar.toNext", lang)}</Text>
          </View>
        )}

        {/* Compass calibrator */}
        {!isLoading && !arrived && (
          <View style={s.calibratorWrap}>
            <CompassCalibrator
              offset={compassOffset}
              onAdjust={handleOffsetChange}
              heading={heading}
              lang={lang}
            />
          </View>
        )}

        {/* Back button */}
        {!arrived && (
          <SafeAreaView style={s.backWrap} edges={["top"]}>
            <TouchableOpacity
              style={s.backBtn}
              onPress={() => navigation.goBack()}
              activeOpacity={0.8}
            >
              <IconArrowLeft size={18} color="#ffffff" />
            </TouchableOpacity>
          </SafeAreaView>
        )}
      </View>

      {/* ── Compact bottom info bar ── */}
      {!arrived && !isLoading && (
        <View style={s.bottomBar} pointerEvents="none">
          <Text style={s.bottomDestName} numberOfLines={1}>{destName}</Text>
          <Text style={s.bottomDistText}>
            {distToNext != null ? `${distToNext}m` : '—'}
          </Text>
        </View>
      )}

      {/* ── Arrived overlay — full screen ── */}
      {arrived && (
        <View style={s.arrivedOverlay}>
          <Text style={s.arrivedIcon}>OK</Text>
          <Text style={s.arrivedTitle}>{t('ar.arrived', lang)}</Text>
          <Text style={s.arrivedSub}>{destName}</Text>
          <View style={s.arrivedBtns}>
            {!NO_INDOOR_PROMPT.has(destinationId) && (
              <TouchableOpacity
                style={s.arrivedBtn}
                onPress={() => {
                  if (TWO_STAIRCASE_BUILDINGS.has(destinationId) && !selectedStaircase) {
                    setStaircasePickerVisible(true);
                  } else {
                    setArrivalPromptVisible(true);
                  }
                }}
                activeOpacity={0.85}
              >
                <Text style={s.arrivedBtnText}>{t('ar.findRoom', lang)}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[s.arrivedBtn, s.arrivedBtnBack]}
              onPress={() => navigation.goBack()}
              activeOpacity={0.85}
            >
              <Text style={[s.arrivedBtnText, { color: 'rgba(255,255,255,0.6)' }]}>
                {t('ar.backToMap', lang)}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* ── Staircase picker ── */}
      <StaircasePicker
        visible={staircasePickerVisible}
        buildingId={destinationId}
        buildingName={destName}
        lang={lang}
        onSelect={(stairKey) => {
          setSelectedStaircase(stairKey);
          setStaircasePickerVisible(false);
          setArrivalPromptVisible(true);
        }}
        onDismiss={() => setStaircasePickerVisible(false)}
      />

      {/* ── Arrival prompt ── */}
      <ArrivalPrompt
        visible={arrivalPromptVisible}
        buildingId={destinationId}
        buildingName={destName}
        lang={lang}
        staircase={selectedStaircase}
        onClose={() => setArrivalPromptVisible(false)}
      />

      {/* ── AR Tutorial (first launch only) ── */}
      <ARTutorial lang={lang} />
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  fill:   { flex: 1, backgroundColor: "#000" },
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12, padding: 24 },

  // HUD overlay (sits above ViroReact)
  hudOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
  },

  // Loading
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.72)",
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
  },
  loadingIcon: { fontSize: 48 },
  loadingText: { fontSize: 18, fontWeight: "800", color: GREEN },
  loadingSub:  { fontSize: 13, color: "rgba(255,255,255,0.5)", textAlign: "center", paddingHorizontal: 32 },

  // Indoor banner
  indoorBanner: {
    position: "absolute",
    top: Platform.OS === "android" ? 90 : 60,
    left: 16, right: 16,
    backgroundColor: "rgba(255,193,7,0.9)",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  indoorBannerText:    { fontSize: 13, fontWeight: "800", color: "#071209", flex: 1 },
  indoorBannerDismiss: { fontSize: 12, fontWeight: "700", color: "#071209", opacity: 0.6 },

  // GPS weak-signal banner
  gpsWarnBanner: {
    position: "absolute",
    top: Platform.OS === "android" ? 130 : 100,
    left: 16,
    right: 16,
    backgroundColor: "rgba(255,152,0,0.9)",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  gpsWarnText:    { fontSize: 13, fontWeight: "800", color: "#071209", flex: 1 },
  gpsWarnDismiss: { fontSize: 14, fontWeight: "700", color: "#071209", opacity: 0.7, paddingLeft: 8 },

  // GPS quality chip wrapper
  gpsChipWrap: { position: "absolute" },

  // Approaching chip
  approachingChip: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    marginHorizontal: 16,
    backgroundColor: 'rgba(255,193,7,0.9)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignItems: 'center',
    zIndex: 20,
  },
  approachingText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#071209',
  },

  // Pre-bend turn warning
  preBendChip: {
    position: 'absolute',
    bottom: 80,
    alignSelf: 'center',
    backgroundColor: 'rgba(255,100,0,0.88)',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    zIndex: 20,
  },
  preBendText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#fff',
  },
  hudTop: {
    position: "absolute",
    top: 0, left: 0, right: 0,
    alignItems: "center",
    paddingTop: Platform.OS === "android" ? 36 : 8,
  },

  // Distance chip
  distChip: {
    position: "absolute",
    bottom: 80,
    left: 16,
    backgroundColor: GREEN,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    alignItems: "center",
    minWidth: 64,
  },
  distVal:   { fontSize: 22, fontWeight: "900", color: "#071209" },
  distLabel: { fontSize: 9,  fontWeight: "700", color: "rgba(7,18,9,0.6)" },

  // Calibrator
  calibratorWrap: {
    position: "absolute",
    bottom: 76,
    right: 12,
  },

  // Back button
  backWrap: { position: "absolute", top: 0, left: 0 },
  backBtn: {
    marginTop: Platform.OS === "android" ? 36 : 8,
    marginLeft: 14,
    width: 36, height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },

  // Compact bottom info bar
  bottomBar: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    height: 60,
    backgroundColor: 'rgba(7,18,9,0.85)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,200,83,0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  bottomDestName: {
    flex: 1,
    fontSize: 13,
    fontWeight: '800',
    color: '#ffffff',
    marginRight: 12,
  },
  bottomDistText: {
    fontSize: 16,
    fontWeight: '900',
    color: GREEN,
  },

  // Arrived overlay — full screen
  arrivedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(7,18,9,0.92)",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    zIndex: 10,
  },
  arrivedIcon:  { fontSize: 48 },
  arrivedTitle: { fontSize: 22, fontWeight: "900", color: GREEN },
  arrivedSub:   { fontSize: 14, color: "rgba(255,255,255,0.5)" },
  arrivedBtns:  { flexDirection: "column", gap: 8, marginTop: 12, width: W - 64 },
  arrivedBtn: {
    backgroundColor: GREEN,
    borderRadius: 999,
    paddingVertical: 13,
    alignItems: "center",
  },
  arrivedBtnBack: { backgroundColor: "rgba(255,255,255,0.08)" },
  arrivedBtnText: { fontSize: 14, fontWeight: "800", color: "#071209" },

  // Permission screens
  permIcon: { fontSize: 52 },
  permText: {
    fontSize: 16, fontWeight: "700", color: "#fff",
    textAlign: "center", paddingHorizontal: 20,
  },
  permBtn: {
    backgroundColor: GREEN, borderRadius: 12,
    paddingHorizontal: 28, paddingVertical: 13, marginTop: 8,
  },
  permBtnText:  { fontSize: 14, fontWeight: "800", color: "#071209" },
  permBack:     { marginTop: 10 },
  permBackText: { fontSize: 13, color: "rgba(255,255,255,0.4)", fontWeight: "600" },
});
