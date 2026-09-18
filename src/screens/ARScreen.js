import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableOpacity,
  Platform,
} from "react-native";
import Svg, { Polygon } from "react-native-svg";
import { CameraView, useCameraPermissions } from "expo-camera";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import useLocation from "../hooks/useLocation";
import { setCompassOffset, getCompassOffset } from "../hooks/useLocation";
import { bearingTo, distanceTo } from "../utils/arMath";
import { aStar, getWaypoints, nearestNode } from "../utils/pathfinding";
import { getIndoorStatus } from "../utils/indoorDetection";
import { NODES } from "../constants/campusGraph";
import { BUILDINGS } from "../constants/buildings";
import { fetchRoute } from "../services/api";
import { colors, radius } from "../constants/theme";
import { IconArrowLeft, IconArrowUp, IconArrowRight, IconArrowUpLeft, IconArrowUpRight } from "../components/icons/index";
import { useSettings } from "../context/SettingsContext";
import { t } from "../constants/i18n";
import StaircasePicker from "../components/StaircasePicker";
import ArrivalPrompt from "../components/ArrivalPrompt";
import BearingHUD from "../components/BearingHUD";
import CompassCalibrator from "../components/CompassCalibrator";

const { width: W, height: H } = Dimensions.get("window");
const GREEN = "#00C853";

// ── Tuning constants ──────────────────────────────────────────────────────────
const ORB_SPACING_METRES = 6;
const ORB_ADVANCE_DIST   = 4;
// Arrival requires being within this distance for 2 consecutive GPS updates
const ARRIVAL_DIST       = 12;
const MAX_ARROWS         = 7;
const MAX_RENDER_DIST    = 50;

// ── Cross-device FOV estimation ───────────────────────────────────────────────
function estimateHFov() {
  const { width, height } = Dimensions.get("window");
  const shortSide = Math.min(width, height);
  const longSide  = Math.max(width, height);
  const aspect    = longSide / shortSide;
  const diagDp    = Math.sqrt(shortSide ** 2 + longSide ** 2);
  let baseFov;
  if      (aspect >= 2.0) baseFov = 69;
  else if (aspect >= 1.8) baseFov = 73;
  else                    baseFov = 76;
  const nudge = diagDp > 900 ? +2 : diagDp > 750 ? +1 : 0;
  return baseFov + nudge;
}
const H_FOV = estimateHFov();

