'use strict';

// Cinemagraph effects follow the source photograph's crop; the original stays intact.
(() => {
  const canvas=document.querySelector('#alpine-motion');
  if(!canvas)return;
  const ctx=canvas.getContext('2d',{alpha:true});if(!ctx)return;
  const host=canvas.parentElement,photo=new Image(),reduce=matchMedia('(prefers-reduced-motion: reduce)');
  let width=0,height=0,scale=1,offsetX=0,offsetY=0,water=null,ready=false;
  let raf=0,last=0,time=0,ripples=[];
  const atmosphere=document.createElement('canvas');atmosphere.width=256;atmosphere.height=128;
  const fog=atmosphere.getContext('2d'),gradient=fog.createRadialGradient(128,128,2,128,128,128);
  gradient.addColorStop(0,'rgba(224,233,240,.25)');gradient.addColorStop(.5,'rgba(219,229,236,.12)');gradient.addColorStop(1,'rgba(219,229,236,0)');
  fog.scale(1,.5);fog.fillStyle=gradient;fog.fillRect(0,0,256,256);
  const point=(x,y)=>[offsetX+x*photo.naturalWidth*scale,offsetY+y*photo.naturalHeight*scale];
  const cinematic=()=>window.portfolioScene?.intensity!=='calm';
  function running(){return ready&&document.body.dataset.wallpaper==='alpine'&&!document.hidden&&!window.portfolioMotion?.paused&&!reduce.matches;}
  function lakePath(){
    const path=new Path2D(),p=(x,y)=>point(x,y);
    path.moveTo(...p(.66,.582));path.bezierCurveTo(...p(.59,.60),...p(.49,.65),...p(.337,.707));
    path.bezierCurveTo(...p(.40,.76),...p(.51,.82),...p(.53,.905));
    path.lineTo(...p(.594,1));path.lineTo(...p(1,1));path.lineTo(...p(1,.576));path.closePath();return path;
  }
  function render(){
    if(!ready||!width)return;
    ctx.clearRect(0,0,width,height);
    const power=cinematic()?1:.4;
    ctx.save();ctx.clip(water);
    // Only lake bands move: the mountains, shore and desktop content stay registered.
    const begin=Math.max(0,point(0,.574)[1]),step=innerWidth<=700?6:4;
    for(let y=begin;y<height;y+=step){
      const depth=Math.max(0,Math.min(1,(y-begin)/Math.max(1,height-begin)));
      const wave=(Math.sin(y*.075-time*1.9)+Math.sin(y*.039+time*.95)*.6)*(.3+depth*2.1)*power;
      const sourceY=(y-offsetY)/scale+Math.sin(y*.06-time*1.3)*.35*power;
      const sourceH=Math.min((step+.5)/scale,photo.naturalHeight-sourceY);
      if(sourceY>=0&&sourceH>0)ctx.drawImage(photo,0,sourceY,photo.naturalWidth,sourceH,offsetX+wave,y,photo.naturalWidth*scale,sourceH*scale);
    }
    // Thin reflected highlights travel with the breeze, without a luminous overlay.
    ctx.lineWidth=.6;
    for(let i=0;i<22;i++){
      const x=.48+((i*.137)% .51),y=.66+((i*.067)% .32),[px,py]=point(x,y);
      const phase=(Math.sin(time*1.5+i*1.7)+1)/2;
      ctx.strokeStyle='rgba(228,240,244,'+(.015+phase*.055)*power+')';
      ctx.beginPath();ctx.ellipse(px+Math.sin(time*.5+i)*9,py,8+phase*(15+i%4*7),.7+phase*.8,0,0,Math.PI*2);ctx.stroke();
    }
    // Gentle recurring ripples and occasional pointer ripples share the lake mask.
    for(let i=0;i<5;i++){
      const age=(time*.17+i*.231)%1,[x,y]=point(.53+(i*.113)% .42,.69+(i*.079)% .25);
      drawRipple(x,y,age,55*power);
    }
    ripples=ripples.filter(r=>time-r.start<3);
    ripples.forEach(r=>drawRipple(r.x,r.y,(time-r.start)/3,110*power));
    ctx.restore();
    // Valley mist and high wisps drift independently of the water.
    ctx.globalAlpha=cinematic()?.42:.22;
    for(let i=0;i<3;i++){
      const [x,y]=point(.20+i*.29+Math.sin(time*.045+i*2)*.045,.49+i*.022);
      ctx.drawImage(atmosphere,x-width*.32,y-height*.055,width*.64,height*.11);
    }
    ctx.globalAlpha=cinematic()?.14:.07;
    const [cloudX,cloudY]=point(.48+Math.sin(time*.025)*.07,.205);
    ctx.drawImage(atmosphere,cloudX-width*.2,cloudY-height*.09,width*.4,height*.18);
    ctx.globalAlpha=1;
    // A small flock crosses the open sky; scale and speed keep it in the distance.
    const count=cinematic()?5:3;
    ctx.strokeStyle='rgba(29,49,60,.43)';ctx.lineWidth=.85;
    for(let i=0;i<count;i++){
      const travel=((time*.012+i*.017+.55)%1.3)-.15;
      const [x,y]=point(travel,.155+Math.sin(time*.12+i*.5)*.018+i*.014);
      const wing=Math.sin(time*3.4+i*.75)*2.4,size=2.4+i%2;
      ctx.beginPath();ctx.moveTo(x-size,y+wing);ctx.quadraticCurveTo(x-size*.5,y-1,x,y);ctx.quadraticCurveTo(x+size*.5,y-1,x+size,y+wing);ctx.stroke();
    }
  }
  function drawRipple(x,y,age,size){
    ctx.strokeStyle='rgba(226,239,245,'+(1-age)*.12+')';ctx.lineWidth=.7;
    for(let i=0;i<2;i++){const radius=Math.max(1,age*size-i*9);ctx.beginPath();ctx.ellipse(x,y,radius,radius*.13,0,0,Math.PI*2);ctx.stroke();}
  }
  function tick(now){
    raf=0;if(!running())return;
    if(!last)last=now;
    if(now-last>=1000/30){time+=Math.min(.1,(now-last)/1000);last=now;render();}
    raf=requestAnimationFrame(tick);
  }
  function sync(){
    cancelAnimationFrame(raf);raf=0;last=0;canvas.dataset.state=running()?'live':ready?'paused':'loading';
    if(running())raf=requestAnimationFrame(tick);
  }
  function resize(){
    width=host.clientWidth;height=host.clientHeight;
    const density=Math.min(devicePixelRatio||1,1.5,Math.sqrt(2600000/Math.max(1,width*height)));
    canvas.width=Math.round(width*density);canvas.height=Math.round(height*density);ctx.setTransform(density,0,0,density,0,0);
    if(ready){scale=Math.max(width/photo.naturalWidth,height/photo.naturalHeight);offsetX=(width-photo.naturalWidth*scale)*(innerWidth<=700?.58:.5);offsetY=(height-photo.naturalHeight*scale)*.5;water=lakePath();render();}
    sync();
  }
  photo.addEventListener('load',()=>{ready=true;resize();});
  photo.addEventListener('error',()=>{canvas.dataset.state='unavailable';cancelAnimationFrame(raf);});photo.src='assets/desktop-alpine-lake.jpg';
  new ResizeObserver(resize).observe(host);
  document.addEventListener('portfolio:motion',sync);document.addEventListener('portfolio:wallpaper',sync);
  document.addEventListener('portfolio:scene',()=>{if(!running())return;render();});
  document.addEventListener('visibilitychange',sync);reduce.addEventListener('change',sync);
  document.querySelector('#film-desktop').addEventListener('pointerdown',event=>{
    if(!running()||event.button!==0||event.target.closest('button,a,.desktop-window,.desktop-note,.featured-desk,.desktop-taskbar,.desktop-menubar'))return;
    const box=canvas.getBoundingClientRect(),x=(event.clientX-box.left)*width/box.width,y=(event.clientY-box.top)*height/box.height;
    // isPointInPath uses untransformed coordinates, so account for canvas density.
    const density=canvas.width/width;
    if(ctx.isPointInPath(water,x*density,y*density)){ripples.push({x,y,start:time});ripples=ripples.slice(-5);}
  });
  addEventListener('pagehide',()=>{cancelAnimationFrame(raf);raf=0;});addEventListener('pageshow',sync);
})();

