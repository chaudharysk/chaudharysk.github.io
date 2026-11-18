"""Build the static course pages for GitHub Pages. Requires Python 3.10+."""

from html import escape
import json
from math import ceil

from build_data import PART_SLUGS, SITE, TRACKS, bands, load_sections, resources
from build_path import render_diagram
from render import GITHUB, REVIEWED, Page, inline, markdown, render_table, slug, table_rows


SECTIONS = load_sections()
HOURS = tuple(sum(part["hours"][i] for part in bands) for i in (0, 1))
HOUR_RANGE = f"{HOURS[0]}–{HOURS[1]}"
PLAN = ("plan/", "Study plan")
REFERENCE = ("reference/", "Reference")
TRACK_LINKS = tuple((f"tracks/{route}/", name) for name, route, _ in TRACKS.values())
EXTRA_LINKS = (
    ("guide/", "How to use the plan"),
    ("diagram/", "Study diagram"),
    ("workload/", "Time estimates"),
    ("further-study/", "Further study"),
)
TOPICS = (
    ("reference/glossary/", "Key terms", "Short definitions from tokens and embeddings to RAG, RLHF and KV cache."),
    ("reference/training/", "Training methods", "See what data each method uses, what changes and where to use it."),
    ("reference/metrics/", "Metrics and statistics", "Choose a score, run a fair comparison and report uncertainty."),
    ("reference/compute/", "Compute and hardware", "Size models for the hardware you have and measure a small pilot."),
)
# A short starting list for each lesson. The materials page shows the full selection.
FIRST_READINGS = (
    (("pytorch", "Start with tensors, autograd and the quickstart."), ("slp", "Read chapter 2 on words and tokens."),
     ("hfllm", "Use the early inference example to run an existing model.")),
    (("karpathy", "Work through the micrograd and bigram lessons."), ("slp", "Use chapters 3–6 for the topics you need."),
     ("islp", "Review classification and resampling on the same dataset.")),
    (("karpathy", "Try the GPT and BPE tokenizer lessons."), ("slp", "Read chapter 7 on transformers and pretraining."),
     ("retrieval", "Build search before trying reranking.")),
    (("sft", "Inspect chat templates, examples and supervised tokens."), ("peft", "Check your adapter and memory settings."),
     ("agents", "Use Unit 1 to plan your own Python tool loop.")),
    (("rl", "Work an example involving return, policy and advantage."),
     ("dpo", "Check preference-pair formatting and completion log probabilities."),
     ("grpo", "Compare the group advantage in the paper and the trainer guide.")),
    (("evals", "Use task outcomes, repeated trials and grader checks in your project."),
     ("vllm", "Read the serving and measurement sections relevant to your setup.")),
)
LESSON_REFERENCES = (
    (("guide/", "How to use the plan"), ("reference/glossary/#token", "What is a token?")),
    (("reference/metrics/", "Metrics and statistics"),),
    (("reference/training/", "Compare training methods"), ("reference/compute/", "Choose a model size")),
    (("reference/training/", "Compare training methods"), ("projects/", "Plan your document assistant")),
    (("reference/training/", "Compare RLHF, DPO and GRPO"), ("research/#reasoning-and-test-time-computation", "Read about reasoning and test-time computation")),
    (("reference/metrics/", "Choose metrics for your experiment"), ("reference/compute/", "Measure compute and memory")),
)
GLOSSARY = (
    ("Token", "A piece of input text represented by an integer ID. A token can be a word, part of a word, a punctuation mark or a byte-based piece."),
    ("Embedding", "A learned vector representation. Token embeddings turn IDs into model inputs. Sentence embeddings make it possible to compare the meaning of longer pieces of text."),
    ("BPE", "Byte-pair encoding builds a vocabulary by repeatedly merging pairs of symbols that occur frequently."),
    ("Attention", "A calculation that uses queries and keys to decide how much to weight value vectors. A causal mask limits each position to information available so far."),
    ("Pretraining", "Learning model weights on a broad data distribution. A causal language model learns to predict the next token from previous tokens."),
    ("SFT", "Supervised fine-tuning uses examples of desired outputs. The chat template and loss mask determine which tokens supply supervision."),
    ("LoRA", "Low-rank adaptation trains small update matrices while keeping the base weights frozen."),
    ("QLoRA", "Adapter training with a quantised frozen base model. The run still needs memory for activations and the trainable adapter."),
    ("RLHF", "Reinforcement learning from human feedback. A common recipe fits a reward model to human preferences and then uses that reward to improve a policy."),
    ("DPO", "Direct preference optimisation fits a policy on preferred and rejected completions, usually relative to a reference policy."),
    ("PPO", "Proximal policy optimisation is a family of policy-gradient methods. PPO-Clip clips the policy ratio in its training objective to discourage overly large updates."),
    ("GRPO", "Group relative policy optimisation estimates advantages from rewards for a group of completions sampled for the same prompt."),
    ("RLVR", "Reinforcement learning with verifiable rewards uses an automatic checker as the source of reward, such as exact agreement with a numerical answer."),
    ("RAG", "Retrieval-augmented generation puts selected documents or chunks in the model's input so it can use them when answering."),
    ("AI agent", "A system that uses a model to choose actions, calls tools, reads the results and updates state while working toward a goal."),
    ("Context and memory", "Context is the information available to the current model call. External memory stores information that can be added to a future call."),
    ("KL divergence", "A directional measure of difference between probability distributions. A training objective may use it to discourage a policy from drifting from a reference."),
    ("Perplexity", "The exponential of mean token negative log-likelihood in natural logs. Compare it on the same data with compatible tokenisation, masking and context rules."),
    ("Macro-F1", "The arithmetic mean of the per-class F1 scores. Each class contributes equally, including classes with relatively few examples."),
    ("Calibration", "How well a system's predicted probabilities match observed outcomes. For example, cases labelled 80% confident should be correct about 80% of the time."),
    ("Confidence interval", "An interval from a statistical procedure that expresses uncertainty under a specified sampling design and assumptions."),
    ("KV cache", "Attention keys and values saved from earlier tokens in a sequence so decoding can reuse them. Its memory cost grows with the cached sequence."),
    ("Ablation", "A comparison that removes or changes one component to measure what it contributes under controlled conditions."),
    ("Distillation", "Training a student model using outputs, probabilities or trajectories from a teacher model."),
)
RESOURCES_BY_ID = {entry["id"]: entry for entry in resources}


