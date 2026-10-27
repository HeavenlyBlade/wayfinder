// ─────────────────────────────────────────────────────────────────────────────
// WAYFINDER — CampusMap (WebView + Leaflet.js)
//
// Uses a WebView to render a Leaflet map with OpenStreetMap tiles.
// No native modules, no API key, no rate limits.
// Building polygons, GPS dot, route polyline and tap events all work.
//
// Communication:
//   RN → WebView : injectJavaScript() to update GPS/route/selected building
//   WebView → RN : postMessage({ type, id }) for building taps
// ─────────────────────────────────────────────────────────────────────────────

import React, { useRef, useEffect, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

// ── Campus building data ──────────────────────────────────────────────────────
const BUILDINGS = [
  { id: 'gate', name: 'Main Gate',
    coords: [[13.960973,121.611242],[13.960945,121.611378],[13.960904,121.611376],[13.960923,121.611214]] },
  { id: 'motorcycle_parking', name: 'Moto Parking',
    coords: [[13.961333,121.611508],[13.961294,121.611572],[13.961197,121.611539],[13.961181,121.611431]] },
  { id: 'parking_lot', name: 'Parking Lot',
    coords: [[13.961133,121.611678],[13.961108,121.612531],[13.961036,121.612508],[13.961031,121.612394],[13.960892,121.612375],[13.960914,121.611722]] },
  { id: 'main_building', name: 'Main Building',
    coords: [[13.962275,121.612361],[13.962236,121.612714],[13.962069,121.612697],[13.962075,121.612522],[13.961722,121.612481],[13.961739,121.6123]] },
  { id: 'new_building', name: 'New Building',
    coords: [[13.961325,121.611739],[13.961303,121.612431],[13.961197,121.612422],[13.961222,121.611717]] },
  { id: 'ea_tower', name: 'EA Tower',
    coords: [[13.962092,121.612728],[13.962053,121.612906],[13.961753,121.612811],[13.961792,121.612653]] },
  { id: 'ibed', name: 'IBED',
    coords: [[13.961578,121.611967],[13.961572,121.612086],[13.961478,121.612083],[13.961472,121.612356],[13.961556,121.612369],[13.96155,121.612453],[13.961317,121.612447],[13.961331,121.611961]] },
  { id: 'canteen', name: 'Canteen 1',
    coords: [[13.961622,121.611911],[13.961528,121.611944],[13.961331,121.611958],[13.961339,121.611581]] },
  { id: 'kindergarten', name: 'Kindergarten',
    coords: [[13.962078,121.612144],[13.96205,121.612256],[13.961672,121.612122],[13.961703,121.612008]] },
  { id: 'chapel', name: 'Chapel',
    coords: [[13.961694,121.612006],[13.961672,121.612097],[13.961633,121.612083],[13.961633,121.611989]] },
  { id: 'kitchen_hall', name: 'Kitchen Hall',
    coords: [[13.962481,121.612853],[13.962472,121.612969],[13.962144,121.612936],[13.962156,121.612822]] },
  { id: 'canteen_two', name: 'Canteen 2',
    coords: [[13.961736,121.612842],[13.961708,121.612911],[13.961558,121.612836],[13.961578,121.61275]] },
  { id: 'sr_building', name: 'SR Building',
    coords: [[13.961581,121.612667],[13.961561,121.612783],[13.961169,121.612678],[13.961192,121.612569]] },
  { id: 'ccss', name: 'CCSS',
    coords: [[13.961031,121.612428],[13.961028,121.612486],[13.960922,121.612481],[13.960928,121.612406]] },
  { id: 'gymnasium', name: 'Gymnasium',
    coords: [[13.962278,121.612417],[13.962472,121.612417],[13.962472,121.612806],[13.962278,121.612778]] },
  { id: 'engineering', name: 'New IBED Bldg',
    coords: [[13.962050,121.612260],[13.962048,121.612330],[13.961659,121.612290],[13.961672,121.612145]] },
];

// ── Build the Leaflet HTML ────────────────────────────────────────────────────
function buildLeafletHTML(buildings) {
  const buildingsJSON = JSON.stringify(buildings);
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body, #map { width: 100%; height: 100%; background: #0d1a10; }
  .leaflet-control-zoom { display: none; }
  .leaflet-control-attribution { font-size: 8px; opacity: 0.5; }
</style>
</head>
<body>
<div id="map"></div>
<script>
  var map = L.map('map', {
    center: [13.961706, 121.612236],
    zoom: 18,
    zoomControl: false,
    attributionControl: true
  });

  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 21,
    maxNativeZoom: 19,
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, Maxar, GeoEye, Earthstar Geographics'
  }).addTo(map);

  var FILL_DEFAULT  = 'rgba(0,200,83,0.20)';
  var FILL_SELECTED = 'rgba(0,200,83,0.55)';
  var STROKE        = '#00C853';

  var polygons = {};
  var gpsDot   = null;
  var routeLine = null;

  var buildings = ${buildingsJSON};

  buildings.forEach(function(b) {
    var poly = L.polygon(b.coords, {
      color:       STROKE,
      weight:      1.5,
      fillColor:   FILL_DEFAULT,
      fillOpacity: 1,
      opacity:     1,
    }).addTo(map);

    poly.bindTooltip(b.name, {
      permanent:  false,
      direction:  'center',
      className:  'building-label',
      opacity:    0.9,
    });

    poly.on('click', function() {
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'buildingPress', id: b.id }));
    });

    polygons[b.id] = poly;
  });

  function selectBuilding(id) {
    Object.keys(polygons).forEach(function(k) {
      polygons[k].setStyle({ fillColor: FILL_DEFAULT, weight: 1.5 });
    });
    if (id && polygons[id]) {
      polygons[id].setStyle({ fillColor: FILL_SELECTED, weight: 2.5 });
      map.panTo(polygons[id].getBounds().getCenter(), { animate: true, duration: 0.5 });
    }
  }

  function updateGPS(lat, lng) {
    if (!lat || !lng) return;
    if (!gpsDot) {
      gpsDot = L.circleMarker([lat, lng], {
        radius:      8,
        color:       '#ffffff',
        weight:      2.5,
        fillColor:   '#4285F4',
        fillOpacity: 1,
      }).addTo(map);
    } else {
      gpsDot.setLatLng([lat, lng]);
    }
  }

  function updateRoute(waypoints) {
    if (routeLine) { map.removeLayer(routeLine); routeLine = null; }
    if (!waypoints || waypoints.length < 2) return;
    var latlngs = waypoints.map(function(w) { return [w.lat, w.lng]; });
    routeLine = L.polyline(latlngs, {
      color:     '#00C853',
      weight:    4,
      opacity:   0.9,
      dashArray: '10, 8',
      lineCap:   'round',
    }).addTo(map);
  }

  // Listen for messages from React Native
  document.addEventListener('message', function(e) { handleMessage(e.data); });
  window.addEventListener('message',   function(e) { handleMessage(e.data); });

  function handleMessage(data) {
    try {
      var msg = JSON.parse(data);
      if (msg.type === 'selectBuilding') selectBuilding(msg.id);
      if (msg.type === 'updateGPS')      updateGPS(msg.lat, msg.lng);
      if (msg.type === 'updateRoute')    updateRoute(msg.waypoints);
      if (msg.type === 'clearRoute')     updateRoute(null);
    } catch(e) {}
  }

  // Signal ready
  window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'ready' }));
