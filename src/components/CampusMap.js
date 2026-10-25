// ─────────────────────────────────────────────────────────────────────────────
// WAYFINDER — CampusMap (SVG-based, no API key, no native module)
//
// Draws campus building polygons, GPS dot, and route polyline using
// react-native-svg. No external tile server, no native dependencies.
// Supports pan + pinch-to-zoom via PanResponder.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useRef, useState, useCallback, useMemo } from 'react';
import { View, StyleSheet, PanResponder, Dimensions } from 'react-native';
import Svg, { Polygon, Polyline, Circle, Text as SvgText, G, Rect } from 'react-native-svg';

const { width: SW, height: SH } = Dimensions.get('window');

// ── Campus bounds ─────────────────────────────────────────────────────────────
const BOUNDS = {
  minLat: 13.9607,
  maxLat: 13.9627,
  minLng: 121.6110,
  maxLng: 121.6133,
};

const BASE_W = SW;
const BASE_H = SH * 0.85;

// ── Coordinate → SVG pixel ────────────────────────────────────────────────────
function toXY(lat, lng, zoom = 1, panX = 0, panY = 0) {
  const x = ((lng - BOUNDS.minLng) / (BOUNDS.maxLng - BOUNDS.minLng)) * BASE_W * zoom + panX;
  const y = ((BOUNDS.maxLat - lat) / (BOUNDS.maxLat - BOUNDS.minLat)) * BASE_H * zoom + panY;
  return { x, y };
}

function coordsToPoints(coords, zoom, panX, panY) {
  return coords
    .map(c => {
      const { x, y } = toXY(c.lat ?? c.latitude, c.lng ?? c.longitude, zoom, panX, panY);
      return `${x},${y}`;
    })
    .join(' ');
}

function centroid(coords) {
  const n = coords.length;
  return {
    lat: coords.reduce((s, c) => s + (c.lat ?? c.latitude), 0) / n,
    lng: coords.reduce((s, c) => s + (c.lng ?? c.longitude), 0) / n,
  };
}

