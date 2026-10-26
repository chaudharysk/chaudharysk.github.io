'use strict';

(() => {
  document.documentElement.classList.add('js');
  const menuButton = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('#navigation');
  function closeMenu(returnFocus = false) {
    navigation.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.querySelector('span').textContent = '+';
    if (returnFocus) menuButton.focus();
  }
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    navigation.classList.toggle('open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.querySelector('span').textContent = open ? '−' : '+';
  });
  navigation.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
  document.addEventListener('click', event => { if (!event.target.closest('.site-header')) closeMenu(); });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && navigation.classList.contains('open')) closeMenu(true);
  });
  matchMedia('(min-width: 901px)').addEventListener('change', event => { if (event.matches) closeMenu(); });
  document.querySelector('#year').textContent = new Date().getFullYear();

  const motionQuery = matchMedia('(prefers-reduced-motion: reduce)');
  let paused = motionQuery.matches;
  try { if (localStorage.getItem('shashi-motion') === 'off') paused = true; } catch {}
  const motionButton = document.querySelector('#motion-toggle');
  function applyMotion() {
    document.documentElement.classList.toggle('motion-off', paused);
    motionButton.setAttribute('aria-pressed', String(paused));
    motionButton.setAttribute('aria-label', paused ? 'Turn motion on' : 'Turn motion off');
    document.querySelector('#motion-label').textContent = paused ? 'Motion off' : 'Motion on';
    window.portfolioMotion = {paused};
    document.dispatchEvent(new CustomEvent('portfolio:motion', {detail:{paused}}));
  }
  motionButton.addEventListener('click', () => {
    paused = !paused; applyMotion();
    try { localStorage.setItem('shashi-motion', paused ? 'off' : 'on'); } catch {}
  });
  motionQuery.addEventListener('change', event => { paused = event.matches; applyMotion(); });
  addEventListener('pageshow',event=>{
    if(!event.persisted)return;
    let storedOff=false;try{storedOff=localStorage.getItem('shashi-motion')==='off'}catch{}
    paused=motionQuery.matches||storedOff;applyMotion();
  });
  applyMotion();

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    });
  }, {threshold:0.06});
  document.querySelectorAll('.reveal').forEach(element => observer.observe(element));

  document.querySelectorAll('[data-project-filter]').forEach(button => button.addEventListener('click', () => {
    const filter = button.dataset.projectFilter;
    document.querySelectorAll('[data-project-filter]').forEach(other => {
      const active = other === button;
      other.classList.toggle('active', active); other.setAttribute('aria-pressed', String(active));
    });
    let count = 0;
    document.querySelectorAll('.project-card[data-category]').forEach(card => {
      card.hidden = filter !== 'all' && card.dataset.category !== filter;
      if (!card.hidden) count++;
    });
    document.querySelector('#project-count').textContent = `${count} projects`;
  }));

  // Keep previously shared homepage section links useful after the move to pages.
  if (document.body.dataset.page === 'home') {
    const legacy = {
      '#work':'projects.html', '#project-hermes':'projects/hermes.html',
      '#bench':'playground.html#bench', '#about':'about.html',
      '#journey':'about.html#experience', '#research':'about.html#research',
      '#contact':'about.html#contact', '#overview':'index.html#intro'
    };
    if (legacy[location.hash]) location.replace(legacy[location.hash]);
  }
})();
