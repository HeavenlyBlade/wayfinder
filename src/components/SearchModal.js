import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  FlatList,
  Keyboard,
  Animated,
  Dimensions,
} from "react-native";
import { IconSearch, IconArrowLeft, IconPin } from "./icons/index";
import BuildingIcon from "./BuildingIcon";
import { BUILDING_LIST } from "../constants/buildings";
import { ROOM_INDEX } from "../constants/roomIndex";

const { height: H } = Dimensions.get("window");
const GREEN = "#00C853";
const GOLD  = "#FFC107";

// ── Merge buildings + rooms into one unified search pool ─────────────────────
function buildSearchPool() {
  const buildings = BUILDING_LIST.map(b => ({ _type: "building", ...b }));
  const rooms     = ROOM_INDEX.map(r  => ({ _type: "room",     ...r  }));
  return { buildings, rooms };
}

const { buildings: ALL_BUILDINGS, rooms: ALL_ROOMS } = buildSearchPool();

// ── Search logic ──────────────────────────────────────────────────────────────
function search(query) {
  if (!query.trim()) return { buildings: ALL_BUILDINGS, rooms: [] };
  const lower = query.toLowerCase();

  const buildings = ALL_BUILDINGS.filter(b => {
    const nameMatch     = b.name.toLowerCase().includes(lower);
    const subtitleMatch = b.subtitle?.toLowerCase().includes(lower);
    const facMatch      = b.facilities?.some(f => f.toLowerCase().includes(lower));
    return nameMatch || subtitleMatch || facMatch;
  });

  const rooms = ALL_ROOMS.filter(r => {
    const roomMatch     = r.room.toLowerCase().includes(lower);
    const buildingMatch = r.buildingName.toLowerCase().includes(lower);
    const floorMatch    = r.floor.toLowerCase().includes(lower);
    return roomMatch || buildingMatch || floorMatch;
  });

  return { buildings, rooms };
}

// ── Main component ────────────────────────────────────────────────────────────

/**
 * SearchModal
 *
 * Props:
 *   visible   {boolean}
 *   onClose   {() => void}
 *   onSelect  {(building) => void}  — called with a building object when user
 *                                     picks a building OR a room (room results
 *                                     navigate to their parent building)
 *   onSelectRoom {(roomEntry, building) => void}  — optional; if provided,
 *                                     called instead of onSelect for room picks
 */
