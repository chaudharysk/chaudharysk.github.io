"""Small HTML renderer for the curriculum's Markdown and shared layout."""

from html import escape
import re

TITLE = "Learn AI in 2027"
LIVE = "https://chaudharysk.github.io/ai-2027/"
GITHUB = "https://github.com/chaudharysk/chaudharysk.github.io/tree/main/ai-2027"
REVIEWED = "19 November 2026"
NAV = (
    ("plan/", "Study plan"),
    ("projects/", "Projects"),
    ("materials/", "Materials"),
    ("research/", "Research"),
    ("reference/", "Reference"),
)

INLINE = re.compile(r"\[([^\]]+)\]\((https://[^\s)]+)\)|\*\*([^*]+)\*\*|" + chr(96) + "([^" + chr(96) + "]+)" + chr(96))
LIST_ITEM = re.compile(r"^(-|\d+\.) (.+)$")


def slug(text):
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")


def inline(text):
    pieces = []
    end = 0
    for match in INLINE.finditer(text):
        pieces.append(escape(text[end:match.start()]))
        label, url, strong, code = match.groups()
        if url:
            pieces.append(f'<a href="{escape(url)}">{escape(label)}</a>')
        elif strong:
            pieces.append(f'<strong>{escape(strong)}</strong>')
        else:
            pieces.append(f'<code>{escape(code)}</code>')
        end = match.end()
    pieces.append(escape(text[end:]))
    return "".join(pieces)


def table_rows(lines):
    rows = []
    for line in lines:
        cells = [cell.strip() for cell in line.strip().strip("|").split("|")]
        if not all(re.fullmatch(r":?-+:?", cell) for cell in cells):
            rows.append(cells)
    return rows


def render_table(rows, label, extra_class=""):
    headers, *body = rows
    assert all(len(row) == len(headers) for row in body), label
    head = "".join(f'<th scope="col" role="columnheader">{cell}</th>' for cell in headers)
    records = []
    for row in body:
        heading, *cells = row
        fields = [f'<th scope="row" role="rowheader">{heading}</th>']
        for header, cell in zip(headers[1:], cells):
            hidden_label = f'<span class="cell-label" aria-hidden="true">{header}</span>'
            fields.append(f'<td role="cell">{hidden_label}{cell}</td>')
        records.append(f'<tr role="row">{"".join(fields)}</tr>')
    css = ("reading-table " + extra_class).strip()
    return (f'<table class="{css}" role="table"><caption class="sr-only">{escape(label)}</caption>'
            f'<thead role="rowgroup"><tr role="row">{head}</tr></thead>'
            f'<tbody role="rowgroup">{"".join(records)}</tbody></table>')


def markdown(text):
    lines = text.splitlines()
    blocks = []
    title = "Comparison"
    seen_headings = {}
    cursor = 0
    while cursor < len(lines):
        line = lines[cursor].strip()
        if not line:
            cursor += 1
            continue
        heading = re.fullmatch(r"(#{1,6}) (.+)", line)
        if heading:
            title = heading[2]
            level = min(4, max(2, len(heading[1]) - 1))
            base = slug(title)
            seen_headings[base] = seen_headings.get(base, 0) + 1
            anchor = base if seen_headings[base] == 1 else f"{base}-{seen_headings[base]}"
            blocks.append(f'<h{level} id="{anchor}">{inline(title)}</h{level}>')
            cursor += 1
            continue
        if line.startswith("|"):
            start = cursor
            while cursor < len(lines) and lines[cursor].strip().startswith("|"):
                cursor += 1
            rows = [[inline(cell) for cell in row] for row in table_rows(lines[start:cursor])]
            blocks.append(render_table(rows, title))
            continue
        if LIST_ITEM.match(line):
            ordered = line[0].isdigit()
            tag = "ol" if ordered else "ul"
            items = []
            while cursor < len(lines):
                item = LIST_ITEM.match(lines[cursor].strip())
                if not item or item[1][0].isdigit() != ordered:
                    break
                items.append(f'<li>{inline(item[2])}</li>')
                cursor += 1
            blocks.append(f'<{tag}>{"".join(items)}</{tag}>')
            continue
        start = cursor
        cursor += 1
        while cursor < len(lines):
            subsequent = lines[cursor].strip()
            if not subsequent or subsequent.startswith(("#", "|")) or LIST_ITEM.match(subsequent):
                break
            cursor += 1
        blocks.append(f'<p>{inline(" ".join(row.strip() for row in lines[start:cursor]))}</p>')
    return "\n".join(blocks)


