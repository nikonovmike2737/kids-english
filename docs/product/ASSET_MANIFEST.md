# Kids English — asset manifest v1

All production art is committed to GitHub as **native binary PNG/WebP** (not external hotlinks and not data URLs). The library is grouped by role and supports future replacement without remapping the route.

| Folder | Role | Format | Usage |
|---|---|---|---|
| `assets/maps/` | Artwork of Adventure Island and future-world cards | WebP | Background and World Map |
| `assets/mascot/` | ABC kitten and explorer kitten | PNG/WebP | Map, My Cat, branding |
| `assets/chests/` | Closed, opened and grand chests | WebP | Map and rewards |
| `assets/modals/` | Key reward, sad kitten, chest reward | WebP | Modal illustration |
| `assets/symbols/` | Key, coin, lock | WebP | HUD and completed lessons |
| `assets/status/` | Available / completed / locked illustrations | WebP | Canonical status sprite sources |
| `assets/buttons/` | Primary / positive / disabled graphical skins | WebP | Design system reference |
| `assets/inventory/{hats,scarves,shoes,backpacks,tools}/` | 3 tiers per category (1 / 3 / 5 coins) | WebP | My Cat item images |
| `assets/reference/` | Original approved visual concept reference boards | WebP | Design history; not rendered on the public site |
| `assets/css/` | Responsive UI CSS | CSS | Site styling |
| `assets/js/` | Content and client-only game state | JS | Site logic |

**Visual provenance.** The map and artwork were created for this project; crop-based sprites are illustrative derivations of the concept boards. The original high-resolution sources remain available in the ChatGPT project, while optimized production binaries are stored in this repository. The future-world previews are visual teasers and remain locked: they do **not** announce available content.

**No personal content:** art and filenames never contain a child's name, record, photographs or tracking data.

## Rendering
- Map is a **single 16:9 stage** fitted inside the desktop/tablet viewport, using an illuminated frame for leftover aspect-ratio space; the map itself never vertically scrolls.
- The decorative background is intentionally separate from UI markers; lesson buttons, keys, locks, bridges and chests are state-aware interactive elements.
- All child-facing labels are in simple English; documentation for adults may be in Russian or English.
- Transparent PNG/WebP mascots and separate item images allow outfit customization without re-rendering the map.