def lesson_path(part):
    return f"study/{part}-{PART_SLUGS[part - 1]}/"


def notes(section):
    return SECTIONS[section][1]


def hour_text(part):
    low, high = part["hours"]
    return f"{low}–{high} hours"


def save_page(page, body, legacy_script=""):
    target = SITE / page.route / "index.html"
    target.parent.mkdir(parents=True, exist_ok=True)
    document = page.render(body, legacy_script)
    target.write_text("\n".join(line.rstrip() for line in document.splitlines()) + "\n", encoding="utf-8")


def link_list(page, entries, classes="text-links"):
    items = "".join(f"<li>{page.link(path, label)}</li>" for path, label in entries)
    return f'<ul class="{classes}">{items}</ul>'


def jump_list(links, name):
    items = "".join(f'<li><a href="#{target}">{escape(label)}</a></li>' for target, label in links)
    return f'<nav class="jump-links" aria-label="{escape(name)}"><ul class="text-links">{items}</ul></nav>'


def part_outline(page):
    rows = []
    for part in bands:
        title = page.link(lesson_path(part["id"]), part["title"])
        rows.append(f'''<li class="outline-row">
          <span class="outline-number" aria-hidden="true">{part["id"]}.</span>
          <div><h3>{title}</h3><p>{escape(part["output"])}</p></div>
          <span class="outline-hours">{hour_text(part)}<span hidden class="status-note" data-completed="{part["id"]}">Complete</span></span>
        </li>''')
    return f'<ol class="course-outline">{"".join(rows)}</ol>'


def legacy_redirect():
    mapping = {
        "/curriculum": PLAN[0], "/path": "diagram/", "/resources": "materials/",
        "/frontier": "research/", "/reference": "reference/", "/guide": "guide/",
        "/projects": "projects/", "/pace": "workload/", "/credits": "about/",
        "/2027": "further-study/",
        **{f"/band/{b['id']}": lesson_path(b["id"]) for b in bands},
    }
    lanes = {name: f"tracks/{track[1]}/" for name, track in TRACKS.items()}
    return f'''
(() => {{
  const pages = {json.dumps(mapping)};
  const tracks = {json.dumps(lanes)};
  function forwardOldLink() {{
    if (!location.hash.startsWith("#/")) return;
    const [path, search = ""] = location.hash.slice(1).split("?", 2);
    if (!Object.hasOwn(pages, path)) return;
    const params = new URLSearchParams(search);
    const track = params.get("lane");
    const destination = path === "/curriculum" && Object.hasOwn(tracks, track) ? tracks[track] : pages[path];
    const url = new URL(destination, location.href);
    if (path === "/resources" && params.has("query")) url.searchParams.set("query", params.get("query"));
    location.replace(url.href);
  }}
  forwardOldLink();
  addEventListener("hashchange", forwardOldLink);
}})();
'''


