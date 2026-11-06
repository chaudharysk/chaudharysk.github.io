'use strict';
(() => {
  const canvas=document.querySelector('#eclipse-motion');if(!canvas)return;
  const ctx=canvas.getContext('2d',{alpha:true});if(!ctx)return;
  const host=canvas.parentElement,image=new Image(),reduce=matchMedia('(prefers-reduced-motion: reduce)');
  let width=0,height=0,scale=1,ox=0,oy=0,ready=false,water=null,raf=0,last=0,time=0;
  const bridge=[[.590,.612],[.650,.548],[.720,.466],[.800,.412],[.890,.371]];
  const point=(x,y)=>[ox+x*image.naturalWidth*scale,oy+y*image.naturalHeight*scale];
  const mod=(x,m)=>((x%m)+m)%m;
  const strong=()=>window.portfolioScene?.intensity!=='calm';
  function running(){return ready&&document.body.dataset.wallpaper==='eclipse'&&!window.portfolioMotion?.paused&&!document.hidden&&!reduce.matches;}
  function waterPath(){
    const p=new Path2D();p.moveTo(...point(0,.639));p.lineTo(...point(.62,.639));p.lineTo(...point(.677,.696));p.lineTo(...point(.653,.794));p.lineTo(...point(.59,.89));p.lineTo(...point(.575,1));p.lineTo(...point(0,1));p.closePath();return p;
  }
  function route(t){
    const segment=Math.min(bridge.length-2,Math.floor(t*(bridge.length-1))),part=t*(bridge.length-1)-segment,a=bridge[segment],b=bridge[segment+1];
    return point(a[0]+(b[0]-a[0])*part,a[1]+(b[1]-a[1])*part);
  }
  function stroke(a,b,color,size){
    ctx.strokeStyle=color;ctx.lineWidth=size;ctx.beginPath();ctx.moveTo(...a);ctx.lineTo(...b);ctx.stroke();
  }
  function render(){
    if(!ready||!width)return;
    ctx.clearRect(0,0,width,height);const power=strong()?1:.4;
    ctx.save();ctx.clip(water);
    const begin=Math.max(0,point(0,.638)[1]),step=innerWidth<=700?6:4;
    for(let y=begin;y<height;y+=step){
      const depth=Math.max(0,(y-begin)/Math.max(1,height-begin)),wave=(Math.sin(y*.08-time*1.5)+Math.sin(y*.041+time*.6)*.7)*(.3+depth*2.3)*power;
      const sy=(y-oy)/scale+Math.sin(y*.055-time)*.3*power,sh=Math.min((step+.5)/scale,image.naturalHeight-sy);
      if(sy>=0&&sh>0)ctx.drawImage(image,0,sy,image.naturalWidth,sh,ox+wave,y,image.naturalWidth*scale,sh*scale);
    }
    for(let i=0;i<28;i++){
      const [x,y]=point((i*.137)% .65,.66+(i*.073)% .34),phase=(1+Math.sin(time*1.6+i*2))/2;
      ctx.strokeStyle='rgba(255,204,160,'+(.025+phase*.06)*power+')';ctx.lineWidth=.6;
      ctx.beginPath();ctx.ellipse(x+Math.sin(time*.5+i)*8,y,8+phase*(12+i%4*9),.7+phase*.9,0,0,Math.PI*2);ctx.stroke();
    }
    ctx.restore();
    // Transit follows the deck of the architecture, without covering the skyline.
    for(let i=0;i<3;i++){
      const progress=mod(time/(strong()?38:52)+i/3,1);
      stroke(route(Math.max(0,progress-.009)),route(progress),'rgba(255,229,191,.78)',1.4);
    }
    // Far-off boats move slowly and cast short reflections on the bay.
    for(let i=0;i<3;i++){
      const nx=mod([.112,.285,.349][i]+time*.00065*(i%2?-1:1),.55),[x,y]=point(nx,.633+i*.001);
      ctx.fillStyle='rgba(255,218,169,.8)';ctx.fillRect(x,y,3,1);
      stroke([x,y+3],[x-1,y+10+Math.sin(time+i)*2],'rgba(255,195,144,.12)',1);
    }
  }
  function tick(now){raf=0;if(!running())return;if(!last)last=now;if(now-last>=1000/30){time+=Math.min(.1,(now-last)/1000);last=now;render();}raf=requestAnimationFrame(tick);}
  function sync(){cancelAnimationFrame(raf);raf=0;last=0;canvas.dataset.state=running()?'live':ready?'paused':'loading';if(running())raf=requestAnimationFrame(tick);}
  function resize(){
    width=host.clientWidth;height=host.clientHeight;const density=Math.min(devicePixelRatio||1,1.5,Math.sqrt(2600000/Math.max(1,width*height)));
    canvas.width=Math.round(width*density);canvas.height=Math.round(height*density);ctx.setTransform(density,0,0,density,0,0);
    if(ready){scale=Math.max(width/image.naturalWidth,height/image.naturalHeight);ox=(width-image.naturalWidth*scale)*(innerWidth<=700?.64:.5);oy=(height-image.naturalHeight*scale)*.5;water=waterPath();render();}sync();
  }
  image.onload=()=>{ready=true;resize();};image.onerror=()=>{canvas.dataset.state='unavailable';cancelAnimationFrame(raf);};image.src='assets/desktop-eclipse-bay.png';
  new ResizeObserver(resize).observe(host);document.addEventListener('portfolio:motion',sync);document.addEventListener('portfolio:wallpaper',sync);document.addEventListener('visibilitychange',sync);reduce.addEventListener('change',sync);document.addEventListener('portfolio:scene',()=>{if(running())render();});addEventListener('pagehide',()=>{cancelAnimationFrame(raf);raf=0;});addEventListener('pageshow',sync);
})();

