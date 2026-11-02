# Desktop design and interaction notes

Current revision, 2 November 2026: the latest public GitHub workspace has been imported. The homepage now retains the alpine photograph, three featured projects and 3D icons, with contextual menus and a live landscape. See DESIGN-NOTES.md for the current implementation. Earlier sections below record preceding versions.

The final direction is a Mac-style personal desktop, following the user's latest preference. A menu bar, translucent Dock, traffic-light controls, light document windows, Finder-like folders, and terminal provide a coherent way to explore the portfolio. The detailed profile opens immediately.

## Primary references

[Apple's Designing for macOS guidance](https://developer.apple.com/design/human-interface-guidelines/designing-for-macos/) supports movable, resizable windows, direct menu commands, keyboard access, and comfortable information density. [Window guidance](https://developer.apple.com/design/human-interface-guidelines/windows) and [toolbar guidance](https://developer.apple.com/design/human-interface-guidelines/toolbars) informed the separation between controls, navigation, and document content.

Earlier cinematic research included [Territory's Stark laboratory interfaces](https://territorystudio.com/project/marvels-avengers-age-of-ultron/), [Cantina's Iron Man 3 work](https://www.cantinacreative.com/film/iron-man-3), and [John LePore's Iron Man 2 case study](https://johnnymotion.com/project/ironman-2). A useful principle was to give an interface real subject matter and functional states. This desktop uses actual projects, education, research, and teaching. It contains no film footage, actor likenesses, copied interfaces, franchise logos, or fake operational statistics.

[Bruno Simon](https://bruno-simon.com/), [Lusion Labs](https://labs.lusion.co/), [Active Theory](https://activetheory.net/), [Igloo](https://www.igloo.inc/), [Resn](https://resn.co.nz/), and [Aristide Benoist](https://aristidebenoist.com/) were inspected as primary interactive-portfolio examples. Direct content access and clear actions were retained. The final desktop uses ordinary app/window interactions.

## Implemented behaviour

- Apps open from menu, shortcuts, pinned Dock, terminal, and guide source links.
- Move windows by the title bar; resize with the corner or keyboard arrows; maximise, restore, minimise, and close.
- Dock indicators represent actual window state. The clock shows actual Adelaide time. Fullscreen requires a visitor action.
- Projects appear as six folders and open their case studies. Coursework retains three reviewed reports and implementation repositories.
- JARVIS covers technical exploration, FRIDAY covers background and experience, and EDITH locates work. Each uses bounded public knowledge with source links and an unknown-question fallback.
- Terminal supports documented portfolio commands and app launching; it does not execute operating-system commands.
- Avatar uses supplied artwork and registered eyelids. Window transitions, Dock hover, and blinking respect reduced motion and Motion off.
- Coast wallpaper is original code-native SVG artwork, not an Apple asset or generated photograph.

References inform interaction choices; this personal portfolio is not an Apple or Marvel product.

## Orbital Horizon wallpaper

The futuristic finish preserves the approved Mac desktop: light documents, traffic-light controls, familiar windows, and the Dock. Cool glass chrome and restrained edge reflections frame the new wallpaper. The desktop menu offers Orbital Horizon and the original Coast, remembers the choice, and keeps pointer depth static when motion is disabled.

Final asset: dist/assets/desktop-orbital-horizon.png, 1672 x 941 pixels, RGB, 2003907 bytes. Generated with the built-in image_gen.imagegen tool and copied into the project. The source generation is preserved locally; no photo of the user was used or edited.

Final generation prompt:

> Create one premium cinematic desktop wallpaper, widescreen 16:9 composition, ideally 3840x2160. Art direction: a serene, believable future coastal research outpost at blue hour, viewed across an immense calm slate-blue ocean toward a distant atmospheric horizon. Put a small, refined cluster of futuristic research architecture only on the far-right cliffs: sculptural brushed metal, pale stone, a few very restrained warm copper window lights, realistic construction and grounded scale. One enormous but exceptionally graceful slender orbital structure/arc is partially visible high in the upper-right sky, atmospheric and physically convincing rather than a glowing HUD. Pale cyan dawn haze at the horizon, a restrained warm copper sunrise off to the right, deep steel blue and indigo surfaces. The image should feel like an art-directed premium macOS landscape wallpaper, with photographic/concept-art realism, soft depth, precise materials and quietly spectacular scale. Composition is critical: leave generous uninterrupted quiet negative space through the centre and upper-left for desktop app windows and icons; keep the upper-left sky a smooth deep steel-blue gradient, ocean horizon around the lower third, no focal object in the centre. Sophisticated tonal range, natural light, subtle cinematic atmosphere, crisp high-quality artwork. Avoid all text, letters, typography, UI, logos, characters, faces, spacecraft closeups, circuit patterns, HUDs, dashboards, neon swirls, purple or green neon, busy cyberpunk buildings, clutter, exaggerated lens flare, oversaturated colours, watermark, signature. No graphics over the landscape. The result is only the wallpaper artwork.


## Cyber City live wallpaper

The default is now Cyber City: a rainy future city with cyan-lit architecture, amber windows, and a reflective avenue. The approved Mac desktop stays in place. A decorative canvas animates multiple rain depths, small transit lights along the two elevated routes, perspective traffic on the avenue, drifting skyline mist, and soft navigation lights. Its coordinates follow the same cover crop as the artwork, including the mobile crop. This is an animated canvas over an original still illustration; it is not a video.

The live canvas draws at a maximum of 30 frames per second and caps pixel density at 1.5. Rain count adapts to screen area, with a lower cap on phones. It stops scheduling frames when the document is hidden, another wallpaper is selected, Motion off is active, or reduced motion is requested. A paused scene retains its last frame. The skyline, rain, traffic, and pointer depth stay behind the windows; document text remains steady.

The menu offers Cyber City, Orbital Horizon, and Coast. Returning visitors see the new edition once, after which their wallpaper choice persists. Dock icons magnify by pointer proximity and bounce when launching apps. Opening/restoring windows and opening the menu have short transitions; project folders respond to hover. All decorative effects respect the motion controls. The supplied avatar remains unchanged and uses the same registered two-second eyelid animation.

Implementation: dist/live-wallpaper.js, dist/cyberpunk-desktop.css, dist/desktop.js, and templates/desktop.html. Browser checks verify changing canvas pixels, static Motion off/reduced-motion output, wallpaper switching/persistence, Dock launching, mobile cropping, no overflow, and menu accessibility. The complete desktop interaction suite also passed. These checks do not constitute formal accessibility certification.

Final asset: dist/assets/desktop-cyber-city.png, 1672 x 941 pixels, RGB, 2269418 bytes. Generated using the built-in image_gen.imagegen tool, copied into the project, and visually inspected. This new landscape does not use or edit a photograph of the user. Orbital Horizon and the original source generation are preserved.

Final generation prompt:

> Create one premium cinematic cyberpunk-city desktop wallpaper, widescreen 16:9 landscape, ideally 3840x2160. A believable future city at night seen from a sheltered high-rise terrace in light rain: immense layered dark steel and graphite architecture, tall refined buildings with sophisticated pale-cyan light strips and warm amber illuminated geometric panels, a few restrained cherry-red navigation lights. Rain haze, subtle airborne moisture, deep atmospheric perspective, and wet reflective streets. Clear architectural future-city identity, elegant film-production concept art with photographic realism, precise materials, and grounded scale; no generic abstract neon waves. Composition for desktop usability: the upper-left sky and much of the centre should remain quiet, dark, and low-contrast behind app windows; place the most intricate illuminated architecture toward the right and edges. A broad avenue recedes through the lower third into a readable vanishing point near the middle-right horizon; its street surface is dark and reflective with a few fine cyan and amber traffic lights, no dense crowds. Include two slender elevated horizontal transit routes across the lower-middle skyline, with clean readable paths that could later receive subtle animated light traffic. A minimal dark terrace lip may frame the very bottom edge. Restrained palette of deep navy, charcoal steel, cyan, warm amber, and very sparse cherry-red; controlled highlights, no blown-out neon glow. Sophisticated futuristic desktop art rather than a game menu or AI dashboard. Absolutely no letters, words, typography, gibberish signage, logos, UI, HUD, numbers, people, characters, faces, robots, watermark, signature, purple or green lighting, fluorescent fog, circuit patterns, ornamental neon swirls, giant moons, or spacecraft close-ups. Illuminated signs are plain geometric light panels without symbols. Output only the landscape artwork.
