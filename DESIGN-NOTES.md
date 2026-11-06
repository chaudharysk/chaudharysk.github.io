# Field Notes: desktop design research

Reviewed 2 November 2026. The brief is a colourful personal desktop with dimensional icons, useful animation, obvious navigation and an authored appearance. The earlier pastel-gradient skin was abandoned before publication.

## Primary sources and decisions

| Reference | Finding applied in this site |
| --- | --- |
| [Microsoft: app icon design](https://learn.microsoft.com/en-us/windows/apps/design/iconography/app-icon-design) | Use familiar object metaphors and readable silhouettes. Depth and colour support recognition; avoid adding unrelated decorative symbols. |
| [GNOME: app icons](https://developer.gnome.org/hig/guidelines/app-icons.html) | A consistent baseline and light direction create a coherent family. Distinct objects can share visual weight without identical rounded-square backgrounds. |
| [Apple: app icons](https://developer.apple.com/design/human-interface-guidelines/app-icons) | Foreground/background separation and restrained responsive movement convey depth. Use the same recognisable artwork across desktop shortcuts, Dock and menu. |
| [Apple: materials](https://developer.apple.com/design/human-interface-guidelines/materials) | Material should communicate hierarchy and preserve contrast. Glass is confined to desktop chrome; reading content has an opaque paper background. |
| [Microsoft: motion timing and easing](https://learn.microsoft.com/en-us/windows/apps/design/motion/timing-and-easing) | Entrances decelerate and exits accelerate. Interaction feedback is brief; window minimising follows its destination rather than fading arbitrarily. |
| [GNOME: sidebars](https://developer.gnome.org/hig/patterns/nav/sidebars.html) | Persistent location lists help switching between related views. Retain the Projects sidebar, but expose main destinations directly on the desktop. |
| [Raycast: technical design account](https://www.raycast.com/blog/a-technical-deep-dive-into-the-new-raycast) | Native feeling depends on small behaviours, clear keyboard access and responsiveness. Add a familiar search shortcut, retain ordinary pointer/keyboard controls and avoid a heavyweight 3D runtime. |
| [W3C: animation from interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html) | Nonessential interaction motion can be disabled. Respect the existing site-wide Motion off preference and the operating system's reduced-motion setting. |
| [Microsoft Fluent Emoji](https://github.com/microsoft/fluentui-emoji) | Use the published 3D assets as one consistent illustrated family, self-hosted with the upstream MIT license and a provenance manifest. |

## Visual direction

The desktop itself is the homepage. Nine labelled object icons provide direct access to its apps. A physical paper note introduces Shashikant's work, with direct Projects, CV and Contact actions. Three selected projects make the work visible before visitors need to learn the desktop. A real alpine-lake photograph supplies atmosphere and natural colour, while the windows use graphite glass, quiet aluminium title bars and opaque documents. The floating portrait is removed; factual portfolio content remains intact.

Reading pages use book-like serif headings, a system sans-serif for body text, quiet ruled sections and restrained warm/cool material tones. There are no new gradient hero cards, invented metrics, new portfolio claims or added backend services.

## Motion behaviour

- Desktop objects arrive in a short stagger, then remain still.
- Hover/focus lifts the object without moving the button hit area. Fine-pointer tilt is limited to 6–8 degrees.
- Opening/restoring a window takes 280 ms; minimising takes 240 ms and moves toward its own Dock icon.
- Existing Dock launch feedback and proximity magnification remain available.
- The photographic wallpaper stays still; there is no live-city canvas on the homepage.
- Motion off and reduced motion suppress decorative movement; phones use immediate minimising and no pointer tilt.

## Asset attribution

Eight PNG icons are copied unmodified from the official Microsoft Fluent Emoji repository: Identification card, Open file folder, Briefcase, Books, Clapper board, Robot, Page facing up, and Envelope. The MIT license is retained beside the assets. The terminal is an original small SVG. No external icon CDN or browser-side third-party requests are introduced.

## Alpine revision

The latest feedback rejects both the city wallpaper and the floating face. The homepage now uses Philippe Toupet’s real alpine landscape, with a plain slate alternative. The portrait’s markup and event handlers are removed rather than merely hidden. Asset source and licensing are recorded in `assets/WALLPAPER-CREDIT.md`.

## Workspace 2: a portfolio people can find their way around

Additional research reviewed 2 November 2026:

| Reference | Decision applied |
| --- | --- |
| [Josh Comeau: an effective developer portfolio](https://www.joshwcomeau.com/effective-portfolio/) | Guide visitors toward selected work. Feature Hermes, edTuned and the published research on arrival, then offer the full six-project gallery. |
| [Nielsen Norman Group: icon usability](https://www.nngroup.com/articles/icon-usability/) | Keep text labels beside the desktop icons. Add an explicit workspace heading and a visible search control. |
| [Apple: toolbars](https://developer.apple.com/design/human-interface-guidelines/toolbars) | Keep the document title, return action, direct-page link and sharing action together. Phones get a labelled Desktop button instead of relying on tiny traffic-light controls. |
| [Apple: search fields](https://developer.apple.com/design/human-interface-guidelines/search-fields) | Put project search above its results, with category filters, an accurate result count and a useful empty state. |
| [W3C: modal dialogs](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) | Use a native modal dialog for app search, with contained focus, Escape dismissal and keyboard result selection. |
| [W3C: minimum contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) | Darken secondary labels on the new paper and gallery surfaces. Sampled text/background combinations meet the 4.5:1 normal-text threshold. This is not a site-wide accessibility certification. |

The gallery uses actual hardware photographs where available and simple project-specific type treatments elsewhere. Grid/list preferences persist locally. Search and filters work entirely in the browser. Project deep links survive reloads and browser Back/Forward; ordinary project URLs remain available for opening in a separate tab. The desktop shortcuts support arrow keys, Home and End in addition to normal Tab/Enter navigation.

On phones the introduction, selected projects and labelled shortcuts form a scrolling page; app windows fill the available area and the Desktop control returns to that page. The existing reduced-motion and Motion off preferences also cover the new panels and launcher.

### Validation for this revision

- JavaScript syntax and whitespace checks.
- Desktop visual checks for the homepage, six-project gallery and modal launcher.
- Project search, category filters, empty-state reset, grid/list switching and persisted view preference.
- Keyboard launcher search and result activation; project deep links on reload, Back and Forward.
- Phone layouts at 390 × 844 and 320 × 740, including no horizontal overflow, project filtering and return to the desktop.
- Local references in the updated homepage resolve; no additional runtime dependency or external asset request was introduced.


## Live landscape and contextual actions - 2 November 2026

This revision starts from the user's latest GitHub main, 4db5800, rather than the earlier Cyber City checkout. The current alpine photograph, 3D icons and their source/license files were downloaded unchanged. Featured work, the gallery and modal launcher are retained. The portrait remains absent from the homepage, following that newer revision.

[Apple's context-menu guidance](https://developer.apple.com/design/human-interface-guidelines/context-menus) informed the decision to show a short list of useful actions related to the clicked object. [W3C's menu pattern](https://www.w3.org/WAI/ARIA/apg/patterns/menubar/) informed menuitem roles, checked radio/checkbox states, roving focus, arrows, Home/End, first-letter navigation, Escape and submenu focus return. Ordinary document and text-input menus retain browser behaviour.

The contextual menu uses a light material, concise labels, restrained icons, separators, checked settings and submenus. Menus are measured at their full unanimated dimensions before clamping to screen edges. Outside clicks, wheel/touch scrolling and focus loss dismiss them. Delayed gallery scroll events do not dismiss a newly opened menu. A visible wallpaper control supplies the same actions without requiring a secondary mouse button.

The alpine cinemagraph uses the original photograph at runtime. Only a conservative lake mask receives horizontal reflection displacement; the mountains, shore and reading text stay registered. Small ripples, reflected highlights, drifting valley mist, high wisps and distant birds create several motion depths. Pointer presses on exposed lake water add temporary ripples. The photograph itself is unchanged. Cinematic and Calm presets persist locally. Plain Slate remains static.

The canvas caps drawing at 30fps, pixel density at 1.5 and resolution at 2.6 megapixels. It uses wider lake bands on phones, reuses a small atmosphere texture, stops scheduling frames when hidden, and follows Motion off/reduced motion. A paused scene retains its last frame. No sound, network animation library, shader runtime or new service is added.

Window dragging accepts only the primary pointer button. The entrance animation is disabled during a drag and remains disabled on release so the window does not jump or shrink; restoring a minimised window re-enables its short entrance animation. Native title-bar and Dock controls continue to work.

Validation: focused desktop and phone browser checks, all contextual actions, keyboard/submenu focus, edge fitting, preferences, live canvas/pause/reduced-motion output, gallery navigation and launcher, window drag/resize, terminal facts and all three guide personas. Axe scans of the desktop, phone homepage, root context menu and Animation submenu found no violations in the checked states. All eleven generated document bodies were compared with the downloaded version and are unchanged; the alpine image and icon/license hashes also match. This is focused validation, not formal accessibility certification.


## Personal OS - 7 November 2026

The new direction uses a cinematic future observatory, warm rose/coral light, tactile objects and deliberate voice controls. [Geoff McFetridge's interview about Her](https://www.pushing-pixels.org/2018/04/05/screen-graphics-of-her-interview-with-geoff-mcfetridge.html) informed the interest in a personal, approachable near-future interface. The identity, artwork, nine SVG objects and controls here are original.

[MDN's speech-voice documentation](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis/getVoices) informed voice discovery and updates when available voices change. [Web Audio best practices](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Best_practices) informed visitor-started audio and visible controls. Prepared topic narrations supply a reliable default across devices; custom device voices are optional. Interface cues start only after a visitor enables them. There is no continuous soundtrack or microphone request.

Icon assets use one lighting direction, material palette and object scale, preserving recognisable folder, document, terminal and contact metaphors. HTML labels supply accessible names. No continuous motion is embedded inside the SVGs; interaction motion follows the site's existing reduced-motion controls. The older Fluent assets and their upstream licence are preserved but are not the active desktop icon family.

The independent left column prevents detailed introductory copy from colliding with featured work. The phone wallpaper control is in the scroll flow. The voice waveform represents playback state, not microphone input. The answers remain scoped to the reviewed public portfolio. Exact asset metadata, complete image prompt, narration methods and verification scope are in WORKSPACE.md.
