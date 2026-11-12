# Learn AI in 2027

A study plan for language models and agents. It assumes you have used Python and studied engineering maths before.

**Website:** https://chaudharysk.github.io/ai-2027/

**Diagram:** https://chaudharysk.github.io/ai-2027/#/path

## What to study

1. Python and maths refresher
2. Machine learning and NLP basics
3. Build a language model
4. Fine-tuning and agents
5. RLHF and reinforcement learning
6. Evaluation and a final project

Each part has three tracks: maths and code, language models, and applications. Read the assigned sections, write code and test the results. You do not need to finish every linked course.

Allow an estimated 540–760 hours for the main course, including reading, coding and debugging. After that, choose one subject and allow another 200–400 hours for selected lessons and a project. Further progress comes from working on new problems and getting feedback.

The plan is for a 2027 start. Course and research links were checked in November 2026.

## Files

- `index.html`: page shell.
- `assets/app.js` and `assets/style.css`: pages, interactions and layout.
- `assets/study-plan.md`: editable course notes. Section 17 covers further study.
- `assets/data.js`: generated course content.
- `assets/parallel-learning-path.svg` and `assets/learning-path.js`: downloadable and embedded diagram.
- `source/`: Python generators and rebuild helper.

## Edit and rebuild

Edit `assets/study-plan.md` for course notes, `source/build_data.py` for lesson summaries and materials, or `source/build_path.py` for the diagram. From this directory, run:

```sh
python3 source/rebuild.py
```

The rebuild uses Python 3 with no extra packages. To preview the site, use a static web server.

The links work under the `/ai-2027/` GitHub Pages path. Saved materials and completion checks stay in your browser and are not synced to an account.

External resources have their own licences and terms. This study plan is independent of the institutions and people it links to.
