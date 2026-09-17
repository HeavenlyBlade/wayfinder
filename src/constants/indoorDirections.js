// ─────────────────────────────────────────────────────────────────────────────
// WAYFINDER — Indoor Room Directions
//
// Structure per room:
//   directions[buildingId][roomName][fromFloor][staircaseKey] = "instruction string"
//
// Staircase keys:
//   "s1"  — Staircase 1 (Front/1st Entrance)
//   "s2"  — Staircase 2 (2nd Entrance)
//   "any" — Single staircase building (no picker needed)
//
// Floor keys: "gf" | "1f" | "2f" | "3f" | "4f"
//
// Blank entries = not yet filled in (will show fallback message in UI).
// ─────────────────────────────────────────────────────────────────────────────

export const INDOOR_DIRECTIONS = {

  // ── MAIN BUILDING ──────────────────────────────────────────────────────────
  main_building: {

    // ── Ground Floor rooms ──
    "School Clinic": {
      gf: { s1: "You're almost there! Go in front of the building and head straight — the clinic sign is above the door on your right." },
      "1f": {
        s1: "From the stairs, go down to the ground floor, then go to the front of the building. Head straight through the hallway — the clinic sign is above the door on your right.",
        s2: "From the stairs, turn right and go straight until you see a hallway to the left with stairs. Turn left and go straight until you reach stairs going downward. Go inside the underground-like hallway and head straight — the clinic sign is above the door on your right.",
      },
      "2f": {
        s1: "From the stairs, go down to 1st floor, go outside the building, go down the stairs again, then head into the front of the building. Go straight — the clinic sign is above the door on your right.",
        s2: "From the stairs, turn right and go straight until you reach a hallway to the left, stairs in front, and a bathroom to your right. Turn left, go straight, then turn left again, go down the stairs, turn left, go outside and down the stairs. Enter the front of the building and head straight — the clinic sign is above the door on your right.",
      },
      "3f": {
        s1: "From the stairs, go down to 2nd floor, then 1st floor, go outside and down the stairs. Head into the front of the building and go straight — the clinic sign is above the door on your right.",
        s2: "From the stairs, turn right, go straight until you reach a hallway to the left, stairs in front, and a bathroom to your right. Turn left, go straight, turn left, go down to 2nd floor, go down the stairs, turn left, go outside and down the stairs. Enter the front of the building — the clinic sign is above the door on your right.",
      },
      "4f": {
        s1: "From the stairs, go down to 3rd floor, 2nd floor, then 1st floor, go outside and down the stairs. Head into the front of the building and go straight — the clinic sign is above the door on your right.",
        s2: "From the stairs, turn right, go straight to the hallway intersection. Turn left, go straight, turn left, go down 3 floors, turn left, go outside and down the stairs. Enter the front of the building — the clinic sign is above the door on your right.",
      },
    },

    "Office of the Student Affairs": {
      gf: { s1: "You're almost there! Go in front of the building and head straight — the Student Affairs sign is above the door on your left." },
      "1f": {
        s1: "From the stairs, go down to the ground floor, then go to the front of the building. Head straight — the Student Affairs sign is above the door on your left.",
        s2: "From the stairs, turn right and go straight until you see a hallway to the left with stairs. Turn left and go straight until you reach the stairs going downward. Go inside the hallway and head straight — the Student Affairs sign is above the door on your left.",
      },
      "2f": {
        s1: "From the stairs, go down to 1st floor, go outside the building, go down the stairs. Head into the front of the building and go straight — the Student Affairs sign is above the door on your left.",
        s2: "From the stairs, turn right to the hallway intersection. Turn left, go straight, turn left, go down the stairs, turn left, go outside and down. Enter the front of the building — the Student Affairs sign is above the door on your left.",
      },
      "3f": {
        s1: "From the stairs, go down to 2nd floor, then 1st floor, go outside and down. Head into the front of the building and go straight — the Student Affairs sign is above the door on your left.",
        s2: "From the stairs, turn right to the intersection. Turn left, go straight, turn left, go down to 2nd floor, down the stairs, turn left, go outside and down. Enter the front — the Student Affairs sign is above the door on your left.",
      },
      "4f": {
        s1: "From the stairs, go down to 3rd, 2nd, then 1st floor, go outside and down. Head into the front of the building and go straight — the Student Affairs sign is above the door on your left.",
        s2: "From the stairs, turn right to the intersection. Turn left, go straight, turn left, go down 3 floors, turn left, go outside and down. Enter the front — the Student Affairs sign is above the door on your left.",
      },
    },

    "SPS Office": {
      gf: { s1: "You're almost there! Go in front of the building and head straight — the SPS Office sign is above the door on your left." },
      "1f": {
        s1: "From the stairs, go down to the ground floor, go to the front of the building. Head straight — the SPS Office sign is above the door on your left.",
        s2: "From the stairs, turn right and go straight until you see a hallway to the left. Turn left and go down the stairs into the hallway — the SPS Office sign is above the door on your left.",
      },
      "2f": {
        s1: "Go down to 1st floor, go outside and down. Head into the front of the building — the SPS Office sign is above the door on your left.",
        s2: "Go down to 1st floor via Staircase 2, then turn left and go down to the hallway — the SPS Office sign is above the door on your left.",
      },
      "3f": {
        s1: "Go down to 2nd floor, then 1st floor, go outside and down. Head into the front — the SPS Office sign is above the door on your left.",
        s2: "Go down to 2nd floor, then 1st floor via Staircase 2, go down to the hallway — the SPS Office sign is above the door on your left.",
      },
      "4f": {
        s1: "Go down to 3rd, 2nd, then 1st floor, go outside and down. Head into the front — the SPS Office sign is above the door on your left.",
        s2: "Go down to 3rd, 2nd, then 1st floor via Staircase 2, go down to the hallway — the SPS Office sign is above the door on your left.",
      },
    },

    "Lyre Band Office": {
      gf: { s1: "You're almost there! Go in front of the building and head straight — the Lyre Band Office sign is above the door on your left." },
      "1f": {
        s1: "From the stairs, go down to the ground floor, go to the front of the building. Head straight — the Lyre Band Office sign is above the door on your left.",
        s2: "From the stairs, turn right and go straight to the hallway with stairs going down. Turn left, go down, and head straight — the Lyre Band Office sign is above the door on your left.",
      },
      "2f": {
        s1: "Go down to 1st floor, go outside and down. Head into the front of the building — the Lyre Band Office sign is above the door on your left.",
        s2: "Go down to 1st floor, go down the stairs to the hallway — the Lyre Band Office sign is above the door on your left.",
      },
      "3f": {
        s1: "Go down to 2nd, then 1st floor, go outside and down. Enter the front — the Lyre Band Office sign is above the door on your left.",
        s2: "Go down to 2nd, then 1st floor, go down the hallway stairs — the Lyre Band Office sign is above the door on your left.",
      },
      "4f": {
        s1: "Go down to 3rd, 2nd, then 1st floor, go outside and down. Enter the front — the Lyre Band Office sign is above the door on your left.",
        s2: "Go down to 3rd, 2nd, then 1st floor, go down the hallway stairs — the Lyre Band Office sign is above the door on your left.",
      },
    },

    "Prefect of Discipline / Office of NSTP": {
      gf: { s1: "You're almost there! Go in front of the building and head straight — the Prefect of Discipline / NSTP sign is above the door on your right." },
      "1f": {
        s1: "From the stairs, go down to the ground floor, go to the front of the building. Head straight — the NSTP sign is above the door on your right.",
        s2: "From the stairs, turn right and go straight to the hallway with stairs going down. Turn left, go down, and head straight — the NSTP sign is above the door on your right.",
      },
      "2f": {
        s1: "Go down to 1st floor, go outside and down. Enter the front — the NSTP sign is above the door on your right.",
        s2: "Go down to 1st floor, go down the hallway stairs — the NSTP sign is above the door on your right.",
      },
      "3f": {
        s1: "Go down to 2nd, then 1st floor, go outside and down. Enter the front — the NSTP sign is above the door on your right.",
        s2: "Go down to 2nd, then 1st floor, go down the hallway stairs — the NSTP sign is above the door on your right.",
      },
      "4f": {
        s1: "Go down to 3rd, 2nd, then 1st floor, go outside and down. Enter the front — the NSTP sign is above the door on your right.",
        s2: "Go down to 3rd, 2nd, then 1st floor, go down the hallway stairs — the NSTP sign is above the door on your right.",
      },
    },

    "Guidance Office": {
      gf: { s1: "You're almost there! Go in front of the building and head straight — the Guidance Office sign is above the door on your left." },
      "1f": {
        s1: "From the stairs, go down to the ground floor, go to the front of the building. Head straight — the Guidance Office sign is above the door on your left.",
        s2: "From the stairs, turn right and go straight to the hallway with stairs going down. Turn left, go down, and head straight — the Guidance Office sign is above the door on your left.",
      },
      "2f": {
        s1: "Go down to 1st floor, go outside and down. Enter the front — the Guidance Office sign is above the door on your left.",
        s2: "Go down to 1st floor, go down the hallway stairs — the Guidance Office sign is above the door on your left.",
      },
      "3f": {
        s1: "Go down to 2nd, then 1st floor, go outside and down. Enter the front — the Guidance Office sign is above the door on your left.",
        s2: "Go down to 2nd, then 1st floor, go down the hallway stairs — the Guidance Office sign is above the door on your left.",
      },
      "4f": {
        s1: "Go down to 3rd, 2nd, then 1st floor, go outside and down. Enter the front — the Guidance Office sign is above the door on your left.",
        s2: "Go down to 3rd, 2nd, then 1st floor, go down the hallway stairs — the Guidance Office sign is above the door on your left.",
      },
    },

    "Counseling Room": {
      gf: { s1: "You're almost there! Go in front of the building and head straight — the Counseling Room sign is above the door on your left." },
      "1f": {
        s1: "From the stairs, go down to the ground floor, go to the front. Head straight — the Counseling Room sign is above the door on your left.",
        s2: "From the stairs, turn right and go straight to the stairs going down. Turn left, go down, head straight — the Counseling Room sign is on your left.",
      },
      "2f": {
        s1: "Go down to 1st floor, go outside and down. Enter the front — the Counseling Room sign is on your left.",
        s2: "Go down to 1st floor, go down the hallway stairs — the Counseling Room sign is on your left.",
      },
      "3f": {
        s1: "Go down to 2nd, then 1st floor, go outside and down. Enter the front — the Counseling Room sign is on your left.",
        s2: "Go down to 2nd, then 1st floor, go down the hallway stairs — the Counseling Room sign is on your left.",
      },
      "4f": {
        s1: "Go down to 3rd, 2nd, then 1st floor, go outside and down. Enter the front — the Counseling Room sign is on your left.",
        s2: "Go down to 3rd, 2nd, then 1st floor, go down the hallway stairs — the Counseling Room sign is on your left.",
      },
    },

    "Testing Center & Sports and Cultural Affairs / Psychological Interpretation": {
      gf: { s1: "You're almost there! Go in front of the building and head straight — the Testing Center sign is above the door on your left." },
      "1f": {
        s1: "From the stairs, go down to the ground floor, go to the front. Head straight — the Testing Center sign is above the door on your left.",
        s2: "From the stairs, turn right and go straight to the stairs going down. Turn left, go down, head straight — the Testing Center sign is on your left.",
      },
      "2f": {
        s1: "Go down to 1st floor, go outside and down. Enter the front — the Testing Center sign is on your left.",
        s2: "Go down to 1st floor, go down the hallway stairs — the Testing Center sign is on your left.",
      },
      "3f": {
        s1: "Go down to 2nd, then 1st floor, go outside and down. Enter the front — the Testing Center sign is on your left.",
        s2: "Go down to 2nd, then 1st floor, go down the hallway stairs — the Testing Center sign is on your left.",
      },
      "4f": {
        s1: "Go down to 3rd, 2nd, then 1st floor, go outside and down. Enter the front — the Testing Center sign is on your left.",
        s2: "Go down to 3rd, 2nd, then 1st floor, go down the hallway stairs — the Testing Center sign is on your left.",
      },
    },

    "ICT / MIS Office": {
      gf: { s1: "You're almost there! Go in front of the building and head straight — the ICT / MIS Office sign is above the door on your right." },
      "1f": {
        s1: "From the stairs, go down to the ground floor, go to the front. Head straight — the ICT / MIS Office sign is above the door on your right.",
        s2: "From the stairs, turn right and go straight to the stairs going down. Turn left, go down, head straight — the ICT / MIS Office sign is on your right.",
      },
      "2f": {
        s1: "Go down to 1st floor, go outside and down. Enter the front — the ICT / MIS Office sign is on your right.",
        s2: "Go down to 1st floor, turn right, go straight to the hallway intersection, turn left, go down the stairs, turn left, go outside and down. Enter the front — the ICT / MIS Office sign is on your right.",
      },
      "3f": {
        s1: "Go down to 2nd, then 1st floor, go outside and down. Enter the front — the ICT / MIS Office sign is on your right.",
        s2: "Go down to 2nd, then 1st floor via Staircase 2, turn right, go to the hallway intersection, then go down the stairs to the hallway — the ICT / MIS Office sign is on your right.",
      },
      "4f": {
        s1: "Go down to 3rd, 2nd, then 1st floor, go outside and down. Enter the front — the ICT / MIS Office sign is on your right.",
        s2: "Go down to 3rd, 2nd, then 1st floor via Staircase 2, go to the hallway and down the stairs — the ICT / MIS Office sign is on your right.",
      },
    },

    // ── 1st Floor rooms ──
    "Quality Assurance Office": {
      gf: { s1: "Go upstairs. Turn left and head straight into the hallway — the Quality Assurance Office is at the far end on your left." },
      "1f": {
        s1: "You're already on this floor. Turn left, head straight — the Quality Assurance Office is at the far end on your left.",
        s2: "You're already on this floor. Head straight until you see a staircase. Don't go up — the Quality Assurance Office door is on your right.",
      },
      "2f": {
        s1: "Go down to 1st floor. Turn left, then turn right into the hallway. Head straight — Quality Assurance Office is at the far end on your left.",
        s2: "Go down to 1st floor. Turn right and head straight until you see a staircase. Don't go up — Quality Assurance Office door is on your right.",
      },
      "3f": {
        s1: "Go down to 2nd, then 1st floor. Turn left, turn right into the hallway, head straight — Quality Assurance Office is at the far end on your left.",
        s2: "Go down to 2nd, then 1st floor. Turn right, head straight to the staircase. Don't go up — Quality Assurance Office door is on your right.",
      },
      "4f": {
        s1: "Go down to 3rd, 2nd, then 1st floor. Turn left, turn right into the hallway, head straight — Quality Assurance Office is at the far end on your left.",
        s2: "Go down to 3rd, 2nd, then 1st floor. Turn right, head straight to the staircase. Don't go up — Quality Assurance Office door is on your right.",
      },
    },

    "Administrative Affairs Office": {
      gf: { s1: "Go upstairs. Turn left and head straight into the hallway — the Administrative Affairs Office is at the far end on your left." },
      "1f": {
        s1: "You're already on this floor. Turn left, head straight — the Administrative Affairs Office is at the far end on your left.",
        s2: "You're already on this floor. Head straight until you see a staircase. Don't go up — the Administrative Affairs Office door is on your right.",
      },
      "2f": {
        s1: "Go down to 1st floor. Turn left, turn right into the hallway, head straight — Administrative Affairs Office is at the far end on your left.",
        s2: "Go down to 1st floor. Turn right, head straight to the staircase. Don't go up — Administrative Affairs Office door is on your right.",
      },
      "3f": {
        s1: "Go down to 2nd, then 1st floor. Turn left, turn right into the hallway, head straight — Administrative Affairs Office is at the far end on your left.",
        s2: "Go down to 2nd, then 1st floor. Turn right, head straight to the staircase — Administrative Affairs Office door is on your right.",
      },
      "4f": {
        s1: "Go down to 3rd, 2nd, then 1st floor. Turn left, turn right, head straight — Administrative Affairs Office is at the far end on your left.",
        s2: "Go down to 3rd, 2nd, then 1st floor. Turn right, head straight — Administrative Affairs Office door is on your right.",
      },
    },

    "AVR": {
      gf: { s1: "Go upstairs. Turn left, head straight into the hallway to the far end, then turn right — AVR sign is above the door." },
      "1f": {
        s1: "You're already on this floor. Turn left, head straight to the far end, then turn right — AVR sign is above the door.",
        s2: "You're already on this floor. Head straight until you see AVR above the door to your left.",
      },
      "2f": {
        s1: "Go down to 1st floor. Turn left, head straight to the far end, turn right — AVR sign is above the door.",
        s2: "Go down to 1st floor. Turn right and head straight until you see AVR above the door to your left.",
      },
      "3f": {
        s1: "Go down to 2nd, then 1st floor. Turn left, head straight, turn right at the far end — AVR sign is above the door.",
        s2: "Go down to 2nd, then 1st floor. Turn right and head straight — AVR above the door to your left.",
      },
      "4f": {
        s1: "Go down to 3rd, 2nd, then 1st floor. Turn left, head straight, turn right at the far end — AVR sign is above the door.",
        s2: "Go down to 3rd, 2nd, then 1st floor. Turn right and head straight — AVR above the door to your left.",
      },
    },

    "Anatomy Lab": {
      gf: { s1: "Go upstairs. Turn left, head straight into the hallway to the far end, then turn right — Anatomy Lab sign is above the door." },
      "1f": {
        s1: "You're already on this floor. Turn left, head straight to the far end, then turn right — Anatomy Lab sign is above the door.",
        s2: "You're already on this floor. Head straight until you see the Anatomy Lab sign above a door.",
      },
      "2f": {
        s1: "Go down to 1st floor. Turn left, head straight to the far end, turn right — Anatomy Lab sign is above the door.",
        s2: "Go down to 1st floor. Turn right and head straight — Anatomy Lab sign above the door.",
      },
      "3f": {
        s1: "Go down to 2nd, then 1st floor. Turn left, head straight, turn right — Anatomy Lab sign is above the door.",
        s2: "Go down to 2nd, then 1st floor. Turn right, head straight — Anatomy Lab sign above the door.",
      },
      "4f": {
        s1: "Go down to 3rd, 2nd, then 1st floor. Turn left, head straight, turn right — Anatomy Lab sign is above the door.",
        s2: "Go down to 3rd, 2nd, then 1st floor. Turn right, head straight — Anatomy Lab sign above the door.",
      },
    },

    "Chemistry Lab": {
      gf: { s1: "Go upstairs. Turn left, head straight to the far end, then turn right — Chemistry Lab sign is above the door." },
      "1f": {
        s1: "You're already on this floor. Turn left, head straight to the far end, turn right — Chemistry Lab sign is above the door.",
        s2: "You're already on this floor. Head straight until you see the Chemistry Lab sign above a door.",
      },
      "2f": {
        s1: "Go down to 1st floor. Turn left, head straight to the far end, turn right — Chemistry Lab sign is above the door.",
        s2: "Go down to 1st floor. Turn right and head straight — Chemistry Lab sign above the door.",
      },
      "3f": {
        s1: "Go down to 2nd, then 1st floor. Turn left, head straight, turn right — Chemistry Lab above the door.",
        s2: "Go down to 2nd, then 1st floor. Turn right, head straight — Chemistry Lab above the door.",
      },
      "4f": {
        s1: "Go down to 3rd, 2nd, then 1st floor. Turn left, head straight, turn right — Chemistry Lab above the door.",
        s2: "Go down to 3rd, 2nd, then 1st floor. Turn right, head straight — Chemistry Lab above the door.",
      },
    },

    "Academic Office": {
      gf: { s1: "Go upstairs. Turn left and head straight into the hallway — Academic Office sign is above the door." },
      "1f": {
        s1: "You're already on this floor. Turn left, head straight — Academic Office sign is at the far end above the door.",
        s2: "You're already on this floor. Head straight until you see a staircase. Turn left — Academic Office sign is above the door.",
      },
      "2f": {
        s1: "Go down to 1st floor. Turn left, turn right into the hallway, head straight — Academic Office sign above the door.",
        s2: "Go down to 1st floor. Turn right, head straight to staircase, turn left — Academic Office sign above the door.",
      },
      "3f": {
        s1: "Go down to 2nd, then 1st floor. Turn left, turn right, head straight — Academic Office above the door.",
        s2: "Go down to 2nd, then 1st floor. Turn right, head straight to staircase, turn left — Academic Office above the door.",
      },
      "4f": {
        s1: "Go down to 3rd, 2nd, then 1st floor. Turn left, turn right, head straight — Academic Office above the door.",
        s2: "Go down to 3rd, 2nd, then 1st floor. Turn right, head straight to staircase, turn left — Academic Office above the door.",
      },
    },

    "Office of the President": {
      gf: { s1: "Go upstairs. Turn left and head straight — Office of the President sign is above the door." },
      "1f": {
        s1: "You're already on this floor. Turn left, head straight — Office of the President sign is above the door.",
        s2: "You're already on this floor. Head straight to the staircase, turn left — Office of the President sign is above the door.",
      },
      "2f": {
        s1: "Go down to 1st floor. Turn left, turn right into the hallway, head straight — Office of the President sign above the door.",
        s2: "Go down to 1st floor. Turn right, head straight to staircase, turn left — Office of the President sign above the door.",
      },
      "3f": {
        s1: "Go down to 2nd, then 1st floor. Turn left, turn right, head straight — Office of the President above the door.",
        s2: "Go down to 2nd, then 1st floor. Turn right, head straight to staircase, turn left — Office of the President above the door.",
      },
      "4f": {
        s1: "Go down to 3rd, 2nd, then 1st floor. Turn left, turn right, head straight — Office of the President above the door.",
        s2: "Go down to 3rd, 2nd, then 1st floor. Turn right, head straight to staircase, turn left — Office of the President above the door.",
      },
    },

    "Record Section — Window 2 (BSHRM, 2-Year HRM, BSTourism, Caregiving)": {
      gf: { s1: "Go upstairs. Turn left and head straight — look for the Record Section Window 2 sign on the counters." },
      "1f": {
        s1: "You're already on this floor. Turn left, head straight — look for Record Section Window 2 sign on the counters.",
        s2: "You're already on this floor. Head straight to the staircase, turn left — Record Section Window 2 sign on the counters.",
      },
      "2f": {
        s1: "Go down to 1st floor. Turn left, turn right, head straight — Record Section Window 2 on the counters.",
        s2: "Go down to 1st floor. Turn right, head straight to staircase, turn left — Record Section Window 2 on the counters.",
      },
      "3f": {
        s1: "Go down to 2nd, then 1st floor. Turn left, turn right, head straight — Record Section Window 2 on the counters.",
        s2: "Go down to 2nd, then 1st floor. Turn right, head to staircase, turn left — Record Section Window 2 on the counters.",
      },
      "4f": {
        s1: "Go down to 3rd, 2nd, then 1st floor. Turn left, turn right, head straight — Record Section Window 2 on the counters.",
        s2: "Go down to 3rd, 2nd, then 1st floor. Turn right, head to staircase, turn left — Record Section Window 2 on the counters.",
      },
    },

    "Window 3": {
      gf: { s1: "Go upstairs. Turn left and head straight — look for Window 3 sign on the counters." },
      "1f": {
        s1: "You're already on this floor. Turn left, head straight — Window 3 sign on the counters.",
        s2: "You're already on this floor. Head straight to the staircase, turn left — Window 3 sign on the counters.",
      },
      "2f": {
        s1: "Go down to 1st floor. Turn left, turn right, head straight — Window 3 on the counters.",
        s2: "Go down to 1st floor. Turn right, head to staircase, turn left — Window 3 on the counters.",
      },
      "3f": {
        s1: "Go down to 2nd, then 1st floor. Turn left, turn right, head straight — Window 3 on the counters.",
        s2: "Go down to 2nd, then 1st floor. Turn right, head to staircase, turn left — Window 3 on the counters.",
      },
      "4f": {
        s1: "Go down to 3rd, 2nd, then 1st floor. Turn left, turn right, head straight — Window 3 on the counters.",
        s2: "Go down to 3rd, 2nd, then 1st floor. Turn right, head to staircase, turn left — Window 3 on the counters.",
      },
    },

    "Registrar Office — Window 5": {
      gf: { s1: "Go upstairs. Turn left and head straight — look for Registrar Window 5 sign on the counters." },
      "1f": {
        s1: "You're already on this floor. Turn left, head straight — Registrar Window 5 on the counters.",
        s2: "You're already on this floor. Head straight to the staircase, turn left — Registrar Window 5 on the counters.",
      },
      "2f": {
        s1: "Go down to 1st floor. Turn left, turn right, head straight — Registrar Window 5 on the counters.",
        s2: "Go down to 1st floor. Turn right, head to staircase, turn left — Registrar Window 5 on the counters.",
      },
      "3f": {
        s1: "Go down to 2nd, then 1st floor. Turn left, turn right, head straight — Registrar Window 5 on the counters.",
        s2: "Go down to 2nd, then 1st floor. Turn right, head to staircase, turn left — Registrar Window 5 on the counters.",
      },
      "4f": {
        s1: "Go down to 3rd, 2nd, then 1st floor. Turn left, turn right, head straight — Registrar Window 5 on the counters.",
        s2: "Go down to 3rd, 2nd, then 1st floor. Turn right, head to staircase, turn left — Registrar Window 5 on the counters.",
      },
    },

    "Cashier — Window 6": {
      gf: { s1: "Go upstairs. Turn left and head straight — look for the Cashier Window 6 sign on the counters." },
      "1f": {
        s1: "You're already on this floor. Turn left, head straight — Cashier Window 6 on the counters.",
        s2: "You're already on this floor. Head straight to the staircase, turn left — Cashier Window 6 on the counters.",
      },
      "2f": {
        s1: "Go down to 1st floor. Turn left, turn right, head straight — Cashier Window 6 on the counters.",
        s2: "Go down to 1st floor. Turn right, head to staircase, turn left — Cashier Window 6 on the counters.",
      },
      "3f": {
        s1: "Go down to 2nd, then 1st floor. Turn left, turn right, head straight — Cashier Window 6 on the counters.",
        s2: "Go down to 2nd, then 1st floor. Turn right, head to staircase, turn left — Cashier Window 6 on the counters.",
      },
      "4f": {
        s1: "Go down to 3rd, 2nd, then 1st floor. Turn left, turn right, head straight — Cashier Window 6 on the counters.",
        s2: "Go down to 3rd, 2nd, then 1st floor. Turn right, head to staircase, turn left — Cashier Window 6 on the counters.",
      },
    },

    "Assessment — Window 8 (BSHM, BSTM, BSSCRIM, Engineering)": {
      gf: { s1: "Go upstairs. Turn left and head straight — Assessment Window 8 sign is on the counters." },
      "1f": {
        s1: "You're already on this floor. Turn left, head straight — Assessment Window 8 on the counters.",
        s2: "You're already on this floor. Head straight to the staircase, turn left — Assessment Window 8 on the counters.",
      },
      "2f": {
        s1: "Go down to 1st floor. Turn left, turn right, head straight — Assessment Window 8 on the counters.",
        s2: "Go down to 1st floor. Turn right, head to staircase, turn left — Assessment Window 8 on the counters.",
      },
      "3f": {
        s1: "Go down to 2nd, then 1st floor. Turn left, turn right, head straight — Assessment Window 8 on the counters.",
        s2: "Go down to 2nd, then 1st floor. Turn right, head to staircase, turn left — Assessment Window 8 on the counters.",
      },
      "4f": {
        s1: "Go down to 3rd, 2nd, then 1st floor. Turn left, turn right, head straight — Assessment Window 8 on the counters.",
        s2: "Go down to 3rd, 2nd, then 1st floor. Turn right, head to staircase, turn left — Assessment Window 8 on the counters.",
      },
    },

    "Accounting — Window 9 (Dentistry, Nursing, BSPT, AB Psych, Midwifery, BSA, Med Tech, BSIT, BSED/BEED, BSBA)": {
      gf: { s1: "Go upstairs. Turn left and head straight — Accounting Window 9 sign is on the counters." },
      "1f": {
        s1: "You're already on this floor. Turn left, head straight — Accounting Window 9 on the counters.",
        s2: "You're already on this floor. Head straight to the staircase, turn left — Accounting Window 9 on the counters.",
      },
      "2f": {
        s1: "Go down to 1st floor. Turn left, turn right, head straight — Accounting Window 9 on the counters.",
        s2: "Go down to 1st floor. Turn right, head to staircase, turn left — Accounting Window 9 on the counters.",
      },
      "3f": {
        s1: "Go down to 2nd, then 1st floor. Turn left, turn right, head straight — Accounting Window 9 on the counters.",
        s2: "Go down to 2nd, then 1st floor. Turn right, head to staircase, turn left — Accounting Window 9 on the counters.",
      },
      "4f": {
        s1: "Go down to 3rd, 2nd, then 1st floor. Turn left, turn right, head straight — Accounting Window 9 on the counters.",
        s2: "Go down to 3rd, 2nd, then 1st floor. Turn right, head to staircase, turn left — Accounting Window 9 on the counters.",
      },
    },

    "Window 10": {
      gf: { s1: "Go upstairs. Turn left and head straight — look for Window 10 sign on the counters." },
      "1f": {
        s1: "You're already on this floor. Turn left, head straight — Window 10 on the counters.",
        s2: "You're already on this floor. Head straight to the staircase, turn left — Window 10 on the counters.",
      },
      "2f": {
        s1: "Go down to 1st floor. Turn left, turn right, head straight — Window 10 on the counters.",
        s2: "Go down to 1st floor. Turn right, head to staircase, turn left — Window 10 on the counters.",
      },
      "3f": {
        s1: "Go down to 2nd, then 1st floor. Turn left, turn right, head straight — Window 10 on the counters.",
        s2: "Go down to 2nd, then 1st floor. Turn right, head to staircase, turn left — Window 10 on the counters.",
      },
      "4f": {
        s1: "Go down to 3rd, 2nd, then 1st floor. Turn left, turn right, head straight — Window 10 on the counters.",
        s2: "Go down to 3rd, 2nd, then 1st floor. Turn right, head to staircase, turn left — Window 10 on the counters.",
      },
    },

    "ComLab 1": {
      gf: { s1: "Go upstairs — ComLab 1 is the door to your left." },
      "1f": {
        s1: "You're already on this floor. Turn left — ComLab 1 is the door to your right before the entrance.",
        s2: "You're already on this floor. Turn right, turn left into the hallway. At the end, turn right — ComLab 1 is the first door on your right.",
      },
      "2f": {
        s1: "Go down to 1st floor. Turn left — ComLab 1 is the door to your right before the entrance.",
        s2: "Go down to 1st floor. Turn right, turn left into the hallway. At the end, turn right — ComLab 1 is the first door.",
      },
      "3f": {
        s1: "Go down to 2nd, then 1st floor. Turn left — ComLab 1 is the door to your right.",
        s2: "Go down to 2nd, then 1st floor. Turn right, turn left into the hallway, turn right at the end — ComLab 1 is the first door.",
      },
      "4f": {
        s1: "Go down to 3rd, 2nd, then 1st floor. Turn left — ComLab 1 is the door to your right.",
        s2: "Go down to 3rd, 2nd, then 1st floor. Turn right, turn left into the hallway, turn right at the end — ComLab 1 is the first door.",
      },
    },

    // ── 2nd Floor rooms ──
    "ComLab 2": {
      gf: { s1: "Go upstairs, go inside, turn left, go upstairs to 2nd floor. Turn left — you're at ComLab 2." },
      "1f": {
        s1: "Go upstairs to 2nd floor. Turn left — you're at ComLab 2.",
        s2: "Go upstairs, turn right, head straight. After passing the library, turn left, head straight to the end of the hallway — ComLab 2 is there.",
      },
      "2f": {
        s1: "You're already on this floor. From the stairs, turn left — you're at ComLab 2.",
        s2: "You're already on this floor. From the stairs, turn right, head straight. After the library, turn left, head straight — ComLab 2 at the end.",
      },
      "3f": {
        s1: "Go downstairs to 2nd floor. Turn left — you're at ComLab 2.",
        s2: "Go downstairs to 2nd floor. Turn right, head straight. After the library, turn left — ComLab 2 at the end.",
      },
      "4f": {
        s1: "Go downstairs to 3rd, then 2nd floor. Turn left — you're at ComLab 2.",
        s2: "Go downstairs to 3rd, then 2nd floor. Turn right, head straight. After the library, turn left — ComLab 2 at the end.",
      },
    },

    "Therapy Room": {
      gf: { s1: "Go upstairs, go inside, turn left, go upstairs to 2nd floor. Turn left, then turn right — Therapy Room is ahead." },
      "1f": {
        s1: "Go upstairs to 2nd floor. Turn left, then turn right — Therapy Room is ahead.",
        s2: "Go upstairs, turn right, head straight. After the library, turn left, head straight — Therapy Room is there.",
      },
      "2f": {
        s1: "You're already on this floor. Turn left, then turn right — Therapy Room is ahead.",
        s2: "You're already on this floor. Turn right, head straight. After the library, turn left — Therapy Room is there.",
      },
      "3f": {
        s1: "Go downstairs to 2nd floor. Turn left, turn right — Therapy Room is ahead.",
        s2: "Go downstairs to 2nd floor. Turn right, head straight. After the library, turn left — Therapy Room is there.",
      },
      "4f": {
        s1: "Go downstairs to 3rd, then 2nd floor. Turn left, turn right — Therapy Room is ahead.",
        s2: "Go downstairs to 3rd, then 2nd floor. Turn right, after the library turn left — Therapy Room is there.",
      },
    },

    "Therapeutics Lab": {
      gf: { s1: "Go upstairs, go inside, turn left, go upstairs to 2nd floor. Turn left, then turn right — Therapeutics Lab is ahead." },
      "1f": {
        s1: "Go upstairs to 2nd floor. Turn left, then turn right — Therapeutics Lab is ahead.",
        s2: "Go upstairs, turn right, head straight. After the library, turn left — Therapeutics Lab is there.",
      },
      "2f": {
        s1: "You're already on this floor. Turn left, then turn right — Therapeutics Lab is ahead.",
        s2: "You're already on this floor. Turn right, after the library turn left — Therapeutics Lab is there.",
      },
      "3f": {
        s1: "Go downstairs to 2nd floor. Turn left, turn right — Therapeutics Lab is ahead.",
        s2: "Go downstairs to 2nd floor. Turn right, after the library turn left — Therapeutics Lab is there.",
      },
      "4f": {
        s1: "Go downstairs to 3rd, then 2nd floor. Turn left, turn right — Therapeutics Lab is ahead.",
        s2: "Go downstairs to 3rd, then 2nd floor. Turn right, after the library turn left — Therapeutics Lab is there.",
      },
    },

    "Library": {
      gf: { s1: "Go upstairs, go inside, turn left, go upstairs to 2nd floor. Turn left, then turn right. Head straight — the Library is on your right." },
      "1f": {
        s1: "Go upstairs to 2nd floor. Turn left, turn right, head straight — Library is on your right.",
        s2: "Go upstairs, turn right, head straight — the Library is on your left.",
      },
      "2f": {
        s1: "You're already on this floor. Turn left, turn right, head straight — Library is on your right.",
        s2: "You're already on this floor. Turn right, head straight — Library is on your left.",
      },
      "3f": {
        s1: "Go downstairs to 2nd floor. Turn left, turn right, head straight — Library on your right.",
        s2: "Go downstairs to 2nd floor. Turn right, head straight — Library on your left.",
      },
      "4f": {
        s1: "Go downstairs to 3rd, then 2nd floor. Turn left, turn right, head straight — Library on your right.",
        s2: "Go downstairs to 3rd, then 2nd floor. Turn right, head straight — Library on your left.",
      },
    },

    "PT Lab": {
      gf: { s1: "Go upstairs, go inside, turn left, go upstairs to 2nd floor. Turn left, then turn right — PT Lab is ahead." },
      "1f": {
        s1: "Go upstairs to 2nd floor. Turn left, then turn right — PT Lab is ahead.",
        s2: "Go upstairs, turn right, head straight. After the library, turn left — PT Lab is there.",
      },
      "2f": {
        s1: "You're already on this floor. Turn left, then turn right — PT Lab is ahead.",
        s2: "You're already on this floor. Turn right, after the library turn left — PT Lab is there.",
      },
      "3f": {
        s1: "Go downstairs to 2nd floor. Turn left, turn right — PT Lab is ahead.",
        s2: "Go downstairs to 2nd floor. Turn right, after the library turn left — PT Lab is there.",
      },
      "4f": {
        s1: "Go downstairs to 3rd, then 2nd floor. Turn left, turn right — PT Lab is ahead.",
        s2: "Go downstairs to 3rd, then 2nd floor. After the library turn left — PT Lab is there.",
      },
    },

    "Simulation Room (Mini Hospital)": {
      gf: { s1: "Go upstairs, go inside, turn left, go upstairs to 2nd floor. Turn left, then turn right — Simulation Room (Mini Hospital) is ahead." },
      "1f": {
        s1: "Go upstairs to 2nd floor. Turn left, then turn right — Simulation Room (Mini Hospital) is ahead.",
        s2: "Go upstairs, turn right, head straight. After the library, turn left — Simulation Room (Mini Hospital) is there.",
      },
      "2f": {
        s1: "You're already on this floor. Turn left, then turn right — Simulation Room (Mini Hospital) is ahead.",
        s2: "You're already on this floor. Turn right, after the library turn left — Simulation Room (Mini Hospital) is there.",
      },
      "3f": {
        s1: "Go downstairs to 2nd floor. Turn left, turn right — Simulation Room (Mini Hospital) is ahead.",
        s2: "Go downstairs to 2nd floor. Turn right, after the library turn left — Simulation Room (Mini Hospital) is there.",
      },
      "4f": {
        s1: "Go downstairs to 3rd, then 2nd floor. Turn left, turn right — Simulation Room (Mini Hospital) is ahead.",
        s2: "Go downstairs to 3rd, then 2nd floor. After the library turn left — Simulation Room (Mini Hospital) is there.",
      },
    },

    "AB Comm Lab": {
      gf: { s1: "Go upstairs, go inside, turn left, go upstairs to 2nd floor. Turn left, turn right, head straight — AB Comm Lab is at the end beside the stairs." },
      "1f": {
        s1: "Go upstairs to 2nd floor. Turn left, turn right, head straight — AB Comm Lab is beside the stairs.",
        s2: "Go upstairs, turn right, head straight. After the library, look to your right — AB Comm Lab is there.",
      },
      "2f": {
        s1: "You're already on this floor. Turn left, turn right, head straight — AB Comm Lab is beside the stairs.",
        s2: "You're already on this floor. Turn right, after the library look to your right — AB Comm Lab is there.",
      },
      "3f": {
        s1: "Go downstairs to 2nd floor. Turn left, turn right, head straight — AB Comm Lab is beside the stairs.",
        s2: "Go downstairs to 2nd floor. Turn right, after the library look to your right — AB Comm Lab is there.",
      },
      "4f": {
        s1: "Go downstairs to 3rd, then 2nd floor. Turn left, turn right, head straight — AB Comm Lab is beside the stairs.",
        s2: "Go downstairs to 3rd, then 2nd floor. After the library look to your right — AB Comm Lab is there.",
      },
    },

    "Drawing Lab": {
      gf: { s1: "Go upstairs, go inside, turn left, go upstairs to 2nd floor. Turn left, turn right, head straight — Drawing Lab is on your left." },
      "1f": {
        s1: "Go upstairs to 2nd floor. Turn left, turn right, head straight — Drawing Lab is on your left.",
        s2: "Go upstairs, turn right, head straight — Drawing Lab is on your right.",
      },
      "2f": {
        s1: "You're already on this floor. Turn left, turn right, head straight — Drawing Lab is on your left.",
        s2: "You're already on this floor. Turn right, head straight — Drawing Lab is on your right.",
      },
      "3f": {
        s1: "Go downstairs to 2nd floor. Turn left, turn right, head straight — Drawing Lab is on your left.",
        s2: "Go downstairs to 2nd floor. Turn right, head straight — Drawing Lab is on your right.",
      },
      "4f": {
        s1: "Go downstairs to 3rd, then 2nd floor. Turn left, turn right, head straight — Drawing Lab is on your left.",
        s2: "Go downstairs to 3rd, then 2nd floor. Turn right, head straight — Drawing Lab is on your right.",
      },
    },

    "Engineering Office": {
      gf: { s1: "Go upstairs, go inside, turn left, go upstairs to 2nd floor. Turn left, turn right, head straight — Engineering Office is on your left." },
      "1f": {
        s1: "Go upstairs to 2nd floor. Turn left, turn right, head straight — Engineering Office is on your left.",
        s2: "Go upstairs, turn right, head straight — Engineering Office is on your right.",
      },
      "2f": {
        s1: "You're already on this floor. Turn left, turn right, head straight — Engineering Office is on your left.",
        s2: "You're already on this floor. Turn right, head straight — Engineering Office is on your right.",
      },
      "3f": {
        s1: "Go downstairs to 2nd floor. Turn left, turn right, head straight — Engineering Office is on your left.",
        s2: "Go downstairs to 2nd floor. Turn right, head straight — Engineering Office is on your right.",
      },
      "4f": {
        s1: "Go downstairs to 3rd, then 2nd floor. Turn left, turn right, head straight — Engineering Office is on your left.",
        s2: "Go downstairs to 3rd, then 2nd floor. Turn right, head straight — Engineering Office is on your right.",
      },
    },

    // ── 3rd & 4th Floor rooms (blank — placeholder for future fill-in) ──
    // These rooms only have incomplete data in the directions file.
    // The ArrivalPromptScreen will show a generic "Go to Xth floor" message for blank entries.
  },

  // ── EA TOWER HALL ──────────────────────────────────────────────────────────
  ea_tower: {
    "Assessment Center Cookery NC II": {
      gf: { s1: "You're almost there! Go upstairs — after turning right you will find the Assessment Center Cookery NC II.", s2: "You're almost there! Go upstairs — after turning right you will find the Assessment Center Cookery NC II." },
      "1f": { s1: "You're already on this floor. Turn right — Assessment Center Cookery NC II is there.", s2: "You're already on this floor. Turn right — Assessment Center Cookery NC II is there." },
      "2f": { s1: "Go downstairs to 1st floor. Turn right — Assessment Center Cookery NC II is there.", s2: "Go downstairs to 1st floor. Turn right — Assessment Center Cookery NC II is there." },
      "3f": { s1: "Go downstairs to 2nd, then 1st floor. Turn right — Assessment Center Cookery NC II is there.", s2: "Go downstairs to 2nd, then 1st floor. Turn right — Assessment Center Cookery NC II is there." },
      "4f": { s1: "Go downstairs to 3rd, 2nd, then 1st floor. Turn right — Assessment Center Cookery NC II is there.", s2: "Go downstairs to 3rd, 2nd, then 1st floor. Turn right — Assessment Center Cookery NC II is there." },
    },
  },

  // ── NEW BUILDING ──────────────────────────────────────────────────────────
  // Single entrance (RFID), single staircase — no staircase picker.
  new_building: {},

  // ── SR BUILDING ──────────────────────────────────────────────────────────
  sr_building: {},

  // ── KITCHEN HALL ──────────────────────────────────────────────────────────
  kitchen_hall: {},
};

// ─────────────────────────────────────────────────────────────────────────────
// Helper: look up directions for a specific room
//
// Returns the direction string or null if not found / not yet filled in.
//
// @param {string} buildingId   — e.g. "main_building"
// @param {string} roomName     — exact room name string
// @param {string} fromFloor    — "gf" | "1f" | "2f" | "3f" | "4f"
// @param {string} staircase    — "s1" | "s2" | "any"
// @returns {string|null}
// ─────────────────────────────────────────────────────────────────────────────
export function getDirections(buildingId, roomName, fromFloor, staircase = "s1") {
  const building = INDOOR_DIRECTIONS[buildingId];
  if (!building) return null;

  const room = building[roomName];
  if (!room) return null;

  const floorEntry = room[fromFloor];
  if (!floorEntry) return null;

  // Try exact staircase key, fall back to "any", then to the other staircase
  return floorEntry[staircase]
    ?? floorEntry["any"]
    ?? floorEntry["s1"]
    ?? null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Helper: get all room names for a building (for search/autocomplete)
// ─────────────────────────────────────────────────────────────────────────────
export function getRoomNames(buildingId) {
  const building = INDOOR_DIRECTIONS[buildingId];
  if (!building) return [];
  return Object.keys(building);
}
