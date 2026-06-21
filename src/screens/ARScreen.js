import { fetchRoute } from "../services/api";
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableOpacity,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import useLocation from "../hooks/useLocation";
import { projectToScreen, distanceTo } from "../utils/arMath";
import { aStar, getWaypoints } from "../utils/pathfinding";
import { NODES } from "../constants/campusGraph";
import { colors, radius } from "../constants/theme";

const { width: W, height: H } = Dimensions.get("window");

// How many orbs to place along the path
const ORB_SPACING_METRES = 8;

// Find nearest graph node to the user's current GPS position
function nearestNode(lat, lng) {
  let best = null,
    bestDist = Infinity;
  for (const [id, node] of Object.entries(NODES)) {
    const d = distanceTo(lat, lng, node.lat, node.lng);
    if (d < bestDist) {
      bestDist = d;
      best = id;
    }
  }
  return best;
}

// Interpolate N evenly-spaced points between two GPS coords
function interpolatePoints(a, b, spacingM) {
  const totalDist = distanceTo(a.lat, a.lng, b.lat, b.lng);
  const steps = Math.max(1, Math.floor(totalDist / spacingM));
  const points = [];
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    points.push({
      lat: a.lat + (b.lat - a.lat) * t,
      lng: a.lng + (b.lng - a.lng) * t,
    });
  }
  return points;
}

// Build the full orb trail from a path of node IDs
function buildOrbTrail(pathIds) {
  const waypoints = getWaypoints(pathIds);
  const orbs = [];
  for (let i = 0; i < waypoints.length - 1; i++) {
    const pts = interpolatePoints(
      waypoints[i],
      waypoints[i + 1],
      ORB_SPACING_METRES,
    );
    orbs.push(...pts);
  }
  return orbs;
}

// Single animated orb component
function AROrb({ x, y, size, distance, isNext }) {
  const pulse = useRef(new Animated.Value(1)).current;
  const floatY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Pulsing scale
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.25,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
      ]),
    ).start();
    // Float up/down
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatY, {
          toValue: -6,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(floatY, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        s.orb,
        {
          left: x - size / 2,
          top: y - size / 2,
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: isNext ? "#ffffff" : colors.primary,
          opacity: isNext ? 1 : 0.85,
          transform: [{ scale: pulse }, { translateY: floatY }],
          shadowColor: colors.primary,
          shadowOpacity: 0.8,
          shadowRadius: size * 0.8,
          elevation: 10,
        },
      ]}
    />
  );
}