</script>
</body>
</html>`;
}

const LEAFLET_HTML = buildLeafletHTML(BUILDINGS);

// ── Component ─────────────────────────────────────────────────────────────────
export default function CampusMap({
  style,
  selectedId,
  userLocation,
  routeWaypoints,
  onPressBuilding,
  mini = false,
}) {
  const webRef = useRef(null);

  // Push messages into the WebView whenever props change
  const inject = useCallback((js) => {
    webRef.current?.injectJavaScript(js + '; true;');
  }, []);

  useEffect(() => {
    if (selectedId !== undefined) {
      inject(`selectBuilding(${JSON.stringify(selectedId)})`);
    }
  }, [selectedId, inject]);

  useEffect(() => {
    if (userLocation?.lat && userLocation?.lng) {
      inject(`updateGPS(${userLocation.lat}, ${userLocation.lng})`);
    }
  }, [userLocation, inject]);

  useEffect(() => {
    if (routeWaypoints && routeWaypoints.length > 1) {
      inject(`updateRoute(${JSON.stringify(routeWaypoints)})`);
    } else {
      inject(`updateRoute(null)`);
    }
  }, [routeWaypoints, inject]);

  function handleMessage(e) {
    try {
      const msg = JSON.parse(e.nativeEvent.data);
      if (msg.type === 'buildingPress' && onPressBuilding && !mini) {
        onPressBuilding(msg.id);
      }
    } catch (_) {}
  }

  return (
    <View style={[s.container, style]}>
      <WebView
        ref={webRef}
        style={StyleSheet.absoluteFill}
        source={{ html: LEAFLET_HTML }}
        onMessage={handleMessage}
        scrollEnabled={false}
        bounces={false}
        originWhitelist={['*']}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={false}
        scalesPageToFit={false}
        // Disable gestures on mini mode
        pointerEvents={mini ? 'none' : 'auto'}
        // Allow mixed content for tile loading
        mixedContentMode="always"
        androidLayerType="hardware"
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: '#0d1a10',
  },
});