export default function SearchModal({ visible, onClose, onSelect, onSelectRoom }) {
  const [query,   setQuery]   = useState("");
  const [results, setResults] = useState({ buildings: ALL_BUILDINGS, rooms: [] });
  const slideAnim = useRef(new Animated.Value(H)).current;
  const inputRef  = useRef(null);

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 70,
        friction: 12,
        useNativeDriver: true,
      }).start(() => inputRef.current?.focus());
    } else {
      Animated.timing(slideAnim, {
        toValue: H,
        duration: 220,
        useNativeDriver: true,
      }).start();
      setQuery("");
      setResults({ buildings: ALL_BUILDINGS, rooms: [] });
    }
  }, [visible]);

  function handleSearch(text) {
    setQuery(text);
    setResults(search(text));
  }

  function handleSelectBuilding(building) {
    Keyboard.dismiss();
    onClose();
    onSelect(building);
  }

  function handleSelectRoom(roomEntry) {
    Keyboard.dismiss();
    onClose();
    // Find the parent building object
    const building = BUILDING_LIST.find(b => b.id === roomEntry.buildingId);
    if (!building) return;
    if (onSelectRoom) {
      onSelectRoom(roomEntry, building);
    } else {
      // Fallback: just navigate to the building
      onSelect(building);
    }
  }

  // ── Render a building result ────────────────────────────────────────────────
  function renderBuilding({ item }) {
    return (
      <TouchableOpacity
        style={s.resultItem}
        onPress={() => handleSelectBuilding(item)}
        activeOpacity={0.7}
      >
        <View style={[s.resultIcon, { backgroundColor: (item.color ?? "#1a3a1a") + "44" }]}>
          <BuildingIcon iconKey={item.icon} size={18} color={GREEN} />
        </View>
        <View style={s.resultInfo}>
          <Text style={s.resultName}>{item.name}</Text>
          <Text style={s.resultSub}>{item.subtitle}</Text>
          {query.trim().length > 0 && (
            <View style={s.facilityRow}>
              {item.facilities
                ?.filter(f => f.toLowerCase().includes(query.toLowerCase()))
                .slice(0, 2)
                .map(f => (
                  <View key={f} style={s.facilityTag}>
                    <Text style={s.facilityText}>{f}</Text>
                  </View>
                ))}
            </View>
          )}
        </View>
        <View style={s.resultRight}>
          <IconPin size={12} color={GREEN} />
          <Text style={s.resultDist}>{item.dist_label ?? item.dist}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  // ── Render a room result ────────────────────────────────────────────────────
  function renderRoom({ item }) {
    return (
      <TouchableOpacity
        style={s.roomItem}
        onPress={() => handleSelectRoom(item)}
        activeOpacity={0.7}
      >
        {/* Building icon - small */}
        <View style={[s.roomIcon, { backgroundColor: (item.buildingColor ?? "#1a3a1a") + "44" }]}>
          <BuildingIcon iconKey={item.buildingIcon} size={14} color={GOLD} />
        </View>

        <View style={s.roomInfo}>
          {/* Room name */}
          <Text style={s.roomName}>{item.room}</Text>
          {/* Building + floor breadcrumb */}
          <View style={s.roomBreadcrumb}>
            <Text style={s.roomBuilding}>{item.buildingName}</Text>
            <Text style={s.roomBreadcrumbSep}> · </Text>
            <View style={s.floorBadge}>
              <Text style={s.floorBadgeText}>{item.floorLabel}</Text>
            </View>
          </View>
        </View>

        {/* "Go here" hint */}
        <View style={s.roomRight}>
          <Text style={s.goHint}>Go to</Text>
          <Text style={s.goBuilding} numberOfLines={1}>{item.buildingName.split(" ")[0]}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  // ── Flat list data: buildings section + rooms section ──────────────────────
  const listData = [];

  if (results.buildings.length > 0) {
    listData.push({ _sectionHeader: true, key: "header_buildings",
      label: query.trim() ? `${results.buildings.length} BUILDING${results.buildings.length !== 1 ? "S" : ""}` : "ALL BUILDINGS" });
    results.buildings.forEach(b => listData.push({ ...b, _listKey: `b_${b.id}` }));
  }

  if (results.rooms.length > 0) {
    listData.push({ _sectionHeader: true, key: "header_rooms",
      label: `${results.rooms.length} ROOM${results.rooms.length !== 1 ? "S" : ""} — navigate to building first` });
    results.rooms.slice(0, 30).forEach(r => listData.push({ ...r, _listKey: `r_${r.id}` }));
  }

  const isEmpty = results.buildings.length === 0 && results.rooms.length === 0;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      {/* Backdrop */}
      <TouchableOpacity style={s.backdrop} activeOpacity={1} onPress={onClose} />

      {/* Modal sheet */}
      <Animated.View style={[s.sheet, { transform: [{ translateY: slideAnim }] }]}>

        {/* Search input row */}
        <View style={s.inputRow}>
          <TouchableOpacity onPress={onClose} style={s.backBtn} activeOpacity={0.7}>
            <IconArrowLeft size={20} color="rgba(255,255,255,0.7)" />
          </TouchableOpacity>
          <View style={s.inputWrap}>
            <IconSearch size={16} color="rgba(255,255,255,0.3)" />
            <TextInput
              ref={inputRef}
              style={s.input}
              placeholder="Search buildings, rooms, offices..."
              placeholderTextColor="rgba(255,255,255,0.25)"
              value={query}
              onChangeText={handleSearch}
              returnKeyType="search"
              autoCorrect={false}
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => handleSearch("")}>
                <Text style={s.clearBtn}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Room search hint — shown when no query */}
        {!query.trim() && (
          <View style={s.hintRow}>
            <Text style={s.hintText}>
              Tip: search a room name (e.g. "Clinic", "Library", "MB301") to find which building it's in
            </Text>
          </View>
        )}

        {/* Unified list */}
        <FlatList
          data={listData}
          keyExtractor={item => item._listKey ?? item.key ?? item.id}
          renderItem={({ item }) => {
            if (item._sectionHeader) {
              return (
                <View style={[s.sectionHeader,
                  item.key === "header_rooms" && s.sectionHeaderRooms]}>
                  <Text style={[s.sectionLabel,
                    item.key === "header_rooms" && s.sectionLabelRooms]}>
                    {item.label}
                  </Text>
                </View>
              );
            }
            if (item._type === "room") return renderRoom({ item });
            return renderBuilding({ item });
          }}
          ListEmptyComponent={
            isEmpty ? (
              <View style={s.empty}>
                <IconSearch size={36} color="rgba(255,255,255,0.1)" />
                <Text style={s.emptyTitle}>No results</Text>
                <Text style={s.emptySub}>Try a building name, room number, or office name</Text>
              </View>
            ) : null
          }
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
          ItemSeparatorComponent={() => <View style={s.separator} />}
        />
      </Animated.View>
    </Modal>
  );
}

