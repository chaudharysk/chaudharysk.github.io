'use strict';

(() => {
  const cards = [...document.querySelectorAll('.bench-card')];
  const items = cards.map(card => {
    const link = card.querySelector('[data-media-item]');
    return {card, link, id:link.dataset.mediaItem, group:card.dataset.mediaGroup,
      type:link.dataset.mediaType, src:link.getAttribute('href'),
      poster:link.querySelector('img').getAttribute('src'),
      captions:link.dataset.captions, title:card.querySelector('h3').textContent,
      description:card.querySelector('.bench-description').textContent};
  });
  const dialog = document.querySelector('#media-dialog');
  const stage = document.querySelector('#media-stage');
  const heading = document.querySelector('#media-title');
  const description = document.querySelector('#media-description');
  const position = document.querySelector('#media-position');
  const directLink = document.querySelector('#media-direct-link');
  const previous = document.querySelector('#media-previous');
  const next = document.querySelector('#media-next');
  let filter = 'all', current = null, trigger = null;

  function filteredItems() { return items.filter(item => filter === 'all' || item.group === filter); }
  function setFilter(value) {
    filter = value;
    document.querySelectorAll('[data-media-filter]').forEach(button => {
      const active = button.dataset.mediaFilter === value;
      button.setAttribute('aria-pressed', String(active)); button.classList.toggle('active', active);
    });
    items.forEach(item => { item.card.hidden = value !== 'all' && item.group !== value; });
    document.querySelector('#bench-count').textContent = `${filteredItems().length} recordings & photos`;
  }
  document.querySelectorAll('[data-media-filter]').forEach(button => button.addEventListener('click', () => setFilter(button.dataset.mediaFilter)));

  function releasePlayer() {
    const video = stage.querySelector('video');
    if (video) { video.pause(); video.removeAttribute('src'); video.load(); }
    stage.replaceChildren();
  }
  function showItem(item, play = false) {
    releasePlayer(); current = item;
    heading.textContent = item.title; description.textContent = item.description;
    directLink.href = item.src; directLink.textContent = item.type === 'video' ? 'OPEN VIDEO ↗' : 'OPEN PHOTO ↗';
    const visible = filteredItems();
    position.textContent = `${String(visible.indexOf(item) + 1).padStart(2,'0')} / ${String(visible.length).padStart(2,'0')}`;
    previous.disabled = visible.length < 2; next.disabled = visible.length < 2;
    if (item.type === 'video') {
      const video = document.createElement('video');
      video.controls = true; video.playsInline = true; video.preload = 'metadata'; video.poster = item.poster;
      video.src = item.src; video.setAttribute('aria-label', item.title); video.setAttribute('aria-describedby','media-description');
      if (item.captions) {
        const track = document.createElement('track'); track.kind = 'captions'; track.label = 'English / sound descriptions';
        track.srclang = 'en'; track.src = item.captions; video.append(track);
      }
      stage.append(video);
      if (play) video.play().catch(() => { /* Native controls remain available if autoplay is restricted. */ });
    } else {
      const image = document.createElement('img'); image.src = item.src; image.alt = item.description; stage.append(image);
    }
  }
  items.forEach(item => item.link.addEventListener('click', event => {
    event.preventDefault(); trigger = item.link;
    document.body.classList.add('dialog-open'); dialog.showModal();
    showItem(item, item.type === 'video');
  }));
  function changeItem(direction) {
    const visible = filteredItems(), index = visible.indexOf(current);
    showItem(visible[(index + direction + visible.length) % visible.length]);
  }
  previous.addEventListener('click', () => changeItem(-1)); next.addEventListener('click', () => changeItem(1));
  document.querySelector('#media-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => {
    releasePlayer(); current = null; document.body.classList.remove('dialog-open');
    if (trigger) trigger.focus({preventScroll:true});
  });
  dialog.addEventListener('click', event => {
    const box = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom)) dialog.close();
  });
  // Project details and the work section can lead directly to the relevant recordings.
  document.addEventListener('click', event => {
    const link = event.target.closest('[data-bench-filter]');
    if (!link) return;
    setFilter(link.dataset.benchFilter);
    const projectDialog = document.querySelector('#project-dialog');
    if (projectDialog.open) projectDialog.close();
  });
})();
