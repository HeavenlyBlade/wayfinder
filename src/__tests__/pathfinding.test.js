/**
 * tests/pathfinding.test.js
 * Pure unit tests for aStar, nearestNode, and getWaypoints.
 * No native modules or network required.
 */

// Mock expo/react-native modules that campusGraph transitively imports
jest.mock('expo-location', () => ({}));
jest.mock('@react-native-async-storage/async-storage', () => ({}));

import { aStar, nearestNode, getWaypoints } from '../utils/pathfinding';
import { NODES } from '../constants/campusGraph';

describe('aStar', () => {
  it('returns a non-empty path from gate to chapel', () => {
    const path = aStar('gate', 'chapel');
    expect(Array.isArray(path)).toBe(true);
    expect(path.length).toBeGreaterThan(0);
    expect(path[0]).toBe('gate');
    expect(path[path.length - 1]).toBe('chapel');
  });

  it('returns a single-element array when start equals goal', () => {
    const path = aStar('gate', 'gate');
    expect(path).toEqual(['gate']);
  });

  it('returns [] for an unknown start node', () => {
    const path = aStar('nonexistent_node', 'chapel');
    expect(path).toEqual([]);
  });

  it('returns [] for an unknown goal node', () => {
    const path = aStar('gate', 'nonexistent_goal');
    expect(path).toEqual([]);
  });

  it('each node in the path exists in NODES', () => {
    const path = aStar('gate', 'chapel');
    path.forEach(nodeId => {
      expect(NODES[nodeId]).toBeDefined();
    });
  });
});

describe('nearestNode', () => {
  it('returns a valid node id for a known GPS coordinate', () => {
    // Use approximate coordinates for the SACLI campus gate
    const nodeId = nearestNode(13.9614, 121.6175);
    expect(nodeId).toBeTruthy();
    expect(NODES[nodeId]).toBeDefined();
  });

  it('returns a string node id', () => {
    const nodeId = nearestNode(13.9614, 121.6175);
    expect(typeof nodeId).toBe('string');
  });
});

describe('getWaypoints', () => {
  it('converts a path of node ids to lat/lng objects', () => {
    const path = aStar('gate', 'chapel');
    const waypoints = getWaypoints(path);
    expect(waypoints.length).toBe(path.length);
    waypoints.forEach(wp => {
      expect(typeof wp.lat).toBe('number');
      expect(typeof wp.lng).toBe('number');
    });
  });

  it('filters out unknown node ids', () => {
    const waypoints = getWaypoints(['gate', 'bad_id', 'chapel']);
    expect(waypoints.length).toBe(2);
  });
});