def home():
    page = Page("", "Learn AI in 2027", "A self-study plan for building language models and agents with Python. Study maths, models and applications in parallel.")
    tracks = "".join(
        f'<div><dt>{page.link(f"tracks/{route}/", name)}</dt><dd>{escape(desc)}</dd></div>'
        for name, route, desc in TRACKS.values()
    )
    body = f'''
    <header class="home-intro">
      <h1>Learn AI in 2027</h1>
      <p class="home-lede">Train a small language model, build a document assistant and learn how to test both.</p>
      <p>For anyone who has used Python and studied engineering maths. The first part helps you get back up to speed.</p>
      <div class="home-actions">
        {page.link(lesson_path(1), "Start part 1", "primary-link")}
        {page.link(PLAN[0], "See the study plan")}
      </div>
      <ul class="course-facts" aria-label="Course at a glance">
        <li>6 parts</li><li>3 tracks in parallel</li><li>{page.link("workload/", HOUR_RANGE + " study hours")}</li>
      </ul>
    </header>
    <div class="home-layout">
      <section aria-labelledby="outline-title">
        <h2 id="outline-title">Course outline</h2>
        {part_outline(page)}
      </section>
      <aside class="home-aside" aria-labelledby="parallel-title">
        <h2 id="parallel-title">Study in parallel</h2>
        <p>Work on all three tracks in each part. For example, practise gradients while you write attention and try document search.</p>
        <dl class="track-list">{tracks}</dl>
        <h2>Planning your study</h2>
        {link_list(page, EXTRA_LINKS, "plain-list")}
      </aside>
    </div>'''
    save_page(page, body, legacy_redirect())


def plan():
    page = Page(PLAN[0], PLAN[1], "Read across each part to see what to study together. Open a part for its readings, exercises and completion checks.")
    rows = []
    for part in bands:
        topics = "".join(f"<div><dt>{escape(track[0])}</dt><dd>{escape(part[key])}</dd></div>"
                         for key, track in TRACKS.items())
        rows.append(f'''<section class="plan-row" id="part-{part["id"]}" aria-labelledby="part-{part["id"]}-title">
          <header class="row-title"><h2 id="part-{part["id"]}-title">{part["id"]}. {page.link(lesson_path(part["id"]), part["title"])}</h2>
            <p>{hour_text(part)}<span hidden class="status-note" data-completed="{part["id"]}">Complete</span></p>
          </header>
          <dl class="parallel-tracks">{topics}</dl>
          <p class="plan-output"><strong>What you’ll make</strong> {escape(part["output"])}</p>
        </section>''')
    body = page.heading() + f'''
    <nav aria-label="Track pages" class="related-links">{link_list(page, TRACK_LINKS)}</nav>
    {''.join(rows)}
    <nav class="page-links" aria-label="More study planning">
      {link_list(page, EXTRA_LINKS)}
    </nav>'''
    save_page(page, body)


def part_navigation(page, current):
    class_rows = []
    for part in bands:
        id = part["id"]
        attrs = {"aria-current": "page"} if id == current else {}
        class_rows.append(f'''<li>
          {page.link(lesson_path(id), part["title"], **attrs)}
          <span hidden class="status-note" data-completed="{id}">Complete</span>
        </li>''')
    return f'<ol class="part-links">{"".join(class_rows)}</ol>'


def lesson_resources(part):
    rows = []
    for id, assignment in FIRST_READINGS[part - 1]:
        entry = RESOURCES_BY_ID[id]
        rows.append(f'<li><a href="{escape(entry["url"])}">{escape(entry["title"])}</a>'
                    f'<span class="reading-assignment">{escape(assignment)}</span></li>')
    return f'<ul class="reading-picks">{"".join(rows)}</ul>'


