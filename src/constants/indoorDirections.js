// ─────────────────────────────────────────────────────────────────────────────
// WAYFINDER — Indoor Room Directions
//
// Structure per room:
//   directions[buildingId][roomName][fromFloor][staircaseKey] = "instruction string"
//
// Staircase keys:
//   "s1"  — Staircase 1 (Front/1st Entrance)
//   "s2"  — Staircase 2 (2nd Entrance)
//   "any" — Single staircase / single entrance building (no picker needed)
//
// Floor keys: "gf" | "1f" | "2f" | "3f" | "4f"
//
// NOTE — Main Building GF:
//   Ground Floor is ONLY accessible via Staircase 1 (Front Entrance).
//   Staircase 2 has NO Ground Floor access.
//   GF entries therefore only carry the "s1" key.
//
// Null entries = not yet filled in (UI will show a generic fallback message).
// ─────────────────────────────────────────────────────────────────────────────

export const INDOOR_DIRECTIONS = {

  // ── MAIN BUILDING ──────────────────────────────────────────────────────────
  main_building: {

    // ════ GROUND FLOOR ROOMS (s1 only — S2 has no GF access) ════

    "School Clinic": {
      gf: { s1: "You're almost there! Go in front of the building and head straight, then to your right you'll see the clinic sign above the door." },
      "1f": {
        s1: "From the stairs, go down the stairs, go into the front of the building, head straight through the hallway. You will see to your right a clinic sign above the door.",
        s2: "From the stairs, turn right and go straight until you see a way to the left and a stair. Turn left and go straight until you reach the stairs going downward. Go inside the underground-like hallway, go straight until you see a clinic sign above the door on your right.",
      },
      "2f": {
        s1: "From the stairs, go down the stairs, go outside the building, go down the stairs again. Head into the front of the building, then go straight and look to your right until you find the clinic sign above the door.",
        s2: "From the stairs, turn right, go straight until you reach a hallway to the left, a stairs in front of you, and a bathroom to your right. Turn left, go straight, then turn left, go down the stairs, turn left, go outside and go down the stairs. Go into the front of the building and head straight — you will see a clinic sign above the door to the right.",
      },
      "3f": {
        s1: "From the stairs, go down into 2nd floor, go down into 1st floor, go outside and go down the stairs again. Head into the front of the building, then go straight and look to your right until you find the clinic sign above the door.",
        s2: "From the stairs, turn right, go straight until you reach a hallway to the left, a stairs in front of you, and a bathroom to your right. Turn left, go straight, then turn left, go down into 2nd floor, go down the stairs, turn left, go outside and go down the stairs. Go into the front of the building and head straight — you will see a clinic sign above the door to the right.",
      },
      "4f": {
        s1: "From the stairs, go down into 3rd floor, go down into 2nd floor, go down into 1st floor, go outside and go down the stairs again. Head into the front of the building, then go straight and look to your right until you find the clinic sign above the door.",
        s2: "From the stairs, turn right, go straight until you reach a hallway to the left, a stairs in front of you, and a bathroom to your right. Turn left, go straight, then turn left, go down the stairs, go down the stairs, go down the stairs, turn left, go outside and go down the stairs. Go into the front of the building and head straight — you will see a clinic sign above the door to the right.",
      },
    },

    "Office of the Student Affairs": {
      gf: { s1: "You're almost there! Go in front of the building and head straight, then to your left you'll see the Student Affairs sign above the door." },
      "1f": {
        s1: "From the stairs, go down the stairs, go into the front of the building, head straight through the hallway. You will see to your left a Student Affairs sign above the door.",
        s2: "From the stairs, turn right and go straight until you see a way to the left and a stair. Turn left and go straight until you reach the stairs going downward. Go inside the underground-like hallway, go straight until you see a Student Affairs sign above the door on your left.",
      },
      "2f": {
        s1: "From the stairs, go down the stairs, go outside the building, go down the stairs again. Head into the front of the building, then go straight and look to your left until you find the Student Affairs sign above the door.",
        s2: "From the stairs, turn right, go straight until you reach a hallway to the left, a stairs in front of you, and a bathroom to your right. Turn left, go straight, then turn left, go down the stairs, turn left, go outside and go down the stairs. Go into the front of the building and head straight — you will see a Student Affairs sign above the door to the left.",
      },
      "3f": {
        s1: "From the stairs, go down into 2nd floor, go down into 1st floor, go outside and go down the stairs again. Head into the front of the building, then go straight and look to your left until you find the Student Affairs sign above the door.",
        s2: "From the stairs, turn right, go straight until you reach a hallway to the left, a stairs in front, and a bathroom to your right. Turn left, go straight, then turn left, go down into 2nd floor, go down the stairs, turn left, go outside and go down the stairs. Go into the front of the building and head straight — you will see a Student Affairs sign above the door to the left.",
      },
      "4f": {
        s1: "From the stairs, go down into 3rd floor, go down into 2nd floor, go down into 1st floor, go outside and go down the stairs again. Head into the front of the building, then go straight and look to your left until you find the Student Affairs sign above the door.",
        s2: "From the stairs, turn right, go straight until you reach a hallway to the left, a stairs in front, and a bathroom to your right. Turn left, go straight, then turn left, go down the stairs, go down the stairs, go down the stairs, turn left, go outside and go down the stairs. Go into the front of the building and head straight — you will see a Student Affairs sign above the door to the left.",
      },
    },

    "SPS Office": {
      gf: { s1: "You're almost there! Go in front of the building and head straight, then to your left you'll see the SPS Office sign above the door." },
      "1f": {
        s1: "From the stairs, go down the stairs, go into the front of the building, head straight through the hallway. You will see to your left a SPS Office sign above the door.",
        s2: "From the stairs, turn right and go straight until you see a way to the left and a stair. Turn left and go straight until you reach the stairs going downward. Go inside the underground-like hallway, go straight until you see a SPS Office sign above the door on your left.",
      },
      "2f": {
        s1: "From the stairs, go down the stairs, go outside the building, go down the stairs again. Head into the front of the building, then go straight and look to your left until you find the SPS Office sign above the door.",
        s2: "From the stairs, turn right, go straight until you reach a hallway to the left, a stairs in front, and a bathroom to your right. Turn left, go straight, then turn left, go down the stairs, turn left, go outside and go down the stairs. Go into the front of the building and head straight — you will see a SPS Office sign above the door to the left.",
      },
      "3f": {
        s1: "From the stairs, go down into 2nd floor, go down into 1st floor, go outside and go down the stairs again. Head into the front of the building, then go straight and look to your left until you find the SPS Office sign above the door.",
        s2: "From the stairs, turn right, go straight until you reach a hallway to the left, a stairs in front, and a bathroom to your right. Turn left, go straight, then turn left, go down into 2nd floor, go down the stairs, turn left, go outside and go down the stairs. Go into the front of the building and head straight — you will see a SPS Office sign above the door to the left.",
      },
      "4f": {
        s1: "From the stairs, go down into 3rd floor, go down into 2nd floor, go down into 1st floor, go outside and go down the stairs again. Head into the front of the building, then go straight and look to your left until you find the SPS Office sign above the door.",
        s2: "From the stairs, turn right, go straight until you reach a hallway to the left, a stairs in front, and a bathroom to your right. Turn left, go straight, then turn left, go down the stairs, go down the stairs, go down the stairs, turn left, go outside and go down the stairs. Go into the front of the building and head straight — you will see a SPS Office sign above the door to the left.",
      },
    },

    "Lyre Band Office": {
      gf: { s1: "You're almost there! Go in front of the building and head straight, then to your left you'll see the Lyre Band Office sign above the door." },
      "1f": {
        s1: "From the stairs, go down the stairs, go into the front of the building, head straight through the hallway. You will see to your left a Lyre Band Office sign above the door.",
        s2: "From the stairs, turn right and go straight until you see a way to the left and a stair. Turn left and go straight until you reach the stairs going downward. Go inside the underground-like hallway, go straight until you see a Lyre Band Office sign above the door on your left.",
      },
      "2f": {
        s1: "From the stairs, go down the stairs, go outside the building, go down the stairs again. Head into the front of the building, then go straight and look to your left until you find the Lyre Band Office sign above the door.",
        s2: "From the stairs, turn right, go straight until you reach a hallway to the left, a stairs in front, and a bathroom to your right. Turn left, go straight, then turn left, go down the stairs, turn left, go outside and go down the stairs. Go into the front of the building and head straight — you will see a Lyre Band Office sign above the door to the left.",
      },
      "3f": {
        s1: "From the stairs, go down into 2nd floor, go down into 1st floor, go outside and go down the stairs again. Head into the front of the building, then go straight and look to your left until you find the Lyre Band Office sign above the door.",
        s2: "From the stairs, turn right, go straight until you reach a hallway to the left, a stairs in front, and a bathroom to your right. Turn left, go straight, then turn left, go down into 2nd floor, go down the stairs, turn left, go outside and go down the stairs. Go into the front of the building and head straight — you will see a Lyre Band Office sign above the door to the left.",
      },
      "4f": {
        s1: "From the stairs, go down into 3rd floor, go down into 2nd floor, go down into 1st floor, go outside and go down the stairs again. Head into the front of the building, then go straight and look to your left until you find the Lyre Band Office sign above the door.",
        s2: "From the stairs, turn right, go straight until you reach a hallway to the left, a stairs in front, and a bathroom to your right. Turn left, go straight, then turn left, go down the stairs, go down the stairs, go down the stairs, turn left, go outside and go down the stairs. Go into the front of the building and head straight — you will see a Lyre Band Office sign above the door to the left.",
      },
    },

    "Prefect of Discipline / Office of NSTP": {
      gf: { s1: "You're almost there! Go in front of the building and head straight, then to your right you'll see the Prefect of Discipline / Office of NSTP sign above the door." },
      "1f": {
        s1: "From the stairs, go down the stairs, go into the front of the building, head straight through the hallway. You will see to your right a Prefect of Discipline / Office of NSTP sign above the door.",
        s2: "From the stairs, turn right and go straight until you see a way to the left and a stair. Turn left and go straight until you reach the stairs going downward. Go inside the underground-like hallway, go straight until you see a Prefect of Discipline / Office of NSTP sign above the door on your right.",
      },
      "2f": {
        s1: "From the stairs, go down the stairs, go outside the building, go down the stairs again. Head into the front of the building, then go straight and look to your right until you find the Prefect of Discipline / Office of NSTP sign above the door.",
        s2: "From the stairs, turn right, go straight until you reach a hallway to the left, a stairs in front, and a bathroom to your right. Turn left, go straight, then turn left, go down the stairs, turn left, go outside and go down the stairs. Go into the front of the building and head straight — you will see a Prefect of Discipline / Office of NSTP sign above the door to the right.",
      },
      "3f": {
        s1: "From the stairs, go down into 2nd floor, go down into 1st floor, go outside and go down the stairs again. Head into the front of the building, then go straight and look to your right until you find the Prefect of Discipline / Office of NSTP sign above the door.",
        s2: "From the stairs, turn right, go straight until you reach a hallway to the left, a stairs in front, and a bathroom to your right. Turn left, go straight, then turn left, go down into 2nd floor, go down the stairs, turn left, go outside and go down the stairs. Go into the front of the building and head straight — you will see a Prefect of Discipline / Office of NSTP sign above the door to the right.",
      },
      "4f": {
        s1: "From the stairs, go down into 3rd floor, go down into 2nd floor, go down into 1st floor, go outside and go down the stairs again. Head into the front of the building, then go straight and look to your right until you find the Prefect of Discipline / Office of NSTP sign above the door.",
        s2: "From the stairs, turn right, go straight until you reach a hallway to the left, a stairs in front, and a bathroom to your right. Turn left, go straight, then turn left, go down the stairs, go down the stairs, go down the stairs, turn left, go outside and go down the stairs. Go into the front of the building and head straight — you will see a Prefect of Discipline / Office of NSTP sign above the door to the right.",
      },
    },

    "Guidance Office": {
      gf: { s1: "You're almost there! Go in front of the building and head straight, then to your left you'll see the Guidance Office sign above the door." },
      "1f": {
        s1: "From the stairs, go down the stairs, go into the front of the building, head straight through the hallway. You will see to your left a Guidance Office sign above the door.",
        s2: "From the stairs, turn right and go straight until you see a way to the left and a stair. Turn left and go straight until you reach the stairs going downward. Go inside the underground-like hallway, go straight until you see a Guidance Office sign above the door on your left.",
      },
      "2f": {
        s1: "From the stairs, go down the stairs, go outside the building, go down the stairs again. Head into the front of the building, then go straight and look to your left until you find the Guidance Office sign above the door.",
        s2: "From the stairs, turn right, go straight until you reach a hallway to the left, a stairs in front, and a bathroom to your right. Turn left, go straight, then turn left, go down the stairs, turn left, go outside and go down the stairs. Go into the front of the building and head straight — you will see a Guidance Office sign above the door to the left.",
      },
      "3f": {
        s1: "From the stairs, go down into 2nd floor, go down into 1st floor, go outside and go down the stairs again. Head into the front of the building, then go straight and look to your left until you find the Guidance Office sign above the door.",
        s2: "From the stairs, turn right, go straight until you reach a hallway to the left, a stairs in front, and a bathroom to your right. Turn left, go straight, then turn left, go down into 2nd floor, go down the stairs, turn left, go outside and go down the stairs. Go into the front of the building and head straight — you will see a Guidance Office sign above the door to the left.",
      },
      "4f": {
        s1: "From the stairs, go down into 3rd floor, go down into 2nd floor, go down into 1st floor, go outside and go down the stairs again. Head into the front of the building, then go straight and look to your left until you find the Guidance Office sign above the door.",
        s2: "From the stairs, turn right, go straight until you reach a hallway to the left, a stairs in front, and a bathroom to your right. Turn left, go straight, then turn left, go down the stairs, go down the stairs, go down the stairs, turn left, go outside and go down the stairs. Go into the front of the building and head straight — you will see a Guidance Office sign above the door to the left.",
      },
    },

    "Counseling Room": {
      gf: { s1: "You're almost there! Go in front of the building and head straight, then to your left you'll see the Counseling Room sign above the door." },
      "1f": {
        s1: "From the stairs, go down the stairs, go into the front of the building, head straight through the hallway. You will see to your left a Counseling Room sign above the door.",
        s2: "From the stairs, turn right and go straight until you see a way to the left and a stair. Turn left and go straight until you reach the stairs going downward. Go inside the underground-like hallway, go straight until you see a Counseling Room sign above the door on your left.",
      },
      "2f": {
        s1: "From the stairs, go down the stairs, go outside the building, go down the stairs again. Head into the front of the building, then go straight and look to your left until you find the Counseling Room sign above the door.",
        s2: "From the stairs, turn right, go straight until you reach a hallway to the left, a stairs in front, and a bathroom to your right. Turn left, go straight, then turn left, go down the stairs, turn left, go outside and go down the stairs. Go into the front of the building and head straight — you will see a Counseling Room sign above the door to the left.",
      },
      "3f": {
        s1: "From the stairs, go down into 2nd floor, go down into 1st floor, go outside and go down the stairs again. Head into the front of the building, then go straight and look to your left until you find the Counseling Room sign above the door.",
        s2: "From the stairs, turn right, go straight until you reach a hallway to the left, a stairs in front, and a bathroom to your right. Turn left, go straight, then turn left, go down into 2nd floor, go down the stairs, turn left, go outside and go down the stairs. Go into the front of the building and head straight — you will see a Counseling Room sign above the door to the left.",
      },
      "4f": {
        s1: "From the stairs, go down into 3rd floor, go down into 2nd floor, go down into 1st floor, go outside and go down the stairs again. Head into the front of the building, then go straight and look to your left until you find the Counseling Room sign above the door.",
        s2: "From the stairs, turn right, go straight until you reach a hallway to the left, a stairs in front, and a bathroom to your right. Turn left, go straight, then turn left, go down the stairs, go down the stairs, go down the stairs, turn left, go outside and go down the stairs. Go into the front of the building and head straight — you will see a Counseling Room sign above the door to the left.",
      },
    },

    "Testing Center & Sports and Cultural Affairs / Psychological Interpretation": {
      gf: { s1: "You're almost there! Go in front of the building and head straight, then to your left you'll see the Testing Center & Sports and Cultural Affairs / Psychological Interpretation sign above the door." },
      "1f": {
        s1: "From the stairs, go down the stairs, go into the front of the building, head straight through the hallway. You will see to your left a Testing Center & Sports and Cultural Affairs / Psychological Interpretation sign above the door.",
        s2: "From the stairs, turn right and go straight until you see a way to the left and a stair. Turn left and go straight until you reach the stairs going downward. Go inside the underground-like hallway, go straight until you see a Testing Center & Sports and Cultural Affairs / Psychological Interpretation sign above the door on your left.",
      },
      "2f": {
        s1: "From the stairs, go down the stairs, go outside the building, go down the stairs again. Head into the front of the building, then go straight and look to your left until you find the Testing Center & Sports and Cultural Affairs / Psychological Interpretation sign above the door.",
        s2: "From the stairs, turn right, go straight until you reach a hallway to the left, a stairs in front, and a bathroom to your right. Turn left, go straight, then turn left, go down the stairs, turn left, go outside and go down the stairs. Go into the front of the building and head straight — you will see a Testing Center & Sports and Cultural Affairs / Psychological Interpretation sign above the door to the left.",
      },
      "3f": {
        s1: "From the stairs, go down into 2nd floor, go down into 1st floor, go outside and go down the stairs again. Head into the front of the building, then go straight and look to your left until you find the Testing Center & Sports and Cultural Affairs / Psychological Interpretation sign above the door.",
        s2: "From the stairs, turn right, go straight until you reach a hallway to the left, a stairs in front, and a bathroom to your right. Turn left, go straight, then turn left, go down into 2nd floor, go down the stairs, turn left, go outside and go down the stairs. Go into the front of the building and head straight — you will see a Testing Center & Sports and Cultural Affairs / Psychological Interpretation sign above the door to the left.",
      },
      "4f": {
        s1: "From the stairs, go down into 3rd floor, go down into 2nd floor, go down into 1st floor, go outside and go down the stairs again. Head into the front of the building, then go straight and look to your left until you find the Testing Center & Sports and Cultural Affairs / Psychological Interpretation sign above the door.",
        s2: "From the stairs, turn right, go straight until you reach a hallway to the left, a stairs in front, and a bathroom to your right. Turn left, go straight, then turn left, go down the stairs, go down the stairs, go down the stairs, turn left, go outside and go down the stairs. Go into the front of the building and head straight — you will see a Testing Center & Sports and Cultural Affairs / Psychological Interpretation sign above the door to the left.",
      },
    },

    "ICT / MIS Office": {
      gf: { s1: "You're almost there! Go in front of the building and head straight, then to your right you'll see the ICT / MIS Office sign above the door." },
      "1f": {
        s1: "From the stairs, go down the stairs, go into the front of the building, head straight through the hallway. You will see to your right a ICT / MIS Office sign above the door.",
        s2: "From the stairs, turn right and go straight until you see a way to the left and a stair. Turn left and go straight until you reach the stairs going downward. Go inside the underground-like hallway, go straight until you see a ICT / MIS Office sign above the door on your right.",
      },
      "2f": {
        s1: "From the stairs, go down into 1st floor, go outside the building, go down the stairs again. Head into the front of the building, then go straight and look to your right until you find the ICT / MIS Office sign above the door.",
        s2: "From the stairs, go down into 1st floor, turn right, go straight until you reach a hallway to the left, a stairs in front, and a bathroom to your right. Turn left, go straight, then turn left, go down the stairs, turn left, go outside and go down the stairs. Go into the front of the building and head straight — you will see a ICT / MIS Office sign above the door to the right.",
      },
      "3f": {
        s1: "From the stairs, go down into 2nd floor, go down into 1st floor, go outside and go down the stairs again. Head into the front of the building, then go straight and look to your right until you find the ICT / MIS Office sign above the door.",
        s2: "From the stairs, go down into 2nd floor, go down into 1st floor, turn right, go straight until you reach a hallway to the left, a stairs in front, and a bathroom to your right. Turn left, go straight, then turn left, go down into 2nd floor, go down the stairs, turn left, go outside and go down the stairs. Go into the front of the building and head straight — you will see a ICT / MIS Office sign above the door to the right.",
      },
      "4f": {
        s1: "From the stairs, go down into 3rd floor, go down into 2nd floor, go down into 1st floor, go outside and go down the stairs again. Head into the front of the building, then go straight and look to your right until you find the ICT / MIS Office sign above the door.",
        s2: "From the stairs, go down into 3rd floor, go down into 2nd floor, go down into 1st floor, turn right, go straight until you reach a hallway to the left, a stairs in front, and a bathroom to your right. Turn left, go straight, then turn left, go down the stairs, go down the stairs, go down the stairs, turn left, go outside and go down the stairs. Go into the front of the building and head straight — you will see a ICT / MIS Office sign above the door to the right.",
      },
    },

    // ════ 1ST FLOOR ROOMS ════

    "Quality Assurance Office": {
      gf: { s1: "Go upstairs, turn left, head straight into the hallway — the Quality Assurance Office is at the far end. You will see the Quality Assurance Office sign on the door to the left." },
      "1f": {
        s1: "You're almost there! From the stairs turn left, head straight — it is in the far end. You will see Quality Assurance Office sign on the door to the left.",
        s2: "You're almost there! From the entrance, head straight until you see a stair. Don't go up — you will see 2 doors on your right side. One of them has a Quality Assurance Office sign on the door.",
      },
      "2f": {
        s1: "From the stairs, go down into the 1st floor, turn left, then turn right into the hallway, head straight — it is in the far end. You will see Quality Assurance Office sign on the door to the left.",
        s2: "From the stairs, go down into the 1st floor, turn right, head straight until you see a stair. Don't go up — you will see 2 doors on your right side. One of them has a Quality Assurance Office sign on the door.",
      },
      "3f": {
        s1: "From the stairs, go down into the 2nd floor, go down into the 1st floor, turn left, then turn right into the hallway, head straight — it is in the far end. You will see Quality Assurance Office sign on the door to the left.",
        s2: "From the stairs, go down into the 2nd floor, go down into the 1st floor, turn right, head straight until you see a stair. Don't go up — you will see 2 doors on your right side. One of them has a Quality Assurance Office sign on the door.",
      },
      "4f": {
        s1: "From the stairs, go down into the 3rd floor, go down into the 2nd floor, go down into the 1st floor, turn left, then turn right into the hallway, head straight — it is in the far end. You will see Quality Assurance Office sign on the door to the left.",
        s2: "From the stairs, go down into the 3rd floor, go down into the 2nd floor, go down into the 1st floor, turn right, head straight until you see a stair. Don't go up — you will see 2 doors on your right side. One of them has a Quality Assurance Office sign on the door.",
      },
    },

    "Administrative Affairs Office": {
      gf: { s1: "Go upstairs, turn left, head straight into the hallway — at the far end you will see the Administrative Affairs Office sign above the door to the left." },
      "1f": {
        s1: "You're almost there! From the stairs turn left, head straight — it is in the far end. You will see Administrative Affairs Office sign on the door to the left.",
        s2: "You're almost there! From the entrance, head straight until you see a stair. Don't go up — you will see 2 doors on your right side. One of them has an Administrative Affairs Office sign on the door.",
      },
      "2f": {
        s1: "From the stairs, go down into the 1st floor, turn left, then turn right into the hallway, head straight — it is in the far end. You will see Administrative Affairs Office sign on the door to the left.",
        s2: "From the stairs, go down into the 1st floor, turn right, head straight until you see a stair. Don't go up — you will see 2 doors on your right side. One of them has an Administrative Affairs Office sign on the door.",
      },
      "3f": {
        s1: "From the stairs, go down into the 2nd floor, go down into the 1st floor, turn left, then turn right into the hallway, head straight — it is in the far end. You will see Administrative Affairs Office sign on the door to the left.",
        s2: "From the stairs, go down into the 2nd floor, go down into the 1st floor, turn right, head straight until you see a stair. Don't go up — you will see 2 doors on your right side. One of them has an Administrative Affairs Office sign on the door.",
      },
      "4f": {
        s1: "From the stairs, go down into the 3rd floor, go down into the 2nd floor, go down into the 1st floor, turn left, then turn right into the hallway, head straight — it is in the far end. You will see Administrative Affairs Office sign on the door to the left.",
        s2: "From the stairs, go down into the 3rd floor, go down into the 2nd floor, go down into the 1st floor, turn right, head straight until you see a stair. Don't go up — you will see 2 doors on your right side. One of them has an Administrative Affairs Office sign on the door.",
      },
    },

    "AVR": {
      gf: { s1: "Go upstairs, turn left, head straight into the hallway until the far end, then turn right — you will see the AVR sign above the door." },
      "1f": {
        s1: "You're almost there! From the stairs turn left, head straight into the hallway until the far end, then turn right — you will see the AVR sign above the door.",
        s2: "You're almost there! From the entrance, head straight until you see AVR above the door to your left.",
      },
      "2f": {
        s1: "From the stairs, go down into the 1st floor, turn left, then turn right into the hallway, head straight until the far end, then turn right — you will see the AVR sign above the door.",
        s2: "From the stairs, go down into the 1st floor, turn right, head straight until you see AVR above the door to your left.",
      },
      "3f": {
        s1: "From the stairs, go down into the 2nd floor, go down into the 1st floor, turn left, then turn right into the hallway, head straight until the far end, then turn right — you will see the AVR sign above the door.",
        s2: "From the stairs, go down into the 2nd floor, go down into the 1st floor, turn right, head straight until you see AVR above the door to your left.",
      },
      "4f": {
        s1: "From the stairs, go down into the 3rd floor, go down into the 2nd floor, go down into the 1st floor, turn left, then turn right into the hallway, head straight until the far end, then turn right — you will see the AVR sign above the door.",
        s2: "From the stairs, go down into the 3rd floor, go down into the 2nd floor, go down into the 1st floor, turn right, head straight until you see AVR above the door to your left.",
      },
    },

    "Anatomy Lab": {
      gf: { s1: "Go upstairs, turn left, head straight into the hallway until the far end, then turn right — you will see the Anatomy Lab sign above the door." },
      "1f": {
        s1: "You're almost there! From the stairs turn left, head straight into the hallway until the far end, then turn right — you will see the Anatomy Lab sign above the door.",
        s2: "You're almost there! From the entrance, head straight until you see an Anatomy Lab sign above the door.",
      },
      "2f": {
        s1: "From the stairs, go down into the 1st floor, turn left, then turn right into the hallway, head straight until the far end, then turn right — you will see the Anatomy Lab sign above the door.",
        s2: "From the stairs, go down into the 1st floor, turn right, head straight until you see an Anatomy Lab sign above the door.",
      },
      "3f": {
        s1: "From the stairs, go down into the 2nd floor, go down into the 1st floor, turn left, then turn right into the hallway, head straight until the far end, then turn right — you will see the Anatomy Lab sign above the door.",
        s2: "From the stairs, go down into the 2nd floor, go down into the 1st floor, turn right, head straight until you see an Anatomy Lab sign above the door.",
      },
      "4f": {
        s1: "From the stairs, go down into the 3rd floor, go down into the 2nd floor, go down into the 1st floor, turn left, then turn right into the hallway, head straight until the far end, then turn right — you will see the Anatomy Lab sign above the door.",
        s2: "From the stairs, go down into the 3rd floor, go down into the 2nd floor, go down into the 1st floor, turn right, head straight until you see an Anatomy Lab sign above the door.",
      },
    },

    "Chemistry Lab": {
      gf: { s1: "Go upstairs, turn left, head straight into the hallway until the far end, then turn right — you will see the Chemistry Lab sign above the door." },
      "1f": {
        s1: "You're almost there! From the stairs turn left, head straight into the hallway until the far end, then turn right — you will see the Chemistry Lab sign above the door.",
        s2: "You're almost there! From the entrance, head straight until you see a Chemistry Lab sign above the door.",
      },
      "2f": {
        s1: "From the stairs, go down into the 1st floor, turn left, then turn right into the hallway, head straight until the far end, then turn right — you will see the Chemistry Lab sign above the door.",
        s2: "From the stairs, go down into the 1st floor, turn right, head straight until you see a Chemistry Lab sign above the door.",
      },
      "3f": {
        s1: "From the stairs, go down into the 2nd floor, go down into the 1st floor, turn left, then turn right into the hallway, head straight until the far end, then turn right — you will see the Chemistry Lab sign above the door.",
        s2: "From the stairs, go down into the 2nd floor, go down into the 1st floor, turn right, head straight until you see a Chemistry Lab sign above the door.",
      },
      "4f": {
        s1: "From the stairs, go down into the 3rd floor, go down into the 2nd floor, go down into the 1st floor, turn left, then turn right into the hallway, head straight until the far end, then turn right — you will see the Chemistry Lab sign above the door.",
        s2: "From the stairs, go down into the 3rd floor, go down into the 2nd floor, go down into the 1st floor, turn right, head straight until you see a Chemistry Lab sign above the door.",
      },
    },

    "Academic Office": {
      gf: { s1: "Go upstairs, turn left, head straight into the hallway — you will see the Academic Office sign above the door." },
      "1f": {
        s1: "You're almost there! From the stairs turn left, head straight — it is in the far end. You will see Academic Office sign above the door.",
        s2: "You're almost there! From the entrance, head straight until you see a stair. Turn left — you will see the Academic Office sign above the door.",
      },
      "2f": {
        s1: "From the stairs, go down into the 1st floor, turn left, then turn right into the hallway, head straight — it is in the far end. You will see Academic Office sign above the door.",
        s2: "From the stairs, go down into the 1st floor, turn right, head straight until you see a stair. Turn left — you will see an Academic Office sign above the door.",
      },
      "3f": {
        s1: "From the stairs, go down into the 2nd floor, go down into the 1st floor, turn left, then turn right into the hallway, head straight — it is in the far end. You will see Academic Office sign above the door.",
        s2: "From the stairs, go down into the 2nd floor, go down into the 1st floor, turn right, head straight until you see a stair. Turn left — you will see an Academic Office sign above the door.",
      },
      "4f": {
        s1: "From the stairs, go down into the 3rd floor, go down into the 2nd floor, go down into the 1st floor, turn left, then turn right into the hallway, head straight — it is in the far end. You will see Academic Office sign above the door.",
        s2: "From the stairs, go down into the 3rd floor, go down into the 2nd floor, go down into the 1st floor, turn right, head straight until you see a stair. Turn left — you will see an Academic Office sign above the door.",
      },
    },

    "Office of the President": {
      gf: { s1: "Go upstairs, turn left, head straight into the hallway — you will see the Office of the President sign above the door." },
      "1f": {
        s1: "You're almost there! From the stairs turn left, head straight — it is in the far end. You will see Office of the President sign above the door.",
        s2: "You're almost there! From the entrance, head straight until you see a stair. Turn left — you will see the Office of the President sign above the door.",
      },
      "2f": {
        s1: "From the stairs, go down into the 1st floor, turn left, then turn right into the hallway, head straight — it is in the far end. You will see Office of the President sign above the door.",
        s2: "From the stairs, go down into the 1st floor, turn right, head straight until you see a stair. Turn left — you will see an Office of the President sign above the door.",
      },
      "3f": {
        s1: "From the stairs, go down into the 2nd floor, go down into the 1st floor, turn left, then turn right into the hallway, head straight — it is in the far end. You will see Office of the President sign above the door.",
        s2: "From the stairs, go down into the 2nd floor, go down into the 1st floor, turn right, head straight until you see a stair. Turn left — you will see an Office of the President sign above the door.",
      },
      "4f": {
        s1: "From the stairs, go down into the 3rd floor, go down into the 2nd floor, go down into the 1st floor, turn left, then turn right into the hallway, head straight — it is in the far end. You will see Office of the President sign above the door.",
        s2: "From the stairs, go down into the 3rd floor, go down into the 2nd floor, go down into the 1st floor, turn right, head straight until you see a stair. Turn left — you will see an Office of the President sign above the door.",
      },
    },

    "Record Section — Window 2 (BSHRM, 2-Year HRM, BSTourism, Caregiving)": {
      gf: { s1: "Go upstairs, turn left, head straight into the hallway — you will see the Record Section — Window 2 sign on the counters." },
      "1f": {
        s1: "You're almost there! From the stairs turn left, head straight — you will see Record Section — Window 2 sign on the counters.",
        s2: "You're almost there! From the entrance, head straight until you see a stair. Turn left — you will see the Record Section — Window 2 sign on the counters.",
      },
      "2f": {
        s1: "From the stairs, go down into the 1st floor, turn left, then turn right into the hallway, head straight — it is in the far end. You will see Record Section — Window 2 sign on the counters.",
        s2: "From the stairs, go down into the 1st floor, turn right, head straight until you see a stair. Turn left — you will see a Record Section — Window 2 sign on the counters.",
      },
      "3f": {
        s1: "From the stairs, go down into the 2nd floor, go down into the 1st floor, turn left, then turn right into the hallway, head straight — you will see Record Section — Window 2 sign on the counters.",
        s2: "From the stairs, go down into the 2nd floor, go down into the 1st floor, turn right, head straight until you see a stair. Turn left — you will see a Record Section — Window 2 sign on the counters.",
      },
      "4f": {
        s1: "From the stairs, go down into the 3rd floor, go down into the 2nd floor, go down into the 1st floor, turn left, then turn right into the hallway, head straight — you will see Record Section — Window 2 sign on the counters.",
        s2: "From the stairs, go down into the 3rd floor, go down into the 2nd floor, go down into the 1st floor, turn right, head straight until you see a stair. Turn left — you will see a Record Section — Window 2 sign on the counters.",
      },
    },

    "Window 3": {
      gf: { s1: "Go upstairs, turn left, head straight into the hallway — you will see the Window 3 sign on the counters." },
      "1f": {
        s1: "You're almost there! From the stairs turn left, head straight — you will see Window 3 sign on the counters.",
        s2: "You're almost there! From the entrance, head straight until you see a stair. Turn left — you will see the Window 3 sign on the counters.",
      },
      "2f": {
        s1: "From the stairs, go down into the 1st floor, turn left, then turn right into the hallway, head straight — it is in the far end. You will see Window 3 sign on the counters.",
        s2: "From the stairs, go down into the 1st floor, turn right, head straight until you see a stair. Turn left — you will see a Window 3 sign on the counters.",
      },
      "3f": {
        s1: "From the stairs, go down into the 2nd floor, go down into the 1st floor, turn left, then turn right into the hallway, head straight — you will see Window 3 sign on the counters.",
        s2: "From the stairs, go down into the 2nd floor, go down into the 1st floor, turn right, head straight until you see a stair. Turn left — you will see a Window 3 sign on the counters.",
      },
      "4f": {
        s1: "From the stairs, go down into the 3rd floor, go down into the 2nd floor, go down into the 1st floor, turn left, then turn right into the hallway, head straight — you will see Window 3 sign on the counters.",
        s2: "From the stairs, go down into the 3rd floor, go down into the 2nd floor, go down into the 1st floor, turn right, head straight until you see a stair. Turn left — you will see a Window 3 sign on the counters.",
      },
    },

    "Registrar Office — Window 5": {
      gf: { s1: "Go upstairs, turn left, head straight into the hallway — you will see the Registrar Office — Window 5 sign on the counters." },
      "1f": {
        s1: "You're almost there! From the stairs turn left, head straight — you will see Registrar Office — Window 5 sign on the counters.",
        s2: "You're almost there! From the entrance, head straight until you see a stair. Turn left — you will see the Registrar Office — Window 5 sign on the counters.",
      },
      "2f": {
        s1: "From the stairs, go down into the 1st floor, turn left, then turn right into the hallway, head straight — it is in the far end. You will see Registrar Office — Window 5 sign on the counters.",
        s2: "From the stairs, go down into the 1st floor, turn right, head straight until you see a stair. Turn left — you will see a Registrar Office — Window 5 sign on the counters.",
      },
      "3f": {
        s1: "From the stairs, go down into the 2nd floor, go down into the 1st floor, turn left, then turn right into the hallway, head straight — you will see Registrar Office — Window 5 sign on the counters.",
        s2: "From the stairs, go down into the 2nd floor, go down into the 1st floor, turn right, head straight until you see a stair. Turn left — you will see a Registrar Office — Window 5 sign on the counters.",
      },
      "4f": {
        s1: "From the stairs, go down into the 3rd floor, go down into the 2nd floor, go down into the 1st floor, turn left, then turn right into the hallway, head straight — you will see Registrar Office — Window 5 sign on the counters.",
        s2: "From the stairs, go down into the 3rd floor, go down into the 2nd floor, go down into the 1st floor, turn right, head straight until you see a stair. Turn left — you will see a Registrar Office — Window 5 sign on the counters.",
      },
    },

    "Cashier — Window 6": {
      gf: { s1: "Go upstairs, turn left, head straight into the hallway — you will see the Cashier — Window 6 sign on the counters." },
      "1f": {
        s1: "You're almost there! From the stairs turn left, head straight — you will see Cashier — Window 6 sign on the counters.",
        s2: "You're almost there! From the entrance, head straight until you see a stair. Turn left — you will see the Cashier — Window 6 sign on the counters.",
      },
      "2f": {
        s1: "From the stairs, go down into the 1st floor, turn left, then turn right into the hallway, head straight — it is in the far end. You will see Cashier — Window 6 sign on the counters.",
        s2: "From the stairs, go down into the 1st floor, turn right, head straight until you see a stair. Turn left — you will see a Cashier — Window 6 sign on the counters.",
      },
      "3f": {
        s1: "From the stairs, go down into the 2nd floor, go down into the 1st floor, turn left, then turn right into the hallway, head straight — you will see Cashier — Window 6 sign on the counters.",
        s2: "From the stairs, go down into the 2nd floor, go down into the 1st floor, turn right, head straight until you see a stair. Turn left — you will see a Cashier — Window 6 sign on the counters.",
      },
      "4f": {
        s1: "From the stairs, go down into the 3rd floor, go down into the 2nd floor, go down into the 1st floor, turn left, then turn right into the hallway, head straight — you will see Cashier — Window 6 sign on the counters.",
        s2: "From the stairs, go down into the 3rd floor, go down into the 2nd floor, go down into the 1st floor, turn right, head straight until you see a stair. Turn left — you will see a Cashier — Window 6 sign on the counters.",
      },
    },

    "Assessment — Window 8 (BSHM, BSTM, BSSCRIM, Engineering)": {
      gf: { s1: "Go upstairs, turn left, head straight into the hallway — you will see the Assessment — Window 8 sign on the counters." },
      "1f": {
        s1: "You're almost there! From the stairs turn left, head straight — you will see Assessment — Window 8 sign on the counters.",
        s2: "You're almost there! From the entrance, head straight until you see a stair. Turn left — you will see the Assessment — Window 8 sign on the counters.",
      },
      "2f": {
        s1: "From the stairs, go down into the 1st floor, turn left, then turn right into the hallway, head straight — it is in the far end. You will see Assessment — Window 8 sign on the counters.",
        s2: "From the stairs, go down into the 1st floor, turn right, head straight until you see a stair. Turn left — you will see an Assessment — Window 8 sign on the counters.",
      },
      "3f": {
        s1: "From the stairs, go down into the 2nd floor, go down into the 1st floor, turn left, then turn right into the hallway, head straight — you will see Assessment — Window 8 sign on the counters.",
        s2: "From the stairs, go down into the 2nd floor, go down into the 1st floor, turn right, head straight until you see a stair. Turn left — you will see an Assessment — Window 8 sign on the counters.",
      },
      "4f": {
        s1: "From the stairs, go down into the 3rd floor, go down into the 2nd floor, go down into the 1st floor, turn left, then turn right into the hallway, head straight — you will see Assessment — Window 8 sign on the counters.",
        s2: "From the stairs, go down into the 3rd floor, go down into the 2nd floor, go down into the 1st floor, turn right, head straight until you see a stair. Turn left — you will see an Assessment — Window 8 sign on the counters.",
      },
    },

    "Accounting — Window 9 (Dentistry, Nursing, BSPT, AB Psych, Midwifery, BSA, Med Tech, BSIT, BSED/BEED, BSBA)": {
      gf: { s1: "Go upstairs, turn left, head straight into the hallway — you will see the Accounting — Window 9 sign on the counters." },
      "1f": {
        s1: "You're almost there! From the stairs turn left, head straight — you will see Accounting — Window 9 sign on the counters.",
        s2: "You're almost there! From the entrance, head straight until you see a stair. Turn left — you will see the Accounting — Window 9 sign on the counters.",
      },
      "2f": {
        s1: "From the stairs, go down into the 1st floor, turn left, then turn right into the hallway, head straight — it is in the far end. You will see Accounting — Window 9 sign on the counters.",
        s2: "From the stairs, go down into the 1st floor, turn right, head straight until you see a stair. Turn left — you will see an Accounting — Window 9 sign on the counters.",
      },
      "3f": {
        s1: "From the stairs, go down into the 2nd floor, go down into the 1st floor, turn left, then turn right into the hallway, head straight — you will see Accounting — Window 9 sign on the counters.",
        s2: "From the stairs, go down into the 2nd floor, go down into the 1st floor, turn right, head straight until you see a stair. Turn left — you will see an Accounting — Window 9 sign on the counters.",
      },
      "4f": {
        s1: "From the stairs, go down into the 3rd floor, go down into the 2nd floor, go down into the 1st floor, turn left, then turn right into the hallway, head straight — you will see Accounting — Window 9 sign on the counters.",
        s2: "From the stairs, go down into the 3rd floor, go down into the 2nd floor, go down into the 1st floor, turn right, head straight until you see a stair. Turn left — you will see an Accounting — Window 9 sign on the counters.",
      },
    },

    "Window 10": {
      gf: { s1: "Go upstairs, turn left, head straight into the hallway — you will see the Window 10 sign on the counters." },
      "1f": {
        s1: "You're almost there! From the stairs turn left, head straight — you will see Window 10 sign on the counters.",
        s2: "You're almost there! From the entrance, head straight until you see a stair. Turn left — you will see the Window 10 sign on the counters.",
      },
      "2f": {
        s1: "From the stairs, go down into the 1st floor, turn left, then turn right into the hallway, head straight — it is in the far end. You will see Window 10 sign on the counters.",
        s2: "From the stairs, go down into the 1st floor, turn right, head straight until you see a stair. Turn left — you will see a Window 10 sign on the counters.",
      },
      "3f": {
        s1: "From the stairs, go down into the 2nd floor, go down into the 1st floor, turn left, then turn right into the hallway, head straight — you will see Window 10 sign on the counters.",
        s2: "From the stairs, go down into the 2nd floor, go down into the 1st floor, turn right, head straight until you see a stair. Turn left — you will see a Window 10 sign on the counters.",
      },
      "4f": {
        s1: "From the stairs, go down into the 3rd floor, go down into the 2nd floor, go down into the 1st floor, turn left, then turn right into the hallway, head straight — you will see Window 10 sign on the counters.",
        s2: "From the stairs, go down into the 3rd floor, go down into the 2nd floor, go down into the 1st floor, turn right, head straight until you see a stair. Turn left — you will see a Window 10 sign on the counters.",
      },
    },

    "ComLab 1": {
      gf: { s1: "You're almost there! Go upstairs and it is the door to your left." },
      "1f": {
        s1: "You're almost there! Turn left — it is the door to your right before the entrance.",
        s2: "You're almost there! Turn right, turn left into the hallway. After reaching the end of the hallway, turn right — you will see ComLab 1 as the first door on your right.",
      },
      "2f": {
        s1: "From the stairs, go down into the 1st floor, turn left — it is the door to your right before the entrance.",
        s2: "From the stairs, go down into the 1st floor, turn right, turn left into the hallway. After reaching the end of the hallway, turn right — you will see ComLab 1 as the first door on your right.",
      },
      "3f": {
        s1: "From the stairs, go down into the 2nd floor, go down into the 1st floor, turn left — it is the door to your right before the entrance.",
        s2: "From the stairs, go down into the 2nd floor, go down into the 1st floor, turn right, turn left into the hallway. After reaching the end of the hallway, turn right — you will see ComLab 1 as the first door on your right.",
      },
      "4f": {
        s1: "From the stairs, go down into the 3rd floor, go down into the 2nd floor, go down into the 1st floor, turn left — it is the door to your right before the entrance.",
        s2: "From the stairs, go down into the 3rd floor, go down into the 2nd floor, go down into the 1st floor, turn right, turn left into the hallway. After reaching the end of the hallway, turn right — you will see ComLab 1 as the first door on your right.",
      },
    },

    // ════ 2ND FLOOR ROOMS ════

    "ComLab 2": {
      gf: { s1: "Go upstairs, after going inside turn left, go upstairs into the 2nd floor, turn left — you're at ComLab 2." },
      "1f": {
        s1: "Go upstairs into the 2nd floor, turn left — you're at ComLab 2.",
        s2: "Go upstairs, turn right, then head straight. After passing the library, turn left, head straight — at the end of the hallway you will find ComLab 2.",
      },
      "2f": {
        s1: "You're almost there! From the stairs, turn left — you're at ComLab 2.",
        s2: "You're almost there! From the stairs, turn right, then head straight. After passing the library, turn left, head straight — at the end of the hallway you will find ComLab 2.",
      },
      "3f": {
        s1: "Go downstairs into the 2nd floor, turn left — you're at ComLab 2.",
        s2: "Go downstairs into the 2nd floor. From the stairs, turn right, then head straight. After passing the library, turn left, head straight — at the end of the hallway you will find ComLab 2.",
      },
      "4f": {
        s1: "Go downstairs into the 3rd floor, go downstairs into the 2nd floor, turn left — you're at ComLab 2.",
        s2: "Go downstairs into the 3rd floor, go downstairs into the 2nd floor. From the stairs, turn right, then head straight. After passing the library, turn left, head straight — at the end of the hallway you will find ComLab 2.",
      },
    },

    "Therapy Room": {
      gf: { s1: "Go upstairs, after going inside turn left, go upstairs into the 2nd floor, turn left, then turn right — you will see the Therapy Room." },
      "1f": {
        s1: "Go upstairs into the 2nd floor, turn left, then turn right — you will see the Therapy Room.",
        s2: "Go upstairs, turn right, then head straight. After passing the library, turn left, head straight — you will see the Therapy Room.",
      },
      "2f": {
        s1: "You're almost there! From the stairs, turn left, then turn right — you will see the Therapy Room.",
        s2: "You're almost there! From the stairs, turn right, then head straight. After passing the library, turn left, head straight — you will see the Therapy Room.",
      },
      "3f": {
        s1: "Go downstairs into the 2nd floor, turn left, then turn right — you will see the Therapy Room.",
        s2: "Go downstairs into the 2nd floor. From the stairs, turn right, then head straight. After passing the library, turn left, head straight — you will see the Therapy Room.",
      },
      "4f": {
        s1: "Go downstairs into the 3rd floor, go downstairs into the 2nd floor, turn left, then turn right — you will see the Therapy Room.",
        s2: "Go downstairs into the 3rd floor, go downstairs into the 2nd floor. From the stairs, turn right, then head straight. After passing the library, turn left, head straight — you will see the Therapy Room.",
      },
    },

    "Therapeutics Lab": {
      gf: { s1: "Go upstairs, after going inside turn left, go upstairs into the 2nd floor, turn left, then turn right — you will see the Therapeutics Lab." },
      "1f": {
        s1: "Go upstairs into the 2nd floor, turn left, then turn right — you will see the Therapeutics Lab.",
        s2: "Go upstairs, turn right, then head straight. After passing the library, turn left, head straight — you will see the Therapeutics Lab.",
      },
      "2f": {
        s1: "You're almost there! From the stairs, turn left, then turn right — you will see the Therapeutics Lab.",
        s2: "You're almost there! From the stairs, turn right, then head straight. After passing the library, turn left, head straight — you will see the Therapeutics Lab.",
      },
      "3f": {
        s1: "Go downstairs into the 2nd floor, turn left, then turn right — you will see the Therapeutics Lab.",
        s2: "Go downstairs into the 2nd floor. From the stairs, turn right, then head straight. After passing the library, turn left, head straight — you will see the Therapeutics Lab.",
      },
      "4f": {
        s1: "Go downstairs into the 3rd floor, go downstairs into the 2nd floor, turn left, then turn right — you will see the Therapeutics Lab.",
        s2: "Go downstairs into the 3rd floor, go downstairs into the 2nd floor. From the stairs, turn right, then head straight. After passing the library, turn left, head straight — you will see the Therapeutics Lab.",
      },
    },

    "Library": {
      gf: { s1: "Go upstairs, after going inside turn left, go upstairs into the 2nd floor, turn left, then turn right. Head straight — you will see the library on your right." },
      "1f": {
        s1: "Go upstairs into the 2nd floor, turn left, then turn right. Head straight — you will see the library on your right.",
        s2: "You're almost there! Go upstairs, turn right, then head straight — you will see the library to your left.",
      },
      "2f": {
        s1: "You're almost there! From the stairs, turn left, then turn right. Head straight — you will see the library on your right.",
        s2: "You're almost there! From the stairs, turn right, then head straight — you will see the library to your left.",
      },
      "3f": {
        s1: "Go downstairs into the 2nd floor, turn left, then turn right. Head straight — you will see the library on your right.",
        s2: "Go downstairs into the 2nd floor. From the stairs, turn right, then head straight — you will see the library to your left.",
      },
      "4f": {
        s1: "Go downstairs into the 3rd floor, go downstairs into the 2nd floor, turn left, then turn right. Head straight — you will see the library on your right.",
        s2: "Go downstairs into the 3rd floor, go downstairs into the 2nd floor. From the stairs, turn right, then head straight — you will see the library to your left.",
      },
    },

    "PT Lab": {
      gf: { s1: "Go upstairs, after going inside turn left, go upstairs into the 2nd floor, turn left, then turn right — you will see the PT Lab." },
      "1f": {
        s1: "Go upstairs into the 2nd floor, turn left, then turn right — you will see the PT Lab.",
        s2: "Go upstairs, turn right, then head straight. After passing the library, turn left, head straight — you will see the PT Lab.",
      },
      "2f": {
        s1: "You're almost there! From the stairs, turn left, then turn right — you will see the PT Lab.",
        s2: "You're almost there! From the stairs, turn right, then head straight. After passing the library, turn left, head straight — you will see the PT Lab.",
      },
      "3f": {
        s1: "Go downstairs into the 2nd floor, turn left, then turn right — you will see the PT Lab.",
        s2: "Go downstairs into the 2nd floor. From the stairs, turn right, then head straight. After passing the library, turn left, head straight — you will see the PT Lab.",
      },
      "4f": {
        s1: "Go downstairs into the 3rd floor, go downstairs into the 2nd floor, turn left, then turn right — you will see the PT Lab.",
        s2: "Go downstairs into the 3rd floor, go downstairs into the 2nd floor. From the stairs, turn right, then head straight. After passing the library, turn left, head straight — you will see the PT Lab.",
      },
    },

    "Simulation Room (Mini Hospital)": {
      gf: { s1: "Go upstairs, after going inside turn left, go upstairs into the 2nd floor, turn left, then turn right — you will see the Simulation Room (Mini Hospital)." },
      "1f": {
        s1: "Go upstairs into the 2nd floor, turn left, then turn right — you will see the Simulation Room (Mini Hospital).",
        s2: "Go upstairs, turn right, then head straight. After passing the library, turn left, head straight — you will see the Simulation Room (Mini Hospital).",
      },
      "2f": {
        s1: "You're almost there! From the stairs, turn left, then turn right — you will see the Simulation Room (Mini Hospital).",
        s2: "You're almost there! From the stairs, turn right, then head straight. After passing the library, turn left, head straight — you will see the Simulation Room (Mini Hospital).",
      },
      "3f": {
        s1: "Go downstairs into the 2nd floor, turn left, then turn right — you will see the Simulation Room (Mini Hospital).",
        s2: "Go downstairs into the 2nd floor. From the stairs, turn right, then head straight. After passing the library, turn left, head straight — you will see the Simulation Room (Mini Hospital).",
      },
      "4f": {
        s1: "Go downstairs into the 3rd floor, go downstairs into the 2nd floor, turn left, then turn right — you will see the Simulation Room (Mini Hospital).",
        s2: "Go downstairs into the 3rd floor, go downstairs into the 2nd floor. From the stairs, turn right, then head straight. After passing the library, turn left, head straight — you will see the Simulation Room (Mini Hospital).",
      },
    },

    "AB Comm Lab": {
      gf: { s1: "Go upstairs, after going inside turn left, go upstairs into the 2nd floor, turn left, then turn right. Head straight through the hallway — at the end you will see the AB Comm Lab." },
      "1f": {
        s1: "Go upstairs into the 2nd floor, turn left, then turn right. Head straight — you will see the AB Comm Lab beside the stairs.",
        s2: "Go upstairs, turn right, then head straight. After passing the library, look to your right — you will see the AB Comm Lab.",
      },
      "2f": {
        s1: "You're almost there! From the stairs, turn left, then turn right. Head straight — you will see the AB Comm Lab beside the stairs.",
        s2: "You're almost there! From the stairs, turn right, then head straight. After passing the library, look to your right — you will see the AB Comm Lab.",
      },
      "3f": {
        s1: "Go downstairs into the 2nd floor, turn left, then turn right. Head straight — you will see the AB Comm Lab beside the stairs.",
        s2: "Go downstairs into the 2nd floor. From the stairs, turn right, then head straight. After passing the library, look to your right — you will see the AB Comm Lab.",
      },
      "4f": {
        s1: "Go downstairs into the 3rd floor, go downstairs into the 2nd floor, turn left, then turn right. Head straight — you will see the AB Comm Lab beside the stairs.",
        s2: "Go downstairs into the 3rd floor, go downstairs into the 2nd floor. From the stairs, turn right, then head straight. After passing the library, look to your right — you will see the AB Comm Lab.",
      },
    },

    "Drawing Lab": {
      gf: { s1: "Go upstairs, after going inside turn left, go upstairs into the 2nd floor, turn left, then turn right. Head straight — look to your left to find the Drawing Lab." },
      "1f": {
        s1: "Go upstairs into the 2nd floor, turn left, then turn right. Head straight — look to your left to find the Drawing Lab.",
        s2: "You're almost there! Go upstairs, turn right, then head straight — you will see the Drawing Lab to your right.",
      },
      "2f": {
        s1: "You're almost there! From the stairs, turn left, then turn right. Head straight — look to your left to find the Drawing Lab.",
        s2: "You're almost there! From the stairs, turn right, then head straight — you will see the Drawing Lab to your right.",
      },
      "3f": {
        s1: "Go downstairs into the 2nd floor, turn left, then turn right. Head straight — look to your left to find the Drawing Lab.",
        s2: "Go downstairs into the 2nd floor. From the stairs, turn right, then head straight — you will see the Drawing Lab to your right.",
      },
      "4f": {
        s1: "Go downstairs into the 3rd floor, go downstairs into the 2nd floor, turn left, then turn right. Head straight — look to your left to find the Drawing Lab.",
        s2: "Go downstairs into the 3rd floor, go downstairs into the 2nd floor. From the stairs, turn right, then head straight — you will see the Drawing Lab to your right.",
      },
    },

    "Engineering Office": {
      gf: { s1: "Go upstairs, after going inside turn left, go upstairs into the 2nd floor, turn left, then turn right. Head straight — look to your left to find the Engineering Office." },
      "1f": {
        s1: "Go upstairs into the 2nd floor, turn left, then turn right. Head straight — look to your left to find the Engineering Office.",
        s2: "You're almost there! Go upstairs, turn right, then head straight — you will see the Engineering Office to your right.",
      },
      "2f": {
        s1: "You're almost there! From the stairs, turn left, then turn right. Head straight — look to your left to find the Engineering Office.",
        s2: "You're almost there! From the stairs, turn right, then head straight — you will see the Engineering Office to your right.",
      },
      "3f": {
        s1: "Go downstairs into the 2nd floor, turn left, then turn right. Head straight — look to your left to find the Engineering Office.",
        s2: "Go downstairs into the 2nd floor. From the stairs, turn right, then head straight — you will see the Engineering Office to your right.",
      },
      "4f": {
        s1: "Go downstairs into the 3rd floor, go downstairs into the 2nd floor, turn left, then turn right. Head straight — look to your left to find the Engineering Office.",
        s2: "Go downstairs into the 3rd floor, go downstairs into the 2nd floor. From the stairs, turn right, then head straight — you will see the Engineering Office to your right.",
      },
    },

    // ════ 3RD FLOOR ROOMS ════

    "MB301": {
      gf: { s1: "Go upstairs into the 1st floor, after going inside turn left and go upstairs into the 2nd floor, then go upstairs again into 3rd floor, turn left, turn right, walk through the hallway — you will find MB301 above the door." },
      "1f": {
        s1: "Go upstairs into the 2nd floor, then go upstairs again into 3rd floor, turn left, turn right, walk through the hallway — you will find MB301 above the door.",
        s2: "Go upstairs into the 2nd floor, then go upstairs again into 3rd floor, turn right, then turn left, walk through the hallway — you will find MB301 above the door.",
      },
      "2f": {
        s1: "Go upstairs into 3rd floor, turn left, turn right, walk through the hallway — you will find MB301 above the door.",
        s2: "Go upstairs into 3rd floor, turn right, then turn left, walk through the hallway — you will find MB301 above the door.",
      },
      "3f": {
        s1: "You're almost there! From the stairs turn left, turn right, walk through the hallway — you will find MB301 above the door.",
        s2: "You're almost there! From the stairs turn right, then turn left, walk through the hallway — you will find MB301 above the door.",
      },
      "4f": {
        s1: "Go downstairs into 3rd floor, turn left, turn right, walk through the hallway — you will find MB301 above the door.",
        s2: "Go downstairs into 3rd floor, turn right, then turn left, walk through the hallway — you will find MB301 above the door.",
      },
    },

    "MB302": {
      gf: { s1: "Go upstairs into the 1st floor, after going inside turn left and go upstairs into the 2nd floor, then go upstairs again into 3rd floor, turn left, turn right, walk through the hallway — you will find MB302 above the door." },
      "1f": {
        s1: "Go upstairs into the 2nd floor, then go upstairs again into 3rd floor, turn left, turn right, walk through the hallway — you will find MB302 above the door.",
        s2: "Go upstairs into the 2nd floor, then go upstairs again into 3rd floor, turn right, then turn left, walk through the hallway — you will find MB302 above the door.",
      },
      "2f": {
        s1: "Go upstairs into 3rd floor, turn left, turn right, walk through the hallway — you will find MB302 above the door.",
        s2: "Go upstairs into 3rd floor, turn right, then turn left, walk through the hallway — you will find MB302 above the door.",
      },
      "3f": {
        s1: "You're almost there! From the stairs turn left, turn right, walk through the hallway — you will find MB302 above the door.",
        s2: "You're almost there! From the stairs turn right, then turn left, walk through the hallway — you will find MB302 above the door.",
      },
      "4f": {
        s1: "Go downstairs into 3rd floor, turn left, turn right, walk through the hallway — you will find MB302 above the door.",
        s2: "Go downstairs into 3rd floor, turn right, then turn left, walk through the hallway — you will find MB302 above the door.",
      },
    },

    "MB303": {
      gf: { s1: "Go upstairs into the 1st floor, after going inside turn left and go upstairs into the 2nd floor, then go upstairs again into 3rd floor, turn left, turn right, walk through the hallway — you will find MB303 above the door." },
      "1f": {
        s1: "Go upstairs into the 2nd floor, then go upstairs again into 3rd floor, turn left, turn right, walk through the hallway — you will find MB303 above the door.",
        s2: "Go upstairs into the 2nd floor, then go upstairs again into 3rd floor, turn right, then turn left, walk through the hallway — you will find MB303 above the door.",
      },
      "2f": {
        s1: "Go upstairs into 3rd floor, turn left, turn right, walk through the hallway — you will find MB303 above the door.",
        s2: "Go upstairs into 3rd floor, turn right, then turn left, walk through the hallway — you will find MB303 above the door.",
      },
      "3f": {
        s1: "You're almost there! From the stairs turn left, turn right, walk through the hallway — you will find MB303 above the door.",
        s2: "You're almost there! From the stairs turn right, then turn left, walk through the hallway — you will find MB303 above the door.",
      },
      "4f": {
        s1: "Go downstairs into 3rd floor, turn left, turn right, walk through the hallway — you will find MB303 above the door.",
        s2: "Go downstairs into 3rd floor, turn right, then turn left, walk through the hallway — you will find MB303 above the door.",
      },
    },

    "MB304": {
      gf: { s1: "Go upstairs into the 1st floor, after going inside turn left and go upstairs into the 2nd floor, then go upstairs again into 3rd floor, turn left, turn right, walk through the hallway — you will find MB304 above the door." },
      "1f": {
        s1: "Go upstairs into the 2nd floor, then go upstairs again into 3rd floor, turn left, turn right, walk through the hallway — you will find MB304 above the door.",
        s2: "Go upstairs into the 2nd floor, then go upstairs again into 3rd floor, turn right, then turn left, walk through the hallway — you will find MB304 above the door.",
      },
      "2f": {
        s1: "Go upstairs into 3rd floor, turn left, turn right, walk through the hallway — you will find MB304 above the door.",
        s2: "Go upstairs into 3rd floor, turn right, then turn left, walk through the hallway — you will find MB304 above the door.",
      },
      "3f": {
        s1: "You're almost there! From the stairs turn left, turn right, walk through the hallway — you will find MB304 above the door.",
        s2: "You're almost there! From the stairs turn right, then turn left, walk through the hallway — you will find MB304 above the door.",
      },
      "4f": {
        s1: "Go downstairs into 3rd floor, turn left, turn right, walk through the hallway — you will find MB304 above the door.",
        s2: "Go downstairs into 3rd floor, turn right, then turn left, walk through the hallway — you will find MB304 above the door.",
      },
    },

    "MB305": {
      gf: { s1: "Go upstairs into the 1st floor, after going inside turn left and go upstairs into the 2nd floor, then go upstairs again into 3rd floor, turn left, turn right, walk through the hallway — you will find MB305 above the door." },
      "1f": {
        s1: "Go upstairs into the 2nd floor, then go upstairs again into 3rd floor, turn left, turn right, walk through the hallway — you will find MB305 above the door.",
        s2: "Go upstairs into the 2nd floor, then go upstairs again into 3rd floor, turn right, then turn left, walk through the hallway — you will find MB305 above the door.",
      },
      "2f": {
        s1: "Go upstairs into 3rd floor, turn left, turn right, walk through the hallway — you will find MB305 above the door.",
        s2: "Go upstairs into 3rd floor, turn right, then turn left, walk through the hallway — you will find MB305 above the door.",
      },
      "3f": {
        s1: "You're almost there! From the stairs turn left, turn right, walk through the hallway — you will find MB305 above the door.",
        s2: "You're almost there! From the stairs turn right, then turn left, walk through the hallway — you will find MB305 above the door.",
      },
      "4f": {
        s1: "Go downstairs into 3rd floor, turn left, turn right, walk through the hallway — you will find MB305 above the door.",
        s2: "Go downstairs into 3rd floor, turn right, then turn left, walk through the hallway — you will find MB305 above the door.",
      },
    },

    "MB306": {
      gf: { s1: "Go upstairs into the 1st floor, after going inside turn left and go upstairs into the 2nd floor, then go upstairs again into 3rd floor, turn left, turn right, walk through the hallway — you will find MB306 above the door." },
      "1f": {
        s1: "Go upstairs into the 2nd floor, then go upstairs again into 3rd floor, turn left, turn right, walk through the hallway — you will find MB306 above the door.",
        s2: "Go upstairs into the 2nd floor, then go upstairs again into 3rd floor, turn right, then turn left, walk through the hallway — you will find MB306 above the door.",
      },
      "2f": {
        s1: "Go upstairs into 3rd floor, turn left, turn right, walk through the hallway — you will find MB306 above the door.",
        s2: "Go upstairs into 3rd floor, turn right, then turn left, walk through the hallway — you will find MB306 above the door.",
      },
      "3f": {
        s1: "You're almost there! From the stairs turn left, turn right, walk through the hallway — you will find MB306 above the door.",
        s2: "You're almost there! From the stairs turn right, then turn left, walk through the hallway — you will find MB306 above the door.",
      },
      "4f": {
        s1: "Go downstairs into 3rd floor, turn left, turn right, walk through the hallway — you will find MB306 above the door.",
        s2: "Go downstairs into 3rd floor, turn right, then turn left, walk through the hallway — you will find MB306 above the door.",
      },
    },

    "MB307": {
      gf: { s1: "Go upstairs into the 1st floor, after going inside turn left and go upstairs into the 2nd floor, then go upstairs again into 3rd floor, turn left, turn right, walk through the hallway — you will find MB307 above the door." },
      "1f": {
        s1: "Go upstairs into the 2nd floor, then go upstairs again into 3rd floor, turn left, turn right, walk through the hallway — you will find MB307 above the door.",
        s2: "Go upstairs into the 2nd floor, then go upstairs again into 3rd floor, turn right, then turn left, walk through the hallway — you will find MB307 above the door.",
      },
      "2f": {
        s1: "Go upstairs into 3rd floor, turn left, turn right, walk through the hallway — you will find MB307 above the door.",
        s2: "Go upstairs into 3rd floor, turn right, then turn left, walk through the hallway — you will find MB307 above the door.",
      },
      "3f": {
        s1: "You're almost there! From the stairs turn left, turn right, walk through the hallway — you will find MB307 above the door.",
        s2: "You're almost there! From the stairs turn right, then turn left, walk through the hallway — you will find MB307 above the door.",
      },
      "4f": {
        s1: "Go downstairs into 3rd floor, turn left, turn right, walk through the hallway — you will find MB307 above the door.",
        s2: "Go downstairs into 3rd floor, turn right, then turn left, walk through the hallway — you will find MB307 above the door.",
      },
    },

    "MB308": {
      gf: { s1: "Go upstairs into the 1st floor, after going inside turn left and go upstairs into the 2nd floor, then go upstairs again into 3rd floor, turn left, turn right, walk through the hallway — you will find MB308 above the door." },
      "1f": {
        s1: "Go upstairs into the 2nd floor, then go upstairs again into 3rd floor, turn left, turn right, walk through the hallway — you will find MB308 above the door.",
        s2: "Go upstairs into the 2nd floor, then go upstairs again into 3rd floor, turn right, then turn left, walk through the hallway — you will find MB308 above the door.",
      },
      "2f": {
        s1: "Go upstairs into 3rd floor, turn left, turn right, walk through the hallway — you will find MB308 above the door.",
        s2: "Go upstairs into 3rd floor, turn right, then turn left, walk through the hallway — you will find MB308 above the door.",
      },
      "3f": {
        s1: "You're almost there! From the stairs turn left, turn right, walk through the hallway — you will find MB308 above the door.",
        s2: "You're almost there! From the stairs turn right, then turn left, walk through the hallway — you will find MB308 above the door.",
      },
      "4f": {
        s1: "Go downstairs into 3rd floor, turn left, turn right, walk through the hallway — you will find MB308 above the door.",
        s2: "Go downstairs into 3rd floor, turn right, then turn left, walk through the hallway — you will find MB308 above the door.",
      },
    },

    "MB309": {
      gf: { s1: "Go upstairs into the 1st floor, after going inside turn left and go upstairs into the 2nd floor, then go upstairs again into 3rd floor, turn left, turn right, walk through the hallway — you will find MB309 above the door." },
      "1f": {
        s1: "Go upstairs into the 2nd floor, then go upstairs again into 3rd floor, turn left, turn right, walk through the hallway — you will find MB309 above the door.",
        s2: "Go upstairs into the 2nd floor, then go upstairs again into 3rd floor, turn right, then turn left, walk through the hallway — you will find MB309 above the door.",
      },
      "2f": {
        s1: "Go upstairs into 3rd floor, turn left, turn right, walk through the hallway — you will find MB309 above the door.",
        s2: "Go upstairs into 3rd floor, turn right, then turn left, walk through the hallway — you will find MB309 above the door.",
      },
      "3f": {
        s1: "You're almost there! From the stairs turn left, turn right, walk through the hallway — you will find MB309 above the door.",
        s2: "You're almost there! From the stairs turn right, then turn left, walk through the hallway — you will find MB309 above the door.",
      },
      "4f": {
        s1: "Go downstairs into 3rd floor, turn left, turn right, walk through the hallway — you will find MB309 above the door.",
        s2: "Go downstairs into 3rd floor, turn right, then turn left, walk through the hallway — you will find MB309 above the door.",
      },
    },

    "MB310": {
      gf: { s1: "Go upstairs into the 1st floor, after going inside turn left and go upstairs into the 2nd floor, then go upstairs again into 3rd floor, turn left, turn right, walk through the hallway — you will find MB310 above the door." },
      "1f": {
        s1: "Go upstairs into the 2nd floor, then go upstairs again into 3rd floor, turn left, turn right, walk through the hallway — you will find MB310 above the door.",
        s2: "Go upstairs into the 2nd floor, then go upstairs again into 3rd floor, turn right, then turn left, walk through the hallway — you will find MB310 above the door.",
      },
      "2f": {
        s1: "Go upstairs into 3rd floor, turn left, turn right, walk through the hallway — you will find MB310 above the door.",
        s2: "Go upstairs into 3rd floor, turn right, then turn left, walk through the hallway — you will find MB310 above the door.",
      },
      "3f": {
        s1: "You're almost there! From the stairs turn left, turn right, walk through the hallway — you will find MB310 above the door.",
        s2: "You're almost there! From the stairs turn right, then turn left, walk through the hallway — you will find MB310 above the door.",
      },
      "4f": {
        s1: "Go downstairs into 3rd floor, turn left, turn right, walk through the hallway — you will find MB310 above the door.",
        s2: "Go downstairs into 3rd floor, turn right, then turn left, walk through the hallway — you will find MB310 above the door.",
      },
    },

    "MB311": {
      gf: { s1: "Go upstairs into the 1st floor, after going inside turn left and go upstairs into the 2nd floor, then go upstairs again into 3rd floor, turn left, turn right, walk through the hallway — you will find MB311 above the door." },
      "1f": {
        s1: "Go upstairs into the 2nd floor, then go upstairs again into 3rd floor, turn left, turn right, walk through the hallway — you will find MB311 above the door.",
        s2: "Go upstairs into the 2nd floor, then go upstairs again into 3rd floor, turn right, then turn left, walk through the hallway — you will find MB311 above the door.",
      },
      "2f": {
        s1: "Go upstairs into 3rd floor, turn left, turn right, walk through the hallway — you will find MB311 above the door.",
        s2: "Go upstairs into 3rd floor, turn right, then turn left, walk through the hallway — you will find MB311 above the door.",
      },
      "3f": {
        s1: "You're almost there! From the stairs turn left, turn right, walk through the hallway — you will find MB311 above the door.",
        s2: "You're almost there! From the stairs turn right, then turn left, walk through the hallway — you will find MB311 above the door.",
      },
      "4f": {
        s1: "Go downstairs into 3rd floor, turn left, turn right, walk through the hallway — you will find MB311 above the door.",
        s2: "Go downstairs into 3rd floor, turn right, then turn left, walk through the hallway — you will find MB311 above the door.",
      },
    },

    "MB312": {
      gf: { s1: "Go upstairs into the 1st floor, after going inside turn left and go upstairs into the 2nd floor, then go upstairs again into 3rd floor, turn left, turn right, walk through the hallway — you will find MB312 above the door." },
      "1f": {
        s1: "Go upstairs into the 2nd floor, then go upstairs again into 3rd floor, turn left, turn right, walk through the hallway — you will find MB312 above the door.",
        s2: "Go upstairs into the 2nd floor, then go upstairs again into 3rd floor, turn right, then turn left, walk through the hallway — you will find MB312 above the door.",
      },
      "2f": {
        s1: "Go upstairs into 3rd floor, turn left, turn right, walk through the hallway — you will find MB312 above the door.",
        s2: "Go upstairs into 3rd floor, turn right, then turn left, walk through the hallway — you will find MB312 above the door.",
      },
      "3f": {
        s1: "You're almost there! From the stairs turn left, turn right, walk through the hallway — you will find MB312 above the door.",
        s2: "You're almost there! From the stairs turn right, then turn left, walk through the hallway — you will find MB312 above the door.",
      },
      "4f": {
        s1: "Go downstairs into 3rd floor, turn left, turn right, walk through the hallway — you will find MB312 above the door.",
        s2: "Go downstairs into 3rd floor, turn right, then turn left, walk through the hallway — you will find MB312 above the door.",
      },
    },

    "MB313": {
      gf: { s1: "Go upstairs into the 1st floor, after going inside turn left and go upstairs into the 2nd floor, then go upstairs again into 3rd floor, turn left, turn right, walk through the hallway — you will find MB313 above the door." },
      "1f": {
        s1: "Go upstairs into the 2nd floor, then go upstairs again into 3rd floor, turn left, turn right, walk through the hallway — you will find MB313 above the door.",
        s2: "Go upstairs into the 2nd floor, then go upstairs again into 3rd floor, turn right, then turn left, walk through the hallway — you will find MB313 above the door.",
      },
      "2f": {
        s1: "Go upstairs into 3rd floor, turn left, turn right, walk through the hallway — you will find MB313 above the door.",
        s2: "Go upstairs into 3rd floor, turn right, then turn left, walk through the hallway — you will find MB313 above the door.",
      },
      "3f": {
        s1: "You're almost there! From the stairs turn left, turn right, walk through the hallway — you will find MB313 above the door.",
        s2: "You're almost there! From the stairs turn right, then turn left, walk through the hallway — you will find MB313 above the door.",
      },
      "4f": {
        s1: "Go downstairs into 3rd floor, turn left, turn right, walk through the hallway — you will find MB313 above the door.",
        s2: "Go downstairs into 3rd floor, turn right, then turn left, walk through the hallway — you will find MB313 above the door.",
      },
    },

    "MB314": {
      gf: { s1: "Go upstairs into the 1st floor, after going inside turn left and go upstairs into the 2nd floor, then go upstairs again into 3rd floor, turn left, turn right, walk through the hallway — you will find MB314 above the door." },
      "1f": {
        s1: "Go upstairs into the 2nd floor, then go upstairs again into 3rd floor, turn left, turn right, walk through the hallway — you will find MB314 above the door.",
        s2: "Go upstairs into the 2nd floor, then go upstairs again into 3rd floor, turn right, then turn left, walk through the hallway — you will find MB314 above the door.",
      },
      "2f": {
        s1: "Go upstairs into 3rd floor, turn left, turn right, walk through the hallway — you will find MB314 above the door.",
        s2: "Go upstairs into 3rd floor, turn right, then turn left, walk through the hallway — you will find MB314 above the door.",
      },
      "3f": {
        s1: "You're almost there! From the stairs turn left, turn right, walk through the hallway — you will find MB314 above the door.",
        s2: "You're almost there! From the stairs turn right, then turn left, walk through the hallway — you will find MB314 above the door.",
      },
      "4f": {
        s1: "Go downstairs into 3rd floor, turn left, turn right, walk through the hallway — you will find MB314 above the door.",
        s2: "Go downstairs into 3rd floor, turn right, then turn left, walk through the hallway — you will find MB314 above the door.",
      },
    },

    "Office Simulation Lab": {
      gf: { s1: "Go upstairs into the 1st floor, after going inside turn left and go upstairs into the 2nd floor, then go upstairs again into 3rd floor, turn left, turn right — you will find Office Simulation Lab above the door." },
      "1f": {
        s1: "Go upstairs into the 2nd floor, then go upstairs again into 3rd floor, turn left, turn right — you will find Office Simulation Lab above the door.",
        s2: "Go upstairs into the 2nd floor, then go upstairs again into 3rd floor, turn right, then turn left — at the end of the hallway you will find Office Simulation Lab above the door.",
      },
      "2f": {
        s1: "Go upstairs into 3rd floor, turn left, turn right — you will find Office Simulation Lab above the door.",
        s2: "Go upstairs into 3rd floor, turn right, then turn left — at the end of the hallway you will find Office Simulation Lab above the door.",
      },
      "3f": {
        s1: "You're almost there! From the stairs turn left, turn right — you will find Office Simulation Lab above the door.",
        s2: "You're almost there! From the stairs turn right, then turn left — at the end of the hallway you will find Office Simulation Lab above the door.",
      },
      "4f": {
        s1: "Go downstairs into 3rd floor, turn left, turn right — you will find Office Simulation Lab above the door.",
        s2: "Go downstairs into 3rd floor, turn right, then turn left — at the end of the hallway you will find Office Simulation Lab above the door.",
      },
    },

    "Faculty Room": {
      gf: { s1: "Go upstairs into the 1st floor, after going inside turn left and go upstairs into the 2nd floor, then go upstairs again into 3rd floor, turn left — you will find Faculty Room above the door." },
      "1f": {
        s1: "Go upstairs into the 2nd floor, then go upstairs again into 3rd floor, turn left — you will find Faculty Room above the door.",
        s2: "Go upstairs into the 2nd floor, then go upstairs again into 3rd floor, turn right, then turn left, at the end of the hallway turn right — you will find Faculty Room above the door.",
      },
      "2f": {
        s1: "Go upstairs into 3rd floor, turn left — you will find Faculty Room above the door.",
        s2: "Go upstairs into 3rd floor, turn right, then turn left, at the end of the hallway turn right — you will find Faculty Room above the door.",
      },
      "3f": {
        s1: "You're almost there! From the stairs turn left — you will find Faculty Room above the door.",
        s2: "You're almost there! From the stairs turn right, then turn left, at the end of the hallway turn right — you will find Faculty Room above the door.",
      },
      "4f": {
        s1: "Go downstairs into 3rd floor, turn left — you will find Faculty Room above the door.",
        s2: "Go downstairs into 3rd floor, turn right, then turn left, at the end of the hallway turn right — you will find Faculty Room above the door.",
      },
    },

    // NOTE: The directions file incorrectly wrote "Faculty Room" in the Consultation Room entries.
    // The correct destination label is "Consultation Room" — fixed here.
    "Consultation Room": {
      gf: { s1: "Go upstairs into the 1st floor, after going inside turn left and go upstairs into the 2nd floor, then go upstairs again into 3rd floor, turn left — you will find Consultation Room above the door." },
      "1f": {
        s1: "Go upstairs into the 2nd floor, then go upstairs again into 3rd floor, turn left — you will find Consultation Room above the door.",
        s2: "Go upstairs into the 2nd floor, then go upstairs again into 3rd floor, turn right, then turn left — at the end of the hallway you will find Consultation Room above the door.",
      },
      "2f": {
        s1: "Go upstairs into 3rd floor, turn left — you will find Consultation Room above the door.",
        s2: "Go upstairs into 3rd floor, turn right, then turn left — at the end of the hallway you will find Consultation Room above the door.",
      },
      "3f": {
        s1: "You're almost there! From the stairs turn left — you will find Consultation Room above the door.",
        s2: "You're almost there! From the stairs turn right, then turn left — at the end of the hallway you will find Consultation Room above the door.",
      },
      "4f": {
        s1: "Go downstairs into 3rd floor, turn left — you will find Consultation Room above the door.",
        s2: "Go downstairs into 3rd floor, turn right, then turn left — at the end of the hallway you will find Consultation Room above the door.",
      },
    },

    "SBEAT Dean's Office": {
      gf: { s1: "Go upstairs into the 1st floor, after going inside turn left and go upstairs into the 2nd floor, then go upstairs again into 3rd floor, turn left — you will find SBEAT Dean's Office above the door." },
      "1f": {
        s1: "Go upstairs into the 2nd floor, then go upstairs again into 3rd floor, turn left — you will find SBEAT Dean's Office above the door.",
        s2: "Go upstairs into the 2nd floor, then go upstairs again into 3rd floor, turn right, then turn left, at the end of the hallway turn left — you will find SBEAT Dean's Office above the door.",
      },
      "2f": {
        s1: "Go upstairs into 3rd floor, turn left — you will find SBEAT Dean's Office above the door.",
        s2: "Go upstairs into 3rd floor, turn right, then turn left, at the end of the hallway turn left — you will find SBEAT Dean's Office above the door.",
      },
      "3f": {
        s1: "You're almost there! From the stairs turn left — you will find SBEAT Dean's Office above the door.",
        s2: "You're almost there! From the stairs turn right, then turn left, at the end of the hallway turn left — you will find SBEAT Dean's Office above the door.",
      },
      "4f": {
        s1: "Go downstairs into 3rd floor, turn left — you will find SBEAT Dean's Office above the door.",
        s2: "Go downstairs into 3rd floor, turn right, then turn left, at the end of the hallway turn left — you will find SBEAT Dean's Office above the door.",
      },
    },

    // ════ 4TH FLOOR ROOMS ════

    "MB401": {
      gf: { s1: "Go upstairs into the 1st floor, after going inside turn left and go upstairs into the 2nd floor, go upstairs into 3rd floor, then go upstairs again into 4th floor, turn left, turn right, walk through the hallway — you will find MB401 above the door." },
      "1f": {
        s1: "Go upstairs into the 2nd floor, go upstairs into 3rd floor, then go upstairs again into 4th floor, turn left, turn right, walk through the hallway — you will find MB401 above the door.",
        s2: "Go upstairs into the 2nd floor, go upstairs into 3rd floor, then go upstairs again into 4th floor, turn right, then turn left, walk through the hallway — you will find MB401 above the door.",
      },
      "2f": {
        s1: "Go upstairs into 3rd floor, then go upstairs again into 4th floor, turn left, turn right, walk through the hallway — you will find MB401 above the door.",
        s2: "Go upstairs into 3rd floor, then go upstairs again into 4th floor, turn right, then turn left, walk through the hallway — you will find MB401 above the door.",
      },
      "3f": {
        s1: "Go upstairs into 4th floor, turn left, turn right, walk through the hallway — you will find MB401 above the door.",
        s2: "Go upstairs into 4th floor, turn right, then turn left, walk through the hallway — you will find MB401 above the door.",
      },
      "4f": {
        s1: "You're almost there! From the stairs turn left, turn right, walk through the hallway — you will find MB401 above the door.",
        s2: "You're almost there! From the stairs turn right, then turn left, walk through the hallway — you will find MB401 above the door.",
      },
    },

    "MB402": {
      gf: { s1: "Go upstairs into the 1st floor, after going inside turn left and go upstairs into the 2nd floor, go upstairs into 3rd floor, then go upstairs again into 4th floor, turn left, turn right, walk through the hallway — you will find MB402 above the door." },
      "1f": {
        s1: "Go upstairs into the 2nd floor, go upstairs into 3rd floor, then go upstairs again into 4th floor, turn left, turn right, walk through the hallway — you will find MB402 above the door.",
        s2: "Go upstairs into the 2nd floor, go upstairs into 3rd floor, then go upstairs again into 4th floor, turn right, then turn left, walk through the hallway — you will find MB402 above the door.",
      },
      "2f": {
        s1: "Go upstairs into 3rd floor, then go upstairs again into 4th floor, turn left, turn right, walk through the hallway — you will find MB402 above the door.",
        s2: "Go upstairs into 3rd floor, then go upstairs again into 4th floor, turn right, then turn left, walk through the hallway — you will find MB402 above the door.",
      },
      "3f": {
        s1: "Go upstairs into 4th floor, turn left, turn right, walk through the hallway — you will find MB402 above the door.",
        s2: "Go upstairs into 4th floor, turn right, then turn left, walk through the hallway — you will find MB402 above the door.",
      },
      "4f": {
        s1: "You're almost there! From the stairs turn left, turn right, walk through the hallway — you will find MB402 above the door.",
        s2: "You're almost there! From the stairs turn right, then turn left, walk through the hallway — you will find MB402 above the door.",
      },
    },

    "MB403": {
      gf: { s1: "Go upstairs into the 1st floor, after going inside turn left and go upstairs into the 2nd floor, go upstairs into 3rd floor, then go upstairs again into 4th floor, turn left, turn right, walk through the hallway — you will find MB403 above the door." },
      "1f": {
        s1: "Go upstairs into the 2nd floor, go upstairs into 3rd floor, then go upstairs again into 4th floor, turn left, turn right, walk through the hallway — you will find MB403 above the door.",
        s2: "Go upstairs into the 2nd floor, go upstairs into 3rd floor, then go upstairs again into 4th floor, turn right, then turn left, walk through the hallway — you will find MB403 above the door.",
      },
      "2f": {
        s1: "Go upstairs into 3rd floor, then go upstairs again into 4th floor, turn left, turn right, walk through the hallway — you will find MB403 above the door.",
        s2: "Go upstairs into 3rd floor, then go upstairs again into 4th floor, turn right, then turn left, walk through the hallway — you will find MB403 above the door.",
      },
      "3f": {
        s1: "Go upstairs into 4th floor, turn left, turn right, walk through the hallway — you will find MB403 above the door.",
        s2: "Go upstairs into 4th floor, turn right, then turn left, walk through the hallway — you will find MB403 above the door.",
      },
      "4f": {
        s1: "You're almost there! From the stairs turn left, turn right, walk through the hallway — you will find MB403 above the door.",
        s2: "You're almost there! From the stairs turn right, then turn left, walk through the hallway — you will find MB403 above the door.",
      },
    },

    "MB406": {
      gf: { s1: "Go upstairs into the 1st floor, after going inside turn left and go upstairs into the 2nd floor, go upstairs into 3rd floor, then go upstairs again into 4th floor, turn left, turn right, walk through the hallway — you will find MB406 above the door." },
      "1f": {
        s1: "Go upstairs into the 2nd floor, go upstairs into 3rd floor, then go upstairs again into 4th floor, turn left, turn right, walk through the hallway — you will find MB406 above the door.",
        s2: "Go upstairs into the 2nd floor, go upstairs into 3rd floor, then go upstairs again into 4th floor, turn right, then turn left, walk through the hallway — you will find MB406 above the door.",
      },
      "2f": {
        s1: "Go upstairs into 3rd floor, then go upstairs again into 4th floor, turn left, turn right, walk through the hallway — you will find MB406 above the door.",
        s2: "Go upstairs into 3rd floor, then go upstairs again into 4th floor, turn right, then turn left, walk through the hallway — you will find MB406 above the door.",
      },
      "3f": {
        s1: "Go upstairs into 4th floor, turn left, turn right, walk through the hallway — you will find MB406 above the door.",
        s2: "Go upstairs into 4th floor, turn right, then turn left, walk through the hallway — you will find MB406 above the door.",
      },
      "4f": {
        s1: "You're almost there! From the stairs turn left, turn right, walk through the hallway — you will find MB406 above the door.",
        s2: "You're almost there! From the stairs turn right, then turn left, walk through the hallway — you will find MB406 above the door.",
      },
    },

    "MB407": {
      gf: { s1: "Go upstairs into the 1st floor, after going inside turn left and go upstairs into the 2nd floor, go upstairs into 3rd floor, then go upstairs again into 4th floor, turn left, turn right, walk through the hallway — you will find MB407 above the door." },
      "1f": {
        s1: "Go upstairs into the 2nd floor, go upstairs into 3rd floor, then go upstairs again into 4th floor, turn left, turn right, walk through the hallway — you will find MB407 above the door.",
        s2: "Go upstairs into the 2nd floor, go upstairs into 3rd floor, then go upstairs again into 4th floor, turn right, then turn left, walk through the hallway — you will find MB407 above the door.",
      },
      "2f": {
        s1: "Go upstairs into 3rd floor, then go upstairs again into 4th floor, turn left, turn right, walk through the hallway — you will find MB407 above the door.",
        s2: "Go upstairs into 3rd floor, then go upstairs again into 4th floor, turn right, then turn left, walk through the hallway — you will find MB407 above the door.",
      },
      "3f": {
        s1: "Go upstairs into 4th floor, turn left, turn right, walk through the hallway — you will find MB407 above the door.",
        s2: "Go upstairs into 4th floor, turn right, then turn left, walk through the hallway — you will find MB407 above the door.",
      },
      "4f": {
        s1: "You're almost there! From the stairs turn left, turn right, walk through the hallway — you will find MB407 above the door.",
        s2: "You're almost there! From the stairs turn right, then turn left, walk through the hallway — you will find MB407 above the door.",
      },
    },

    "MB408": {
      gf: { s1: "Go upstairs into the 1st floor, after going inside turn left and go upstairs into the 2nd floor, go upstairs into 3rd floor, then go upstairs again into 4th floor, turn left, turn right, walk through the hallway — you will find MB408 above the door." },
      "1f": {
        s1: "Go upstairs into the 2nd floor, go upstairs into 3rd floor, then go upstairs again into 4th floor, turn left, turn right, walk through the hallway — you will find MB408 above the door.",
        s2: "Go upstairs into the 2nd floor, go upstairs into 3rd floor, then go upstairs again into 4th floor, turn right, then turn left, walk through the hallway — you will find MB408 above the door.",
      },
      "2f": {
        s1: "Go upstairs into 3rd floor, then go upstairs again into 4th floor, turn left, turn right, walk through the hallway — you will find MB408 above the door.",
        s2: "Go upstairs into 3rd floor, then go upstairs again into 4th floor, turn right, then turn left, walk through the hallway — you will find MB408 above the door.",
      },
      "3f": {
        s1: "Go upstairs into 4th floor, turn left, turn right, walk through the hallway — you will find MB408 above the door.",
        s2: "Go upstairs into 4th floor, turn right, then turn left, walk through the hallway — you will find MB408 above the door.",
      },
      "4f": {
        s1: "You're almost there! From the stairs turn left, turn right, walk through the hallway — you will find MB408 above the door.",
        s2: "You're almost there! From the stairs turn right, then turn left, walk through the hallway — you will find MB408 above the door.",
      },
    },

    "MB409": {
      gf: { s1: "Go upstairs into the 1st floor, after going inside turn left and go upstairs into the 2nd floor, go upstairs into 3rd floor, then go upstairs again into 4th floor, turn left, turn right, walk through the hallway — you will find MB409 above the door." },
      "1f": {
        s1: "Go upstairs into the 2nd floor, go upstairs into 3rd floor, then go upstairs again into 4th floor, turn left, turn right, walk through the hallway — you will find MB409 above the door.",
        s2: "Go upstairs into the 2nd floor, go upstairs into 3rd floor, then go upstairs again into 4th floor, turn right, then turn left, walk through the hallway — you will find MB409 above the door.",
      },
      "2f": {
        s1: "Go upstairs into 3rd floor, then go upstairs again into 4th floor, turn left, turn right, walk through the hallway — you will find MB409 above the door.",
        s2: "Go upstairs into 3rd floor, then go upstairs again into 4th floor, turn right, then turn left, walk through the hallway — you will find MB409 above the door.",
      },
      "3f": {
        s1: "Go upstairs into 4th floor, turn left, turn right, walk through the hallway — you will find MB409 above the door.",
        s2: "Go upstairs into 4th floor, turn right, then turn left, walk through the hallway — you will find MB409 above the door.",
      },
      "4f": {
        s1: "You're almost there! From the stairs turn left, turn right, walk through the hallway — you will find MB409 above the door.",
        s2: "You're almost there! From the stairs turn right, then turn left, walk through the hallway — you will find MB409 above the door.",
      },
    },

    "MB410": {
      gf: { s1: "Go upstairs into the 1st floor, after going inside turn left and go upstairs into the 2nd floor, go upstairs into 3rd floor, then go upstairs again into 4th floor, turn left, turn right, walk through the hallway — you will find MB410 above the door." },
      "1f": {
        s1: "Go upstairs into the 2nd floor, go upstairs into 3rd floor, then go upstairs again into 4th floor, turn left, turn right, walk through the hallway — you will find MB410 above the door.",
        s2: "Go upstairs into the 2nd floor, go upstairs into 3rd floor, then go upstairs again into 4th floor, turn right, then turn left, walk through the hallway — you will find MB410 above the door.",
      },
      "2f": {
        s1: "Go upstairs into 3rd floor, then go upstairs again into 4th floor, turn left, turn right, walk through the hallway — you will find MB410 above the door.",
        s2: "Go upstairs into 3rd floor, then go upstairs again into 4th floor, turn right, then turn left, walk through the hallway — you will find MB410 above the door.",
      },
      "3f": {
        s1: "Go upstairs into 4th floor, turn left, turn right, walk through the hallway — you will find MB410 above the door.",
        s2: "Go upstairs into 4th floor, turn right, then turn left, walk through the hallway — you will find MB410 above the door.",
      },
      "4f": {
        s1: "You're almost there! From the stairs turn left, turn right, walk through the hallway — you will find MB410 above the door.",
        s2: "You're almost there! From the stairs turn right, then turn left, walk through the hallway — you will find MB410 above the door.",
      },
    },

    "Typing Room": {
      gf: { s1: "Go upstairs into the 1st floor, after going inside turn left and go upstairs into the 2nd floor, then go upstairs again into 3rd floor. Lastly, go upstairs into the 4th floor and then turn left — you will find the Typing Room." },
      "1f": {
        s1: "Go upstairs into the 2nd floor, then go upstairs again into 3rd floor, lastly go upstairs into the 4th floor and then turn left — you will find the Typing Room.",
        s2: "Go upstairs into the 2nd floor, then go upstairs again into 3rd floor, lastly go upstairs into the 4th floor and then turn right, then turn left, at the end of the hallway turn left — you will find Typing Room.",
      },
      "2f": {
        s1: "Go upstairs into 3rd floor, go upstairs into the 4th floor and then turn left — you will find Typing Room.",
        s2: "Go upstairs into 3rd floor, go upstairs into the 4th floor and then turn right, then turn left, at the end of the hallway turn left — you will find Typing Room.",
      },
      "3f": {
        s1: "Go upstairs into 4th floor, turn left — you will find Typing Room.",
        s2: "Go upstairs into 4th floor, turn right, then turn left, at the end of the hallway turn left — you will find Typing Room.",
      },
      "4f": {
        s1: "You're almost there! From the stairs turn left — you will find Typing Room.",
        s2: "You're almost there! From the stairs turn right, then turn left, at the end of the hallway turn left — you will find Typing Room.",
      },
    },

    "Nursing Skills Lab": {
      gf: { s1: "Go upstairs into the 1st floor, after going inside turn left and go upstairs into the 2nd floor, go upstairs into 3rd floor, then go upstairs again into 4th floor, turn left, turn right, walk through the hallway, then turn right — you will find Nursing Skills Lab above the door." },
      "1f": {
        s1: "Go upstairs into the 2nd floor, go upstairs into 3rd floor, then go upstairs again into 4th floor, turn left, turn right, walk through the hallway, then turn right — you will find Nursing Skills Lab above the door.",
        s2: "Go upstairs into the 2nd floor, go upstairs into 3rd floor, then go upstairs again into 4th floor, turn right — you will find Nursing Skills Lab above the door.",
      },
      "2f": {
        s1: "Go upstairs into 3rd floor, then go upstairs again into 4th floor, turn left, turn right, walk through the hallway, then turn right — you will find Nursing Skills Lab above the door.",
        s2: "Go upstairs into 3rd floor, then go upstairs again into 4th floor, turn right — you will find Nursing Skills Lab above the door.",
      },
      "3f": {
        s1: "Go upstairs into 4th floor, turn left, turn right, walk through the hallway, then turn right — you will find Nursing Skills Lab above the door.",
        s2: "Go upstairs into 4th floor, turn right — you will find Nursing Skills Lab above the door.",
      },
      "4f": {
        s1: "You're almost there! From the stairs turn left, turn right, walk through the hallway, then turn right — you will find Nursing Skills Lab above the door.",
        s2: "You're almost there! From the stairs turn right — you will find Nursing Skills Lab above the door.",
      },
    },

    "Nursing Demo Room": {
      gf: { s1: "Go upstairs into the 1st floor, after going inside turn left and go upstairs into the 2nd floor, go upstairs into 3rd floor, then go upstairs again into 4th floor, turn left, turn right, walk through the hallway, then turn right — you will find Nursing Demo Room above the door." },
      "1f": {
        s1: "Go upstairs into the 2nd floor, go upstairs into 3rd floor, then go upstairs again into 4th floor, turn left, turn right, walk through the hallway, then turn right — you will find Nursing Demo Room above the door.",
        s2: "Go upstairs into the 2nd floor, go upstairs into 3rd floor, then go upstairs again into 4th floor, turn right — you will find Nursing Demo Room above the door.",
      },
      "2f": {
        s1: "Go upstairs into 3rd floor, then go upstairs again into 4th floor, turn left, turn right, walk through the hallway, then turn right — you will find Nursing Demo Room above the door.",
        s2: "Go upstairs into 3rd floor, then go upstairs again into 4th floor, turn right — you will find Nursing Demo Room above the door.",
      },
      "3f": {
        s1: "Go upstairs into 4th floor, turn left, turn right, walk through the hallway, then turn right — you will find Nursing Demo Room above the door.",
        s2: "Go upstairs into 4th floor, turn right — you will find Nursing Demo Room above the door.",
      },
      "4f": {
        s1: "You're almost there! From the stairs turn left, turn right, walk through the hallway, then turn right — you will find Nursing Demo Room above the door.",
        s2: "You're almost there! From the stairs turn right — you will find Nursing Demo Room above the door.",
      },
    },

    "Caregiving Lecture Room": {
      gf: { s1: "Go upstairs into the 1st floor, after going inside turn left and go upstairs into the 2nd floor, go upstairs into 3rd floor, then go upstairs again into 4th floor, turn left, turn right, walk through the hallway, then turn right — you will find Caregiving Lecture Room above the door." },
      "1f": {
        s1: "Go upstairs into the 2nd floor, go upstairs into 3rd floor, then go upstairs again into 4th floor, turn left, turn right, walk through the hallway, then turn right — you will find Caregiving Lecture Room above the door.",
        s2: "Go upstairs into the 2nd floor, go upstairs into 3rd floor, then go upstairs again into 4th floor, turn right — you will find Caregiving Lecture Room above the door.",
      },
      "2f": {
        s1: "Go upstairs into 3rd floor, then go upstairs again into 4th floor, turn left, turn right, walk through the hallway, then turn right — you will find Caregiving Lecture Room above the door.",
        s2: "Go upstairs into 3rd floor, then go upstairs again into 4th floor, turn right — you will find Caregiving Lecture Room above the door.",
      },
      "3f": {
        s1: "Go upstairs into 4th floor, turn left, turn right, walk through the hallway, then turn right — you will find Caregiving Lecture Room above the door.",
        s2: "Go upstairs into 4th floor, turn right — you will find Caregiving Lecture Room above the door.",
      },
      "4f": {
        s1: "You're almost there! From the stairs turn left, turn right, walk through the hallway, then turn right — you will find Caregiving Lecture Room above the door.",
        s2: "You're almost there! From the stairs turn right — you will find Caregiving Lecture Room above the door.",
      },
    },

    "Caregiving Mock Room": {
      gf: { s1: "Go upstairs into the 1st floor, after going inside turn left and go upstairs into the 2nd floor, go upstairs into 3rd floor, then go upstairs again into 4th floor, turn left, turn right, walk through the hallway — you will find Caregiving Mock Room above the door." },
      "1f": {
        s1: "Go upstairs into the 2nd floor, go upstairs into 3rd floor, then go upstairs again into 4th floor, turn left, turn right, walk through the hallway — you will find Caregiving Mock Room above the door.",
        s2: "Go upstairs into the 2nd floor, go upstairs into 3rd floor, then go upstairs again into 4th floor, turn right, then turn left — you will find Caregiving Mock Room above the door.",
      },
      "2f": {
        s1: "Go upstairs into 3rd floor, then go upstairs again into 4th floor, turn left, turn right, walk through the hallway — you will find Caregiving Mock Room above the door.",
        s2: "Go upstairs into 3rd floor, then go upstairs again into 4th floor, turn right, then turn left — you will find Caregiving Mock Room above the door.",
      },
      "3f": {
        s1: "Go upstairs into 4th floor, turn left, turn right, walk through the hallway — you will find Caregiving Mock Room above the door.",
        s2: "Go upstairs into 4th floor, turn right, then turn left — you will find Caregiving Mock Room above the door.",
      },
      "4f": {
        s1: "You're almost there! From the stairs turn left, turn right, walk through the hallway — you will find Caregiving Mock Room above the door.",
        s2: "You're almost there! From the stairs turn right, then turn left — you will find Caregiving Mock Room above the door.",
      },
    },

    "Midwifery Skills Lab": {
      gf: { s1: "Go upstairs into the 1st floor, after going inside turn left and go upstairs into the 2nd floor, go upstairs into 3rd floor, then go upstairs again into 4th floor, turn left, turn right, walk through the hallway, then turn right — you will find Midwifery Skills Lab above the door." },
      "1f": {
        s1: "Go upstairs into the 2nd floor, go upstairs into 3rd floor, then go upstairs again into 4th floor, turn left, turn right, walk through the hallway, then turn right — you will find Midwifery Skills Lab above the door.",
        s2: "Go upstairs into the 2nd floor, go upstairs into 3rd floor, then go upstairs again into 4th floor, turn right — you will find Midwifery Skills Lab above the door.",
      },
      "2f": {
        s1: "Go upstairs into 3rd floor, then go upstairs again into 4th floor, turn left, turn right, walk through the hallway, then turn right — you will find Midwifery Skills Lab above the door.",
        s2: "Go upstairs into 3rd floor, then go upstairs again into 4th floor, turn right — you will find Midwifery Skills Lab above the door.",
      },
      "3f": {
        s1: "Go upstairs into 4th floor, turn left, turn right, walk through the hallway, then turn right — you will find Midwifery Skills Lab above the door.",
        s2: "Go upstairs into 4th floor, turn right — you will find Midwifery Skills Lab above the door.",
      },
      "4f": {
        s1: "You're almost there! From the stairs turn left, turn right, walk through the hallway, then turn right — you will find Midwifery Skills Lab above the door.",
        s2: "You're almost there! From the stairs turn right — you will find Midwifery Skills Lab above the door.",
      },
    },

  }, // end main_building

  // ── NEW BUILDING (Potenciano Hall) ─────────────────────────────────────────
  // Single RFID entrance, two internal staircases.
  // Key: "any" for the RFID/1F entry point; "s1" / "s2" for the two internal stairs.
  new_building: {

    // ════ 1ST FLOOR ROOMS ════

    "Admission Office": {
      "1f": { any: "You're almost there! From the RFID turn left — at the end of the hallway you will see the Admission Office sign above the door." },
      "2f": {
        s1: "Go downstairs, turn right — you will see the Admission Office sign above the door.",
        s2: "Go downstairs, turn left, passing the RFID. At the far end of the hallway you will see the Admission Office sign above the door.",
      },
    },

    "Corporate Communication Office (CCO)": {
      "1f": { any: "You're almost there! From the RFID turn left — at the end of the hallway you will see the Corporate Communication Office (CCO) sign above the door." },
      "2f": {
        s1: "Go downstairs, turn right — you will see the Corporate Communication Office (CCO) sign above the door.",
        s2: "Go downstairs, turn left, passing the RFID. At the far end of the hallway you will see the Corporate Communication Office (CCO) sign above the door.",
      },
    },

    "SAHS Administrative Office": {
      "1f": { any: "You're almost there! From the RFID turn left — at the end of the hallway you will see the SAHS Administrative Office sign above the door." },
      "2f": {
        s1: "Go downstairs, turn right — you will see the SAHS Administrative Office sign above the door.",
        s2: "Go downstairs, turn left, passing the RFID. At the far end of the hallway you will see the SAHS Administrative Office sign above the door.",
      },
    },

    "Integrated Basic Education Department Principal Office": {
      "1f": { any: "You're almost there! From the RFID turn left — at the end of the hallway you will see the Integrated Basic Education Department Principal Office sign above the door." },
      "2f": {
        s1: "Go downstairs, turn right — you will see the Integrated Basic Education Department Principal Office sign above the door.",
        s2: "Go downstairs, turn left, passing the RFID. At the far end of the hallway you will see the Integrated Basic Education Department Principal Office sign above the door.",
      },
    },

    "Physical Therapy Clinic": {
      "1f": { any: "You're almost there! From the RFID turn right — you will see the Physical Therapy Clinic sign above the door." },
      "2f": {
        s1: "Go downstairs, turn right, pass the RFID in the hallway — you will see the Physical Therapy Clinic sign above the door at the other side of the building.",
        s2: "Go downstairs, turn left — you will see the Physical Therapy Clinic sign above the door.",
      },
    },

    "NB105 — Cashier / Registrar / Assessment": {
      "1f": { any: "You're almost there! From the RFID turn right — you will see the NB105 — Cashier / Registrar / Assessment sign above the door." },
      "2f": {
        s1: "Go downstairs, turn right, pass the RFID in the hallway — you will see the NB105 — Cashier / Registrar / Assessment sign above the door at the other side of the building.",
        s2: "Go downstairs, turn left — you will see the NB105 — Cashier / Registrar / Assessment sign above the door.",
      },
    },

    "NB106 — For Interview": {
      "1f": { any: "You're almost there! From the RFID turn right — you will see the NB106 — For Interview sign above the door." },
      "2f": {
        s1: "Go downstairs, turn right, pass the RFID in the hallway — you will see the NB106 — For Interview sign above the door at the other side of the building.",
        s2: "Go downstairs, turn left — you will see the NB106 — For Interview sign above the door.",
      },
    },

    // ════ 2ND FLOOR ROOMS ════

    "NB201": {
      "1f": { any: "There are two stairs from left and right. Go upstairs — you will see NB201 through the hallway." },
    },

    "NB202": {
      "1f": { any: "There are two stairs from left and right. Go upstairs — you will see NB202 through the hallway." },
    },

    "NB203": {
      "1f": { any: "There are two stairs from left and right. Go upstairs — you will see NB203 through the hallway." },
    },

    "NB204": {
      "1f": { any: "There are two stairs from left and right. Go upstairs — you will see NB204 through the hallway." },
    },

  }, // end new_building

  // ── EA TOWER HALL ──────────────────────────────────────────────────────────
  // GF accessible only via Staircase 1 (same structure as Main Building).
  ea_tower: {

    // ════ 1ST FLOOR ROOMS ════

    "Assessment Center Cookery NC II": {
      gf: { s1: "You're almost there! Go upstairs into the 1st floor — after turning right you will find the Assessment Center Cookery NC II." },
      "1f": {
        s1: "You're almost there! From the stairs turn right — you will see it.",
        s2: "You're almost there! From the stairs turn left — you will see it.",
      },
      "2f": {
        s1: "Go down the stairs into the 1st floor, turn right — you will see it.",
        s2: "Go down the stairs into the 1st floor, turn left — you will see it.",
      },
      "3f": {
        s1: "Go down the stairs into the 2nd floor, go down the stairs into the 1st floor, turn right — you will see it.",
        s2: "Go down the stairs into the 2nd floor, go down the stairs into the 1st floor, turn left — you will see it.",
      },
      "4f": {
        s1: "Go down the stairs into the 3rd floor, go down the stairs into the 2nd floor, go down the stairs into the 1st floor, turn right — you will see it.",
        s2: "Go down the stairs into the 3rd floor, go down the stairs into the 2nd floor, go down the stairs into the 1st floor, turn left — you will see it.",
      },
    },

    // ════ 2ND FLOOR ROOMS ════

    "Restaurant": {
      gf: { s1: "Go upstairs into the 1st floor, go upstairs again into the 2nd floor — you will find it after turning right." },
      "1f": {
        s1: "From the stairs, go upstairs into the 2nd floor, then turn right — you will see it.",
        s2: "This facility is not accessible via Staircase 2. Please use Staircase 1 (Front Entrance) instead.",
      },
      "2f": {
        s1: "You're almost there! Turn right — you will see it.",
        s2: "This facility is not accessible via Staircase 2. Please use Staircase 1 (Front Entrance) instead.",
      },
      "3f": {
        s1: "Go down the stairs into the 2nd floor, turn right — you will see it.",
        s2: "This facility is not accessible via Staircase 2. Please use Staircase 1 (Front Entrance) instead.",
      },
      "4f": {
        s1: "Go down the stairs into the 3rd floor, go down the stairs into the 2nd floor, go down the stairs into the 1st floor, turn right — you will see it.",
        s2: "This facility is not accessible via Staircase 2. Please use Staircase 1 (Front Entrance) instead.",
      },
    },

    // ════ 3RD FLOOR ROOMS ════

    "Room EA301": {
      gf: { s1: "Go upstairs into the 1st floor, go upstairs again into the 2nd floor, and again into the 3rd floor — you will find Room EA301 after turning right." },
      "1f": {
        s1: "Go upstairs into the 2nd floor, go upstairs again into the 3rd floor — you will find Room EA301 after turning right.",
        s2: "Go upstairs into the 2nd floor, go upstairs again into the 3rd floor, turn left — through the hallway you will find Room EA301.",
      },
      "2f": {
        s1: "Go upstairs into the 3rd floor, turn right — you will find Room EA301.",
        s2: "Go upstairs into the 3rd floor, turn left — through the hallway you will find Room EA301.",
      },
      "3f": {
        s1: "You're almost there! From the stairs turn right — you will find Room EA301.",
        s2: "You're almost there! From the stairs turn left — through the hallway you will find Room EA301.",
      },
      "4f": {
        s1: "Go down the stairs into the 3rd floor, turn right — you will find Room EA301.",
        s2: "Go down the stairs into the 3rd floor, turn left — through the hallway you will find Room EA301.",
      },
    },

    "Room EA302": {
      gf: { s1: "Go upstairs into the 1st floor, go upstairs again into the 2nd floor, and again into the 3rd floor — you will find Room EA302 after turning right." },
      "1f": {
        s1: "Go upstairs into the 2nd floor, go upstairs again into the 3rd floor — you will find Room EA302 after turning right.",
        s2: "Go upstairs into the 2nd floor, go upstairs again into the 3rd floor, turn left — through the hallway you will find Room EA302.",
      },
      "2f": {
        s1: "Go upstairs into the 3rd floor, turn right — you will find Room EA302.",
        s2: "Go upstairs into the 3rd floor, turn left — through the hallway you will find Room EA302.",
      },
      "3f": {
        s1: "You're almost there! From the stairs turn right — you will find Room EA302.",
        s2: "You're almost there! From the stairs turn left — through the hallway you will find Room EA302.",
      },
      "4f": {
        s1: "Go down the stairs into the 3rd floor, turn right — you will find Room EA302.",
        s2: "Go down the stairs into the 3rd floor, turn left — through the hallway you will find Room EA302.",
      },
    },

    "Room EA303": {
      gf: { s1: "Go upstairs into the 1st floor, go upstairs again into the 2nd floor, and again into the 3rd floor — you will find Room EA303 after turning right." },
      "1f": {
        s1: "Go upstairs into the 2nd floor, go upstairs again into the 3rd floor — you will find Room EA303 after turning right.",
        s2: "Go upstairs into the 2nd floor, go upstairs again into the 3rd floor, turn left — through the hallway you will find Room EA303.",
      },
      "2f": {
        s1: "Go upstairs into the 3rd floor, turn right — you will find Room EA303.",
        s2: "Go upstairs into the 3rd floor, turn left — through the hallway you will find Room EA303.",
      },
      "3f": {
        s1: "You're almost there! From the stairs turn right — you will find Room EA303.",
        s2: "You're almost there! From the stairs turn left — through the hallway you will find Room EA303.",
      },
      "4f": {
        s1: "Go down the stairs into the 3rd floor, turn right — you will find Room EA303.",
        s2: "Go down the stairs into the 3rd floor, turn left — through the hallway you will find Room EA303.",
      },
    },

    "Room EA304": {
      gf: { s1: "Go upstairs into the 1st floor, go upstairs again into the 2nd floor, and again into the 3rd floor — you will find Room EA304 after turning right." },
      "1f": {
        s1: "Go upstairs into the 2nd floor, go upstairs again into the 3rd floor — you will find Room EA304 after turning right.",
        s2: "Go upstairs into the 2nd floor, go upstairs again into the 3rd floor, turn left — through the hallway you will find Room EA304.",
      },
      "2f": {
        s1: "Go upstairs into the 3rd floor, turn right — you will find Room EA304.",
        s2: "Go upstairs into the 3rd floor, turn left — through the hallway you will find Room EA304.",
      },
      "3f": {
        s1: "You're almost there! From the stairs turn right — you will find Room EA304.",
        s2: "You're almost there! From the stairs turn left — through the hallway you will find Room EA304.",
      },
      "4f": {
        s1: "Go down the stairs into the 3rd floor, turn right — you will find Room EA304.",
        s2: "Go down the stairs into the 3rd floor, turn left — through the hallway you will find Room EA304.",
      },
    },

    "Room EA305": {
      gf: { s1: "Go upstairs into the 1st floor, go upstairs again into the 2nd floor, and again into the 3rd floor — you will find Room EA305 after turning right." },
      "1f": {
        s1: "Go upstairs into the 2nd floor, go upstairs again into the 3rd floor — you will find Room EA305 after turning right.",
        s2: "Go upstairs into the 2nd floor, go upstairs again into the 3rd floor, turn left — through the hallway you will find Room EA305.",
      },
      "2f": {
        s1: "Go upstairs into the 3rd floor, turn right — you will find Room EA305.",
        s2: "Go upstairs into the 3rd floor, turn left — through the hallway you will find Room EA305.",
      },
      "3f": {
        s1: "You're almost there! From the stairs turn right — you will find Room EA305.",
        s2: "You're almost there! From the stairs turn left — through the hallway you will find Room EA305.",
      },
      "4f": {
        s1: "Go down the stairs into the 3rd floor, turn right — you will find Room EA305.",
        s2: "Go down the stairs into the 3rd floor, turn left — through the hallway you will find Room EA305.",
      },
    },

    "Room EA306": {
      gf: { s1: "Go upstairs into the 1st floor, go upstairs again into the 2nd floor, and again into the 3rd floor — you will find Room EA306 after turning right." },
      "1f": {
        s1: "Go upstairs into the 2nd floor, go upstairs again into the 3rd floor — you will find Room EA306 after turning right.",
        s2: "Go upstairs into the 2nd floor, go upstairs again into the 3rd floor, turn left — through the hallway you will find Room EA306.",
      },
      "2f": {
        s1: "Go upstairs into the 3rd floor, turn right — you will find Room EA306.",
        s2: "Go upstairs into the 3rd floor, turn left — through the hallway you will find Room EA306.",
      },
      "3f": {
        s1: "You're almost there! From the stairs turn right — you will find Room EA306.",
        s2: "You're almost there! From the stairs turn left — through the hallway you will find Room EA306.",
      },
      "4f": {
        s1: "Go down the stairs into the 3rd floor, turn right — you will find Room EA306.",
        s2: "Go down the stairs into the 3rd floor, turn left — through the hallway you will find Room EA306.",
      },
    },

    "Room EA307": {
      gf: { s1: "Go upstairs into the 1st floor, go upstairs again into the 2nd floor, and again into the 3rd floor — you will find Room EA307 after turning right." },
      "1f": {
        s1: "Go upstairs into the 2nd floor, go upstairs again into the 3rd floor — you will find Room EA307 after turning right.",
        s2: "Go upstairs into the 2nd floor, go upstairs again into the 3rd floor, turn left — through the hallway you will find Room EA307.",
      },
      "2f": {
        s1: "Go upstairs into the 3rd floor, turn right — you will find Room EA307.",
        s2: "Go upstairs into the 3rd floor, turn left — through the hallway you will find Room EA307.",
      },
      "3f": {
        s1: "You're almost there! From the stairs turn right — you will find Room EA307.",
        s2: "You're almost there! From the stairs turn left — through the hallway you will find Room EA307.",
      },
      "4f": {
        s1: "Go down the stairs into the 3rd floor, turn right — you will find Room EA307.",
        s2: "Go down the stairs into the 3rd floor, turn left — through the hallway you will find Room EA307.",
      },
    },

    // ════ 4TH FLOOR ROOMS ════

    "Room EA401": {
      gf: { s1: "Go upstairs into the 1st floor, go upstairs again into the 2nd floor, go upstairs into the 3rd floor, go upstairs again into the 4th floor — you will find Room EA401 after turning right." },
      "1f": {
        s1: "Go upstairs into the 2nd floor, go upstairs into the 3rd floor, go upstairs again into the 4th floor — you will find Room EA401 after turning right.",
        s2: "Go upstairs into the 2nd floor, go upstairs into the 3rd floor, go upstairs again into the 4th floor, turn left — through the hallway you will find Room EA401.",
      },
      "2f": {
        s1: "Go upstairs into the 3rd floor, go upstairs again into the 4th floor, turn right — you will find Room EA401.",
        s2: "Go upstairs into the 3rd floor, go upstairs again into the 4th floor, turn left — through the hallway you will find Room EA401.",
      },
      "3f": {
        s1: "Go upstairs into the 4th floor, turn right — you will find Room EA401.",
        s2: "Go upstairs into the 4th floor, turn left — through the hallway you will find Room EA401.",
      },
      "4f": {
        s1: "You're almost there! From the stairs turn right — you will find Room EA401.",
        s2: "You're almost there! From the stairs turn left — through the hallway you will find Room EA401.",
      },
    },

    "Room EA402": {
      gf: { s1: "Go upstairs into the 1st floor, go upstairs again into the 2nd floor, go upstairs into the 3rd floor, go upstairs again into the 4th floor — you will find Room EA402 after turning right." },
      "1f": {
        s1: "Go upstairs into the 2nd floor, go upstairs into the 3rd floor, go upstairs again into the 4th floor — you will find Room EA402 after turning right.",
        s2: "Go upstairs into the 2nd floor, go upstairs into the 3rd floor, go upstairs again into the 4th floor, turn left — through the hallway you will find Room EA402.",
      },
      "2f": {
        s1: "Go upstairs into the 3rd floor, go upstairs again into the 4th floor, turn right — you will find Room EA402.",
        s2: "Go upstairs into the 3rd floor, go upstairs again into the 4th floor, turn left — through the hallway you will find Room EA402.",
      },
      "3f": {
        s1: "Go upstairs into the 4th floor, turn right — you will find Room EA402.",
        s2: "Go upstairs into the 4th floor, turn left — through the hallway you will find Room EA402.",
      },
      "4f": {
        s1: "You're almost there! From the stairs turn right — you will find Room EA402.",
        s2: "You're almost there! From the stairs turn left — through the hallway you will find Room EA402.",
      },
    },

    "Room EA403": {
      gf: { s1: "Go upstairs into the 1st floor, go upstairs again into the 2nd floor, go upstairs into the 3rd floor, go upstairs again into the 4th floor — you will find Room EA403 after turning right." },
      "1f": {
        s1: "Go upstairs into the 2nd floor, go upstairs into the 3rd floor, go upstairs again into the 4th floor — you will find Room EA403 after turning right.",
        s2: "Go upstairs into the 2nd floor, go upstairs into the 3rd floor, go upstairs again into the 4th floor, turn left — through the hallway you will find Room EA403.",
      },
      "2f": {
        s1: "Go upstairs into the 3rd floor, go upstairs again into the 4th floor, turn right — you will find Room EA403.",
        s2: "Go upstairs into the 3rd floor, go upstairs again into the 4th floor, turn left — through the hallway you will find Room EA403.",
      },
      "3f": {
        s1: "Go upstairs into the 4th floor, turn right — you will find Room EA403.",
        s2: "Go upstairs into the 4th floor, turn left — through the hallway you will find Room EA403.",
      },
      "4f": {
        s1: "You're almost there! From the stairs turn right — you will find Room EA403.",
        s2: "You're almost there! From the stairs turn left — through the hallway you will find Room EA403.",
      },
    },

    "Room EA404": {
      gf: { s1: "Go upstairs into the 1st floor, go upstairs again into the 2nd floor, go upstairs into the 3rd floor, go upstairs again into the 4th floor — you will find Room EA404 after turning right." },
      "1f": {
        s1: "Go upstairs into the 2nd floor, go upstairs into the 3rd floor, go upstairs again into the 4th floor — you will find Room EA404 after turning right.",
        s2: "Go upstairs into the 2nd floor, go upstairs into the 3rd floor, go upstairs again into the 4th floor, turn left — through the hallway you will find Room EA404.",
      },
      "2f": {
        s1: "Go upstairs into the 3rd floor, go upstairs again into the 4th floor, turn right — you will find Room EA404.",
        s2: "Go upstairs into the 3rd floor, go upstairs again into the 4th floor, turn left — through the hallway you will find Room EA404.",
      },
      "3f": {
        s1: "Go upstairs into the 4th floor, turn right — you will find Room EA404.",
        s2: "Go upstairs into the 4th floor, turn left — through the hallway you will find Room EA404.",
      },
      "4f": {
        s1: "You're almost there! From the stairs turn right — you will find Room EA404.",
        s2: "You're almost there! From the stairs turn left — through the hallway you will find Room EA404.",
      },
    },

    "Room EA405": {
      gf: { s1: "Go upstairs into the 1st floor, go upstairs again into the 2nd floor, go upstairs into the 3rd floor, go upstairs again into the 4th floor — you will find Room EA405 after turning right." },
      "1f": {
        s1: "Go upstairs into the 2nd floor, go upstairs into the 3rd floor, go upstairs again into the 4th floor — you will find Room EA405 after turning right.",
        s2: "Go upstairs into the 2nd floor, go upstairs into the 3rd floor, go upstairs again into the 4th floor, turn left — through the hallway you will find Room EA405.",
      },
      "2f": {
        s1: "Go upstairs into the 3rd floor, go upstairs again into the 4th floor, turn right — you will find Room EA405.",
        s2: "Go upstairs into the 3rd floor, go upstairs again into the 4th floor, turn left — through the hallway you will find Room EA405.",
      },
      "3f": {
        s1: "Go upstairs into the 4th floor, turn right — you will find Room EA405.",
        s2: "Go upstairs into the 4th floor, turn left — through the hallway you will find Room EA405.",
      },
      "4f": {
        s1: "You're almost there! From the stairs turn right — you will find Room EA405.",
        s2: "You're almost there! From the stairs turn left — through the hallway you will find Room EA405.",
      },
    },

    "Room EA406": {
      gf: { s1: "Go upstairs into the 1st floor, go upstairs again into the 2nd floor, go upstairs into the 3rd floor, go upstairs again into the 4th floor — you will find Room EA406 after turning right." },
      "1f": {
        s1: "Go upstairs into the 2nd floor, go upstairs into the 3rd floor, go upstairs again into the 4th floor — you will find Room EA406 after turning right.",
        s2: "Go upstairs into the 2nd floor, go upstairs into the 3rd floor, go upstairs again into the 4th floor, turn left — through the hallway you will find Room EA406.",
      },
      "2f": {
        s1: "Go upstairs into the 3rd floor, go upstairs again into the 4th floor, turn right — you will find Room EA406.",
        s2: "Go upstairs into the 3rd floor, go upstairs again into the 4th floor, turn left — through the hallway you will find Room EA406.",
      },
      "3f": {
        s1: "Go upstairs into the 4th floor, turn right — you will find Room EA406.",
        s2: "Go upstairs into the 4th floor, turn left — through the hallway you will find Room EA406.",
      },
      "4f": {
        s1: "You're almost there! From the stairs turn right — you will find Room EA406.",
        s2: "You're almost there! From the stairs turn left — through the hallway you will find Room EA406.",
      },
    },

    "Room EA407": {
      gf: { s1: "Go upstairs into the 1st floor, go upstairs again into the 2nd floor, go upstairs into the 3rd floor, go upstairs again into the 4th floor — you will find Room EA407 after turning right." },
      "1f": {
        s1: "Go upstairs into the 2nd floor, go upstairs into the 3rd floor, go upstairs again into the 4th floor — you will find Room EA407 after turning right.",
        s2: "Go upstairs into the 2nd floor, go upstairs into the 3rd floor, go upstairs again into the 4th floor, turn left — through the hallway you will find Room EA407.",
      },
      "2f": {
        s1: "Go upstairs into the 3rd floor, go upstairs again into the 4th floor, turn right — you will find Room EA407.",
        s2: "Go upstairs into the 3rd floor, go upstairs again into the 4th floor, turn left — through the hallway you will find Room EA407.",
      },
      "3f": {
        s1: "Go upstairs into the 4th floor, turn right — you will find Room EA407.",
        s2: "Go upstairs into the 4th floor, turn left — through the hallway you will find Room EA407.",
      },
      "4f": {
        s1: "You're almost there! From the stairs turn right — you will find Room EA407.",
        s2: "You're almost there! From the stairs turn left — through the hallway you will find Room EA407.",
      },
    },

    "Office": {
      gf: { s1: "Go upstairs into the 1st floor, go upstairs again into the 2nd floor, go upstairs into the 3rd floor, go upstairs again into the 4th floor — you will find the Office after turning right." },
      "1f": {
        s1: "Go upstairs into the 2nd floor, go upstairs into the 3rd floor, go upstairs again into the 4th floor — you will find the Office after turning right.",
        s2: "Go upstairs into the 2nd floor, go upstairs into the 3rd floor, go upstairs again into the 4th floor, turn left — through the hallway you will find the Office.",
      },
      "2f": {
        s1: "Go upstairs into the 3rd floor, go upstairs again into the 4th floor, turn right — you will find the Office.",
        s2: "Go upstairs into the 3rd floor, go upstairs again into the 4th floor, turn left — through the hallway you will find the Office.",
      },
      "3f": {
        s1: "Go upstairs into the 4th floor, turn right — you will find the Office.",
        s2: "Go upstairs into the 4th floor, turn left — through the hallway you will find the Office.",
      },
      "4f": {
        s1: "You're almost there! From the stairs turn right — you will find the Office.",
        s2: "You're almost there! From the stairs turn left — through the hallway you will find the Office.",
      },
    },

  }, // end ea_tower

  // ── SR BUILDING ────────────────────────────────────────────────────────────
  // Floors: GF, 2F, 3F  |  Staircases: S1, S2
  sr_building: {

    // ════ GROUND FLOOR ROOMS ════

    "College of Dentistry Simulation Lab 1": {
      gf: {
        s1: "You're almost there! From the stairs, turn right — through the hall you will find the Dentistry Simulation Lab 1.",
        s2: "You're almost there! From the stairs, turn left — through the hall you will find the Dentistry Simulation Lab 1.",
      },
      "2f": {
        s1: "From the stairs, go down the stairs, then turn left — through the hall you will find the Dentistry Simulation Lab 1.",
        s2: "From the stairs, go down the stairs, then turn right — through the hall you will find the Dentistry Simulation Lab 1.",
      },
      "3f": {
        s1: "From the stairs, go down into the 2nd floor, then go down again into the ground floor, then turn left — through the hall you will find the Dentistry Simulation Lab 1.",
        s2: "From the stairs, go down into the 2nd floor, then go down again into the ground floor, then turn right — through the hall you will find the Dentistry Simulation Lab 1.",
      },
    },

    "Dental Clinic": {
      gf: {
        s1: "You're almost there! From the stairs, turn right — through the hall you will find the Dental Clinic.",
        s2: "You're almost there! From the stairs, turn left — through the hall you will find the Dental Clinic.",
      },
      "2f": {
        s1: "From the stairs, go down the stairs, then turn left — through the hall you will find the Dental Clinic.",
        s2: "From the stairs, go down the stairs, then turn right — through the hall you will find the Dental Clinic.",
      },
      "3f": {
        s1: "From the stairs, go down into the 2nd floor, then go down again into the ground floor, then turn left — through the hall you will find the Dental Clinic.",
        s2: "From the stairs, go down into the 2nd floor, then go down again into the ground floor, then turn right — through the hall you will find the Dental Clinic.",
      },
    },

    "Office of the Dean (Dentistry)": {
      gf: {
        s1: "You're almost there! From the stairs, turn right — through the hall you will find the Office of the Dean.",
        s2: "You're almost there! From the stairs, turn left — through the hall you will find the Office of the Dean.",
      },
      "2f": {
        s1: "From the stairs, go down the stairs, then turn left — through the hall you will find the Office of the Dean.",
        s2: "From the stairs, go down the stairs, then turn right — through the hall you will find the Office of the Dean.",
      },
      "3f": {
        s1: "From the stairs, go down into the 2nd floor, then go down again into the ground floor, then turn left — through the hall you will find the Office of the Dean.",
        s2: "From the stairs, go down into the 2nd floor, then go down again into the ground floor, then turn right — through the hall you will find the Office of the Dean.",
      },
    },

    // ════ 2ND FLOOR ROOMS ════

    "Room 201": {
      gf: {
        s1: "From the stairs, go up into the 2nd floor, then turn left — through the hall you will find Room 201.",
        s2: "From the stairs, go up into the 2nd floor, then turn right — through the hall you will find Room 201.",
      },
      "2f": {
        s1: "You're almost there! From the stairs, turn left — through the hall you will find Room 201.",
        s2: "You're almost there! From the stairs, turn right — through the hall you will find Room 201.",
      },
      "3f": {
        s1: "From the stairs, go down into the 2nd floor, then turn right — through the hall you will find Room 201.",
        s2: "From the stairs, go down into the 2nd floor, then turn right — through the hall you will find Room 201.",
      },
    },

    "Room 202": {
      gf: {
        s1: "From the stairs, go up into the 2nd floor, then turn left — through the hall you will find Room 202.",
        s2: "From the stairs, go up into the 2nd floor, then turn right — through the hall you will find Room 202.",
      },
      "2f": {
        s1: "You're almost there! From the stairs, turn left — through the hall you will find Room 202.",
        s2: "You're almost there! From the stairs, turn right — through the hall you will find Room 202.",
      },
      "3f": {
        s1: "From the stairs, go down into the 2nd floor, then turn right — through the hall you will find Room 202.",
        s2: "From the stairs, go down into the 2nd floor, then turn right — through the hall you will find Room 202.",
      },
    },

    "SR Consultation Room": {
      gf: {
        s1: "From the stairs, go up into the 2nd floor, then turn left — through the hall you will find the Consultation Room.",
        s2: "From the stairs, go up into the 2nd floor, then turn right — through the hall you will find the Consultation Room.",
      },
      "2f": {
        s1: "You're almost there! From the stairs, turn left — through the hall you will find the Consultation Room.",
        s2: "You're almost there! From the stairs, turn right — through the hall you will find the Consultation Room.",
      },
      "3f": {
        s1: "From the stairs, go down into the 2nd floor, then turn right — through the hall you will find the Consultation Room.",
        s2: "From the stairs, go down into the 2nd floor, then turn right — through the hall you will find the Consultation Room.",
      },
    },

    "Office of the Dean": {
      gf: {
        s1: "From the stairs, go up into the 2nd floor, then turn left — through the hall you will find the Office of the Dean.",
        s2: "From the stairs, go up into the 2nd floor, then turn right — through the hall you will find the Office of the Dean.",
      },
      "2f": {
        s1: "You're almost there! From the stairs, turn left — through the hall you will find the Office of the Dean.",
        s2: "You're almost there! From the stairs, turn right — through the hall you will find the Office of the Dean.",
      },
      "3f": {
        s1: "From the stairs, go down into the 2nd floor, then turn right — through the hall you will find the Office of the Dean.",
        s2: "From the stairs, go down into the 2nd floor, then turn right — through the hall you will find the Office of the Dean.",
      },
    },

    "Faculty Office": {
      gf: {
        s1: "From the stairs, go up into the 2nd floor, then turn left — through the hall you will find the Faculty Office.",
        s2: "From the stairs, go up into the 2nd floor, then turn right — through the hall you will find the Faculty Office.",
      },
      "2f": {
        s1: "You're almost there! From the stairs, turn left — through the hall you will find the Faculty Office.",
        s2: "You're almost there! From the stairs, turn right — through the hall you will find the Faculty Office.",
      },
      "3f": {
        s1: "From the stairs, go down into the 2nd floor, then turn right — through the hall you will find the Faculty Office.",
        s2: "From the stairs, go down into the 2nd floor, then turn right — through the hall you will find the Faculty Office.",
      },
    },

    "Education Simulation": {
      gf: {
        s1: "From the stairs, go up into the 2nd floor, then turn left — through the hall you will find Education Simulation.",
        s2: "From the stairs, go up into the 2nd floor, then turn right — through the hall you will find Education Simulation.",
      },
      "2f": {
        s1: "You're almost there! From the stairs, turn left — through the hall you will find Education Simulation.",
        s2: "You're almost there! From the stairs, turn right — through the hall you will find Education Simulation.",
      },
      "3f": {
        s1: "From the stairs, go down into the 2nd floor, then turn right — through the hall you will find Education Simulation.",
        s2: "From the stairs, go down into the 2nd floor, then turn right — through the hall you will find Education Simulation.",
      },
    },

    // ════ 3RD FLOOR ROOMS ════

    "Room 301": {
      gf: {
        s1: "From the stairs, go up into the 2nd floor, then go up into the 3rd floor, turn left — through the hall you will find Room 301.",
        s2: "From the stairs, go up into the 2nd floor, then go up into the 3rd floor, turn left — through the hall you will find Room 301.",
      },
      "2f": {
        s1: "From the stairs, go up into the 3rd floor, then turn left — through the hall you will find Room 301.",
        s2: "From the stairs, go up into the 3rd floor, then turn right — through the hall you will find Room 301.",
      },
      "3f": {
        s1: "You're almost there! From the stairs, turn left — through the hall you will find Room 301.",
        s2: "You're almost there! From the stairs, turn right — through the hall you will find Room 301.",
      },
    },

    "Room 302": {
      gf: {
        s1: "From the stairs, go up into the 2nd floor, then go up into the 3rd floor, turn left — through the hall you will find Room 302.",
        s2: "From the stairs, go up into the 2nd floor, then go up into the 3rd floor, turn left — through the hall you will find Room 302.",
      },
      "2f": {
        s1: "From the stairs, go up into the 3rd floor, then turn left — through the hall you will find Room 302.",
        s2: "From the stairs, go up into the 3rd floor, then turn right — through the hall you will find Room 302.",
      },
      "3f": {
        s1: "You're almost there! From the stairs, turn left — through the hall you will find Room 302.",
        s2: "You're almost there! From the stairs, turn right — through the hall you will find Room 302.",
      },
    },

    "Room 303": {
      gf: {
        s1: "From the stairs, go up into the 2nd floor, then go up into the 3rd floor, turn left — through the hall you will find Room 303.",
        s2: "From the stairs, go up into the 2nd floor, then go up into the 3rd floor, turn left — through the hall you will find Room 303.",
      },
      "2f": {
        s1: "From the stairs, go up into the 3rd floor, then turn left — through the hall you will find Room 303.",
        s2: "From the stairs, go up into the 3rd floor, then turn right — through the hall you will find Room 303.",
      },
      "3f": {
        s1: "You're almost there! From the stairs, turn left — through the hall you will find Room 303.",
        s2: "You're almost there! From the stairs, turn right — through the hall you will find Room 303.",
      },
    },

    "Room 304": {
      gf: {
        s1: "From the stairs, go up into the 2nd floor, then go up into the 3rd floor, turn left — through the hall you will find Room 304.",
        s2: "From the stairs, go up into the 2nd floor, then go up into the 3rd floor, turn left — through the hall you will find Room 304.",
      },
      "2f": {
        s1: "From the stairs, go up into the 3rd floor, then turn left — through the hall you will find Room 304.",
        s2: "From the stairs, go up into the 3rd floor, then turn right — through the hall you will find Room 304.",
      },
      "3f": {
        s1: "You're almost there! From the stairs, turn left — through the hall you will find Room 304.",
        s2: "You're almost there! From the stairs, turn right — through the hall you will find Room 304.",
      },
    },

    "Psych Lab": {
      gf: {
        s1: "From the stairs, go up into the 2nd floor, then go up into the 3rd floor, turn left — through the hall you will find the Psych Lab.",
        s2: "From the stairs, go up into the 2nd floor, then go up into the 3rd floor, turn left — through the hall you will find the Psych Lab.",
      },
      "2f": {
        s1: "From the stairs, go up into the 3rd floor, then turn left — through the hall you will find the Psych Lab.",
        s2: "From the stairs, go up into the 3rd floor, then turn right — through the hall you will find the Psych Lab.",
      },
      "3f": {
        s1: "You're almost there! From the stairs, turn left — through the hall you will find the Psych Lab.",
        s2: "You're almost there! From the stairs, turn right — through the hall you will find the Psych Lab.",
      },
    },

  }, // end sr_building

  // ── KITCHEN HALL ──────────────────────────────────────────────────────────
  // Floors: GF, 2F, 3F  |  Single staircase — key: "any"
  kitchen_hall: {

    // ════ GROUND FLOOR ROOMS ════

    "Hot and Cold Kitchen": {
      gf: { any: "You're almost there! You can see the Hot and Cold Kitchen sign after arriving at the front of the building." },
      "2f": { any: "From the stairs, go down into the ground floor — you will see the Hot and Cold Kitchen sign at the front of the building." },
      "3f": { any: "From the stairs, go down into the 2nd floor, go down into the ground floor — you will see the Hot and Cold Kitchen sign at the front of the building." },
    },

    "Front Office": {
      gf: { any: "You're almost there! You can see the Front Office sign after arriving at the front of the building." },
      "2f": { any: "From the stairs, go down into the ground floor — you will see the Front Office sign at the front of the building." },
      "3f": { any: "From the stairs, go down into the 2nd floor, go down into the ground floor — you will see the Front Office sign at the front of the building." },
    },

    // ════ 2ND FLOOR ROOMS ════

    "Demonstration Room": {
      gf: { any: "From the stairs, go up into the 2nd floor — you will see the Demonstration Room sign above the door through the hall." },
      "2f": { any: "You're almost there! You can see the Demonstration Room sign through the hall." },
      "3f": { any: "From the stairs, go down into the 2nd floor — you will see the Demonstration Room sign through the hall." },
    },

    "Suite Room": {
      gf: { any: "From the stairs, go up into the 2nd floor — you will see the Suite Room sign above the door through the hall." },
      "2f": { any: "You're almost there! You can see the Suite Room sign through the hall." },
      "3f": { any: "From the stairs, go down into the 2nd floor — you will see the Suite Room sign through the hall." },
    },

    "Assessment Center Housekeeping NC II": {
      gf: { any: "From the stairs, go up into the 2nd floor — you will see the Assessment Center Housekeeping NC II sign above the door through the hall." },
      "2f": { any: "You're almost there! You can see the Assessment Center Housekeeping NC II sign through the hall." },
      "3f": { any: "From the stairs, go down into the 2nd floor — you will see the Assessment Center Housekeeping NC II sign through the hall." },
    },

    // ════ 3RD FLOOR ROOMS ════

    "Dean's Office": {
      gf: { any: "From the stairs, go up into the 2nd floor, go up into the 3rd floor — you will see the Dean's Office sign through the hall." },
      "2f": { any: "From the stairs, go up into the 3rd floor — you will see the Dean's Office sign above the door through the hall." },
      "3f": { any: "You're almost there! You can see the Dean's Office sign through the hall." },
    },

    "Assistant Dean's Office": {
      gf: { any: "From the stairs, go up into the 2nd floor, go up into the 3rd floor — you will see the Assistant Dean's Office sign through the hall." },
      "2f": { any: "From the stairs, go up into the 3rd floor — you will see the Assistant Dean's Office sign above the door through the hall." },
      "3f": { any: "You're almost there! You can see the Assistant Dean's Office sign through the hall." },
    },

    "KH Faculty Room": {
      gf: { any: "From the stairs, go up into the 2nd floor, go up into the 3rd floor — you will see the Faculty Room sign through the hall." },
      "2f": { any: "From the stairs, go up into the 3rd floor — you will see the Faculty Room sign above the door through the hall." },
      "3f": { any: "You're almost there! You can see the Faculty Room sign through the hall." },
    },

    "KH Consultation Room": {
      gf: { any: "From the stairs, go up into the 2nd floor, go up into the 3rd floor — you will see the Consultation Room sign through the hall." },
      "2f": { any: "From the stairs, go up into the 3rd floor — you will see the Consultation Room sign above the door through the hall." },
      "3f": { any: "You're almost there! You can see the Consultation Room sign through the hall." },
    },

    "HRM303": {
      gf: { any: "From the stairs, go up into the 2nd floor, go up into the 3rd floor — you will see the HRM303 sign through the hall." },
      "2f": { any: "From the stairs, go up into the 3rd floor — you will see the HRM303 sign above the door through the hall." },
      "3f": { any: "You're almost there! You can see the HRM303 sign through the hall." },
    },

  }, // end kitchen_hall

}; // end INDOOR_DIRECTIONS

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

  // Try exact staircase key, fall back to "any", then to s1 as last resort
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
