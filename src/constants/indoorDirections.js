// ─────────────────────────────────────────────────────────────────────────────
// WAYFINDER — Indoor Room Directions
//
// Structure per room:
//   directions[buildingId][roomName][fromFloor][staircaseKey] = "instruction string"
//
// Staircase keys:
//   "staircase_1" — Staircase 1 (Front/1st Entrance)
//   "staircase_2" — Staircase 2 (2nd Entrance)
//   "any"         — Single staircase / single entrance building (no picker needed)
//
// Floor keys: "gf" | "1f" | "2f" | "3f" | "4f"
//
// NOTE — Main Building GF:
//   Ground Floor is ONLY accessible via Staircase 1 (Front Entrance).
//   Staircase 2 has NO Ground Floor access.
//   GF entries therefore only carry the "staircase_1" key.
//
// Null entries = not yet filled in (UI will show a generic fallback message).
// ─────────────────────────────────────────────────────────────────────────────

export const INDOOR_DIRECTIONS = {

  // ── MAIN BUILDING ──────────────────────────────────────────────────────────
  main_building: {

    // ════ GROUND FLOOR ROOMS (staircase_1 only — Staircase 2 has no GF access) ════

    "School Clinic": {
      gf: { staircase_1: "You're almost there! Go in front of the building and head straight, then to your right you'll see the clinic sign above the door." },
      "1f": {
        staircase_1: "From the stairs, go down the stairs, go into the front of the building, head straight through the hallway. You will see to your right a clinic sign above the door.",
        staircase_2: "From the stairs, turn right and go straight until you see a way to the left and a stair. Turn left and go straight until you reach the stairs going downward. Go inside the underground-like hallway, go straight until you see a clinic sign above the door on your right.",
      },
      "2f": {
        staircase_1: "From the stairs, go down the stairs, go outside the building, go down the stairs again. Head into the front of the building, then go straight and look to your right until you find the clinic sign above the door.",
        staircase_2: "From the stairs, turn right, go straight until you reach a hallway to the left, a stairs in front of you, and a bathroom to your right. Turn left, go straight, then turn left, go down the stairs, turn left, go outside and go down the stairs. Go into the front of the building and head straight — you will see a clinic sign above the door to the right.",
      },
      "3f": {
        staircase_1: "From the stairs, go down into 2nd floor, go down into 1st floor, go outside and go down the stairs again. Head into the front of the building, then go straight and look to your right until you find the clinic sign above the door.",
        staircase_2: "From the stairs, turn right, go straight until you reach a hallway to the left, a stairs in front of you, and a bathroom to your right. Turn left, go straight, then turn left, go down into 2nd floor, go down the stairs, turn left, go outside and go down the stairs. Go into the front of the building and head straight — you will see a clinic sign above the door to the right.",
      },
      "4f": {
        staircase_1: "From the stairs, go down into 3rd floor, go down into 2nd floor, go down into 1st floor, go outside and go down the stairs again. Head into the front of the building, then go straight and look to your right until you find the clinic sign above the door.",
        staircase_2: "From the stairs, turn right, go straight until you reach a hallway to the left, a stairs in front of you, and a bathroom to your right. Turn left, go straight, then turn left, go down the stairs, go down the stairs, go down the stairs, turn left, go outside and go down the stairs. Go into the front of the building and head straight — you will see a clinic sign above the door to the right.",
      },
    },

    "Office of the Student Affairs": {
      gf: { staircase_1: "You're almost there! Go in front of the building and head straight, then to your left you'll see the Student Affairs sign above the door." },
      "1f": {
        staircase_1: "From the stairs, go down the stairs, go into the front of the building, head straight through the hallway. You will see to your left a Student Affairs sign above the door.",
        staircase_2: "From the stairs, turn right and go straight until you see a way to the left and a stair. Turn left and go straight until you reach the stairs going downward. Go inside the underground-like hallway, go straight until you see a Student Affairs sign above the door on your left.",
      },
      "2f": {
        staircase_1: "From the stairs, go down the stairs, go outside the building, go down the stairs again. Head into the front of the building, then go straight and look to your left until you find the Student Affairs sign above the door.",
        staircase_2: "From the stairs, turn right, go straight until you reach a hallway to the left, a stairs in front of you, and a bathroom to your right. Turn left, go straight, then turn left, go down the stairs, turn left, go outside and go down the stairs. Go into the front of the building and head straight — you will see a Student Affairs sign above the door to the left.",
      },
      "3f": {
        staircase_1: "From the stairs, go down into 2nd floor, go down into 1st floor, go outside and go down the stairs again. Head into the front of the building, then go straight and look to your left until you find the Student Affairs sign above the door.",
        staircase_2: "From the stairs, turn right, go straight until you reach a hallway to the left, a stairs in front, and a bathroom to your right. Turn left, go straight, then turn left, go down into 2nd floor, go down the stairs, turn left, go outside and go down the stairs. Go into the front of the building and head straight — you will see a Student Affairs sign above the door to the left.",
      },
      "4f": {
        staircase_1: "From the stairs, go down into 3rd floor, go down into 2nd floor, go down into 1st floor, go outside and go down the stairs again. Head into the front of the building, then go straight and look to your left until you find the Student Affairs sign above the door.",
        staircase_2: "From the stairs, turn right, go straight until you reach a hallway to the left, a stairs in front, and a bathroom to your right. Turn left, go straight, then turn left, go down the stairs, go down the stairs, go down the stairs, turn left, go outside and go down the stairs. Go into the front of the building and head straight — you will see a Student Affairs sign above the door to the left.",
      },
    },

    "SPS Office": {
      gf: { staircase_1: "You're almost there! Go in front of the building and head straight, then to your left you'll see the SPS Office sign above the door." },
      "1f": {
        staircase_1: "From the stairs, go down the stairs, go into the front of the building, head straight through the hallway. You will see to your left a SPS Office sign above the door.",
        staircase_2: "From the stairs, turn right and go straight until you see a way to the left and a stair. Turn left and go straight until you reach the stairs going downward. Go inside the underground-like hallway, go straight until you see a SPS Office sign above the door on your left.",
      },
      "2f": {
        staircase_1: "From the stairs, go down the stairs, go outside the building, go down the stairs again. Head into the front of the building, then go straight and look to your left until you find the SPS Office sign above the door.",
        staircase_2: "From the stairs, turn right, go straight until you reach a hallway to the left, a stairs in front, and a bathroom to your right. Turn left, go straight, then turn left, go down the stairs, turn left, go outside and go down the stairs. Go into the front of the building and head straight — you will see a SPS Office sign above the door to the left.",
      },
      "3f": {
        staircase_1: "From the stairs, go down into 2nd floor, go down into 1st floor, go outside and go down the stairs again. Head into the front of the building, then go straight and look to your left until you find the SPS Office sign above the door.",
        staircase_2: "From the stairs, turn right, go straight until you reach a hallway to the left, a stairs in front, and a bathroom to your right. Turn left, go straight, then turn left, go down into 2nd floor, go down the stairs, turn left, go outside and go down the stairs. Go into the front of the building and head straight — you will see a SPS Office sign above the door to the left.",
      },
      "4f": {
        staircase_1: "From the stairs, go down into 3rd floor, go down into 2nd floor, go down into 1st floor, go outside and go down the stairs again. Head into the front of the building, then go straight and look to your left until you find the SPS Office sign above the door.",
        staircase_2: "From the stairs, turn right, go straight until you reach a hallway to the left, a stairs in front, and a bathroom to your right. Turn left, go straight, then turn left, go down the stairs, go down the stairs, go down the stairs, turn left, go outside and go down the stairs. Go into the front of the building and head straight — you will see a SPS Office sign above the door to the left.",
      },
    },

    "Lyre Band Office": {
      gf: { staircase_1: "You're almost there! Go in front of the building and head straight, then to your left you'll see the Lyre Band Office sign above the door." },
      "1f": {
        staircase_1: "From the stairs, go down the stairs, go into the front of the building, head straight through the hallway. You will see to your left a Lyre Band Office sign above the door.",
        staircase_2: "From the stairs, turn right and go straight until you see a way to the left and a stair. Turn left and go straight until you reach the stairs going downward. Go inside the underground-like hallway, go straight until you see a Lyre Band Office sign above the door on your left.",
      },
      "2f": {
        staircase_1: "From the stairs, go down the stairs, go outside the building, go down the stairs again. Head into the front of the building, then go straight and look to your left until you find the Lyre Band Office sign above the door.",
        staircase_2: "From the stairs, turn right, go straight until you reach a hallway to the left, a stairs in front, and a bathroom to your right. Turn left, go straight, then turn left, go down the stairs, turn left, go outside and go down the stairs. Go into the front of the building and head straight — you will see a Lyre Band Office sign above the door to the left.",
      },
      "3f": {
        staircase_1: "From the stairs, go down into 2nd floor, go down into 1st floor, go outside and go down the stairs again. Head into the front of the building, then go straight and look to your left until you find the Lyre Band Office sign above the door.",
        staircase_2: "From the stairs, turn right, go straight until you reach a hallway to the left, a stairs in front, and a bathroom to your right. Turn left, go straight, then turn left, go down into 2nd floor, go down the stairs, turn left, go outside and go down the stairs. Go into the front of the building and head straight — you will see a Lyre Band Office sign above the door to the left.",
      },
      "4f": {
        staircase_1: "From the stairs, go down into 3rd floor, go down into 2nd floor, go down into 1st floor, go outside and go down the stairs again. Head into the front of the building, then go straight and look to your left until you find the Lyre Band Office sign above the door.",
        staircase_2: "From the stairs, turn right, go straight until you reach a hallway to the left, a stairs in front, and a bathroom to your right. Turn left, go straight, then turn left, go down the stairs, go down the stairs, go down the stairs, turn left, go outside and go down the stairs. Go into the front of the building and head straight — you will see a Lyre Band Office sign above the door to the left.",
      },
    },

    "Prefect of Discipline / Office of NSTP": {
      gf: { staircase_1: "You're almost there! Go in front of the building and head straight, then to your right you'll see the Prefect of Discipline / Office of NSTP sign above the door." },
      "1f": {
        staircase_1: "From the stairs, go down the stairs, go into the front of the building, head straight through the hallway. You will see to your right a Prefect of Discipline / Office of NSTP sign above the door.",
        staircase_2: "From the stairs, turn right and go straight until you see a way to the left and a stair. Turn left and go straight until you reach the stairs going downward. Go inside the underground-like hallway, go straight until you see a Prefect of Discipline / Office of NSTP sign above the door on your right.",
      },
      "2f": {
        staircase_1: "From the stairs, go down the stairs, go outside the building, go down the stairs again. Head into the front of the building, then go straight and look to your right until you find the Prefect of Discipline / Office of NSTP sign above the door.",
        staircase_2: "From the stairs, turn right, go straight until you reach a hallway to the left, a stairs in front, and a bathroom to your right. Turn left, go straight, then turn left, go down the stairs, turn left, go outside and go down the stairs. Go into the front of the building and head straight — you will see a Prefect of Discipline / Office of NSTP sign above the door to the right.",
      },
      "3f": {
        staircase_1: "From the stairs, go down into 2nd floor, go down into 1st floor, go outside and go down the stairs again. Head into the front of the building, then go straight and look to your right until you find the Prefect of Discipline / Office of NSTP sign above the door.",
        staircase_2: "From the stairs, turn right, go straight until you reach a hallway to the left, a stairs in front, and a bathroom to your right. Turn left, go straight, then turn left, go down into 2nd floor, go down the stairs, turn left, go outside and go down the stairs. Go into the front of the building and head straight — you will see a Prefect of Discipline / Office of NSTP sign above the door to the right.",
      },
      "4f": {
        staircase_1: "From the stairs, go down into 3rd floor, go down into 2nd floor, go down into 1st floor, go outside and go down the stairs again. Head into the front of the building, then go straight and look to your right until you find the Prefect of Discipline / Office of NSTP sign above the door.",
        staircase_2: "From the stairs, turn right, go straight until you reach a hallway to the left, a stairs in front, and a bathroom to your right. Turn left, go straight, then turn left, go down the stairs, go down the stairs, go down the stairs, turn left, go outside and go down the stairs. Go into the front of the building and head straight — you will see a Prefect of Discipline / Office of NSTP sign above the door to the right.",
      },
    },

    "Guidance Office": {
      gf: { staircase_1: "You're almost there! Go in front of the building and head straight, then to your left you'll see the Guidance Office sign above the door." },
      "1f": {
        staircase_1: "From the stairs, go down the stairs, go into the front of the building, head straight through the hallway. You will see to your left a Guidance Office sign above the door.",
        staircase_2: "From the stairs, turn right and go straight until you see a way to the left and a stair. Turn left and go straight until you reach the stairs going downward. Go inside the underground-like hallway, go straight until you see a Guidance Office sign above the door on your left.",
      },
      "2f": {
        staircase_1: "From the stairs, go down the stairs, go outside the building, go down the stairs again. Head into the front of the building, then go straight and look to your left until you find the Guidance Office sign above the door.",
        staircase_2: "From the stairs, turn right, go straight until you reach a hallway to the left, a stairs in front, and a bathroom to your right. Turn left, go straight, then turn left, go down the stairs, turn left, go outside and go down the stairs. Go into the front of the building and head straight — you will see a Guidance Office sign above the door to the left.",
      },
      "3f": {
        staircase_1: "From the stairs, go down into 2nd floor, go down into 1st floor, go outside and go down the stairs again. Head into the front of the building, then go straight and look to your left until you find the Guidance Office sign above the door.",
        staircase_2: "From the stairs, turn right, go straight until you reach a hallway to the left, a stairs in front, and a bathroom to your right. Turn left, go straight, then turn left, go down into 2nd floor, go down the stairs, turn left, go outside and go down the stairs. Go into the front of the building and head straight — you will see a Guidance Office sign above the door to the left.",
      },
      "4f": {
        staircase_1: "From the stairs, go down into 3rd floor, go down into 2nd floor, go down into 1st floor, go outside and go down the stairs again. Head into the front of the building, then go straight and look to your left until you find the Guidance Office sign above the door.",
        staircase_2: "From the stairs, turn right, go straight until you reach a hallway to the left, a stairs in front, and a bathroom to your right. Turn left, go straight, then turn left, go down the stairs, go down the stairs, go down the stairs, turn left, go outside and go down the stairs. Go into the front of the building and head straight — you will see a Guidance Office sign above the door to the left.",
      },
    },

    "Counseling Room": {
      gf: { staircase_1: "You're almost there! Go in front of the building and head straight, then to your left you'll see the Counseling Room sign above the door." },
      "1f": {
        staircase_1: "From the stairs, go down the stairs, go into the front of the building, head straight through the hallway. You will see to your left a Counseling Room sign above the door.",
        staircase_2: "From the stairs, turn right and go straight until you see a way to the left and a stair. Turn left and go straight until you reach the stairs going downward. Go inside the underground-like hallway, go straight until you see a Counseling Room sign above the door on your left.",
      },
      "2f": {
        staircase_1: "From the stairs, go down the stairs, go outside the building, go down the stairs again. Head into the front of the building, then go straight and look to your left until you find the Counseling Room sign above the door.",
        staircase_2: "From the stairs, turn right, go straight until you reach a hallway to the left, a stairs in front, and a bathroom to your right. Turn left, go straight, then turn left, go down the stairs, turn left, go outside and go down the stairs. Go into the front of the building and head straight — you will see a Counseling Room sign above the door to the left.",
      },
      "3f": {
        staircase_1: "From the stairs, go down into 2nd floor, go down into 1st floor, go outside and go down the stairs again. Head into the front of the building, then go straight and look to your left until you find the Counseling Room sign above the door.",
        staircase_2: "From the stairs, turn right, go straight until you reach a hallway to the left, a stairs in front, and a bathroom to your right. Turn left, go straight, then turn left, go down into 2nd floor, go down the stairs, turn left, go outside and go down the stairs. Go into the front of the building and head straight — you will see a Counseling Room sign above the door to the left.",
      },
      "4f": {
        staircase_1: "From the stairs, go down into 3rd floor, go down into 2nd floor, go down into 1st floor, go outside and go down the stairs again. Head into the front of the building, then go straight and look to your left until you find the Counseling Room sign above the door.",
        staircase_2: "From the stairs, turn right, go straight until you reach a hallway to the left, a stairs in front, and a bathroom to your right. Turn left, go straight, then turn left, go down the stairs, go down the stairs, go down the stairs, turn left, go outside and go down the stairs. Go into the front of the building and head straight — you will see a Counseling Room sign above the door to the left.",
      },
    },

    "Testing Center & Sports and Cultural Affairs / Psychological Interpretation": {
      gf: { staircase_1: "You're almost there! Go in front of the building and head straight, then to your left you'll see the Testing Center & Sports and Cultural Affairs / Psychological Interpretation sign above the door." },
      "1f": {
        staircase_1: "From the stairs, go down the stairs, go into the front of the building, head straight through the hallway. You will see to your left a Testing Center & Sports and Cultural Affairs / Psychological Interpretation sign above the door.",
        staircase_2: "From the stairs, turn right and go straight until you see a way to the left and a stair. Turn left and go straight until you reach the stairs going downward. Go inside the underground-like hallway, go straight until you see a Testing Center & Sports and Cultural Affairs / Psychological Interpretation sign above the door on your left.",
      },
      "2f": {
        staircase_1: "From the stairs, go down the stairs, go outside the building, go down the stairs again. Head into the front of the building, then go straight and look to your left until you find the Testing Center & Sports and Cultural Affairs / Psychological Interpretation sign above the door.",
        staircase_2: "From the stairs, turn right, go straight until you reach a hallway to the left, a stairs in front, and a bathroom to your right. Turn left, go straight, then turn left, go down the stairs, turn left, go outside and go down the stairs. Go into the front of the building and head straight — you will see a Testing Center & Sports and Cultural Affairs / Psychological Interpretation sign above the door to the left.",
      },
      "3f": {
        staircase_1: "From the stairs, go down into 2nd floor, go down into 1st floor, go outside and go down the stairs again. Head into the front of the building, then go straight and look to your left until you find the Testing Center & Sports and Cultural Affairs / Psychological Interpretation sign above the door.",
        staircase_2: "From the stairs, turn right, go straight until you reach a hallway to the left, a stairs in front, and a bathroom to your right. Turn left, go straight, then turn left, go down into 2nd floor, go down the stairs, turn left, go outside and go down the stairs. Go into the front of the building and head straight — you will see a Testing Center & Sports and Cultural Affairs / Psychological Interpretation sign above the door to the left.",
      },
      "4f": {
        staircase_1: "From the stairs, go down into 3rd floor, go down into 2nd floor, go down into 1st floor, go outside and go down the stairs again. Head into the front of the building, then go straight and look to your left until you find the Testing Center & Sports and Cultural Affairs / Psychological Interpretation sign above the door.",
        staircase_2: "From the stairs, turn right, go straight until you reach a hallway to the left, a stairs in front, and a bathroom to your right. Turn left, go straight, then turn left, go down the stairs, go down the stairs, go down the stairs, turn left, go outside and go down the stairs. Go into the front of the building and head straight — you will see a Testing Center & Sports and Cultural Affairs / Psychological Interpretation sign above the door to the left.",
      },
    },

    "ICT / MIS Office": {
      gf: { staircase_1: "You're almost there! Go in front of the building and head straight, then to your right you'll see the ICT / MIS Office sign above the door." },
      "1f": {
        staircase_1: "From the stairs, go down the stairs, go into the front of the building, head straight through the hallway. You will see to your right a ICT / MIS Office sign above the door.",
        staircase_2: "From the stairs, turn right and go straight until you see a way to the left and a stair. Turn left and go straight until you reach the stairs going downward. Go inside the underground-like hallway, go straight until you see a ICT / MIS Office sign above the door on your right.",
      },
      "2f": {
        staircase_1: "From the stairs, go down into 1st floor, go outside the building, go down the stairs again. Head into the front of the building, then go straight and look to your right until you find the ICT / MIS Office sign above the door.",
        staircase_2: "From the stairs, go down into 1st floor, turn right, go straight until you reach a hallway to the left, a stairs in front, and a bathroom to your right. Turn left, go straight, then turn left, go down the stairs, turn left, go outside and go down the stairs. Go into the front of the building and head straight — you will see a ICT / MIS Office sign above the door to the right.",
      },
      "3f": {
        staircase_1: "From the stairs, go down into 2nd floor, go down into 1st floor, go outside and go down the stairs again. Head into the front of the building, then go straight and look to your right until you find the ICT / MIS Office sign above the door.",
        staircase_2: "From the stairs, go down into 2nd floor, go down into 1st floor, turn right, go straight until you reach a hallway to the left, a stairs in front, and a bathroom to your right. Turn left, go straight, then turn left, go down into 2nd floor, go down the stairs, turn left, go outside and go down the stairs. Go into the front of the building and head straight — you will see a ICT / MIS Office sign above the door to the right.",
      },
      "4f": {
        staircase_1: "From the stairs, go down into 3rd floor, go down into 2nd floor, go down into 1st floor, go outside and go down the stairs again. Head into the front of the building, then go straight and look to your right until you find the ICT / MIS Office sign above the door.",
        staircase_2: "From the stairs, go down into 3rd floor, go down into 2nd floor, go down into 1st floor, turn right, go straight until you reach a hallway to the left, a stairs in front, and a bathroom to your right. Turn left, go straight, then turn left, go down the stairs, go down the stairs, go down the stairs, turn left, go outside and go down the stairs. Go into the front of the building and head straight — you will see a ICT / MIS Office sign above the door to the right.",
      },
    },

    // ════ 1ST FLOOR ROOMS ════

    "Quality Assurance Office": {
      gf: { staircase_1: "Go upstairs, turn left, head straight into the hallway — the Quality Assurance Office is at the far end. You will see the Quality Assurance Office sign on the door to the left." },
      "1f": {
        staircase_1: "You're almost there! From the stairs turn left, head straight — it is in the far end. You will see Quality Assurance Office sign on the door to the left.",
        staircase_2: "You're almost there! From the entrance, head straight until you see a stair. Don't go up — you will see 2 doors on your right side. One of them has a Quality Assurance Office sign on the door.",
      },
      "2f": {
        staircase_1: "From the stairs, go down into the 1st floor, turn left, then turn right into the hallway, head straight — it is in the far end. You will see Quality Assurance Office sign on the door to the left.",
        staircase_2: "From the stairs, go down into the 1st floor, turn right, head straight until you see a stair. Don't go up — you will see 2 doors on your right side. One of them has a Quality Assurance Office sign on the door.",
      },
      "3f": {
        staircase_1: "From the stairs, go down into the 2nd floor, go down into the 1st floor, turn left, then turn right into the hallway, head straight — it is in the far end. You will see Quality Assurance Office sign on the door to the left.",
        staircase_2: "From the stairs, go down into the 2nd floor, go down into the 1st floor, turn right, head straight until you see a stair. Don't go up — you will see 2 doors on your right side. One of them has a Quality Assurance Office sign on the door.",
      },
      "4f": {
        staircase_1: "From the stairs, go down into the 3rd floor, go down into the 2nd floor, go down into the 1st floor, turn left, then turn right into the hallway, head straight — it is in the far end. You will see Quality Assurance Office sign on the door to the left.",
        staircase_2: "From the stairs, go down into the 3rd floor, go down into the 2nd floor, go down into the 1st floor, turn right, head straight until you see a stair. Don't go up — you will see 2 doors on your right side. One of them has a Quality Assurance Office sign on the door.",
      },
    },

    "Administrative Affairs Office": {
      gf: { staircase_1: "Go upstairs, turn left, head straight into the hallway — at the far end you will see the Administrative Affairs Office sign above the door to the left." },
      "1f": {
        staircase_1: "You're almost there! From the stairs turn left, head straight — it is in the far end. You will see Administrative Affairs Office sign on the door to the left.",
        staircase_2: "You're almost there! From the entrance, head straight until you see a stair. Don't go up — you will see 2 doors on your right side. One of them has an Administrative Affairs Office sign on the door.",
      },
      "2f": {
        staircase_1: "From the stairs, go down into the 1st floor, turn left, then turn right into the hallway, head straight — it is in the far end. You will see Administrative Affairs Office sign on the door to the left.",
        staircase_2: "From the stairs, go down into the 1st floor, turn right, head straight until you see a stair. Don't go up — you will see 2 doors on your right side. One of them has an Administrative Affairs Office sign on the door.",
      },
      "3f": {
        staircase_1: "From the stairs, go down into the 2nd floor, go down into the 1st floor, turn left, then turn right into the hallway, head straight — it is in the far end. You will see Administrative Affairs Office sign on the door to the left.",
        staircase_2: "From the stairs, go down into the 2nd floor, go down into the 1st floor, turn right, head straight until you see a stair. Don't go up — you will see 2 doors on your right side. One of them has an Administrative Affairs Office sign on the door.",
      },
      "4f": {
        staircase_1: "From the stairs, go down into the 3rd floor, go down into the 2nd floor, go down into the 1st floor, turn left, then turn right into the hallway, head straight — it is in the far end. You will see Administrative Affairs Office sign on the door to the left.",
        staircase_2: "From the stairs, go down into the 3rd floor, go down into the 2nd floor, go down into the 1st floor, turn right, head straight until you see a stair. Don't go up — you will see 2 doors on your right side. One of them has an Administrative Affairs Office sign on the door.",
      },
    },

    "AVR": {
      gf: { staircase_1: "Go upstairs, turn left, head straight into the hallway until the far end, then turn right — you will see the AVR sign above the door." },
      "1f": {
        staircase_1: "You're almost there! From the stairs turn left, head straight into the hallway until the far end, then turn right — you will see the AVR sign above the door.",
        staircase_2: "You're almost there! From the entrance, head straight until you see AVR above the door to your left.",
      },
      "2f": {
        staircase_1: "From the stairs, go down into the 1st floor, turn left, then turn right into the hallway, head straight until the far end, then turn right — you will see the AVR sign above the door.",
        staircase_2: "From the stairs, go down into the 1st floor, turn right, head straight until you see AVR above the door to your left.",
      },
      "3f": {
        staircase_1: "From the stairs, go down into the 2nd floor, go down into the 1st floor, turn left, then turn right into the hallway, head straight until the far end, then turn right — you will see the AVR sign above the door.",
        staircase_2: "From the stairs, go down into the 2nd floor, go down into the 1st floor, turn right, head straight until you see AVR above the door to your left.",
      },
      "4f": {
        staircase_1: "From the stairs, go down into the 3rd floor, go down into the 2nd floor, go down into the 1st floor, turn left, then turn right into the hallway, head straight until the far end, then turn right — you will see the AVR sign above the door.",
        staircase_2: "From the stairs, go down into the 3rd floor, go down into the 2nd floor, go down into the 1st floor, turn right, head straight until you see AVR above the door to your left.",
      },
    },

    "Anatomy Lab": {
      gf: { staircase_1: "Go upstairs, turn left, head straight into the hallway until the far end, then turn right — you will see the Anatomy Lab sign above the door." },
      "1f": {
        staircase_1: "You're almost there! From the stairs turn left, head straight into the hallway until the far end, then turn right — you will see the Anatomy Lab sign above the door.",
        staircase_2: "You're almost there! From the entrance, head straight until you see an Anatomy Lab sign above the door.",
      },
      "2f": {
        staircase_1: "From the stairs, go down into the 1st floor, turn left, then turn right into the hallway, head straight until the far end, then turn right — you will see the Anatomy Lab sign above the door.",
        staircase_2: "From the stairs, go down into the 1st floor, turn right, head straight until you see an Anatomy Lab sign above the door.",
      },
      "3f": {
        staircase_1: "From the stairs, go down into the 2nd floor, go down into the 1st floor, turn left, then turn right into the hallway, head straight until the far end, then turn right — you will see the Anatomy Lab sign above the door.",
        staircase_2: "From the stairs, go down into the 2nd floor, go down into the 1st floor, turn right, head straight until you see an Anatomy Lab sign above the door.",
      },
      "4f": {
        staircase_1: "From the stairs, go down into the 3rd floor, go down into the 2nd floor, go down into the 1st floor, turn left, then turn right into the hallway, head straight until the far end, then turn right — you will see the Anatomy Lab sign above the door.",
        staircase_2: "From the stairs, go down into the 3rd floor, go down into the 2nd floor, go down into the 1st floor, turn right, head straight until you see an Anatomy Lab sign above the door.",
      },
    },

    "Chemistry Lab": {
      gf: { staircase_1: "Go upstairs, turn left, head straight into the hallway until the far end, then turn right — you will see the Chemistry Lab sign above the door." },
      "1f": {
        staircase_1: "You're almost there! From the stairs turn left, head straight into the hallway until the far end, then turn right — you will see the Chemistry Lab sign above the door.",
        staircase_2: "You're almost there! From the entrance, head straight until you see a Chemistry Lab sign above the door.",
      },
      "2f": {
        staircase_1: "From the stairs, go down into the 1st floor, turn left, then turn right into the hallway, head straight until the far end, then turn right — you will see the Chemistry Lab sign above the door.",
        staircase_2: "From the stairs, go down into the 1st floor, turn right, head straight until you see a Chemistry Lab sign above the door.",
      },
      "3f": {
        staircase_1: "From the stairs, go down into the 2nd floor, go down into the 1st floor, turn left, then turn right into the hallway, head straight until the far end, then turn right — you will see the Chemistry Lab sign above the door.",
        staircase_2: "From the stairs, go down into the 2nd floor, go down into the 1st floor, turn right, head straight until you see a Chemistry Lab sign above the door.",
      },
      "4f": {
        staircase_1: "From the stairs, go down into the 3rd floor, go down into the 2nd floor, go down into the 1st floor, turn left, then turn right into the hallway, head straight until the far end, then turn right — you will see the Chemistry Lab sign above the door.",
        staircase_2: "From the stairs, go down into the 3rd floor, go down into the 2nd floor, go down into the 1st floor, turn right, head straight until you see a Chemistry Lab sign above the door.",
      },
    },

    "Academic Office": {
      gf: { staircase_1: "Go upstairs, turn left, head straight into the hallway — you will see the Academic Office sign above the door." },
      "1f": {
        staircase_1: "You're almost there! From the stairs turn left, head straight — it is in the far end. You will see Academic Office sign above the door.",
        staircase_2: "You're almost there! From the entrance, head straight until you see a stair. Turn left — you will see the Academic Office sign above the door.",
      },
      "2f": {
        staircase_1: "From the stairs, go down into the 1st floor, turn left, then turn right into the hallway, head straight — it is in the far end. You will see Academic Office sign above the door.",
        staircase_2: "From the stairs, go down into the 1st floor, turn right, head straight until you see a stair. Turn left — you will see an Academic Office sign above the door.",
      },
      "3f": {
        staircase_1: "From the stairs, go down into the 2nd floor, go down into the 1st floor, turn left, then turn right into the hallway, head straight — it is in the far end. You will see Academic Office sign above the door.",
        staircase_2: "From the stairs, go down into the 2nd floor, go down into the 1st floor, turn right, head straight until you see a stair. Turn left — you will see an Academic Office sign above the door.",
      },
      "4f": {
        staircase_1: "From the stairs, go down into the 3rd floor, go down into the 2nd floor, go down into the 1st floor, turn left, then turn right into the hallway, head straight — it is in the far end. You will see Academic Office sign above the door.",
        staircase_2: "From the stairs, go down into the 3rd floor, go down into the 2nd floor, go down into the 1st floor, turn right, head straight until you see a stair. Turn left — you will see an Academic Office sign above the door.",
      },
    },

    "Office of the President": {
      gf: { staircase_1: "Go upstairs, turn left, head straight into the hallway — you will see the Office of the President sign above the door." },
      "1f": {
        staircase_1: "You're almost there! From the stairs turn left, head straight — it is in the far end. You will see Office of the President sign above the door.",
        staircase_2: "You're almost there! From the entrance, head straight until you see a stair. Turn left — you will see the Office of the President sign above the door.",
      },
      "2f": {
        staircase_1: "From the stairs, go down into the 1st floor, turn left, then turn right into the hallway, head straight — it is in the far end. You will see Office of the President sign above the door.",
        staircase_2: "From the stairs, go down into the 1st floor, turn right, head straight until you see a stair. Turn left — you will see an Office of the President sign above the door.",
      },
      "3f": {
        staircase_1: "From the stairs, go down into the 2nd floor, go down into the 1st floor, turn left, then turn right into the hallway, head straight — it is in the far end. You will see Office of the President sign above the door.",
        staircase_2: "From the stairs, go down into the 2nd floor, go down into the 1st floor, turn right, head straight until you see a stair. Turn left — you will see an Office of the President sign above the door.",
      },
      "4f": {
        staircase_1: "From the stairs, go down into the 3rd floor, go down into the 2nd floor, go down into the 1st floor, turn left, then turn right into the hallway, head straight — it is in the far end. You will see Office of the President sign above the door.",
        staircase_2: "From the stairs, go down into the 3rd floor, go down into the 2nd floor, go down into the 1st floor, turn right, head straight until you see a stair. Turn left — you will see an Office of the President sign above the door.",
      },
    },

    "Record Section — Window 2 (BSHRM, 2-Year HRM, BSTourism, Caregiving)": {
      gf: { staircase_1: "Go upstairs, turn left, head straight into the hallway — you will see the Record Section — Window 2 sign on the counters." },
      "1f": {
        staircase_1: "You're almost there! From the stairs turn left, head straight — you will see Record Section — Window 2 sign on the counters.",
        staircase_2: "You're almost there! From the entrance, head straight until you see a stair. Turn left — you will see the Record Section — Window 2 sign on the counters.",
      },
      "2f": {
        staircase_1: "From the stairs, go down into the 1st floor, turn left, then turn right into the hallway, head straight — it is in the far end. You will see Record Section — Window 2 sign on the counters.",
        staircase_2: "From the stairs, go down into the 1st floor, turn right, head straight until you see a stair. Turn left — you will see a Record Section — Window 2 sign on the counters.",
      },
      "3f": {
        staircase_1: "From the stairs, go down into the 2nd floor, go down into the 1st floor, turn left, then turn right into the hallway, head straight — you will see Record Section — Window 2 sign on the counters.",
        staircase_2: "From the stairs, go down into the 2nd floor, go down into the 1st floor, turn right, head straight until you see a stair. Turn left — you will see a Record Section — Window 2 sign on the counters.",
      },
      "4f": {
        staircase_1: "From the stairs, go down into the 3rd floor, go down into the 2nd floor, go down into the 1st floor, turn left, then turn right into the hallway, head straight — you will see Record Section — Window 2 sign on the counters.",
        staircase_2: "From the stairs, go down into the 3rd floor, go down into the 2nd floor, go down into the 1st floor, turn right, head straight until you see a stair. Turn left — you will see a Record Section — Window 2 sign on the counters.",
      },
    },

    "Window 3": {
      gf: { staircase_1: "Go upstairs, turn left, head straight into the hallway — you will see the Window 3 sign on the counters." },
      "1f": {
        staircase_1: "You're almost there! From the stairs turn left, head straight — you will see Window 3 sign on the counters.",
        staircase_2: "You're almost there! From the entrance, head straight until you see a stair. Turn left — you will see the Window 3 sign on the counters.",
      },
      "2f": {
        staircase_1: "From the stairs, go down into the 1st floor, turn left, then turn right into the hallway, head straight — it is in the far end. You will see Window 3 sign on the counters.",
        staircase_2: "From the stairs, go down into the 1st floor, turn right, head straight until you see a stair. Turn left — you will see a Window 3 sign on the counters.",
      },
      "3f": {
        staircase_1: "From the stairs, go down into the 2nd floor, go down into the 1st floor, turn left, then turn right into the hallway, head straight — you will see Window 3 sign on the counters.",
        staircase_2: "From the stairs, go down into the 2nd floor, go down into the 1st floor, turn right, head straight until you see a stair. Turn left — you will see a Window 3 sign on the counters.",
      },
      "4f": {
        staircase_1: "From the stairs, go down into the 3rd floor, go down into the 2nd floor, go down into the 1st floor, turn left, then turn right into the hallway, head straight — you will see Window 3 sign on the counters.",
        staircase_2: "From the stairs, go down into the 3rd floor, go down into the 2nd floor, go down into the 1st floor, turn right, head straight until you see a stair. Turn left — you will see a Window 3 sign on the counters.",
      },
    },

    "Registrar Office — Window 5": {
      gf: { staircase_1: "Go upstairs, turn left, head straight into the hallway — you will see the Registrar Office — Window 5 sign on the counters." },
      "1f": {
        staircase_1: "You're almost there! From the stairs turn left, head straight — you will see Registrar Office — Window 5 sign on the counters.",
        staircase_2: "You're almost there! From the entrance, head straight until you see a stair. Turn left — you will see the Registrar Office — Window 5 sign on the counters.",
      },
      "2f": {
        staircase_1: "From the stairs, go down into the 1st floor, turn left, then turn right into the hallway, head straight — it is in the far end. You will see Registrar Office — Window 5 sign on the counters.",
        staircase_2: "From the stairs, go down into the 1st floor, turn right, head straight until you see a stair. Turn left — you will see a Registrar Office — Window 5 sign on the counters.",
      },
      "3f": {
        staircase_1: "From the stairs, go down into the 2nd floor, go down into the 1st floor, turn left, then turn right into the hallway, head straight — you will see Registrar Office — Window 5 sign on the counters.",
        staircase_2: "From the stairs, go down into the 2nd floor, go down into the 1st floor, turn right, head straight until you see a stair. Turn left — you will see a Registrar Office — Window 5 sign on the counters.",
      },
      "4f": {
        staircase_1: "From the stairs, go down into the 3rd floor, go down into the 2nd floor, go down into the 1st floor, turn left, then turn right into the hallway, head straight — you will see Registrar Office — Window 5 sign on the counters.",
        staircase_2: "From the stairs, go down into the 3rd floor, go down into the 2nd floor, go down into the 1st floor, turn right, head straight until you see a stair. Turn left — you will see a Registrar Office — Window 5 sign on the counters.",
      },
    },

    "Cashier — Window 6": {
      gf: { staircase_1: "Go upstairs, turn left, head straight into the hallway — you will see the Cashier — Window 6 sign on the counters." },
      "1f": {
        staircase_1: "You're almost there! From the stairs turn left, head straight — you will see Cashier — Window 6 sign on the counters.",
        staircase_2: "You're almost there! From the entrance, head straight until you see a stair. Turn left — you will see the Cashier — Window 6 sign on the counters.",
      },
      "2f": {
        staircase_1: "From the stairs, go down into the 1st floor, turn left, then turn right into the hallway, head straight — it is in the far end. You will see Cashier — Window 6 sign on the counters.",
        staircase_2: "From the stairs, go down into the 1st floor, turn right, head straight until you see a stair. Turn left — you will see a Cashier — Window 6 sign on the counters.",
      },
      "3f": {
        staircase_1: "From the stairs, go down into the 2nd floor, go down into the 1st floor, turn left, then turn right into the hallway, head straight — you will see Cashier — Window 6 sign on the counters.",
        staircase_2: "From the stairs, go down into the 2nd floor, go down into the 1st floor, turn right, head straight until you see a stair. Turn left — you will see a Cashier — Window 6 sign on the counters.",
      },
      "4f": {
        staircase_1: "From the stairs, go down into the 3rd floor, go down into the 2nd floor, go down into the 1st floor, turn left, then turn right into the hallway, head straight — you will see Cashier — Window 6 sign on the counters.",
        staircase_2: "From the stairs, go down into the 3rd floor, go down into the 2nd floor, go down into the 1st floor, turn right, head straight until you see a stair. Turn left — you will see a Cashier — Window 6 sign on the counters.",
      },
    },

    "Assessment — Window 8 (BSHM, BSTM, BSSCRIM, Engineering)": {
      gf: { staircase_1: "Go upstairs, turn left, head straight into the hallway — you will see the Assessment — Window 8 sign on the counters." },
      "1f": {
        staircase_1: "You're almost there! From the stairs turn left, head straight — you will see Assessment — Window 8 sign on the counters.",
        staircase_2: "You're almost there! From the entrance, head straight until you see a stair. Turn left — you will see the Assessment — Window 8 sign on the counters.",
      },
      "2f": {
        staircase_1: "From the stairs, go down into the 1st floor, turn left, then turn right into the hallway, head straight — it is in the far end. You will see Assessment — Window 8 sign on the counters.",
        staircase_2: "From the stairs, go down into the 1st floor, turn right, head straight until you see a stair. Turn left — you will see an Assessment — Window 8 sign on the counters.",
      },
      "3f": {
        staircase_1: "From the stairs, go down into the 2nd floor, go down into the 1st floor, turn left, then turn right into the hallway, head straight — you will see Assessment — Window 8 sign on the counters.",
        staircase_2: "From the stairs, go down into the 2nd floor, go down into the 1st floor, turn right, head straight until you see a stair. Turn left — you will see an Assessment — Window 8 sign on the counters.",
      },
      "4f": {
        staircase_1: "From the stairs, go down into the 3rd floor, go down into the 2nd floor, go down into the 1st floor, turn left, then turn right into the hallway, head straight — you will see Assessment — Window 8 sign on the counters.",
        staircase_2: "From the stairs, go down into the 3rd floor, go down into the 2nd floor, go down into the 1st floor, turn right, head straight until you see a stair. Turn left — you will see an Assessment — Window 8 sign on the counters.",
      },
    },

    "Accounting — Window 9 (Dentistry, Nursing, BSPT, AB Psych, Midwifery, BSA, Med Tech, BSIT, BSED/BEED, BSBA)": {
      gf: { staircase_1: "Go upstairs, turn left, head straight into the hallway — you will see the Accounting — Window 9 sign on the counters." },
      "1f": {
        staircase_1: "You're almost there! From the stairs turn left, head straight — you will see Accounting — Window 9 sign on the counters.",
        staircase_2: "You're almost there! From the entrance, head straight until you see a stair. Turn left — you will see the Accounting — Window 9 sign on the counters.",
      },
      "2f": {
        staircase_1: "From the stairs, go down into the 1st floor, turn left, then turn right into the hallway, head straight — it is in the far end. You will see Accounting — Window 9 sign on the counters.",
        staircase_2: "From the stairs, go down into the 1st floor, turn right, head straight until you see a stair. Turn left — you will see an Accounting — Window 9 sign on the counters.",
      },
      "3f": {
        staircase_1: "From the stairs, go down into the 2nd floor, go down into the 1st floor, turn left, then turn right into the hallway, head straight — you will see Accounting — Window 9 sign on the counters.",
        staircase_2: "From the stairs, go down into the 2nd floor, go down into the 1st floor, turn right, head straight until you see a stair. Turn left — you will see an Accounting — Window 9 sign on the counters.",
      },
      "4f": {
        staircase_1: "From the stairs, go down into the 3rd floor, go down into the 2nd floor, go down into the 1st floor, turn left, then turn right into the hallway, head straight — you will see Accounting — Window 9 sign on the counters.",
        staircase_2: "From the stairs, go down into the 3rd floor, go down into the 2nd floor, go down into the 1st floor, turn right, head straight until you see a stair. Turn left — you will see an Accounting — Window 9 sign on the counters.",
      },
    },

    "Window 10": {
      gf: { staircase_1: "Go upstairs, turn left, head straight into the hallway — you will see the Window 10 sign on the counters." },
      "1f": {
        staircase_1: "You're almost there! From the stairs turn left, head straight — you will see Window 10 sign on the counters.",
        staircase_2: "You're almost there! From the entrance, head straight until you see a stair. Turn left — you will see the Window 10 sign on the counters.",
      },
      "2f": {
        staircase_1: "From the stairs, go down into the 1st floor, turn left, then turn right into the hallway, head straight — it is in the far end. You will see Window 10 sign on the counters.",
        staircase_2: "From the stairs, go down into the 1st floor, turn right, head straight until you see a stair. Turn left — you will see a Window 10 sign on the counters.",
      },
      "3f": {
        staircase_1: "From the stairs, go down into the 2nd floor, go down into the 1st floor, turn left, then turn right into the hallway, head straight — you will see Window 10 sign on the counters.",
        staircase_2: "From the stairs, go down into the 2nd floor, go down into the 1st floor, turn right, head straight until you see a stair. Turn left — you will see a Window 10 sign on the counters.",
      },
      "4f": {
        staircase_1: "From the stairs, go down into the 3rd floor, go down into the 2nd floor, go down into the 1st floor, turn left, then turn right into the hallway, head straight — you will see Window 10 sign on the counters.",
        staircase_2: "From the stairs, go down into the 3rd floor, go down into the 2nd floor, go down into the 1st floor, turn right, head straight until you see a stair. Turn left — you will see a Window 10 sign on the counters.",
      },
    },

    "ComLab 1": {
      gf: { staircase_1: "You're almost there! Go upstairs and it is the door to your left." },
      "1f": {
        staircase_1: "You're almost there! Turn left — it is the door to your right before the entrance.",
        staircase_2: "You're almost there! Turn right, turn left into the hallway. After reaching the end of the hallway, turn right — you will see ComLab 1 as the first door on your right.",
      },
      "2f": {
        staircase_1: "From the stairs, go down into the 1st floor, turn left — it is the door to your right before the entrance.",
        staircase_2: "From the stairs, go down into the 1st floor, turn right, turn left into the hallway. After reaching the end of the hallway, turn right — you will see ComLab 1 as the first door on your right.",
      },
      "3f": {
        staircase_1: "From the stairs, go down into the 2nd floor, go down into the 1st floor, turn left — it is the door to your right before the entrance.",
        staircase_2: "From the stairs, go down into the 2nd floor, go down into the 1st floor, turn right, turn left into the hallway. After reaching the end of the hallway, turn right — you will see ComLab 1 as the first door on your right.",
      },
      "4f": {
        staircase_1: "From the stairs, go down into the 3rd floor, go down into the 2nd floor, go down into the 1st floor, turn left — it is the door to your right before the entrance.",
        staircase_2: "From the stairs, go down into the 3rd floor, go down into the 2nd floor, go down into the 1st floor, turn right, turn left into the hallway. After reaching the end of the hallway, turn right — you will see ComLab 1 as the first door on your right.",
      },
    },

    // ════ 2ND FLOOR ROOMS ════

    "ComLab 2": {
      gf: { staircase_1: "Go upstairs, after going inside turn left, go upstairs into the 2nd floor, turn left — you're at ComLab 2." },
      "1f": {
        staircase_1: "Go upstairs into the 2nd floor, turn left — you're at ComLab 2.",
        staircase_2: "Go upstairs, turn right, then head straight. After passing the library, turn left, head straight — at the end of the hallway you will find ComLab 2.",
      },
      "2f": {
        staircase_1: "You're almost there! From the stairs, turn left — you're at ComLab 2.",
        staircase_2: "You're almost there! From the stairs, turn right, then head straight. After passing the library, turn left, head straight — at the end of the hallway you will find ComLab 2.",
      },
      "3f": {
        staircase_1: "Go downstairs into the 2nd floor, turn left — you're at ComLab 2.",
        staircase_2: "Go downstairs into the 2nd floor. From the stairs, turn right, then head straight. After passing the library, turn left, head straight — at the end of the hallway you will find ComLab 2.",
      },
      "4f": {
        staircase_1: "Go downstairs into the 3rd floor, go downstairs into the 2nd floor, turn left — you're at ComLab 2.",
        staircase_2: "Go downstairs into the 3rd floor, go downstairs into the 2nd floor. From the stairs, turn right, then head straight. After passing the library, turn left, head straight — at the end of the hallway you will find ComLab 2.",
      },
    },

    "Therapy Room": {
      gf: { staircase_1: "Go upstairs, after going inside turn left, go upstairs into the 2nd floor, turn left, then turn right — you will see the Therapy Room." },
      "1f": {
        staircase_1: "Go upstairs into the 2nd floor, turn left, then turn right — you will see the Therapy Room.",
        staircase_2: "Go upstairs, turn right, then head straight. After passing the library, turn left, head straight — you will see the Therapy Room.",
      },
      "2f": {
        staircase_1: "You're almost there! From the stairs, turn left, then turn right — you will see the Therapy Room.",
        staircase_2: "You're almost there! From the stairs, turn right, then head straight. After passing the library, turn left, head straight — you will see the Therapy Room.",
      },
      "3f": {
        staircase_1: "Go downstairs into the 2nd floor, turn left, then turn right — you will see the Therapy Room.",
        staircase_2: "Go downstairs into the 2nd floor. From the stairs, turn right, then head straight. After passing the library, turn left, head straight — you will see the Therapy Room.",
      },
      "4f": {
        staircase_1: "Go downstairs into the 3rd floor, go downstairs into the 2nd floor, turn left, then turn right — you will see the Therapy Room.",
        staircase_2: "Go downstairs into the 3rd floor, go downstairs into the 2nd floor. From the stairs, turn right, then head straight. After passing the library, turn left, head straight — you will see the Therapy Room.",
      },
    },

    "Therapeutics Lab": {
      gf: { staircase_1: "Go upstairs, after going inside turn left, go upstairs into the 2nd floor, turn left, then turn right — you will see the Therapeutics Lab." },
      "1f": {
        staircase_1: "Go upstairs into the 2nd floor, turn left, then turn right — you will see the Therapeutics Lab.",
        staircase_2: "Go upstairs, turn right, then head straight. After passing the library, turn left, head straight — you will see the Therapeutics Lab.",
      },
      "2f": {
        staircase_1: "You're almost there! From the stairs, turn left, then turn right — you will see the Therapeutics Lab.",
        staircase_2: "You're almost there! From the stairs, turn right, then head straight. After passing the library, turn left, head straight — you will see the Therapeutics Lab.",
      },
      "3f": {
        staircase_1: "Go downstairs into the 2nd floor, turn left, then turn right — you will see the Therapeutics Lab.",
        staircase_2: "Go downstairs into the 2nd floor. From the stairs, turn right, then head straight. After passing the library, turn left, head straight — you will see the Therapeutics Lab.",
      },
      "4f": {
        staircase_1: "Go downstairs into the 3rd floor, go downstairs into the 2nd floor, turn left, then turn right — you will see the Therapeutics Lab.",
        staircase_2: "Go downstairs into the 3rd floor, go downstairs into the 2nd floor. From the stairs, turn right, then head straight. After passing the library, turn left, head straight — you will see the Therapeutics Lab.",
      },
    },

    "Library": {
      gf: { staircase_1: "Go upstairs, after going inside turn left, go upstairs into the 2nd floor, turn left, then turn right. Head straight — you will see the library on your right." },
      "1f": {
        staircase_1: "Go upstairs into the 2nd floor, turn left, then turn right. Head straight — you will see the library on your right.",
        staircase_2: "You're almost there! Go upstairs, turn right, then head straight — you will see the library to your left.",
      },
      "2f": {
        staircase_1: "You're almost there! From the stairs, turn left, then turn right. Head straight — you will see the library on your right.",
        staircase_2: "You're almost there! From the stairs, turn right, then head straight — you will see the library to your left.",
      },
      "3f": {
        staircase_1: "Go downstairs into the 2nd floor, turn left, then turn right. Head straight — you will see the library on your right.",
        staircase_2: "Go downstairs into the 2nd floor. From the stairs, turn right, then head straight — you will see the library to your left.",
      },
      "4f": {
        staircase_1: "Go downstairs into the 3rd floor, go downstairs into the 2nd floor, turn left, then turn right. Head straight — you will see the library on your right.",
        staircase_2: "Go downstairs into the 3rd floor, go downstairs into the 2nd floor. From the stairs, turn right, then head straight — you will see the library to your left.",
      },
    },

    "PT Lab": {
      gf: { staircase_1: "Go upstairs, after going inside turn left, go upstairs into the 2nd floor, turn left, then turn right — you will see the PT Lab." },
      "1f": {
        staircase_1: "Go upstairs into the 2nd floor, turn left, then turn right — you will see the PT Lab.",
        staircase_2: "Go upstairs, turn right, then head straight. After passing the library, turn left, head straight — you will see the PT Lab.",
      },
      "2f": {
        staircase_1: "You're almost there! From the stairs, turn left, then turn right — you will see the PT Lab.",
        staircase_2: "You're almost there! From the stairs, turn right, then head straight. After passing the library, turn left, head straight — you will see the PT Lab.",
      },
      "3f": {
        staircase_1: "Go downstairs into the 2nd floor, turn left, then turn right — you will see the PT Lab.",
        staircase_2: "Go downstairs into the 2nd floor. From the stairs, turn right, then head straight. After passing the library, turn left, head straight — you will see the PT Lab.",
      },
      "4f": {
        staircase_1: "Go downstairs into the 3rd floor, go downstairs into the 2nd floor, turn left, then turn right — you will see the PT Lab.",
        staircase_2: "Go downstairs into the 3rd floor, go downstairs into the 2nd floor. From the stairs, turn right, then head straight. After passing the library, turn left, head straight — you will see the PT Lab.",
      },
    },

    "Simulation Room (Mini Hospital)": {
      gf: { staircase_1: "Go upstairs, after going inside turn left, go upstairs into the 2nd floor, turn left, then turn right — you will see the Simulation Room (Mini Hospital)." },
      "1f": {
        staircase_1: "Go upstairs into the 2nd floor, turn left, then turn right — you will see the Simulation Room (Mini Hospital).",
        staircase_2: "Go upstairs, turn right, then head straight. After passing the library, turn left, head straight — you will see the Simulation Room (Mini Hospital).",
      },
      "2f": {
        staircase_1: "You're almost there! From the stairs, turn left, then turn right — you will see the Simulation Room (Mini Hospital).",
        staircase_2: "You're almost there! From the stairs, turn right, then head straight. After passing the library, turn left, head straight — you will see the Simulation Room (Mini Hospital).",
      },
      "3f": {
        staircase_1: "Go downstairs into the 2nd floor, turn left, then turn right — you will see the Simulation Room (Mini Hospital).",
        staircase_2: "Go downstairs into the 2nd floor. From the stairs, turn right, then head straight. After passing the library, turn left, head straight — you will see the Simulation Room (Mini Hospital).",
      },
      "4f": {
        staircase_1: "Go downstairs into the 3rd floor, go downstairs into the 2nd floor, turn left, then turn right — you will see the Simulation Room (Mini Hospital).",
        staircase_2: "Go downstairs into the 3rd floor, go downstairs into the 2nd floor. From the stairs, turn right, then head straight. After passing the library, turn left, head straight — you will see the Simulation Room (Mini Hospital).",
      },
    },

    "AB Comm Lab": {
      gf: { staircase_1: "Go upstairs, after going inside turn left, go upstairs into the 2nd floor, turn left, then turn right. Head straight through the hallway — at the end you will see the AB Comm Lab." },
      "1f": {
        staircase_1: "Go upstairs into the 2nd floor, turn left, then turn right. Head straight — you will see the AB Comm Lab beside the stairs.",
        staircase_2: "Go upstairs, turn right, then head straight. After passing the library, look to your right — you will see the AB Comm Lab.",
      },
      "2f": {
        staircase_1: "You're almost there! From the stairs, turn left, then turn right. Head straight — you will see the AB Comm Lab beside the stairs.",
        staircase_2: "You're almost there! From the stairs, turn right, then head straight. After passing the library, look to your right — you will see the AB Comm Lab.",
      },
      "3f": {
        staircase_1: "Go downstairs into the 2nd floor, turn left, then turn right. Head straight — you will see the AB Comm Lab beside the stairs.",
        staircase_2: "Go downstairs into the 2nd floor. From the stairs, turn right, then head straight. After passing the library, look to your right — you will see the AB Comm Lab.",
      },
      "4f": {
        staircase_1: "Go downstairs into the 3rd floor, go downstairs into the 2nd floor, turn left, then turn right. Head straight — you will see the AB Comm Lab beside the stairs.",
        staircase_2: "Go downstairs into the 3rd floor, go downstairs into the 2nd floor. From the stairs, turn right, then head straight. After passing the library, look to your right — you will see the AB Comm Lab.",
      },
    },

    "Drawing Lab": {
      gf: { staircase_1: "Go upstairs, after going inside turn left, go upstairs into the 2nd floor, turn left, then turn right. Head straight — look to your left to find the Drawing Lab." },
      "1f": {
        staircase_1: "Go upstairs into the 2nd floor, turn left, then turn right. Head straight — look to your left to find the Drawing Lab.",
        staircase_2: "You're almost there! Go upstairs, turn right, then head straight — you will see the Drawing Lab to your right.",
      },
      "2f": {
        staircase_1: "You're almost there! From the stairs, turn left, then turn right. Head straight — look to your left to find the Drawing Lab.",
        staircase_2: "You're almost there! From the stairs, turn right, then head straight — you will see the Drawing Lab to your right.",
      },
      "3f": {
        staircase_1: "Go downstairs into the 2nd floor, turn left, then turn right. Head straight — look to your left to find the Drawing Lab.",
        staircase_2: "Go downstairs into the 2nd floor. From the stairs, turn right, then head straight — you will see the Drawing Lab to your right.",
      },
      "4f": {
        staircase_1: "Go downstairs into the 3rd floor, go downstairs into the 2nd floor, turn left, then turn right. Head straight — look to your left to find the Drawing Lab.",
        staircase_2: "Go downstairs into the 3rd floor, go downstairs into the 2nd floor. From the stairs, turn right, then head straight — you will see the Drawing Lab to your right.",
      },
    },

    "Engineering Office": {
      gf: { staircase_1: "Go upstairs, after going inside turn left, go upstairs into the 2nd floor, turn left, then turn right. Head straight — look to your left to find the Engineering Office." },
      "1f": {
        staircase_1: "Go upstairs into the 2nd floor, turn left, then turn right. Head straight — look to your left to find the Engineering Office.",
        staircase_2: "You're almost there! Go upstairs, turn right, then head straight — you will see the Engineering Office to your right.",
      },
      "2f": {
        staircase_1: "You're almost there! From the stairs, turn left, then turn right. Head straight — look to your left to find the Engineering Office.",
        staircase_2: "You're almost there! From the stairs, turn right, then head straight — you will see the Engineering Office to your right.",
      },
      "3f": {
        staircase_1: "Go downstairs into the 2nd floor, turn left, then turn right. Head straight — look to your left to find the Engineering Office.",
        staircase_2: "Go downstairs into the 2nd floor. From the stairs, turn right, then head straight — you will see the Engineering Office to your right.",
      },
      "4f": {
        staircase_1: "Go downstairs into the 3rd floor, go downstairs into the 2nd floor, turn left, then turn right. Head straight — look to your left to find the Engineering Office.",
        staircase_2: "Go downstairs into the 3rd floor, go downstairs into the 2nd floor. From the stairs, turn right, then head straight — you will see the Engineering Office to your right.",
      },
    },

    // ════ 3RD FLOOR ROOMS ════

    "MB301": {
      gf: { staircase_1: "Go upstairs into the 1st floor, after going inside turn left and go upstairs into the 2nd floor, then go upstairs again into 3rd floor, turn left, turn right, walk through the hallway — you will find MB301 above the door." },
      "1f": {
        staircase_1: "Go upstairs into the 2nd floor, then go upstairs again into 3rd floor, turn left, turn right, walk through the hallway — you will find MB301 above the door.",
        staircase_2: "Go upstairs into the 2nd floor, then go upstairs again into 3rd floor, turn right, then turn left, walk through the hallway — you will find MB301 above the door.",
      },
      "2f": {
        staircase_1: "Go upstairs into 3rd floor, turn left, turn right, walk through the hallway — you will find MB301 above the door.",
        staircase_2: "Go upstairs into 3rd floor, turn right, then turn left, walk through the hallway — you will find MB301 above the door.",
      },
      "3f": {
        staircase_1: "You're almost there! From the stairs turn left, turn right, walk through the hallway — you will find MB301 above the door.",
        staircase_2: "You're almost there! From the stairs turn right, then turn left, walk through the hallway — you will find MB301 above the door.",
      },
      "4f": {
        staircase_1: "Go downstairs into 3rd floor, turn left, turn right, walk through the hallway — you will find MB301 above the door.",
        staircase_2: "Go downstairs into 3rd floor, turn right, then turn left, walk through the hallway — you will find MB301 above the door.",
      },
    },

    "MB302": {
      gf: { staircase_1: "Go upstairs into the 1st floor, after going inside turn left and go upstairs into the 2nd floor, then go upstairs again into 3rd floor, turn left, turn right, walk through the hallway — you will find MB302 above the door." },
      "1f": {
        staircase_1: "Go upstairs into the 2nd floor, then go upstairs again into 3rd floor, turn left, turn right, walk through the hallway — you will find MB302 above the door.",
        staircase_2: "Go upstairs into the 2nd floor, then go upstairs again into 3rd floor, turn right, then turn left, walk through the hallway — you will find MB302 above the door.",
      },
      "2f": {
        staircase_1: "Go upstairs into 3rd floor, turn left, turn right, walk through the hallway — you will find MB302 above the door.",
        staircase_2: "Go upstairs into 3rd floor, turn right, then turn left, walk through the hallway — you will find MB302 above the door.",
      },
      "3f": {
        staircase_1: "You're almost there! From the stairs turn left, turn right, walk through the hallway — you will find MB302 above the door.",
        staircase_2: "You're almost there! From the stairs turn right, then turn left, walk through the hallway — you will find MB302 above the door.",
      },
      "4f": {
        staircase_1: "Go downstairs into 3rd floor, turn left, turn right, walk through the hallway — you will find MB302 above the door.",
        staircase_2: "Go downstairs into 3rd floor, turn right, then turn left, walk through the hallway — you will find MB302 above the door.",
      },
    },

    "MB303": {
      gf: { staircase_1: "Go upstairs into the 1st floor, after going inside turn left and go upstairs into the 2nd floor, then go upstairs again into 3rd floor, turn left, turn right, walk through the hallway — you will find MB303 above the door." },
      "1f": {
        staircase_1: "Go upstairs into the 2nd floor, then go upstairs again into 3rd floor, turn left, turn right, walk through the hallway — you will find MB303 above the door.",
        staircase_2: "Go upstairs into the 2nd floor, then go upstairs again into 3rd floor, turn right, then turn left, walk through the hallway — you will find MB303 above the door.",
      },
      "2f": {
        staircase_1: "Go upstairs into 3rd floor, turn left, turn right, walk through the hallway — you will find MB303 above the door.",
        staircase_2: "Go upstairs into 3rd floor, turn right, then turn left, walk through the hallway — you will find MB303 above the door.",
      },
      "3f": {
        staircase_1: "You're almost there! From the stairs turn left, turn right, walk through the hallway — you will find MB303 above the door.",
        staircase_2: "You're almost there! From the stairs turn right, then turn left, walk through the hallway — you will find MB303 above the door.",
      },
      "4f": {
        staircase_1: "Go downstairs into 3rd floor, turn left, turn right, walk through the hallway — you will find MB303 above the door.",
        staircase_2: "Go downstairs into 3rd floor, turn right, then turn left, walk through the hallway — you will find MB303 above the door.",
      },
    },

    "MB304": {
      gf: { staircase_1: "Go upstairs into the 1st floor, after going inside turn left and go upstairs into the 2nd floor, then go upstairs again into 3rd floor, turn left, turn right, walk through the hallway — you will find MB304 above the door." },
      "1f": {
        staircase_1: "Go upstairs into the 2nd floor, then go upstairs again into 3rd floor, turn left, turn right, walk through the hallway — you will find MB304 above the door.",
        staircase_2: "Go upstairs into the 2nd floor, then go upstairs again into 3rd floor, turn right, then turn left, walk through the hallway — you will find MB304 above the door.",
      },
      "2f": {
        staircase_1: "Go upstairs into 3rd floor, turn left, turn right, walk through the hallway — you will find MB304 above the door.",
        staircase_2: "Go upstairs into 3rd floor, turn right, then turn left, walk through the hallway — you will find MB304 above the door.",
      },
      "3f": {
        staircase_1: "You're almost there! From the stairs turn left, turn right, walk through the hallway — you will find MB304 above the door.",
        staircase_2: "You're almost there! From the stairs turn right, then turn left, walk through the hallway — you will find MB304 above the door.",
      },
      "4f": {
        staircase_1: "Go downstairs into 3rd floor, turn left, turn right, walk through the hallway — you will find MB304 above the door.",
        staircase_2: "Go downstairs into 3rd floor, turn right, then turn left, walk through the hallway — you will find MB304 above the door.",
      },
    },

    "MB305": {
      gf: { staircase_1: "Go upstairs into the 1st floor, after going inside turn left and go upstairs into the 2nd floor, then go upstairs again into 3rd floor, turn left, turn right, walk through the hallway — you will find MB305 above the door." },
      "1f": {
        staircase_1: "Go upstairs into the 2nd floor, then go upstairs again into 3rd floor, turn left, turn right, walk through the hallway — you will find MB305 above the door.",
        staircase_2: "Go upstairs into the 2nd floor, then go upstairs again into 3rd floor, turn right, then turn left, walk through the hallway — you will find MB305 above the door.",
      },
      "2f": {
        staircase_1: "Go upstairs into 3rd floor, turn left, turn right, walk through the hallway — you will find MB305 above the door.",
        staircase_2: "Go upstairs into 3rd floor, turn right, then turn left, walk through the hallway — you will find MB305 above the door.",
      },
      "3f": {
        staircase_1: "You're almost there! From the stairs turn left, turn right, walk through the hallway — you will find MB305 above the door.",
        staircase_2: "You're almost there! From the stairs turn right, then turn left, walk through the hallway — you will find MB305 above the door.",
      },
      "4f": {
        staircase_1: "Go downstairs into 3rd floor, turn left, turn right, walk through the hallway — you will find MB305 above the door.",
        staircase_2: "Go downstairs into 3rd floor, turn right, then turn left, walk through the hallway — you will find MB305 above the door.",
      },
    },

    "MB306": {
      gf: { staircase_1: "Go upstairs into the 1st floor, after going inside turn left and go upstairs into the 2nd floor, then go upstairs again into 3rd floor, turn left, turn right, walk through the hallway — you will find MB306 above the door." },
      "1f": {
        staircase_1: "Go upstairs into the 2nd floor, then go upstairs again into 3rd floor, turn left, turn right, walk through the hallway — you will find MB306 above the door.",
        staircase_2: "Go upstairs into the 2nd floor, then go upstairs again into 3rd floor, turn right, then turn left, walk through the hallway — you will find MB306 above the door.",
      },
      "2f": {
        staircase_1: "Go upstairs into 3rd floor, turn left, turn right, walk through the hallway — you will find MB306 above the door.",
        staircase_2: "Go upstairs into 3rd floor, turn right, then turn left, walk through the hallway — you will find MB306 above the door.",
      },
      "3f": {
        staircase_1: "You're almost there! From the stairs turn left, turn right, walk through the hallway — you will find MB306 above the door.",
        staircase_2: "You're almost there! From the stairs turn right, then turn left, walk through the hallway — you will find MB306 above the door.",
      },
      "4f": {
        staircase_1: "Go downstairs into 3rd floor, turn left, turn right, walk through the hallway — you will find MB306 above the door.",
        staircase_2: "Go downstairs into 3rd floor, turn right, then turn left, walk through the hallway — you will find MB306 above the door.",
      },
    },

    "MB307": {
      gf: { staircase_1: "Go upstairs into the 1st floor, after going inside turn left and go upstairs into the 2nd floor, then go upstairs again into 3rd floor, turn left, turn right, walk through the hallway — you will find MB307 above the door." },
      "1f": {
        staircase_1: "Go upstairs into the 2nd floor, then go upstairs again into 3rd floor, turn left, turn right, walk through the hallway — you will find MB307 above the door.",
        staircase_2: "Go upstairs into the 2nd floor, then go upstairs again into 3rd floor, turn right, then turn left, walk through the hallway — you will find MB307 above the door.",
      },
      "2f": {
        staircase_1: "Go upstairs into 3rd floor, turn left, turn right, walk through the hallway — you will find MB307 above the door.",
        staircase_2: "Go upstairs into 3rd floor, turn right, then turn left, walk through the hallway — you will find MB307 above the door.",
      },
      "3f": {
        staircase_1: "You're almost there! From the stairs turn left, turn right, walk through the hallway — you will find MB307 above the door.",
        staircase_2: "You're almost there! From the stairs turn right, then turn left, walk through the hallway — you will find MB307 above the door.",
      },
      "4f": {
        staircase_1: "Go downstairs into 3rd floor, turn left, turn right, walk through the hallway — you will find MB307 above the door.",
        staircase_2: "Go downstairs into 3rd floor, turn right, then turn left, walk through the hallway — you will find MB307 above the door.",
      },
    },

    "MB308": {
      gf: { staircase_1: "Go upstairs into the 1st floor, after going inside turn left and go upstairs into the 2nd floor, then go upstairs again into 3rd floor, turn left, turn right, walk through the hallway — you will find MB308 above the door." },
      "1f": {
        staircase_1: "Go upstairs into the 2nd floor, then go upstairs again into 3rd floor, turn left, turn right, walk through the hallway — you will find MB308 above the door.",
        staircase_2: "Go upstairs into the 2nd floor, then go upstairs again into 3rd floor, turn right, then turn left, walk through the hallway — you will find MB308 above the door.",
      },
      "2f": {
        staircase_1: "Go upstairs into 3rd floor, turn left, turn right, walk through the hallway — you will find MB308 above the door.",
        staircase_2: "Go upstairs into 3rd floor, turn right, then turn left, walk through the hallway — you will find MB308 above the door.",
      },
      "3f": {
        staircase_1: "You're almost there! From the stairs turn left, turn right, walk through the hallway — you will find MB308 above the door.",
        staircase_2: "You're almost there! From the stairs turn right, then turn left, walk through the hallway — you will find MB308 above the door.",
      },
      "4f": {
        staircase_1: "Go downstairs into 3rd floor, turn left, turn right, walk through the hallway — you will find MB308 above the door.",
        staircase_2: "Go downstairs into 3rd floor, turn right, then turn left, walk through the hallway — you will find MB308 above the door.",
      },
    },

    "MB309": {
      gf: { staircase_1: "Go upstairs into the 1st floor, after going inside turn left and go upstairs into the 2nd floor, then go upstairs again into 3rd floor, turn left, turn right, walk through the hallway — you will find MB309 above the door." },
      "1f": {
        staircase_1: "Go upstairs into the 2nd floor, then go upstairs again into 3rd floor, turn left, turn right, walk through the hallway — you will find MB309 above the door.",
        staircase_2: "Go upstairs into the 2nd floor, then go upstairs again into 3rd floor, turn right, then turn left, walk through the hallway — you will find MB309 above the door.",
      },
      "2f": {
        staircase_1: "Go upstairs into 3rd floor, turn left, turn right, walk through the hallway — you will find MB309 above the door.",
        staircase_2: "Go upstairs into 3rd floor, turn right, then turn left, walk through the hallway — you will find MB309 above the door.",
      },
      "3f": {
        staircase_1: "You're almost there! From the stairs turn left, turn right, walk through the hallway — you will find MB309 above the door.",
        staircase_2: "You're almost there! From the stairs turn right, then turn left, walk through the hallway — you will find MB309 above the door.",
      },
      "4f": {
        staircase_1: "Go downstairs into 3rd floor, turn left, turn right, walk through the hallway — you will find MB309 above the door.",
        staircase_2: "Go downstairs into 3rd floor, turn right, then turn left, walk through the hallway — you will find MB309 above the door.",
      },
    },

    "MB310": {
      gf: { staircase_1: "Go upstairs into the 1st floor, after going inside turn left and go upstairs into the 2nd floor, then go upstairs again into 3rd floor, turn left, turn right, walk through the hallway — you will find MB310 above the door." },
      "1f": {
        staircase_1: "Go upstairs into the 2nd floor, then go upstairs again into 3rd floor, turn left, turn right, walk through the hallway — you will find MB310 above the door.",
        staircase_2: "Go upstairs into the 2nd floor, then go upstairs again into 3rd floor, turn right, then turn left, walk through the hallway — you will find MB310 above the door.",
      },
      "2f": {
        staircase_1: "Go upstairs into 3rd floor, turn left, turn right, walk through the hallway — you will find MB310 above the door.",
        staircase_2: "Go upstairs into 3rd floor, turn right, then turn left, walk through the hallway — you will find MB310 above the door.",
      },
      "3f": {
        staircase_1: "You're almost there! From the stairs turn left, turn right, walk through the hallway — you will find MB310 above the door.",
        staircase_2: "You're almost there! From the stairs turn right, then turn left, walk through the hallway — you will find MB310 above the door.",
      },
      "4f": {
        staircase_1: "Go downstairs into 3rd floor, turn left, turn right, walk through the hallway — you will find MB310 above the door.",
        staircase_2: "Go downstairs into 3rd floor, turn right, then turn left, walk through the hallway — you will find MB310 above the door.",
      },
    },

    "MB311": {
      gf: { staircase_1: "Go upstairs into the 1st floor, after going inside turn left and go upstairs into the 2nd floor, then go upstairs again into 3rd floor, turn left, turn right, walk through the hallway — you will find MB311 above the door." },
      "1f": {
        staircase_1: "Go upstairs into the 2nd floor, then go upstairs again into 3rd floor, turn left, turn right, walk through the hallway — you will find MB311 above the door.",
        staircase_2: "Go upstairs into the 2nd floor, then go upstairs again into 3rd floor, turn right, then turn left, walk through the hallway — you will find MB311 above the door.",
      },
      "2f": {
        staircase_1: "Go upstairs into 3rd floor, turn left, turn right, walk through the hallway — you will find MB311 above the door.",
        staircase_2: "Go upstairs into 3rd floor, turn right, then turn left, walk through the hallway — you will find MB311 above the door.",
      },
      "3f": {
        staircase_1: "You're almost there! From the stairs turn left, turn right, walk through the hallway — you will find MB311 above the door.",
        staircase_2: "You're almost there! From the stairs turn right, then turn left, walk through the hallway — you will find MB311 above the door.",
      },
      "4f": {
        staircase_1: "Go downstairs into 3rd floor, turn left, turn right, walk through the hallway — you will find MB311 above the door.",
        staircase_2: "Go downstairs into 3rd floor, turn right, then turn left, walk through the hallway — you will find MB311 above the door.",
      },
    },

    "MB312": {
      gf: { staircase_1: "Go upstairs into the 1st floor, after going inside turn left and go upstairs into the 2nd floor, then go upstairs again into 3rd floor, turn left, turn right, walk through the hallway — you will find MB312 above the door." },
      "1f": {
        staircase_1: "Go upstairs into the 2nd floor, then go upstairs again into 3rd floor, turn left, turn right, walk through the hallway — you will find MB312 above the door.",
        staircase_2: "Go upstairs into the 2nd floor, then go upstairs again into 3rd floor, turn right, then turn left, walk through the hallway — you will find MB312 above the door.",
      },
      "2f": {
        staircase_1: "Go upstairs into 3rd floor, turn left, turn right, walk through the hallway — you will find MB312 above the door.",
        staircase_2: "Go upstairs into 3rd floor, turn right, then turn left, walk through the hallway — you will find MB312 above the door.",
      },
      "3f": {
        staircase_1: "You're almost there! From the stairs turn left, turn right, walk through the hallway — you will find MB312 above the door.",
        staircase_2: "You're almost there! From the stairs turn right, then turn left, walk through the hallway — you will find MB312 above the door.",
      },
      "4f": {
        staircase_1: "Go downstairs into 3rd floor, turn left, turn right, walk through the hallway — you will find MB312 above the door.",
        staircase_2: "Go downstairs into 3rd floor, turn right, then turn left, walk through the hallway — you will find MB312 above the door.",
      },
    },

    "MB313": {
      gf: { staircase_1: "Go upstairs into the 1st floor, after going inside turn left and go upstairs into the 2nd floor, then go upstairs again into 3rd floor, turn left, turn right, walk through the hallway — you will find MB313 above the door." },
      "1f": {
        staircase_1: "Go upstairs into the 2nd floor, then go upstairs again into 3rd floor, turn left, turn right, walk through the hallway — you will find MB313 above the door.",
        staircase_2: "Go upstairs into the 2nd floor, then go upstairs again into 3rd floor, turn right, then turn left, walk through the hallway — you will find MB313 above the door.",
      },
      "2f": {
        staircase_1: "Go upstairs into 3rd floor, turn left, turn right, walk through the hallway — you will find MB313 above the door.",
        staircase_2: "Go upstairs into 3rd floor, turn right, then turn left, walk through the hallway — you will find MB313 above the door.",
      },
      "3f": {
        staircase_1: "You're almost there! From the stairs turn left, turn right, walk through the hallway — you will find MB313 above the door.",
        staircase_2: "You're almost there! From the stairs turn right, then turn left, walk through the hallway — you will find MB313 above the door.",
      },
      "4f": {
        staircase_1: "Go downstairs into 3rd floor, turn left, turn right, walk through the hallway — you will find MB313 above the door.",
        staircase_2: "Go downstairs into 3rd floor, turn right, then turn left, walk through the hallway — you will find MB313 above the door.",
      },
    },

    "MB314": {
      gf: { staircase_1: "Go upstairs into the 1st floor, after going inside turn left and go upstairs into the 2nd floor, then go upstairs again into 3rd floor, turn left, turn right, walk through the hallway — you will find MB314 above the door." },
      "1f": {
        staircase_1: "Go upstairs into the 2nd floor, then go upstairs again into 3rd floor, turn left, turn right, walk through the hallway — you will find MB314 above the door.",
        staircase_2: "Go upstairs into the 2nd floor, then go upstairs again into 3rd floor, turn right, then turn left, walk through the hallway — you will find MB314 above the door.",
      },
      "2f": {
        staircase_1: "Go upstairs into 3rd floor, turn left, turn right, walk through the hallway — you will find MB314 above the door.",
        staircase_2: "Go upstairs into 3rd floor, turn right, then turn left, walk through the hallway — you will find MB314 above the door.",
      },
      "3f": {
        staircase_1: "You're almost there! From the stairs turn left, turn right, walk through the hallway — you will find MB314 above the door.",
        staircase_2: "You're almost there! From the stairs turn right, then turn left, walk through the hallway — you will find MB314 above the door.",
      },
      "4f": {
        staircase_1: "Go downstairs into 3rd floor, turn left, turn right, walk through the hallway — you will find MB314 above the door.",
        staircase_2: "Go downstairs into 3rd floor, turn right, then turn left, walk through the hallway — you will find MB314 above the door.",
      },
    },

    "Office Simulation Lab": {
      gf: { staircase_1: "Go upstairs into the 1st floor, after going inside turn left and go upstairs into the 2nd floor, then go upstairs again into 3rd floor, turn left, turn right — you will find Office Simulation Lab above the door." },
      "1f": {
        staircase_1: "Go upstairs into the 2nd floor, then go upstairs again into 3rd floor, turn left, turn right — you will find Office Simulation Lab above the door.",
        staircase_2: "Go upstairs into the 2nd floor, then go upstairs again into 3rd floor, turn right, then turn left — at the end of the hallway you will find Office Simulation Lab above the door.",
      },
      "2f": {
        staircase_1: "Go upstairs into 3rd floor, turn left, turn right — you will find Office Simulation Lab above the door.",
        staircase_2: "Go upstairs into 3rd floor, turn right, then turn left — at the end of the hallway you will find Office Simulation Lab above the door.",
      },
      "3f": {
        staircase_1: "You're almost there! From the stairs turn left, turn right — you will find Office Simulation Lab above the door.",
        staircase_2: "You're almost there! From the stairs turn right, then turn left — at the end of the hallway you will find Office Simulation Lab above the door.",
      },
      "4f": {
        staircase_1: "Go downstairs into 3rd floor, turn left, turn right — you will find Office Simulation Lab above the door.",
        staircase_2: "Go downstairs into 3rd floor, turn right, then turn left — at the end of the hallway you will find Office Simulation Lab above the door.",
      },
    },

    "Faculty Room": {
      gf: { staircase_1: "Go upstairs into the 1st floor, after going inside turn left and go upstairs into the 2nd floor, then go upstairs again into 3rd floor, turn left — you will find Faculty Room above the door." },
      "1f": {
        staircase_1: "Go upstairs into the 2nd floor, then go upstairs again into 3rd floor, turn left — you will find Faculty Room above the door.",
        staircase_2: "Go upstairs into the 2nd floor, then go upstairs again into 3rd floor, turn right, then turn left, at the end of the hallway turn right — you will find Faculty Room above the door.",
      },
      "2f": {
        staircase_1: "Go upstairs into 3rd floor, turn left — you will find Faculty Room above the door.",
        staircase_2: "Go upstairs into 3rd floor, turn right, then turn left, at the end of the hallway turn right — you will find Faculty Room above the door.",
      },
      "3f": {
        staircase_1: "You're almost there! From the stairs turn left — you will find Faculty Room above the door.",
        staircase_2: "You're almost there! From the stairs turn right, then turn left, at the end of the hallway turn right — you will find Faculty Room above the door.",
      },
      "4f": {
        staircase_1: "Go downstairs into 3rd floor, turn left — you will find Faculty Room above the door.",
        staircase_2: "Go downstairs into 3rd floor, turn right, then turn left, at the end of the hallway turn right — you will find Faculty Room above the door.",
      },
    },

    // NOTE: The directions file incorrectly wrote "Faculty Room" in the Consultation Room entries.
    // The correct destination label is "Consultation Room" — fixed here.
    "Consultation Room": {
      gf: { staircase_1: "Go upstairs into the 1st floor, after going inside turn left and go upstairs into the 2nd floor, then go upstairs again into 3rd floor, turn left — you will find Consultation Room above the door." },
      "1f": {
        staircase_1: "Go upstairs into the 2nd floor, then go upstairs again into 3rd floor, turn left — you will find Consultation Room above the door.",
        staircase_2: "Go upstairs into the 2nd floor, then go upstairs again into 3rd floor, turn right, then turn left — at the end of the hallway you will find Consultation Room above the door.",
      },
      "2f": {
        staircase_1: "Go upstairs into 3rd floor, turn left — you will find Consultation Room above the door.",
        staircase_2: "Go upstairs into 3rd floor, turn right, then turn left — at the end of the hallway you will find Consultation Room above the door.",
      },
      "3f": {
        staircase_1: "You're almost there! From the stairs turn left — you will find Consultation Room above the door.",
        staircase_2: "You're almost there! From the stairs turn right, then turn left — at the end of the hallway you will find Consultation Room above the door.",
      },
      "4f": {
        staircase_1: "Go downstairs into 3rd floor, turn left — you will find Consultation Room above the door.",
        staircase_2: "Go downstairs into 3rd floor, turn right, then turn left — at the end of the hallway you will find Consultation Room above the door.",
      },
    },

    "SBEAT Dean's Office": {
      gf: { staircase_1: "Go upstairs into the 1st floor, after going inside turn left and go upstairs into the 2nd floor, then go upstairs again into 3rd floor, turn left — you will find SBEAT Dean's Office above the door." },
      "1f": {
        staircase_1: "Go upstairs into the 2nd floor, then go upstairs again into 3rd floor, turn left — you will find SBEAT Dean's Office above the door.",
        staircase_2: "Go upstairs into the 2nd floor, then go upstairs again into 3rd floor, turn right, then turn left, at the end of the hallway turn left — you will find SBEAT Dean's Office above the door.",
      },
      "2f": {
        staircase_1: "Go upstairs into 3rd floor, turn left — you will find SBEAT Dean's Office above the door.",
        staircase_2: "Go upstairs into 3rd floor, turn right, then turn left, at the end of the hallway turn left — you will find SBEAT Dean's Office above the door.",
      },
      "3f": {
        staircase_1: "You're almost there! From the stairs turn left — you will find SBEAT Dean's Office above the door.",
        staircase_2: "You're almost there! From the stairs turn right, then turn left, at the end of the hallway turn left — you will find SBEAT Dean's Office above the door.",
      },
      "4f": {
        staircase_1: "Go downstairs into 3rd floor, turn left — you will find SBEAT Dean's Office above the door.",
        staircase_2: "Go downstairs into 3rd floor, turn right, then turn left, at the end of the hallway turn left — you will find SBEAT Dean's Office above the door.",
      },
    },

    // ════ 4TH FLOOR ROOMS ════

    "MB401": {
      gf: { staircase_1: "Go upstairs into the 1st floor, after going inside turn left and go upstairs into the 2nd floor, go upstairs into 3rd floor, then go upstairs again into 4th floor, turn left, turn right, walk through the hallway — you will find MB401 above the door." },
      "1f": {
        staircase_1: "Go upstairs into the 2nd floor, go upstairs into 3rd floor, then go upstairs again into 4th floor, turn left, turn right, walk through the hallway — you will find MB401 above the door.",
        staircase_2: "Go upstairs into the 2nd floor, go upstairs into 3rd floor, then go upstairs again into 4th floor, turn right, then turn left, walk through the hallway — you will find MB401 above the door.",
      },
      "2f": {
        staircase_1: "Go upstairs into 3rd floor, then go upstairs again into 4th floor, turn left, turn right, walk through the hallway — you will find MB401 above the door.",
        staircase_2: "Go upstairs into 3rd floor, then go upstairs again into 4th floor, turn right, then turn left, walk through the hallway — you will find MB401 above the door.",
      },
      "3f": {
        staircase_1: "Go upstairs into 4th floor, turn left, turn right, walk through the hallway — you will find MB401 above the door.",
        staircase_2: "Go upstairs into 4th floor, turn right, then turn left, walk through the hallway — you will find MB401 above the door.",
      },
      "4f": {
        staircase_1: "You're almost there! From the stairs turn left, turn right, walk through the hallway — you will find MB401 above the door.",
        staircase_2: "You're almost there! From the stairs turn right, then turn left, walk through the hallway — you will find MB401 above the door.",
      },
    },

    "MB402": {
      gf: { staircase_1: "Go upstairs into the 1st floor, after going inside turn left and go upstairs into the 2nd floor, go upstairs into 3rd floor, then go upstairs again into 4th floor, turn left, turn right, walk through the hallway — you will find MB402 above the door." },
      "1f": {
        staircase_1: "Go upstairs into the 2nd floor, go upstairs into 3rd floor, then go upstairs again into 4th floor, turn left, turn right, walk through the hallway — you will find MB402 above the door.",
        staircase_2: "Go upstairs into the 2nd floor, go upstairs into 3rd floor, then go upstairs again into 4th floor, turn right, then turn left, walk through the hallway — you will find MB402 above the door.",
      },
      "2f": {
        staircase_1: "Go upstairs into 3rd floor, then go upstairs again into 4th floor, turn left, turn right, walk through the hallway — you will find MB402 above the door.",
        staircase_2: "Go upstairs into 3rd floor, then go upstairs again into 4th floor, turn right, then turn left, walk through the hallway — you will find MB402 above the door.",
      },
      "3f": {
        staircase_1: "Go upstairs into 4th floor, turn left, turn right, walk through the hallway — you will find MB402 above the door.",
        staircase_2: "Go upstairs into 4th floor, turn right, then turn left, walk through the hallway — you will find MB402 above the door.",
      },
      "4f": {
        staircase_1: "You're almost there! From the stairs turn left, turn right, walk through the hallway — you will find MB402 above the door.",
        staircase_2: "You're almost there! From the stairs turn right, then turn left, walk through the hallway — you will find MB402 above the door.",
      },
    },

    "MB403": {
      gf: { staircase_1: "Go upstairs into the 1st floor, after going inside turn left and go upstairs into the 2nd floor, go upstairs into 3rd floor, then go upstairs again into 4th floor, turn left, turn right, walk through the hallway — you will find MB403 above the door." },
      "1f": {
        staircase_1: "Go upstairs into the 2nd floor, go upstairs into 3rd floor, then go upstairs again into 4th floor, turn left, turn right, walk through the hallway — you will find MB403 above the door.",
        staircase_2: "Go upstairs into the 2nd floor, go upstairs into 3rd floor, then go upstairs again into 4th floor, turn right, then turn left, walk through the hallway — you will find MB403 above the door.",
      },
      "2f": {
        staircase_1: "Go upstairs into 3rd floor, then go upstairs again into 4th floor, turn left, turn right, walk through the hallway — you will find MB403 above the door.",
        staircase_2: "Go upstairs into 3rd floor, then go upstairs again into 4th floor, turn right, then turn left, walk through the hallway — you will find MB403 above the door.",
      },
      "3f": {
        staircase_1: "Go upstairs into 4th floor, turn left, turn right, walk through the hallway — you will find MB403 above the door.",
        staircase_2: "Go upstairs into 4th floor, turn right, then turn left, walk through the hallway — you will find MB403 above the door.",
      },
      "4f": {
        staircase_1: "You're almost there! From the stairs turn left, turn right, walk through the hallway — you will find MB403 above the door.",
        staircase_2: "You're almost there! From the stairs turn right, then turn left, walk through the hallway — you will find MB403 above the door.",
      },
    },

    "MB406": {
      gf: { staircase_1: "Go upstairs into the 1st floor, after going inside turn left and go upstairs into the 2nd floor, go upstairs into 3rd floor, then go upstairs again into 4th floor, turn left, turn right, walk through the hallway — you will find MB406 above the door." },
      "1f": {
        staircase_1: "Go upstairs into the 2nd floor, go upstairs into 3rd floor, then go upstairs again into 4th floor, turn left, turn right, walk through the hallway — you will find MB406 above the door.",
        staircase_2: "Go upstairs into the 2nd floor, go upstairs into 3rd floor, then go upstairs again into 4th floor, turn right, then turn left, walk through the hallway — you will find MB406 above the door.",
      },
      "2f": {
        staircase_1: "Go upstairs into 3rd floor, then go upstairs again into 4th floor, turn left, turn right, walk through the hallway — you will find MB406 above the door.",
        staircase_2: "Go upstairs into 3rd floor, then go upstairs again into 4th floor, turn right, then turn left, walk through the hallway — you will find MB406 above the door.",
      },
      "3f": {
        staircase_1: "Go upstairs into 4th floor, turn left, turn right, walk through the hallway — you will find MB406 above the door.",
        staircase_2: "Go upstairs into 4th floor, turn right, then turn left, walk through the hallway — you will find MB406 above the door.",
      },
      "4f": {
        staircase_1: "You're almost there! From the stairs turn left, turn right, walk through the hallway — you will find MB406 above the door.",
        staircase_2: "You're almost there! From the stairs turn right, then turn left, walk through the hallway — you will find MB406 above the door.",
      },
    },

    "MB407": {
      gf: { staircase_1: "Go upstairs into the 1st floor, after going inside turn left and go upstairs into the 2nd floor, go upstairs into 3rd floor, then go upstairs again into 4th floor, turn left, turn right, walk through the hallway — you will find MB407 above the door." },
      "1f": {
        staircase_1: "Go upstairs into the 2nd floor, go upstairs into 3rd floor, then go upstairs again into 4th floor, turn left, turn right, walk through the hallway — you will find MB407 above the door.",
        staircase_2: "Go upstairs into the 2nd floor, go upstairs into 3rd floor, then go upstairs again into 4th floor, turn right, then turn left, walk through the hallway — you will find MB407 above the door.",
      },
      "2f": {
        staircase_1: "Go upstairs into 3rd floor, then go upstairs again into 4th floor, turn left, turn right, walk through the hallway — you will find MB407 above the door.",
        staircase_2: "Go upstairs into 3rd floor, then go upstairs again into 4th floor, turn right, then turn left, walk through the hallway — you will find MB407 above the door.",
      },
      "3f": {
        staircase_1: "Go upstairs into 4th floor, turn left, turn right, walk through the hallway — you will find MB407 above the door.",
        staircase_2: "Go upstairs into 4th floor, turn right, then turn left, walk through the hallway — you will find MB407 above the door.",
      },
      "4f": {
        staircase_1: "You're almost there! From the stairs turn left, turn right, walk through the hallway — you will find MB407 above the door.",
        staircase_2: "You're almost there! From the stairs turn right, then turn left, walk through the hallway — you will find MB407 above the door.",
      },
    },

    "MB408": {
      gf: { staircase_1: "Go upstairs into the 1st floor, after going inside turn left and go upstairs into the 2nd floor, go upstairs into 3rd floor, then go upstairs again into 4th floor, turn left, turn right, walk through the hallway — you will find MB408 above the door." },
      "1f": {
        staircase_1: "Go upstairs into the 2nd floor, go upstairs into 3rd floor, then go upstairs again into 4th floor, turn left, turn right, walk through the hallway — you will find MB408 above the door.",
        staircase_2: "Go upstairs into the 2nd floor, go upstairs into 3rd floor, then go upstairs again into 4th floor, turn right, then turn left, walk through the hallway — you will find MB408 above the door.",
      },
      "2f": {
        staircase_1: "Go upstairs into 3rd floor, then go upstairs again into 4th floor, turn left, turn right, walk through the hallway — you will find MB408 above the door.",
        staircase_2: "Go upstairs into 3rd floor, then go upstairs again into 4th floor, turn right, then turn left, walk through the hallway — you will find MB408 above the door.",
      },
      "3f": {
        staircase_1: "Go upstairs into 4th floor, turn left, turn right, walk through the hallway — you will find MB408 above the door.",
        staircase_2: "Go upstairs into 4th floor, turn right, then turn left, walk through the hallway — you will find MB408 above the door.",
      },
      "4f": {
        staircase_1: "You're almost there! From the stairs turn left, turn right, walk through the hallway — you will find MB408 above the door.",
        staircase_2: "You're almost there! From the stairs turn right, then turn left, walk through the hallway — you will find MB408 above the door.",
      },
    },

    "MB409": {
      gf: { staircase_1: "Go upstairs into the 1st floor, after going inside turn left and go upstairs into the 2nd floor, go upstairs into 3rd floor, then go upstairs again into 4th floor, turn left, turn right, walk through the hallway — you will find MB409 above the door." },
      "1f": {
        staircase_1: "Go upstairs into the 2nd floor, go upstairs into 3rd floor, then go upstairs again into 4th floor, turn left, turn right, walk through the hallway — you will find MB409 above the door.",
        staircase_2: "Go upstairs into the 2nd floor, go upstairs into 3rd floor, then go upstairs again into 4th floor, turn right, then turn left, walk through the hallway — you will find MB409 above the door.",
      },
      "2f": {
        staircase_1: "Go upstairs into 3rd floor, then go upstairs again into 4th floor, turn left, turn right, walk through the hallway — you will find MB409 above the door.",
        staircase_2: "Go upstairs into 3rd floor, then go upstairs again into 4th floor, turn right, then turn left, walk through the hallway — you will find MB409 above the door.",
      },
      "3f": {
        staircase_1: "Go upstairs into 4th floor, turn left, turn right, walk through the hallway — you will find MB409 above the door.",
        staircase_2: "Go upstairs into 4th floor, turn right, then turn left, walk through the hallway — you will find MB409 above the door.",
      },
      "4f": {
        staircase_1: "You're almost there! From the stairs turn left, turn right, walk through the hallway — you will find MB409 above the door.",
        staircase_2: "You're almost there! From the stairs turn right, then turn left, walk through the hallway — you will find MB409 above the door.",
      },
    },

    "MB410": {
      gf: { staircase_1: "Go upstairs into the 1st floor, after going inside turn left and go upstairs into the 2nd floor, go upstairs into 3rd floor, then go upstairs again into 4th floor, turn left, turn right, walk through the hallway — you will find MB410 above the door." },
      "1f": {
        staircase_1: "Go upstairs into the 2nd floor, go upstairs into 3rd floor, then go upstairs again into 4th floor, turn left, turn right, walk through the hallway — you will find MB410 above the door.",
        staircase_2: "Go upstairs into the 2nd floor, go upstairs into 3rd floor, then go upstairs again into 4th floor, turn right, then turn left, walk through the hallway — you will find MB410 above the door.",
      },
      "2f": {
        staircase_1: "Go upstairs into 3rd floor, then go upstairs again into 4th floor, turn left, turn right, walk through the hallway — you will find MB410 above the door.",
        staircase_2: "Go upstairs into 3rd floor, then go upstairs again into 4th floor, turn right, then turn left, walk through the hallway — you will find MB410 above the door.",
      },
      "3f": {
        staircase_1: "Go upstairs into 4th floor, turn left, turn right, walk through the hallway — you will find MB410 above the door.",
        staircase_2: "Go upstairs into 4th floor, turn right, then turn left, walk through the hallway — you will find MB410 above the door.",
      },
      "4f": {
        staircase_1: "You're almost there! From the stairs turn left, turn right, walk through the hallway — you will find MB410 above the door.",
        staircase_2: "You're almost there! From the stairs turn right, then turn left, walk through the hallway — you will find MB410 above the door.",
      },
    },

    "Typing Room": {
      gf: { staircase_1: "Go upstairs into the 1st floor, after going inside turn left and go upstairs into the 2nd floor, then go upstairs again into 3rd floor. Lastly, go upstairs into the 4th floor and then turn left — you will find the Typing Room." },
      "1f": {
        staircase_1: "Go upstairs into the 2nd floor, then go upstairs again into 3rd floor, lastly go upstairs into the 4th floor and then turn left — you will find the Typing Room.",
        staircase_2: "Go upstairs into the 2nd floor, then go upstairs again into 3rd floor, lastly go upstairs into the 4th floor and then turn right, then turn left, at the end of the hallway turn left — you will find Typing Room.",
      },
      "2f": {
        staircase_1: "Go upstairs into 3rd floor, go upstairs into the 4th floor and then turn left — you will find Typing Room.",
        staircase_2: "Go upstairs into 3rd floor, go upstairs into the 4th floor and then turn right, then turn left, at the end of the hallway turn left — you will find Typing Room.",
      },
      "3f": {
        staircase_1: "Go upstairs into 4th floor, turn left — you will find Typing Room.",
        staircase_2: "Go upstairs into 4th floor, turn right, then turn left, at the end of the hallway turn left — you will find Typing Room.",
      },
      "4f": {
        staircase_1: "You're almost there! From the stairs turn left — you will find Typing Room.",
        staircase_2: "You're almost there! From the stairs turn right, then turn left, at the end of the hallway turn left — you will find Typing Room.",
      },
    },

    "Nursing Skills Lab": {
      gf: { staircase_1: "Go upstairs into the 1st floor, after going inside turn left and go upstairs into the 2nd floor, go upstairs into 3rd floor, then go upstairs again into 4th floor, turn left, turn right, walk through the hallway, then turn right — you will find Nursing Skills Lab above the door." },
      "1f": {
        staircase_1: "Go upstairs into the 2nd floor, go upstairs into 3rd floor, then go upstairs again into 4th floor, turn left, turn right, walk through the hallway, then turn right — you will find Nursing Skills Lab above the door.",
        staircase_2: "Go upstairs into the 2nd floor, go upstairs into 3rd floor, then go upstairs again into 4th floor, turn right — you will find Nursing Skills Lab above the door.",
      },
      "2f": {
        staircase_1: "Go upstairs into 3rd floor, then go upstairs again into 4th floor, turn left, turn right, walk through the hallway, then turn right — you will find Nursing Skills Lab above the door.",
        staircase_2: "Go upstairs into 3rd floor, then go upstairs again into 4th floor, turn right — you will find Nursing Skills Lab above the door.",
      },
      "3f": {
        staircase_1: "Go upstairs into 4th floor, turn left, turn right, walk through the hallway, then turn right — you will find Nursing Skills Lab above the door.",
        staircase_2: "Go upstairs into 4th floor, turn right — you will find Nursing Skills Lab above the door.",
      },
      "4f": {
        staircase_1: "You're almost there! From the stairs turn left, turn right, walk through the hallway, then turn right — you will find Nursing Skills Lab above the door.",
        staircase_2: "You're almost there! From the stairs turn right — you will find Nursing Skills Lab above the door.",
      },
    },

    "Nursing Demo Room": {
      gf: { staircase_1: "Go upstairs into the 1st floor, after going inside turn left and go upstairs into the 2nd floor, go upstairs into 3rd floor, then go upstairs again into 4th floor, turn left, turn right, walk through the hallway, then turn right — you will find Nursing Demo Room above the door." },
      "1f": {
        staircase_1: "Go upstairs into the 2nd floor, go upstairs into 3rd floor, then go upstairs again into 4th floor, turn left, turn right, walk through the hallway, then turn right — you will find Nursing Demo Room above the door.",
        staircase_2: "Go upstairs into the 2nd floor, go upstairs into 3rd floor, then go upstairs again into 4th floor, turn right — you will find Nursing Demo Room above the door.",
      },
      "2f": {
        staircase_1: "Go upstairs into 3rd floor, then go upstairs again into 4th floor, turn left, turn right, walk through the hallway, then turn right — you will find Nursing Demo Room above the door.",
        staircase_2: "Go upstairs into 3rd floor, then go upstairs again into 4th floor, turn right — you will find Nursing Demo Room above the door.",
      },
      "3f": {
        staircase_1: "Go upstairs into 4th floor, turn left, turn right, walk through the hallway, then turn right — you will find Nursing Demo Room above the door.",
        staircase_2: "Go upstairs into 4th floor, turn right — you will find Nursing Demo Room above the door.",
      },
      "4f": {
        staircase_1: "You're almost there! From the stairs turn left, turn right, walk through the hallway, then turn right — you will find Nursing Demo Room above the door.",
        staircase_2: "You're almost there! From the stairs turn right — you will find Nursing Demo Room above the door.",
      },
    },

    "Caregiving Lecture Room": {
      gf: { staircase_1: "Go upstairs into the 1st floor, after going inside turn left and go upstairs into the 2nd floor, go upstairs into 3rd floor, then go upstairs again into 4th floor, turn left, turn right, walk through the hallway, then turn right — you will find Caregiving Lecture Room above the door." },
      "1f": {
        staircase_1: "Go upstairs into the 2nd floor, go upstairs into 3rd floor, then go upstairs again into 4th floor, turn left, turn right, walk through the hallway, then turn right — you will find Caregiving Lecture Room above the door.",
        staircase_2: "Go upstairs into the 2nd floor, go upstairs into 3rd floor, then go upstairs again into 4th floor, turn right — you will find Caregiving Lecture Room above the door.",
      },
      "2f": {
        staircase_1: "Go upstairs into 3rd floor, then go upstairs again into 4th floor, turn left, turn right, walk through the hallway, then turn right — you will find Caregiving Lecture Room above the door.",
        staircase_2: "Go upstairs into 3rd floor, then go upstairs again into 4th floor, turn right — you will find Caregiving Lecture Room above the door.",
      },
      "3f": {
        staircase_1: "Go upstairs into 4th floor, turn left, turn right, walk through the hallway, then turn right — you will find Caregiving Lecture Room above the door.",
        staircase_2: "Go upstairs into 4th floor, turn right — you will find Caregiving Lecture Room above the door.",
      },
      "4f": {
        staircase_1: "You're almost there! From the stairs turn left, turn right, walk through the hallway, then turn right — you will find Caregiving Lecture Room above the door.",
        staircase_2: "You're almost there! From the stairs turn right — you will find Caregiving Lecture Room above the door.",
      },
    },

    "Caregiving Mock Room": {
      gf: { staircase_1: "Go upstairs into the 1st floor, after going inside turn left and go upstairs into the 2nd floor, go upstairs into 3rd floor, then go upstairs again into 4th floor, turn left, turn right, walk through the hallway — you will find Caregiving Mock Room above the door." },
      "1f": {
        staircase_1: "Go upstairs into the 2nd floor, go upstairs into 3rd floor, then go upstairs again into 4th floor, turn left, turn right, walk through the hallway — you will find Caregiving Mock Room above the door.",
        staircase_2: "Go upstairs into the 2nd floor, go upstairs into 3rd floor, then go upstairs again into 4th floor, turn right, then turn left — you will find Caregiving Mock Room above the door.",
      },
      "2f": {
        staircase_1: "Go upstairs into 3rd floor, then go upstairs again into 4th floor, turn left, turn right, walk through the hallway — you will find Caregiving Mock Room above the door.",
        staircase_2: "Go upstairs into 3rd floor, then go upstairs again into 4th floor, turn right, then turn left — you will find Caregiving Mock Room above the door.",
      },
      "3f": {
        staircase_1: "Go upstairs into 4th floor, turn left, turn right, walk through the hallway — you will find Caregiving Mock Room above the door.",
        staircase_2: "Go upstairs into 4th floor, turn right, then turn left — you will find Caregiving Mock Room above the door.",
      },
      "4f": {
        staircase_1: "You're almost there! From the stairs turn left, turn right, walk through the hallway — you will find Caregiving Mock Room above the door.",
        staircase_2: "You're almost there! From the stairs turn right, then turn left — you will find Caregiving Mock Room above the door.",
      },
    },

    "Midwifery Skills Lab": {
      gf: { staircase_1: "Go upstairs into the 1st floor, after going inside turn left and go upstairs into the 2nd floor, go upstairs into 3rd floor, then go upstairs again into 4th floor, turn left, turn right, walk through the hallway, then turn right — you will find Midwifery Skills Lab above the door." },
      "1f": {
        staircase_1: "Go upstairs into the 2nd floor, go upstairs into 3rd floor, then go upstairs again into 4th floor, turn left, turn right, walk through the hallway, then turn right — you will find Midwifery Skills Lab above the door.",
        staircase_2: "Go upstairs into the 2nd floor, go upstairs into 3rd floor, then go upstairs again into 4th floor, turn right — you will find Midwifery Skills Lab above the door.",
      },
      "2f": {
        staircase_1: "Go upstairs into 3rd floor, then go upstairs again into 4th floor, turn left, turn right, walk through the hallway, then turn right — you will find Midwifery Skills Lab above the door.",
        staircase_2: "Go upstairs into 3rd floor, then go upstairs again into 4th floor, turn right — you will find Midwifery Skills Lab above the door.",
      },
      "3f": {
        staircase_1: "Go upstairs into 4th floor, turn left, turn right, walk through the hallway, then turn right — you will find Midwifery Skills Lab above the door.",
        staircase_2: "Go upstairs into 4th floor, turn right — you will find Midwifery Skills Lab above the door.",
      },
      "4f": {
        staircase_1: "You're almost there! From the stairs turn left, turn right, walk through the hallway, then turn right — you will find Midwifery Skills Lab above the door.",
        staircase_2: "You're almost there! From the stairs turn right — you will find Midwifery Skills Lab above the door.",
      },
    },

  }, // end main_building

  // ── NEW BUILDING (Potenciano Hall) ─────────────────────────────────────────
  // Single RFID entrance, two internal staircases.
  // Key: "any" for the RFID/1F entry point; "staircase_1" / "staircase_2" for the two internal stairs.
  new_building: {

    // ════ 1ST FLOOR ROOMS ════

    "Admission Office": {
      "1f": { any: "You're almost there! From the RFID turn left — at the end of the hallway you will see the Admission Office sign above the door." },
      "2f": {
        staircase_1: "Go downstairs, turn right — you will see the Admission Office sign above the door.",
        staircase_2: "Go downstairs, turn left, passing the RFID. At the far end of the hallway you will see the Admission Office sign above the door.",
      },
    },

    "Corporate Communication Office (CCO)": {
      "1f": { any: "You're almost there! From the RFID turn left — at the end of the hallway you will see the Corporate Communication Office (CCO) sign above the door." },
      "2f": {
        staircase_1: "Go downstairs, turn right — you will see the Corporate Communication Office (CCO) sign above the door.",
        staircase_2: "Go downstairs, turn left, passing the RFID. At the far end of the hallway you will see the Corporate Communication Office (CCO) sign above the door.",
      },
    },

    "SAHS Administrative Office": {
      "1f": { any: "You're almost there! From the RFID turn left — at the end of the hallway you will see the SAHS Administrative Office sign above the door." },
      "2f": {
        staircase_1: "Go downstairs, turn right — you will see the SAHS Administrative Office sign above the door.",
        staircase_2: "Go downstairs, turn left, passing the RFID. At the far end of the hallway you will see the SAHS Administrative Office sign above the door.",
      },
    },

    "Integrated Basic Education Department Principal Office": {
      "1f": { any: "You're almost there! From the RFID turn left — at the end of the hallway you will see the Integrated Basic Education Department Principal Office sign above the door." },
      "2f": {
        staircase_1: "Go downstairs, turn right — you will see the Integrated Basic Education Department Principal Office sign above the door.",
        staircase_2: "Go downstairs, turn left, passing the RFID. At the far end of the hallway you will see the Integrated Basic Education Department Principal Office sign above the door.",
      },
    },

    "Physical Therapy Clinic": {
      "1f": { any: "You're almost there! From the RFID turn right — you will see the Physical Therapy Clinic sign above the door." },
      "2f": {
        staircase_1: "Go downstairs, turn right, pass the RFID in the hallway — you will see the Physical Therapy Clinic sign above the door at the other side of the building.",
        staircase_2: "Go downstairs, turn left — you will see the Physical Therapy Clinic sign above the door.",
      },
    },

    "NB105 — Cashier / Registrar / Assessment": {
      "1f": { any: "You're almost there! From the RFID turn right — you will see the NB105 — Cashier / Registrar / Assessment sign above the door." },
      "2f": {
        staircase_1: "Go downstairs, turn right, pass the RFID in the hallway — you will see the NB105 — Cashier / Registrar / Assessment sign above the door at the other side of the building.",
        staircase_2: "Go downstairs, turn left — you will see the NB105 — Cashier / Registrar / Assessment sign above the door.",
      },
    },

    "NB106 — For Interview": {
      "1f": { any: "You're almost there! From the RFID turn right — you will see the NB106 — For Interview sign above the door." },
      "2f": {
        staircase_1: "Go downstairs, turn right, pass the RFID in the hallway — you will see the NB106 — For Interview sign above the door at the other side of the building.",
        staircase_2: "Go downstairs, turn left — you will see the NB106 — For Interview sign above the door.",
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
      gf: { staircase_1: "You're almost there! Go upstairs into the 1st floor — after turning right you will find the Assessment Center Cookery NC II." },
      "1f": {
        staircase_1: "You're almost there! From the stairs turn right — you will see it.",
        staircase_2: "You're almost there! From the stairs turn left — you will see it.",
      },
      "2f": {
        staircase_1: "Go down the stairs into the 1st floor, turn right — you will see it.",
        staircase_2: "Go down the stairs into the 1st floor, turn left — you will see it.",
      },
      "3f": {
        staircase_1: "Go down the stairs into the 2nd floor, go down the stairs into the 1st floor, turn right — you will see it.",
        staircase_2: "Go down the stairs into the 2nd floor, go down the stairs into the 1st floor, turn left — you will see it.",
      },
      "4f": {
        staircase_1: "Go down the stairs into the 3rd floor, go down the stairs into the 2nd floor, go down the stairs into the 1st floor, turn right — you will see it.",
        staircase_2: "Go down the stairs into the 3rd floor, go down the stairs into the 2nd floor, go down the stairs into the 1st floor, turn left — you will see it.",
      },
    },

    // ════ 2ND FLOOR ROOMS ════

    "Restaurant": {
      gf: { staircase_1: "Go upstairs into the 1st floor, go upstairs again into the 2nd floor — you will find it after turning right." },
      "1f": {
        staircase_1: "From the stairs, go upstairs into the 2nd floor, then turn right — you will see it.",
        staircase_2: "This facility is not accessible via Staircase 2. Please use Staircase 1 (Front Entrance) instead.",
      },
      "2f": {
        staircase_1: "You're almost there! Turn right — you will see it.",
        staircase_2: "This facility is not accessible via Staircase 2. Please use Staircase 1 (Front Entrance) instead.",
      },
      "3f": {
        staircase_1: "Go down the stairs into the 2nd floor, turn right — you will see it.",
        staircase_2: "This facility is not accessible via Staircase 2. Please use Staircase 1 (Front Entrance) instead.",
      },
      "4f": {
        staircase_1: "Go down the stairs into the 3rd floor, go down the stairs into the 2nd floor, go down the stairs into the 1st floor, turn right — you will see it.",
        staircase_2: "This facility is not accessible via Staircase 2. Please use Staircase 1 (Front Entrance) instead.",
      },
    },

    // ════ 3RD FLOOR ROOMS ════

    "Room EA301": {
      gf: { staircase_1: "Go upstairs into the 1st floor, go upstairs again into the 2nd floor, and again into the 3rd floor — you will find Room EA301 after turning right." },
      "1f": {
        staircase_1: "Go upstairs into the 2nd floor, go upstairs again into the 3rd floor — you will find Room EA301 after turning right.",
        staircase_2: "Go upstairs into the 2nd floor, go upstairs again into the 3rd floor, turn left — through the hallway you will find Room EA301.",
      },
      "2f": {
        staircase_1: "Go upstairs into the 3rd floor, turn right — you will find Room EA301.",
        staircase_2: "Go upstairs into the 3rd floor, turn left — through the hallway you will find Room EA301.",
      },
      "3f": {
        staircase_1: "You're almost there! From the stairs turn right — you will find Room EA301.",
        staircase_2: "You're almost there! From the stairs turn left — through the hallway you will find Room EA301.",
      },
      "4f": {
        staircase_1: "Go down the stairs into the 3rd floor, turn right — you will find Room EA301.",
        staircase_2: "Go down the stairs into the 3rd floor, turn left — through the hallway you will find Room EA301.",
      },
    },

    "Room EA302": {
      gf: { staircase_1: "Go upstairs into the 1st floor, go upstairs again into the 2nd floor, and again into the 3rd floor — you will find Room EA302 after turning right." },
      "1f": {
        staircase_1: "Go upstairs into the 2nd floor, go upstairs again into the 3rd floor — you will find Room EA302 after turning right.",
        staircase_2: "Go upstairs into the 2nd floor, go upstairs again into the 3rd floor, turn left — through the hallway you will find Room EA302.",
      },
      "2f": {
        staircase_1: "Go upstairs into the 3rd floor, turn right — you will find Room EA302.",
        staircase_2: "Go upstairs into the 3rd floor, turn left — through the hallway you will find Room EA302.",
      },
      "3f": {
        staircase_1: "You're almost there! From the stairs turn right — you will find Room EA302.",
        staircase_2: "You're almost there! From the stairs turn left — through the hallway you will find Room EA302.",
      },
      "4f": {
        staircase_1: "Go down the stairs into the 3rd floor, turn right — you will find Room EA302.",
        staircase_2: "Go down the stairs into the 3rd floor, turn left — through the hallway you will find Room EA302.",
      },
    },

    "Room EA303": {
      gf: { staircase_1: "Go upstairs into the 1st floor, go upstairs again into the 2nd floor, and again into the 3rd floor — you will find Room EA303 after turning right." },
      "1f": {
        staircase_1: "Go upstairs into the 2nd floor, go upstairs again into the 3rd floor — you will find Room EA303 after turning right.",
        staircase_2: "Go upstairs into the 2nd floor, go upstairs again into the 3rd floor, turn left — through the hallway you will find Room EA303.",
      },
      "2f": {
        staircase_1: "Go upstairs into the 3rd floor, turn right — you will find Room EA303.",
        staircase_2: "Go upstairs into the 3rd floor, turn left — through the hallway you will find Room EA303.",
      },
      "3f": {
        staircase_1: "You're almost there! From the stairs turn right — you will find Room EA303.",
        staircase_2: "You're almost there! From the stairs turn left — through the hallway you will find Room EA303.",
      },
      "4f": {
        staircase_1: "Go down the stairs into the 3rd floor, turn right — you will find Room EA303.",
        staircase_2: "Go down the stairs into the 3rd floor, turn left — through the hallway you will find Room EA303.",
      },
    },

    "Room EA304": {
      gf: { staircase_1: "Go upstairs into the 1st floor, go upstairs again into the 2nd floor, and again into the 3rd floor — you will find Room EA304 after turning right." },
      "1f": {
        staircase_1: "Go upstairs into the 2nd floor, go upstairs again into the 3rd floor — you will find Room EA304 after turning right.",
        staircase_2: "Go upstairs into the 2nd floor, go upstairs again into the 3rd floor, turn left — through the hallway you will find Room EA304.",
      },
      "2f": {
        staircase_1: "Go upstairs into the 3rd floor, turn right — you will find Room EA304.",
        staircase_2: "Go upstairs into the 3rd floor, turn left — through the hallway you will find Room EA304.",
      },
      "3f": {
        staircase_1: "You're almost there! From the stairs turn right — you will find Room EA304.",
        staircase_2: "You're almost there! From the stairs turn left — through the hallway you will find Room EA304.",
      },
      "4f": {
        staircase_1: "Go down the stairs into the 3rd floor, turn right — you will find Room EA304.",
        staircase_2: "Go down the stairs into the 3rd floor, turn left — through the hallway you will find Room EA304.",
      },
    },

    "Room EA305": {
      gf: { staircase_1: "Go upstairs into the 1st floor, go upstairs again into the 2nd floor, and again into the 3rd floor — you will find Room EA305 after turning right." },
      "1f": {
        staircase_1: "Go upstairs into the 2nd floor, go upstairs again into the 3rd floor — you will find Room EA305 after turning right.",
        staircase_2: "Go upstairs into the 2nd floor, go upstairs again into the 3rd floor, turn left — through the hallway you will find Room EA305.",
      },
      "2f": {
        staircase_1: "Go upstairs into the 3rd floor, turn right — you will find Room EA305.",
        staircase_2: "Go upstairs into the 3rd floor, turn left — through the hallway you will find Room EA305.",
      },
      "3f": {
        staircase_1: "You're almost there! From the stairs turn right — you will find Room EA305.",
        staircase_2: "You're almost there! From the stairs turn left — through the hallway you will find Room EA305.",
      },
      "4f": {
        staircase_1: "Go down the stairs into the 3rd floor, turn right — you will find Room EA305.",
        staircase_2: "Go down the stairs into the 3rd floor, turn left — through the hallway you will find Room EA305.",
      },
    },

    "Room EA306": {
      gf: { staircase_1: "Go upstairs into the 1st floor, go upstairs again into the 2nd floor, and again into the 3rd floor — you will find Room EA306 after turning right." },
      "1f": {
        staircase_1: "Go upstairs into the 2nd floor, go upstairs again into the 3rd floor — you will find Room EA306 after turning right.",
        staircase_2: "Go upstairs into the 2nd floor, go upstairs again into the 3rd floor, turn left — through the hallway you will find Room EA306.",
      },
      "2f": {
        staircase_1: "Go upstairs into the 3rd floor, turn right — you will find Room EA306.",
        staircase_2: "Go upstairs into the 3rd floor, turn left — through the hallway you will find Room EA306.",
      },
      "3f": {
        staircase_1: "You're almost there! From the stairs turn right — you will find Room EA306.",
        staircase_2: "You're almost there! From the stairs turn left — through the hallway you will find Room EA306.",
      },
      "4f": {
        staircase_1: "Go down the stairs into the 3rd floor, turn right — you will find Room EA306.",
        staircase_2: "Go down the stairs into the 3rd floor, turn left — through the hallway you will find Room EA306.",
      },
    },

    "Room EA307": {
      gf: { staircase_1: "Go upstairs into the 1st floor, go upstairs again into the 2nd floor, and again into the 3rd floor — you will find Room EA307 after turning right." },
      "1f": {
        staircase_1: "Go upstairs into the 2nd floor, go upstairs again into the 3rd floor — you will find Room EA307 after turning right.",
        staircase_2: "Go upstairs into the 2nd floor, go upstairs again into the 3rd floor, turn left — through the hallway you will find Room EA307.",
      },
      "2f": {
        staircase_1: "Go upstairs into the 3rd floor, turn right — you will find Room EA307.",
        staircase_2: "Go upstairs into the 3rd floor, turn left — through the hallway you will find Room EA307.",
      },
      "3f": {
        staircase_1: "You're almost there! From the stairs turn right — you will find Room EA307.",
        staircase_2: "You're almost there! From the stairs turn left — through the hallway you will find Room EA307.",
      },
      "4f": {
        staircase_1: "Go down the stairs into the 3rd floor, turn right — you will find Room EA307.",
        staircase_2: "Go down the stairs into the 3rd floor, turn left — through the hallway you will find Room EA307.",
      },
    },

    // ════ 4TH FLOOR ROOMS ════

    "Room EA401": {
      gf: { staircase_1: "Go upstairs into the 1st floor, go upstairs again into the 2nd floor, go upstairs into the 3rd floor, go upstairs again into the 4th floor — you will find Room EA401 after turning right." },
      "1f": {
        staircase_1: "Go upstairs into the 2nd floor, go upstairs into the 3rd floor, go upstairs again into the 4th floor — you will find Room EA401 after turning right.",
        staircase_2: "Go upstairs into the 2nd floor, go upstairs into the 3rd floor, go upstairs again into the 4th floor, turn left — through the hallway you will find Room EA401.",
      },
      "2f": {
        staircase_1: "Go upstairs into the 3rd floor, go upstairs again into the 4th floor, turn right — you will find Room EA401.",
        staircase_2: "Go upstairs into the 3rd floor, go upstairs again into the 4th floor, turn left — through the hallway you will find Room EA401.",
      },
      "3f": {
        staircase_1: "Go upstairs into the 4th floor, turn right — you will find Room EA401.",
        staircase_2: "Go upstairs into the 4th floor, turn left — through the hallway you will find Room EA401.",
      },
      "4f": {
        staircase_1: "You're almost there! From the stairs turn right — you will find Room EA401.",
        staircase_2: "You're almost there! From the stairs turn left — through the hallway you will find Room EA401.",
      },
    },

    "Room EA402": {
      gf: { staircase_1: "Go upstairs into the 1st floor, go upstairs again into the 2nd floor, go upstairs into the 3rd floor, go upstairs again into the 4th floor — you will find Room EA402 after turning right." },
      "1f": {
        staircase_1: "Go upstairs into the 2nd floor, go upstairs into the 3rd floor, go upstairs again into the 4th floor — you will find Room EA402 after turning right.",
        staircase_2: "Go upstairs into the 2nd floor, go upstairs into the 3rd floor, go upstairs again into the 4th floor, turn left — through the hallway you will find Room EA402.",
      },
      "2f": {
        staircase_1: "Go upstairs into the 3rd floor, go upstairs again into the 4th floor, turn right — you will find Room EA402.",
        staircase_2: "Go upstairs into the 3rd floor, go upstairs again into the 4th floor, turn left — through the hallway you will find Room EA402.",
      },
      "3f": {
        staircase_1: "Go upstairs into the 4th floor, turn right — you will find Room EA402.",
        staircase_2: "Go upstairs into the 4th floor, turn left — through the hallway you will find Room EA402.",
      },
      "4f": {
        staircase_1: "You're almost there! From the stairs turn right — you will find Room EA402.",
        staircase_2: "You're almost there! From the stairs turn left — through the hallway you will find Room EA402.",
      },
    },

    "Room EA403": {
      gf: { staircase_1: "Go upstairs into the 1st floor, go upstairs again into the 2nd floor, go upstairs into the 3rd floor, go upstairs again into the 4th floor — you will find Room EA403 after turning right." },
      "1f": {
        staircase_1: "Go upstairs into the 2nd floor, go upstairs into the 3rd floor, go upstairs again into the 4th floor — you will find Room EA403 after turning right.",
        staircase_2: "Go upstairs into the 2nd floor, go upstairs into the 3rd floor, go upstairs again into the 4th floor, turn left — through the hallway you will find Room EA403.",
      },
      "2f": {
        staircase_1: "Go upstairs into the 3rd floor, go upstairs again into the 4th floor, turn right — you will find Room EA403.",
        staircase_2: "Go upstairs into the 3rd floor, go upstairs again into the 4th floor, turn left — through the hallway you will find Room EA403.",
      },
      "3f": {
        staircase_1: "Go upstairs into the 4th floor, turn right — you will find Room EA403.",
        staircase_2: "Go upstairs into the 4th floor, turn left — through the hallway you will find Room EA403.",
      },
      "4f": {
        staircase_1: "You're almost there! From the stairs turn right — you will find Room EA403.",
        staircase_2: "You're almost there! From the stairs turn left — through the hallway you will find Room EA403.",
      },
    },

    "Room EA404": {
      gf: { staircase_1: "Go upstairs into the 1st floor, go upstairs again into the 2nd floor, go upstairs into the 3rd floor, go upstairs again into the 4th floor — you will find Room EA404 after turning right." },
      "1f": {
        staircase_1: "Go upstairs into the 2nd floor, go upstairs into the 3rd floor, go upstairs again into the 4th floor — you will find Room EA404 after turning right.",
        staircase_2: "Go upstairs into the 2nd floor, go upstairs into the 3rd floor, go upstairs again into the 4th floor, turn left — through the hallway you will find Room EA404.",
      },
      "2f": {
        staircase_1: "Go upstairs into the 3rd floor, go upstairs again into the 4th floor, turn right — you will find Room EA404.",
        staircase_2: "Go upstairs into the 3rd floor, go upstairs again into the 4th floor, turn left — through the hallway you will find Room EA404.",
      },
      "3f": {
        staircase_1: "Go upstairs into the 4th floor, turn right — you will find Room EA404.",
        staircase_2: "Go upstairs into the 4th floor, turn left — through the hallway you will find Room EA404.",
      },
      "4f": {
        staircase_1: "You're almost there! From the stairs turn right — you will find Room EA404.",
        staircase_2: "You're almost there! From the stairs turn left — through the hallway you will find Room EA404.",
      },
    },

    "Room EA405": {
      gf: { staircase_1: "Go upstairs into the 1st floor, go upstairs again into the 2nd floor, go upstairs into the 3rd floor, go upstairs again into the 4th floor — you will find Room EA405 after turning right." },
      "1f": {
        staircase_1: "Go upstairs into the 2nd floor, go upstairs into the 3rd floor, go upstairs again into the 4th floor — you will find Room EA405 after turning right.",
        staircase_2: "Go upstairs into the 2nd floor, go upstairs into the 3rd floor, go upstairs again into the 4th floor, turn left — through the hallway you will find Room EA405.",
      },
      "2f": {
        staircase_1: "Go upstairs into the 3rd floor, go upstairs again into the 4th floor, turn right — you will find Room EA405.",
        staircase_2: "Go upstairs into the 3rd floor, go upstairs again into the 4th floor, turn left — through the hallway you will find Room EA405.",
      },
      "3f": {
        staircase_1: "Go upstairs into the 4th floor, turn right — you will find Room EA405.",
        staircase_2: "Go upstairs into the 4th floor, turn left — through the hallway you will find Room EA405.",
      },
      "4f": {
        staircase_1: "You're almost there! From the stairs turn right — you will find Room EA405.",
        staircase_2: "You're almost there! From the stairs turn left — through the hallway you will find Room EA405.",
      },
    },

    "Room EA406": {
      gf: { staircase_1: "Go upstairs into the 1st floor, go upstairs again into the 2nd floor, go upstairs into the 3rd floor, go upstairs again into the 4th floor — you will find Room EA406 after turning right." },
      "1f": {
        staircase_1: "Go upstairs into the 2nd floor, go upstairs into the 3rd floor, go upstairs again into the 4th floor — you will find Room EA406 after turning right.",
        staircase_2: "Go upstairs into the 2nd floor, go upstairs into the 3rd floor, go upstairs again into the 4th floor, turn left — through the hallway you will find Room EA406.",
      },
      "2f": {
        staircase_1: "Go upstairs into the 3rd floor, go upstairs again into the 4th floor, turn right — you will find Room EA406.",
        staircase_2: "Go upstairs into the 3rd floor, go upstairs again into the 4th floor, turn left — through the hallway you will find Room EA406.",
      },
      "3f": {
        staircase_1: "Go upstairs into the 4th floor, turn right — you will find Room EA406.",
        staircase_2: "Go upstairs into the 4th floor, turn left — through the hallway you will find Room EA406.",
      },
      "4f": {
        staircase_1: "You're almost there! From the stairs turn right — you will find Room EA406.",
        staircase_2: "You're almost there! From the stairs turn left — through the hallway you will find Room EA406.",
      },
    },

    "Room EA407": {
      gf: { staircase_1: "Go upstairs into the 1st floor, go upstairs again into the 2nd floor, go upstairs into the 3rd floor, go upstairs again into the 4th floor — you will find Room EA407 after turning right." },
      "1f": {
        staircase_1: "Go upstairs into the 2nd floor, go upstairs into the 3rd floor, go upstairs again into the 4th floor — you will find Room EA407 after turning right.",
        staircase_2: "Go upstairs into the 2nd floor, go upstairs into the 3rd floor, go upstairs again into the 4th floor, turn left — through the hallway you will find Room EA407.",
      },
      "2f": {
        staircase_1: "Go upstairs into the 3rd floor, go upstairs again into the 4th floor, turn right — you will find Room EA407.",
        staircase_2: "Go upstairs into the 3rd floor, go upstairs again into the 4th floor, turn left — through the hallway you will find Room EA407.",
      },
      "3f": {
        staircase_1: "Go upstairs into the 4th floor, turn right — you will find Room EA407.",
        staircase_2: "Go upstairs into the 4th floor, turn left — through the hallway you will find Room EA407.",
      },
      "4f": {
        staircase_1: "You're almost there! From the stairs turn right — you will find Room EA407.",
        staircase_2: "You're almost there! From the stairs turn left — through the hallway you will find Room EA407.",
      },
    },

    "Office": {
      gf: { staircase_1: "Go upstairs into the 1st floor, go upstairs again into the 2nd floor, go upstairs into the 3rd floor, go upstairs again into the 4th floor — you will find the Office after turning right." },
      "1f": {
        staircase_1: "Go upstairs into the 2nd floor, go upstairs into the 3rd floor, go upstairs again into the 4th floor — you will find the Office after turning right.",
        staircase_2: "Go upstairs into the 2nd floor, go upstairs into the 3rd floor, go upstairs again into the 4th floor, turn left — through the hallway you will find the Office.",
      },
      "2f": {
        staircase_1: "Go upstairs into the 3rd floor, go upstairs again into the 4th floor, turn right — you will find the Office.",
        staircase_2: "Go upstairs into the 3rd floor, go upstairs again into the 4th floor, turn left — through the hallway you will find the Office.",
      },
      "3f": {
        staircase_1: "Go upstairs into the 4th floor, turn right — you will find the Office.",
        staircase_2: "Go upstairs into the 4th floor, turn left — through the hallway you will find the Office.",
      },
      "4f": {
        staircase_1: "You're almost there! From the stairs turn right — you will find the Office.",
        staircase_2: "You're almost there! From the stairs turn left — through the hallway you will find the Office.",
      },
    },

  }, // end ea_tower

  // ── SR BUILDING ────────────────────────────────────────────────────────────
  // Floors: GF, 2F, 3F  |  Staircases: S1, S2
  sr_building: {

    // ════ GROUND FLOOR ROOMS ════

    "College of Dentistry Simulation Lab 1": {
      gf: {
        staircase_1: "You're almost there! From the stairs, turn right — through the hall you will find the Dentistry Simulation Lab 1.",
        staircase_2: "You're almost there! From the stairs, turn left — through the hall you will find the Dentistry Simulation Lab 1.",
      },
      "2f": {
        staircase_1: "From the stairs, go down the stairs, then turn left — through the hall you will find the Dentistry Simulation Lab 1.",
        staircase_2: "From the stairs, go down the stairs, then turn right — through the hall you will find the Dentistry Simulation Lab 1.",
      },
      "3f": {
        staircase_1: "From the stairs, go down into the 2nd floor, then go down again into the ground floor, then turn left — through the hall you will find the Dentistry Simulation Lab 1.",
        staircase_2: "From the stairs, go down into the 2nd floor, then go down again into the ground floor, then turn right — through the hall you will find the Dentistry Simulation Lab 1.",
      },
    },

    "Dental Clinic": {
      gf: {
        staircase_1: "You're almost there! From the stairs, turn right — through the hall you will find the Dental Clinic.",
        staircase_2: "You're almost there! From the stairs, turn left — through the hall you will find the Dental Clinic.",
      },
      "2f": {
        staircase_1: "From the stairs, go down the stairs, then turn left — through the hall you will find the Dental Clinic.",
        staircase_2: "From the stairs, go down the stairs, then turn right — through the hall you will find the Dental Clinic.",
      },
      "3f": {
        staircase_1: "From the stairs, go down into the 2nd floor, then go down again into the ground floor, then turn left — through the hall you will find the Dental Clinic.",
        staircase_2: "From the stairs, go down into the 2nd floor, then go down again into the ground floor, then turn right — through the hall you will find the Dental Clinic.",
      },
    },

    // NOTE: GF directions merged into the single "Office of the Dean" entry below (audit fix 4.3)

    // ════ 2ND FLOOR ROOMS ════

    "Room 201": {
      gf: {
        staircase_1: "From the stairs, go up into the 2nd floor, then turn left — through the hall you will find Room 201.",
        staircase_2: "From the stairs, go up into the 2nd floor, then turn right — through the hall you will find Room 201.",
      },
      "2f": {
        staircase_1: "You're almost there! From the stairs, turn left — through the hall you will find Room 201.",
        staircase_2: "You're almost there! From the stairs, turn right — through the hall you will find Room 201.",
      },
      "3f": {
        staircase_1: "From the stairs, go down into the 2nd floor, then turn left — through the hall you will find Room 201.",
        staircase_2: "From the stairs, go down into the 2nd floor, then turn right — through the hall you will find Room 201.",
      },
    },

    "Room 202": {
      gf: {
        staircase_1: "From the stairs, go up into the 2nd floor, then turn left — through the hall you will find Room 202.",
        staircase_2: "From the stairs, go up into the 2nd floor, then turn right — through the hall you will find Room 202.",
      },
      "2f": {
        staircase_1: "You're almost there! From the stairs, turn left — through the hall you will find Room 202.",
        staircase_2: "You're almost there! From the stairs, turn right — through the hall you will find Room 202.",
      },
      "3f": {
        staircase_1: "From the stairs, go down into the 2nd floor, then turn left — through the hall you will find Room 202.",
        staircase_2: "From the stairs, go down into the 2nd floor, then turn right — through the hall you will find Room 202.",
      },
    },

    "SR Consultation Room": {
      gf: {
        staircase_1: "From the stairs, go up into the 2nd floor, then turn left — through the hall you will find the Consultation Room.",
        staircase_2: "From the stairs, go up into the 2nd floor, then turn right — through the hall you will find the Consultation Room.",
      },
      "2f": {
        staircase_1: "You're almost there! From the stairs, turn left — through the hall you will find the Consultation Room.",
        staircase_2: "You're almost there! From the stairs, turn right — through the hall you will find the Consultation Room.",
      },
      "3f": {
        staircase_1: "From the stairs, go down into the 2nd floor, then turn left — through the hall you will find the Consultation Room.",
        staircase_2: "From the stairs, go down into the 2nd floor, then turn right — through the hall you will find the Consultation Room.",
      },
    },

    // Un-merged 2026-11-17: "Office of the Dean (Dentistry)" (GF room) and "Office of the Dean" (2F room) are different offices.
    "Office of the Dean (Dentistry)": {
      gf: {
        staircase_1: "You're almost there! From the stairs, turn right — through the hall you will find the Office of the Dean.",
        staircase_2: "You're almost there! From the stairs, turn left — through the hall you will find the Office of the Dean.",
      },
    },

    "Office of the Dean": {
      gf: {
        staircase_1: "From the stairs, go up into the 2nd floor, then turn left — through the hall you will find the Office of the Dean.",
        staircase_2: "From the stairs, go up into the 2nd floor, then turn right — through the hall you will find the Office of the Dean.",
      },
      "2f": {
        staircase_1: "You're almost there! From the stairs, turn left — through the hall you will find the Office of the Dean.",
        staircase_2: "You're almost there! From the stairs, turn right — through the hall you will find the Office of the Dean.",
      },
      "3f": {
        staircase_1: "From the stairs, go down into the 2nd floor, then turn left — through the hall you will find the Office of the Dean.",
        staircase_2: "From the stairs, go down into the 2nd floor, then turn right — through the hall you will find the Office of the Dean.",
      },
    },

    "Faculty Office": {
      gf: {
        staircase_1: "From the stairs, go up into the 2nd floor, then turn left — through the hall you will find the Faculty Office.",
        staircase_2: "From the stairs, go up into the 2nd floor, then turn right — through the hall you will find the Faculty Office.",
      },
      "2f": {
        staircase_1: "You're almost there! From the stairs, turn left — through the hall you will find the Faculty Office.",
        staircase_2: "You're almost there! From the stairs, turn right — through the hall you will find the Faculty Office.",
      },
      "3f": {
        staircase_1: "From the stairs, go down into the 2nd floor, then turn left — through the hall you will find the Faculty Office.",
        staircase_2: "From the stairs, go down into the 2nd floor, then turn right — through the hall you will find the Faculty Office.",
      },
    },

    "Education Simulation": {
      gf: {
        staircase_1: "From the stairs, go up into the 2nd floor, then turn left — through the hall you will find Education Simulation.",
        staircase_2: "From the stairs, go up into the 2nd floor, then turn right — through the hall you will find Education Simulation.",
      },
      "2f": {
        staircase_1: "You're almost there! From the stairs, turn left — through the hall you will find Education Simulation.",
        staircase_2: "You're almost there! From the stairs, turn right — through the hall you will find Education Simulation.",
      },
      "3f": {
        staircase_1: "From the stairs, go down into the 2nd floor, then turn left — through the hall you will find Education Simulation.",
        staircase_2: "From the stairs, go down into the 2nd floor, then turn right — through the hall you will find Education Simulation.",
      },
    },

    // ════ 3RD FLOOR ROOMS ════

    "Room 301": {
      gf: {
        staircase_1: "From the stairs, go up into the 2nd floor, then go up into the 3rd floor, turn left — through the hall you will find Room 301.",
        staircase_2: "From the stairs, go up into the 2nd floor, then go up into the 3rd floor, turn right — through the hall you will find Room 301.",
      },
      "2f": {
        staircase_1: "From the stairs, go up into the 3rd floor, then turn left — through the hall you will find Room 301.",
        staircase_2: "From the stairs, go up into the 3rd floor, then turn right — through the hall you will find Room 301.",
      },
      "3f": {
        staircase_1: "You're almost there! From the stairs, turn left — through the hall you will find Room 301.",
        staircase_2: "You're almost there! From the stairs, turn right — through the hall you will find Room 301.",
      },
    },

    "Room 302": {
      gf: {
        staircase_1: "From the stairs, go up into the 2nd floor, then go up into the 3rd floor, turn left — through the hall you will find Room 302.",
        staircase_2: "From the stairs, go up into the 2nd floor, then go up into the 3rd floor, turn right — through the hall you will find Room 302.",
      },
      "2f": {
        staircase_1: "From the stairs, go up into the 3rd floor, then turn left — through the hall you will find Room 302.",
        staircase_2: "From the stairs, go up into the 3rd floor, then turn right — through the hall you will find Room 302.",
      },
      "3f": {
        staircase_1: "You're almost there! From the stairs, turn left — through the hall you will find Room 302.",
        staircase_2: "You're almost there! From the stairs, turn right — through the hall you will find Room 302.",
      },
    },

    "Room 303": {
      gf: {
        staircase_1: "From the stairs, go up into the 2nd floor, then go up into the 3rd floor, turn left — through the hall you will find Room 303.",
        staircase_2: "From the stairs, go up into the 2nd floor, then go up into the 3rd floor, turn right — through the hall you will find Room 303.",
      },
      "2f": {
        staircase_1: "From the stairs, go up into the 3rd floor, then turn left — through the hall you will find Room 303.",
        staircase_2: "From the stairs, go up into the 3rd floor, then turn right — through the hall you will find Room 303.",
      },
      "3f": {
        staircase_1: "You're almost there! From the stairs, turn left — through the hall you will find Room 303.",
        staircase_2: "You're almost there! From the stairs, turn right — through the hall you will find Room 303.",
      },
    },

    "Room 304": {
      gf: {
        staircase_1: "From the stairs, go up into the 2nd floor, then go up into the 3rd floor, turn left — through the hall you will find Room 304.",
        staircase_2: "From the stairs, go up into the 2nd floor, then go up into the 3rd floor, turn right — through the hall you will find Room 304.",
      },
      "2f": {
        staircase_1: "From the stairs, go up into the 3rd floor, then turn left — through the hall you will find Room 304.",
        staircase_2: "From the stairs, go up into the 3rd floor, then turn right — through the hall you will find Room 304.",
      },
      "3f": {
        staircase_1: "You're almost there! From the stairs, turn left — through the hall you will find Room 304.",
        staircase_2: "You're almost there! From the stairs, turn right — through the hall you will find Room 304.",
      },
    },

    "Psych Lab": {
      gf: {
        staircase_1: "From the stairs, go up into the 2nd floor, then go up into the 3rd floor, turn left — through the hall you will find the Psych Lab.",
        staircase_2: "From the stairs, go up into the 2nd floor, then go up into the 3rd floor, turn right — through the hall you will find the Psych Lab.",
      },
      "2f": {
        staircase_1: "From the stairs, go up into the 3rd floor, then turn left — through the hall you will find the Psych Lab.",
        staircase_2: "From the stairs, go up into the 3rd floor, then turn right — through the hall you will find the Psych Lab.",
      },
      "3f": {
        staircase_1: "You're almost there! From the stairs, turn left — through the hall you will find the Psych Lab.",
        staircase_2: "You're almost there! From the stairs, turn right — through the hall you will find the Psych Lab.",
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
// Returns the direction string or null if not found.
// Supports fuzzy matching (e.g. "Cashier" -> "Cashier — Window 6")
// and graceful staircase fallback so directions always display.
//
// @param {string} buildingId   — e.g. "main_building"
// @param {string} roomName     — room name or facility string
// @param {string} fromFloor    — "gf" | "1f" | "2f" | "3f" | "4f"
// @param {string} staircase    — "staircase_1" | "staircase_2" | "any"
// @returns {string|null}
// ─────────────────────────────────────────────────────────────────────────────
export function getDirections(buildingId, roomName, fromFloor, staircase = "staircase_1") {
  const building = INDOOR_DIRECTIONS[buildingId];
  if (!building) return null;

  // Exact match or fuzzy alias match (e.g. "Cashier" -> "Cashier — Window 6" or "NB105 — Cashier / Registrar / Assessment")
  let room = building[roomName];
  if (!room && roomName) {
    const q = roomName.toLowerCase().trim();
    const foundKey = Object.keys(building).find(k => {
      const kl = k.toLowerCase();
      return kl.includes(q) || q.includes(kl);
    });
    if (foundKey) {
      room = building[foundKey];
    }
  }
  if (!room) return null;

  const floorKey = (fromFloor || "1f").toLowerCase().replace(" floor", "").replace(" ", "");
  const floorEntry = room[floorKey] || room[fromFloor];
  if (!floorEntry) {
    // If exact floor key didn't match, fall back to first available floor for this room
    const firstFloor = Object.values(room)[0];
    if (firstFloor) {
      const targetStair = staircase || "staircase_1";
      return firstFloor[targetStair]
        ?? firstFloor["any"]
        ?? firstFloor["staircase_1"]
        ?? firstFloor["staircase_2"]
        ?? Object.values(firstFloor)[0]
        ?? null;
    }
    return null;
  }

  // Robust staircase fallback:
  // If staircase is null or doesn't match this floor, fall back to available directions
  const targetStair = staircase || "staircase_1";
  return floorEntry[targetStair]
    ?? floorEntry["any"]
    ?? floorEntry["staircase_1"]
    ?? floorEntry["staircase_2"]
    ?? Object.values(floorEntry)[0]
    ?? null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Helper: get all room names for a building (for search/autocomplete)
// ─────────────────────────────────────────────────────────────────────────────
export function getRoomNames(buildingId) {
  const building = INDOOR_DIRECTIONS[buildingId];
  if (!building) return [];
  const rooms = new Set(Object.keys(building));

  // Also include facilities (like "Cashier", "Registrar") from buildings.js if they match directions
  try {
    const { BUILDINGS } = require("./buildings");
    const b = BUILDINGS[buildingId];
    if (b?.facilities) {
      for (const f of b.facilities) {
        if (f && f !== "Coming Soon") {
          const fl = f.toLowerCase();
          const hasMatch = Array.from(rooms).some(r => r.toLowerCase().includes(fl));
          if (hasMatch) rooms.add(f);
        }
      }
    }
  } catch (_) {}

  return Array.from(rooms);
}
