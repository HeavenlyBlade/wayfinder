// ─────────────────────────────────────────────────────────────────────────────
// CampusMapSVG — fully offline interactive campus map
//
// • All building polygons rendered as SVG (zero internet required)
// • User location dot projected from live GPS
// • Route polyline drawn when waypoints are provided
// • Pan + pinch-zoom via react-native-gesture-handler PanResponder style
//   (uses only already-installed packages — no react-native-reanimated needed)
// • Tap a building polygon → onBuildingPress(buildingId)
// ─────────────────────────────────────────────────────────────────────────────

import React, { useRef, useState, useCallback } from 'react';
import {
  View, StyleSheet, Dimensions, Text,
  PanResponder, TouchableOpacity,
} from 'react-native';
import Svg, {
  Rect, Polygon, Polyline, Circle, Path,
  Text as SvgText, G,
} from 'react-native-svg';

import {
  gpsToSvg, polygonToSvgPoints, waypointsToSvgPoints,
  SVG_W, SVG_H,
} from '../utils/gpsToSvg';
import { colors } from '../constants/theme';

// ── Inline SVG path data for map pin icons ────────────────────────────────────
// Functions returning path elements — called inside render so React keys are valid.
const ICON_PATHS = {
  building: () => [
    <Rect key="r" x="3" y="3" width="18" height="18" rx="2" strokeWidth="2" stroke="rgba(255,255,255,0.9)" fill="none"/>,
    <Path key="p1" d="M3 9h18" stroke="rgba(255,255,255,0.9)" strokeWidth="2" fill="none"/>,
    <Path key="p2" d="M9 21V9" stroke="rgba(255,255,255,0.9)" strokeWidth="2" fill="none"/>,
  ],
  book: () => [
    <Path key="p1" d="M4 19.5A2.5 2.5 0 016.5 17H20" stroke="rgba(255,255,255,0.9)" strokeWidth="2" fill="none"/>,
    <Path key="p2" d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" stroke="rgba(255,255,255,0.9)" strokeWidth="2" fill="none"/>,
  ],
  coffee: () => [
    <Path key="p1" d="M18 8h1a4 4 0 010 8h-1" stroke="rgba(255,255,255,0.9)" strokeWidth="2" fill="none"/>,
    <Path key="p2" d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z" stroke="rgba(255,255,255,0.9)" strokeWidth="2" fill="none"/>,
  ],
  flask: () => [
    <Path key="p" d="M9 3h6M10 3v6l-4 9h12l-4-9V3" stroke="rgba(255,255,255,0.9)" strokeWidth="2" fill="none"/>,
  ],
  heart: () => [
    <Path key="p" d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" stroke="rgba(255,255,255,0.9)" strokeWidth="2" fill="none"/>,
  ],
  gate: () => [
    <Path key="p1" d="M3 21V7a2 2 0 012-2h14a2 2 0 012 2v14" stroke="rgba(255,255,255,0.9)" strokeWidth="2" fill="none"/>,
    <Path key="p2" d="M9 21V11h6v10" stroke="rgba(255,255,255,0.9)" strokeWidth="2" fill="none"/>,
  ],
  parking: () => [
    <Rect key="r" x="3" y="3" width="18" height="18" rx="2" stroke="rgba(255,255,255,0.9)" strokeWidth="2" fill="none"/>,
    <Path key="p" d="M9 17V7h4a3 3 0 010 6H9" stroke="rgba(255,255,255,0.9)" strokeWidth="2" fill="none"/>,
  ],
};

const { width: SW, height: SH } = Dimensions.get('window');

// ── Map area height (screen minus top overlay) ───────────────────────────────
// Top overlay (search bar + chips) is ~130px. Bottom panel starts collapsed at 58px.
const MAP_H = SH - 130 - 58;

// ── Initial transform: fit campus centred in the visible map area ─────────────
const INITIAL_SCALE = Math.min(SW / SVG_W, MAP_H / SVG_H) * 0.92;
// Centre the SVG in the visible area, shifted down so it sits below the overlay
const INITIAL_TX    = (SW  - SVG_W * INITIAL_SCALE) / 2;
const INITIAL_TY    = 130 + (MAP_H - SVG_H * INITIAL_SCALE) / 2;
const MIN_SCALE     = INITIAL_SCALE * 0.85;  // can't shrink much below full view
const MAX_SCALE     = INITIAL_SCALE * 6;

// How many pixels the map can be dragged beyond its own edge before clamping
const PAN_MARGIN    = 60;

