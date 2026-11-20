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
import { bearingTo, distanceTo, projectOnSegment, getLookaheadPoint } from "../utils/arMath";
import { aStar, getWaypoints, nearestNode } from "../utils/pathfinding";
import { getHardcodedRoute } from "../constants/hardcodedRoutes";
import { getIndoorStatus, TWO_STAIRCASE_BUILDINGS } from "../utils/indoorDetection";
import { NODES } from "../constants/campusGraph";
import { BUILDINGS } from "../constants/buildings";
import { ENTRANCE_IMAGES } from "../data/buildingImages";
import { IconArrowLeft } from "../components/icons/index";
import { useSettings } from "../context/SettingsContext";
import { t } from "../constants/i18n";
import StaircasePicker from "../components/StaircasePicker";
import ArrivalPrompt from "../components/ArrivalPrompt";
import BearingHUD from "../components/BearingHUD";
import ARTutorial from "../components/ARTutorial";
import ViroARNavScene from "../components/ViroARNavScene";
import StatusChips from "../components/StatusChips";

const { width: W, height: H } = Dimensions.get("window");
const GREEN = "#00C853";

const ARRIVAL_DIST = 20;   // metres — accounts for GPS inaccuracy near buildings
const ARRIVAL_CONFIRMATIONS = 3;    // consecutive readings before triggering arrival
const APPROACHING_DIST = 40;   // metres — show "Almost there" chip
const PREBEND_WARN_DIST = 15;   // metres — warn before sharp direction change
const LOOKAHEAD_M = 8;    // metres ahead on the path the arrow points toward
const CAPTURE_RADIUS_M = 6;    // metres — snap-to-node capture radius (GPS wobble tolerance)
const OFF_PATH_M = 25;   // metres cross-track error threshold to trigger re-route
const OFF_PATH_CONFIRMATIONS = 3;   // consecutive off-path readings before re-route fires

