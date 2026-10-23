// ─────────────────────────────────────────────────────────────────────────────
// WAYFINDER — Room Search Index
//
// Flattens every room from every building floor into a single searchable list.
// Each entry carries enough context to navigate to the building and show
// the user which floor the room is on.
// ─────────────────────────────────────────────────────────────────────────────

import { BUILDINGS } from './buildings';

/**
 * @typedef {Object} RoomEntry
 * @property {string} id          - Unique key: "buildingId::floorLabel::roomName"
 * @property {string} room        - Room name as shown on screen
 * @property {string} floor       - Floor label e.g. "Ground Floor"
 * @property {string} floorLabel  - Short label e.g. "GF", "1F", "2F"
 * @property {string} buildingId  - Parent building ID
 * @property {string} buildingName - Parent building display name
 * @property {string} buildingIcon - Icon key for BuildingIcon component
 * @property {string} buildingColor - Hex color for the icon background
 */

/** All rooms across all buildings, ready for search. */
export const ROOM_INDEX = (() => {
  const entries = [];
  for (const building of Object.values(BUILDINGS)) {
    if (!building.floors?.length) continue;
    for (const floor of building.floors) {
      if (!floor.rooms?.length) continue;
      for (const room of floor.rooms) {
        entries.push({
          id:            `${building.id}::${floor.label}::${room}`,
          room,
          floor:         floor.level,
          floorLabel:    floor.label,
          buildingId:    building.id,
          buildingName:  building.name,
          buildingIcon:  building.icon,
          buildingColor: building.color,
        });
      }
    }
  }
  return entries;
})();