// ── Campus walkway skeleton (update after GPS survey) ────────────────────────
const WALKWAYS = [
  [{ lat: 13.960958, lng: 121.611279 }, { lat: 13.96094,  lng: 121.6113  }, { lat: 13.9612,   lng: 121.6118  }],
  [{ lat: 13.9612,   lng: 121.6118  }, { lat: 13.9614,   lng: 121.612   }],
  [{ lat: 13.9614,   lng: 121.612   }, { lat: 13.9619,   lng: 121.6123  }],
  [{ lat: 13.9619,   lng: 121.6123  }, { lat: 13.962,    lng: 121.6121  }],
  [{ lat: 13.9619,   lng: 121.6123  }, { lat: 13.962,    lng: 121.6127  }],
  [{ lat: 13.9614,   lng: 121.612   }, { lat: 13.9615,   lng: 121.6119  }],
  [{ lat: 13.9614,   lng: 121.612   }, { lat: 13.9615,   lng: 121.6125  }],
  [{ lat: 13.9615,   lng: 121.6119  }, { lat: 13.961281, lng: 121.612078 }],
  [{ lat: 13.9615,   lng: 121.6125  }, { lat: 13.961367, lng: 121.612669 }],
];

// ── Building polygon definitions ─────────────────────────────────────────────
// color   = fill color of the polygon (grouped by building type)
// iconKey = matches BuildingIcon MAP keys — rendered as a pin marker on the map
const BUILDING_POLYGONS = {
  main_gate:       { buildingId: 'gate',               name: 'Main Gate',   iconKey: 'gate',     color: '#4a6741',
    coordinates: [{ latitude: 13.960973, longitude: 121.611242 },{ latitude: 13.960945, longitude: 121.611378 },{ latitude: 13.960904, longitude: 121.611376 },{ latitude: 13.960923, longitude: 121.611214 }],
    labelCoord: { latitude: 13.960958, longitude: 121.611279 } },
  motor_parkinglot:{ buildingId: 'motorcycle_parking', name: 'Moto Parking', iconKey: 'parking',  color: '#3a3a2e',
    coordinates: [{ latitude: 13.961333, longitude: 121.611508 },{ latitude: 13.961294, longitude: 121.611572 },{ latitude: 13.961197, longitude: 121.611539 },{ latitude: 13.961181, longitude: 121.611431 }],
    labelCoord: { latitude: 13.961253, longitude: 121.611517 } },
  parking_lot:     { buildingId: 'parking_lot',        name: 'Parking Lot', iconKey: 'parking',  color: '#2e2e24',
    coordinates: [{ latitude: 13.961133, longitude: 121.611678 },{ latitude: 13.961108, longitude: 121.612531 },{ latitude: 13.961036, longitude: 121.612508 },{ latitude: 13.961031, longitude: 121.612394 },{ latitude: 13.960892, longitude: 121.612375 },{ latitude: 13.960914, longitude: 121.611722 }],
    labelCoord: { latitude: 13.961022, longitude: 121.612058 } },
  main_building:   { buildingId: 'main_building',      name: 'Main Building',iconKey: 'building', color: '#1e3a6a',
    coordinates: [{ latitude: 13.962275, longitude: 121.612361 },{ latitude: 13.962236, longitude: 121.612714 },{ latitude: 13.962069, longitude: 121.612697 },{ latitude: 13.962075, longitude: 121.612522 },{ latitude: 13.961722, longitude: 121.612481 },{ latitude: 13.961739, longitude: 121.6123 }],
    labelCoord: { latitude: 13.962011, longitude: 121.612419 } },
  new_building:    { buildingId: 'new_building',       name: 'New Building', iconKey: 'building', color: '#1a3550',
    coordinates: [{ latitude: 13.961325, longitude: 121.611739 },{ latitude: 13.961303, longitude: 121.612431 },{ latitude: 13.961197, longitude: 121.612422 },{ latitude: 13.961222, longitude: 121.611717 }],
    labelCoord: { latitude: 13.961281, longitude: 121.612078 } },
  ea_tower:        { buildingId: 'ea_tower',           name: 'EA Tower',    iconKey: 'building', color: '#2a3a1a',
    coordinates: [{ latitude: 13.962092, longitude: 121.612728 },{ latitude: 13.962053, longitude: 121.612906 },{ latitude: 13.961753, longitude: 121.612811 },{ latitude: 13.961792, longitude: 121.612653 }],
    labelCoord: { latitude: 13.961942, longitude: 121.612789 } },
  ibed:            { buildingId: 'ibed',               name: 'IBED',        iconKey: 'book',     color: '#1a3a28',
    coordinates: [{ latitude: 13.961578, longitude: 121.611967 },{ latitude: 13.961572, longitude: 121.612086 },{ latitude: 13.961478, longitude: 121.612083 },{ latitude: 13.961472, longitude: 121.612356 },{ latitude: 13.961556, longitude: 121.612369 },{ latitude: 13.96155, longitude: 121.612453 },{ latitude: 13.961317, longitude: 121.612447 },{ latitude: 13.961331, longitude: 121.611961 }],
    labelCoord: { latitude: 13.961389, longitude: 121.612211 } },
  canteen_one:     { buildingId: 'canteen',            name: 'Canteen 1',   iconKey: 'coffee',   color: '#4a3010',
    coordinates: [{ latitude: 13.961622, longitude: 121.611911 },{ latitude: 13.961528, longitude: 121.611944 },{ latitude: 13.961331, longitude: 121.611958 },{ latitude: 13.961339, longitude: 121.611581 }],
    labelCoord: { latitude: 13.961397, longitude: 121.611861 } },
  kindergarten:    { buildingId: 'kindergarten',       name: 'Kindergarten', iconKey: 'book',     color: '#3a2e14',
    coordinates: [{ latitude: 13.962078, longitude: 121.612144 },{ latitude: 13.96205, longitude: 121.612256 },{ latitude: 13.961672, longitude: 121.612122 },{ latitude: 13.961703, longitude: 121.612008 }],
    labelCoord: { latitude: 13.961817, longitude: 121.612114 } },
  chapel:          { buildingId: 'chapel',             name: 'Chapel',      iconKey: 'heart',    color: '#4a2020',
    coordinates: [{ latitude: 13.961694, longitude: 121.612006 },{ latitude: 13.961672, longitude: 121.612097 },{ latitude: 13.961633, longitude: 121.612083 },{ latitude: 13.961633, longitude: 121.611989 }],
    labelCoord: { latitude: 13.961664, longitude: 121.612053 } },
  kitchen_hall:    { buildingId: 'kitchen_hall',       name: 'Kitchen Hall', iconKey: 'coffee',   color: '#4a3818',
    coordinates: [{ latitude: 13.962481, longitude: 121.612853 },{ latitude: 13.962472, longitude: 121.612969 },{ latitude: 13.962144, longitude: 121.612936 },{ latitude: 13.962156, longitude: 121.612822 }],
    labelCoord: { latitude: 13.962342, longitude: 121.612903 } },
  canteen_two:     { buildingId: 'canteen_two',        name: 'Canteen 2',   iconKey: 'coffee',   color: '#4a3010',
    coordinates: [{ latitude: 13.961736, longitude: 121.612842 },{ latitude: 13.961708, longitude: 121.612911 },{ latitude: 13.961558, longitude: 121.612836 },{ latitude: 13.961578, longitude: 121.61275 }],
    labelCoord: { latitude: 13.96165,   longitude: 121.612831 } },
  sr_building:     { buildingId: 'sr_building',        name: 'SR Building', iconKey: 'flask',    color: '#3a1a30',
    coordinates: [{ latitude: 13.961581, longitude: 121.612667 },{ latitude: 13.961561, longitude: 121.612783 },{ latitude: 13.961169, longitude: 121.612678 },{ latitude: 13.961192, longitude: 121.612569 }],
    labelCoord: { latitude: 13.961367, longitude: 121.612669 } },
  ccss_building:   { buildingId: 'ccss',               name: 'CCSS',        iconKey: 'building', color: '#1a1a3a',
    coordinates: [{ latitude: 13.961031, longitude: 121.612428 },{ latitude: 13.961028, longitude: 121.612486 },{ latitude: 13.960922, longitude: 121.612481 },{ latitude: 13.960928, longitude: 121.612406 }],
    labelCoord: { latitude: 13.960983, longitude: 121.612456 } },
};

