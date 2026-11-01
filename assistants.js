'use strict';

(() => {
  const scriptBase = new URL('.', document.currentScript.src);
  const dialog = document.querySelector('#assistant-dialog');
  if (!dialog) return;
  const desktopMode=dialog.dataset.desktop==='true';
  const transcript = document.querySelector('#assistant-transcript');
  const question = document.querySelector('#assistant-question');
  const form = document.querySelector('#assistant-form');
  const prompts = document.querySelector('#assistant-prompts');
  const title = document.querySelector('#assistant-title');
  const send = document.querySelector('#assistant-send');
  const speak = document.querySelector('#assistant-speak');
  const personas = {
    jarvis: {name:'J.A.R.V.I.S.', greeting:'Good to meet you. I’m JARVIS, your guide to Shashi’s research and engineering. Which idea shall we examine?', intro:'Here’s the technical picture.', prompts:['Explain the OULAD pipeline','Tell me about Hermes Watcher','What research has Shashi published?'], rate:.94},
    friday: {name:'F.R.I.D.A.Y.', greeting:'Hello. I’m FRIDAY. I can help you get to know Shashi’s background, teaching, and experience. What would be useful to know?', intro:'Here’s the background and contribution.', prompts:['Give me a short introduction to Shashi','What has he taught?','What skills does he bring?'], rate:1},
    edith: {name:'E.D.I.T.H.', greeting:'I’m EDITH. Looking for a project, repository, report, or demo? Tell me what you want to explore and I’ll find the way.', intro:'Here’s what to explore, with the sources below.', prompts:['Show me the project code','Where are the deep learning reports?','How can I contact Shashi?'], rate:.98}
  };
  const conversations = {jarvis:[], friday:[], edith:[]};
  const lastTopics = {};
  let active = 'jarvis', trigger = null, latestReply = '', busy = false, knowledgePromise;
  const stopWords = new Set('a an and are as at be been by can could did do does for from give has have he her him his how i in is it me my of on or please she shashi shashikant should some tell that the their them there these they this to us was what when where which who why will with would you your about'.split(' '));
  function normalise(value) { return value.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim(); }
  function tokens(value) { return [...new Set(normalise(value).split(' ').filter(word=>word.length>1&&!stopWords.has(word)).map(word=>word.length>4?word.replace(/s$/,''):word))]; }
  function loadKnowledge() {
    if (!knowledgePromise) knowledgePromise = fetch(new URL('assets/portfolio-knowledge.json',scriptBase)).then(response=>{if(!response.ok)throw new Error('Knowledge unavailable');return response.json()}).then(records=>{
      if(!Array.isArray(records))throw new Error('Invalid knowledge');
      records.forEach(record=>{record.tokenSet=new Set(tokens(record.keywords.join(' ')));});
      return records;
    }).catch(error=>{knowledgePromise=null;throw error});
    return knowledgePromise;
  }
  function linkElement(label,href) {
    const url=new URL(href,scriptBase);
    if(!['https:','http:','mailto:'].includes(url.protocol))return null;
    const link=document.createElement('a');link.href=url.href;link.textContent=label+' ↗';
    if(desktopMode&&url.origin===location.origin&&url.pathname.endsWith('.html'))link.addEventListener('click',event=>{event.preventDefault();window.dispatchEvent(new CustomEvent('desktop:navigate',{detail:{href:url.href}}));});
    if(url.origin!==location.origin&&url.protocol!=='mailto:'){link.target='_blank';link.rel='noopener noreferrer';}
    if(url.pathname.endsWith('.pdf')){link.target='_blank';link.rel='noopener';}
    return link;
  }
  function renderMessage(message,announce=true) {
    const article=document.createElement('article');article.className='assistant-message '+(message.user?'message-user':'message-guide');
    const label=document.createElement('span');label.className='message-label';label.textContent=message.user?'YOU':personas[active].name;article.append(label);
    message.paragraphs.forEach(text=>{const p=document.createElement('p');p.textContent=text;article.append(p)});
    if(message.topic)article.dataset.topic=message.topic;
    if(message.links?.length){const links=document.createElement('div');links.className='message-sources';message.links.forEach(([label,href])=>{const link=linkElement(label,href);if(link)links.append(link)});article.append(links);}
    transcript.append(article);
    if(!message.user)latestReply=message.paragraphs.join(' ');
    if(announce)transcript.scrollTop=message.user?transcript.scrollHeight:transcript.scrollTop+article.getBoundingClientRect().top-transcript.getBoundingClientRect().top-10;
  }
  function addMessage(message) {conversations[active].push(message);renderMessage(message);}
  function renderPrompts() {prompts.replaceChildren();personas[active].prompts.forEach(text=>{const button=document.createElement('button');button.type='button';button.textContent=text;button.addEventListener('click',()=>ask(text));prompts.append(button)});}
  function setPersona(id) {
    if(!personas[id]||busy)return;
    if('speechSynthesis' in window) speechSynthesis.cancel();
    active=id;dialog.dataset.assistant=id;title.textContent=personas[id].name;
    document.querySelectorAll('[data-assistant-tab]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.assistantTab===id)));
    transcript.setAttribute('aria-live','off');transcript.replaceChildren();latestReply='';
    if(!conversations[id].length)conversations[id].push({paragraphs:[personas[id].greeting]});
    conversations[id].forEach(message=>renderMessage(message,false));
    transcript.setAttribute('aria-live','polite');const last=transcript.lastElementChild;if(last)transcript.scrollTop+=last.getBoundingClientRect().top-transcript.getBoundingClientRect().top-10;renderPrompts();
  }
  function bestRecord(text,records) {
    const normal=normalise(text),query=tokens(text);
    if(!query.length&&/intro|who|background/.test(normal))return records.find(record=>record.id==='introduction');
    if(/^(more|tell me more|show me more|show code|code|show report|report|source|sources)$/.test(normal)&&lastTopics[active])return records.find(record=>record.id===lastTopics[active]);
    const scored=records.map(record=>{
      let score=query.reduce((total,word)=>{if(!record.tokenSet.has(word))return total;const count=records.filter(item=>item.tokenSet.has(word)).length;return total+(Math.log((records.length+1)/(count+1))+1)*3},0);
      const phrases=record.keywords.filter(phrase=>phrase.includes(' ')&&normal.includes(normalise(phrase)));
      if(phrases.length)score+=Math.max(...phrases.map(phrase=>8+tokens(phrase).length*2));
      return {record,score};
    }).sort((a,b)=>b.score-a.score);
    return scored[0]?.score>=4?scored[0].record:null;
  }
  async function ask(value) {
    const text=value.trim().slice(0,500);if(!text||busy)return;
    busy=true;send.disabled=true;question.disabled=true;prompts.querySelectorAll('button').forEach(button=>button.disabled=true);document.querySelectorAll('[data-assistant-tab]').forEach(button=>button.disabled=true);
    addMessage({user:true,paragraphs:[text]});question.value='';transcript.setAttribute('aria-busy','true');
    const pending=document.createElement('p');pending.className='assistant-pending';pending.textContent='Checking the portfolio…';transcript.append(pending);transcript.scrollTop=transcript.scrollHeight;
    try {
      const records=await loadKnowledge();
      let reply;
      if(/^(hi|hello|hey|help|thanks|thank you|what can you do)[ !?.]*$/i.test(text))reply={paragraphs:[/thank/i.test(text)?'You’re welcome. What else would you like to explore?':personas[active].greeting]};
      else {
        const record=bestRecord(text,records);
        if(record){lastTopics[active]=record.id;reply={topic:record.id,paragraphs:[personas[active].intro,...record.answer],links:record.links};}
        else reply={paragraphs:['That’s outside my portfolio knowledge. I can help with Shashi’s education, research, projects, teaching, experience, coursework, and contact details. Try a project name or a more specific question.'],links:[['Explore the detailed profile','about.html'],['Browse projects','projects.html']]};
      }
      pending.remove();addMessage(reply);
    } catch {pending.remove();addMessage({paragraphs:['I couldn’t load the portfolio notes. Please try again, or use these pages to explore the information directly.'],links:[['Detailed profile','about.html'],['Projects','projects.html'],['Contact Shashi','mailto:mailshashi122@gmail.com']]});}
    finally {busy=false;send.disabled=false;question.disabled=false;transcript.setAttribute('aria-busy','false');document.querySelectorAll('[data-assistant-tab]').forEach(button=>button.disabled=false);renderPrompts();if(dialog.open||desktopMode)question.focus();}
  }
  function openAssistant(id,element,initialQuestion) {
    if(!personas[id])return;
    trigger=element;setPersona(id);
    if(desktopMode)window.dispatchEvent(new CustomEvent('desktop:open',{detail:{app:'assistants'}}));
    else if(!dialog.open){dialog.showModal();document.body.classList.add('assistant-open');}
    question.focus();if(initialQuestion)ask(initialQuestion);
  }
  document.querySelectorAll('[data-assistant]').forEach(button=>button.addEventListener('click',()=>openAssistant(button.dataset.assistant,button,button.dataset.question)));
  document.querySelectorAll('[data-assistant-tab]').forEach(button=>button.addEventListener('click',()=>setPersona(button.dataset.assistantTab)));
  document.querySelector('#assistant-close').addEventListener('click',()=>{if(desktopMode)window.dispatchEvent(new CustomEvent('desktop:close',{detail:{app:'assistants'}}));else dialog.close();});
  dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
  dialog.addEventListener('close',()=>{document.body.classList.remove('assistant-open');if('speechSynthesis' in window)speechSynthesis.cancel();trigger?.focus();});
  form.addEventListener('submit',event=>{event.preventDefault();ask(question.value)});
  document.querySelector('#assistant-clear').addEventListener('click',()=>{if(busy)return;conversations[active]=[];delete lastTopics[active];setPersona(active);question.focus();});
  if('speechSynthesis' in window&&'SpeechSynthesisUtterance' in window){speak.hidden=false;speak.addEventListener('click',()=>{if(!latestReply)return;speechSynthesis.cancel();const utterance=new SpeechSynthesisUtterance(latestReply);utterance.rate=personas[active].rate;const code={jarvis:'en-GB',friday:'en-AU',edith:'en-US'}[active];const voice=speechSynthesis.getVoices().find(voice=>voice.lang===code);if(voice)utterance.voice=voice;speechSynthesis.speak(utterance);});}
  setPersona(active);
})();
