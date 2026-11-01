'use strict';

(() => {
  const root=document.documentElement;
  const fine=matchMedia('(hover: hover) and (pointer: fine)');
  let paused=window.portfolioMotion?.paused??matchMedia('(prefers-reduced-motion: reduce)').matches;
  const progress=document.createElement('div');progress.className='universe-progress';progress.setAttribute('aria-hidden','true');document.body.prepend(progress);
  let scrollFrame=0;
  function updateProgress(){scrollFrame=0;const max=root.scrollHeight-innerHeight;progress.style.transform=`scaleX(${max>0?Math.max(0,Math.min(1,scrollY/max)):0})`;}
  function scheduleProgress(){if(!scrollFrame)scrollFrame=requestAnimationFrame(updateProgress);}
  addEventListener('scroll',scheduleProgress,{passive:true});addEventListener('resize',scheduleProgress);updateProgress();
  const cards=[...document.querySelectorAll('.project-card')];
  cards.forEach(card=>{
    card.addEventListener('pointermove',event=>{if(paused||!fine.matches||event.pointerType==='touch')return;const b=card.getBoundingClientRect();card.style.setProperty('--card-rx',`${(.5-(event.clientY-b.top)/b.height)*4}deg`);card.style.setProperty('--card-ry',`${((event.clientX-b.left)/b.width-.5)*5}deg`);},{passive:true});
    card.addEventListener('pointerleave',()=>{card.style.removeProperty('--card-rx');card.style.removeProperty('--card-ry');});
  });
  const hero=document.querySelector('#immersive-hero');
  const stage=document.querySelector('#avatar-universe');
  const figure=document.querySelector('#avatar-figure');
  const canvas=document.querySelector('#universe-canvas');
  const ctx=canvas?.getContext('2d',{alpha:true});
  let frame=0,asleep=false,last=0,greetTimer,nodTimer,mode='ai',width=0,height=0,center={x:0,y:0},radius=250,phase=0,burst=0,yaw=0,targetYaw=0,dragging=false,dragStart=0,dragDistance=0;
  const pointer={x:0,y:0,tx:0,ty:0};
  const count=84;
  const particles=Array.from({length:110},(_,i)=>({x:((i*71.731)%997)/997,y:((i*131.913)%991)/991,s:.3+(i%5)*.21,speed:.6+(i%7)*.19}));
  function pointFor(i,world){
    const t=i/count*Math.PI*2;
    if(world==='maths'){const p=t*3,q=t*2;return {x:Math.sin(p)*(1.05+.25*Math.cos(q)),y:Math.cos(p)*(.72+.25*Math.sin(q)),z:Math.sin(q)*.72};}
    if(world==='maker'){const x=(i%7-3)/2.65,y=(Math.floor(i/7)%4-1.5)/1.75,z=(Math.floor(i/28)-1)/1.2;return {x,y,z};}
    const y=1-i/(count-1)*2,ring=Math.sqrt(1-y*y),theta=i*Math.PI*(3-Math.sqrt(5));return {x:Math.cos(theta)*ring,y:y*.95,z:Math.sin(theta)*ring};
  }
  const nodes=Array.from({length:count},(_,i)=>{const p=pointFor(i,'ai');return {...p,tx:p.x,ty:p.y,tz:p.z};});
  function resetPointer(){pointer.tx=0;pointer.ty=0;if(stage){stage.style.setProperty('--avatar-x','0');stage.style.setProperty('--avatar-y','0');}}
  function resize(){if(!hero||!ctx)return;const b=hero.getBoundingClientRect(),s=stage.getBoundingClientRect();width=b.width;height=b.height;const dpr=Math.min(devicePixelRatio||1,1.7);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);center={x:s.left-b.left+s.width*.5,y:s.top-b.top+s.height*.46};radius=Math.min(s.width*.59,330);if(paused||asleep)draw(0);}
  function project(x,y,z,angle){const ca=Math.cos(angle),sa=Math.sin(angle),xx=x*ca-z*sa,zz=x*sa+z*ca;const tilt=.12+pointer.y*.12,ct=Math.cos(tilt),st=Math.sin(tilt),yy=y*ct-zz*st,z2=y*st+zz*ct;const scale=750/(750+z2*radius);return {x:center.x+xx*radius*scale,y:center.y+yy*radius*scale,z:z2,scale};}
  function draw(dt){
    if(!ctx||!width||!height)return;
    ctx.clearRect(0,0,width,height);
    const speed=dt?Math.min(dt/16.667,2):0;
    if(speed){phase+=.0035*speed;pointer.x+=(pointer.tx-pointer.x)*.065*speed;pointer.y+=(pointer.ty-pointer.y)*.065*speed;yaw+=(targetYaw-yaw)*.06*speed;burst=Math.max(0,burst-.018*speed);}
    const colour=mode==='maths'?'169,201,255':mode==='maker'?'255,187,127':'255,163,76';
    const ice='156,222,237';
    const angle=phase+yaw+pointer.x*.16;
    particles.forEach((p,i)=>{const x=(p.x*width+Math.sin(phase*2+i)*9+pointer.x*7)%width,y=((p.y*height-phase*p.speed*29)%height+height)%height;ctx.beginPath();ctx.fillStyle=`rgba(${i%3===0?colour:ice},${.08+(i%4)*.035})`;ctx.arc(x,y,p.s,0,Math.PI*2);ctx.fill();});
    const floorY=center.y+radius*.93;
    ctx.save();ctx.strokeStyle=`rgba(${ice},.085)`;ctx.lineWidth=.6;
    for(let n=-7;n<=7;n++){ctx.beginPath();ctx.moveTo(center.x+n*15,floorY-7);ctx.lineTo(center.x+n*130,floorY+170);ctx.stroke();}
    for(let n=0;n<9;n++){const d=(n+(phase*4)%1)/9,yy=floorY+d*d*170;ctx.beginPath();ctx.moveTo(center.x-330*d,yy);ctx.lineTo(center.x+330*d,yy);ctx.stroke();}ctx.restore();
    const projected=nodes.map((node,i)=>{if(speed){node.x+=(node.tx-node.x)*.045*speed;node.y+=(node.ty-node.y)*.045*speed;node.z+=(node.tz-node.z)*.045*speed;}const breathe=1+Math.sin(phase*3+i*.15)*.025+burst*.16;return project(node.x*breathe,node.y*breathe,node.z*breathe,angle);});
    projected.forEach((a,i)=>{
      for(let j=i+1;j<projected.length;j++){
        const b=projected[j],dx=nodes[i].x-nodes[j].x,dy=nodes[i].y-nodes[j].y,dz=nodes[i].z-nodes[j].z,dist=Math.sqrt(dx*dx+dy*dy+dz*dz);
        if(dist>(mode==='maker'?.49:mode==='maths'?.59:.48))continue;
        const alpha=(1-dist/.72)*.24+(burst*.12);ctx.strokeStyle=`rgba(${i%4===0?colour:ice},${alpha})`;ctx.lineWidth=i%5===0?.8:.5;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();
      }
      ctx.beginPath();ctx.fillStyle=`rgba(${i%3===0?colour:ice},${.3+Math.max(0,a.z)*.25})`;ctx.arc(a.x,a.y,(i%7===0?2.4:1.1)*a.scale,0,Math.PI*2);ctx.fill();
      if(i%14===0){ctx.beginPath();ctx.strokeStyle=`rgba(${colour},.22)`;ctx.lineWidth=.7;ctx.arc(a.x,a.y,5*a.scale,0,Math.PI*2);ctx.stroke();}
    });
    if(burst>0){ctx.save();ctx.strokeStyle=`rgba(${colour},${burst*.45})`;ctx.lineWidth=.8;ctx.beginPath();ctx.ellipse(center.x,center.y,radius*(1.3+(1-burst)*.7),radius*(.98+(1-burst)*.5),.2,0,Math.PI*2);ctx.stroke();ctx.restore();}
    if(stage){stage.style.setProperty('--avatar-x',paused?'0':pointer.x.toFixed(3));stage.style.setProperty('--avatar-y',paused?'0':pointer.y.toFixed(3));}
  }
  function loop(time){frame=0;if(paused||asleep||document.hidden)return;const dt=last?time-last:16.667;last=time;draw(dt);frame=requestAnimationFrame(loop);}
  function sync(){if(frame){cancelAnimationFrame(frame);frame=0;}last=0;if(hero)hero.classList.toggle('scene-sleep',asleep);if(canvas)canvas.dataset.state=paused||asleep||document.hidden?'paused':'running';if(!ctx)return;if(!paused&&!asleep&&!document.hidden)frame=requestAnimationFrame(loop);else draw(0);}
  function greet(text){if(!hero)return;const greeting=document.querySelector('#avatar-greeting');greeting.textContent=text||'Hey, I’m Shashi. Good to see you!';greeting.classList.add('shown');clearTimeout(greetTimer);greetTimer=setTimeout(()=>greeting.classList.remove('shown'),2600);if(!paused){figure.classList.remove('hello');void figure.offsetWidth;figure.classList.add('hello');clearTimeout(nodTimer);nodTimer=setTimeout(()=>figure.classList.remove('hello'),950);burst=1;}}
  if(hero&&ctx){
    const captions={ai:'Connected ideas. New possibilities.',maths:'Find the pattern. Follow the proof.',maker:'From an idea to something you can touch.'};
    const greetings={ai:'Let’s connect a few ideas.',maths:'There’s a pattern in here somewhere.',maker:'Let’s build something useful.'};
    document.querySelectorAll('[data-world-button]').forEach(button=>button.addEventListener('click',()=>{const next=button.dataset.worldButton;if(!captions[next])return;mode=next;hero.dataset.world=next;document.querySelectorAll('[data-world-button]').forEach(other=>other.setAttribute('aria-pressed',String(other===button)));document.querySelector('#world-caption').textContent=captions[next];nodes.forEach((node,i)=>{const p=pointFor(i,next);node.tx=p.x;node.ty=p.y;node.tz=p.z;if(paused){node.x=p.x;node.y=p.y;node.z=p.z;}});greet(greetings[next]);if(paused)draw(0);}));
    document.querySelector('.world-switcher').addEventListener('keydown',event=>{if(!['ArrowLeft','ArrowRight'].includes(event.key))return;const buttons=[...document.querySelectorAll('[data-world-button]')],index=buttons.indexOf(document.activeElement);if(index<0)return;event.preventDefault();const target=buttons[(index+(event.key==='ArrowRight'?1:-1)+buttons.length)%buttons.length];target.focus();target.click();});
    document.querySelector('#avatar-hello').addEventListener('click',()=>greet());
    document.querySelectorAll('.orbit-assistant').forEach(button=>button.addEventListener('click',()=>{burst=1;if(!paused)greet({jarvis:'JARVIS has the technical details.',friday:'FRIDAY will introduce us.',edith:'EDITH knows where everything is.'}[button.dataset.assistant]);}));
    hero.addEventListener('pointermove',event=>{if(paused||!fine.matches||event.pointerType==='touch')return;const b=stage.getBoundingClientRect();pointer.tx=Math.max(-1,Math.min(1,(event.clientX-b.left)/b.width*2-1));pointer.ty=Math.max(-1,Math.min(1,(event.clientY-b.top)/b.height*2-1));if(dragging){const delta=event.clientX-dragStart;dragDistance+=Math.abs(delta);targetYaw+=delta*.006;dragStart=event.clientX;}},{passive:true});
    hero.addEventListener('pointerleave',()=>{pointer.tx=0;pointer.ty=0;dragging=false;});
    stage.addEventListener('pointerdown',event=>{if(event.target.closest('button,a')||event.pointerType!=='mouse'||paused)return;dragging=true;dragStart=event.clientX;dragDistance=0;});
    stage.addEventListener('pointerup',event=>{if(event.target.closest('button,a'))return;if(!dragging||dragDistance<6)greet();dragging=false;});
    addEventListener('pointerup',()=>{dragging=false;});
    new IntersectionObserver(entries=>{asleep=!entries[0].isIntersecting;sync();},{rootMargin:'80px'}).observe(hero);
    new ResizeObserver(resize).observe(hero);resize();sync();
  }
  document.addEventListener('portfolio:motion',event=>{paused=event.detail.paused;if(paused){resetPointer();cards.forEach(card=>{card.style.removeProperty('--card-rx');card.style.removeProperty('--card-ry');});}sync();});
  fine.addEventListener('change',()=>{if(!fine.matches)resetPointer();});
  document.addEventListener('visibilitychange',()=>{root.classList.toggle('tab-hidden',document.hidden);sync();});
  addEventListener('pageswap',event=>{if(paused)event.viewTransition?.skipTransition();});addEventListener('pagereveal',event=>{if(paused)event.viewTransition?.skipTransition();});
})();
