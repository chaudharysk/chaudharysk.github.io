# Learn AI in 2027

A plain, parallel self-study curriculum for students with some Python and engineering maths experience.

**Website:** https://chaudharysk.github.io/ai-2027/

**Start here:** https://chaudharysk.github.io/ai-2027/#/2027

**Learning diagram:** https://chaudharysk.github.io/ai-2027/#/path

Study foundations, language models and applications together through six learning bands. The core covers statistical ML, NLP, transformers, pretraining, SFT/LoRA, preferences/RLHF, RAG, agents, metrics and systems. Selected materials have assigned sections and practical completion checks.

The estimated core workload is 540–760 active hours. A focused 200–400-hour specialisation block follows; independent expertise develops through sustained experiments, replication and review. The start year is 2027, with the research selection explicitly dated November 2026.

## Files

- `index.html`: static page shell.
- `assets/app.js` and `assets/style.css`: routes, interactions and plain system-font design.
- `assets/study-plan.md`: the complete editable curriculum; section 17 is the 2027 route toward expertise.
- `assets/data.js`: generated course content.
- `assets/parallel-learning-path.svg` and `assets/learning-path.js`: downloadable and embedded diagram.
- `source/`: Python generators and the portable rebuild helper.

## Edit and rebuild

Edit the curriculum in `assets/study-plan.md`, the curated data in `source/build_data.py`, or the diagram in `source/build_path.py`. From this directory run:

```sh
python3 source/rebuild.py
```

No package installation or JavaScript bundler is required. To preview, serve this directory using any static web server.

All page navigation and assets support the `/ai-2027/` GitHub Pages subpath. The SVG hosted in `assets/` links back to its learning bands. Progress and saved resources use browser-local storage and are not synced to an account.

External resources retain their own licences and terms. This is an independent educational synthesis with no institutional affiliation.