// ── GPS interpolation ─────────────────────────────────────────────────────────
function interpolateSegment(a, b, spacingM) {
  const total = distanceTo(a.lat, a.lng, b.lat, b.lng);
  const steps = Math.max(1, Math.floor(total / spacingM));
  const pts   = [];
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    pts.push({ lat: a.lat + (b.lat - a.lat) * t, lng: a.lng + (b.lng - a.lng) * t });
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

function cardinalLabel(deg) {
  const dirs = ["N","NE","E","SE","S","SW","W","NW"];
  return dirs[Math.round(deg / 45) % 8];
}

// ── Direction arrow icon for HUD ──────────────────────────────────────────────
function DirectionArrowIcon({ angleDiff, size = 26, color = "#ffffff" }) {
  if (angleDiff === null) return <IconArrowUp size={size} color={color} />;
  const abs = Math.abs(angleDiff);
  if (abs < 20)  return <IconArrowUp size={size} color={color} />;
  if (abs < 60)  return angleDiff < 0
    ? <IconArrowUpLeft  size={size} color={color} />
    : <IconArrowUpRight size={size} color={color} />;
  return angleDiff < 0
    ? <IconArrowLeft  size={size} color={color} />
    : <IconArrowRight size={size} color={color} />;
}

// ── Perspective arrow — the YouTube-style pointing arrow ─────────────────────
// Renders an SVG arrow at a given screen (x, y) with perspective scaling.
// idx=0 is the nearest (bottom, largest), higher idx = farther (smaller, higher).
function PerspectiveArrow({ x, y, scale, opacity, angleDiff = 0 }) {
  // Arrow shape: equilateral-ish upward chevron
  // Base width and height scale with perspective
  const W_BASE = 48 * scale;
  const H_BASE = 60 * scale;
  const hw = W_BASE / 2;
  const points = `${hw},0 ${W_BASE},${H_BASE * 0.55} ${W_BASE * 0.72},${H_BASE * 0.45} ${W_BASE * 0.72},${H_BASE} ${W_BASE * 0.28},${H_BASE} ${W_BASE * 0.28},${H_BASE * 0.45} 0,${H_BASE * 0.55}`;

  // Rotate the arrow based on horizontal angle — arrows lean left/right
  // when the destination is off-center
  const clampedAngle = Math.max(-35, Math.min(35, angleDiff ?? 0));

  return (
    <Animated.View
      style={{
        position: "absolute",
        left: x - W_BASE / 2,
        top:  y - H_BASE / 2,
        opacity,
        transform: [{ rotate: `${clampedAngle}deg` }],
      }}
      pointerEvents="none"
    >
      <Svg width={W_BASE} height={H_BASE} viewBox={`0 0 ${W_BASE} ${H_BASE}`}>
        <Polygon
          points={points}
          fill="rgba(0,220,100,0.85)"
          stroke="rgba(255,255,255,0.6)"
          strokeWidth={1.5 * scale}
        />
      </Svg>
    </Animated.View>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────
export default function ARScreen({ route, navigation }) {
  const { destinationId = "main_building" } = route.params ?? {};
  const { settings } = useSettings();
  const lang = settings?.language ?? "en";

  const [permission, requestPermission] = useCameraPermissions();
  const { location, heading, error: locError } = useLocation();

  const [arrowPositions,  setArrowPositions]  = useState([]);
  const [distToNext,      setDistToNext]      = useState(null);
  const [totalDist,       setTotalDist]       = useState(null);
  const [arrived,         setArrived]         = useState(false);
  const [routeReady,      setRouteReady]      = useState(false);
  const [nextAngle,       setNextAngle]       = useState(null);
  const [indoorStatus,    setIndoorStatus]    = useState(null);
  const [compassOffset,   setCompassOffsetState] = useState(getCompassOffset());
  const [staircasePickerVisible, setStaircasePickerVisible] = useState(false);
  const [selectedStaircase,      setSelectedStaircase]      = useState(null);
  const [arrivalPromptVisible,   setArrivalPromptVisible]   = useState(false);

  const orbTrailRef        = useRef([]);
  const routeLoadedRef     = useRef(false);
  const arrivedRef         = useRef(false);
  const arrivalCountRef    = useRef(0);

  function handleOffsetChange(newOffset) {
    setCompassOffset(newOffset);
    setCompassOffsetState(newOffset);
  } // must be within range for 2 consecutive updates

  // ── Load route ────────────────────────────────────────────────────────────
  const loadRoute = useCallback(async (loc) => {
    if (routeLoadedRef.current) return;
    routeLoadedRef.current = true;
    let waypoints = [];
    try {
      waypoints = await fetchRoute(loc.lat, loc.lng, destinationId);
    } catch (_) {}

    if (!waypoints || waypoints.length === 0) {
      const startNode = nearestNode(loc.lat, loc.lng);
      const pathIds   = aStar(startNode, destinationId);
      waypoints       = pathIds.length > 0 ? getWaypoints(pathIds) : [];
    }

    if (!waypoints || waypoints.length === 0) {
      const dest = NODES[destinationId];
      if (dest) {
        waypoints = [{ lat: loc.lat, lng: loc.lng }, { lat: dest.lat, lng: dest.lng }];
      } else {
        const orbs = [];
        for (let i = 1; i <= 6; i++) {
          const dLat = ((i * ORB_SPACING_METRES) / 6371000) * (180 / Math.PI);
          orbs.push({ lat: loc.lat + dLat, lng: loc.lng });
        }
        orbTrailRef.current = orbs;
        setRouteReady(true);
        return;
      }
    }

    orbTrailRef.current = buildOrbTrail(waypoints);
    let total = 0;
    for (let i = 0; i < waypoints.length - 1; i++) {
      total += distanceTo(waypoints[i].lat, waypoints[i].lng, waypoints[i+1].lat, waypoints[i+1].lng);
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

  // ── Re-route if drifted ───────────────────────────────────────────────────
  useEffect(() => {
    if (!location || !routeReady || arrivedRef.current) return;
    if (orbTrailRef.current.length === 0) return;
    const next    = orbTrailRef.current[0];
    const offDist = distanceTo(location.lat, location.lng, next.lat, next.lng);
    if (offDist > 40) {
      routeLoadedRef.current = false;
      setRouteReady(false);
      loadRoute(location);
    }
  }, [location, routeReady, loadRoute]);

  // ── Project arrows onto screen ────────────────────────────────────────────
  useEffect(() => {
    if (!location || orbTrailRef.current.length === 0 || arrivedRef.current) return;

    // Consume passed orbs
    while (orbTrailRef.current.length > 0) {
      const next = orbTrailRef.current[0];
      const d    = distanceTo(location.lat, location.lng, next.lat, next.lng);
      if (d < ORB_ADVANCE_DIST) {
        orbTrailRef.current = orbTrailRef.current.slice(1);
      } else break;
    }

    if (orbTrailRef.current.length === 0) {
      arrivedRef.current = true;
      setArrived(true);
      setArrowPositions([]);
      return;
    }

    // Arrival check — requires 2 consecutive updates within ARRIVAL_DIST
    const dest = NODES[destinationId];
    if (dest) {
      const d = distanceTo(location.lat, location.lng, dest.lat, dest.lng);
      if (d < ARRIVAL_DIST) {
        arrivalCountRef.current += 1;
        if (arrivalCountRef.current >= 2) {
          arrivedRef.current = true;
          setArrived(true);
          setArrowPositions([]);
          if (BUILDINGS[destinationId] && indoorStatus?.hasTwoStaircases) {
            setStaircasePickerVisible(true);
          } else {
            setArrivalPromptVisible(true);
          }
          return;
        }
      } else {
        // Reset counter if user moves away
        arrivalCountRef.current = 0;
      }
    }

    // ── Compute perspective arrow trail ──────────────────────────────────────
    // Take the next N waypoints and project them as arrows from bottom to top.
    // The first orb (nearest) is at the bottom-center, subsequent ones are
    // smaller and higher, following the bearing to the destination.
    const orbs = orbTrailRef.current.slice(0, MAX_ARROWS);
    const arrows = [];

    // The overall bearing to the next waypoint determines horizontal lean
    const nextOrb   = orbs[0];
    const bearing   = bearingTo(location.lat, location.lng, nextOrb.lat, nextOrb.lng);
    let   angleDiff = bearing - heading;
    if (angleDiff >  180) angleDiff -= 360;
    if (angleDiff < -180) angleDiff += 360;

    // Clamp horizontal spread: if angle is huge (>90°) just show all arrows
    // at center pointing up — destination is behind you
    const behindYou = Math.abs(angleDiff) > 90;

    for (let i = 0; i < orbs.length; i++) {
      const dist = distanceTo(location.lat, location.lng, orbs[i].lat, orbs[i].lng);
      if (dist > MAX_RENDER_DIST) continue;

      // Perspective: i=0 is nearest (bottom, scale=1), i=N is farthest (top, scale~0.2)
      const t        = i / (MAX_ARROWS - 1);          // 0 = nearest, 1 = farthest
      const scale    = Math.max(0.2, 1 - t * 0.78);   // 1.0 → 0.22
      const opacity  = Math.max(0.25, 1 - t * 0.65);  // 1.0 → 0.35

      // Y: bottom (nearest) = 82% down, top (farthest) = 45% down
      const yPct = 0.82 - t * 0.37;
      const y    = yPct * H;

      // X: center screen, but lean left/right based on angleDiff
      // Closer arrows lean more, farther arrows converge toward center (vanishing point)
      const xLean = behindYou ? 0 : angleDiff * (1 - t) * (W / H_FOV) * 0.5;
      const x     = W / 2 + xLean;

      arrows.push({ x, y, scale, opacity, angleDiff: behindYou ? 0 : angleDiff });
    }

    setArrowPositions(arrows);
    setNextAngle(angleDiff);

    const next = orbTrailRef.current[0];
    const d    = distanceTo(location.lat, location.lng, next.lat, next.lng);
    setDistToNext(Math.round(d));

  }, [location, heading, destinationId, indoorStatus]);

  // ── Destination name ──────────────────────────────────────────────────────
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
        <Text style={s.permIcon}>📷</Text>
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
        <Text style={s.permIcon}>📍</Text>
        <Text style={s.permText}>Location access denied</Text>
        <Text style={s.permSub}>WAYFINDER needs GPS to place AR orbs.</Text>
        <TouchableOpacity style={s.permBack} onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Text style={s.permBackText}>← Back to Map</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isLoading = !location || !routeReady;

  return (
    <View style={s.fill}>
      <StatusBar style="light" hidden />

      {/* Live camera */}
      <CameraView style={StyleSheet.absoluteFill} facing="back" />

      {/* ── Perspective arrow trail ── */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {!arrived && !indoorStatus && arrowPositions.map((arrow, i) => (
          <PerspectiveArrow
            key={i}
            x={arrow.x}
            y={arrow.y}
            scale={arrow.scale}
            opacity={arrow.opacity}
            angleDiff={arrow.angleDiff}
          />
        ))}
      </View>

      {/* ── Loading overlay ── */}
      {isLoading && !arrived && (
        <View style={s.loadingOverlay}>
          <Text style={s.loadingIcon}>🛰</Text>
          <Text style={s.loadingText}>
            {!location ? t('ar.gpsAcquiring', lang) : t('ar.plotting', lang)}
          </Text>
          <Text style={s.loadingSub}>{t('ar.pointAhead', lang)}</Text>
        </View>
      )}

      {/* ── Indoor warning ── */}
      {indoorStatus && !arrived && (
        <View style={s.indoorOverlay}>
          <View style={s.indoorCard}>
            <Text style={s.indoorIcon}>🏢</Text>
            <Text style={s.indoorTitle}>{t('ar.indoor.title', lang)}</Text>
            <Text style={s.indoorBody}>
              {t('ar.indoor.body', lang)} {indoorStatus.buildingName}.
            </Text>
            <TouchableOpacity style={s.indoorBtn} onPress={() => setIndoorStatus(null)} activeOpacity={0.85}>
              <Text style={s.indoorBtnText}>{t('ar.indoor.dismiss', lang)}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* ── Top HUD: BearingHUD arc indicator + compass calibrator ── */}
      {!isLoading && !arrived && (
        <SafeAreaView style={s.hudTop} edges={["top"]} pointerEvents="box-none">
          <BearingHUD
            angleDiff={nextAngle}
            distance={distToNext}
            destName={destName}
          />
        </SafeAreaView>
      )}

      {/* ── Compass calibrator — bottom-right corner ── */}
      {!isLoading && !arrived && (
        <View style={s.calibratorWrap} pointerEvents="box-none">
          <CompassCalibrator
            offset={compassOffset}
            onAdjust={handleOffsetChange}
            heading={heading}
          />
        </View>
      )}

      {/* ── Distance HUD ── */}
      {!isLoading && !arrived && distToNext !== null && (
        <View style={s.distHud} pointerEvents="none">
          <Text style={s.distVal}>{distToNext}m</Text>
          <Text style={s.distLabel}>next</Text>
          {totalDist != null && (
            <Text style={s.totalDist}>{totalDist}m total</Text>
          )}
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
        staircase={selectedStaircase === "staircase_2" ? "s2" : "s1"}
        onClose={() => setArrivalPromptVisible(false)}
      />

      {/* ── Arrival banner ── */}
      {arrived && (
        <View style={s.arrivalOverlay}>
          <View style={s.arrivalCard}>
            <Text style={s.arrivalIcon}>✅</Text>
            <Text style={s.arrivalTitle}>{t('ar.arrived', lang)}</Text>
            <Text style={s.arrivalSub}>{destName}</Text>
            <TouchableOpacity
              style={s.arrivalBtn}
              onPress={() => navigation.goBack()}
              activeOpacity={0.85}
            >
              <Text style={s.arrivalBtnText}>{t('ar.backToMap', lang)}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.arrivalBtn, { backgroundColor: "rgba(0,200,83,0.15)", marginTop: 8 }]}
              onPress={() => setArrivalPromptVisible(true)}
              activeOpacity={0.85}
            >
              <Text style={[s.arrivalBtnText, { color: GREEN }]}>🏢 Find a room</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* ── Back button ── */}
      {!arrived && (
        <SafeAreaView style={s.backWrap} edges={["top"]}>
          <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.8}>
            <IconArrowLeft size={18} color="#ffffff" />
          </TouchableOpacity>
        </SafeAreaView>
      )}
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  fill:   { flex: 1, backgroundColor: "#000" },
  center: { alignItems: "center", justifyContent: "center", gap: 12, padding: 24 },

  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.72)",
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
    zIndex: 20,
  },
  loadingIcon: { fontSize: 52 },
  loadingText: { fontSize: 18, fontWeight: "800", color: GREEN, letterSpacing: 0.5 },
  loadingSub:  { fontSize: 13, color: "rgba(255,255,255,0.45)", textAlign: "center", paddingHorizontal: 40 },

  hudTop: {
    position: "absolute",
    top: 0, left: 0, right: 0,
    alignItems: "center",
    paddingTop: Platform.OS === "android" ? 40 : 10,
    gap: 8,
  },
  directionBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "rgba(0,0,0,0.78)",
    borderRadius: 999,
    paddingHorizontal: 22,
    paddingVertical: 11,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  directionText: { fontSize: 15, fontWeight: "800", color: "#fff" },

  compass: {
    position: "absolute",
    top: Platform.OS === "android" ? 50 : 60,
    right: 16,
    width: 54, height: 54,
    borderRadius: 27,
    backgroundColor: "rgba(0,0,0,0.78)",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  compassN:    { fontSize: 14, fontWeight: "900", color: "#ff5555" },
  compassCard: { fontSize: 11, fontWeight: "800", color: "#fff" },
  compassDeg:  { fontSize: 8,  color: "rgba(255,255,255,0.4)" },

  distHud: {
    position: "absolute",
    bottom: 200, left: 16,
    backgroundColor: GREEN,
    borderRadius: 12,
    paddingHorizontal: 16, paddingVertical: 10,
    alignItems: "center",
    minWidth: 70,
  },
  calibratorWrap: {
    position: "absolute",
    bottom: 220,
    right: 16,
    zIndex: 20,
  },
  distVal:   { fontSize: 26, fontWeight: "900", color: "#071209" },
  distLabel: { fontSize: 10, fontWeight: "700", color: "rgba(7,18,9,0.65)" },
  totalDist: { fontSize: 9,  color: "rgba(7,18,9,0.5)", marginTop: 2 },

  arrivalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 30,
  },
  arrivalCard: {
    backgroundColor: "#0d1a10",
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: GREEN,
    padding: 32,
    alignItems: "center",
    gap: 8,
    width: W - 48,
  },
  arrivalIcon:    { fontSize: 52 },
  arrivalTitle:   { fontSize: 22, fontWeight: "900", color: GREEN },
  arrivalSub:     { fontSize: 14, color: "rgba(255,255,255,0.5)", textAlign: "center" },
  arrivalBtn: {
    marginTop: 12,
    backgroundColor: GREEN,
    borderRadius: 999,
    paddingHorizontal: 28, paddingVertical: 12,
  },
  arrivalBtnText: { fontSize: 14, fontWeight: "800", color: "#071209" },

  backWrap: { position: "absolute", top: 0, left: 0 },
  backBtn: {
    marginTop: Platform.OS === "android" ? 40 : 10,
    marginLeft: 16,
    width: 38, height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },

  permIcon: { fontSize: 52 },
  permText: { fontSize: 16, fontWeight: "700", color: "#fff", textAlign: "center", paddingHorizontal: 20 },
  permSub:  { fontSize: 13, color: "rgba(255,255,255,0.45)", textAlign: "center", paddingHorizontal: 30 },
  permBtn: {
    backgroundColor: GREEN,
    borderRadius: 12,
    paddingHorizontal: 28, paddingVertical: 13,
    marginTop: 8,
  },
  permBtnText: { fontSize: 14, fontWeight: "800", color: "#071209" },
  permBack:    { marginTop: 10 },
  permBackText: { fontSize: 13, color: "rgba(255,255,255,0.4)", fontWeight: "600" },

  indoorOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.72)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 25,
  },
  indoorCard: {
    backgroundColor: "#0d1a10",
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#ffc107",
    padding: 28,
    alignItems: "center",
    gap: 10,
    width: W - 48,
  },
  indoorIcon:  { fontSize: 48 },
  indoorTitle: { fontSize: 18, fontWeight: "900", color: "#ffc107", textAlign: "center" },
  indoorBody:  { fontSize: 13, color: "rgba(255,255,255,0.6)", textAlign: "center", lineHeight: 20 },
  indoorBtn: {
    marginTop: 8,
    backgroundColor: "#ffc107",
    borderRadius: 999,
    paddingHorizontal: 28, paddingVertical: 11,
  },
  indoorBtnText: { fontSize: 13, fontWeight: "800", color: "#071209" },
});
