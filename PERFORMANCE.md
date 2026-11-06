# Performance audit — 15 October 2026

## Implemented

- Lanyard and Three.js now ship as one production bundle with unused library code removed: **565,436 bytes**, previously **767,784 bytes** across three scripts (26.4% less uncompressed JavaScript). The bundle compresses to 149,061 bytes with Node's default gzip; actual transfer size depends on hosting compression.
- React and the folder bundle (263,196 bytes uncompressed) are deferred until the work section approaches within 400px of the viewport. The original Folder.jsx and Folder.css remain byte-identical, with both folders green and size 1.3.
- Opening a deep link to Work or Contact no longer immediately initializes the offscreen hero. The hidden reverse card no longer has a preload competing with visible content.
- Lanyard rendering is capped near 60 fps on high-refresh screens. Its solver timestep, geometry, artwork, breeze, drag and flip settings are retained. Duplicate resize rendering is removed.
- The footer uses a viewport-sized canvas and draws only visible rows instead of repainting its entire height. It retains the original wave formulas, bar dimensions, colors and approximately 30 fps motion. Pointer handlers only record coordinates.
- Both canvas effects pause during hidden-tab/pagehide states. The footer now resumes after Back/Forward cache restoration instead of remaining permanently stopped.
- Reduced-motion footer rendering remains static. Mobile folder space is reserved before the deferred bundle mounts, using the existing 400px cell heights and 24px gap at the existing 700px breakpoint.

## Verified

`node --test scripts/performance.test.mjs` passes eight checks against the actual modules:

1. Footer pause/resume for offscreen, hidden tab and back/forward lifecycle.
2. Approximately 300 painted frames over 10 simulated seconds at 60, 120 and 144 Hz.
3. Bounded footer canvas and fewer than 2,000 bar draws at 1024px wide even with a 100,000px tall form; no layout reads for 100 pointer movements.
4. Reduced-motion static frame and preference changes.
5. Deferred folder import, hidden-tab gating and duplicate-load prevention.
6. Recovery after a failed folder import using an injected loader.
7. Exact original folder source/style hashes.
8. Actual lanyard solver stability over 20 simulated seconds each at 30 and 60 fps, including intro, flip, drag and release.

Production scripts pass JavaScript syntax checks. The actual folder showcase also passes server-render checks for both labels and equal size. Rebuilding the lanyard completes successfully with the locally installed bundler.

These are deterministic JavaScript checks, not browser layout or GPU benchmarks. The local preview port was occupied and its HTTP readiness request failed, so desktop/mobile visual checks, real pointer interaction, console inspection, Lighthouse/Core Web Vitals, network throttling and device frame timings are **not verified** in this pass. No universal speed or smoothness guarantee is made.

## Remaining launch gaps

- Inquiry and quick-note submissions still do not send email; the receiving service/endpoints have not been supplied.
- `/photos/pier.jpg` is the user's original example path and has no supplied image. This is still a missing resource when folders open.
- The original folders are intentionally untouched. They stop their animation loop when springs settle; their interaction/render behavior still needs real-browser checks.

## Maintaining the result

- After editing `src/lanyard.js`, run `npm run build:lanyard`.
- After editing folder integration, run `npm run build:folders`.
- Run `npm run check` before packaging.
- Deploy the complete contents of `dist`, or the regenerated `portfolio-upload-only.zip`. Source files and Node.js are not required on the static host.
- Do not disable animation or lower physics accuracy simply to chase a performance score. Measure the deployed site on desktop and a real mobile device before further tuning.
