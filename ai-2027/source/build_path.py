"""Write a downloadable version of the course map."""

from html import escape
from textwrap import wrap

from build_data import PART_SLUGS, TRACKS, bands


def text_lines(text, x, y, width, style):
    return "\n".join(
        f'<text x="{x}" y="{y + i * 22}" class="{style}">{escape(line)}</text>'
        for i, line in enumerate(wrap(text, width, break_long_words=False))
    )


def render_diagram():
    width, height = 1130, 880
    cols = (38, 279, 550, 820)
    rows = [
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" width="{width}" height="{height}" role="group" aria-labelledby="diagram-title diagram-desc">',
        '<title id="diagram-title">Learn AI in 2027: three tracks in parallel</title>',
        '<desc id="diagram-desc">Six parts show maths and code, language models and applications side by side. Select a part name for the lesson.</desc>',
        '<style>text{font-family:system-ui,Arial,sans-serif;fill:#22272b;font-size:16px}'
        '.title{font-size:38px;font-weight:700}.header,.part{font-weight:650}.part{fill:#174b8c}'
        '.caption{fill:#535e68}.rule{stroke:#dbe0e5}.part-link:hover .part,.part-link:focus .part{text-decoration:underline}</style>',
        f'<path fill="#fff" d="M0 0h{width}v{height}H0z"/>',
        '<text x="38" y="66" class="title">Learn AI in 2027</text>',
        '<text x="38" y="101" class="caption">Read across each part to see what to study together.</text>',
        '<path d="M38 130h1054" class="rule"/>',
        '<text x="38" y="158" class="header">Part</text>',
    ]
    for track, x in zip(TRACKS.values(), cols[1:]):
        rows.append(f'<text x="{x}" y="158" class="header">{escape(track[0])}</text>')
    for i, band in enumerate(bands):
        y = 176 + i * 107
        path = f"../study/{band['id']}-{PART_SLUGS[i]}/"
        rows.append(f'<path d="M38 {y}h1054" class="rule"/>')
        rows.append(f'<a href="{path}" class="part-link" aria-label="{escape(band["title"])}">')
        rows.append(text_lines(f"{band['id']}. {band['title']}", cols[0], y + 30, 23, "part"))
        rows.append('</a>')
        for key, x in zip(TRACKS, cols[1:]):
            rows.append(text_lines(band[key], x, y + 30, 27, "topic"))
    y = 176 + len(bands) * 107
    rows += [
        f'<path d="M38 {y}h1054" class="rule"/>',
        f'<text x="38" y="{y+35}" class="caption">Read research and evaluate your work throughout the course.</text>',
        '</svg>',
    ]
    return "\n".join(rows) + "\n"
