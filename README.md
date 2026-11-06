# Abdul Mohaimin Ali — portfolio draft

Editable HTML/CSS/JavaScript portfolio with prebuilt lanyard and folder bundles. Brand colors: `#00bf63`, `#131A16`, and `#ffffff`. Serving the delivered `dist` requires no build.

## Preview locally

Double-click **Start preview.cmd**. The launcher opens the current portfolio at its Work section and checks the served page and folder bundles against this package. It chooses a new local address when an older preview is occupying the usual address.

For a manual preview, run `node server.mjs` in this folder, then open the Local address printed in the terminal.
Use an HTTP server: opening index.html directly with file:// can prevent ES modules from loading.

## Edit

- `dist/index.html`: all page content and accessible markup.
- `dist/css/styles.css`: shared brand tokens, typography, layout, breakpoints and small transitions.
- `dist/js/main.js`: identity-card artwork, buttons, progressive 3D initialization and accordion behavior.
- `src/lanyard.js`: the adapted supplied Three.js physics component; rebuild with `npm run build:lanyard` after editing.
- `src/vendor/`: pinned Three.js build inputs. Production loads only `dist/js/lanyard.bundle.js`.
- `dist/js/footer-slats.js`: viewport-sized footer rendering and animation lifecycle.
- `dist/js/load-folders.js`: deferred loading for the original folder component.
- `reference/Lanyard.original.jsx`: the original supplied component, kept intact for comparison.
- `AGENTS.md`: standing design/performance instructions for future code changes.

The hero's supplied React component has been adapted to a direct JavaScript initializer. Its simulation, mesh generation, grabbing and flipping are retained. The wrapper, visibility handling, rendering resolution and default breeze were changed for this website. The missing Lanyard.css was replaced by the site's own stage/canvas styles.

The three supplied role SVGs frame the centered lanyard and card. The card scales up on wide screens and adjusts at the mobile breakpoint.

The supplied MicroSlats visual is adapted as a small canvas effect behind the contact footer. It uses the existing brand colors, caps drawing resolution and frame rate, responds subtly to pointer movement, pauses offscreen, and draws a static frame for reduced-motion visitors. It adds no renderer or animation dependency.

## Performance decisions

- Semantic HTML renders without JavaScript; layout space is reserved for the badge.
- Three.js 0.180.0 is pinned and bundled with unused code removed; the lanyard initializes only near the hero, after first paint.
- The supplied Folder component uses locally bundled React. There are no external font requests, trackers or background video.
- WebGL pauses when offscreen or the tab is hidden. With breeze disabled it can also sleep when physics settle; the requested breeze 0.5 currently animates while visible.
- WebGL rendering is capped at 60 fps. Device pixel ratio is capped at 1.5 desktop / 1.25 mobile.
- Reduced-motion visitors get the static front card without downloading Three.js.
- Folders load within 400px of the viewport; their original component and CSS are unchanged. The grid reserves three rows on desktop and six rows on mobile before loading.
- The footer draws only its visible slice at approximately 30 fps, with a viewport-sized backing canvas even if a visitor expands the message field dramatically. Pointer movement does not force layout reads.
- Footer and lanyard scheduling pause on pagehide and resume on back/forward-cache restoration.
- The same 12.7 KB supplied SVG is reused in the header, footer, favicon, fallback badge and generated card textures; its vector paths and colors are preserved.
- 768-pixel card textures, 48 strap samples; optional holographic shaders compile only if requested.
- The stable original physics timestep is intentionally retained.

These are implementation choices, not a claim of a measured Lighthouse score or performance on every device.

## Typography

The portfolio self-hosts the Inter variable WOFF2 under the SIL Open Font License. One small file supplies the full 100–900 weight range to every visitor; the Latin subset covers the current English copy. The license is included at `dist/assets/fonts/OFL.txt`.

## Draft content to complete

No projects, client logos, testimonials, statistics, email addresses or social profiles have been invented. Replace the folder example content with real projects and connect form delivery before public launch. Expertise descriptions are draft copy for review. The sample `/photos/pier.jpg` remains missing; supply this image or change the example item before publishing.

## Free public hosting later

The `dist` folder is ready for static hosting. For Cloudflare Pages, deploy `dist` as the output directory, with no build command required. A free pages.dev address can be used; a custom domain is optional. Git-based deployment is preferable for automatic updates. This draft's separate Sites preview starts private.

## Dependency

Three.js 0.180.0 (MIT), kept in `src/vendor/` and bundled into `dist/js/lanyard.bundle.js`. Its license remains in `dist/js/vendor/LICENSE`. No dependency installation or build step is needed to run this delivered version. Keep vendored versions and package.json in sync when upgrading.


The work section uses the supplied animated Folder component and its original CSS, preserved in `src/Folder.jsx` and `src/Folder.css`. `src/folder-entry.jsx` integrates six folders: Kopp, FC Spes, E[S]1, E[S]2, amapp, and HydeTech. All share size 1.3, green #00bf63, centered tabs, solid flap/spread configuration, and the same opening, intro, dragging and zoom settings. The responsive grid has two columns above 700px and one column at or below 700px.

Rebuild with `npm install` followed by `npm run build:folders`. The delivered `dist` folder includes the built JavaScript and CSS, so previewing needs no installation or build. The sample `/photos/pier.jpg` is referenced exactly as supplied; that image has not yet been provided.

