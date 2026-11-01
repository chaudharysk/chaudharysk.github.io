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
  document.addEventListener('portfolio:motion',event=>{if(event.detail.paused)reset();});
  fine.addEventListener('change',reset);reduced.addEventListener('change',reset);
})();