class Page:
    def __init__(self, route, title, description, section=None, parents=()):
        self.route = route
        self.title = title
        self.description = description
        self.section = section or route
        self.parents = parents
        self.prefix = "../" * route.count("/")

    def url(self, route):
        if route:
            return self.prefix + route
        return self.prefix or "./"

    def link(self, route, title, classes=None, **attributes):
        extra = f' class="{escape(classes)}"' if classes else ""
        extra += "".join(f' {name}="{escape(value)}"' for name, value in attributes.items())
        return f'<a href="{escape(self.url(route))}"{extra}>{escape(title)}</a>'

    def heading(self, meta=None):
        meta_html = f'<p class="lesson-meta">{escape(meta)}</p>' if meta else ""
        return (f'<header class="page-heading">{meta_html}<h1>{escape(self.title)}</h1>'
                f'<p class="lede">{escape(self.description)}</p></header>')

    def render(self, content, legacy_script=""):
        nav_links = []
        for href, name in NAV:
            attrs = {"aria-current": "page"} if self.route == href else {}
            nav_links.append(self.link(href, name, "nav-active" if self.section == href else None, **attrs))
        breadcrumbs = ""
        if self.route:
            trail = [("", "Home"), *self.parents]
            items = "".join(f'<li>{self.link(route, title)}</li>' for route, title in trail)
            breadcrumbs = (f'<nav class="breadcrumbs" aria-label="Breadcrumb"><ol>{items}'
                           f'<li aria-current="page">{escape(self.title)}</li></ol></nav>')
        page_title = f"{self.title} | {TITLE}" if self.route else TITLE
        legacy_tag = f"  <script>{legacy_script}</script>\n" if legacy_script else ""
        footer_links = " ".join((
            self.link("assets/study-plan.md", "Download study plan", download="AI_Study_Plan_2027.md"),
            self.link("about/", "About"),
            f'<a href="{GITHUB}">GitHub source</a>',
        ))
        brand = self.link("", TITLE, "site-name", **({"aria-current": "page"} if not self.route else {}))
        return f'''<!doctype html>
<!-- Built from the course notes and source/rebuild.py. -->
<html lang="en-AU">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="{escape(self.description)}">
  <meta name="theme-color" content="#ffffff">
  <title>{escape(page_title)}</title>
  <link rel="canonical" href="{LIVE}{self.route}">
  <link rel="icon" href="{self.url("assets/favicon.svg")}" type="image/svg+xml">
  <link rel="stylesheet" href="{self.url("assets/style.css")}">
{legacy_tag}  <script defer src="{self.url("assets/app.js")}"></script>
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>
  <header class="site-header">
    <div class="site-shell masthead">
      {brand}
      <nav class="primary-nav" aria-label="Main navigation">{" ".join(nav_links)}</nav>
    </div>
  </header>
  <main class="site-shell main-content" id="main" tabindex="-1">
    {breadcrumbs}
    {content}
  </main>
  <footer class="site-shell site-footer">
    <p>Published by <a href="{self.prefix}../">Shashikant Chaudhary</a></p>
    <nav aria-label="Footer navigation">{footer_links}</nav>
  </footer>
  <p class="sr-only" id="announcement" role="status"></p>
</body>
</html>
'''