def lesson(part):
    id = part["id"]
    page = Page(lesson_path(id), part["title"], part["intro"], PLAN[0], (PLAN,))
    outline = part_navigation(page, id)
    sections = jump_list((("readings", "Read first"), ("notes", "Notes and exercises"), ("check", "Check your work")), "In this lesson")
    notes_text = notes(id + 3).split("\n\n", 1)[1]
    if id == len(bands):
        notes_text = notes_text.split("### Choose one final project question", 1)[0]
        project_link = f'<p>{page.link("projects/#final-project", "Choose your final project question")}. Set a primary metric and a budget before the final comparison.</p>'
    else:
        project_link = ""
    checks = "".join(f"<li>{escape(check)}</li>" for check in part["check"])
    previous = page.link(lesson_path(id - 1), f'Part {id - 1}. {bands[id - 2]["title"]}') if id > 1 else page.link(PLAN[0], PLAN[1])
    following = page.link(lesson_path(id + 1), f'Part {id + 1}. {bands[id]["title"]}') if id < len(bands) else page.link("projects/#final-project", "Choose a final project")
    body = f'''
    <div class="lesson-layout">
      <aside class="lesson-sidebar">
        <nav aria-label="Course parts">
          <h2>Course outline</h2>
          {outline}
        </nav>
        <p class="progress-note" data-progress hidden></p>
        {page.link(PLAN[0], "See the parallel plan")}
      </aside>
      <article class="prose lesson">
        {page.heading(f"Part {id} of {len(bands)} · {hour_text(part)}")}
        <details class="mobile-outline">
          <summary>Course outline</summary>
          <nav aria-label="Course parts">{outline}</nav>
        </details>
        {sections}
        <section class="lesson-readings" aria-labelledby="readings">
          <h2 id="readings">Read first</h2>
          {lesson_resources(id)}
          <p>{page.link(f"materials/?part={id}", "All materials for this part")}.</p>
        </section>
        <section aria-labelledby="notes">
          <h2 id="notes">Notes and exercises</h2>
          {markdown(notes_text)}
          {project_link}
          <nav class="page-links" aria-label="Related reading">{link_list(page, LESSON_REFERENCES[id - 1])}</nav>
        </section>
        <section class="lesson-check" aria-labelledby="check">
          <h2 id="check">Check your work</h2>
          <ul>{checks}</ul>
          <button type="button" class="quiet-button" data-mark-part="{id}" aria-pressed="false" hidden>Mark part complete</button>
        </section>
        <nav class="lesson-pager" aria-label="Previous and next lessons">
          <div><span>Previous</span>{previous}</div>
          <div><span>Next</span>{following}</div>
        </nav>
      </article>
    </div>'''
    save_page(page, body)


def track_pages():
    for key, (name, route, description) in TRACKS.items():
        page = Page(f"tracks/{route}/", name, description, PLAN[0], (PLAN,))
        items = "".join(
            f'<li><h2>{page.link(lesson_path(part["id"]), str(part["id"]) + ". " + part["title"])}</h2>'
            f'<p>{escape(part[key])}</p></li>' for part in bands
        )
        links = [("plan/", "See all three tracks"), ("diagram/", "Study diagram"), *TRACK_LINKS]
        save_page(page, page.heading() + f'<div class="prose"><ol class="reading-list track-outline">{items}</ol>'
                  f'<nav aria-label="Other study routes">{link_list(page, [x for x in links if x[0] != page.route])}</nav></div>')


def guide():
    page = Page("guide/", "How to use the plan", "Set up a small experiment first. Use the work to see which parts of Python and maths you need to revise.", PLAN[0], (PLAN,))
    gates = notes(3).split("### What you need to know first", 1)[1]
    body = page.heading() + f'''<article class="prose">
      <h2>What to do first</h2>
      {markdown(notes(16))}
      <p>{page.link(lesson_path(1), "Open the self-check in part 1", "primary-link")}</p>
      <h2>Study three tracks together</h2>
      {markdown(notes(1))}
      <h2>What you need to know first</h2>
      {markdown(gates)}
      <p>{page.link(PLAN[0], "See the six parts")} · {page.link("workload/", "Estimate your study time")}</p>
    </article>'''
    save_page(page, body)


def diagram():
    page = Page("diagram/", "Study diagram", "Follow a column to trace one track. Read across to see how the work fits together.", PLAN[0], (PLAN,))
    rows = [["Part", *(info[0] for info in TRACKS.values())]]
    for part in bands:
        rows.append([page.link(lesson_path(part["id"]), f'{part["id"]}. {part["title"]}'),
                     *(escape(part[key]) for key in TRACKS)])
    body = page.heading() + f'''<figure class="study-diagram">
      {render_table(rows, "Six parts across the three study tracks", "diagram-table")}
      <figcaption>Read research and evaluate your work throughout the course.</figcaption>
    </figure>
    <nav class="page-links" aria-label="Diagram links">
      {page.link("assets/parallel-learning-path.svg", "Download diagram (SVG)", download="AI_Parallel_Study_Diagram.svg")}
      {page.link(PLAN[0], "Open the full study plan")}
    </nav>'''
    save_page(page, body)
    (SITE / "assets" / "parallel-learning-path.svg").write_text(render_diagram(), encoding="utf-8")