export default function ARScreen({ route, navigation }) {
  const { destinationId } = route.params ?? { destinationId: "main" };
  const [permission, requestPermission] = useCameraPermissions();
  const { location, heading, error: locError } = useLocation();
  const [orbPositions, setOrbPositions] = useState([]);
  const [distToNext, setDistToNext] = useState(null);
  const [arrived, setArrived] = useState(false);
  const orbTrailRef = useRef([]);

  // Build orb trail once we have user location
  useEffect(() => {
    if (!location) return;

    async function loadRoute() {
      // Fetch real A* route from backend
      const waypoints = await fetchRoute(
        location.lat,
        location.lng,
        destinationId,
      );

      if (waypoints.length > 0) {
        // Interpolate orbs between each waypoint
        const orbs = [];
        for (let i = 0; i < waypoints.length - 1; i++) {
          const pts = interpolatePoints(
            waypoints[i],
            waypoints[i + 1],
            ORB_SPACING_METRES,
          );
          orbs.push(...pts);
        }
        orbTrailRef.current = orbs;
      } else {
        // Fallback: straight line ahead (test mode)
        const testOrbs = [];
        for (let i = 1; i <= 6; i++) {
          const distM = i * 8;
          const dLat = (distM / 6371000) * (180 / Math.PI);
          testOrbs.push({ lat: location.lat + dLat, lng: location.lng });
        }
        orbTrailRef.current = testOrbs;
      }
    }

    loadRoute();
  }, [location?.lat, location?.lng, destinationId]);

  // Project orbs onto screen every time heading or location changes
  useEffect(() => {
    if (!location || orbTrailRef.current.length === 0) return;

    const projected = orbTrailRef.current
      .map((orb, index) => {
        const proj = projectToScreen({
          userLat: location.lat,
          userLng: location.lng,
          targetLat: orb.lat,
          targetLng: orb.lng,
          compassHeading: heading,
          screenW: W,
          screenH: H,
        });
        return { ...proj, index };
      })
      .filter((p) => p.visible && p.distance < 40)
      .slice(0, 5);

    setOrbPositions(projected);

    // Distance to very next orb
    if (orbTrailRef.current.length > 0) {
      const next = orbTrailRef.current[0];
      const d = distanceTo(location.lat, location.lng, next.lat, next.lng);
      setDistToNext(Math.round(d));

      // Remove orbs the user has walked past
      if (d < 2.5) {
        orbTrailRef.current = orbTrailRef.current.slice(1);
      }

      // Arrived when trail is empty
      if (orbTrailRef.current.length === 0) setArrived(true);
    }
  }, [location, heading]);

  // Permission not granted yet
  if (!permission) return <View style={s.fill} />;
  if (!permission.granted) {
    return (
      <View style={[s.fill, s.center]}>
        <Text style={s.permText}>Camera access needed for AR</Text>
        <TouchableOpacity style={s.permBtn} onPress={requestPermission}>
          <Text style={s.permBtnText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={s.fill}>
      {/* ── Loading overlay — shows until orbs are ready ── */}
      {orbPositions.length === 0 && !arrived && (
        <View style={s.loadingOverlay}>
          <Text style={s.loadingIcon}>🛰</Text>
          <Text style={s.loadingText}>Calibrating AR orbs...</Text>
          <Text style={s.loadingSub}>Please wait and look straight ahead</Text>
        </View>
      )}

      {/* ── Live camera ── */}
      <CameraView style={StyleSheet.absoluteFill} facing="back" />

      {/* ── AR orb layer (drawn over camera) ── */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {orbPositions.map((orb, i) => (
          <AROrb
            key={i}
            x={orb.x}
            y={orb.y}
            size={orb.orbSize}
            distance={orb.distance}
            isNext={i === 0}
          />
        ))}
      </View>

      {/* ── Top HUD ── */}
      <View style={s.hudTop}>
        <View style={s.directionBox}>
          <Text style={s.directionIcon}>⬆️</Text>
          <Text style={s.directionText}>Follow the orbs</Text>
        </View>
      </View>

      {/* ── Compass ── */}
      <View style={s.compass}>
        <Text style={s.compassText}>N</Text>
        <Text style={s.compassDeg}>{Math.round(heading)}°</Text>
      </View>

      {/* ── Distance HUD ── */}
      {distToNext !== null && !arrived && (
        <View style={s.distHud}>
          <Text style={s.distVal}>{distToNext}m</Text>
          <Text style={s.distLabel}>to next waypoint</Text>
        </View>
      )}

      {/* ── Destination label ── */}
      <View style={s.destLabel}>
        <Text style={s.destIcon}>📍</Text>
        <Text style={s.destText}>
          {NODES[destinationId]
            ? destinationId.charAt(0).toUpperCase() + destinationId.slice(1)
            : "Destination"}
        </Text>
      </View>

      {/* ── Arrival banner ── */}
      {arrived && (
        <View style={s.arrivalBanner}>
          <Text style={s.arrivalTitle}>✅ You have arrived!</Text>
          <Text style={s.arrivalSub}>Destination reached</Text>
        </View>
      )}

      {/* ── Back button ── */}
      <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
        <Text style={s.backText}>← Map</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  fill: { flex: 1, backgroundColor: "#000" },
  center: { alignItems: "center", justifyContent: "center" },
  orb: {
    position: "absolute",
    shadowOffset: { width: 0, height: 0 },
  },

  // Top direction box
  hudTop: {
    position: "absolute",
    top: 60,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  directionBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "rgba(0,0,0,0.75)",
    borderRadius: radius.full,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  directionIcon: { fontSize: 22 },
  directionText: { fontSize: 16, fontWeight: "800", color: "#fff" },

  // Compass
  compass: {
    position: "absolute",
    top: 70,
    right: 16,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(0,0,0,0.75)",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  compassText: { fontSize: 13, fontWeight: "800", color: "#ff6b6b" },
  compassDeg: { fontSize: 9, color: "rgba(255,255,255,0.5)" },

  // Distance HUD
  distHud: {
    position: "absolute",
    bottom: 180,
    left: 16,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  distVal: { fontSize: 24, fontWeight: "900", color: colors.primaryText },
  distLabel: { fontSize: 10, fontWeight: "700", color: "#056a4a" },

  // Destination label pill
  destLabel: {
    position: "absolute",
    bottom: 180,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(0,0,0,0.75)",
    borderRadius: radius.full,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  destIcon: { fontSize: 14 },
  destText: { fontSize: 13, fontWeight: "700", color: "#fff" },

  // Arrival banner
  arrivalBanner: {
    position: "absolute",
    top: 140,
    left: 20,
    right: 20,
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    padding: 20,
    alignItems: "center",
  },
  arrivalTitle: { fontSize: 20, fontWeight: "900", color: colors.primaryText },
  arrivalSub: { fontSize: 13, color: "#056a4a", marginTop: 4 },

  // Back button
  backBtn: {
    position: "absolute",
    top: 60,
    left: 16,
    backgroundColor: "rgba(0,0,0,0.75)",
    borderRadius: radius.full,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  backText: { fontSize: 14, fontWeight: "700", color: "#fff" },

  // Permission screen
  permText: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
  },
  permBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  permBtnText: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.primaryText,
  },
  loadingOverlay: {
    position: "absolute",
    inset: 0,
    zIndex: 99,
    backgroundColor: "rgba(0,0,0,0.75)",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  loadingIcon: { fontSize: 48 },
  loadingText: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.primary,
    letterSpacing: 0.5,
  },
  loadingSub: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: "center",
    paddingHorizontal: 40,
    lineHeight: 20,
  },
});
