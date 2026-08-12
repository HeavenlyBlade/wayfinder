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
import { CameraView, useCameraPermissions } from "expo-camera";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import useLocation from "../hooks/useLocation";
import { projectToScreen, distanceTo } from "../utils/arMath";
import { aStar, getWaypoints, nearestNode } from "../utils/pathfinding";
import { NODES } from "../constants/campusGraph";
import { BUILDINGS } from "../constants/buildings";
import { fetchRoute } from "../services/api";
import { colors, radius } from "../constants/theme";
import { IconArrowLeft } from "../components/icons/index";

const { width: W, height: H } = Dimensions.get("window");

// ── Tuning constants ──────────────────────────────────────────────────────────
const ORB_SPACING_METRES = 7;   // metres between consecutive orbs in the trail
const ORB_ADVANCE_DIST   = 3;   // metres — consume an orb once this close
const ARRIVAL_DIST       = 6;   // metres to destination before showing arrival
const MAX_VISIBLE_ORBS   = 6;   // max orbs rendered on screen at once
const MAX_RENDER_DIST    = 45;  // metres — orbs beyond this are not rendered
const H_FOV              = 65;  // horizontal field of view (degrees)

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Linearly interpolate GPS points between two nodes, spaced ~spacingM metres apart. */
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

/** Build the full orb trail from an ordered list of GPS waypoints. */
function buildOrbTrail(waypoints) {
  const orbs = [];
  for (let i = 0; i < waypoints.length - 1; i++) {
    orbs.push(...interpolateSegment(waypoints[i], waypoints[i + 1], ORB_SPACING_METRES));
  }
  // Always include the exact destination as the final orb
  if (waypoints.length > 0) {
    const last = waypoints[waypoints.length - 1];
    orbs.push({ lat: last.lat, lng: last.lng, isDestination: true });
  }
  return orbs;
}

/** Convert a compass bearing to a cardinal / intercardinal label. */
function cardinalLabel(deg) {
  const dirs = ["N","NE","E","SE","S","SW","W","NW"];
  return dirs[Math.round(deg / 45) % 8];
}

/** Arrow character pointing in the general direction of the next orb. */
function directionArrow(angleDiff) {
  if (angleDiff === null) return "⬆️";
  const abs = Math.abs(angleDiff);
  if (abs < 20) return "⬆️";
  if (abs < 60) return angleDiff < 0 ? "↖️" : "↗️";
  return angleDiff < 0 ? "⬅️" : "➡️";
}