def materials():
    page = Page("materials/", "Learning materials", "Find a course, paper or guide for the part you’re studying. Each entry includes a reading assignment and an exercise.")
    filters = "".join(f'<option value="{key}">{escape(info[0])}</option>' for key, info in TRACKS.items())
    rows = []
    for entry in resources:
        refs = " · ".join(page.link(lesson_path(id), f"Part {id}") for id in entry["bands"])
        ids = " ".join(map(str, entry["bands"]))
        key = entry["id"]
        rows.append(f'''<li data-result data-track="{entry["lane"]}" data-parts="{ids}" data-resource="{key}" id="{key}">
          <div class="material-title"><h2><a href="{escape(entry["url"])}">{escape(entry["title"])}</a></h2>
            <button type="button" data-save="{key}" aria-label="Save {escape(entry["title"])}" aria-pressed="false" class="quiet-button" hidden>Save</button>
          </div>
          <p class="source-meta">{escape(entry["author"])} · {escape(entry["kind"])} · {refs}</p>
          <p>{escape(entry["assignment"])}</p>
          <p><strong>Try it.</strong> {escape(entry["finish"])}</p>
        </li>''')
    body = page.heading() + f'''
    <div class="reading-wide" data-filter-list data-item-label="materials">
      <div class="filter-controls" data-filter-controls hidden>
        <label class="search-field">Search materials<input type="search" data-search placeholder="Try tokenisation or RLHF"></label>
        <label>Track<select data-track-filter><option value="">All tracks</option>{filters}</select></label>
        <label>Part<select data-part-filter><option value="">All parts</option>
          {"".join(f'<option value="{part["id"]}">Part {part["id"]}</option>' for part in bands)}
        </select></label>
        <label class="checkbox-label"><input type="checkbox" data-saved-only> Saved only</label>
      </div>
      <p data-results-count class="source-meta" role="status" hidden></p>
      <p data-no-results hidden>Nothing matches. Try another search or change the filters.</p>
      <ul class="reading-list">{''.join(rows)}</ul>
      <p class="page-links">{page.link("reference/", "Browse the reference pages")} · {page.link("research/", "Read recent research")}</p>
    </div>'''
    save_page(page, body)


def projects():
    page = Page("projects/", "Projects", "Keep three small projects going as you learn. Use one of them for your final comparison.")
    body = page.heading() + f'''<article class="prose">
      <h2>What to build</h2>
      {markdown(notes(13))}
      <h2 id="final-project">The final project</h2>
      {markdown(notes(9).split("### Choose one final project question", 1)[1])}
      <p>{page.link("reference/metrics/", "Pick metrics and set up the comparison")} · {page.link(lesson_path(6), "Read the final lesson")}</p>
    </article>'''
    save_page(page, body)


def research():
    page = Page("research/", "Research papers", "Pick a paper that helps with a question in your project. Look at how the authors tested their claim.")
    intro, rest = notes(12).split("### Papers and reports to choose from", 1)
    table_lines = [s for s in rest.splitlines() if s.startswith("|")]
    papers = []
    for topic, sources, question in table_rows(table_lines)[1:]:
        papers.append(f'<li id="{slug(topic)}"><h3>{escape(topic)}</h3><p>{inline(sources)}</p><p>{escape(question)}</p></li>')
    _, extras = rest.split("### Images and other model designs", 1)
    body = page.heading() + f'''<article class="prose">
      <p class="source-meta">Reading list reviewed <time datetime="2026-11-19">{REVIEWED}</time></p>
      {markdown(intro.split("\n\n", 1)[1])}
      <h2>Papers and reports to choose from</h2>
      <ul class="reading-list">{''.join(papers)}</ul>
      {markdown("### Images and other model designs" + extras)}
      <p>{page.link("projects/#final-project", "Use a paper in your final project")}</p>
    </article>'''
    save_page(page, body)


def reference_links(page):
    return link_list(page, [(url, title) for url, title, _ in TOPICS if url != page.route])


