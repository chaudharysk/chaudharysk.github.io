'use strict';

(() => {
  const root = document.documentElement;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  let paused = window.portfolioMotion?.paused ?? matchMedia('(prefers-reduced-motion: reduce)').matches;
  const progress = document.createElement('div');
  progress.className = 'read-progress'; progress.setAttribute('aria-hidden','true'); document.body.prepend(progress);
  const artworks = [...document.querySelectorAll('.project-card .project-art')];
  const magnets = [...document.querySelectorAll('.button')];
  const motionRegions = [...document.querySelectorAll('.avatar-scene,.signal-ticker')];
  const scene = document.querySelector('#avatar-scene');
  let scrollFrame = 0, pointerFrame = 0, burstTimer;

  magnets.forEach(button => {
    const content = document.createElement('span'); content.className = 'magnetic-content';
    while (button.firstChild) content.append(button.firstChild);
    button.append(content);
    button.addEventListener('pointermove', event => {
      if (paused || !finePointer.matches || event.pointerType === 'touch') return;
      const bounds = button.getBoundingClientRect();
      const x = Math.max(-1,Math.min(1,(event.clientX-bounds.left)/bounds.width*2-1));
      const y = Math.max(-1,Math.min(1,(event.clientY-bounds.top)/bounds.height*2-1));
      button.style.setProperty('--magnetic-x',`${x*4}px`); button.style.setProperty('--magnetic-y',`${y*3}px`);
    },{passive:true});
    button.addEventListener('pointerleave',()=>{button.style.removeProperty('--magnetic-x');button.style.removeProperty('--magnetic-y')});
  });

  artworks.forEach(art => {
    const hint = document.createElement('span'); hint.className = 'art-cursor'; hint.textContent = 'Explore ↗'; hint.setAttribute('aria-hidden','true'); art.append(hint);
    art.addEventListener('pointermove', event => {
      if (paused || !finePointer.matches || event.pointerType === 'touch') return;
      const bounds = art.getBoundingClientRect(),x=(event.clientX-bounds.left)/bounds.width,y=(event.clientY-bounds.top)/bounds.height;
      if (pointerFrame) cancelAnimationFrame(pointerFrame);
      pointerFrame=requestAnimationFrame(()=>{
        art.style.setProperty('--art-rx',`${(0.5-y)*5}deg`);art.style.setProperty('--art-ry',`${(x-0.5)*7}deg`);
        art.style.setProperty('--cursor-x',`${Math.max(0,Math.min(1,x))*100}%`);art.style.setProperty('--cursor-y',`${Math.max(0,Math.min(1,y))*100}%`);
      });
    },{passive:true});
    art.addEventListener('pointerleave',()=>{
      if(pointerFrame)cancelAnimationFrame(pointerFrame);
      ['--art-rx','--art-ry','--cursor-x','--cursor-y'].forEach(key=>art.style.removeProperty(key));
    });
  });

  function updateScroll() {
    scrollFrame=0;
    const maximum=root.scrollHeight-innerHeight;
    progress.style.transform=`scaleX(${maximum>0?Math.min(1,scrollY/maximum):0})`;
    if(paused||!finePointer.matches)return;
    artworks.forEach(art=>{
      const bounds=art.getBoundingClientRect();
      if(bounds.top>innerHeight+100||bounds.bottom< -100)return;
      const amount=Math.max(0,Math.min(1,(innerHeight-bounds.top)/(innerHeight+bounds.height)));
      art.style.setProperty('--art-scroll-rx',`${(0.5-amount)*5}deg`);
    });
  }
  function scheduleScroll(){if(!scrollFrame)scrollFrame=requestAnimationFrame(updateScroll)}
  addEventListener('scroll',scheduleScroll,{passive:true});addEventListener('resize',scheduleScroll);updateScroll();

  const visibilityObserver=new IntersectionObserver(entries=>{
    entries.forEach(entry=>entry.target.classList.toggle('effect-paused',!entry.isIntersecting));
  },{rootMargin:'80px'});
  motionRegions.forEach(region=>visibilityObserver.observe(region));
  document.addEventListener('visibilitychange',()=>root.classList.toggle('tab-hidden',document.hidden));

  if(scene){
    scene.addEventListener('pointermove',event=>{
      if(paused||!finePointer.matches||event.pointerType==='touch')return;
      const bounds=scene.getBoundingClientRect();
      scene.style.setProperty('--scene-x',Math.max(-1,Math.min(1,(event.clientX-bounds.left)/bounds.width*2-1)));
      scene.style.setProperty('--scene-y',Math.max(-1,Math.min(1,(event.clientY-bounds.top)/bounds.height*2-1)));
    },{passive:true});
    scene.addEventListener('pointerleave',()=>{scene.style.removeProperty('--scene-x');scene.style.removeProperty('--scene-y')});
    document.addEventListener('portfolio:topic',event=>{
      const mode=event.detail.topic;
      if(!['ai','maths','human'].includes(mode))return;
      scene.dataset.mode=mode;
      document.querySelector('#engine-label').textContent={ai:'AI / CONNECTED IDEAS',maths:'MATHS / FIND THE PATTERN',human:'HUMAN / MAKE IT CLICK'}[mode];
      clearTimeout(burstTimer);scene.classList.remove('scene-burst');
      if(mode==='human'&&!paused){void scene.offsetWidth;scene.classList.add('scene-burst');burstTimer=setTimeout(()=>scene.classList.remove('scene-burst'),900)}
    });
  }

  document.addEventListener('portfolio:motion',event=>{
    paused=event.detail.paused;
    if(paused){
      if(pointerFrame){cancelAnimationFrame(pointerFrame);pointerFrame=0}
      artworks.forEach(art=>['--art-rx','--art-ry','--art-scroll-rx'].forEach(key=>art.style.removeProperty(key)));
      magnets.forEach(button=>['--magnetic-x','--magnetic-y'].forEach(key=>button.style.removeProperty(key)));
      if(scene){scene.style.removeProperty('--scene-x');scene.style.removeProperty('--scene-y');scene.classList.remove('scene-burst')}
    }else scheduleScroll();
  });
  finePointer.addEventListener('change',scheduleScroll);
  addEventListener('pageswap',event=>{if(paused)event.viewTransition?.skipTransition()});
  addEventListener('pagereveal',event=>{if(paused)event.viewTransition?.skipTransition()});
})();