const s = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: H * 0.92,
    backgroundColor: "#0d1a10",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    borderColor: "rgba(0,200,83,0.15)",
    paddingTop: 16,
  },

  // Input row
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.06)",
    alignItems: "center", justifyContent: "center",
  },
  inputWrap: {
    flex: 1, flexDirection: "row", alignItems: "center", gap: 10,
    backgroundColor: "rgba(255,255,255,0.07)",
    borderWidth: 1, borderColor: "rgba(0,200,83,0.2)",
    borderRadius: 999, paddingHorizontal: 14, paddingVertical: 10,
  },
  input: { flex: 1, fontSize: 14, fontWeight: "600", color: "#ffffff" },
  clearBtn: { fontSize: 14, color: "rgba(255,255,255,0.3)", paddingHorizontal: 4 },

  // Tip hint
  hintRow: {
    marginHorizontal: 16,
    marginBottom: 8,
    backgroundColor: "rgba(255,193,7,0.07)",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255,193,7,0.15)",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  hintText: { fontSize: 11, color: "rgba(255,193,7,0.7)", lineHeight: 16 },

  // Section headers
  sectionHeader: {
    paddingHorizontal: 16, paddingVertical: 8,
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  sectionHeaderRooms: { backgroundColor: "rgba(255,193,7,0.05)" },
  sectionLabel: {
    fontSize: 10, fontWeight: "800",
    color: "rgba(0,200,83,0.5)", letterSpacing: 1.2,
  },
  sectionLabelRooms: { color: "rgba(255,193,7,0.6)" },

  // Building result
  resultItem: {
    flexDirection: "row", alignItems: "center",
    gap: 12, paddingHorizontal: 16, paddingVertical: 12,
  },
  resultIcon: {
    width: 42, height: 42, borderRadius: 12,
    alignItems: "center", justifyContent: "center", flexShrink: 0,
  },
  resultInfo: { flex: 1 },
  resultName: { fontSize: 14, fontWeight: "800", color: "#e0e8e0" },
  resultSub:  { fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 2 },
  facilityRow: { flexDirection: "row", gap: 5, marginTop: 5, flexWrap: "wrap" },
  facilityTag: {
    paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6,
    backgroundColor: "rgba(0,200,83,0.12)",
    borderWidth: 1, borderColor: "rgba(0,200,83,0.25)",
  },
  facilityText: { fontSize: 9, fontWeight: "700", color: GREEN },
  resultRight: { alignItems: "center", gap: 3 },
  resultDist: { fontSize: 10, fontWeight: "700", color: GREEN },

  // Room result
  roomItem: {
    flexDirection: "row", alignItems: "center",
    gap: 12, paddingHorizontal: 16, paddingVertical: 11,
    backgroundColor: "rgba(255,193,7,0.03)",
  },
  roomIcon: {
    width: 36, height: 36, borderRadius: 10,
    alignItems: "center", justifyContent: "center", flexShrink: 0,
  },
  roomInfo: { flex: 1 },
  roomName: { fontSize: 13, fontWeight: "700", color: "#f0e8c0" },
  roomBreadcrumb: { flexDirection: "row", alignItems: "center", marginTop: 3 },
  roomBuilding: { fontSize: 10, color: "rgba(255,193,7,0.5)", fontWeight: "600" },
  roomBreadcrumbSep: { fontSize: 10, color: "rgba(255,255,255,0.2)" },
  floorBadge: {
    paddingHorizontal: 5, paddingVertical: 1, borderRadius: 4,
    backgroundColor: "rgba(255,193,7,0.12)",
    borderWidth: 1, borderColor: "rgba(255,193,7,0.25)",
  },
  floorBadgeText: { fontSize: 9, fontWeight: "800", color: GOLD },
  roomRight: { alignItems: "flex-end", gap: 2 },
  goHint: { fontSize: 9, color: "rgba(255,255,255,0.25)" },
  goBuilding: { fontSize: 10, fontWeight: "800", color: GOLD, maxWidth: 60 },

  separator: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.05)",
    marginLeft: 70,
  },

  // Empty state
  empty: { alignItems: "center", paddingTop: 60, gap: 12 },
  emptyTitle: { fontSize: 16, fontWeight: "800", color: "rgba(255,255,255,0.2)" },
  emptySub: {
    fontSize: 13, color: "rgba(255,255,255,0.15)",
    textAlign: "center", paddingHorizontal: 40,
  },
});