def reference_pages():
    index = Page(REFERENCE[0], REFERENCE[1], "Look up a definition, compare training methods or choose a metric for your experiment.")
    entries = "".join(f'<li><h2>{index.link(route, title)}</h2><p>{escape(desc)}</p></li>' for route, title, desc in TOPICS)
    save_page(index, index.heading() + f'<ul class="reading-list prose reference-list">{entries}</ul>')
    sections = (None, 10, 11, 14)
    for (route, title, desc), section in zip(TOPICS, sections):
        page = Page(route, title, desc, REFERENCE[0], (REFERENCE,))
        if section is None:
            terms = "".join(f'<div data-result id="{slug(term)}"><dt>{escape(term)}</dt><dd>{escape(definition)}</dd></div>'
                            for term, definition in GLOSSARY)
            body = f'''<div data-filter-list data-item-label="terms">
              <div class="filter-controls" data-filter-controls hidden>
                <label class="search-field">Search key terms<input type="search" data-search placeholder="Try attention or perplexity"></label>
              </div>
              <p data-results-count class="source-meta" role="status" hidden></p>
              <p data-no-results hidden>No terms match. Try a different word.</p>
              <dl class="glossary">{terms}</dl>
            </div>'''
        else:
            body = markdown(notes(section))
        save_page(page, page.heading() + f'<article class="prose">{body}'
                  f'<nav class="page-links" aria-label="Other reference pages">{reference_links(page)}</nav></article>')


def workload():
    page = Page("workload/", "Time estimates", "Allow time for reading, coding, debugging and testing. Use these estimates to choose a pace you can keep up.", PLAN[0], (PLAN,))
    active = f"{ceil(HOURS[0]/15)}–{ceil(HOURS[1]/15)} study weeks"
    calendar = f"{ceil(HOURS[0]*1.2/15)}–{ceil(HOURS[1]*1.2/15)} weeks including breaks"
    body = page.heading() + f'''<article class="prose">
      <section class="pace-tool" data-pace data-hours-low="{HOURS[0]}" data-hours-high="{HOURS[1]}" aria-labelledby="your-pace">
        <h2 id="your-pace">Plan your study time</h2>
        <label class="pace-input" hidden>Study hours per week
          <input type="number" min="1" max="80" step="1" value="15" inputmode="numeric" data-weekly-hours>
        </label>
        <p aria-live="polite"><strong data-active-weeks>{active}</strong><br><span data-calendar-weeks>{calendar}</span></p>
        <p class="source-meta">Based on {HOUR_RANGE} active hours. The calendar estimate allows 20% extra time for breaks.</p>
      </section>
      <h2>Hours by part</h2>
      {markdown(notes(15).split("\n\n", 1)[1])}
      <p>{page.link("guide/", "Read the study guide")} · {page.link("further-study/", "Plan further study")}</p>
    </article>'''
    save_page(page, body)


def further_study():
    page = Page("further-study/", "Further study", "Choose one subject and work through a problem where you can measure how much you’ve learned.", PLAN[0], (PLAN,))
    save_page(page, page.heading() + f'<article class="prose">{markdown(notes(17))}'
              f'<p>{page.link("research/", "Find a paper for your project")} · {page.link("workload/", "See time estimates")}</p></article>')


def about():
    page = Page("about/", "About this course", "An independent study plan for learning language models and agents in 2027.")
    save_page(page, page.heading() + f'''<article class="prose">
      <h2>Course notes and sources</h2>
      <p>The readings are drawn from university courses, original research and project documentation. The exercises and study estimates were prepared for this course. Last reviewed {REVIEWED}.</p>
      <p>{page.link("assets/study-plan.md", "Download the complete study plan", download="AI_Study_Plan_2027.md")} or <a href="{GITHUB}">browse the source on GitHub</a>.</p>
      <h2>Saved readings and progress</h2>
      <p>Saved readings and completion marks are kept in this browser.</p>
      <button class="quiet-button" type="button" data-reset-progress hidden>Reset saved readings and progress</button>
    </article>''')


if __name__ == "__main__":
    assert set(SECTIONS) == set(range(1, 18)), "Expected all 17 sections of the curriculum."
    assert len(PART_SLUGS) == len(FIRST_READINGS) == len(LESSON_REFERENCES) == len(bands)
    assert HOUR_RANGE in notes(15), "The workload table must use the sum of the six part estimates."
    home()
    plan()
    for part in bands:
        lesson(part)
    track_pages()
    guide()
    diagram()
    materials()
    projects()
    research()
    reference_pages()
    workload()
    further_study()
    about()
    print(f"Built {len(list(SITE.rglob('index.html')))} pages and the study diagram.")
