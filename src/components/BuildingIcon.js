import React from "react";
import {
  IconBuilding,
  IconBook,
  IconActivity,
  IconFlask,
  IconCoffee,
  IconClipboard,
  IconGate,
  IconParking,
  IconHeart,
} from "./icons/index";

const MAP = {
  building: IconBuilding,
  book: IconBook,
  activity: IconActivity,
  flask: IconFlask,
  coffee: IconCoffee,
  clipboard: IconClipboard,
  gate: IconGate,
  parking: IconParking,
  heart: IconHeart,
};

export default function BuildingIcon({
  iconKey,
  size = 20,
  color = "#00C853",
}) {
  const Component = MAP[iconKey] ?? IconBuilding;
  return <Component size={size} color={color} />;
}
