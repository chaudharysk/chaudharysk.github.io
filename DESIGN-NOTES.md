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

The desktop itself is the homepage. Its nine labelled object icons remain visible on arrival. A small physical paper note is the only introduction; it opens the detailed profile. A real alpine-lake photograph supplies atmosphere and natural colour, while the windows use graphite glass, quiet aluminium title bars, opaque documents and a single blue interaction accent. The floating portrait is removed; factual portfolio content remains intact.

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
