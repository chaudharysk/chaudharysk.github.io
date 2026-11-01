'use strict';

(() => {
  const canvas = document.querySelector('#city-motion');
  if (!canvas) return;
  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;
  const wallpaper = canvas.parentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const routes = [
    [[0,.670],[.341,.631],[.710,.594]],
    [[0,.784],[.299,.738],[.650,.702]]
  ];
  const beacons = [[.729,.038],[.675,.162],[.100,.366]];
  let width=0, height=0, imageWidth=0, imageHeight=0, cropX=0, cropY=0;
  let rain=[], raf=0, last=0, sceneTime=0;
  // One small mist texture, reused rather than allocating gradients each frame.
  const mist = document.createElement('canvas');
  mist.width=256; mist.height=64;
  const mistContext=mist.getContext('2d');
  const glow=mistContext.createRadialGradient(128,128,0,128,128,128);
  glow.addColorStop(0,'rgba(153,190,206,.15)');
  glow.addColorStop(.45,'rgba(115,156,178,.07)');
  glow.addColorStop(1,'rgba(115,156,178,0)');
  mistContext.scale(1,.25); mistContext.fillStyle=glow;
  mistContext.fillRect(0,0,256,256);
  const point = p => [p[0]*imageWidth+cropX,p[1]*imageHeight+cropY];
  const mod = (value, max) => ((value % max) + max) % max;
  function routePoint(points, progress) {
    const index=progress < .5 ? 0 : 1, t=progress < .5 ? progress*2 : (progress-.5)*2;
    return point([points[index][0]+(points[index+1][0]-points[index][0])*t,points[index][1]+(points[index+1][1]-points[index][1])*t]);
  }
  function stroke(a,b,color,size=1) {
    ctx.strokeStyle=color; ctx.lineWidth=size; ctx.beginPath();
    ctx.moveTo(a[0],a[1]); ctx.lineTo(b[0],b[1]); ctx.stroke();
  }
  function paint() {
    ctx.clearRect(0,0,width,height);
    ctx.globalCompositeOperation='screen';
    // Slow, low-contrast mist stays in the skyline rather than covering the UI.
    for(let i=0;i<3;i++) {
      const p=point([.18+i*.22+Math.sin(sceneTime*.035+i*2)*.035,.53+i*.07]);
      ctx.drawImage(mist,p[0]-imageWidth*.32,p[1]-imageHeight*.07,imageWidth*.64,imageHeight*.14);
    }
    // Rail lights follow actual elevated paths in the artwork, including its crop.
    routes.forEach((route,line)=>{
      for(let i=0;i<4;i++) {
        const progress=mod(sceneTime/(line?24:19)+i/4,1);
        const forward=line===0?progress:1-progress;
        const tail=Math.max(0,Math.min(1,forward+(line===0?-.022:.022)));
        const head=routePoint(route,forward), end=routePoint(route,tail);
        stroke(end,head,line===0?'rgba(115,218,245,.7)':'rgba(255,189,107,.75)',1.3);
        ctx.fillStyle=line===0?'#c1f2ff':'#ffe1ae';
        ctx.fillRect(head[0]-1,head[1]-1,2.8,1.5);
      }
    });
    // Perspective compresses the avenue traffic at its distant vanishing point.
    for(let i=0;i<18;i++) {
      const incoming=i%2===0, raw=mod(sceneTime/(18+i%4*2)+i*.137,1);
      const depth=Math.pow(incoming?raw:1-raw,2);
      const near=incoming?[.511,.827]:[.551,.821];
      const a=point([.625+(near[0]-.625)*depth,.539+(near[1]-.539)*depth]);
      const behind=Math.max(0,depth-.004-depth*.008);
      const b=point([.625+(near[0]-.625)*behind,.539+(near[1]-.539)*behind]);
      stroke(b,a,incoming?'rgba(194,232,252,.82)':'rgba(255,135,81,.85)',.5+depth*1.3);
      stroke([a[0],a[1]+2],[a[0]-depth*2,a[1]+4+depth*7],incoming?'rgba(166,211,232,.1)':'rgba(255,174,98,.12)',1+depth*2);
    }
    beacons.forEach((p,i)=>{
      const [x,y]=point(p), alpha=.3+.25*(1+Math.sin(sceneTime*1.5+i*2));
      ctx.fillStyle=`rgba(255,85,78,${alpha})`;ctx.beginPath();ctx.arc(x,y,1.2,0,Math.PI*2);ctx.fill();
    });
    // Three rain depths give the scene motion even on a narrow mobile crop.
    ctx.lineCap='round';
    for(const drop of rain) {
      const y=mod(drop.y+sceneTime*drop.speed,height+80)-40;
      const x=mod(drop.x-sceneTime*drop.speed*.095,width+100)-50;
      stroke([x,y],[x-1.2*drop.depth,y+drop.length],`rgba(175,215,237,${drop.alpha})`,drop.depth*.55);
    }
    ctx.lineCap='butt';ctx.globalCompositeOperation='source-over';
  }
  function canRun() {
    return document.body.dataset.wallpaper==='cyberpunk' && !document.hidden &&
      !window.portfolioMotion?.paused && !reduce.matches;
  }
  function tick(now) {
    raf=0;
    if(!canRun())return;
    if(!last)last=now;
    if(now-last>=1000/30) {
      sceneTime+=Math.min((now-last)/1000,.1); last=now; paint();
    }
    raf=requestAnimationFrame(tick);
  }
  function sync() {
    cancelAnimationFrame(raf);raf=0;last=0;
    canvas.dataset.state=canRun()?'live':'paused';
    if(canRun())raf=requestAnimationFrame(tick);
  }
  function resize() {
    width=wallpaper.clientWidth;height=wallpaper.clientHeight;
    const dpr=Math.min(devicePixelRatio||1,1.5);
    canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);
    const cover=Math.max(width/1672,height/941);
    imageWidth=1672*cover;imageHeight=941*cover;
    cropX=(width-imageWidth)*(innerWidth<=700?.72:.5);cropY=(height-imageHeight)*.5;
    const count=Math.min(innerWidth<=700?90:210,Math.round(width*height/8000));
    rain=Array.from({length:count},()=>{
      const depth=.6+Math.random()*1.4;
      return {x:Math.random()*(width+100),y:Math.random()*(height+80),depth,
        speed:180+depth*230,length:6+depth*11,alpha:.045+depth*.045};
    });
    paint();sync();
  }
  new ResizeObserver(resize).observe(wallpaper);
  document.addEventListener('portfolio:motion',sync);
  document.addEventListener('portfolio:wallpaper',sync);
  document.addEventListener('visibilitychange',sync);
  reduce.addEventListener('change',sync);
  addEventListener('pagehide',()=>{cancelAnimationFrame(raf);raf=0;});
  addEventListener('pageshow',sync);
})();
