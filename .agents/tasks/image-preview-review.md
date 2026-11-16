# Building image preview on polygon tap

When a user taps a polygon on the map, BuildingCard now opens with a 180 px image strip at the top showing a photo of the selected building. All 16 buildings currently show a styled placeholder (dark green panel with a building icon and "Image coming soon") because no real photos have been wired up yet. The feature is designed so adding a real image requires changing exactly one line per building in `buildingImages.js` — no other file needs to change. 

Watch for: the `imagePreview` style on `BuildingCard` carries negative margins that bleed the strip to the card edges, but the `container` style inside `BuildingImagePreview` also sets `borderRadius: radius.md` — these two radii do not match the card's `borderTopLeftRadius / borderTopRightRadius: radius.lg` override applied externally, so the inner `radius.md` clips the image corners slightly short of flush. Confirmed.

**Verdict**: NEEDS_CHANGES

---

## High-level view

The image data layer (`buildingImages.js`) is complete: all 16 required building IDs are present, every value is `null` (correct placeholder state), and the comment block clearly documents both the `require()` and URL string paths for wiring real images. The `getImageForBuilding` helper defends against a missing `buildingId` argument.

`BuildingImagePreview` correctly branches on `typeof imageSource === 'string'` to wrap URLs in `{ uri }` and passes `require()` numbers straight through. The fixed `height: 180` on the container matches the intended slot size in both the placeholder and real-image paths.

The `BuildingCard` integration uses `marginHorizontal: -20 / marginTop: -20` to counter the card's `padding: 20`, successfully bleeding the preview to card edges. The close button is correctly positioned with `zIndex: 10` so it sits above the image strip. No existing props or layout sections were disturbed.

One geometric inconsistency exists between the inner and outer border radii applied to the image strip. No new packages were added.

---

<details>
<summary>Issues (1)</summary>

1. **Inner radius mismatch on image strip** — `BuildingImagePreview`'s `container` style sets `borderRadius: radius.md` (14 px), but `BuildingCard` applies `borderTopLeftRadius: radius.lg` and `borderTopRightRadius: radius.lg` (20 px) via the `imagePreview` style. Because `overflow: hidden` is set on the inner container at 14 px, the top corners of the image are clipped to 14 px regardless of the outer 20 px override. Remove `borderRadius` from `BuildingImagePreview`'s `container` style — the component already relies on `overflow: hidden` being inherited from the caller context, and the caller sets the correct radii.

</details>

---

<details>
<summary>Details</summary>

### Border-radius geometry gap

`BuildingImagePreview`'s `container` style:

```js
container: {
  height: 180,
  width: '100%',
  alignSelf: 'stretch',
  borderRadius: radius.md,   // 14 px — applied on ALL four corners
  overflow: 'hidden',
},
```

`BuildingCard`'s `imagePreview` override:

```js
imagePreview: {
  marginHorizontal: -20,
  marginTop: -20,
  marginBottom: 14,
  borderTopLeftRadius: radius.lg,   // 20 px
  borderTopRightRadius: radius.lg,  // 20 px
  overflow: 'hidden',
},
```

React Native's `overflow: hidden` clips to the view's own `borderRadius`, not to an ancestor's. Because the inner container has `borderRadius: radius.md` (14 px) and `overflow: hidden`, the 20 px values set on the outer `imagePreview` shell have no effect on the clipping. The top corners of the image strip are clipped at 14 px, producing a subtle but visible radius mismatch with the card's 20 px corners.

Fix: remove `borderRadius` from `BuildingImagePreview`'s `container` style entirely. The component should be radius-agnostic; the caller controls corner rounding via the `style` prop.

</details>

---

<details>
<summary>File map</summary>

| File | What changed |
|---|---|
| `src/data/buildingImages.js` | New file — 16-entry building → image map with `getImageForBuilding` helper |
| `src/components/BuildingImagePreview.js` | New file — image strip component with placeholder fallback |
| `src/components/BuildingCard.js` | Added `BuildingImagePreview` at top of card; added `imagePreview` bleed style |

</details>