// ── Building data ─────────────────────────────────────────────────────────────
const BUILDING_OVERLAYS = [
  { id: 'gate', name: 'Gate',
    coords: [{ lat: 13.960973, lng: 121.611242 },{ lat: 13.960945, lng: 121.611378 },{ lat: 13.960904, lng: 121.611376 },{ lat: 13.960923, lng: 121.611214 }] },
  { id: 'motorcycle_parking', name: 'Moto P.',
    coords: [{ lat: 13.961333, lng: 121.611508 },{ lat: 13.961294, lng: 121.611572 },{ lat: 13.961197, lng: 121.611539 },{ lat: 13.961181, lng: 121.611431 }] },
  { id: 'parking_lot', name: 'Parking',
    coords: [{ lat: 13.961133, lng: 121.611678 },{ lat: 13.961108, lng: 121.612531 },{ lat: 13.961036, lng: 121.612508 },{ lat: 13.961031, lng: 121.612394 },{ lat: 13.960892, lng: 121.612375 },{ lat: 13.960914, lng: 121.611722 }] },
  { id: 'main_building', name: 'Main Bldg',
    coords: [{ lat: 13.962275, lng: 121.612361 },{ lat: 13.962236, lng: 121.612714 },{ lat: 13.962069, lng: 121.612697 },{ lat: 13.962075, lng: 121.612522 },{ lat: 13.961722, lng: 121.612481 },{ lat: 13.961739, lng: 121.6123 }] },
  { id: 'new_building', name: 'New Bldg',
    coords: [{ lat: 13.961325, lng: 121.611739 },{ lat: 13.961303, lng: 121.612431 },{ lat: 13.961197, lng: 121.612422 },{ lat: 13.961222, lng: 121.611717 }] },
  { id: 'ea_tower', name: 'EA Tower',
    coords: [{ lat: 13.962092, lng: 121.612728 },{ lat: 13.962053, lng: 121.612906 },{ lat: 13.961753, lng: 121.612811 },{ lat: 13.961792, lng: 121.612653 }] },
  { id: 'ibed', name: 'IBED',
    coords: [{ lat: 13.961578, lng: 121.611967 },{ lat: 13.961572, lng: 121.612086 },{ lat: 13.961478, lng: 121.612083 },{ lat: 13.961472, lng: 121.612356 },{ lat: 13.961556, lng: 121.612369 },{ lat: 13.96155, lng: 121.612453 },{ lat: 13.961317, lng: 121.612447 },{ lat: 13.961331, lng: 121.611961 }] },
  { id: 'canteen', name: 'Canteen',
    coords: [{ lat: 13.961622, lng: 121.611911 },{ lat: 13.961528, lng: 121.611944 },{ lat: 13.961331, lng: 121.611958 },{ lat: 13.961339, lng: 121.611581 }] },
  { id: 'kindergarten', name: 'Kinder',
    coords: [{ lat: 13.962078, lng: 121.612144 },{ lat: 13.96205, lng: 121.612256 },{ lat: 13.961672, lng: 121.612122 },{ lat: 13.961703, lng: 121.612008 }] },
  { id: 'chapel', name: 'Chapel',
    coords: [{ lat: 13.961694, lng: 121.612006 },{ lat: 13.961672, lng: 121.612097 },{ lat: 13.961633, lng: 121.612083 },{ lat: 13.961633, lng: 121.611989 }] },
  { id: 'kitchen_hall', name: 'Kitchen',
    coords: [{ lat: 13.962481, lng: 121.612853 },{ lat: 13.962472, lng: 121.612969 },{ lat: 13.962144, lng: 121.612936 },{ lat: 13.962156, lng: 121.612822 }] },
  { id: 'canteen_two', name: 'Canteen 2',
    coords: [{ lat: 13.961736, lng: 121.612842 },{ lat: 13.961708, lng: 121.612911 },{ lat: 13.961558, lng: 121.612836 },{ lat: 13.961578, lng: 121.61275 }] },
  { id: 'sr_building', name: 'SR Bldg',
    coords: [{ lat: 13.961581, lng: 121.612667 },{ lat: 13.961561, lng: 121.612783 },{ lat: 13.961169, lng: 121.612678 },{ lat: 13.961192, lng: 121.612569 }] },
  { id: 'ccss', name: 'CCSS',
    coords: [{ lat: 13.961031, lng: 121.612428 },{ lat: 13.961028, lng: 121.612486 },{ lat: 13.960922, lng: 121.612481 },{ lat: 13.960928, lng: 121.612406 }] },
  { id: 'gymnasium', name: 'Gymnasium',
    coords: [{ lat: 13.962278, lng: 121.612417 },{ lat: 13.962472, lng: 121.612417 },{ lat: 13.962472, lng: 121.612806 },{ lat: 13.962278, lng: 121.612778 }] },
  { id: 'engineering', name: 'New IBED',
    coords: [{ lat: 13.962050, lng: 121.612260 },{ lat: 13.962048, lng: 121.612330 },{ lat: 13.961659, lng: 121.612290 },{ lat: 13.961672, lng: 121.612145 }] },
];

