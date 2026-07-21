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

const { height: H } = Dimensions.get("window");
const GREEN = "#00C853";

export default function SearchModal({ visible, onClose, onSelect }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(BUILDING_LIST);
  const slideAnim = useRef(new Animated.Value(H)).current;
  const inputRef = useRef(null);

  useEffect(() => {
    if (visible) {
      // Slide up
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 70,
        friction: 12,
        useNativeDriver: true,
      }).start(() => inputRef.current?.focus());
    } else {
      // Slide down
      Animated.timing(slideAnim, {
        toValue: H,
        duration: 220,
        useNativeDriver: true,
      }).start();
      setQuery("");
      setResults(BUILDING_LIST);
    }
  }, [visible]);

  function handleSearch(text) {
    setQuery(text);
    if (!text.trim()) {
      setResults(BUILDING_LIST);
      return;
    }
    const lower = text.toLowerCase();
    const filtered = BUILDING_LIST.filter((b) => {
      // Search by name, subtitle, or any facility keyword
      const nameMatch = b.name.toLowerCase().includes(lower);
      const subtitleMatch = b.subtitle?.toLowerCase().includes(lower);
      const facMatch = b.facilities?.some((f) =>
        f.toLowerCase().includes(lower),
      );
      return nameMatch || subtitleMatch || facMatch;
    });
    setResults(filtered);
  }

  function handleSelect(building) {
    Keyboard.dismiss();
    onClose();
    onSelect(building);
  }

  function renderItem({ item }) {
    return (
      <TouchableOpacity
        style={s.resultItem}
        onPress={() => handleSelect(item)}
        activeOpacity={0.7}
      >
        {/* Icon */}
        <View style={[s.resultIcon, { backgroundColor: item.color + "44" }]}>
          <BuildingIcon iconKey={item.icon} size={18} color={GREEN} />
        </View>

        {/* Info */}
        <View style={s.resultInfo}>
          <Text style={s.resultName}>{item.name}</Text>
          <Text style={s.resultSub}>{item.subtitle}</Text>
          {/* Matching facilities */}
          {query.trim().length > 0 && (
            <View style={s.facilityRow}>
              {item.facilities
                ?.filter((f) => f.toLowerCase().includes(query.toLowerCase()))
                .slice(0, 2)
                .map((f) => (
                  <View key={f} style={s.facilityTag}>
                    <Text style={s.facilityText}>{f}</Text>
                  </View>
                ))}
            </View>
          )}
        </View>

        {/* Distance */}
        <View style={s.resultRight}>
          <IconPin size={12} color={GREEN} />
          <Text style={s.resultDist}>{item.dist_label ?? item.dist}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  function renderEmpty() {
    return (
      <View style={s.empty}>
        <IconSearch size={36} color="rgba(255,255,255,0.1)" />
        <Text style={s.emptyTitle}>No results</Text>
        <Text style={s.emptySub}>
          Try searching by building name or facility
        </Text>
      </View>
    );
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      {/* Backdrop */}
      <TouchableOpacity
        style={s.backdrop}
        activeOpacity={1}
        onPress={onClose}
      />

      {/* Modal sheet */}
      <Animated.View
        style={[s.sheet, { transform: [{ translateY: slideAnim }] }]}
      >
        {/* Search input row */}
        <View style={s.inputRow}>
          <TouchableOpacity
            onPress={onClose}
            style={s.backBtn}
            activeOpacity={0.7}
          >
            <IconArrowLeft size={20} color="rgba(255,255,255,0.7)" />
          </TouchableOpacity>
          <View style={s.inputWrap}>
            <IconSearch size={16} color="rgba(255,255,255,0.3)" />
            <TextInput
              ref={inputRef}
              style={s.input}
              placeholder="Search buildings, rooms, facilities..."
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

        {/* Section label */}
        <Text style={s.sectionLabel}>
          {query.trim()
            ? `${results.length} result${results.length !== 1 ? "s" : ""}`
            : "ALL DESTINATIONS"}
        </Text>

        {/* Results list */}
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListEmptyComponent={renderEmpty}
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
    height: H * 0.88,
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
    marginBottom: 16,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.06)",
    alignItems: "center",
    justifyContent: "center",
  },
  inputWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "rgba(255,255,255,0.07)",
    borderWidth: 1,
    borderColor: "rgba(0,200,83,0.2)",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: "#ffffff",
  },
  clearBtn: {
    fontSize: 14,
    color: "rgba(255,255,255,0.3)",
    paddingHorizontal: 4,
  },

  // Section label
  sectionLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: "rgba(0,200,83,0.5)",
    letterSpacing: 1.2,
    paddingHorizontal: 16,
    marginBottom: 8,
  },

  // Result items
  resultItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  resultIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  resultInfo: { flex: 1 },
  resultName: { fontSize: 14, fontWeight: "800", color: "#e0e8e0" },
  resultSub: { fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 2 },
  facilityRow: { flexDirection: "row", gap: 5, marginTop: 5, flexWrap: "wrap" },
  facilityTag: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: "rgba(0,200,83,0.12)",
    borderWidth: 1,
    borderColor: "rgba(0,200,83,0.25)",
  },
  facilityText: { fontSize: 9, fontWeight: "700", color: GREEN },
  resultRight: { alignItems: "center", gap: 3 },
  resultDist: { fontSize: 10, fontWeight: "700", color: GREEN },

  separator: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.05)",
    marginLeft: 70,
  },

  // Empty state
  empty: {
    alignItems: "center",
    paddingTop: 60,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "rgba(255,255,255,0.2)",
  },
  emptySub: {
    fontSize: 13,
    color: "rgba(255,255,255,0.15)",
    textAlign: "center",
    paddingHorizontal: 40,
  },
});
