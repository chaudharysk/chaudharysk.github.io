'use strict';

// Keep the button hit area steady while its illustrated object responds to light.
(() => {
  const fine=matchMedia('(hover: hover) and (pointer: fine)');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const shortcuts=[...document.querySelectorAll('.desktop-shortcuts>button')];
  const reset=()=>shortcuts.forEach(button=>{button.style.removeProperty('--icon-rx');button.style.removeProperty('--icon-ry');});
  shortcuts.forEach(button=>{
    button.addEventListener('pointermove',event=>{
      if(!fine.matches||reduced.matches||window.portfolioMotion?.paused||event.pointerType==='touch')return;
      const box=button.getBoundingClientRect();
      button.style.setProperty('--icon-rx',((.5-(event.clientY-box.top)/box.height)*12).toFixed(2)+'deg');
      button.style.setProperty('--icon-ry',(((event.clientX-box.left)/box.width-.5)*16).toFixed(2)+'deg');
    },{passive:true});
    button.addEventListener('pointerleave',()=>{button.style.removeProperty('--icon-rx');button.style.removeProperty('--icon-ry');});
  });
  document.querySelector('.desktop-shortcuts').addEventListener('keydown',event=>{
    const index=shortcuts.indexOf(document.activeElement);if(index<0)return;
    const columns=getComputedStyle(document.querySelector('.desktop-shortcuts')).gridTemplateColumns.split(' ').length;
    const moves={ArrowLeft:-1,ArrowRight:1,ArrowUp:-columns,ArrowDown:columns};
    let next;if(event.key==='Home')next=0;else if(event.key==='End')next=shortcuts.length-1;else if(event.key in moves)next=Math.max(0,Math.min(shortcuts.length-1,index+moves[event.key]));else return;
    event.preventDefault();shortcuts[next].focus();
  });
  document.addEventListener('portfolio:motion',event=>{if(event.detail.paused)reset();});
  fine.addEventListener('change',reset);reduced.addEventListener('change',reset);
})();

// Put the wallpaper control in the scrolling page on phones, clear of voice buttons.
(() => {
  const mobile=matchMedia('(max-width:700px)'),control=document.querySelector('#desktop-scene-control');
  if(!control)return;
  const desktop=document.querySelector('#film-desktop'),surface=document.querySelector('#desktop-surface'),toast=document.querySelector('#desktop-toast');
  const place=()=>{if(mobile.matches)surface.append(control);else desktop.insertBefore(control,toast);};
  place();mobile.addEventListener('change',place);
})();
