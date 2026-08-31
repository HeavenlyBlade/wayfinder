"""
WAYFINDER — Campus Tile Downloader
Downloads OpenStreetMap tiles for the SACLI campus area and saves them
to assets/tiles/{z}/{x}/{y}.png for offline use.

Usage:
    python scripts/download_tiles.py

Tiles are saved as: assets/tiles/{z}/{x}/{y}.png
"""

import os
import math
import time
import urllib.request

# ── Campus bounding box ───────────────────────────────────────────────────────
# Slightly padded beyond the campus boundaries for context
NORTH =  13.9632
SOUTH =  13.9600
EAST  = 121.6140
WEST  = 121.6105

# Zoom levels — 15 for overview, 19 for close-up navigation
MIN_ZOOM = 15
MAX_ZOOM = 19

# OSM tile server (free, no API key required)
TILE_URL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png"

# Output directory (relative to wayfinder root)
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "assets", "tiles")

# Respect OSM tile usage policy — 1 request per second max
DELAY_SECONDS = 1.1

# ── Coordinate → tile index conversions ──────────────────────────────────────

def lat_lng_to_tile(lat, lng, zoom):
    """Convert lat/lng to OSM tile x/y at a given zoom level."""
    lat_r = math.radians(lat)
    n = 2 ** zoom
    x = int((lng + 180.0) / 360.0 * n)
    y = int((1.0 - math.asinh(math.tan(lat_r)) / math.pi) / 2.0 * n)
    return x, y

def tiles_for_bbox(north, south, east, west, zoom):
    """Return all (z, x, y) tile coordinates covering the bounding box."""
    x_min, y_max = lat_lng_to_tile(south, west, zoom)  # south-west = high y
    x_max, y_min = lat_lng_to_tile(north, east, zoom)  # north-east = low y
    tiles = []
    for x in range(x_min, x_max + 1):
        for y in range(y_min, y_max + 1):
            tiles.append((zoom, x, y))
    return tiles

# ── Download ──────────────────────────────────────────────────────────────────

def download_tile(z, x, y):
    """Download a single tile and save to assets/tiles/{z}/{x}/{y}.png."""
    out_path = os.path.join(OUTPUT_DIR, str(z), str(x), f"{y}.png")
    if os.path.exists(out_path):
        return False  # already cached

    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    url = TILE_URL.format(z=z, x=x, y=y)

    try:
        req = urllib.request.Request(url, headers={
            "User-Agent": "WAYFINDER-Campus-Nav/1.0 (academic project)"
        })
        with urllib.request.urlopen(req, timeout=10) as resp:
            with open(out_path, "wb") as f:
                f.write(resp.read())
        return True
    except Exception as e:
        print(f"  ⚠ Failed {z}/{x}/{y}: {e}")
        return False

# ── Main ──────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    all_tiles = []
    for zoom in range(MIN_ZOOM, MAX_ZOOM + 1):
        all_tiles.extend(tiles_for_bbox(NORTH, SOUTH, EAST, WEST, zoom))

    total    = len(all_tiles)
    new_dl   = 0
    skipped  = 0

    print(f"WAYFINDER Tile Downloader")
    print(f"Bounding box: N={NORTH} S={SOUTH} E={EAST} W={WEST}")
    print(f"Zoom levels:  {MIN_ZOOM}–{MAX_ZOOM}")
    print(f"Total tiles:  {total}")
    print(f"Output:       {os.path.abspath(OUTPUT_DIR)}")
    print("-" * 50)

    for i, (z, x, y) in enumerate(all_tiles, 1):
        downloaded = download_tile(z, x, y)
        if downloaded:
            new_dl += 1
            print(f"  [{i}/{total}] ✓ {z}/{x}/{y}.png")
            time.sleep(DELAY_SECONDS)
        else:
            skipped += 1
            if i % 20 == 0:
                print(f"  [{i}/{total}] skipping cached tiles...")

    print("-" * 50)
    print(f"✅ Done — {new_dl} downloaded, {skipped} already cached")
    print(f"   Total size: {sum(os.path.getsize(os.path.join(r,f)) for r,d,files in os.walk(OUTPUT_DIR) for f in files) / 1024 / 1024:.1f} MB")
