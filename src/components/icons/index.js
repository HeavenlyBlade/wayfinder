import React from "react";
import Svg, {
  Path,
  Circle,
  Line,
  Polyline,
  Rect,
  G,
  Polygon,
} from "react-native-svg";

// Base wrapper — all icons use this
const Icon = ({ size = 24, color = "#ffffff", children, ...props }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    {children}
  </Svg>
);

export function IconArrowLeft({ size, color }) {
  return (
    <Icon size={size} color={color}>
      <Path d="M19 12H5" />
      <Path d="M12 19l-7-7 7-7" />
    </Icon>
  );
}

export function IconSearch({ size, color }) {
  return (
    <Icon size={size} color={color}>
      <Circle cx="11" cy="11" r="8" />
      <Path d="M21 21l-4.35-4.35" />
    </Icon>
  );
}

export function IconMic({ size, color }) {
  return (
    <Icon size={size} color={color}>
      <Rect x="9" y="2" width="6" height="11" rx="3" />
      <Path d="M19 10a7 7 0 01-14 0" />
      <Line x1="12" y1="19" x2="12" y2="22" />
      <Line x1="9" y1="22" x2="15" y2="22" />
    </Icon>
  );
}

export function IconMicOff({ size, color }) {
  return (
    <Icon size={size} color={color}>
      <Line x1="1" y1="1" x2="23" y2="23" />
      <Path d="M9 9v3a3 3 0 005.12 2.12M15 9.34V4a3 3 0 00-5.94-.6" />
      <Path d="M17 16.95A7 7 0 015 12v-2m14 0v2a7 7 0 01-.11 1.23" />
      <Line x1="12" y1="19" x2="12" y2="22" />
      <Line x1="9" y1="22" x2="15" y2="22" />
    </Icon>
  );
}

export function IconMap({ size, color }) {
  return (
    <Icon size={size} color={color}>
      <Polyline points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
      <Line x1="8" y1="2" x2="8" y2="18" />
      <Line x1="16" y1="6" x2="16" y2="22" />
    </Icon>
  );
}

export function IconCompass({ size, color }) {
  return (
    <Icon size={size} color={color}>
      <Circle cx="12" cy="12" r="10" />
      <Path d="M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z" />
    </Icon>
  );
}

export function IconNavigation({ size, color }) {
  return (
    <Icon size={size} color={color}>
      <Path d="M3 11l19-9-9 19-2-8-8-2z" />
    </Icon>
  );
}

export function IconEye({ size, color }) {
  return (
    <Icon size={size} color={color}>
      <Path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <Circle cx="12" cy="12" r="3" />
    </Icon>
  );
}

export function IconSettings({ size, color }) {
  return (
    <Icon size={size} color={color}>
      <Circle cx="12" cy="12" r="3" />
      <Path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
    </Icon>
  );
}

export function IconInfo({ size, color }) {
  return (
    <Icon size={size} color={color}>
      <Circle cx="12" cy="12" r="10" />
      <Line x1="12" y1="8" x2="12" y2="12" />
      <Line x1="12" y1="16" x2="12.01" y2="16" />
    </Icon>
  );
}

export function IconPin({ size, color }) {
  return (
    <Icon size={size} color={color}>
      <Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
      <Circle cx="12" cy="10" r="3" />
    </Icon>
  );
}

export function IconVolume({ size, color }) {
  return (
    <Icon size={size} color={color}>
      <Path d="M11 5L6 9H2v6h4l5 4V5z" />
      <Path d="M19.07 4.93a10 10 0 010 14.14" />
      <Path d="M15.54 8.46a5 5 0 010 7.07" />
    </Icon>
  );
}

export function IconGlobe({ size, color }) {
  return (
    <Icon size={size} color={color}>
      <Circle cx="12" cy="12" r="10" />
      <Line x1="2" y1="12" x2="22" y2="12" />
      <Path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
    </Icon>
  );
}

export function IconChevronRight({ size, color }) {
  return (
    <Icon size={size} color={color}>
      <Polyline points="9 18 15 12 9 6" />
    </Icon>
  );
}

export function IconUser({ size, color }) {
  return (
    <Icon size={size} color={color}>
      <Path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <Circle cx="12" cy="7" r="4" />
    </Icon>
  );
}

