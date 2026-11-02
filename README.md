# Shashikant Chaudhary — desktop portfolio

Live at https://chaudharysk.github.io/.

A personal portfolio presented as a desktop: a paper introduction, three selected projects, nine labelled 3D shortcuts, a Dock and movable app windows. A real alpine-lake photograph provides the wallpaper, with a plain slate alternative.

## Explore

Start with Explore my work, Read my CV, or a featured project. The complete gallery contains six projects, with search, AI/data and hardware filters, grid/list views and shareable project links.

The desktop icons, Dock and Apps menu open Profile, Projects, Experience, Coursework, Playground, Assistants, Terminal, CV and Contact. Search portfolio or Ctrl/Command + K opens the keyboard-accessible launcher. Desktop shortcuts also support arrow keys, Home and End. Drag title bars to move windows; resize, minimise or maximise for reading. On phones, apps fill the available area and a labelled Desktop button returns to the homepage.

Regular document pages remain available:

- [Detailed profile](https://chaudharysk.github.io/about.html)
- [Experience](https://chaudharysk.github.io/experience.html)
- [Six projects](https://chaudharysk.github.io/projects.html)
- [Coursework](https://chaudharysk.github.io/coursework.html)
- [Hardware recordings and photos](https://chaudharysk.github.io/playground.html)
- [Public CV](https://chaudharysk.github.io/cv.html)

## Run locally

Run `python -m http.server 4173` from this repository and open http://localhost:4173. These are static files; no installation, account or backend is needed. GitHub Pages serves the repository root from `main`, with `.nojekyll` retained. Existing unrelated standalone pages are preserved.

`desktop.js` manages windows, app/project navigation, search, terminal commands and the Dock. `desktop-polish.css` supplies the current desktop and paper-like reading surfaces; `desktop-polish.js` adds fine-pointer icon tilts and shortcut keyboard navigation. `desktop-context.js` and `desktop-context.css` provide contextual desktop, app, project and window actions. `alpine-wallpaper.js` animates the landscape with a 30fps cap, at most 1.5 pixel density and a 2.6-megapixel canvas budget. `site.js` handles document navigation, motion and filters. `assistants.js` reads `assets/portfolio-knowledge.json`; `gallery.js` handles media viewing and playback cleanup.

## Motion and assets

Opening, restoring, minimising and Dock launches use short transitions. The alpine photograph now has animated lake reflections, ripples, drifting mountain mist, soft sky wisps and a small distant flock. Cinematic and Calm settings are available from the right-click Animation submenu. The live canvas stops on Plain Slate, in a hidden tab, with Motion off, or when reduced motion is requested. Motion off and operating-system reduced-motion preferences suppress decorative movement; touch devices do not use pointer tilt.

The 3D icons are self-hosted Microsoft Fluent Emoji assets under the MIT license, retained at `assets/icons/FLUENT-LICENSE.txt`; `assets/icons/SOURCES.json` records provenance and hashes. The terminal SVG is original. The alpine photograph source and license are in `assets/WALLPAPER-CREDIT.md`. The original photograph and icon files are unchanged. No floating portrait or live-city canvas appears on the homepage.

## Guides and privacy

JARVIS, FRIDAY and EDITH answer from reviewed portfolio records with source links. They are not connected to an external language model or live web search. Chat text stays in the browser; optional speech starts only after selecting Read reply.

The site excludes home address, phone number, student IDs, visa information, referees, signatures, original resumes and private LMS content. Existing cleaned public PDFs are unchanged. `PROFILE.md` and `COURSEWORK.md` record factual and artifact scope.

## Research and validation

`DESIGN-NOTES.md` records the current research, design decisions and checks. `WORKSPACE.md` retains earlier implementation history.

This revision was checked in the browser for the homepage, gallery, project search/filter/reset, grid/list preference, keyboard launcher, shareable project routes and browser Back/Forward. Phone layouts were reviewed at 390 × 844 and 320 × 740. JavaScript syntax, local references in the updated homepage and whitespace checks also passed. This is focused browser and code validation, not a formal accessibility certification.


## Right-click desktop and live landscape

Right-click empty desktop space for Show Desktop, Explore Projects, Search Portfolio, Wallpaper, Animation and Desktop Controls. App icons and the Dock offer relevant launch/window actions; project tiles offer project opening, a direct page, and copy link. Right-click a title bar to minimise, zoom/restore or close its window. Ordinary reading-page, text-input and external-link browser menus remain available. Shift + right-click also retains the browser menu.

Shift+F10 or the context-menu key opens a focused icon's menu. Arrow keys, Home/End, first-letter navigation and Escape work through the menus; Right/Left opens and closes submenus. Menus fit the viewport, and the Live wallpaper button offers the same controls on touch devices. Preferences stay in this browser.

The latest GitHub revision was downloaded before editing (base 4db5800). Its paper introduction, three featured projects, nine 3D icons, modal search, six-project gallery, deep links and phone Desktop control are retained. A drag-release animation restart and secondary-button drag capture were fixed while adding contextual menus.

Focused browser checks cover animated pixels, pause/resume and reduced motion, all menu contexts, keyboard navigation and submenus, viewport-edge placement, persistent wallpaper/intensity choices, project copy links and deep links, search/filter/reset/view controls, window dragging/resizing, terminal facts and all three portfolio guides. Phone checks cover 390px and 320px widths; menu and homepage axe scans found no WCAG A/AA violations in the checked states. This does not constitute formal accessibility certification.
