"use strict";

const completionKey = "fieldguide-completed";
const readingKey = "fieldguide-saved";

function readValues(key) {
  try {
    const values = JSON.parse(localStorage.getItem(key));
    return new Set(Array.isArray(values) ? values : []);
  } catch {
    return new Set();
  }
}

let completed = readValues(completionKey);
let saved = readValues(readingKey);

function announce(message) {
  document.querySelector("#announcement").textContent = message;
}

function record(key, values) {
  try {
    localStorage.setItem(key, JSON.stringify([...values]));
  } catch {
    announce("Browser storage is unavailable. This change applies to the current page.");
  }
}

const completionButtons = [...document.querySelectorAll("[data-mark-part]")];
const completionNotes = [...document.querySelectorAll("[data-completed]")];
const progressNotes = [...document.querySelectorAll("[data-progress]")];
const saveButtons = [...document.querySelectorAll("[data-save]")];

function refreshProgress() {
  for (const button of completionButtons) {
    const isComplete = completed.has(Number(button.dataset.markPart));
    button.setAttribute("aria-pressed", String(isComplete));
    button.textContent = isComplete ? "Part complete · Undo" : "Mark part complete";
  }
  for (const note of completionNotes) {
    note.hidden = !completed.has(Number(note.dataset.completed));
  }
  for (const note of progressNotes) {
    const count = new Set(completionNotes.map(note => Number(note.dataset.completed))).size;
    const checked = [...completed].filter(value => Number.isInteger(value) && value >= 1 && value <= count).length;
    note.textContent = checked + " of " + count + " parts complete";
    note.hidden = false;
  }
}

function refreshSaved() {
  for (const button of saveButtons) {
    const isSaved = saved.has(button.dataset.save);
    button.setAttribute("aria-pressed", String(isSaved));
    button.textContent = isSaved ? "Saved" : "Save";
  }
}

function searchable(text) {
  return text.toLowerCase()
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/tokeniz/g, "tokenis")
    .replace(/[^\p{Letter}\p{Number}]+/gu, " ")
    .trim();
}

function enableFiltering(container) {
  const input = container.querySelector("[data-search]");
  const track = container.querySelector("[data-track-filter]");
  const part = container.querySelector("[data-part-filter]");
  const savedOnly = container.querySelector("[data-saved-only]");
  const controls = container.querySelector("[data-filter-controls]");
  const count = container.querySelector("[data-results-count]");
  const noResults = container.querySelector("[data-no-results]");
  const entries = [...container.querySelectorAll("[data-result]")].map(element => ({
    element,
    text: searchable(element.textContent),
    track: element.dataset.track,
    parts: (element.dataset.parts || "").split(" "),
    resource: element.dataset.resource
  }));

  const params = new URLSearchParams(location.search);
  input.value = params.get("query") || "";
  if (track && [...track.options].some(option => option.value === params.get("track"))) {
    track.value = params.get("track");
  }
  if (part && [...part.options].some(option => option.value === params.get("part"))) {
    part.value = params.get("part");
  }

  function refresh() {
    const words = searchable(input.value).split(" ").filter(Boolean);
    let shown = 0;
    for (const entry of entries) {
      const matchesTrack = !track?.value || entry.track === track.value;
      const matchesPart = !part?.value || entry.parts.includes(part.value);
      const matchesSaved = !savedOnly?.checked || saved.has(entry.resource);
      const matchesText = words.every(word => entry.text.includes(word));
      const visible = matchesTrack && matchesPart && matchesSaved && matchesText;
      entry.element.hidden = !visible;
      if (visible) shown += 1;
    }
    count.textContent = shown + " of " + entries.length + " " + container.dataset.itemLabel;
    noResults.hidden = shown !== 0;
  }

  input.addEventListener("input", refresh);
  for (const control of [track, part, savedOnly]) {
    if (control) control.addEventListener("change", refresh);
  }
  controls.hidden = false;
  count.hidden = false;
  refresh();
  return refresh;
}

const refreshFilters = [...document.querySelectorAll("[data-filter-list]")].map(enableFiltering);

for (const button of completionButtons) {
  button.hidden = false;
  button.addEventListener("click", () => {
    const part = Number(button.dataset.markPart);
    if (completed.has(part)) completed.delete(part);
    else completed.add(part);
    refreshProgress();
    record(completionKey, completed);
  });
}

for (const button of saveButtons) {
  button.hidden = false;
  button.addEventListener("click", () => {
    const key = button.dataset.save;
    if (saved.has(key)) saved.delete(key);
    else saved.add(key);
    refreshSaved();
    for (const filter of refreshFilters) filter();
    if (button.closest("[data-result]")?.hidden) {
      document.querySelector("[data-saved-only]")?.focus();
    }
    record(readingKey, saved);
  });
}

const reset = document.querySelector("[data-reset-progress]");
if (reset) {
  reset.hidden = false;
  reset.addEventListener("click", () => {
    if (!confirm("Clear your saved readings and completion marks in this browser?")) return;
    completed.clear();
    saved.clear();
    announce("Saved readings and completion marks cleared.");
    record(completionKey, completed);
    record(readingKey, saved);
  });
}

function refreshState() {
  completed = readValues(completionKey);
  saved = readValues(readingKey);
  refreshProgress();
  refreshSaved();
  for (const filter of refreshFilters) filter();
}

refreshProgress();
refreshSaved();
window.addEventListener("pageshow", event => { if (event.persisted) refreshState(); });
window.addEventListener("storage", event => {
  if (event.key === completionKey || event.key === readingKey || event.key === null) refreshState();
});

const pace = document.querySelector("[data-pace]");
if (pace) {
  const hours = pace.querySelector("[data-weekly-hours]");
  const active = pace.querySelector("[data-active-weeks]");
  const calendar = pace.querySelector("[data-calendar-weeks]");
  const low = Number(pace.dataset.hoursLow);
  const high = Number(pace.dataset.hoursHigh);
  const weeks = (total, extra = 1) => Math.ceil(total * extra / Number(hours.value));
  hours.labels[0].hidden = false;
  hours.addEventListener("input", () => {
    if (!hours.value || !hours.validity.valid) {
      active.textContent = "Enter between 1 and 80 study hours per week.";
      calendar.textContent = "";
      return;
    }
    active.textContent = weeks(low) + "–" + weeks(high) + " study weeks";
    calendar.textContent = weeks(low, 1.2) + "–" + weeks(high, 1.2) + " weeks including breaks";
  });
}
