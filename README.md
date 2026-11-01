# Shashikant Chaudhary — desktop portfolio

Live at https://chaudharysk.github.io/.

A Mac-style personal desktop with movable windows, traffic-light controls, a translucent Dock, Finder-like project folders, a portfolio terminal, an illustrated avatar companion, and JARVIS / FRIDAY / EDITH portfolio guides. The detailed profile opens on arrival.

## Explore

The Dock and menu open Profile, Projects, Experience, Coursework, Playground, Assistants, Terminal, CV, Contact, and Help. Drag title bars, resize windows, minimise/restore, or maximise for reading. Mobile app windows fill the available screen. The clock shows actual Adelaide time.

The regular document pages remain available:
- [Detailed profile](https://chaudharysk.github.io/about.html)
- [Experience](https://chaudharysk.github.io/experience.html)
- [Six projects](https://chaudharysk.github.io/projects.html)
- [Three deep learning assignments](https://chaudharysk.github.io/coursework.html)
- [Hardware recordings and photos](https://chaudharysk.github.io/playground.html)
- [Public CV](https://chaudharysk.github.io/cv.html)

## Run locally

Run python -m http.server 4173 from this repository and open http://localhost:4173. These are static files; no installation, account, or backend is needed. GitHub Pages serves the repository root from main, with .nojekyll retained. Existing unrelated standalone pages are preserved.

desktop.js manages windows, search, app navigation, terminal commands, and the Dock. desktop.css and macos.css style the desktop; desktop-frame.css styles documents. site.js handles document navigation, motion, and filters. assistants.js reads assets/portfolio-knowledge.json. gallery.js handles media viewing and playback cleanup.

## Guides and privacy

The three assistants answer from reviewed portfolio records, with topic matching and source links. They are not connected to an external language model or live web search. Unrelated questions receive a clear fallback. Chat text stays in the browser. Optional speech starts only after selecting Read reply.

The site excludes home address, phone number, student IDs, visa information, referees, signatures, original resumes, and private LMS content. Only the three approved Deep Learning Fundamentals reports are included; Concepts of AI and ML materials remain deferred. Existing cleaned public PDFs are unchanged. PROFILE.md and COURSEWORK.md record factual and artifact scope.

The active avatar is an unchanged copy of the supplied illustration, with native silhouette clipping and registered eyelids on a two-second cycle. The real photo is not served. Motion controls respect reduced motion. See AVATAR.md.

## Design and validation

WORKSPACE.md records primary research and implementation choices, including Apple's window and toolbar guidance. This is a personal portfolio, not an Apple or Marvel product.

Browser checks passed for window movement/resizing, traffic-light controls, pinned Dock launchers, menu search, project folders, terminal commands/history, all three guides, safe text rendering, unknown-question fallback, source links opening in desktop apps, phone layouts, PDFs, and media playback. Axe WCAG A/AA checks passed on the desktop, phone versions, and six main document routes. The registered avatar blink retains the source and body bounds. This is automated/interaction validation, not formal accessibility certification.

The futuristic finish adds Orbital Horizon, a cinematic ocean-and-research-outpost wallpaper, with cool glass chrome, restrained reflections, and pointer-responsive background depth. The desktop menu remembers the selected wallpaper; the original Coast remains available. Motion off and reduced motion keep the background static. The generated wallpaper asset and exact prompt are documented in WORKSPACE.md. New wallpaper-selection, persistence, mobile crop, and accessibility checks passed, along with the desktop interaction suite.
