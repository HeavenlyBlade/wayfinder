import { NODES, buildGraph } from '../constants/campusGraph';

// Haversine straight-line distance (heuristic for A*)
function heuristic(aId, bId) {
  const a = NODES[aId], b = NODES[bId];
  const R = 6371000;
  const dLat = (b.lat - a.lat) * Math.PI / 180;
  const dLng = (b.lng - a.lng) * Math.PI / 180;
  const sin2 = Math.sin(dLat / 2) ** 2 +
    Math.cos(a.lat * Math.PI / 180) *
    Math.cos(b.lat * Math.PI / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.asin(Math.sqrt(sin2));
}

// Returns array of node IDs from startId → goalId
export function aStar(startId, goalId) {
  const graph = buildGraph();
  const open  = new Set([startId]);
  const cameFrom = {};
  const gScore = { [startId]: 0 };
  const fScore = { [startId]: heuristic(startId, goalId) };

  while (open.size > 0) {
    // Node in open with lowest fScore
    let current = [...open].reduce((a, b) =>
      (fScore[a] ?? Infinity) < (fScore[b] ?? Infinity) ? a : b
    );

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

// Given user GPS + path node IDs, returns ordered waypoint coords
export function getWaypoints(pathIds) {
  return pathIds.map(id => NODES[id]);
}