// ─────────────────────────────────────────────────────────────────────────────
// WAYFINDER — CampusMap (MapLibre Native)
//
// Uses OpenFreeMap tiles (free, no API key, no rate limit, OSM data).
// Renders building polygons, route polyline, and GPS dot as native GL layers.
// Supports tap-to-select buildings.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useMemo, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import MapLibreGL from '@maplibre/maplibre-react-native';

// No token needed for OpenFreeMap — set inside component, not at module load

// OpenFreeMap — free, no key, no rate limit, production-grade OSM tiles
const MAP_STYLE   = 'https://tiles.openfreemap.org/styles/liberty';
const CAMPUS_LAT  = 13.961706;
const CAMPUS_LNG  = 121.612236;
const DEFAULT_ZOOM = 17;

// ── Building polygon data ─────────────────────────────────────────────────────
const BUILDING_OVERLAYS = [
  { id: 'gate',               name: 'Main Gate',
    coords: [{ lat: 13.960973, lng: 121.611242 },{ lat: 13.960945, lng: 121.611378 },{ lat: 13.960904, lng: 121.611376 },{ lat: 13.960923, lng: 121.611214 }] },
  { id: 'motorcycle_parking', name: 'Moto Parking',
    coords: [{ lat: 13.961333, lng: 121.611508 },{ lat: 13.961294, lng: 121.611572 },{ lat: 13.961197, lng: 121.611539 },{ lat: 13.961181, lng: 121.611431 }] },
  { id: 'parking_lot',        name: 'Parking Lot',
    coords: [{ lat: 13.961133, lng: 121.611678 },{ lat: 13.961108, lng: 121.612531 },{ lat: 13.961036, lng: 121.612508 },{ lat: 13.961031, lng: 121.612394 },{ lat: 13.960892, lng: 121.612375 },{ lat: 13.960914, lng: 121.611722 }] },
  { id: 'main_building',      name: 'Main Building',
    coords: [{ lat: 13.962275, lng: 121.612361 },{ lat: 13.962236, lng: 121.612714 },{ lat: 13.962069, lng: 121.612697 },{ lat: 13.962075, lng: 121.612522 },{ lat: 13.961722, lng: 121.612481 },{ lat: 13.961739, lng: 121.6123 }] },
  { id: 'new_building',       name: 'New Building',
    coords: [{ lat: 13.961325, lng: 121.611739 },{ lat: 13.961303, lng: 121.612431 },{ lat: 13.961197, lng: 121.612422 },{ lat: 13.961222, lng: 121.611717 }] },
  { id: 'ea_tower',           name: 'EA Tower',
    coords: [{ lat: 13.962092, lng: 121.612728 },{ lat: 13.962053, lng: 121.612906 },{ lat: 13.961753, lng: 121.612811 },{ lat: 13.961792, lng: 121.612653 }] },
  { id: 'ibed',               name: 'IBED',
    coords: [{ lat: 13.961578, lng: 121.611967 },{ lat: 13.961572, lng: 121.612086 },{ lat: 13.961478, lng: 121.612083 },{ lat: 13.961472, lng: 121.612356 },{ lat: 13.961556, lng: 121.612369 },{ lat: 13.96155, lng: 121.612453 },{ lat: 13.961317, lng: 121.612447 },{ lat: 13.961331, lng: 121.611961 }] },
  { id: 'canteen',            name: 'Canteen',
    coords: [{ lat: 13.961622, lng: 121.611911 },{ lat: 13.961528, lng: 121.611944 },{ lat: 13.961331, lng: 121.611958 },{ lat: 13.961339, lng: 121.611581 }] },
  { id: 'kindergarten',       name: 'Kindergarten',
    coords: [{ lat: 13.962078, lng: 121.612144 },{ lat: 13.96205, lng: 121.612256 },{ lat: 13.961672, lng: 121.612122 },{ lat: 13.961703, lng: 121.612008 }] },
  { id: 'chapel',             name: 'Chapel',
    coords: [{ lat: 13.961694, lng: 121.612006 },{ lat: 13.961672, lng: 121.612097 },{ lat: 13.961633, lng: 121.612083 },{ lat: 13.961633, lng: 121.611989 }] },
  { id: 'kitchen_hall',       name: 'Kitchen Hall',
    coords: [{ lat: 13.962481, lng: 121.612853 },{ lat: 13.962472, lng: 121.612969 },{ lat: 13.962144, lng: 121.612936 },{ lat: 13.962156, lng: 121.612822 }] },
  { id: 'canteen_two',        name: 'Canteen 2',
    coords: [{ lat: 13.961736, lng: 121.612842 },{ lat: 13.961708, lng: 121.612911 },{ lat: 13.961558, lng: 121.612836 },{ lat: 13.961578, lng: 121.61275 }] },
  { id: 'sr_building',        name: 'SR Building',
    coords: [{ lat: 13.961581, lng: 121.612667 },{ lat: 13.961561, lng: 121.612783 },{ lat: 13.961169, lng: 121.612678 },{ lat: 13.961192, lng: 121.612569 }] },
  { id: 'ccss',               name: 'CCSS',
    coords: [{ lat: 13.961031, lng: 121.612428 },{ lat: 13.961028, lng: 121.612486 },{ lat: 13.960922, lng: 121.612481 },{ lat: 13.960928, lng: 121.612406 }] },
  { id: 'gymnasium',          name: 'Gymnasium',
    coords: [{ lat: 13.962278, lng: 121.612417 },{ lat: 13.962472, lng: 121.612417 },{ lat: 13.962472, lng: 121.612806 },{ lat: 13.962278, lng: 121.612778 }] },
  { id: 'engineering',        name: 'New IBED Bldg',
    coords: [{ lat: 13.962050, lng: 121.612260 },{ lat: 13.962048, lng: 121.612330 },{ lat: 13.961659, lng: 121.612290 },{ lat: 13.961672, lng: 121.612145 }] },
];

