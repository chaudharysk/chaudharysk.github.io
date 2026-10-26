# Shashikant Chaudhary - portfolio

Live at https://chaudharysk.github.io/.

A calm, playful portfolio covering AI, data, mathematics, research, teaching, and hands-on projects. The site uses static HTML, one shared stylesheet, self-hosted fonts, and small browser scripts.

## Explore

- [Home](https://chaudharysk.github.io/): introduction and interactive avatar.
- [Projects](https://chaudharysk.github.io/projects.html): six projects, each with its own detail page and source links.
- [Coursework](https://chaudharysk.github.io/coursework.html): three Deep Learning Fundamentals assignments with short descriptions, public PDF reports, and code repositories.
- [Playground](https://chaudharysk.github.io/playground.html): six real video recordings and two hardware photos.
- [About](https://chaudharysk.github.io/about.html): background, education, experience, and published research.
- [Public CV](https://chaudharysk.github.io/cv.html).

## Run locally

Run `python -m http.server 4173` from the repository root, then open http://localhost:4173. No build or dependency installation is required for these static files. GitHub Pages serves the root of `main`; `.nojekyll` keeps the static pages and assets intact.

## Edit

The root HTML files contain the page content. `projects/` contains the six individual project pages. `site.css` provides the shared responsive design. `site.js` handles navigation, motion preferences, project filtering, and redirects for old section links. `avatar.js` provides the distinct AI, Maths, and Human poses and the eye-only blink every two seconds. `gallery.js` handles the media viewer and filters.

The motion preference persists across pages and respects reduced motion. Videos load only when opened; closing the viewer releases playback. Existing standalone pages and unrelated repository files are preserved.

## Coursework and privacy

Only the three requested Deep Learning Fundamentals reports are included. See [COURSEWORK.md](COURSEWORK.md) for the artifact mapping and review context. Public PDF copies remove the first-page location/student email and clear metadata while retaining author/university attribution, figures, and source links. The original files are unchanged.

The site excludes home address, phone number, visa details, referee contacts, signatures, original application documents, private LMS records, grades, and dataset archives. Concepts of AI and ML materials are deferred as requested.

## Validation

Checked 12 page routes, local file links, 77 page/viewport combinations from 320 to 1440 pixels, mobile menus, project filters, all six detail routes, three PDF responses, gallery/video/caption controls, focus restoration, distinct avatar poses, the two-second eye-only blink, motion preferences across pages, legacy links, and CV access. No horizontal overflow, clipped headings, or runtime/HTTP errors were found. Automated axe WCAG A/AA checks passed on the five main pages and Hermes project page.