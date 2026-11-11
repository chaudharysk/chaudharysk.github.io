from pathlib import Path
from html import escape
import json

ROOT = Path(__file__).resolve().parent
bands = [
    ("Recover & orient", [
        ["Python, arrays", "Maths refresher"],
        ["Tokens, messages", "Run an existing model"],
        ["Documents, simple search", "First model call"]]),
    ("Represent & predict", [
        ["Probability, gradients", "Linear / neural baselines"],
        ["N-grams, TF-IDF", "Embeddings"],
        ["Lexical retrieval", "Relevance labels"]]),
    ("Understand transformers", [
        ["Chain rule, optimisation", "Numerical stability"],
        ["BPE, causal attention", "Train a tiny decoder"],
        ["Dense retrieval, RAG", "Citations and evidence"]]),
    ("Adapt & use tools", [
        ["KL, regularisation", "Statistical uncertainty"],
        ["Data quality, SFT", "LoRA adaptation"],
        ["Tool loop, validation", "State and recovery"]]),
    ("Learn from feedback", [
        ["MDPs, policy gradients", "Preference likelihood"],
        ["Reward model, DPO", "PPO / GRPO examples"],
        ["Workflow vs. agent", "Memory and reliability"]]),
    ("Integrate & investigate", [
        ["Paired comparisons", "Calibration, ablations"],
        ["Inference trade-offs", "One frontier question"],
        ["Profiling, small service", "Capstone integration"]])
]

W, H = 960, 1190
parts = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}" role="group" aria-labelledby="path-title path-description" class="learning-path-svg">',
    '<title id="path-title">AI learning path: starting in 2027 and building toward expertise</title>',
    '<desc id="path-description">Three lanes run alongside each other: foundations, language models, and applications. Six aligned learning bands run from recovering Python and maths to an evaluated capstone. Read across a row for parallel study and down a column for progression. Evaluation and research accompany every band. Rows are competency groups rather than fixed weeks. Each learning box opens the relevant band.</desc>',
    '<defs><marker id="path-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M1 1 L6 4 L1 7" fill="none" stroke="#9a9a9a" stroke-width="1.2"/></marker></defs>',
    '<style>text{font-family:Arial,Helvetica,sans-serif;font-style:normal;fill:#292929}a{cursor:pointer}a:hover rect,a:focus rect{stroke:#1766a6;stroke-width:2}a:focus{outline:none}.topic{font-size:14px}.small{font-size:12px;fill:#666}.header{font-size:16px;font-weight:600}.band-label{font-size:13px;font-weight:600}.connector{stroke:#aaa;stroke-width:1.2;fill:none;marker-end:url(#path-arrow)}</style>',
    f'<rect width="{W}" height="{H}" fill="white"/>',
    '<text x="20" y="27" font-size="20" font-weight="600">Starting AI in 2027: learn these lanes together</text>',
    '<text x="20" y="51" class="small">Read across: parallel study. Read down: build on what you understand.</text>',
    '<rect x="190" y="72" width="740" height="43" fill="#f5f5f5" stroke="#ddd"/>',
    '<text x="560" y="98" text-anchor="middle" font-size="13">Every band: evaluation, failure analysis and research reading</text>']

xs = [190, 445, 700]
box_w = 230
lane_titles = ["Foundations", "Language models", "Applications"]
lane_subtitles = ["Maths, code and statistics", "Mechanisms and training", "Retrieval, agents and systems"]
for x, title, subtitle in zip(xs, lane_titles, lane_subtitles):
    parts += [
        f'<text x="{x+box_w/2}" y="145" class="header" text-anchor="middle">{title}</text>',
        f'<text x="{x+box_w/2}" y="165" class="small" text-anchor="middle">{subtitle}</text>',
        f'<line x1="{x}" y1="181" x2="{x+box_w}" y2="181" stroke="#999"/>']

for i, (title, lanes) in enumerate(bands, 1):
    y = 201 + (i-1)*110
    parts.append(f'<a href="./#/band/{i}" target="_top" aria-label="Open band {i}: {escape(title)}">')
    parts.append(f'<text x="20" y="{y+21}" class="small">BAND {i:02d}</text>')
    title_lines = {
        1:["Recover & orient"], 2:["Represent & predict"],
        3:["Understand","transformers"], 4:["Adapt & use tools"],
        5:["Learn from feedback"], 6:["Integrate &","investigate"]}[i]
    for j,line in enumerate(title_lines):
        parts.append(f'<text x="20" y="{y+43+j*18}" class="band-label">{escape(line)}</text>')
    parts.append('</a>')
    for x, lines in zip(xs,lanes):
        parts.append(f'<a href="./#/band/{i}" target="_top" aria-label="Open band {i}: {escape(title)}">')
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
    '<text x="560" y="887" text-anchor="middle" class="header">One evaluated capstone</text>',
    '<text x="560" y="910" text-anchor="middle" font-size="13">Working system + controlled comparison + reproducible report</text>',
    '<path d="M560 929 V951" class="connector"/>',
    '<a href="./#/2027" target="_top" aria-label="Explore specialisation and expertise beyond the core">',
    '<rect x="190" y="958" width="740" height="58" fill="white" stroke="#aaa"/>',
    '<text x="560" y="982" text-anchor="middle" class="header">Choose one specialisation · 200–400 further hours</text>',
    '<text x="560" y="1003" text-anchor="middle" font-size="13">Model training · AI systems and agents · Statistical machine learning</text>',
    '</a>',
    '<path d="M560 1018 V1040" class="connector"/>',
    '<rect x="190" y="1047" width="740" height="58" fill="#f5f5f5" stroke="#aaa"/>',
    '<text x="560" y="1071" text-anchor="middle" class="header">Develop independent expertise through repeated work</text>',
    '<text x="560" y="1092" text-anchor="middle" font-size="13">Replicate a result → evaluate → improve → explain → seek review</text>',
    '<text x="20" y="1142" class="small">Core: 540–760 active hours. Lanes can move at different speeds. Progress by demonstrated understanding.</text>',
    '<text x="20" y="1164" class="small">Specialisation hours are planning estimates. Expertise grows through sustained practice beyond a course.</text>',
    '</svg>']
svg = '\n'.join(parts)
(ROOT/'dist/assets/parallel-learning-path.svg').write_text(svg.replace('href="./#/', 'href="../#/'))
(ROOT/'dist/assets/learning-path.js').write_text('window.LEARNING_PATH_SVG = '+json.dumps(svg)+';\n')
print("Built parallel-learning-path.svg and the embedded diagram.")
