# Shashikant Chaudhary — desktop portfolio

Live at https://chaudharysk.github.io/.

A Mac-style personal desktop with movable windows, traffic-light controls, a translucent Dock, Finder-like project folders, a portfolio terminal, and JARVIS / FRIDAY / EDITH portfolio guides. The desktop opens on arrival with nine labelled shortcuts; the welcome note opens the detailed profile.

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

The current desktop uses a real alpine-lake photograph with a plain slate alternative. The floating portrait companion has been removed. Motion controls still govern the Dock and window animations. See `assets/WALLPAPER-CREDIT.md` for the photograph source and license.

## Design and validation

WORKSPACE.md records primary research and implementation choices, including Apple's window and toolbar guidance. This is a personal portfolio, not an Apple or Marvel product.

Browser checks passed for window movement/resizing, traffic-light controls, pinned Dock launchers, menu search, project folders, terminal commands/history, all three guides, safe text rendering, unknown-question fallback, source links opening in desktop apps, phone layouts, PDFs, and media playback. Axe WCAG A/AA checks passed on the desktop, phone versions, and six main document routes. The registered avatar blink retains the source and body bounds. This is automated/interaction validation, not formal accessibility certification.

The futuristic finish adds Orbital Horizon, a cinematic ocean-and-research-outpost wallpaper, with cool glass chrome, restrained reflections, and pointer-responsive background depth. The desktop menu remembers the selected wallpaper; the original Coast remains available. Motion off and reduced motion keep the background static. The generated wallpaper asset and exact prompt are documented in WORKSPACE.md. New wallpaper-selection, persistence, mobile crop, and accessibility checks passed, along with the desktop interaction suite.

Cyber City is the new default live wallpaper, with animated rain, elevated transit, avenue traffic, skyline mist, and soft navigation lights behind the familiar Mac windows. The menu retains Orbital Horizon and Coast and remembers subsequent choices. Dock proximity magnification, launch bounces, window restoration, menu transitions, and project-folder hover add motion. The canvas caps rendering at 30fps and 1.5 pixel density, uses fewer drops on phones, and stops when hidden, on another wallpaper, or when motion is disabled. The supplied avatar and its registered two-second eye animation are preserved. Full asset dimensions, generation method, and exact prompt are in WORKSPACE.md. Live motion, freezing/resuming, wallpaper selection/persistence, mobile sizing, and menu accessibility checks passed, along with the full desktop interaction suite.


## Field Notes desktop

Nine object-shaped 3D shortcuts and a matching Dock open the profile, projects, experience, coursework, playground, CV, contact, terminal, and assistants. A small paper note introduces the desktop; no windows obscure the shortcuts on arrival. The Explore menu and Ctrl/Command + K provide search. Existing deep links still open their corresponding app.

`desktop-polish.css` supplies neutral desktop chrome and paper-like reading pages. `desktop-polish.js` adds small, fine-pointer icon tilts. Window minimising travels toward the actual Dock position; opening, restoring, and icon launches share short, consistent transitions. Motion off and reduced motion suppress decorative animation. All pages remain static GitHub Pages files with no new runtime dependencies.

The 3D icons are self-hosted Microsoft Fluent Emoji assets under the MIT license, retained at `assets/icons/FLUENT-LICENSE.txt`; `assets/icons/SOURCES.json` records provenance and file hashes. The terminal SVG is original. Current research and the resulting design decisions are documented in `DESIGN-NOTES.md`.


The Alpine update replaces the cinematic city wallpaper with Philippe Toupet’s real Vanoise National Park landscape, self-hosted under the Unsplash License. The wallpaper menu now offers Alpine Lake and Plain Slate. The floating portrait markup, interaction handlers, and live-city canvas are removed from the homepage. The nine 3D shortcuts, Dock, and app/window navigation remain available.
