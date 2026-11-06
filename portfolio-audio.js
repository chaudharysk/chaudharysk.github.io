'use strict';
(() => {
  const base=new URL('.',document.currentScript.src);
  const profiles={
    jarvis:{name:'JARVIS',delivery:'Calm British delivery',notes:[196,294,392]},
    friday:{name:'FRIDAY',delivery:'Warm conversational delivery',notes:[262,330,440]},
    edith:{name:'EDITH',delivery:'Clear American delivery',notes:[220,330,494]}
  };
  let prefs={volume:.55,sounds:false,auto:false,pace:1};
  try{const saved=JSON.parse(localStorage.getItem('shashi-audio')||'null');if(saved)prefs={volume:Math.max(0,Math.min(1,Number(saved.volume)||0)),sounds:!!saved.sounds,auto:!!saved.auto,pace:Math.max(.9,Math.min(1.1,Number(saved.pace)||1))};}catch{}
  const player=new Audio();player.preload='metadata';player.playsInline=true;
  let persona='jarvis',state='idle',version=0,context=null,master=null;
  const catalogPromise=fetch(new URL('assets/audio/neural/voice-manifest.json',base)).then(response=>response.ok?response.json():{}).catch(()=>({}));
  const save=()=>{try{localStorage.setItem('shashi-audio',JSON.stringify(prefs));}catch{}};
  function emit(next,message=''){state=next;document.documentElement.dataset.voiceState=next;document.documentElement.dataset.voicePersona=persona;document.dispatchEvent(new CustomEvent('portfolio:voice-state',{detail:{state,persona,message}}));render(message);}
  function stop(){version++;player.pause();player.removeAttribute('src');player.load();emit('idle');}
  async function unlock(){
    try{const Engine=window.AudioContext||window.webkitAudioContext;if(!Engine)return null;if(!context){context=new Engine();master=context.createGain();master.gain.value=prefs.volume*.12;master.connect(context.destination);}if(context.state==='suspended')await context.resume();return context;}catch{return null;}
  }
  async function cue(kind='open',id=persona){
    if(!prefs.sounds||!prefs.volume)return;
    const engine=await unlock();if(!engine||engine.state!=='running')return;
    const notes=profiles[id]?.notes||profiles.jarvis.notes;
    const sequence=kind==='reply'?notes.slice(1):kind==='close'?[notes[1],notes[0]]:notes;
    sequence.forEach((frequency,index)=>{const oscillator=engine.createOscillator(),gain=engine.createGain(),at=engine.currentTime+index*.052;oscillator.type='sine';oscillator.frequency.setValueAtTime(frequency,at);gain.gain.setValueAtTime(.0001,at);gain.gain.exponentialRampToValueAtTime(.65,at+.012);gain.gain.exponentialRampToValueAtTime(.0001,at+.15);oscillator.connect(gain);gain.connect(master);oscillator.start(at);oscillator.stop(at+.17);oscillator.onended=()=>{oscillator.disconnect();gain.disconnect();};});
  }
  async function play(path,id){
    stop();persona=id;const current=version;player.src=new URL(path,base).href;player.volume=prefs.volume;player.playbackRate=prefs.pace;player.preservesPitch=true;emit('starting');
    player.onplaying=()=>{if(current===version)emit('speaking');};
    player.onended=()=>{if(current===version)emit('idle');};
    player.onerror=()=>{if(current===version)emit('unavailable','Please try the voice again.');};
    try{await player.play();}catch{if(current===version)emit('unavailable','Tap the voice button to start playback.');}
  }
  function setPersona(id){if(!profiles[id])return;const changed=persona!==id;stop();persona=id;if(changed)cue('open',id);render();}
  function greet(id){
    if(!profiles[id])return;
    if(persona===id&&['speaking','starting'].includes(state)){stop();return;}
    stop();persona=id;dispatchEvent(new CustomEvent('portfolio:choose-persona',{detail:{persona:id}}));cue('open',id);play('assets/audio/neural/'+id+'-hello.mp3',id);
  }
  async function read(text,id=persona,topic=null){
    if(!text)return;
    stop();persona=id;const current=version;emit('starting');
    const catalog=await catalogPromise;if(current!==version)return;
    const file=catalog[id]?.[topic];if(file)play(file,id);else emit('unavailable','Ask a question about Shashi, then choose Read reply.');
  }
  function render(message=''){
    const profile=profiles[persona],playing=['speaking','starting'].includes(state);
    document.querySelectorAll('[data-voice-preview]').forEach(button=>{const on=button.dataset.voicePreview===persona&&playing;button.setAttribute('aria-pressed',String(on));button.querySelector('[data-voice-action]')?.replaceChildren(document.createTextNode(on?'Stop':'Hear voice'));});
    const preview=document.querySelector('#assistant-voice-test');if(preview){preview.textContent=playing?'Stop voice':'Hear '+profile.name;preview.setAttribute('aria-pressed',String(playing));}
    const status=document.querySelector('#assistant-voice-status');if(status)status.textContent=message||(playing?profile.name+(state==='starting'?' · starting':' · speaking'):profile.name+' · natural voice');
    const delivery=document.querySelector('#assistant-voice-delivery');if(delivery)delivery.textContent=profile.delivery;
    const auto=document.querySelector('#assistant-auto-voice');if(auto){auto.textContent=prefs.auto?'Voice replies on':'Voice replies off';auto.setAttribute('aria-pressed',String(prefs.auto));}
    const sounds=document.querySelector('#assistant-sound-toggle');if(sounds){sounds.textContent=prefs.sounds?'Desktop sounds on':'Desktop sounds off';sounds.setAttribute('aria-pressed',String(prefs.sounds));}
    document.querySelectorAll('[data-sound-toggle]').forEach(button=>{button.setAttribute('aria-pressed',String(prefs.sounds));const label=button.querySelector('span');if(label)label.textContent=prefs.sounds?'Sounds on':'Sounds off';});
    const speaker=document.querySelector('#assistant-speak');if(speaker){speaker.hidden=false;speaker.textContent=playing?'Stop voice':'Read reply';}
    const volume=document.querySelector('#assistant-volume');if(volume)volume.value=String(Math.round(prefs.volume*100));document.querySelector('#assistant-volume-value')?.replaceChildren(document.createTextNode(Math.round(prefs.volume*100)+'%'));
    const pace=document.querySelector('#assistant-pace');if(pace)pace.value=String(prefs.pace);document.querySelector('#assistant-pace-value')?.replaceChildren(document.createTextNode(prefs.pace.toFixed(2)+'×'));
  }
  function toggleSounds(){prefs.sounds=!prefs.sounds;save();render();if(prefs.sounds)cue();}
  function bind(){
    document.querySelectorAll('[data-voice-preview]').forEach(button=>button.addEventListener('click',()=>greet(button.dataset.voicePreview)));
    document.querySelectorAll('[data-sound-toggle]').forEach(button=>button.addEventListener('click',toggleSounds));
    document.querySelector('#assistant-voice-test')?.addEventListener('click',()=>greet(persona));
    document.querySelector('#assistant-auto-voice')?.addEventListener('click',()=>{prefs.auto=!prefs.auto;save();if(!prefs.auto)stop();else unlock();render();});
    document.querySelector('#assistant-sound-toggle')?.addEventListener('click',toggleSounds);
    document.querySelector('#assistant-volume')?.addEventListener('input',event=>{prefs.volume=Number(event.target.value)/100;player.volume=prefs.volume;if(master&&context)master.gain.setTargetAtTime(prefs.volume*.12,context.currentTime,.02);save();document.querySelector('#assistant-volume-value').textContent=event.target.value+'%';});
    document.querySelector('#assistant-pace')?.addEventListener('input',event=>{prefs.pace=Number(event.target.value);player.playbackRate=prefs.pace;player.preservesPitch=true;save();document.querySelector('#assistant-pace-value').textContent=prefs.pace.toFixed(2)+'×';});
    render();
  }
  window.portfolioAudio={setPersona,greet,read,stop,cue,reply(text,topic){if(prefs.auto)read(text,persona,topic);else cue('reply');},get state(){return {persona,state,volume:prefs.volume,sounds:prefs.sounds,auto:prefs.auto,pace:prefs.pace,voices:3};}};
  document.addEventListener('click',event=>{if(event.target.closest('[data-window-action="minimise"],[data-window-action="close"],#desktop-show-all,.mobile-window-home'))stop();if(event.target.closest('[data-open-app],[data-open-project],.task-app,.document-toolbar>button'))cue('open');});
  addEventListener('desktop:close',event=>{if(event.detail.app==='assistants')stop();});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
  addEventListener('pagehide',()=>{stop();context?.suspend();});
  if(document.readyState==='loading')addEventListener('DOMContentLoaded',bind,{once:true});else bind();
})();

