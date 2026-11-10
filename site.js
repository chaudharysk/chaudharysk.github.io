'use strict';

(() => {
  document.documentElement.classList.add('js');
  const motionQuery = matchMedia('(prefers-reduced-motion: reduce)');
  let paused = motionQuery.matches;
  try { if (localStorage.getItem('shashi-motion') === 'off') paused = true; } catch {}
  function applyMotion() {
    document.documentElement.classList.toggle('motion-off', paused);
    window.portfolioMotion = {paused};
    document.dispatchEvent(new CustomEvent('portfolio:motion', {detail:{paused}}));
  }
  motionQuery.addEventListener('change', event => { paused = event.matches; applyMotion(); });
  addEventListener('pageshow',event=>{
    if(!event.persisted)return;
    let storedOff=false;try{storedOff=localStorage.getItem('shashi-motion')==='off'}catch{}
    paused=motionQuery.matches||storedOff;applyMotion();
  });
  applyMotion();

  // Documents opened by the desktop keep ordinary links inside their app window.
  const embedded=new URLSearchParams(location.search).get('desktop')==='1';
  if(embedded){
    document.documentElement.classList.add('desktop-document');
    if(location.pathname.endsWith('/about.html'))document.querySelector('h1').textContent='Shashikant Chaudhary';
    document.querySelectorAll('.profile-section-label h2').forEach(h=>h.innerHTML=h.innerHTML.replace(/<br\s*\/?>/gi,' '));
    document.querySelectorAll('a[href]').forEach(link=>{const href=link.getAttribute('href');if(!href||href.startsWith('#')||link.target==='_blank')return;const url=new URL(href,location.href);if(url.origin===location.origin&&url.pathname.endsWith('.html')){url.searchParams.set('desktop','1');link.href=url.href;}});
    addEventListener('message',event=>{if(event.origin!==location.origin||event.data?.type!=='portfolio:motion'||typeof event.data.paused!=='boolean')return;paused=event.data.paused;applyMotion();});
  }

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

})();