// ── Waypoint interpolation (used only for orb-trail ViroReact rendering) ─────
// The progression logic now uses segment indices, not orb indices.
function interpolateSegment(a, b, spacingM) {
  const total = distanceTo(a.lat, a.lng, b.lat, b.lng);
  const steps = Math.max(1, Math.floor(total / spacingM));
  const pts = [];
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
    orbs.push(...interpolateSegment(waypoints[i], waypoints[i + 1], 6));
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

  const [distToNext, setDistToNext] = useState(null);
  const [totalDist, setTotalDist] = useState(null);
  const [orbVersion, setOrbVersion] = useState(0);
  const [arrived, setArrived] = useState(false);
  const [routeReady, setRouteReady] = useState(false);
  const [nextAngle, setNextAngle] = useState(0);
  const [indoorStatus, setIndoorStatus] = useState(null);
  const [staircasePickerVisible, setStaircasePickerVisible] = useState(false);
  const [selectedStaircase, setSelectedStaircase] = useState(null);
  const [arrivalPromptVisible, setArrivalPromptVisible] = useState(false);
  const [isApproaching, setIsApproaching] = useState(false);
  const [isPreBend, setIsPreBend] = useState(false);
  const [gpsWarnDismissed, setGpsWarnDismissed] = useState(false);
  // Track whether user was already at destination when navigation started
  const startedAtDestRef = useRef(false);

  const orbTrailRef = useRef([]);
  const waypointsRef = useRef([]);
  const routeLoadedRef = useRef(false);
  const arrivedRef = useRef(false);
  const arrivalCountRef = useRef(0);
  const isReroutingRef = useRef(false);
  // Segment-index progression (replaces the old 4m shift loop)
  const activeSegIdxRef = useRef(0);   // index into waypointsRef (A of active A→B segment)
  const offPathCountRef = useRef(0);   // consecutive off-path GPS readings
  const dismissedIndoorBuildingsRef = useRef(new Set());

  // ── Reset on new destination ──────────────────────────────────────────────
  useEffect(() => {
    orbTrailRef.current = [];
    waypointsRef.current = [];
    routeLoadedRef.current = false;
    arrivedRef.current = false;
    arrivalCountRef.current = 0;
    isReroutingRef.current = false;
    startedAtDestRef.current = false;
    activeSegIdxRef.current = 0;
    offPathCountRef.current = 0;
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

    // ── 1. Try hardcoded human-surveyed route first ───────────────────────
    const hardcoded = getHardcodedRoute(destinationId);
    if (hardcoded && hardcoded.length >= 2) {
      waypoints = hardcoded;
    } else {
      // ── 2. Fall back to A* on campusGraph ──────────────────────────────
      const startNode = nearestNode(loc.lat, loc.lng);
      const pathIds = aStar(startNode, destinationId);
      waypoints = pathIds.length > 0 ? getWaypoints(pathIds) : [];
    }

    if (!waypoints || waypoints.length === 0) {
      const dest = NODES[destinationId];
      waypoints = dest
        ? [{ lat: loc.lat, lng: loc.lng }, { lat: dest.lat, lng: dest.lng }]
        : [];
    }

    // ── 3. Find the segment the user is closest to and slice from there ───
    // For each segment A→B, find the nearest point on that segment to the user.
    // We pick the segment whose closest point is nearest, then start from A.
    // This is better than snapping to the nearest node — it handles mid-segment starts.
    if (waypoints.length >= 2) {
      let bestSegIdx = 0;
      let bestSegDist = Infinity;

      for (let i = 0; i < waypoints.length - 1; i++) {
        const a = waypoints[i];
        const b = waypoints[i + 1];
        // Closest point on segment to user
        const bx = (b.lng - a.lng);
        const by = (b.lat - a.lat);
        const px = (loc.lng - a.lng);
        const py = (loc.lat - a.lat);
        const lenSq = bx * bx + by * by;
        const rawT = lenSq > 0 ? (px * bx + py * by) / lenSq : 0;
        const tClamp = Math.max(0, Math.min(1, rawT));
        const closestLat = a.lat + tClamp * (b.lat - a.lat);
        const closestLng = a.lng + tClamp * (b.lng - a.lng);
        const d = distanceTo(loc.lat, loc.lng, closestLat, closestLng);
        if (d < bestSegDist) { bestSegDist = d; bestSegIdx = i; }
      }

      // If user is ahead of the first segment (already inside campus), slice.
      // Keep the full route if user is at or near the very start.
      if (bestSegIdx > 0) {
        waypoints = waypoints.slice(bestSegIdx);
      }
    }

    activeSegIdxRef.current = 0;
    offPathCountRef.current = 0;
    orbTrailRef.current = buildOrbTrail(waypoints);
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
    const status = getIndoorStatus(location.lat, location.lng);
    if (status && dismissedIndoorBuildingsRef.current.has(status.buildingId)) {
      return;
    }
    setIndoorStatus(status);
  }, [location]);

  // ── Re-route if off-path ──────────────────────────────────────────────────
  // Uses cross-track error on the active segment rather than raw distance to
  // the next orb — far more tolerant of GPS wobble and wide sidewalks.
  useEffect(() => {
    if (!location || !routeReady || arrivedRef.current) return;
    const wps = waypointsRef.current;
    if (wps.length < 2) return;

    const segIdx = activeSegIdxRef.current;
    if (segIdx >= wps.length - 1) return;

    const { crossTrackDist } = projectOnSegment(location, wps[segIdx], wps[segIdx + 1]);

    if (crossTrackDist > OFF_PATH_M) {
      offPathCountRef.current += 1;
      if (offPathCountRef.current >= OFF_PATH_CONFIRMATIONS && !isReroutingRef.current) {
        isReroutingRef.current = true;
        offPathCountRef.current = 0;
        routeLoadedRef.current = false;
        loadRoute(location).finally(() => { isReroutingRef.current = false; });
      }
    } else {
      offPathCountRef.current = 0;
    }
  }, [location, routeReady, loadRoute]);

  // ── Segment-based progression + arrow angle + arrival check ─────────────
  //
  // KEY CHANGE: instead of "if (distToNext < 4m) shift()", we use:
  //   1. projectOnSegment → t, passed
  //   2. Advance activeSegIdx while passed is true (handles GPS drift sideways)
  //   3. getLookaheadPoint → smooth arrow direction 8m ahead along the walkway
  //   4. Only arrive when: orbs exhausted OR consecutive GPS confirms < 20m to dest
  //
  useEffect(() => {
    if (!location || arrivedRef.current) return;
    const wps = waypointsRef.current;
    if (wps.length < 2) return;

    // ── A. Advance segment index via perpendicular-plane crossing test ────
    let segIdx = activeSegIdxRef.current;
    while (segIdx < wps.length - 1) {
      const { passed } = projectOnSegment(
        location, wps[segIdx], wps[segIdx + 1], CAPTURE_RADIUS_M,
      );
      if (passed) { segIdx += 1; }
      else { break; }
    }
    if (segIdx !== activeSegIdxRef.current) {
      activeSegIdxRef.current = segIdx;
      // Keep the orb trail in sync so ViroARNavScene shows the right orbs
      // (re-slice from the advanced position, preserving isDestination flag)
      const advancedOrbs = buildOrbTrail(wps.slice(segIdx));
      orbTrailRef.current = advancedOrbs;
      setOrbVersion(v => v + 1);
    }

    // ── B. Arrival check ─────────────────────────────────────────────────
    function handleArrival() {
      arrivedRef.current = true;
      setArrived(true);
      if (NO_INDOOR_PROMPT.has(destinationId)) return;
      if (!startedAtDestRef.current && BUILDINGS[destinationId] && TWO_STAIRCASE_BUILDINGS.has(destinationId)) {
        setStaircasePickerVisible(true);
      } else {
        setArrivalPromptVisible(true);
      }
    }

    const dest = NODES[destinationId];

    // All segments consumed OR explicitly reached the last node
    if (segIdx >= wps.length - 1) {
      if (dest) {
        const dToDest = distanceTo(location.lat, location.lng, dest.lat, dest.lng);
        if (dToDest < ARRIVAL_DIST) {
          arrivalCountRef.current += 1;
          if (arrivalCountRef.current >= ARRIVAL_CONFIRMATIONS) { handleArrival(); return; }
        } else {
          arrivalCountRef.current = 0;
        }
      } else {
        handleArrival(); return;
      }
    } else {
      // Still progressing — reset arrival counter
      if (dest) {
        const dToDest = distanceTo(location.lat, location.lng, dest.lat, dest.lng);
        if (dToDest < ARRIVAL_DIST) {
          arrivalCountRef.current += 1;
          if (arrivalCountRef.current >= ARRIVAL_CONFIRMATIONS) { handleArrival(); return; }
        } else {
          arrivalCountRef.current = 0;
        }
      }
    }

    // ── C. Approaching chip ──────────────────────────────────────────────
    if (dest) {
      const dApp = distanceTo(location.lat, location.lng, dest.lat, dest.lng);
      setIsApproaching(dApp < APPROACHING_DIST && dApp > ARRIVAL_DIST);
    }

    // ── D. Lookahead arrow direction ─────────────────────────────────────
    // Point the arrow at a point LOOKAHEAD_M metres ahead along the remaining
    // path polyline — not directly at the next node. This keeps the arrow
    // pointing smoothly forward along the walkway, never pointing backward.
    const lookahead = getLookaheadPoint(wps, segIdx, LOOKAHEAD_M);
    const bearing = bearingTo(location.lat, location.lng, lookahead.lat, lookahead.lng);
    let angle = bearing - heading;
    if (angle > 180) angle -= 360;
    if (angle < -180) angle += 360;
    setNextAngle(angle);

    // Distance display: show distance to the NEXT node (B of active segment)
    const nextNodeIdx = Math.min(segIdx + 1, wps.length - 1);
    setDistToNext(Math.round(distanceTo(
      location.lat, location.lng,
      wps[nextNodeIdx].lat, wps[nextNodeIdx].lng,
    )));

    // ── E. Pre-bend warning ──────────────────────────────────────────────
    if (segIdx < wps.length - 2) {
      const nextNode = wps[segIdx + 1];
      const afterNode = wps[segIdx + 2];
      const dNext = distanceTo(location.lat, location.lng, nextNode.lat, nextNode.lng);
      if (dNext < PREBEND_WARN_DIST) {
        const bearingCur = bearingTo(wps[segIdx].lat, wps[segIdx].lng, nextNode.lat, nextNode.lng);
        const bearingNext = bearingTo(nextNode.lat, nextNode.lng, afterNode.lat, afterNode.lng);
        let turnAngle = Math.abs(bearingNext - bearingCur);
        if (turnAngle > 180) turnAngle = 360 - turnAngle;
        setIsPreBend(turnAngle > 60);
      } else {
        setIsPreBend(false);
      }
    } else {
      setIsPreBend(false);
    }

  }, [location, heading, destinationId, indoorStatus]);

  // ── Destination info ──────────────────────────────────────────────────────
  const destBuilding = BUILDINGS[destinationId];
  const destName = destBuilding?.name
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
            <TouchableOpacity onPress={() => {
              if (indoorStatus?.buildingId) {
                dismissedIndoorBuildingsRef.current.add(indoorStatus.buildingId);
              }
              setIndoorStatus(null);
            }}>
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

        {/* Compass calibrator removed — GPS course blend handles heading automatically */}

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
        stair1Image={ENTRANCE_IMAGES[destinationId]?.staircase_1 ?? null}
        stair2Image={ENTRANCE_IMAGES[destinationId]?.staircase_2 ?? null}
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
  fill: { flex: 1, backgroundColor: "#000" },
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
  loadingSub: { fontSize: 13, color: "rgba(255,255,255,0.5)", textAlign: "center", paddingHorizontal: 32 },

  // Indoor banner — positioned below BearingHUD (arc ~56px + label ~30px + paddingTop 36 = ~122px)
  indoorBanner: {
    position: "absolute",
    top: Platform.OS === "android" ? 136 : 106,
    left: 16, right: 16,
    backgroundColor: "rgba(255,193,7,0.9)",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 10,
    zIndex: 20,
  },
  indoorBannerText: { fontSize: 13, fontWeight: "800", color: "#071209", flex: 1 },
  indoorBannerDismiss: { fontSize: 12, fontWeight: "700", color: "#071209", opacity: 0.6 },

  // GPS weak-signal banner — below indoor banner
  gpsWarnBanner: {
    position: "absolute",
    top: Platform.OS === "android" ? 185 : 155,
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
  gpsWarnText: { fontSize: 13, fontWeight: "800", color: "#071209", flex: 1 },
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
  distVal: { fontSize: 22, fontWeight: "900", color: "#071209" },
  distLabel: { fontSize: 9, fontWeight: "700", color: "rgba(7,18,9,0.6)" },

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
  arrivedIcon: { fontSize: 48 },
  arrivedTitle: { fontSize: 22, fontWeight: "900", color: GREEN },
  arrivedSub: { fontSize: 14, color: "rgba(255,255,255,0.5)" },
  arrivedBtns: { flexDirection: "column", gap: 8, marginTop: 12, width: W - 64 },
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
  permBtnText: { fontSize: 14, fontWeight: "800", color: "#071209" },
  permBack: { marginTop: 10 },
  permBackText: { fontSize: 13, color: "rgba(255,255,255,0.4)", fontWeight: "600" },
});
