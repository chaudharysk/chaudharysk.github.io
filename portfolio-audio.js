'use strict';

(() => {
  const base=new URL('.',document.currentScript.src);
  const profiles={
    jarvis:{name:'JARVIS',rate:.94,pitch:.82,lang:'en-GB',prefer:/Daniel|George|David|Brian|Ryan/i,notes:[196,294,392],hello:"Hello. I'm Jarvis. Let's explore Shashi's research, and the ideas he turns into working systems."},
    friday:{name:'FRIDAY',rate:1.01,pitch:1.09,lang:'en-AU',prefer:/Natasha|Moira|Samantha|Aria|Susan|Zira/i,notes:[262,330,440],hello:"Hello, I'm Friday. I'll introduce you to Shashi. Mathematics, teaching, and a little curiosity go a long way."},
    edith:{name:'EDITH',rate:.97,pitch:.97,lang:'en-US',prefer:/Victoria|Jenny|Hazel|Michelle|Zira|Samantha/i,notes:[220,330,494],hello:"Hi, I'm Edith. Projects, reports, and real hardware experiments. Tell me what you'd like to discover."}
  };
  let prefs={volume:.55,sounds:false,auto:false,voices:{}};
  try{const saved=JSON.parse(localStorage.getItem('shashi-audio')||'null');if(saved)prefs={...prefs,...saved,volume:Math.max(0,Math.min(1,Number(saved.volume)||0)),voices:saved.voices||{}};}catch{}
  let persona='jarvis',sample=null,utterance=null,context=null,master=null,voices=[],state='idle',watchdog=0,readVersion=0;
  const manifestPromise=fetch(new URL('assets/audio/voice-manifest.json',base)).then(r=>r.ok?r.json():{}).catch(()=>({})).then(catalog=>{
    Object.keys(profiles).forEach(id=>{catalog[id]||={};catalog[id].welcome='assets/audio/'+id+'-hello.wav';});return catalog;
  });
  const speechAvailable='speechSynthesis' in window&&'SpeechSynthesisUtterance' in window;
  function save(){try{localStorage.setItem('shashi-audio',JSON.stringify(prefs));}catch{}}
  function emit(next,message=''){
    state=next;document.documentElement.dataset.voiceState=next;document.documentElement.dataset.voicePersona=persona;
    document.dispatchEvent(new CustomEvent('portfolio:voice-state',{detail:{state:next,persona,message}}));render(message);
  }
  function stop(){
    readVersion++;clearTimeout(watchdog);if(sample){sample.pause();sample.removeAttribute('src');sample.load();sample=null;}
    if(speechAvailable)speechSynthesis.cancel();utterance=null;emit('idle');
  }
  async function unlock(){
    try{
      const AudioEngine=window.AudioContext||window.webkitAudioContext;if(!AudioEngine)return null;
      if(!context){context=new AudioEngine();master=context.createGain();master.gain.value=prefs.volume*.12;master.connect(context.destination);}
      if(context.state==='suspended')await context.resume();return context;
    }catch{return null;}
  }
  async function cue(kind='open',id=persona){
    if(!prefs.sounds||!prefs.volume)return;
    const engine=await unlock();if(!engine||engine.state!=='running')return;
    const notes=profiles[id]?.notes||profiles.jarvis.notes;
    const sequence=kind==='reply'?notes.slice(1):kind==='close'?[notes[1],notes[0]]:notes;
    sequence.forEach((frequency,index)=>{
      const oscillator=engine.createOscillator(),gain=engine.createGain(),at=engine.currentTime+index*.052;
      oscillator.type='sine';oscillator.frequency.setValueAtTime(frequency,at);
      gain.gain.setValueAtTime(.0001,at);gain.gain.exponentialRampToValueAtTime(.65,at+.012);gain.gain.exponentialRampToValueAtTime(.0001,at+.15);
      oscillator.connect(gain);gain.connect(master);oscillator.start(at);oscillator.stop(at+.17);oscillator.onended=()=>{oscillator.disconnect();gain.disconnect();};
    });
  }
  function chooseVoice(id){
    const selected=voices.find(v=>v.voiceURI===prefs.voices[id]);if(selected)return selected;
    const profile=profiles[id],other=id==='edith'?chooseVoice('friday'):null;
    return [...voices].filter(v=>/^en[-_]/i.test(v.lang)).sort((a,b)=>{
      const score=v=>(v.lang===profile.lang?5:0)+(profile.prefer.test(v.name)?6:0)+(v.localService?2:0)-(other&&v.voiceURI===other.voiceURI?5:0);
      return score(b)-score(a);
    })[0]||voices[0];
  }
  function playNarration(path,id,message=''){
    const clip=new Audio(new URL(path,base).href);sample=clip;persona=id;clip.volume=prefs.volume;emit('starting');
    clip.onplaying=()=>{if(sample===clip)emit('speaking',message);};
    clip.onended=()=>{if(sample===clip){sample=null;emit('idle');}};
    clip.onerror=()=>{if(sample===clip){sample=null;emit('unavailable','Use a voice preview, or choose another reply voice.');}};
    clip.play().catch(()=>{if(sample===clip){sample=null;emit('unavailable','Tap Read reply to start the narration.');}});
  }
  async function read(text,id=persona,topic=null){
    if(!text)return;
    stop();persona=id;const request=readVersion;emit('starting');
    const catalog=await manifestPromise;if(request!==readVersion)return;
    const prepared=topic?catalog[id]?.[topic]:null;
    if(prepared&&!prefs.voices[id]){playNarration(prepared,id);return;}
    if(!speechAvailable){if(prepared)playNarration(prepared,id);else emit('unavailable','Use a voice preview to hear this guide.');return;}
    const profile=profiles[id];
    utterance=new SpeechSynthesisUtterance(text);utterance.rate=profile.rate;utterance.pitch=profile.pitch;utterance.volume=prefs.volume;
    const selected=chooseVoice(id);utterance.lang=selected?.lang||profile.lang;if(selected)utterance.voice=selected;
    const current=utterance;
    const fallback=()=>{utterance=null;clearTimeout(watchdog);if(prepared)playNarration(prepared,id,'Guide narration · '+profile.name);else emit('unavailable','Choose another voice to read this reply.');};
    current.onstart=()=>{if(utterance===current){clearTimeout(watchdog);emit('speaking');}};
    current.onend=()=>{if(utterance===current){utterance=null;emit('idle');}};
    current.onerror=event=>{if(utterance!==current)return;if(event.error==='canceled'||event.error==='interrupted'){utterance=null;emit('idle');}else fallback();};
    watchdog=setTimeout(()=>{if(utterance===current&&state==='starting'){utterance=null;speechSynthesis.cancel();fallback();}},6500);
    try{speechSynthesis.speak(current);}catch{fallback();}
  }
  async function greet(id){
    if(!profiles[id])return;
    if(persona===id&&(state==='speaking'||state==='starting')){stop();return;}
    stop();persona=id;dispatchEvent(new CustomEvent('portfolio:choose-persona',{detail:{persona:id}}));
    cue('open',id);
    const clip=new Audio(new URL('assets/audio/'+id+'-hello.wav',base).href);sample=clip;clip.volume=prefs.volume;emit('starting');
    clip.onplaying=()=>{if(sample===clip)emit('speaking');};
    clip.onended=()=>{if(sample===clip){sample=null;emit('idle');}};
    clip.onerror=()=>{if(sample===clip){sample=null;read(profiles[id].hello,id);}};
    try{await clip.play();}catch{if(sample===clip){sample=null;read(profiles[id].hello,id);}}
  }
  function setPersona(id){
    if(!profiles[id])return;
    const changed=persona!==id;stop();persona=id;if(changed)cue('open',id);render();
  }
  function render(message=''){
    const profile=profiles[persona],playing=state==='speaking'||state==='starting';
    document.querySelectorAll('[data-voice-preview]').forEach(button=>{
      const on=button.dataset.voicePreview===persona&&playing;button.setAttribute('aria-pressed',String(on));
      button.querySelector('[data-voice-action]')?.replaceChildren(document.createTextNode(on?'Stop':'Hear voice'));
    });
    const preview=document.querySelector('#assistant-voice-test');
    if(preview){preview.textContent=playing?'Stop voice':'Hear '+profile.name;preview.setAttribute('aria-pressed',String(playing));}
    const status=document.querySelector('#assistant-voice-status');
    if(status)status.textContent=message||(playing?profile.name+(state==='starting'?' · starting':' · speaking'):profile.name+' · voice ready');
    const auto=document.querySelector('#assistant-auto-voice');
    if(auto){auto.textContent=prefs.auto?'Voice replies on':'Voice replies off';auto.setAttribute('aria-pressed',String(prefs.auto));}
    const sound=document.querySelector('#assistant-sound-toggle');
    if(sound){sound.textContent=prefs.sounds?'Desktop sounds on':'Desktop sounds off';sound.setAttribute('aria-pressed',String(prefs.sounds));}
    document.querySelectorAll('[data-sound-toggle]').forEach(button=>{button.setAttribute('aria-pressed',String(prefs.sounds));const label=button.querySelector('span');if(label)label.textContent=prefs.sounds?'Sounds on':'Sounds off';});
    const speaker=document.querySelector('#assistant-speak');if(speaker){speaker.hidden=false;speaker.textContent=playing?'Stop voice':'Read reply';}
    const select=document.querySelector('#assistant-voice-select');
    if(select){
      const previous=select.value;select.replaceChildren();
      const automatic=document.createElement('option');automatic.value='';automatic.textContent='Guide narration · '+profile.name;select.append(automatic);
      voices.filter(v=>/^en[-_]/i.test(v.lang)).forEach(voice=>{const option=document.createElement('option');option.value=voice.voiceURI;option.textContent=voice.name+' · '+voice.lang+(voice.localService?'':' · online');select.append(option);});
      select.value=prefs.voices[persona]||'';if(select.value===null)select.value=previous||'';
    }
    const volume=document.querySelector('#assistant-volume');if(volume)volume.value=String(Math.round(prefs.volume*100));
    document.querySelector('#assistant-volume-value')?.replaceChildren(document.createTextNode(Math.round(prefs.volume*100)+'%'));
  }
  function toggleSounds(){prefs.sounds=!prefs.sounds;save();render();if(prefs.sounds)cue();}
  function bind(){
    document.querySelectorAll('[data-voice-preview]').forEach(button=>button.addEventListener('click',()=>greet(button.dataset.voicePreview)));
    document.querySelectorAll('[data-sound-toggle]').forEach(button=>button.addEventListener('click',toggleSounds));
    document.querySelector('#assistant-voice-test')?.addEventListener('click',()=>greet(persona));
    document.querySelector('#assistant-auto-voice')?.addEventListener('click',()=>{prefs.auto=!prefs.auto;save();if(!prefs.auto)stop();else unlock();render();});
    document.querySelector('#assistant-sound-toggle')?.addEventListener('click',toggleSounds);
    document.querySelector('#assistant-voice-select')?.addEventListener('change',event=>{prefs.voices[persona]=event.target.value;save();stop();render();});
    document.querySelector('#assistant-volume')?.addEventListener('input',event=>{
      prefs.volume=Number(event.target.value)/100;if(sample)sample.volume=prefs.volume;if(master&&context)master.gain.setTargetAtTime(prefs.volume*.12,context.currentTime,.02);save();
      document.querySelector('#assistant-volume-value').textContent=event.target.value+'%';
    });
    render();
  }
  if(speechAvailable){const refresh=()=>{voices=speechSynthesis.getVoices();render();};speechSynthesis.addEventListener('voiceschanged',refresh);refresh();}
  window.portfolioAudio={
    setPersona,greet,read,stop,cue,
    reply(text,topic){if(prefs.auto)read(text,persona,topic);else cue('reply');},
    get state(){return {persona,state,volume:prefs.volume,sounds:prefs.sounds,auto:prefs.auto,voices:voices.length};}
  };
  document.addEventListener('click',event=>{
    if(event.target.closest('[data-window-action="minimise"],[data-window-action="close"],#desktop-show-all,.mobile-window-home'))stop();
    if(event.target.closest('[data-open-app],[data-open-project],.task-app,.document-toolbar>button'))cue('open');
  });
  addEventListener('desktop:close',event=>{if(event.detail.app==='assistants')stop();});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
  addEventListener('pagehide',()=>{stop();context?.suspend();});
  if(document.readyState==='loading')addEventListener('DOMContentLoaded',bind,{once:true});else bind();
})();

