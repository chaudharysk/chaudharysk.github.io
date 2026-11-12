from pathlib import Path
from html import escape
import json

ROOT = Path(__file__).resolve().parent
bands = [
    ("Python and maths refresher", [
        ["Python, arrays", "Maths refresher"],
        ["Tokens, messages", "Run an existing model"],
        ["Documents, simple search", "First model call"]]),
    ("Machine learning and NLP basics", [
        ["Probability, gradients", "Linear / neural baselines"],
        ["N-grams, TF-IDF", "Embeddings"],
        ["Lexical retrieval", "Relevance labels"]]),
    ("Build a language model", [
        ["Chain rule, optimisation", "Numerical stability"],
        ["BPE, causal attention", "Train a tiny decoder"],
        ["Dense retrieval, RAG", "Citations and missing sources"]]),
    ("Fine-tuning and agents", [
        ["KL, regularisation", "Statistical uncertainty"],
        ["Data quality, SFT", "LoRA fine-tuning"],
        ["Tool loop, validation", "State and error handling"]]),
    ("RLHF and reinforcement learning", [
        ["MDPs, policy gradients", "Preference likelihood"],
        ["Reward model, DPO", "PPO / GRPO examples"],
        ["Workflow vs. agent", "Memory and reliability"]]),
    ("Evaluation and a final project", [
        ["Paired comparisons", "Calibration, ablations"],
        ["Inference trade-offs", "One research question"],
        ["Profiling, small service", "Final project"]])
]

W, H = 960, 1190
parts = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}" role="group" aria-labelledby="path-title path-description" class="learning-path-svg">',
    '<title id="path-title">AI study plan for 2027</title>',
    '<desc id="path-description">Three tracks run together: maths and code, language models, and applications. Six parts cover a Python and maths refresher through to a final project. Read across for topics to study together and down for what comes next. Test your work and read papers throughout. Click a box to open that part.</desc>',
    '<defs><marker id="path-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M1 1 L6 4 L1 7" fill="none" stroke="#9a9a9a" stroke-width="1.2"/></marker></defs>',
    '<style>text{font-family:Arial,Helvetica,sans-serif;font-style:normal;fill:#292929}a{cursor:pointer}a:hover rect,a:focus rect{stroke:#1766a6;stroke-width:2}a:focus{outline:none}.topic{font-size:14px}.small{font-size:12px;fill:#666}.header{font-size:16px;font-weight:600}.band-label{font-size:13px;font-weight:600}.connector{stroke:#aaa;stroke-width:1.2;fill:none;marker-end:url(#path-arrow)}</style>',
    f'<rect width="{W}" height="{H}" fill="white"/>',
    '<text x="20" y="27" font-size="20" font-weight="600">AI study plan: three tracks to study together</text>',
    '<text x="20" y="51" class="small">Read across for what to study together. Read down for what comes next.</text>',
    '<rect x="190" y="72" width="740" height="43" fill="#f5f5f5" stroke="#ddd"/>',
    '<text x="560" y="98" text-anchor="middle" font-size="13">Throughout: test the results, inspect errors and read papers</text>']

xs = [190, 445, 700]
box_w = 230
lane_titles = ["Maths and code", "Language models", "Applications"]
lane_subtitles = ["Maths, code and statistics", "Tokens and model training", "Retrieval, agents and systems"]
for x, title, subtitle in zip(xs, lane_titles, lane_subtitles):
    parts += [
        f'<text x="{x+box_w/2}" y="145" class="header" text-anchor="middle">{title}</text>',
        f'<text x="{x+box_w/2}" y="165" class="small" text-anchor="middle">{subtitle}</text>',
        f'<line x1="{x}" y1="181" x2="{x+box_w}" y2="181" stroke="#999"/>']

for i, (title, lanes) in enumerate(bands, 1):
    y = 201 + (i-1)*110
    parts.append(f'<a href="./#/band/{i}" target="_top" aria-label="Open part {i}: {escape(title)}">')
    parts.append(f'<text x="20" y="{y+21}" class="small">PART {i:02d}</text>')
    title_lines = {
        1:["Python and maths", "refresher"],
        2:["Machine learning", "and NLP basics"],
        3:["Build a", "language model"],
        4:["Fine-tuning", "and agents"],
        5:["RLHF and", "reinforcement learning"],
        6:["Evaluation and", "a final project"]}[i]
    for j,line in enumerate(title_lines):
        parts.append(f'<text x="20" y="{y+43+j*18}" class="band-label">{escape(line)}</text>')
    parts.append('</a>')
    for x, lines in zip(xs,lanes):
        parts.append(f'<a href="./#/band/{i}" target="_top" aria-label="Open part {i}: {escape(title)}">')
        parts.append(f'<rect x="{x}" y="{y}" width="{box_w}" height="76" rx="0" fill="white" stroke="#bbb"/>')
        for j,line in enumerate(lines):
            parts.append(f'<text x="{x+14}" y="{y+30+j*22}" class="topic">{escape(line)}</text>')
        parts.append('</a>')
        if i<6:
            parts.append(f'<path d="M{x+box_w/2} {y+78} V{y+102}" class="connector"/>')

end_y = 201+5*110+76
for x in xs:
    cx=x+box_w/2
    parts.append(f'<path d="M{cx} {end_y+2} V{end_y+26}" class="connector"/>')
parts += [
    '<rect x="190" y="861" width="740" height="66" fill="#f5f5f5" stroke="#aaa"/>',
    '<text x="560" y="887" text-anchor="middle" class="header">Finish and test one project</text>',
    '<text x="560" y="910" text-anchor="middle" font-size="13">Code someone else can run, results and an explanation of the errors</text>',
    '<path d="M560 929 V951" class="connector"/>',
    '<a href="./#/2027" target="_top" aria-label="See what to study after this course">',
    '<rect x="190" y="958" width="740" height="58" fill="white" stroke="#aaa"/>',
    '<text x="560" y="982" text-anchor="middle" class="header">Study one subject in more detail · 200–400 more hours</text>',
    '<text x="560" y="1003" text-anchor="middle" font-size="13">Model training · AI systems and agents · Statistical machine learning</text>',
    '</a>',
    '<path d="M560 1018 V1040" class="connector"/>',
    '<rect x="190" y="1047" width="740" height="58" fill="#f5f5f5" stroke="#aaa"/>',
    '<text x="560" y="1071" text-anchor="middle" class="header">Keep working on new problems</text>',
    '<text x="560" y="1092" text-anchor="middle" font-size="13">Reproduce a result, try a change, test it and ask for review</text>',
    '<text x="20" y="1142" class="small">Main course: 540–760 hours. Spend more time on a topic when you need to.</text>',
    '<text x="20" y="1164" class="small">The hours are estimates. Getting good at this takes more practice after the course.</text>',
    '</svg>']
svg = '\n'.join(parts)
(ROOT/'dist/assets/parallel-learning-path.svg').write_text(svg.replace('href="./#/', 'href="../#/'))
(ROOT/'dist/assets/learning-path.js').write_text('window.LEARNING_PATH_SVG = '+json.dumps(svg)+';\n')
print("Built parallel-learning-path.svg and the embedded diagram.")
