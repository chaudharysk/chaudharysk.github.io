'use strict';

(() => {
  const surface=document.querySelector('#desktop-surface'),layer=document.querySelector('#desktop-window-layer'),taskApps=document.querySelector('#desktop-task-apps');
  if(!surface)return;
  const apps={profile:{name:'About Shashi',icon:'SC',doc:'about.html'},projects:{name:'Projects',icon:'▰'},experience:{name:'Experience',icon:'▥',doc:'experience.html'},coursework:{name:'Coursework',icon:'≡',doc:'coursework.html'},playground:{name:'Playground',icon:'▷',doc:'playground.html'},assistants:{name:'Assistants',icon:'◎'},terminal:{name:'Terminal',icon:'›_'},cv:{name:'Curriculum vitae',icon:'↗',doc:'cv.html'},contact:{name:'Contact',icon:'@'},help:{name:'Desktop controls',icon:'?'}};
  const projects=[{id:'edtuned',name:'edTuned',type:'AI & education',description:'Personalised learning agents and capstone exploration.'},{id:'hermes',name:'Hermes Watcher',type:'AI meets hardware',description:'Python, MQTT, and a SenseCAP status display.'},{id:'oulad',name:'Understanding student success',type:'Data & research',description:'Seven OULAD tables, repeatable data workflows, and predictive modelling.'},{id:'risk',name:'Conversational risk analysis',type:'Published research',description:'Co-authored Springer chapter on text and audio classification.'},{id:'govnav',name:'GovNav',type:'GovHack team prototype',description:'AI-assisted government service navigation.'},{id:'sensors',name:'ARBD1: board to dashboard',type:'Firmware & Python',description:'Educational electronics, a hardware-control library, and monitoring GUI.'}];
  const projectMeta={
    edtuned:{category:'ai',style:'learning',mark:'edTuned',caption:'Learning agents / capstone'},
    hermes:{category:'hardware',image:'assets/media/hermes-watcher-working.webp',caption:'AI meets a physical display'},
    oulad:{category:'ai',style:'data',mark:'OULAD',caption:'Learning analytics / data workflows'},
    risk:{category:'ai',style:'research',mark:'Text + audio',caption:'Published research / Springer'},
    govnav:{category:'ai',style:'navigation',mark:'GovNav',caption:'GovHack / team prototype'},
    sensors:{category:'hardware',image:'assets/media/arbd1-board-interface.webp',caption:'Firmware / Python / monitoring'}
  };
  const windows=new Map();let order=20,active=null,toastTimer,menuOpen=false,routing=false;
  const dockButtons=new Map(),pinned=new Set(['profile','projects','experience','cv','contact','assistants']);
  const iconAsset=id=>'assets/desktop-glyphs.svg#'+(id==='help'?'assistants':id);
  function appImage(id){const image=document.createElement('img');image.src=iconAsset(id);image.alt='';image.draggable=false;image.width=128;image.height=128;return image;}
  function dockItem(id){
    if(dockButtons.has(id))return dockButtons.get(id);
    const app=apps[id],button=document.createElement('button');
    button.type='button';button.className='task-app';button.dataset.app=id;
    button.setAttribute('aria-label','Show '+app.name);button.setAttribute('aria-pressed','false');
    const icon=document.createElement('span');icon.setAttribute('aria-hidden','true');icon.append(appImage(id));
    const label=document.createElement('span');label.textContent=app.name;button.append(icon,label);
    button.addEventListener('click',()=>{const state=windows.get(id);if(state&&!state.element.hidden&&active===id&&!state.minimising)minimise(id);else open(id);});
    taskApps.append(button);dockButtons.set(id,button);return button;
  }
  document.querySelectorAll('.start-app-list [data-open-app]').forEach(button=>button.querySelector('span').replaceChildren(appImage(button.dataset.openApp)));
  pinned.forEach(dockItem);
  const menu=document.querySelector('#desktop-start-menu'),search=document.querySelector('#desktop-search');
  const motionQuery=matchMedia('(prefers-reduced-motion: reduce)');let paused=motionQuery.matches;
  try{if(localStorage.getItem('shashi-motion')==='off')paused=true;}catch{}
  function applyMotion(){document.documentElement.classList.toggle('motion-off',paused);const b=document.querySelector('#desktop-motion');b.textContent=paused?'Motion off':'Motion on';b.setAttribute('aria-pressed',String(paused));window.portfolioMotion={paused};document.dispatchEvent(new CustomEvent('portfolio:motion',{detail:{paused}}));windows.forEach(win=>{const frame=win.element.querySelector('iframe');frame?.contentWindow?.postMessage({type:'portfolio:motion',paused},location.origin);});}
  applyMotion();document.querySelector('#desktop-motion').addEventListener('click',()=>{paused=!paused;try{localStorage.setItem('shashi-motion',paused?'off':'on');}catch{}applyMotion();});motionQuery.addEventListener('change',e=>{paused=e.matches;applyMotion();});
  function selectWallpaper(choice,save=false){
    if(!['studio','pacific','eclipse','alpine','slate'].includes(choice))choice='studio';
    document.body.dataset.wallpaper=choice;
    document.querySelectorAll('[data-wallpaper-choice]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.wallpaperChoice===choice)));
    if(save)try{localStorage.setItem('shashi-wallpaper',choice);}catch{}
    document.dispatchEvent(new CustomEvent('portfolio:wallpaper',{detail:{choice}}));
  }
  // Show this requested edition once to returning visitors; then honour their choice.
  let savedWallpaper='studio';
  try{
    if(localStorage.getItem('shashi-wallpaper-edition')==='studio-v1')savedWallpaper=localStorage.getItem('shashi-wallpaper')||'studio';
    else{localStorage.setItem('shashi-wallpaper-edition','studio-v1');localStorage.setItem('shashi-wallpaper','studio');}
  }catch{}
  selectWallpaper(savedWallpaper);
  document.querySelectorAll('[data-wallpaper-choice]').forEach(button=>button.addEventListener('click',()=>{
    selectWallpaper(button.dataset.wallpaperChoice,true);
    const names={studio:'Studio',pacific:'Pacific',eclipse:'Eclipse Bay',alpine:'Alpine Lake',slate:'Plain Slate'};
    toast(names[button.dataset.wallpaperChoice]+' wallpaper selected.');
  }));
  taskApps.addEventListener('pointermove',event=>{
    if(paused||event.pointerType==='touch'||!matchMedia('(hover: hover) and (pointer: fine)').matches)return;
    dockButtons.forEach(button=>{const box=button.getBoundingClientRect(),distance=Math.abs(event.clientX-box.x-box.width/2);button.style.setProperty('--dock-near',Math.max(0,1-distance/100).toFixed(3));});
  },{passive:true});
  taskApps.addEventListener('pointerleave',()=>dockButtons.forEach(button=>button.style.setProperty('--dock-near','0')));
  function launchMotion(id){
    if(paused||motionQuery.matches)return;
    const button=dockButtons.get(id);button.classList.remove('launching');
    void button.offsetWidth;button.classList.add('launching');
    clearTimeout(button.launchTimer);button.launchTimer=setTimeout(()=>button.classList.remove('launching'),750);
  }
  document.querySelector('#film-desktop').addEventListener('pointermove',event=>{if(paused||event.pointerType==='touch'||!matchMedia('(hover: hover) and (pointer: fine)').matches)return;document.body.style.setProperty('--wallpaper-x',Math.max(-1,Math.min(1,event.clientX/innerWidth*2-1)).toFixed(3));document.body.style.setProperty('--wallpaper-y',Math.max(-1,Math.min(1,event.clientY/innerHeight*2-1)).toFixed(3));},{passive:true});
  document.querySelector('#film-desktop').addEventListener('pointerleave',()=>{document.body.style.setProperty('--wallpaper-x','0');document.body.style.setProperty('--wallpaper-y','0');});
  function toast(text){const el=document.querySelector('#desktop-toast');el.textContent=text;el.classList.add('shown');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('shown'),3600);}
  function bounds(){return {w:surface.clientWidth,h:surface.clientHeight};}
  function activate(id){const state=windows.get(id);if(!state)return;state.minimising?.cancel();state.minimising=null;if(state.element.hidden){state.element.style.animation='';state.element.classList.remove('restoring');void state.element.offsetWidth;state.element.classList.add('restoring');clearTimeout(state.restoreTimer);state.restoreTimer=setTimeout(()=>state.element.classList.remove('restoring'),350);}state.element.hidden=false;state.minimised=false;if(order>400){let next=20;[...windows.values()].sort((a,b)=>(+a.element.style.zIndex)-(+b.element.style.zIndex)).forEach(w=>w.element.style.zIndex=++next);order=next;}
    active=id;state.element.style.zIndex=String(++order);windows.forEach((win,key)=>{win.element.classList.toggle('active',key===id);win.task.setAttribute('aria-pressed',String(key===id&&!win.element.hidden));win.task.classList.toggle('minimised',win.element.hidden);});document.querySelector('#desktop-active-name').textContent=state.title||apps[id].name;
  }
  function setRect(state,x,y,w,h){const b=bounds();w=Math.max(Math.min(360,b.w),Math.min(w,b.w));h=Math.max(Math.min(230,b.h),Math.min(h,b.h));x=Math.max(0,Math.min(x,b.w-w));y=Math.max(0,Math.min(y,b.h-h));Object.assign(state.element.style,{left:x+'px',top:y+'px',width:w+'px',height:h+'px'});}
  function focusNext(){const next=[...windows.entries()].filter(([,win])=>!win.element.hidden).sort((a,b)=>(+b[1].element.style.zIndex)-(+a[1].element.style.zIndex))[0];if(next)activate(next[0]);else{active=null;document.querySelector('#desktop-active-name').textContent='Portfolio';}}
  function minimise(id){
    const win=windows.get(id);if(!win||win.minimising)return;
    const hide=()=>{win.minimising=null;win.element.hidden=true;win.minimised=true;win.task.classList.add('minimised');win.task.setAttribute('aria-pressed','false');focusNext();win.task.focus();};
    if(paused||motionQuery.matches||innerWidth<=700||typeof win.element.animate!=='function'){hide();return;}
    const box=win.element.getBoundingClientRect(),dock=win.task.getBoundingClientRect();
    const dx=dock.x+dock.width/2-box.x-box.width/2,dy=dock.y+dock.height/2-box.y-box.height;
    const animation=win.element.animate([{transform:'translate(0,0) scale(1)',opacity:1},{transform:`translate(${dx}px,${dy}px) scale(.08)`,opacity:0}],{duration:240,easing:'cubic-bezier(.4,0,.8,.4)'});
    win.minimising=animation;animation.finished.then(()=>{if(win.minimising===animation)hide();}).catch(()=>{});
  }
  function close(id){const win=windows.get(id);if(!win)return;win.minimising?.cancel();win.minimising=null;if(id==='assistants'){minimise(id);return;}win.element.remove();if(pinned.has(id)){win.task.classList.remove('running','minimised');win.task.setAttribute('aria-pressed','false');}else{win.task.remove();dockButtons.delete(id);}windows.delete(id);focusNext();}
  function maximise(id){const win=windows.get(id);if(!win)return;if(win.maximised){win.maximised=false;win.element.classList.remove('maximised');const r=win.previous;setRect(win,r.x,r.y,r.w,r.h);}else{win.previous={x:parseFloat(win.element.style.left),y:parseFloat(win.element.style.top),w:win.element.offsetWidth,h:win.element.offsetHeight};win.maximised=true;win.element.classList.add('maximised');const b=bounds();setRect(win,0,0,b.w,b.h);}win.element.querySelector('[data-window-action="maximise"]').setAttribute('aria-label',win.maximised?'Restore window':'Maximise window');activate(id);}
  function routeFor(id,path=''){
    const match=path.match(/(?:^|\/)projects\/([a-z]+)\.html/);
    return id==='projects'&&match?'projects/'+match[1]:id;
  }
  function setRoute(route){
    if(routing)return;
    const next=route?'#'+route:'';
    if(location.hash!==next)history.pushState(null,'',location.pathname+location.search+next);
  }
  function openProject(id){if(!projects.some(project=>project.id===id))return;open('projects',true);documentView('projects','projects/'+id+'.html');}
  function documentView(id,path){
    const win=windows.get(id);if(win.path===path&&win.body.querySelector('iframe'))return;
    win.path=path;win.route=routeFor(id,path);
    const project=projects.find(project=>win.route==='projects/'+project.id);
    win.title=project?.name||apps[id].name;win.element.querySelector('.window-title').textContent=win.title;
    if(active===id)document.querySelector('#desktop-active-name').textContent=win.title;
    if(win.ready)setRoute(win.route);
    win.body.replaceChildren();
    const toolbar=document.createElement('div');toolbar.className='document-toolbar';
    const back=document.createElement('button');back.type='button';back.textContent='←';back.setAttribute('aria-label',id==='projects'?'Back to all projects':'Back in document');back.title=back.getAttribute('aria-label');
    const title=document.createElement('span');title.textContent=project?'Projects / '+project.name:win.title;
    const direct=document.createElement('a');direct.href=path;direct.target='_blank';direct.rel='noopener';direct.className='document-external';direct.textContent='Open page ↗';direct.setAttribute('aria-label','Open '+win.title+' in a new tab');
    const share=document.createElement('button');share.type='button';share.className='document-share';share.textContent='Copy link';
    share.addEventListener('click',async()=>{const url=new URL(location.href);url.hash=win.route;try{await navigator.clipboard.writeText(url.href);toast('Link copied to '+win.title+'.');}catch{toast('To share this page, open it in a new tab and copy its address.');}});
    toolbar.append(back,title,direct,share);
    const frame=document.createElement('iframe'),url=new URL(path,location.href);url.searchParams.set('desktop','1');frame.src=url.href;frame.title=win.title+' document';
    frame.addEventListener('load',()=>{try{const current=new URL(frame.contentWindow.location.href);if(id!=='projects')back.disabled=current.pathname===new URL(path,location.href).pathname;frame.contentWindow.postMessage({type:'portfolio:motion',paused},location.origin);}catch{}});
    back.addEventListener('click',()=>{if(id==='projects')projectBrowser(win);else frame.contentWindow.history.back();});
    win.body.style.display='flex';win.body.style.flexDirection='column';frame.style.flex='1';frame.style.minHeight='0';win.body.append(toolbar,frame);
  }
  function projectBrowser(win){
    win.path='';win.route='projects';win.title='Projects';win.element.querySelector('.window-title').textContent='Projects';if(win.ready)setRoute('projects');
    win.body.style.display='';win.body.replaceChildren();
    const browser=document.createElement('div');browser.className='file-browser project-library';
    browser.innerHTML='<div class="file-address"><span>▰</span> Portfolio <span>›</span> Projects</div><div class="file-browser-main"><nav class="file-sidebar" aria-label="Workspace folders"><p>LIBRARY</p><button type="button" data-open-app="profile">About me</button><button type="button" class="active" data-open-app="projects">Projects</button><button type="button" data-open-app="experience">Experience</button><button type="button" data-open-app="coursework">Coursework</button><button type="button" data-open-app="playground">Playground</button><button type="button" data-open-app="cv">My CV</button></nav><div class="project-library-content"><header class="project-library-heading"><div><h2>Projects</h2></div><div class="project-view-switch" role="group" aria-label="Project view"><button type="button" data-project-view="grid" aria-pressed="true" aria-label="Grid view" title="Grid view">▦</button><button type="button" data-project-view="list" aria-pressed="false" aria-label="List view" title="List view">☷</button></div></header><label class="project-find"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="8" cy="8" r="5"/><path d="m12 12 5 5"/></svg><input type="search" aria-label="Search projects" placeholder="Search projects, tools or topics…"></label><div class="project-filter-bar"><div class="project-category-filters" role="group" aria-label="Project category"><button type="button" data-project-category="all" aria-pressed="true">All projects</button><button type="button" data-project-category="ai" aria-pressed="false">AI &amp; data</button><button type="button" data-project-category="hardware" aria-pressed="false">Hardware</button></div><p class="project-result-count" role="status" aria-live="polite"></p></div><div class="project-tiles"></div><div class="project-empty" hidden><h3>No projects found.</h3><p>Try a different topic, or reset the filters.</p><button type="button">Show all projects</button></div></div></div>';
    const tiles=browser.querySelector('.project-tiles'),find=browser.querySelector('input'),empty=browser.querySelector('.project-empty');let category='all',view='grid';
    try{if(localStorage.getItem('shashi-project-view')==='list')view='list';}catch{}
    function setView(next){view=next;tiles.dataset.view=view;browser.querySelectorAll('[data-project-view]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.projectView===view)));try{localStorage.setItem('shashi-project-view',view);}catch{}}
    function render(){
      const query=find.value.trim().toLowerCase();tiles.replaceChildren();
      const hits=projects.filter(project=>(category==='all'||projectMeta[project.id].category===category)&&[project.name,project.type,project.description,projectMeta[project.id].caption].join(' ').toLowerCase().includes(query));
      browser.querySelector('.project-result-count').textContent=hits.length+' project'+(hits.length===1?'':'s');empty.hidden=hits.length>0;
      hits.forEach(project=>{
        const meta=projectMeta[project.id],tile=document.createElement('a');tile.href='projects/'+project.id+'.html';tile.className='project-tile';tile.dataset.openProject=project.id;
        const art=document.createElement('span');art.className='project-tile-art '+(meta.style||'photo');art.setAttribute('aria-hidden','true');
        if(meta.image){const image=document.createElement('img');image.src=meta.image;image.alt='';image.loading='lazy';art.append(image);}else{const mark=document.createElement('strong');mark.textContent=meta.mark;art.append(mark);const detail=document.createElement('span');detail.textContent=meta.caption;art.append(detail);}
        const copy=document.createElement('span');copy.className='project-tile-copy';const label=document.createElement('small');label.textContent=project.type;const name=document.createElement('strong');name.textContent=project.name;const desc=document.createElement('span');desc.textContent=project.description;const link=document.createElement('b');link.textContent='View project ↗';copy.append(label,name,desc,link);tile.append(art,copy);tiles.append(tile);
      });
    }
    find.addEventListener('input',render);
    browser.querySelectorAll('[data-project-category]').forEach(button=>button.addEventListener('click',()=>{category=button.dataset.projectCategory;browser.querySelectorAll('[data-project-category]').forEach(other=>other.setAttribute('aria-pressed',String(other===button)));render();}));
    browser.querySelectorAll('[data-project-view]').forEach(button=>button.addEventListener('click',()=>setView(button.dataset.projectView)));
    empty.querySelector('button').addEventListener('click',()=>{category='all';find.value='';browser.querySelector('[data-project-category="all"]').click();find.focus();});
    setView(view);render();win.body.append(browser);
  }
  function terminal(win){win.body.innerHTML='<div class="terminal-app"><pre class="terminal-output" tabindex="0" aria-label="Terminal output"></pre><form class="terminal-input-row"><label for="terminal-command">shashi@workspace:~ $</label><input id="terminal-command" autocomplete="off" spellcheck="false" aria-label="Terminal command"></form></div>';const out=win.body.querySelector('.terminal-output'),input=win.body.querySelector('input'),history=[];let cursor=0;const intro='SHASHI / WORKSPACE\nPortfolio terminal. Type help for commands.\n\n';out.textContent=intro;const answers={help:'Commands\n  whoami       Background and focus\n  education    Degrees and academic recognition\n  projects     Project folders\n  research     Published and ongoing research\n  skills       Tools and technical strengths\n  experience   Roles and teaching\n  contact      Email and professional links\n  ls           List desktop applications\n  open <app>   Open an application\n  clear        Clear this terminal',whoami:'Shashikant Chaudhary\nAI, mathematics, research, teaching, and connected hardware.\nTwo master’s degrees, a computer science foundation, and a practical approach to making ideas useful.',education:'Master of AI & ML · University of Adelaide · December 2025\nCGPA 6.923/7 · Dean’s Recognition\nMaster of Mathematics & Computing · Thapar · August 2023\nB.Tech Computer Science & Engineering · BML Munjal · July 2020',projects:projects.map(p=>p.name+' — '+p.type).join('\n'),research:'Conversational risk analysis: co-authored Springer chapter, published 1 October 2025.\nOULAD: student success analysis; manuscript in preparation.\nedTuned: LLM-based personalised learning capstone and startup exploration.',skills:'Python · pandas · NumPy · SciPy · scikit-learn\nPyTorch · TensorFlow · Git · Jupyter\nMathematics · Statistics · Optimisation\nFirmware · MQTT · Python hardware control\nTeaching · Clear communication · Careful data workflows',experience:'Casual Academic · from July 2025\nMathematical AI evaluation · Outlier AI · from 2024\nStudent Assist, Peer Connect, admissions and university operations · 2024–2026\nTechnical internship · Hatchnhack · January–April 2020\nUse: open experience',contact:'Email: mailshashi122@gmail.com\nGitHub: github.com/chaudharysk\nLinkedIn: linkedin.com/in/chaudharysk\nUse: open contact',ls:Object.keys(apps).join('  ')};
    win.body.querySelector('form').addEventListener('submit',e=>{e.preventDefault();const original=input.value.trim();if(!original)return;history.push(original);cursor=history.length;input.value='';const cmd=original.toLowerCase().replace(/\s+/g,' ');if(cmd==='clear'){out.textContent='';return;}let result=answers[cmd];if(cmd.startsWith('open ')){const id=cmd.slice(5);if(apps[id]){open(id);result='Opened '+apps[id].name+'.';}else result='Unknown application. Type ls to see application names.';}if(cmd==='cat about.txt')result=answers.whoami;if(!result)result='Unknown command. Type help to see available commands.';out.textContent+='\n$ '+original+'\n'+result+'\n';out.scrollTop=out.scrollHeight;});input.addEventListener('keydown',e=>{if(e.key==='ArrowUp'){e.preventDefault();cursor=Math.max(0,cursor-1);input.value=history[cursor]||'';}if(e.key==='ArrowDown'){e.preventDefault();cursor=Math.min(history.length,cursor+1);input.value=history[cursor]||'';}});
  }
  function create(id){const app=apps[id],b=bounds();const el=document.createElement('section');el.className='desktop-window';el.dataset.app=id;el.setAttribute('aria-label',app.name+' window');el.setAttribute('role','region');el.innerHTML='<div class="window-titlebar"><button type="button" class="mobile-window-home" aria-label="Back to desktop">← Desktop</button><span class="window-title-icon" aria-hidden="true"></span><span class="window-title"></span><div class="window-controls"><button type="button" data-window-action="minimise" aria-label="Minimise window">−</button><button type="button" data-window-action="maximise" aria-label="Maximise window">□</button><button type="button" data-window-action="close" aria-label="Close window">×</button></div></div><div class="window-body"></div><div class="window-resize" tabindex="0" role="button" aria-label="Resize window with arrow keys"></div>';el.querySelector('.window-title-icon').append(appImage(id));el.querySelector('.window-title').textContent=app.name;const task=dockItem(id);task.classList.add('running');layer.append(el);const win={element:el,body:el.querySelector('.window-body'),task,maximised:false};windows.set(id,win);
    const w=id==='assistants'?Math.min(385,b.w):id==='terminal'?Math.min(690,b.w-150):Math.min(850,b.w-190),h=id==='assistants'?Math.min(680,b.h-55):id==='terminal'?Math.min(470,b.h-70):Math.min(730,b.h-50);const x=id==='assistants'?b.w-w-25:Math.max(0,(b.w-w)/2)+(windows.size%3)*9,y=id==='assistants'?41:29+(windows.size%3)*13;setRect(win,x,y,w,h);
    el.addEventListener('pointerdown',()=>activate(id),{capture:true});el.querySelectorAll('[data-window-action]').forEach(button=>button.addEventListener('click',()=>({minimise,maximise,close}[button.dataset.windowAction])(id)));const bar=el.querySelector('.window-titlebar');bar.tabIndex=-1;el.querySelector('.mobile-window-home').addEventListener('click',()=>showDesktop());bar.addEventListener('dblclick',event=>{if(!event.target.closest('button'))maximise(id);});
    function drag(handle,isResize){handle.addEventListener('pointerdown',event=>{if(event.button!==0||event.target.closest('button')||innerWidth<=700)return;if(win.maximised&&!isResize)return;event.preventDefault();activate(id);const sx=event.clientX,sy=event.clientY,r={x:parseFloat(el.style.left),y:parseFloat(el.style.top),w:el.offsetWidth,h:el.offsetHeight};handle.setPointerCapture(event.pointerId);el.style.animation='none';el.classList.add('dragging');const move=e=>setRect(win,isResize?r.x:r.x+e.clientX-sx,isResize?r.y:r.y+e.clientY-sy,isResize?r.w+e.clientX-sx:r.w,isResize?r.h+e.clientY-sy:r.h);const end=()=>{el.classList.remove('dragging');handle.removeEventListener('pointermove',move);handle.removeEventListener('pointerup',end);handle.removeEventListener('pointercancel',end);};handle.addEventListener('pointermove',move);handle.addEventListener('pointerup',end);handle.addEventListener('pointercancel',end);});}drag(bar,false);const resize=el.querySelector('.window-resize');drag(resize,true);resize.addEventListener('keydown',event=>{const changes={ArrowLeft:[-20,0],ArrowRight:[20,0],ArrowUp:[0,-20],ArrowDown:[0,20]};if(!changes[event.key])return;event.preventDefault();const [dx,dy]=changes[event.key];setRect(win,parseFloat(el.style.left),parseFloat(el.style.top),el.offsetWidth+dx,el.offsetHeight+dy);});
    if(app.doc)documentView(id,app.doc);else if(id==='projects')projectBrowser(win);else if(id==='assistants')win.body.append(document.querySelector('#desktop-assistant-content').content.cloneNode(true));else if(id==='terminal')terminal(win);else if(id==='contact')win.body.innerHTML='<div class="contact-app"><h2>Let’s talk.</h2><p>For opportunities, collaboration, or a good technical question, these are the places to find me.</p><a href="mailto:mailshashi122@gmail.com">mailshashi122@gmail.com ↗</a><a href="https://www.linkedin.com/in/chaudharysk" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a><a href="https://github.com/chaudharysk" target="_blank" rel="noopener noreferrer">GitHub ↗</a><p>Shashikant Chaudhary<br>AI · Mathematics · Research · Teaching</p></div>';else if(id==='help')win.body.innerHTML='<div class="help-app"><h2>Your workspace, your way.</h2><p>This desktop is a way to explore Shashi’s actual work and background.</p><ul><li>Open applications from the desktop or system menu.</li><li>Drag a title bar to move a window. Drag its bottom-right corner to resize.</li><li>Use the title-bar buttons to minimise, maximise, restore, or close.</li><li>Restore an app from the taskbar. The grid button shows the desktop.</li><li>Search the menu for a project or app. Type help in Terminal for commands.</li><li>JARVIS, FRIDAY, and EDITH answer from portfolio information and include source links.</li><li>Right-click the desktop, an app icon, a project, or a title bar for contextual actions. Shift+F10 opens the menu from the keyboard. Choose Animation for Cinematic or Calm wallpaper motion. Use Motion off to stop decorative movement. On a phone, apps open one at a time.</li></ul><p><a href="about.html" target="_blank" rel="noopener">Prefer the regular profile page? Open it here ↗</a></p></div>';
    return win;
  }
  function open(id,silent=false){
    if(!apps[id])return;setMenu(false);if(!windows.has(id))create(id);const win=windows.get(id);win.ready=true;activate(id);launchMotion(id);if(!silent)setRoute(win.route||id);
    if(id==='terminal')win.body.querySelector('input').focus();else win.element.querySelector('.window-titlebar').focus({preventScroll:true});return win;
  }
  function setMenu(value){
    menuOpen=value;document.querySelector('#desktop-start').setAttribute('aria-expanded',String(value));
    if(value){if(!menu.open)menu.showModal();search.focus();}else if(menu.open)menu.close();
  }
  menu.addEventListener('close',()=>{menuOpen=false;document.querySelector('#desktop-start').setAttribute('aria-expanded','false');});
  menu.addEventListener('click',event=>{if(event.target!==menu)return;const box=menu.getBoundingClientRect();if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)setMenu(false);});
  document.addEventListener('click',event=>{
    if(event.target.closest('a')&&(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey))return;
    const projectLink=event.target.closest('[data-open-project]');if(projectLink){event.preventDefault();openProject(projectLink.dataset.openProject);return;}
    const opener=event.target.closest('[data-open-app]');if(opener){event.preventDefault();open(opener.dataset.openApp);}
  });
  document.querySelector('#desktop-start').addEventListener('click',()=>setMenu(!menuOpen));document.querySelector('#desktop-close-menu').addEventListener('click',()=>setMenu(false));document.querySelector('#desktop-quick-find').addEventListener('click',()=>setMenu(true));document.querySelector('#desktop-help').addEventListener('click',()=>open('help'));
  function showDesktop(update=true){windows.forEach(win=>{win.minimising?.cancel();win.minimising=null;win.element.hidden=true;win.task.classList.add('minimised');win.task.setAttribute('aria-pressed','false');});active=null;document.querySelector('#desktop-active-name').textContent='Portfolio';if(update)setRoute('');}
  document.querySelector('#desktop-show-all').addEventListener('click',()=>showDesktop());
  search.addEventListener('input',()=>{
    const value=search.value.trim().toLowerCase(),results=document.querySelector('#desktop-search-results'),list=document.querySelector('#start-app-list'),count=document.querySelector('#desktop-search-count');
    list.hidden=!!value;results.hidden=!value;count.hidden=!value;results.replaceChildren();if(!value)return;
    const hits=[...Object.entries(apps).filter(([id,app])=>(id+' '+app.name).toLowerCase().includes(value)).map(([id,app])=>({name:app.name,kind:'Application',icon:id,action:()=>open(id)})),...projects.filter(project=>(project.name+' '+project.id+' '+project.type+' '+project.description).toLowerCase().includes(value)).map(project=>({name:project.name,kind:project.type,icon:'projects',action:()=>openProject(project.id)}))];
    count.textContent=hits.length+' result'+(hits.length===1?'':'s');
    hits.forEach(hit=>{const button=document.createElement('button');button.type='button';const icon=document.createElement('span');icon.setAttribute('aria-hidden','true');icon.append(appImage(hit.icon));const copy=document.createElement('span'),name=document.createElement('strong'),kind=document.createElement('small');name.textContent=hit.name;kind.textContent=hit.kind;copy.append(name,kind);button.append(icon,copy);button.addEventListener('click',hit.action);results.append(button);});
    if(!hits.length){const p=document.createElement('p');p.textContent='No matches yet. Try “Hermes”, “research” or “coursework”.';results.append(p);}
  });
  search.addEventListener('keydown',event=>{if(event.key==='ArrowDown'||event.key==='Enter'){const target=document.querySelector('#desktop-search-results:not([hidden]) button')||document.querySelector('#start-app-list:not([hidden]) button');if(target){event.preventDefault();if(event.key==='Enter')target.click();else target.focus();}}});
  menu.addEventListener('keydown',event=>{if(!['ArrowDown','ArrowUp'].includes(event.key)||event.target===search)return;const buttons=[...menu.querySelectorAll('#desktop-search-results:not([hidden]) button,#start-app-list:not([hidden]) button')],index=buttons.indexOf(document.activeElement);if(index<0)return;event.preventDefault();const next=index+(event.key==='ArrowDown'?1:-1);if(next<0)search.focus();else buttons[Math.min(next,buttons.length-1)].focus();});
  document.addEventListener('keydown',event=>{if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='k'){event.preventDefault();setMenu(!menuOpen);}if(event.key==='Escape'&&menuOpen)setMenu(false);if(event.altKey&&event.key.toLowerCase()==='m'&&active){event.preventDefault();minimise(active);}});
  document.querySelector('#desktop-fullscreen').addEventListener('click',async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{toast('Fullscreen is unavailable in this browser.');}});document.addEventListener('fullscreenchange',()=>{document.querySelector('#desktop-fullscreen').setAttribute('aria-label',document.fullscreenElement?'Exit fullscreen':'Enter fullscreen');});
  function clock(){const now=new Date();document.querySelector('#desktop-clock').textContent=new Intl.DateTimeFormat('en-AU',{timeZone:'Australia/Adelaide',weekday:'short',day:'numeric',month:'short'}).format(now)+'  '+new Intl.DateTimeFormat('en-AU',{timeZone:'Australia/Adelaide',hour:'2-digit',minute:'2-digit'}).format(now);document.querySelector('#desktop-clock').dateTime=now.toISOString();}clock();setInterval(clock,30000);
  document.querySelectorAll('[data-menu-action]').forEach(button=>button.addEventListener('click',()=>{if(button.dataset.menuAction==='apps')setMenu(!menuOpen);else showDesktop();}));

  addEventListener('resize',()=>{const b=bounds();windows.forEach(win=>{if(win.maximised)setRect(win,0,0,b.w,b.h);else setRect(win,parseFloat(win.element.style.left),parseFloat(win.element.style.top),win.element.offsetWidth,win.element.offsetHeight);});});
  addEventListener('desktop:open',event=>open(event.detail.app));addEventListener('desktop:close',event=>close(event.detail.app));
  addEventListener('desktop:navigate',event=>{const url=new URL(event.detail.href,location.href);if(url.origin!==location.origin)return;const path=url.pathname.split('/').pop();const id={'about.html':'profile','experience.html':'experience','coursework.html':'coursework','playground.html':'playground','cv.html':'cv'}[path];if(url.pathname.includes('/projects/')&&projects.some(p=>path===p.id+'.html')){open('projects');documentView('projects','projects/'+path+url.search+url.hash);}else if(path==='projects.html')open('projects');else if(id){open(id);documentView(id,path+url.search+url.hash);}});
  // Mount the assistant once so its conversation can survive minimise/restore.
  create('assistants');windows.get('assistants').element.hidden=true;windows.get('assistants').task.classList.add('minimised');
  function syncRoute(){
    routing=true;
    try{
      const hash=location.hash.slice(1),aliases={work:'projects',about:'profile',journey:'experience',bench:'playground',research:'profile','home-coursework':'coursework','home-experience':'experience','home-projects':'projects','project-hermes':'projects/hermes'};
      const route=aliases[hash]||hash;
      if(!route){showDesktop(false);return;}
      const [id,projectId]=route.split('/');
      if(id==='projects'&&projectId){if(projects.some(project=>project.id===projectId))openProject(projectId);return;}
      if(apps[id]){open(id,true);if(id==='projects')projectBrowser(windows.get(id));}
    }finally{routing=false;}
  }
  addEventListener('popstate',syncRoute);addEventListener('hashchange',syncRoute);addEventListener('DOMContentLoaded',syncRoute);
})();