// Building-specific icons
export function IconBuilding({ size, color }) {
  return (
    <Icon size={size} color={color}>
      <Rect x="3" y="3" width="18" height="18" rx="2" />
      <Path d="M3 9h18" />
      <Path d="M9 21V9" />
    </Icon>
  );
}

export function IconBook({ size, color }) {
  return (
    <Icon size={size} color={color}>
      <Path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
      <Path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
    </Icon>
  );
}

export function IconActivity({ size, color }) {
  return (
    <Icon size={size} color={color}>
      <Circle cx="12" cy="12" r="10" />
      <Path d="M12 8v4l3 3" />
    </Icon>
  );
}

export function IconFlask({ size, color }) {
  return (
    <Icon size={size} color={color}>
      <Path d="M9 3h6M10 3v6l-4 9h12l-4-9V3" />
    </Icon>
  );
}

export function IconCoffee({ size, color }) {
  return (
    <Icon size={size} color={color}>
      <Path d="M18 8h1a4 4 0 010 8h-1" />
      <Path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z" />
      <Line x1="6" y1="1" x2="6" y2="4" />
      <Line x1="10" y1="1" x2="10" y2="4" />
      <Line x1="14" y1="1" x2="14" y2="4" />
    </Icon>
  );
}

export function IconClipboard({ size, color }) {
  return (
    <Icon size={size} color={color}>
      <Path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" />
      <Rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    </Icon>
  );
}

export function IconGate({ size, color }) {
  return (
    <Icon size={size} color={color}>
      <Path d="M3 21V7a2 2 0 012-2h14a2 2 0 012 2v14" />
      <Path d="M9 21V11h6v10" />
      <Line x1="3" y1="21" x2="21" y2="21" />
    </Icon>
  );
}

export function IconParking({ size, color }) {
  return (
    <Icon size={size} color={color}>
      <Rect x="3" y="3" width="18" height="18" rx="2" />
      <Path d="M9 17V7h4a3 3 0 010 6H9" />
    </Icon>
  );
}

export function IconHeart({ size, color }) {
  return (
    <Icon size={size} color={color}>
      <Path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </Icon>
  );
}

export function IconLocate({ size, color }) {
  return (
    <Icon size={size} color={color}>
      <Circle cx="12" cy="12" r="3" />
      <Line x1="12" y1="2" x2="12" y2="6" />
      <Line x1="12" y1="18" x2="12" y2="22" />
      <Line x1="2" y1="12" x2="6" y2="12" />
      <Line x1="18" y1="12" x2="22" y2="12" />
    </Icon>
  );
}

export function IconLayers({ size, color }) {
  return (
    <Icon size={size} color={color}>
      <Polygon points="12 2 2 7 12 12 22 7 12 2" />
      <Polyline points="2 17 12 22 22 17" />
      <Polyline points="2 12 12 17 22 12" />
    </Icon>
  );
}

// ── Clear / cancel plotted route waypoints ─────────────────────────────────
export function IconRouteOff({ size = 20, color = "#ff4444" }) {
  return (
    <Icon size={size} color={color}>
      <Circle cx="6" cy="18" r="2.5" />
      <Circle cx="18" cy="6" r="2.5" />
      <Path d="M6 15.5V11a4 4 0 014-4h4" />
      <Line x1="14" y1="14" x2="22" y2="22" strokeWidth={2.5} />
      <Line x1="22" y1="14" x2="14" y2="22" strokeWidth={2.5} />
    </Icon>
  );
}

// ── Navigation direction arrows (used in AR HUD) ───────────────────────────

export function IconArrowUp({ size, color }) {
  return (
    <Icon size={size} color={color}>
      <Line x1="12" y1="19" x2="12" y2="5" />
      <Path d="M5 12l7-7 7 7" />
    </Icon>
  );
}

export function IconArrowRight({ size, color }) {
  return (
    <Icon size={size} color={color}>
      <Line x1="5" y1="12" x2="19" y2="12" />
      <Path d="M12 5l7 7-7 7" />
    </Icon>
  );
}

export function IconArrowUpLeft({ size, color }) {
  return (
    <Icon size={size} color={color}>
      <Line x1="17" y1="17" x2="7" y2="7" />
      <Path d="M7 17V7h10" />
    </Icon>
  );
}

export function IconArrowUpRight({ size, color }) {
  return (
    <Icon size={size} color={color}>
      <Line x1="7" y1="17" x2="17" y2="7" />
      <Path d="M7 7h10v10" />
    </Icon>
  );
}
