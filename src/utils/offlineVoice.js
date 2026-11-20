// ─────────────────────────────────────────────────────────────────────────────
// Offline voice intent resolver
//
// Takes a raw speech transcript string and returns the best matching
// building ID from the campus database — no internet required.
//
// Strategy:
//   1. Normalise the transcript (lowercase, strip punctuation)
//   2. Check each building's name, shortName, aliases, and facility keywords
//   3. Score by longest matching token sequence
//   4. Return the highest-scoring building ID, or null if no confident match
// ─────────────────────────────────────────────────────────────────────────────

import { BUILDINGS } from '../constants/buildings';

// ── Alias table ───────────────────────────────────────────────────────────────
// Single source of truth for client-side spoken-name → building ID mapping.
// Each building entry in buildings.js may optionally carry an `aliases` array.
// Entries below are for spoken names that differ from the official building name
// and are not already covered by building.name, building.shortName, or
// building.facilities.
//
// NOTE: The backend (wayfinder-backend/utils/groq_ai.py) maintains its own
// BUILDING_ALIASES and system-prompt building list. Keep those in sync
// whenever you add buildings or aliases here. A shared JSON source of truth
// (e.g. buildings.json consumed by both sides) is the preferred long-term fix.
const ALIASES = {
  main_building:  ['main building', 'main', 'main bldg', 'main hall',
                   'registrar', 'cashier', 'library', 'clinic', 'guidance',
                   'presidents office', 'comlab', 'computer lab'],
  new_building:   ['new building', 'new bldg', 'admission', 'admissions',
                   'ibed library', 'physical therapy'],
  ea_tower:       ['ea tower', 'ea', 'tower', 'the hub', 'restaurant',
                   'hospitality', 'tourism', 'hrm tower'],
  ibed:           ['ibed', 'ibed building', 'integrated basic education',
                   'avr', 'audio visual', 'chemistry lab'],
  sr_building:    ['sr building', 'sr', 'dentistry', 'dental clinic',
                   'dental', 'simulation lab'],
  canteen:        ['canteen', 'canteen 1', 'big canteen', 'cafeteria', 'food'],
  canteen_two:    ['canteen 2', 'canteen two', 'second canteen', 'small canteen'],
  kitchen_hall:   ['kitchen', 'kitchen hall', 'culinary', 'hot kitchen',
                   'hrm kitchen', 'deans office hrm'],
  chapel:         ['chapel', 'church', 'prayer', 'mass'],
  kindergarten:   ['kindergarten', 'kinder', 'kinder building', 'nursery'],
  ccss:           ['ccss', 'criminology', 'criminal justice'],
  gymnasium:      ['gymnasium', 'gym', 'sports hall', 'basketball court'],
  engineering:    ['engineering', 'engineering building', 'new ibed'],
  gate:           ['gate', 'main gate', 'entrance', 'exit'],
  parking_lot:    ['parking', 'parking lot', 'car park', 'car parking'],
  motorcycle_parking: ['motorcycle parking', 'moto parking', 'motor parking', 'motorbike'],
};

// ── Normalise text ────────────────────────────────────────────────────────────
function normalise(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')   // strip punctuation
    .replace(/\s+/g, ' ')
    .trim();
}

// ── Score a single candidate against the transcript ──────────────────────────
function scoreCandidate(transcript, buildingId, building) {
  let best = 0;
  const norm = normalise(transcript);

  const candidates = [
    building.name,
    building.shortName,
    ...(ALIASES[buildingId] ?? []),
    ...(building.aliases ?? []),    // aliases array on the building object (future use)
    ...(building.facilities ?? []),
  ].map(normalise);

  for (const candidate of candidates) {
    if (norm.includes(candidate)) {
      // Weight by length — longer match = more specific = better score
      const score = candidate.length;
      if (score > best) best = score;
    }
    // Also check if any individual word of the candidate appears
    const words = candidate.split(' ');
    let wordScore = 0;
    for (const word of words) {
      if (word.length >= 3 && norm.includes(word)) {
        wordScore += word.length * 0.4;
      }
    }
    if (wordScore > best) best = wordScore;
  }

  return best;
}

// ── Main resolver ─────────────────────────────────────────────────────────────
/**
 * resolveDestination(transcript: string) → string | null
 *
 * Returns the building ID with the highest match score, or null if the
 * best score is too low to be confident (avoids false positives).
 */
export function resolveDestination(transcript) {
  if (!transcript || transcript.trim().length === 0) return null;

  let bestId    = null;
  let bestScore = 0;

  for (const [id, building] of Object.entries(BUILDINGS)) {
    const score = scoreCandidate(transcript, id, building);
    if (score > bestScore) {
      bestScore = score;
      bestId    = id;
    }
  }

  // Require a minimum confidence — score of 5 means a meaningful word matched
  // (raised from 3 to avoid false positives like "can" matching "canteen")
  return bestScore >= 5 ? bestId : null;
}

// ── Human-readable reply ─────────────────────────────────────────────────────
/**
 * Build a short confirmation message shown in the AI reply bubble.
 */
export function buildReply(transcript, buildingId) {
  if (!buildingId) {
    return `Sorry, I couldn't find "${transcript}". Try saying a building name.`;
  }
  const building = BUILDINGS[buildingId];
  if (!building) return `Navigating to ${buildingId}.`;
  return `Navigating to ${building.name}!`;
}