// Convert coords to GeoJSON ring ([lng, lat] — GeoJSON is lng first)
function toRing(coords) {
  const ring = coords.map(c => [c.lng, c.lat]);
  ring.push(ring[0]); // close the ring
  return ring;
}

// Build GeoJSON FeatureCollection for all buildings
function buildingsGeoJSON(selectedId) {
  return {
    type: 'FeatureCollection',
    features: BUILDING_OVERLAYS.map(b => ({
      type: 'Feature',
      id: b.id,
      properties: { id: b.id, name: b.name, selected: b.id === selectedId },
      geometry: { type: 'Polygon', coordinates: [toRing(b.coords)] },
    })),
  };
}

// Route as GeoJSON LineString
function routeGeoJSON(waypoints) {
  if (!waypoints || waypoints.length < 2) return null;
  return {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'LineString',
      coordinates: waypoints.map(w => [w.lng, w.lat]),
    },
  };
}

// User location as GeoJSON Point
function userLocGeoJSON(loc) {
  if (!loc) return null;
  return {
    type: 'Feature',
    properties: {},
    geometry: { type: 'Point', coordinates: [loc.lng, loc.lat] },
  };
}

// ── Main component ────────────────────────────────────────────────────────────

/**
 * CampusMap
 *
 * Props:
 *   style            {StyleProp}
 *   selectedId       {string|null}   — highlighted building id
 *   userLocation     {{lat,lng}|null}
 *   routeWaypoints   {Array<{lat,lng}>|null}
 *   onPressBuilding  {(id:string) => void}
 *   mini             {boolean}  no gestures, no tap, compact
 */
