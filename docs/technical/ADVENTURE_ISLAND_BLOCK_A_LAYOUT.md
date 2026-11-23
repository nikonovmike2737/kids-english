# Block A implementation — geometry and asset separation
The background source is `assets/maps/adventure-island.webp`, 1672×941, intentionally **free of dynamic cats and chests**.
The overlay is the single source of truth for lesson positions and chest foot contact coordinates at `assets/js/data.js`. The clean map is stretched to viewport `100vw × 100dvh` without content cropping or side frames, and the routes use an SVG `viewBox="0 0 1672 941"`.
Top: lesson 1→4, small chest A on the top plateau, then bridge A.
Middle: lessons 5→8 right to left, chest B at the left of the middle plateau, then bridge B.
Bottom: lessons 9→12, small chest C, final bridge to grand chest on a **separate** island.
All cat/chest/symbol icons are native binary assets in dedicated groups. Cat body has transparent background. The overlay's UI state and existing `localStorage` schema remain unchanged.
Do not re-add border frames, external ribbon/legend or dynamic elements to background art.
