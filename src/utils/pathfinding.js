import { NODES, buildGraph } from '../constants/campusGraph';
import { distanceTo } from './arMath';

// Build the graph once at module load — NODES and EDGES are static constants
// so there is no reason to recompute Haversine distances on every A* call.
const GRAPH = buildGraph();

// ── Haversine heuristic for A* ────────────────────────────────────────────────
function heuristic(aId, bId) {
  const a = NODES[aId];
  const b = NODES[bId];
  if (!a || !b) return Infinity;
  return distanceTo(a.lat, a.lng, b.lat, b.lng);
}

// ── A* search ─────────────────────────────────────────────────────────────────
// Returns an array of node IDs forming the shortest path from startId → goalId.
// Returns [] if no path exists or if either node is unknown.
export function aStar(startId, goalId) {
  if (!NODES[startId] || !NODES[goalId]) return [];
  if (startId === goalId) return [startId];

  const graph    = GRAPH;
  const open     = new Set([startId]);
  const cameFrom = {};
  const gScore   = { [startId]: 0 };
  const fScore   = { [startId]: heuristic(startId, goalId) };

  while (open.size > 0) {
    // Pick the open node with the lowest fScore
    let current = null;
    let bestF   = Infinity;
    for (const id of open) {
      const f = fScore[id] ?? Infinity;
      if (f < bestF) { bestF = f; current = id; }
    }

    if (current === goalId) {
      // Reconstruct path
      const path = [current];
      while (cameFrom[current]) {
        current = cameFrom[current];
        path.unshift(current);
      }
      return path;
    }

    open.delete(current);

    for (const neighbor of graph[current] ?? []) {
      const tentative = (gScore[current] ?? Infinity) + neighbor.dist;
      if (tentative < (gScore[neighbor.id] ?? Infinity)) {
        cameFrom[neighbor.id] = current;
        gScore[neighbor.id]   = tentative;
        fScore[neighbor.id]   = tentative + heuristic(neighbor.id, goalId);
        open.add(neighbor.id);
      }
    }
  }

  return []; // no path found
}

// ── Nearest graph node to an arbitrary GPS position ──────────────────────────
// Snaps to path/junction nodes only — not dead-end building entrance nodes.
// This prevents A* from starting at a building node and routing backwards.
const PATH_NODE_PREFIXES = ['J', 'R', 'W', 'MB'];
const PATH_NODE_IDS      = new Set(['gate', 'new_building', 'canteen']);

export function nearestNode(lat, lng) {
  let bestId   = null;
  let bestDist = Infinity;
  for (const [id, node] of Object.entries(NODES)) {
    const isPathNode = PATH_NODE_IDS.has(id) ||
                       PATH_NODE_PREFIXES.some(p => id.startsWith(p));
    if (!isPathNode) continue;
    const d = distanceTo(lat, lng, node.lat, node.lng);
    if (d < bestDist) { bestDist = d; bestId = id; }
  }
  if (!bestId) {
    for (const [id, node] of Object.entries(NODES)) {
      const d = distanceTo(lat, lng, node.lat, node.lng);
      if (d < bestDist) { bestDist = d; bestId = id; }
    }
  }
  return bestId;
}

// ── Convert an array of node IDs → ordered GPS waypoints ─────────────────────
export function getWaypoints(pathIds) {
  return pathIds
    .filter(id => NODES[id])          // skip any unknown IDs defensively
    .map(id => ({ ...NODES[id] }));   // shallow copy so callers can mutate safely
}
