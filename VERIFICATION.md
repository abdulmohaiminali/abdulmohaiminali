# First-draft verification

- JavaScript syntax checks passed for main.js and lanyard.js.
- Local HTTP preview returned 200.
- Browser inspection at 1440px desktop and 390px mobile widths.
- Mobile document width was within viewport width; no horizontal page overflow.
- The supplied lanyard rendered successfully with custom signature artwork.
- Flip, replay and drag were exercised in the browser; visible card movement and back face confirmed.
- Creative direction expanded and the other disclosure closed.
- Navigation links and the home anchor were exercised.
- No browser warnings or errors were returned during the checks.
- Reduced-motion fallback and offscreen/hidden-tab suspension are source-checked, not separately device-tested.
- No Lighthouse score or physical-device performance benchmark has been claimed.
- Hosted publication is incomplete: the credential-bearing source workflow input was rejected by automatic approval review. Local source and preview remain available.

Measured uncompressed file sizes: index.html 6,650 B; styles.css 11,663 B; main.js 4,577 B; lanyard.js 47,631 B; the two Three.js modules 720,032 B combined. Original supplied PNG: 244,465 B. These are file sizes, not measured network transfer or loading times.

Logo update: replaced the PNG and generic favicon with the supplied 12,709-byte SVG. Header, footer, fallback card and favicon image URLs loaded in the browser; no warnings/errors were returned. Canvas artwork now draws the complete SVG. Previous file-size measurements above describe the initial draft.

Footer update: moved the contact callout into the semantic footer and added the MicroSlats-inspired canvas background using native canvas rather than adding OGL. The footer and its content were visually inspected in the local preview at the current narrow browser width; contact and back-to-top anchors are present in the accessibility tree. JavaScript syntax passes. Reduced-motion static rendering and offscreen/hidden-tab pausing are source-checked, not separately device-tested.

Font update: switched the global typeface to a self-hosted Inter variable WOFF2 and included its SIL Open Font License. This gives visitors the same bundled Latin font without relying on SF Pro being installed locally or distributing Apple's font files.

Card portrait update: added the supplied profile PNG to the card's main artwork window in both the interactive Three.js texture and static fallback. The complete square graphic is centered without cropping; other card artwork and layout remain unchanged. Preview showed the updated image; JavaScript syntax checks passed.

Card face fit update: changed the front to a full-bleed cover of the supplied profile image, centered and cropped horizontally as needed to preserve the image proportions within the portrait card. Applied to both the interactive texture and static fallback; reverse face remains unchanged. Reloaded preview showed the complete graphic filling the front.


Lanyard settings and supplied face artwork: applied the provided front and back PNGs as full-cover textures and set imageFit cover, white card base, portrait orientation, glossy finish, 0.3 corner radius, size 0.6, centered anchor, 0.5 strap length, green strap, 0.65 strap width, silver metal, gravity 1, damping 0.5, elasticity 0.5, breeze 0.5, interactive and intro enabled. The same face images are used in the static fallback. No band.png was attached; the component's generated woven strap texture remains in use with the requested green color. Browser preview showed the new front filling the card face; JavaScript syntax checks passed.


Section 2 animated rows: renamed the first three labels to CREATIVE DIRECTION, GRAPHIC DESIGNER and UI / UX DESIGN, and added BRANDING and SOFTWARE ADMINISTRATION. Each row keeps the existing hover marquee and links to the matching discipline. Browser accessibility tree confirms all five labels; syntax checks passed.


Card back artwork update: replaced dist/assets/card-back.png with the user's final supplied image; front artwork and lanyard settings remain as configured. File is present and main.js syntax check passed.


Footer credit: changed to the requested exact text, "Create identites.". Browser page source updated; no script changes required.


Contact interface: added the full inquiry form and animated quick-note popover with live 100-word counter and input cap. Browser accessibility tree confirms fields and controls. JavaScript syntax checks passed. Email delivery is intentionally pending the receiving email and hosting/provider details; the UI explains that messages are not yet sent.


