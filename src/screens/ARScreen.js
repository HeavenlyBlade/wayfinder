import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  Easing,
  TouchableOpacity,
  Platform,
} from "react-native";
import Svg, { Path, G, Defs, LinearGradient, RadialGradient, Stop, Polygon, Ellipse } from "react-native-svg";
import { CameraView, useCameraPermissions } from "expo-camera";
import MapView, {
  Polyline, Marker, PROVIDER_GOOGLE, UrlTile,
} from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import useLocation from "../hooks/useLocation";
import { setCompassOffset, getCompassOffset } from "../hooks/useLocation";
import { bearingTo, distanceTo, projectToScreen } from "../utils/arMath";
import { aStar, getWaypoints, nearestNode } from "../utils/pathfinding";
import { getIndoorStatus, TWO_STAIRCASE_BUILDINGS } from "../utils/indoorDetection";
import { NODES } from "../constants/campusGraph";
import { BUILDINGS } from "../constants/buildings";
import { fetchRoute } from "../services/api";
import { IconArrowLeft } from "../components/icons/index";
import { useSettings } from "../context/SettingsContext";
import { t } from "../constants/i18n";
import StaircasePicker from "../components/StaircasePicker";
import ArrivalPrompt from "../components/ArrivalPrompt";
import BearingHUD from "../components/BearingHUD";
import CompassCalibrator from "../components/CompassCalibrator";
import ARTutorial from "../components/ARTutorial";

const { width: W, height: H } = Dimensions.get("window");
const GREEN       = "#00C853";
const CAM_HEIGHT  = H * 0.58;   // top 58% = camera
const MAP_HEIGHT  = H * 0.42;   // bottom 42% = map

// ── Tuning ────────────────────────────────────────────────────────────────────
const ORB_SPACING_METRES = 6;
const ORB_ADVANCE_DIST   = 4;
const ARRIVAL_DIST       = 12;