// ── Main component ────────────────────────────────────────────────────────────
export default function CampusMap({
  style,
  selectedId,
  userLocation,
  routeWaypoints,
  onPressBuilding,
  mini = false,
}) {
  const [zoom, setZoom] = useState(mini ? 1.3 : 1.4);
  const [panX, setPanX] = useState(-SW * 0.08);
  const [panY, setPanY] = useState(-BASE_H * 0.06);

  const lastPan  = useRef({ x: 0, y: 0 });
  const lastZoom = useRef(zoom);
  const lastDist = useRef(null);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !mini,
      onMoveShouldSetPanResponder:  () => !mini,
      onPanResponderGrant: (_, g) => {
        lastPan.current  = { x: g.moveX, y: g.moveY };
        lastDist.current = null;
      },
      onPanResponderMove: (e, g) => {
        const touches = e.nativeEvent.touches;
        if (touches.length === 2) {
          const dx   = touches[0].pageX - touches[1].pageX;
          const dy   = touches[0].pageY - touches[1].pageY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (lastDist.current !== null) {
            const factor = 1 + (dist - lastDist.current) * 0.005;
            const next   = Math.min(4, Math.max(0.8, lastZoom.current * factor));
            lastZoom.current = next;
            setZoom(next);
          }
          lastDist.current = dist;
        } else {
          const dx = g.moveX - lastPan.current.x;
          const dy = g.moveY - lastPan.current.y;
          lastPan.current = { x: g.moveX, y: g.moveY };
          setPanX(p => p + dx);
          setPanY(p => p + dy);
        }
      },
    }),
  ).current;

  function handleSvgPress(e) {
    if (mini || !onPressBuilding) return;
    const px = e.nativeEvent.locationX;
    const py = e.nativeEvent.locationY;
    for (const b of BUILDING_OVERLAYS) {
      const c   = centroid(b.coords);
      const pos = toXY(c.lat, c.lng, zoom, panX, panY);
      const d   = Math.sqrt((px - pos.x) ** 2 + (py - pos.y) ** 2);
      if (d < 32) { onPressBuilding(b.id); return; }
    }
  }

  const svgContent = useMemo(() => {
    const GREEN      = '#00C853';
    const GREEN_SEL  = 'rgba(0,200,83,0.75)';
    const GREEN_FILL = 'rgba(0,200,83,0.22)';

    return (
      <>
        {/* Dark campus background */}
        <Rect x={0} y={0} width={BASE_W * 4} height={BASE_H * 4} fill="#0d1a0e" />

        {/* Building polygons + labels */}
        {BUILDING_OVERLAYS.map(b => {
          const sel    = selectedId === b.id;
          const pts    = coordsToPoints(b.coords, zoom, panX, panY);
          const cen    = centroid(b.coords);
          const cenPos = toXY(cen.lat, cen.lng, zoom, panX, panY);
          return (
            <G key={b.id}>
              <Polygon
                points={pts}
                fill={sel ? GREEN_SEL : GREEN_FILL}
                stroke={GREEN}
                strokeWidth={sel ? 2.5 : 1.5}
              />
              {!mini && zoom > 1.1 && (
                <SvgText
                  x={cenPos.x}
                  y={cenPos.y + 4}
                  fontSize={sel ? 9 : 8}
                  fontWeight={sel ? 'bold' : 'normal'}
                  fill={sel ? '#071209' : 'rgba(255,255,255,0.9)'}
                  textAnchor="middle"
                  stroke="rgba(0,0,0,0.7)"
                  strokeWidth={2.5}
                  paintOrder="stroke"
                >
                  {b.name}
                </SvgText>
              )}
            </G>
          );
        })}

        {/* Route polyline */}
        {routeWaypoints && routeWaypoints.length > 1 && (() => {
          const pts = routeWaypoints
            .map(w => { const { x, y } = toXY(w.lat, w.lng, zoom, panX, panY); return `${x},${y}`; })
            .join(' ');
          return (
            <G>
              <Polyline points={pts} stroke="rgba(0,0,0,0.4)" strokeWidth={7}
                strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <Polyline points={pts} stroke={GREEN} strokeWidth={3.5}
                strokeLinecap="round" strokeLinejoin="round"
                strokeDasharray="14,8" fill="none" />
            </G>
          );
        })()}

        {/* User GPS dot */}
        {userLocation && (() => {
          const { x, y } = toXY(userLocation.lat, userLocation.lng, zoom, panX, panY);
          return (
            <G>
              <Circle cx={x} cy={y} r={12} fill="rgba(66,133,244,0.2)"
                stroke="rgba(66,133,244,0.4)" strokeWidth={1} />
              <Circle cx={x} cy={y} r={6} fill="#4285F4" stroke="#fff" strokeWidth={2} />
            </G>
          );
        })()}
      </>
    );
  }, [zoom, panX, panY, selectedId, userLocation, routeWaypoints, mini]);

  return (
    <View style={[styles.container, style]} {...(mini ? {} : panResponder.panHandlers)}>
      <Svg width="100%" height="100%" onPress={handleSvgPress}>
        {svgContent}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0d1a0e',
    overflow: 'hidden',
  },
});