Contact copy and button polish: updated the quick-note line to "Leave a sticky note for me.", changed the inquiry heading, removed the introductory design paragraph and inquiry arrow, and centered the submit label. Browser accessibility tree and footer screenshot confirm the wording and centered button. Rebuilt the portfolio ZIP.


Contact section: removed the large "Let’s make it mean something" heading and retained an accessible "Contact" label on the footer. Browser accessibility tree confirms the heading is absent and the remaining contact form and quick-note controls are still present.


Portfolio heading: removed "with something to say" and shortened the work-section title to "Work.". Browser accessibility tree confirms the updated heading and the contact copy remains intact.


Footer update: removed the 'Have something in mind?' kicker, removed the footer credit and back-to-top link, and centered the home logo. Source HTML and CSS checked; the current browser preview still appears to serve an older footer snapshot, so live visual confirmation remains unresolved.

Work/contact refinement: removed the 'The portfolio / Work.' heading, expanded the remaining work preview to one column with a descriptive section label, and reduced the footer contact container's bottom padding by 6px on desktop and mobile.

Mobile contact spacing: set the footer contact top padding to 6px at the existing 700px breakpoint, and reduced the intro row padding-top from 22px to 2px. Kept the section height content-driven rather than fixed at the annotation's rounded 875px measurement.

Responsive contact spacing: set the footer contact container top padding to 6px at all widths, including the 1024px breakpoint; mobile remains 6px. This replaces the previous viewport-scaled desktop top padding.

Mobile contact prompt: added 19px top padding to the contact prompt within the existing max-width 700px responsive rule.
The contact prompt's 19px top padding applies at all widths; its existing 22px mobile margin remains scoped to the mobile breakpoint.

2026-10-15 folder integration correction: The current site retains the updated lanyard artwork, five service rows, contact form, 100-word quick note, centered footer logo and recent contact spacing. Kopp now uses the supplied default configuration and click callback; Photos uses the final values from the supplied props. Folder.jsx still matches the supplied attachment byte-for-byte, and Folder.css contains the original user-supplied stylesheet. The automatic JSX build succeeds and the actual showcase passes a server-render check for both labels and their separate sizes. The preview launcher now compares the served HTML, folder JS and folder CSS with this package, and the server resolves dist relative to its own file.
Live preview limitation: the browser at port 4174 showed an older website snapshot and timed out on reload. A fresh server at 4175 started, but its readiness request timed out too. Automatic approval review rejected another browser navigation attempt. No current browser animation, drag or responsive visual check is claimed.

2026-10-15 performance audit: See PERFORMANCE.md for measured bundle sizes, eight passing scheduler/physics regression checks, source-preservation hashes, loading changes and verification limits. Seven script syntax checks and all static HTML asset paths passed. The original Folder JSX/CSS are unchanged. Live browser testing remains unavailable: port 4173 was occupied and the readiness request failed. Contact delivery and the sample pier image remain incomplete. Upload/source ZIPs were regenerated from this version.

2026-10-18 annotated removals: removed the About introduction and all three expertise accordion rows. Kept the five animated discipline rows, pointed their links at Work, removed obsolete accordion handlers, and removed the now-unneeded menu top margin. All HTML fragment links resolve; main.js syntax passes. The live preview at port 65057 confirms the removals, intact folders and contact content, with narrow and 1280px desktop screenshots checked. Browser console returned no captured error/warning messages during this check.

2026-10-18 six project folders: renamed Photos to FC Spes; added E[S]1, E[S]2, amapp and HydeTech alongside Kopp. All six use shared props and the original unchanged component/style. Browser checks confirm all labels, equal 291.198px rendered widths and rgb(0, 191, 99), six successful keyboard open/Escape-close cycles, desktop two-column layout and mobile single-column layout (2520px grid height). Server-render check passes six names and size 1.3. Grid space is reserved in normal flow so the added rows do not overlap Contact. Existing placeholder page contents remain pending supplied images.
