import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { colors } from '../constants/theme';
import { getImageForBuilding } from '../data/buildingImages';
import { IconBuilding } from './icons';

/**
 * BuildingImagePreview
 *
 * Shows a building photo at the top of BuildingCard.
 * Falls back to a styled placeholder when no image is available yet.
 *
 * Props:
 *   buildingId   — building.id string, used to look up the image
 *   buildingName — building.name string (used as Image alt / accessibilityLabel)
 *   style        — optional extra style applied to the outer container
 */
export default function BuildingImagePreview({ buildingId, buildingName, style }) {
  const imageSource = getImageForBuilding(buildingId);

  // Resolve the source prop — require() returns a number, URLs are strings
  const resolvedSource =
    imageSource === null
      ? null
      : typeof imageSource === 'string'
      ? { uri: imageSource }
      : imageSource; // require() number — pass directly

  return (
    <View style={[s.container, style]}>
      {resolvedSource ? (
        <Image
          source={resolvedSource}
          style={s.image}
          resizeMode="cover"
          accessibilityLabel={buildingName ?? 'Building preview'}
        />
      ) : (
        <View style={s.placeholder}>
          <IconBuilding size={36} color={colors.primary} />
          <Text style={s.placeholderText}>Image coming soon</Text>
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    height: 180,
    width: '100%',
    alignSelf: 'stretch',
    overflow: 'hidden',
    // borderRadius intentionally omitted — parent (BuildingCard) sets it so
    // overflow:hidden clips to the card's own corner radius, not a hardcoded value
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    flex: 1,
    backgroundColor: 'rgba(20,30,22,0.95)',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  placeholderText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMuted,
  },
});