export default function CampusMap({
  style,
  selectedId,
  userLocation,
  routeWaypoints,
  onPressBuilding,
  mini = false,
}) {
  // Initialize MapLibre after native bridge is ready — not at module load time
  useEffect(() => {
    MapLibreGL.setAccessToken(null);
  }, []);
  const buildingsFC = useMemo(() => buildingsGeoJSON(selectedId), [selectedId]);
  const routeFC     = useMemo(() => routeGeoJSON(routeWaypoints),  [routeWaypoints]);
  const userLocFC   = useMemo(() => userLocGeoJSON(userLocation),   [userLocation]);

  function handleBuildingPress(e) {
    if (mini || !onPressBuilding) return;
    const id = e?.features?.[0]?.properties?.id;
    if (id) onPressBuilding(id);
  }

  return (
    <View style={[s.container, style]}>
      <MapLibreGL.MapView
        style={StyleSheet.absoluteFill}
        styleURL={MAP_STYLE}
        scrollEnabled={!mini}
        pitchEnabled={false}
        rotateEnabled={!mini}
        zoomEnabled={!mini}
        compassEnabled={false}
        logoEnabled={false}
        attributionEnabled={!mini}
      >
        {/* Camera — centered on SACLI campus */}
        <MapLibreGL.Camera
          centerCoordinate={[CAMPUS_LNG, CAMPUS_LAT]}
          zoomLevel={DEFAULT_ZOOM}
          animationMode="none"
        />

        {/* Building fill + stroke */}
        <MapLibreGL.ShapeSource
          id="buildings"
          shape={buildingsFC}
          onPress={mini ? undefined : handleBuildingPress}
        >
          <MapLibreGL.FillLayer
            id="buildings-fill"
            style={{
              fillColor: [
                'case',
                ['==', ['get', 'selected'], true],
                'rgba(0,200,83,0.55)',
                'rgba(0,200,83,0.20)',
              ],
            }}
          />
          <MapLibreGL.LineLayer
            id="buildings-stroke"
            style={{
              lineColor: '#00C853',
              lineWidth: ['case', ['==', ['get', 'selected'], true], 2.5, 1.5],
            }}
          />
          {/* Building name labels */}
          {!mini && (
            <MapLibreGL.SymbolLayer
              id="buildings-labels"
              style={{
                textField: ['get', 'name'],
                textSize: 10,
                textColor: '#ffffff',
                textHaloColor: 'rgba(0,0,0,0.8)',
                textHaloWidth: 1.5,
                textFont: ['Open Sans Regular'],
                textAnchor: 'center',
              }}
            />
          )}
        </MapLibreGL.ShapeSource>

        {/* Route polyline */}
        {routeFC && (
          <MapLibreGL.ShapeSource id="route" shape={routeFC}>
            {/* Shadow */}
            <MapLibreGL.LineLayer
              id="route-shadow"
              style={{ lineColor: 'rgba(0,0,0,0.4)', lineWidth: 7, lineCap: 'round', lineJoin: 'round' }}
            />
            {/* Main line */}
            <MapLibreGL.LineLayer
              id="route-line"
              style={{
                lineColor: '#00C853',
                lineWidth: 4,
                lineCap: 'round',
                lineJoin: 'round',
                lineDasharray: [2, 1.5],
              }}
            />
          </MapLibreGL.ShapeSource>
        )}

        {/* User GPS dot */}
        {userLocFC && (
          <MapLibreGL.ShapeSource id="user-location" shape={userLocFC}>
            {/* Accuracy ring */}
            <MapLibreGL.CircleLayer
              id="user-accuracy"
              style={{
                circleRadius: 14,
                circleColor: 'rgba(66,133,244,0.15)',
                circleStrokeWidth: 1,
                circleStrokeColor: 'rgba(66,133,244,0.4)',
              }}
            />
            {/* Blue dot */}
            <MapLibreGL.CircleLayer
              id="user-dot"
              style={{
                circleRadius: 7,
                circleColor: '#4285F4',
                circleStrokeWidth: 2.5,
                circleStrokeColor: '#ffffff',
              }}
            />
          </MapLibreGL.ShapeSource>
        )}
      </MapLibreGL.MapView>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    backgroundColor: '#0d1a0e',
    overflow: 'hidden',
  },
});