// ── Single animated orb ───────────────────────────────────────────────────────
function AROrb({ x, y, size, isNext, isDestination }) {
  const pulse  = useRef(new Animated.Value(1)).current;
  const floatY = useRef(new Animated.Value(0)).current;
  const glowOp = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse,  { toValue: isNext ? 1.35 : 1.2,  duration: 800, useNativeDriver: true }),
        Animated.timing(pulse,  { toValue: 1,                     duration: 800, useNativeDriver: true }),
      ]),
    );
    const floatLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatY, { toValue: isNext ? -9 : -5, duration: 1100, useNativeDriver: true }),
        Animated.timing(floatY, { toValue: 0,                duration: 1100, useNativeDriver: true }),
      ]),
    );
    const glowLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(glowOp, { toValue: 0.7, duration: 900, useNativeDriver: true }),
        Animated.timing(glowOp, { toValue: 0.2, duration: 900, useNativeDriver: true }),
      ]),
    );
    pulseLoop.start();
    floatLoop.start();
    glowLoop.start();
    return () => {
      pulseLoop.stop();
      floatLoop.stop();
      glowLoop.stop();
    };
  }, [isNext]);

  // Colour coding: destination = white, next = bright green, rest = softer green
  const orbColor  = isDestination ? "#ffffff" : isNext ? colors.primary : "rgba(0,200,83,0.75)";
  const glowColor = isDestination ? "#ffffff" : colors.primary;
  const glowSize  = size * 2.2;

  return (
    <Animated.View
      style={[
        s.orbContainer,
        {
          left: x - glowSize / 2,
          top:  y - glowSize / 2,
          width:  glowSize,
          height: glowSize,
          transform: [{ scale: pulse }, { translateY: floatY }],
        },
      ]}
    >
      {/* Outer glow ring */}
      <Animated.View
        style={[
          s.orbGlow,
          {
            width:  glowSize,
            height: glowSize,
            borderRadius: glowSize / 2,
            borderColor: glowColor,
            opacity: glowOp,
          },
        ]}
      />
      {/* Inner orb */}
      <View
        style={[
          s.orb,
          {
            width:        size,
            height:       size,
            borderRadius: size / 2,
            backgroundColor: orbColor,
            shadowColor:  glowColor,
            shadowRadius: size * 0.9,
          },
        ]}
      />
    </Animated.View>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────
export default function ARScreen({ route, navigation }) {
  const { destinationId = "main_building" } = route.params ?? {};

  const [permission, requestPermission] = useCameraPermissions();
  const { location, heading, error: locError } = useLocation();

  const [orbPositions, setOrbPositions] = useState([]);
  const [distToNext,   setDistToNext]   = useState(null);
  const [totalDist,    setTotalDist]    = useState(null);
  const [arrived,      setArrived]      = useState(false);
  const [routeReady,   setRouteReady]   = useState(false); // true once we have a trail
  const [nextAngle,    setNextAngle]    = useState(null);  // angleDiff to next orb

  const orbTrailRef     = useRef([]); // mutable trail — orbs consumed as user walks
  const routeLoadedRef  = useRef(false);

  // ── Build orb trail once GPS is available ──────────────────────────────────
  const loadRoute = useCallback(async (loc) => {
    if (routeLoadedRef.current) return;
    routeLoadedRef.current = true;

    let waypoints = [];

    // 1. Try server-side route first
    try {
      waypoints = await fetchRoute(loc.lat, loc.lng, destinationId);
    } catch (_) {}

    // 2. Fall back to on-device A* if server failed or returned nothing
    if (!waypoints || waypoints.length === 0) {
      const startNode = nearestNode(loc.lat, loc.lng);
      // destinationId is used directly — aStar handles unknown node IDs
      // by returning [] so the next fallback catches it
      const pathIds = aStar(startNode, destinationId);
      waypoints     = pathIds.length > 0
        ? getWaypoints(pathIds)
        : [];
    }

    // 3. Final fallback: straight line of orbs directly toward destination
    if (!waypoints || waypoints.length === 0) {
      const dest = NODES[destinationId];
      if (dest) {
        waypoints = [{ lat: loc.lat, lng: loc.lng }, { lat: dest.lat, lng: dest.lng }];
      } else {
        // Absolute fallback: 6 orbs straight ahead
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

    // Compute total route distance
    let total = 0;
    const wps = waypoints;
    for (let i = 0; i < wps.length - 1; i++) {
      total += distanceTo(wps[i].lat, wps[i].lng, wps[i + 1].lat, wps[i + 1].lng);
    }
    setTotalDist(Math.round(total));
    setRouteReady(true);
  }, [destinationId]);

  useEffect(() => {
    if (location && !routeLoadedRef.current) {
      loadRoute(location);
    }
  }, [location, loadRoute]);

  // ── Re-route if user drifts far off the current trail ─────────────────────
  useEffect(() => {
    if (!location || !routeReady || arrived) return;
    if (orbTrailRef.current.length === 0) return;

    const next    = orbTrailRef.current[0];
    const offDist = distanceTo(location.lat, location.lng, next.lat, next.lng);

    // If the user is >40m from the next orb, recalculate the route
    if (offDist > 40) {
      routeLoadedRef.current = false;
      setRouteReady(false);
      loadRoute(location);
    }
  }, [location, routeReady, arrived, loadRoute]);

  // ── Project orbs onto screen every location/heading update ────────────────
  useEffect(() => {
    if (!location || orbTrailRef.current.length === 0 || arrived) return;

    // Advance the trail — remove orbs the user has already passed
    while (orbTrailRef.current.length > 0) {
      const next = orbTrailRef.current[0];
      const d    = distanceTo(location.lat, location.lng, next.lat, next.lng);
      if (d < ORB_ADVANCE_DIST) {
        orbTrailRef.current = orbTrailRef.current.slice(1);
      } else {
        break;
      }
    }

    if (orbTrailRef.current.length === 0) {
      setArrived(true);
      setOrbPositions([]);
      return;
    }

    // Check arrival at destination
    const dest = NODES[destinationId];
    if (dest) {
      const d = distanceTo(location.lat, location.lng, dest.lat, dest.lng);
      if (d < ARRIVAL_DIST) {
        setArrived(true);
        setOrbPositions([]);
        return;
      }
    }

    // Project remaining orbs
    const projected = orbTrailRef.current
      .slice(0, MAX_VISIBLE_ORBS + 5) // project a few extra, then filter
      .map((orb, idx) => {
        const proj = projectToScreen({
          userLat:        location.lat,
          userLng:        location.lng,
          targetLat:      orb.lat,
          targetLng:      orb.lng,
          compassHeading: heading,
          hFov:           H_FOV,
          screenW:        W,
          screenH:        H,
        });
        return { ...proj, idx, isDestination: !!orb.isDestination };
      })
      .filter(p => p.visible && p.distance < MAX_RENDER_DIST)
      .slice(0, MAX_VISIBLE_ORBS);

    setOrbPositions(projected);

    // Update distance to the very next orb
    const next = orbTrailRef.current[0];
    const d    = distanceTo(location.lat, location.lng, next.lat, next.lng);
    setDistToNext(Math.round(d));

    // Compute turn angle for the directional arrow
    if (projected.length > 0) {
      setNextAngle(projected[0].angleDiff);
    }
  }, [location, heading, arrived, destinationId]);

  // ── Destination display name ───────────────────────────────────────────────
  const destBuilding = BUILDINGS[destinationId];
  const destName     = destBuilding?.name
    ?? (NODES[destinationId]
        ? destinationId.charAt(0).toUpperCase() + destinationId.slice(1).replace(/_/g, " ")
        : "Destination");

  // ── Permission gates ───────────────────────────────────────────────────────
  if (!permission) {
    return <View style={s.fill} />;
  }

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

  // Loading state: waiting for GPS or route
  const isLoading = !location || !routeReady;

  return (
    <View style={s.fill}>
      <StatusBar style="light" hidden />

      {/* Live camera feed */}
      <CameraView style={StyleSheet.absoluteFill} facing="back" />

      {/* ── AR orb layer ── */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {!arrived && orbPositions.map((orb, i) => (
          <AROrb
            key={`${orb.idx}-${i}`}
            x={orb.x}
            y={orb.y}
            size={orb.orbSize}
            isNext={i === 0}
            isDestination={orb.isDestination}
          />
        ))}
      </View>

      {/* ── Loading overlay ── */}
      {isLoading && !arrived && (
        <View style={s.loadingOverlay}>
          <Text style={s.loadingIcon}>🛰</Text>
          <Text style={s.loadingText}>
            {!location ? "Acquiring GPS signal…" : "Plotting AR path…"}
          </Text>
          <Text style={s.loadingSub}>Point your camera ahead and wait</Text>
        </View>
      )}

      {/* ── Top HUD: direction box ── */}
      {!isLoading && !arrived && (
        <SafeAreaView style={s.hudTop} edges={["top"]} pointerEvents="none">
          <View style={s.directionBox}>
            <Text style={s.directionArrow}>{directionArrow(nextAngle)}</Text>
            <Text style={s.directionText}>Follow the orbs</Text>
          </View>

          {/* Destination pill */}
          <View style={s.destPill}>
            <Text style={s.destPillIcon}>📍</Text>
            <Text style={s.destPillText} numberOfLines={1}>{destName}</Text>
          </View>
        </SafeAreaView>
      )}

      {/* ── Compass ── */}
      {!isLoading && (
        <View style={s.compass} pointerEvents="none">
          <Text style={s.compassN}>N</Text>
          <Text style={s.compassCard}>{cardinalLabel(heading)}</Text>
          <Text style={s.compassDeg}>{Math.round(heading)}°</Text>
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

      {/* ── Arrival banner ── */}
      {arrived && (
        <View style={s.arrivalOverlay}>
          <View style={s.arrivalCard}>
            <Text style={s.arrivalIcon}>✅</Text>
            <Text style={s.arrivalTitle}>You have arrived!</Text>
            <Text style={s.arrivalSub}>{destName}</Text>
            <TouchableOpacity
              style={s.arrivalBtn}
              onPress={() => navigation.goBack()}
              activeOpacity={0.85}
            >
              <Text style={s.arrivalBtnText}>← Back to Map</Text>
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

  // Orb rendering
  orbContainer: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  orbGlow: {
    position: "absolute",
    borderWidth: 1.5,
  },
  orb: {
    shadowOpacity: 0.9,
    shadowOffset: { width: 0, height: 0 },
  },

  // Loading overlay
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.72)",
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
    zIndex: 20,
  },
  loadingIcon: { fontSize: 52 },
  loadingText: { fontSize: 18, fontWeight: "800", color: colors.primary, letterSpacing: 0.5 },
  loadingSub:  { fontSize: 13, color: "rgba(255,255,255,0.45)", textAlign: "center", paddingHorizontal: 40 },

  // Top HUD
  hudTop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingTop: Platform.OS === "android" ? 40 : 10,
    gap: 8,
  },
  directionBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "rgba(0,0,0,0.78)",
    borderRadius: radius.full,
    paddingHorizontal: 22,
    paddingVertical: 11,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  directionArrow: { fontSize: 22 },
  directionText:  { fontSize: 16, fontWeight: "800", color: "#fff" },

  destPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(0,0,0,0.65)",
    borderRadius: radius.full,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: "rgba(0,200,83,0.25)",
    maxWidth: W - 80,
  },
  destPillIcon: { fontSize: 13 },
  destPillText: { fontSize: 12, fontWeight: "700", color: "#fff" },

  // Compass widget
  compass: {
    position: "absolute",
    top: Platform.OS === "android" ? 50 : 60,
    right: 16,
    width: 54,
    height: 54,
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

  // Distance HUD
  distHud: {
    position: "absolute",
    bottom: 200,
    left: 16,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: "center",
    minWidth: 70,
  },
  distVal:   { fontSize: 26, fontWeight: "900", color: colors.primaryText },
  distLabel: { fontSize: 10, fontWeight: "700", color: "rgba(7,18,9,0.65)" },
  totalDist: { fontSize: 9,  color: "rgba(7,18,9,0.5)", marginTop: 2 },

  // Arrival overlay
  arrivalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 30,
  },
  arrivalCard: {
    backgroundColor: "#0d1a10",
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.primary,
    padding: 32,
    alignItems: "center",
    gap: 8,
    width: W - 48,
  },
  arrivalIcon:    { fontSize: 52 },
  arrivalTitle:   { fontSize: 22, fontWeight: "900", color: colors.primary },
  arrivalSub:     { fontSize: 14, color: "rgba(255,255,255,0.5)", textAlign: "center" },
  arrivalBtn: {
    marginTop: 12,
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    paddingHorizontal: 28,
    paddingVertical: 12,
  },
  arrivalBtnText: { fontSize: 14, fontWeight: "800", color: colors.primaryText },

  // Back button — same circle style used across all screens
  backWrap: { position: "absolute", top: 0, left: 0 },
  backBtn: {
    marginTop: Platform.OS === "android" ? 40 : 10,
    marginLeft: 16,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },

  // Permission / error screen
  permIcon: { fontSize: 52 },
  permText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  permSub: {
    fontSize: 13,
    color: "rgba(255,255,255,0.45)",
    textAlign: "center",
    paddingHorizontal: 30,
  },
  permBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingHorizontal: 28,
    paddingVertical: 13,
    marginTop: 8,
  },
  permBtnText: { fontSize: 14, fontWeight: "800", color: colors.primaryText },
  permBack:    { marginTop: 10 },
  permBackText: { fontSize: 13, color: "rgba(255,255,255,0.4)", fontWeight: "600" },
});