// Pre-project everything once at module load (not inside render)
const PROJ_POLYGONS = Object.entries(BUILDING_POLYGONS).map(([id, p]) => ({
  id,
  buildingId: p.buildingId,
  name:       p.name,
  color:      p.color,
  iconKey:    p.iconKey,
  points:     polygonToSvgPoints(p.coordinates),
  label:      gpsToSvg(p.labelCoord.latitude, p.labelCoord.longitude),
}));

const PROJ_WALKWAYS = WALKWAYS.map(wps => waypointsToSvgPoints(wps));

// ─────────────────────────────────────────────────────────────────────────────

export default function CampusMapSVG({
  userLocation,        // { lat, lng } | null
  routeWaypoints,      // [{ lat, lng }] | null
  selectedBuildingId,  // string | null
  onBuildingPress,     // (buildingId) => void
}) {
  // Current transform state (not animated — we update directly for perf)
  const transformRef = useRef({ scale: INITIAL_SCALE, tx: INITIAL_TX, ty: INITIAL_TY });
  const [, forceUpdate] = useState(0);
  const redraw = useCallback(() => forceUpdate(n => n + 1), []);

  // Snap back to the default full-campus view
  function resetView() {
    const t = transformRef.current;
    t.scale = INITIAL_SCALE;
    t.tx    = INITIAL_TX;
    t.ty    = INITIAL_TY;
    redraw();
  }

  // PanResponder for combined pan + pinch
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder:  (_, g) => Math.abs(g.dx) > 2 || Math.abs(g.dy) > 2,

      onPanResponderGrant: (e) => {
        const t = transformRef.current;
        t._startTx    = t.tx;
        t._startTy    = t.ty;
        t._startScale = t.scale;
        // Store initial touches for pinch
        const touches = e.nativeEvent.touches;
        if (touches.length >= 2) {
          const dx = touches[1].pageX - touches[0].pageX;
          const dy = touches[1].pageY - touches[0].pageY;
          t._initPinchDist = Math.hypot(dx, dy);
          t._initPinchMidX = (touches[0].pageX + touches[1].pageX) / 2;
          t._initPinchMidY = (touches[0].pageY + touches[1].pageY) / 2;
        }
      },

      onPanResponderMove: (e, g) => {
        const t       = transformRef.current;
        const touches = e.nativeEvent.touches;

        if (touches.length >= 2) {
          // Pinch zoom
          const dx   = touches[1].pageX - touches[0].pageX;
          const dy   = touches[1].pageY - touches[0].pageY;
          const dist = Math.hypot(dx, dy);
          if (!t._initPinchDist) return;

          const ratio    = dist / t._initPinchDist;
          const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, t._startScale * ratio));
          const midX     = t._initPinchMidX;
          const midY     = t._initPinchMidY;
          const scaleR   = newScale / t._startScale;

          t.tx    = midX - scaleR * (midX - t._startTx);
          t.ty    = midY - scaleR * (midY - t._startTy);
          t.scale = newScale;
        } else {
          // Pan
          t.tx = t._startTx + g.dx;
          t.ty = t._startTy + g.dy;
        }
        redraw();
      },

      onPanResponderRelease: () => {
        const t = transformRef.current;
        t._initPinchDist = null;

        // Clamp pan so campus can't be dragged completely off screen
        const mapW = SVG_W * t.scale;
        const mapH = SVG_H * t.scale;
        t.tx = Math.min(PAN_MARGIN, Math.max(SW - mapW - PAN_MARGIN, t.tx));
        t.ty = Math.min(PAN_MARGIN + 130, Math.max(SH - mapH - PAN_MARGIN, t.ty));
        redraw();
      },
    }),
  ).current;

  const { scale, tx, ty } = transformRef.current;

  // Project user location
  const userSvg = userLocation ? gpsToSvg(userLocation.lat, userLocation.lng) : null;

  // Project route
  const routePts = routeWaypoints && routeWaypoints.length > 1
    ? waypointsToSvgPoints(routeWaypoints)
    : null;
  const routeDestSvg = routeWaypoints && routeWaypoints.length > 0
    ? gpsToSvg(
        routeWaypoints[routeWaypoints.length - 1].lat,
        routeWaypoints[routeWaypoints.length - 1].lng,
      )
    : null;

  return (
    <View style={s.container} {...panResponder.panHandlers}>
      <View
        style={[
          s.svgWrap,
          { transform: [{ translateX: tx }, { translateY: ty }, { scale }] },
        ]}
      >
        <Svg width={SVG_W} height={SVG_H} viewBox={`0 0 ${SVG_W} ${SVG_H}`}>

          {/* Campus ground — deep muted green, no harsh border */}
          <Rect x={0} y={0} width={SVG_W} height={SVG_H} fill="#101a12" />

          {/* Walkways — soft warm grey, thinner */}
          {PROJ_WALKWAYS.map((pts, i) => (
            <Polyline key={`w${i}`} points={pts} fill="none"
              stroke="#2e3a2e" strokeWidth={14}
              strokeLinecap="round" strokeLinejoin="round" />
          ))}
          {PROJ_WALKWAYS.map((pts, i) => (
            <Polyline key={`wc${i}`} points={pts} fill="none"
              stroke="#3d4f3d" strokeWidth={6}
              strokeLinecap="round" strokeLinejoin="round" />
          ))}

          {/* Building polygons + icon badges + labels */}
          {PROJ_POLYGONS.map(poly => {
            const sel = selectedBuildingId === poly.buildingId
                     || selectedBuildingId === poly.id;
            const ix = poly.label.x;
            const iy = poly.label.y;
            // Icon badge: 28px circle, icon scaled to 14px inside a 24px viewBox
            const BADGE = 14;
            const ICON_SCALE = BADGE / 24; // 14/24 ≈ 0.583
            const iconPaths = (ICON_PATHS[poly.iconKey] ?? ICON_PATHS.building)();

            return (
              <G key={poly.id} onPress={() => onBuildingPress?.(poly.buildingId)}>
                {/* Building fill */}
                <Polygon
                  points={poly.points}
                  fill={sel ? poly.color : poly.color + 'cc'}
                  stroke={sel ? colors.primary : poly.color}
                  strokeWidth={sel ? 3 : 1}
                />

                {/* Icon badge circle */}
                <Circle cx={ix} cy={iy - 10}
                  r={BADGE}
                  fill={sel ? colors.primary : poly.color}
                  stroke={sel ? '#fff' : 'rgba(255,255,255,0.3)'}
                  strokeWidth={sel ? 2 : 1}
                />

                {/* Icon paths — centered on badge */}
                <G
                  transform={`translate(${ix - BADGE * ICON_SCALE}, ${iy - 10 - BADGE * ICON_SCALE}) scale(${ICON_SCALE})`}
                  strokeLinecap="round" strokeLinejoin="round"
                >
                  {iconPaths}
                </G>

                {/* Label below badge */}
                <SvgText
                  x={ix} y={iy + 8}
                  fontSize={sel ? 14 : 11}
                  fontWeight={sel ? 'bold' : 'normal'}
                  fill={sel ? colors.primary : 'rgba(255,255,255,0.75)'}
                  textAnchor="middle" alignmentBaseline="middle"
                >
                  {poly.name}
                </SvgText>
              </G>
            );
          })}

          {/* Route line */}
          {routePts && (
            <>
              <Polyline points={routePts} fill="none"
                stroke="rgba(0,0,0,0.4)" strokeWidth={10}
                strokeLinecap="round" strokeLinejoin="round" />
              <Polyline points={routePts} fill="none"
                stroke={colors.primary} strokeWidth={5}
                strokeLinecap="round" strokeLinejoin="round"
                strokeDasharray="18,10" />
            </>
          )}
          {routeDestSvg && (
            <>
              <Circle cx={routeDestSvg.x} cy={routeDestSvg.y} r={16}
                fill={colors.primary} opacity={0.18} />
              <Circle cx={routeDestSvg.x} cy={routeDestSvg.y} r={9}
                fill={colors.primary} />
              <Circle cx={routeDestSvg.x} cy={routeDestSvg.y} r={3.5}
                fill="#fff" />
            </>
          )}

          {/* User location dot */}
          {userSvg && (
            <>
              <Circle cx={userSvg.x} cy={userSvg.y} r={22}
                fill={colors.userDot} opacity={0.1} />
              <Circle cx={userSvg.x} cy={userSvg.y} r={11}
                fill={colors.userDot} opacity={0.25} />
              <Circle cx={userSvg.x} cy={userSvg.y} r={6}
                fill={colors.userDot} />
              <Circle cx={userSvg.x} cy={userSvg.y} r={2.5}
                fill="#fff" />
            </>
          )}

          {/* Compass N — subtle, top-right corner */}
          <SvgText x={SVG_W - 22} y={22} fontSize={11} fontWeight="bold"
            fill="rgba(255,255,255,0.2)" textAnchor="middle">N↑</SvgText>

        </Svg>
      </View>

      {/* Scale legend */}
      <View style={s.legend} pointerEvents="none">
        <View style={s.legendLine} />
        <Text style={s.legendText}>~50m</Text>
      </View>

      {/* Reset view button */}
      <TouchableOpacity style={s.resetBtn} onPress={resetView} activeOpacity={0.75}>
        <Text style={s.resetBtnText}>⊡</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#071209', overflow: 'hidden' },
  svgWrap:   { position: 'absolute', top: 0, left: 0 },
  legend: {
    position: 'absolute', bottom: 16, left: 16,
    flexDirection: 'row', alignItems: 'center', gap: 6,
  },
  legendLine: { width: 40, height: 2, backgroundColor: 'rgba(255,255,255,0.3)' },
  legendText: { fontSize: 10, color: 'rgba(255,255,255,0.3)', fontWeight: '700' },
  resetBtn: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetBtnText: { fontSize: 18, color: 'rgba(255,255,255,0.7)' },
});
