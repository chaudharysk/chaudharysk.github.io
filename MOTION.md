# Curiosity lab: research and motion direction

Reviewed 27 October 2026. The brief was to bring back the original portfolio's visual energy while keeping its five-page structure, readable project descriptions, and coursework links.

## Primary references

- [Dennis Snellenberg's portfolio](https://dennissnellenberg.com/) and [his description of his approach](https://dennissnellenberg.com/about): a strong typographic identity, micro-interactions, and transitions make the work feel authored. This informed the emphasis on one coherent motion language across the pages.
- [Bruno Simon's portfolio](https://bruno-simon.com/): a distinctive interactive world can express the creator's personality. Here, the original adaptation is a small interactive AI/mathematics scene around the approved portrait.
- [Codrops: Magnetic Buttons](https://tympanus.net/codrops/2020/08/05/magnetic-buttons/), by Manoela Ilic: layered elements can respond differently to the pointer. The portfolio moves the contents of a CTA while retaining a stable anchor hit area.
- [Codrops: On-Scroll Expanding Image Animation within Typography](https://tympanus.net/codrops/2024/04/02/on-scroll-expanding-image-animation-within-typography/): expressive type and imagery can share the stage. This inspired a short, staggered SHASHI wordmark entrance and large clipped page titles. The original article's responsiveness caveat informed the simpler mobile layout.
- [Codrops: On-Scroll 3D Stack Motion Effect](https://tympanus.net/codrops/2024/03/06/on-scroll-3d-stack-motion-effect/): scroll can choreograph depth. The portfolio adapts that idea to project artwork, keeping paragraphs in ordinary document flow.
- [MDN: Using the View Transition API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API/Using): same-origin documents can opt into native transitions while retaining ordinary page navigation. Shared project art and the header receive unique transition names, with normal navigation available in other browsers.

## What was implemented

| Element | Behaviour |
| --- | --- |
| Home wordmark | Oversized letter entrance, followed by a static readable heading |
| Curiosity engine | Original compact SVG network and orbital geometry around the existing avatar |
| AI / Maths / Human | Connected nodes, a drawn curve and graph tile, or a short star/ripple greeting, alongside the distinct approved poses |
| Blink | The same eye-only layer, every two seconds; portrait registration unchanged |
| Project previews | Small scroll depth, pointer tilt, image zoom, and a local Explore badge |
| Primary buttons | Magnetic inner contents and a colour-fill hover/focus treatment; link box stays fixed |
| Page navigation | Short native transitions where supported, with the header held stable |
| Home ribbon | One decorative AI / mathematics / human connection / making things loop |
| Coursework / About | Strong dark title stages, paper-report hovers, and a higher-contrast research section |

All graphics and application code are original adaptations. The approved portrait, photographs, PDF reports, and project copy are retained. No reference site's artwork, branding, or source code was copied.

## Interaction and access

The normal cursor, ordinary links, browser scrolling, keyboard focus, and touch navigation remain available. Pointer depth is restricted to fine pointers. Decorative loops pause offscreen and in a hidden tab. Motion Off persists across pages, including back/forward restoration, and reduced motion gives a complete static composition. Reading text does not depend on scrolling through a pinned sequence or waiting for an observer.

The implementation uses CSS, inline SVG, and small browser scripts. The motion layer introduces no runtime library downloads. The five main pages, six project pages, public CV, and three cleaned coursework reports retain their routes.
