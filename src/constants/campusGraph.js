// ─────────────────────────────────────────────────────────────────────────────
// WAYFINDER — Campus Graph (Nodes + Edges)
//
// HOW TO UPDATE AFTER CAMPUS SURVEY:
//   1. Walk every junction/building and record the GPS coordinates.
//   2. Replace the lat/lng values in NODES below.
//   3. For each pair of nodes that are directly connected by a walkable path,
//      add a two-way edge in EDGES (order doesn't matter — buildGraph mirrors them).
//   4. The "dist" field is computed automatically from Haversine — you don't
//      need to measure it manually.
// ─────────────────────────────────────────────────────────────────────────────

import { distanceTo } from '../utils/arMath';

// ── Node registry ─────────────────────────────────────────────────────────────
// Every node needs a unique string ID, lat, and lng.
// Junction nodes sit at footpath intersections; building nodes sit at entrances.
export const NODES = {
  // ── Campus entrance / gate area ──────────────────────────────────────────
  gate:               { id: 'gate',               lat: 13.960958, lng: 121.611279 },
  motorcycle_parking: { id: 'motorcycle_parking', lat: 13.961253, lng: 121.611517 },

  // ── Main path junctions ───────────────────────────────────────────────────
  // Replace these with real GPS readings from your survey walk.
  // Tip: stand at the centre of each path intersection and note the coordinate.
  entrance:    { id: 'entrance',    lat: 13.96094,  lng: 121.6113  },
  junction_s:  { id: 'junction_s',  lat: 13.9612,   lng: 121.6118  },
  junction_c:  { id: 'junction_c',  lat: 13.9614,   lng: 121.612   },
  junction_n:  { id: 'junction_n',  lat: 13.9619,   lng: 121.6123  },
  junction_nw: { id: 'junction_nw', lat: 13.962,    lng: 121.6121  },
  junction_ne: { id: 'junction_ne', lat: 13.962,    lng: 121.6127  },
  junction_cw: { id: 'junction_cw', lat: 13.9615,   lng: 121.6119  },
  junction_ce: { id: 'junction_ce', lat: 13.9615,   lng: 121.6125  },

  // ── Building entrance nodes ───────────────────────────────────────────────
  main_building:  { id: 'main_building',  lat: 13.962011, lng: 121.612419 },
  new_building:   { id: 'new_building',   lat: 13.961281, lng: 121.612078 },
  ea_tower:       { id: 'ea_tower',       lat: 13.961942, lng: 121.612789 },
  ibed:           { id: 'ibed',           lat: 13.961389, lng: 121.612211 },
  sr_building:    { id: 'sr_building',    lat: 13.961367, lng: 121.612669 },
  canteen:        { id: 'canteen',        lat: 13.961397, lng: 121.611861 },
  canteen_two:    { id: 'canteen_two',    lat: 13.96165,  lng: 121.612831 },
  kitchen_hall:   { id: 'kitchen_hall',   lat: 13.962342, lng: 121.612903 },
  chapel:         { id: 'chapel',         lat: 13.961664, lng: 121.612053 },
  ccss:           { id: 'ccss',           lat: 13.960983, lng: 121.612456 },
  kindergarten:   { id: 'kindergarten',   lat: 13.961817, lng: 121.612114 },
  parking_lot:    { id: 'parking_lot',    lat: 13.961022, lng: 121.612058 },
};

// ── Edge list (undirected) ────────────────────────────────────────────────────
// Each entry is [nodeIdA, nodeIdB].  buildGraph() adds edges in both directions
// and computes the Haversine distance automatically.
//
// Replace / extend this list after your GPS survey to match the real footpaths.
const EDGES = [
  // Gate → entrance path
  ['gate',            'entrance'],
  ['entrance',        'motorcycle_parking'],
  ['entrance',        'junction_s'],

  // South cluster
  ['junction_s',      'junction_c'],
  ['junction_s',      'new_building'],
  ['junction_s',      'canteen'],
  ['junction_s',      'parking_lot'],

  // Central cluster
  ['junction_c',      'junction_n'],
  ['junction_c',      'junction_cw'],
  ['junction_c',      'junction_ce'],
  ['junction_c',      'ibed'],
  ['junction_c',      'chapel'],
  ['junction_c',      'ccss'],

  // Central west / east splits
  ['junction_cw',     'new_building'],
  ['junction_cw',     'ibed'],
  ['junction_ce',     'sr_building'],
  ['junction_ce',     'canteen_two'],

  // North cluster
  ['junction_n',      'junction_nw'],
  ['junction_n',      'junction_ne'],
  ['junction_n',      'kindergarten'],
  ['junction_n',      'main_building'],

  ['junction_nw',     'main_building'],
  ['junction_nw',     'kindergarten'],

  ['junction_ne',     'ea_tower'],
  ['junction_ne',     'main_building'],
  ['junction_ne',     'canteen_two'],
  ['junction_ne',     'kitchen_hall'],

  // Direct building shortcuts where paths allow
  ['main_building',   'ea_tower'],
  ['main_building',   'kitchen_hall'],
  ['ea_tower',        'canteen_two'],
  ['ibed',            'new_building'],
  ['ibed',            'sr_building'],
  ['sr_building',     'canteen_two'],
];

// ── Graph builder ─────────────────────────────────────────────────────────────
// Returns an adjacency map:  { nodeId: [{ id, dist }, ...], ... }
// Called by pathfinding.js every time A* runs (cheap — typically <50 nodes).
export function buildGraph() {
  const graph = {};

  // Initialise empty adjacency lists for every node
  for (const id of Object.keys(NODES)) {
    graph[id] = [];
  }

  for (const [a, b] of EDGES) {
    // Skip edges that reference nodes not in NODES (safety guard)
    if (!NODES[a] || !NODES[b]) {
      console.warn(`campusGraph: edge [${a}, ${b}] references unknown node`);
      continue;
    }

    const dist = distanceTo(
      NODES[a].lat, NODES[a].lng,
      NODES[b].lat, NODES[b].lng,
    );

    graph[a].push({ id: b, dist });
    graph[b].push({ id: a, dist }); // undirected
  }

  return graph;
}