// ── Waypoint interpolation ────────────────────────────────────────────────────
function interpolateSegment(a, b, spacingM) {
  const total = distanceTo(a.lat, a.lng, b.lat, b.lng);
  const steps = Math.max(1, Math.floor(total / spacingM));
  const pts   = [];
  for (let i = 1; i <= steps; i++) {
    const ratio = i / steps;
    pts.push({ lat: a.lat + (b.lat - a.lat) * ratio, lng: a.lng + (b.lng - a.lng) * ratio });
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

// Buildings that should NOT trigger the indoor room-finder prompt on arrival.
const NO_INDOOR_PROMPT = new Set([
  'gate', 'motorcycle_parking', 'parking_lot',
  'main_building_2', 'ea_tower_2', 'sr_building_2',
]);

// ── Simple connectivity check via fetch ping ─────────────────────────────────
async function checkOnline() {
  try {
    const res = await fetch('https://tile.openstreetmap.org/0/0/0.png', {
      method: 'HEAD',
      cache: 'no-store',
    });
    return res.ok;
  } catch (_) {
    return false;
  }
}

// ── 3D Navigation Arrow ───────────────────────────────────────────────────────
function NavigationArrow({ angleDiff }) {
  const rotAnim = useRef(new Animated.Value(angleDiff ?? 0)).current;

  useEffect(() => {
    const current = rotAnim.__getValue ? rotAnim.__getValue() : 0;
    let target = angleDiff ?? 0;
    let diff = target - (current % 360);
    if (diff > 180)  diff -= 360;
    if (diff < -180) diff += 360;
    Animated.timing(rotAnim, {
      toValue: current + diff,
      duration: 80,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [angleDiff]);

  const rotation = rotAnim.interpolate({
    inputRange:  [-360, 360],
    outputRange: ["-360deg", "360deg"],
  });

  const isBehind   = Math.abs(angleDiff ?? 0) > 120;
  const baseColor  = isBehind ? "#ff5555" : GREEN;
  const topColor   = isBehind ? "#ff8888" : "#4dff91";
  const sideColorL = isBehind ? "#cc3333" : "#00993d";
  const sideColorR = isBehind ? "#992222" : "#006628";
  const backColor  = isBehind ? "#7a1a1a" : "#004d1f";

  const TOP = {
    tipX: 50,  tipY: 3,
    wL:  16,   wLy: 50,
    wR:  84,   wRy: 50,
    nL:  36,   nLy: 44,
    nR:  64,   nRy: 44,
    sL:  36,   sLy:108,
    sR:  64,   sRy:108,
  };
  const topPoints =
    `${TOP.tipX},${TOP.tipY} ${TOP.wR},${TOP.wRy} ${TOP.nR},${TOP.nRy} ` +
    `${TOP.sR},${TOP.sRy} ${TOP.sL},${TOP.sLy} ${TOP.nL},${TOP.nLy} ${TOP.wL},${TOP.wLy}`;

  const DX = 6;
  const DY = 8;

  const backPoints =
    `${TOP.tipX+DX},${TOP.tipY+DY} ${TOP.wR+DX},${TOP.wRy+DY} ${TOP.nR+DX},${TOP.nRy+DY} ` +
    `${TOP.sR+DX},${TOP.sRy+DY} ${TOP.sL+DX},${TOP.sLy+DY} ${TOP.nL+DX},${TOP.nLy+DY} ${TOP.wL+DX},${TOP.wLy+DY}`;

  const rightWall =
    `${TOP.tipX},${TOP.tipY} ${TOP.wR},${TOP.wRy} ${TOP.nR},${TOP.nRy} ${TOP.sR},${TOP.sRy} ` +
    `${TOP.sR+DX},${TOP.sRy+DY} ${TOP.nR+DX},${TOP.nRy+DY} ${TOP.wR+DX},${TOP.wRy+DY} ${TOP.tipX+DX},${TOP.tipY+DY}`;

  const leftWall =
    `${TOP.tipX},${TOP.tipY} ${TOP.wL},${TOP.wLy} ${TOP.nL},${TOP.nLy} ${TOP.sL},${TOP.sLy} ` +
    `${TOP.sL+DX},${TOP.sLy+DY} ${TOP.nL+DX},${TOP.nLy+DY} ${TOP.wL+DX},${TOP.wLy+DY} ${TOP.tipX+DX},${TOP.tipY+DY}`;

  const bottomWall =
    `${TOP.sL},${TOP.sLy} ${TOP.sR},${TOP.sRy} ` +
    `${TOP.sR+DX},${TOP.sRy+DY} ${TOP.sL+DX},${TOP.sLy+DY}`;

  return (
    <Animated.View
      style={[s.arrowContainer, { transform: [{ rotate: rotation }] }]}
      pointerEvents="none"
    >
      <Svg width={96} height={120} viewBox="0 0 106 126" pointerEvents="none">
        <Defs>
          <LinearGradient id="topGrad" x1="0.5" y1="0" x2="0.5" y2="1">
            <Stop offset="0"   stopColor={topColor}  stopOpacity="1" />
            <Stop offset="0.5" stopColor={baseColor} stopOpacity="1" />
            <Stop offset="1"   stopColor={sideColorL} stopOpacity="1" />
          </LinearGradient>
          <RadialGradient id="shadowGrad" cx="50%" cy="50%" r="50%">
            <Stop offset="0"   stopColor="#000000" stopOpacity="0.55" />
            <Stop offset="1"   stopColor="#000000" stopOpacity="0" />
          </RadialGradient>
        </Defs>

        <Ellipse
          cx={53 + DX / 2}
          cy={112}
          rx={22}
          ry={6}
          fill="url(#shadowGrad)"
        />

        <Polygon
          points={backPoints}
          fill={backColor}
          opacity={0.85}
        />

        <Polygon
          points={rightWall}
          fill={sideColorR}
        />

        <Polygon
          points={leftWall}
          fill={sideColorL}
        />

        <Polygon
          points={bottomWall}
          fill={backColor}
        />

        <Polygon
          points={topPoints}
          fill="url(#topGrad)"
          stroke="rgba(255,255,255,0.55)"
          strokeWidth={1.2}
          strokeLinejoin="round"
        />

        <Path
          d={`M${TOP.tipX},${TOP.tipY} L${TOP.wL},${TOP.wLy} L${TOP.nL},${TOP.nLy} L${TOP.sL},${TOP.sLy}`}
          fill="none"
          stroke="rgba(255,255,255,0.45)"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
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

  const [distToNext,    setDistToNext]    = useState(null);
  const [totalDist,     setTotalDist]     = useState(null);
  const [arrived,       setArrived]       = useState(false);
  const [routeReady,    setRouteReady]    = useState(false);
  const [nextAngle,     setNextAngle]     = useState(0);
  const [indoorStatus,  setIndoorStatus]  = useState(null);
  const [compassOffset, setCompassOffsetState] = useState(getCompassOffset());
  const [routeCoords,   setRouteCoords]   = useState(null);
  const [staircasePickerVisible, setStaircasePickerVisible] = useState(false);
  const [selectedStaircase,      setSelectedStaircase]      = useState(null);
  const [arrivalPromptVisible,   setArrivalPromptVisible]   = useState(false);
  const [isOffline,     setIsOffline]     = useState(false);
  const [miniMapError,  setMiniMapError]  = useState(false);

  const orbTrailRef     = useRef([]);
  const waypointsRef    = useRef([]);
  const routeLoadedRef  = useRef(false);
  const arrivedRef      = useRef(false);
  const arrivalCountRef = useRef(0);
  const miniMapRef      = useRef(null);
  const isReroutingRef  = useRef(false);

  // ── Connectivity check ─────────────────────────────────────────────────────
  useEffect(() => {
    checkOnline().then(online => setIsOffline(!online));
  }, []);

  const handleMiniMapError = useCallback(() => {
    setMiniMapError(true);
    setIsOffline(true);
  }, []);

  function handleOffsetChange(newOffset) {
    setCompassOffset(newOffset);
    setCompassOffsetState(newOffset);
  }

  // ── Reset all state when destinationId changes ────────────────────────────
  useEffect(() => {
    orbTrailRef.current     = [];
    waypointsRef.current    = [];
    routeLoadedRef.current  = false;
    arrivedRef.current      = false;
    arrivalCountRef.current = 0;
    isReroutingRef.current  = false;
    setRouteReady(false);
    setArrived(false);
    setDistToNext(null);
    setTotalDist(null);
    setRouteCoords(null);
    setNextAngle(0);
    setStaircasePickerVisible(false);
    setArrivalPromptVisible(false);
    setSelectedStaircase(null);
  }, [destinationId]);

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
      waypoints = dest
        ? [{ lat: loc.lat, lng: loc.lng }, { lat: dest.lat, lng: dest.lng }]
        : [];
    }

    orbTrailRef.current  = buildOrbTrail(waypoints);
    waypointsRef.current = waypoints;

    setRouteCoords(waypoints.map(w => ({ latitude: w.lat, longitude: w.lng })));

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

  // ── Re-route ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!location || !routeReady || arrivedRef.current) return;
    if (orbTrailRef.current.length === 0) return;
    const next    = orbTrailRef.current[0];
    const offDist = distanceTo(location.lat, location.lng, next.lat, next.lng);
    if (offDist > 40 && !isReroutingRef.current) {
      isReroutingRef.current = true;
      routeLoadedRef.current = false;
      loadRoute(location).finally(() => {
        isReroutingRef.current = false;
      });
    }
  }, [location, routeReady, loadRoute]);

  // ── Update arrow angle + arrival check ───────────────────────────────────
  useEffect(() => {
    if (!location || orbTrailRef.current.length === 0 || arrivedRef.current) return;

    while (orbTrailRef.current.length > 0) {
      const next = orbTrailRef.current[0];
      const d    = distanceTo(location.lat, location.lng, next.lat, next.lng);
      if (d < ORB_ADVANCE_DIST) {
        orbTrailRef.current = orbTrailRef.current.slice(1);
      } else break;
    }

    function handleArrival() {
      arrivedRef.current = true;
      setArrived(true);
      if (NO_INDOOR_PROMPT.has(destinationId)) return;
      if (BUILDINGS[destinationId] && TWO_STAIRCASE_BUILDINGS.has(destinationId)) {
        setStaircasePickerVisible(true);
      } else {
        setArrivalPromptVisible(true);
      }
    }

    if (orbTrailRef.current.length === 0) {
      handleArrival();
      return;
    }

    const dest = NODES[destinationId];
    if (dest) {
      const d = distanceTo(location.lat, location.lng, dest.lat, dest.lng);
      if (d < ARRIVAL_DIST) {
        arrivalCountRef.current += 1;
        if (arrivalCountRef.current >= 2) {
          handleArrival();
          return;
        }
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

    const d = distanceTo(location.lat, location.lng, next.lat, next.lng);
    setDistToNext(Math.round(d));

    if (miniMapRef.current && location) {
      miniMapRef.current.animateToRegion({
        latitude:       location.lat,
        longitude:      location.lng,
        latitudeDelta:  0.002,
        longitudeDelta: 0.002,
      }, 800);
    }

  }, [location, heading, destinationId, indoorStatus]);

  // ── Project orb trail onto camera screen ─────────────────────────────────
  const projectedOrbs = useMemo(() => {
    if (!location || heading == null || orbTrailRef.current.length === 0) return [];
    const nextFive = orbTrailRef.current.slice(0, 5);
    return nextFive.map((wp, i) => {
      const projected = projectToScreen({
        userLat: location.lat,
        userLng: location.lng,
        targetLat: wp.lat,
        targetLng: wp.lng,
        compassHeading: heading,
        hFov: 65,
        screenW: W,
        screenH: CAM_HEIGHT,
      });
      return { ...projected, key: i };
    }).filter(p => p.visible);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, heading]);

  // ── Destination info ──────────────────────────────────────────────────────
  const destBuilding = BUILDINGS[destinationId];
  const destName     = destBuilding?.name
    ?? (NODES[destinationId]
        ? destinationId.charAt(0).toUpperCase() + destinationId.slice(1).replace(/_/g, " ")
        : "Destination");
  const destNode = NODES[destinationId];

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

  const isLoading = !location || !routeReady;

  // Mini-map props: online = Google satellite, offline = OSM tile fallback
  const miniMapProps = isOffline
    ? { mapType: "none" }
    : { provider: PROVIDER_GOOGLE, mapType: "satellite" };

  return (
    <View style={s.fill}>
      <StatusBar style="light" hidden />

      {/* ═══════════════════════════════════════════════════════════
          TOP 58% — LIVE CAMERA + ARROW
      ═══════════════════════════════════════════════════════════ */}
      <View style={s.cameraSection}>

        {/* Camera feed */}
        <CameraView style={StyleSheet.absoluteFill} facing="back" />

        {/* AR orb trail — projected waypoints */}
        {!isLoading && !arrived && projectedOrbs.map((orb) => {
          const ORB_RADIUS = orb.orbSize ? orb.orbSize / 2 : 12;
          return (
            <Animated.View
              key={orb.key}
              style={[
                s.arOrb,
                {
                  position: 'absolute',
                  left: orb.x - ORB_RADIUS,
                  top: orb.y - ORB_RADIUS,
                  width: ORB_RADIUS * 2,
                  height: ORB_RADIUS * 2,
                  borderRadius: ORB_RADIUS,
                },
              ]}
            />
          );
        })}

        {/* Loading overlay */}
        {isLoading && !arrived && (
          <View style={s.loadingOverlay}>
            <Text style={s.loadingIcon}>[...]</Text>
            <Text style={s.loadingText}>
              {!location ? t('ar.gpsAcquiring', lang) : t('ar.plotting', lang)}
            </Text>
            <Text style={s.loadingSub}>{t('ar.pointAhead', lang)}</Text>
          </View>
        )}

        {/* Indoor warning */}
        {indoorStatus && !arrived && !isLoading && (
          <View style={s.indoorBanner}>
            <Text style={s.indoorBannerText}>{t('ar.indoor.title', lang)}</Text>
            <TouchableOpacity onPress={() => setIndoorStatus(null)}>
              <Text style={s.indoorBannerDismiss}>{t('ar.indoor.dismiss', lang)}</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* BearingHUD arc — top of camera */}
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

        {/* Single rotating arrow — ALWAYS visible during navigation */}
        {!isLoading && !arrived && (
          <View style={s.arrowWrap} pointerEvents="none">
            <NavigationArrow angleDiff={nextAngle} />
          </View>
        )}

        {/* Distance chip — bottom-left of camera */}
        {!isLoading && !arrived && distToNext !== null && (
          <View style={s.distChip} pointerEvents="none">
            <Text style={s.distVal}>{distToNext}m</Text>
            <Text style={s.distLabel}>{t('ar.toNext', lang)}</Text>
          </View>
        )}

        {/* Compass calibrator — bottom-right of camera */}
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
            <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.8}>
              <IconArrowLeft size={18} color="#ffffff" />
            </TouchableOpacity>
          </SafeAreaView>
        )}
      </View>

      {/* ═══════════════════════════════════════════════════════════
          BOTTOM 42% — MINI MAP
      ═══════════════════════════════════════════════════════════ */}
      <View style={s.mapSection}>

        {/* Route info bar */}
        <View style={s.routeBar}>
          <View style={s.routeBarLeft}>
            <Text style={s.routeDestName} numberOfLines={1}>{destName}</Text>
            {totalDist != null && (
              <Text style={s.routeTotalDist}>{totalDist}m total</Text>
            )}
          </View>
          {!arrived && (
            <View style={s.routeBarRight}>
              <Text style={s.nextLabel}>{t('ar.nextTurn', lang)}</Text>
              <Text style={s.nextDist}>{distToNext != null ? `${distToNext}m` : "—"}</Text>
            </View>
          )}
        </View>

        {/* Mini map */}
        <MapView
          ref={miniMapRef}
          style={s.miniMap}
          {...miniMapProps}
          initialRegion={{
            latitude:       location?.lat ?? 13.9617,
            longitude:      location?.lng ?? 121.6124,
            latitudeDelta:  0.002,
            longitudeDelta: 0.002,
          }}
          showsUserLocation={true}
          showsMyLocationButton={false}
          showsCompass={false}
          scrollEnabled={false}
          zoomEnabled={false}
          rotateEnabled={false}
          pitchEnabled={false}
          toolbarEnabled={false}
          pointerEvents="none"
          onMapLoadingError={handleMiniMapError}
        >
          {/* OSM tile fallback when offline */}
          {isOffline && (
            <UrlTile
              urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
              maximumZ={19}
              flipY={false}
              zIndex={1}
            />
          )}

          {/* Route polyline */}
          {routeCoords && routeCoords.length > 1 && (
            <>
              <Polyline
                coordinates={routeCoords}
                strokeColor="rgba(0,0,0,0.4)"
                strokeWidth={6}
                lineCap="round"
              />
              <Polyline
                coordinates={routeCoords}
                strokeColor={GREEN}
                strokeWidth={3}
                lineCap="round"
                lineDashPattern={[8, 6]}
              />
            </>
          )}

          {/* Destination marker */}
          {destNode && (
            <Marker
              coordinate={{ latitude: destNode.lat, longitude: destNode.lng }}
              anchor={{ x: 0.5, y: 1 }}
              tracksViewChanges={false}
            >
              <View style={s.destMarker}>
                <Text style={s.destMarkerText}>*</Text>
              </View>
            </Marker>
          )}
        </MapView>

        {/* Arrived overlay on map section */}
        {arrived && (
          <View style={s.arrivedMapOverlay}>
            <Text style={s.arrivedMapIcon}>OK</Text>
            <Text style={s.arrivedMapTitle}>{t('ar.arrived', lang)}</Text>
            <Text style={s.arrivedMapSub}>{destName}</Text>
            <View style={s.arrivedMapBtns}>
              {!NO_INDOOR_PROMPT.has(destinationId) && (
                <TouchableOpacity
                  style={s.arrivedMapBtn}
                  onPress={() => {
                    if (TWO_STAIRCASE_BUILDINGS.has(destinationId) && !selectedStaircase) {
                      setStaircasePickerVisible(true);
                    } else {
                      setArrivalPromptVisible(true);
                    }
                  }}
                  activeOpacity={0.85}
                >
                  <Text style={s.arrivedMapBtnText}>{t('ar.findRoom', lang)}</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[s.arrivedMapBtn, s.arrivedMapBtnBack]}
                onPress={() => navigation.goBack()}
                activeOpacity={0.85}
              >
                <Text style={[s.arrivedMapBtnText, { color: "rgba(255,255,255,0.6)" }]}>
                  {t('ar.backToMap', lang)}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

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

      {/* ── AR Tutorial — first launch only ── */}
      <ARTutorial lang={lang} />
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  fill:   { flex: 1, backgroundColor: "#000" },
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12, padding: 24 },

  // ── Camera section ──
  cameraSection: {
    width: W,
    height: CAM_HEIGHT,
    overflow: "hidden",
    backgroundColor: "#000",
  },

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

  hudTop: {
    position: "absolute",
    top: 0, left: 0, right: 0,
    alignItems: "center",
    paddingTop: Platform.OS === "android" ? 36 : 8,
  },

  // Arrow
  arrowWrap: {
    position: "absolute",
    bottom: 20,
    left: W / 2 - 48,
    width: 96,
    height: 120,
    alignItems: "center",
    justifyContent: "center",
  },
  arrowContainer: {
    width: 96,
    height: 120,
    alignItems: "center",
    justifyContent: "center",
  },

  // AR orb trail
  arOrb: {
    backgroundColor: 'rgba(0, 230, 180, 0.85)',
    shadowColor: '#00e6b4',
    shadowRadius: 10,
    shadowOpacity: 0.9,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },

  distChip: {
    position: "absolute",
    bottom: 24,
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

  calibratorWrap: {
    position: "absolute",
    bottom: 20,
    right: 12,
  },

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

  // ── Map section ──
  mapSection: {
    width: W,
    height: MAP_HEIGHT,
    backgroundColor: "#0d1a10",
  },

  routeBar: {
    height: 44,
    backgroundColor: "#0d1a10",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,200,83,0.15)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  routeBarLeft:  { flex: 1 },
  routeBarRight: { alignItems: "flex-end" },
  routeDestName: { fontSize: 13, fontWeight: "800", color: "#fff" },
  routeTotalDist:{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginTop: 1 },
  nextLabel:     { fontSize: 9,  color: "rgba(255,255,255,0.4)" },
  nextDist:      { fontSize: 14, fontWeight: "900", color: GREEN },

  miniMap: {
    flex: 1,
  },

  destMarker: { padding: 2 },
  destMarkerText: { fontSize: 20 },

  // Arrived overlay on map
  arrivedMapOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(7,18,9,0.92)",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    zIndex: 10,
  },
  arrivedMapIcon:  { fontSize: 48 },
  arrivedMapTitle: { fontSize: 22, fontWeight: "900", color: GREEN },
  arrivedMapSub:   { fontSize: 14, color: "rgba(255,255,255,0.5)" },
  arrivedMapBtns:  { flexDirection: "column", gap: 8, marginTop: 12, width: W - 64 },
  arrivedMapBtn: {
    backgroundColor: GREEN,
    borderRadius: 999,
    paddingVertical: 13,
    alignItems: "center",
  },
  arrivedMapBtnBack: {
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  arrivedMapBtnText: { fontSize: 14, fontWeight: "800", color: "#071209" },

  // Permission screens
  permIcon: { fontSize: 52 },
  permText: { fontSize: 16, fontWeight: "700", color: "#fff", textAlign: "center", paddingHorizontal: 20 },
  permBtn: {
    backgroundColor: GREEN, borderRadius: 12,
    paddingHorizontal: 28, paddingVertical: 13, marginTop: 8,
  },
  permBtnText:  { fontSize: 14, fontWeight: "800", color: "#071209" },
  permBack:     { marginTop: 10 },
  permBackText: { fontSize: 13, color: "rgba(255,255,255,0.4)", fontWeight: "600" },
});
