'use strict';

// Menus expose real workspace actions. Ordinary document, text and link menus stay native.
(() => {
  const desktop=document.querySelector('#film-desktop');
  if(!desktop)return;
  const names={profile:'About me',projects:'Projects',experience:'Experience',coursework:'Coursework',playground:'Playground',assistants:'Assistants',terminal:'Terminal',cv:'My CV',contact:'Contact',help:'Desktop controls'};
  const pages={profile:'about.html',projects:'projects.html',experience:'experience.html',coursework:'coursework.html',playground:'playground.html',cv:'cv.html'};
  const icons={
    open:'M3 8h7l2 2h9v10H3Z M3 8V5h7l2 3',
    page:'M5 3h9l5 5v13H5Z M14 3v6h5',
    search:'M10 17a7 7 0 1 0 0-14 7 7 0 0 0 0 14 M15 15l6 6',
    desktop:'M3 4h18v13H3Z M8 21h8 M12 17v4',
    wallpaper:'M3 4h18v16H3Z M4 17l6-7 4 4 3-3 4 5',
    motion:'M3 8c4-6 7 6 11 0s7 0 7 0 M3 16c4-6 7 6 11 0s7 0 7 0',
    minimise:'M5 12h14',
    zoom:'M4 4h16v16H4Z',
    close:'M6 6l12 12 M18 6 6 18',
    link:'M10 8l3-3a4 4 0 0 1 6 6l-3 3 M14 16l-3 3a4 4 0 0 1-6-6l3-3 M8 16l8-8',
    help:'M12 17h.01 M9 8a3 3 0 0 1 6 0c0 2-3 2-3 5'
  };
  let rootMenu=null,subMenu=null,invoker=null,submenuOwner=null,hoverTimer=0;
  let intensity='cinematic';
  try{if(localStorage.getItem('shashi-scene-motion')==='calm')intensity='calm';}catch{}
  window.portfolioScene={intensity};
  const trigger=document.querySelector('#desktop-scene-control');
  const isPaused=()=>!!window.portfolioMotion?.paused;
  const isLive=()=>document.body.dataset.wallpaper==='alpine'&&!isPaused()&&!matchMedia('(prefers-reduced-motion: reduce)').matches;
  function updateControl(){
    const live=isLive();
    trigger.querySelector('strong').textContent=live?'Live wallpaper':'Wallpaper';
    trigger.querySelector('small').textContent=live?(intensity==='cinematic'?'Cinematic motion':'Calm motion'):(isPaused()?'Motion paused':'Desktop options');
  }
  function sceneMode(value){
    intensity=value;window.portfolioScene={intensity};
    try{localStorage.setItem('shashi-scene-motion',value);}catch{}
    document.dispatchEvent(new CustomEvent('portfolio:scene',{detail:{intensity}}));updateControl();
  }
  function showToast(value){
    const toast=document.querySelector('#desktop-toast');toast.textContent=value;toast.classList.add('shown');
    clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>toast.classList.remove('shown'),3000);
  }
  const separator=()=>({separator:true});
  const openApp=app=>dispatchEvent(new CustomEvent('desktop:open',{detail:{app}}));
  const windowFor=app=>document.querySelector('.desktop-window[data-app="'+app+'"]');
  const windowAction=(app,action)=>windowFor(app)?.querySelector('[data-window-action="'+action+'"]')?.click();
  function wallpaperItems(){
    return [
      {label:'Alpine Lake',radio:true,checked:document.body.dataset.wallpaper==='alpine',action:()=>document.querySelector('[data-wallpaper-choice="alpine"]').click()},
      {label:'Plain Slate',radio:true,checked:document.body.dataset.wallpaper==='slate',action:()=>document.querySelector('[data-wallpaper-choice="slate"]').click()}
    ];
  }
  function animationItems(){
    return [
      {label:'Cinematic',radio:true,checked:intensity==='cinematic',action:()=>sceneMode('cinematic')},
      {label:'Calm',radio:true,checked:intensity==='calm',action:()=>sceneMode('calm')},
      separator(),
      {label:'Pause all motion',checkbox:true,checked:isPaused(),action:()=>document.querySelector('#desktop-motion').click()}
    ];
  }
  function desktopItems(){
    return [
      {label:'Show Desktop',icon:'desktop',action:()=>document.querySelector('#desktop-show-all').click()},
      {label:'Explore Projects',icon:'open',action:()=>openApp('projects')},
      {label:'Search Portfolio',icon:'search',key:'Ctrl / ⌘ K',action:()=>document.querySelector('#desktop-search-button').click()},
      separator(),
      {label:'Wallpaper',icon:'wallpaper',children:wallpaperItems()},
      {label:'Animation',icon:'motion',children:animationItems()},
      separator(),
      {label:'Desktop Controls',icon:'help',action:()=>openApp('help')}
    ];
  }
  function appItems(app){
    const win=windowFor(app),visible=win&&!win.hidden;
    const result=[{label:visible?'Bring to Front':'Open',icon:'open',action:()=>openApp(app)}];
    if(pages[app])result.push({label:'Open Page in New Tab',icon:'page',action:()=>window.open(pages[app],'_blank','noopener')});
    if(visible)result.push(separator(),{label:'Minimise',icon:'minimise',action:()=>windowAction(app,'minimise')},{label:win.classList.contains('maximised')?'Restore Window':'Zoom',icon:'zoom',action:()=>windowAction(app,'maximise')});
    if(win)result.push(separator(),{label:'Close Window',icon:'close',action:()=>windowAction(app,'close')});
    return result;
  }
  function projectItems(link){
    const href=link.getAttribute('href');
    return [
      {label:'Open Project',icon:'open',action:()=>dispatchEvent(new CustomEvent('desktop:navigate',{detail:{href}}))},
      {label:'Open Page in New Tab',icon:'page',action:()=>window.open(href,'_blank','noopener')},
      separator(),
      {label:'Copy Project Link',icon:'link',action:async()=>{try{await navigator.clipboard.writeText(new URL(href,location.href).href);showToast('Project link copied.');}catch{showToast('Open the project page to copy its address.');}}}
    ];
  }
  function contextFor(target){
    if(!(target instanceof Element)||target.closest('dialog,input,textarea,select,[contenteditable="true"]'))return null;
    const project=target.closest('[data-open-project]');if(project)return {title:project.querySelector('strong')?.textContent||'Project',items:projectItems(project),element:project};
    const app=target.closest('.desktop-shortcuts>[data-open-app],.task-app');
    if(app){const id=app.dataset.openApp||app.dataset.app;return {title:names[id]||'Application',items:appItems(id),element:app};}
    const bar=target.closest('.window-titlebar');
    if(bar){const win=bar.closest('.desktop-window');return {title:win.querySelector('.window-title').textContent,items:appItems(win.dataset.app),element:bar};}
    if(target.closest('.desktop-window,.desktop-note,.featured-desk,.desktop-menubar,a,button'))return null;
    return target.closest('#film-desktop')?{title:'Shashi’s workspace',items:desktopItems(),element:desktop}:null;
  }
  function closeSubmenu(){
    clearTimeout(hoverTimer);subMenu?.remove();subMenu=null;
    submenuOwner?.setAttribute('aria-expanded','false');submenuOwner=null;
  }
  function dismiss(restore=false){
    closeSubmenu();rootMenu?.remove();rootMenu=null;trigger.setAttribute('aria-expanded','false');
    if(restore&&invoker?.isConnected)invoker.focus({preventScroll:true});
  }
  function clamp(menu,x,y){
    const gap=8,viewport=window.visualViewport;
    const left=viewport?.offsetLeft||0,top=viewport?.offsetTop||0,w=viewport?.width||innerWidth,h=viewport?.height||innerHeight;
    const box={width:menu.offsetWidth,height:menu.offsetHeight};
    menu.style.left=Math.round(Math.max(left+gap,Math.min(x,left+w-box.width-gap)))+'px';
    menu.style.top=Math.round(Math.max(top+gap,Math.min(y,top+h-box.height-gap)))+'px';
  }
  const itemsIn=menu=>[...menu.querySelectorAll('button:not(:disabled)')];
  function focusItem(menu,index){const list=itemsIn(menu);list[mod(index,list.length)]?.focus();}
  function mod(n,m){return ((n%m)+m)%m;}
  function revealSubmenu(button,items,focus=false){
    if(submenuOwner===button){if(focus)focusItem(subMenu,0);return;}
    closeSubmenu();submenuOwner=button;button.setAttribute('aria-expanded','true');
    subMenu=makeMenu(items,button.textContent.trim(),true);button.setAttribute('aria-controls',subMenu.id);
    const box=button.getBoundingClientRect(),menuBox={width:subMenu.offsetWidth,height:subMenu.offsetHeight};
    const x=box.right+7+menuBox.width>innerWidth-8?rootMenu.getBoundingClientRect().left-menuBox.width-5:box.right+7;
    clamp(subMenu,x,box.top-5);if(focus)focusItem(subMenu,0);
  }
  function makeMenu(items,title,isSub=false){
    const menu=document.createElement('div');menu.className='desktop-context';menu.id=isSub?'desktop-context-submenu':'desktop-context-menu';
    menu.setAttribute('role','menu');menu.setAttribute('aria-label',title);menu.setAttribute('popover','manual');
    if(!isSub){const caption=document.createElement('div');caption.className='context-caption';caption.textContent=title;caption.setAttribute('aria-hidden','true');menu.append(caption);}
    items.forEach(item=>{
      if(item.separator){const line=document.createElement('div');line.setAttribute('role','separator');menu.append(line);return;}
      const button=document.createElement('button');button.type='button';button.tabIndex=-1;
      button.setAttribute('role',item.radio?'menuitemradio':item.checkbox?'menuitemcheckbox':'menuitem');
      if(item.radio||item.checkbox)button.setAttribute('aria-checked',String(item.checked));
      const icon=document.createElement('span');icon.className='context-icon';icon.setAttribute('aria-hidden','true');
      if(item.radio||item.checkbox){icon.classList.add('context-check');icon.textContent=item.checked?'✓':'';}
      else if(item.icon)icon.innerHTML='<svg viewBox="0 0 24 24"><path d="'+icons[item.icon]+'"/></svg>';
      const label=document.createElement('span');label.className='context-label';label.textContent=item.label;button.append(icon,label);
      if(item.key){const key=document.createElement('span');key.className='context-key';key.textContent=item.key;key.setAttribute('aria-hidden','true');button.append(key);}
      if(item.children){
        button.setAttribute('aria-haspopup','menu');button.setAttribute('aria-expanded','false');
        const arrow=document.createElement('span');arrow.className='context-arrow';arrow.textContent='›';arrow.setAttribute('aria-hidden','true');button.append(arrow);
        button.addEventListener('pointerenter',()=>{clearTimeout(hoverTimer);hoverTimer=setTimeout(()=>revealSubmenu(button,item.children),100);});
        button.addEventListener('click',()=>revealSubmenu(button,item.children,true));
        button.addEventListener('keydown',event=>{if(event.key==='ArrowRight'){event.preventDefault();event.stopPropagation();revealSubmenu(button,item.children,true);}});
      }else{
        button.addEventListener('pointerenter',()=>{if(!isSub){clearTimeout(hoverTimer);hoverTimer=setTimeout(closeSubmenu,150);}});
        button.addEventListener('click',()=>{dismiss();item.action();});
      }
      button.addEventListener('pointermove',()=>{if(document.activeElement!==button)button.focus({preventScroll:true});});
      menu.append(button);
    });
    menu.addEventListener('keydown',event=>{
      const list=itemsIn(menu),index=list.indexOf(document.activeElement);
      if(['ArrowDown','ArrowUp','Home','End'].includes(event.key)){
        event.preventDefault();event.stopPropagation();
        focusItem(menu,event.key==='Home'?0:event.key==='End'?list.length-1:index+(event.key==='ArrowDown'?1:-1));
      }else if(event.key==='Escape'||(isSub&&event.key==='ArrowLeft')){
        event.preventDefault();event.stopPropagation();if(isSub){const owner=submenuOwner;closeSubmenu();owner?.focus();}else dismiss(true);
      }else if(event.key==='Tab'){dismiss(true);}
      else if(event.key.length===1&&!event.ctrlKey&&!event.metaKey&&!event.altKey){
        const match=[...list.slice(index+1),...list.slice(0,index+1)].find(b=>b.querySelector('.context-label').textContent.toLowerCase().startsWith(event.key.toLowerCase()));
        if(match){event.preventDefault();match.focus();}
      }
    });
    document.body.append(menu);
    if(typeof menu.showPopover==='function')menu.showPopover();else menu.classList.add('fallback-open');
    return menu;
  }
  function present(context,x,y){
    dismiss();invoker=context.element;rootMenu=makeMenu(context.items,context.title);clamp(rootMenu,x,y);
    trigger.setAttribute('aria-expanded','true');focusItem(rootMenu,0);
  }
  desktop.addEventListener('contextmenu',event=>{
    if(event.shiftKey)return; // Shift + right-click deliberately retains the browser menu.
    const context=contextFor(event.target);if(!context)return;
    event.preventDefault();present(context,event.clientX,event.clientY);
  });
  desktop.addEventListener('keydown',event=>{
    if(event.key!=='ContextMenu'&&!(event.shiftKey&&event.key==='F10'))return;
    const context=contextFor(event.target);if(!context)return;
    event.preventDefault();const box=context.element.getBoundingClientRect();present(context,box.x+Math.min(box.width/2,100),box.y+Math.min(box.height,70));
  });
  trigger.addEventListener('click',()=>{
    if(rootMenu){dismiss(true);return;}
    const box=trigger.getBoundingClientRect();present({title:'Wallpaper & desktop',items:desktopItems(),element:trigger},box.x,Math.max(45,box.y-290));
  });
  document.addEventListener('pointerdown',event=>{if(rootMenu&&!event.target.closest('.desktop-context,#desktop-scene-control'))dismiss();},true);
  addEventListener('resize',()=>dismiss());
  // Ignore delayed scroll events from bringing a project into view before right-click.
  // Direct scrolling outside the menu still dismisses it immediately.
  for(const type of ['wheel','touchmove'])document.addEventListener(type,event=>{if(rootMenu&&!event.target.closest?.('.desktop-context'))dismiss();},{capture:true,passive:true});
  addEventListener('blur',()=>dismiss());
  document.addEventListener('portfolio:motion',()=>{updateControl();dismiss();});
  document.addEventListener('portfolio:wallpaper',updateControl);
  updateControl();
})();

