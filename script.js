'use strict';

const projects = {
  edtuned: {
    title: 'edTuned', category: 'EDUCATIONAL AI / CAPSTONE & STARTUP EXPLORATION',
    summary: 'Exploring how agentic AI can make learning support more responsive to individual students.',
    sections: [
      ['THE QUESTION', 'How could an intelligent learning system adapt its explanations and learning pathways to the person using it?'],
      ['MY WORK', ['Explored LLM-based agents for intelligent tutoring, content generation, and personalised learning pathways.', 'Worked on the design of agent workflows and the relationship between student needs and learning content.', 'Considered responsible AI, learner privacy, and appropriate educational use alongside the technical design.', 'Developed the idea through university capstone research and startup exploration with the ThincLab ecosystem.']],
      ['THE TAKEAWAY', 'An educational AI system needs more than useful model outputs. It needs a clear learning purpose, thoughtful interaction design, and a way to evaluate whether it helps the learner.']
    ],
    links: [['Explore the repository', 'https://github.com/chaudharysk/edtuned-website']]
  },
  oulad: {
    title: 'Understanding student success', category: 'DATA ANALYTICS / EDUCATIONAL RESEARCH',
    summary: 'An investigation into student withdrawal and failure using the Open University Learning Analytics Dataset (OULAD).',
    fact: '32,593 student records · 10,655,280 interaction logs · 7 linked tables',
    sections: [
      ['THE QUESTION', 'What patterns in demographic, registration, assessment, and learning activity data help explain student outcomes?'],
      ['MY WORK', ['Integrated seven related tables and aggregated interaction records into student-level and weekly measures.', 'Built repeatable ingest, cleaning, joining, feature engineering, and modelling stages in Python.', 'Applied data validation, missing-value strategies, deduplication, and cross-table integrity checks.', 'Compared predictive approaches while documenting the transformations and features used.']],
      ['RESEARCH DIRECTION', 'The work explores the factors associated with withdrawal and failure in online courses. A manuscript is in preparation.']
    ],
    links: [['View big data project B', 'https://github.com/chaudharysk/Part-B-Big-Data-Assignment'], ['View big data project C', 'https://github.com/chaudharysk/Part-C-Big-Data']]
  },
  risk: {
    title: 'Conversational risk analysis', category: 'MACHINE LEARNING / PEER-REVIEWED RESEARCH',
    summary: 'Co-authored research into identifying and classifying potential threats in interpersonal communication, across text and audio.',
    sections: [
      ['THE QUESTION', 'How do classification approaches behave when moving from text-based threat analysis to audio data?'],
      ['THE RESEARCH', ['Compared machine learning and deep learning methods, including logistic regression, Random Forest, SVM, XGBoost, LSTM, and RNN.', 'Worked with data preparation, feature engineering, experimentation, and model evaluation.', 'Contributed to research writing and the comparison of approaches across data modalities.']],
      ['PUBLICATION', 'Bansal, A., Bharadwaj, S., Panchineni, P., Suddala, S. & Chaudhary, S. (2025). Conversational Risk Analysis: Identifying and Classifying Potential Threats in Interpersonal Communication. Congress on Smart Computing Technologies (CSCT 2024), Springer. First published online 1 October 2025.']
    ],
    note: 'The linked GitHub repository contains related earlier project work. The Springer chapter is the authoritative source for the published study.',
    links: [['Read the published paper', 'https://link.springer.com/chapter/10.1007/978-981-96-6254-8_53'], ['Related project repository', 'https://github.com/chaudharysk/threat_detection_interpersonal_communication']]
  },
  govnav: {
    title: 'GovNav', category: 'AI FOR COMMUNITY / GOVHACK 2025',
    summary: 'A team hackathon exploration of AI tools that help people find government services and make sense of regulatory information.',
    sections: [
      ['THE QUESTION', 'How can we make the next step clearer when government services, community support, or business regulations are difficult to navigate?'],
      ['THE TEAM PROJECT', ['Contributed to Team SPYDER’s GovHack 2025 exploration of service navigation and community AI agents.', 'Explored conversational assistance and plain-language guidance for complex information.', 'Worked within the fast-paced process of hackathon prototyping, collaboration, and communicating an idea.']],
      ['THE CONTEXT', 'The repository documents three challenge areas: navigating government services, community agents that bridge service access gaps, and simplifying red tape.']
    ],
    links: [['Explore the team repository', 'https://github.com/chaudharysk/GovNav']]
  },
  sensors: {
    title: 'A bridge from sensors to software', category: 'EMBEDDED SYSTEMS / HATCHNHACK INTERNSHIP',
    summary: 'Practical hardware and software work for ARBD1, an Arduino-based educational electronics board.',
    sections: [
      ['THE CHALLENGE', 'Make the board’s sensors and actuators easier to control, read, and understand through software.'],
      ['MY WORK', ['Developed firmware for a learning board with environmental sensors and onboard peripherals.', 'Created a Python library for hardware control, including sensor readings, RGB lighting, navigation switches, and a buzzer.', 'Built a GUI for monitoring sensor readings and worked on device-to-dashboard data flow using MQTT.']],
      ['THE CONNECTION', 'The project brought together embedded programming, communication protocols, a usable Python interface, and a visual way to inspect what the hardware was doing.']
    ],
    links: [['Python library', 'https://github.com/chaudharysk/ArBd1Firmata'], ['Dashboard repository', 'https://github.com/chaudharysk/ARBD-DASHBOARD']]
  }
};

document.documentElement.classList.add('js');

const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
function closeMenu() { navigation.classList.remove('open'); menuButton.setAttribute('aria-expanded', 'false'); menuButton.querySelector('span').textContent = '+'; }
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open)); navigation.classList.toggle('open', open);
  menuButton.querySelector('span').textContent = open ? '−' : '+';
});
navigation.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
document.addEventListener('keydown', e => { if (e.key === 'Escape' && navigation.classList.contains('open')) { closeMenu(); menuButton.focus(); } });
document.addEventListener('click', e => { if (!e.target.closest('.site-header')) closeMenu(); });
document.querySelector('#year').textContent = new Date().getFullYear();

const motionQuery = matchMedia('(prefers-reduced-motion: reduce)');
let paused = motionQuery.matches;
try { const preference = localStorage.getItem('shashi-motion'); if (preference === 'off') paused = true; } catch {}
const motionButton = document.querySelector('#motion-toggle');
function applyMotion() {
  document.documentElement.classList.toggle('motion-off', paused);
  motionButton.setAttribute('aria-pressed', String(paused));
  motionButton.setAttribute('aria-label', paused ? 'Turn motion on' : 'Turn motion off');
  document.querySelector('#motion-label').textContent = paused ? 'MOTION OFF' : 'MOTION ON';
  if (paused) { document.querySelector('#confetti').replaceChildren(); resetTilt(); }
}
motionButton.addEventListener('click', () => { paused = !paused; applyMotion(); try { localStorage.setItem('shashi-motion', paused ? 'off' : 'on'); } catch {} });
motionQuery.addEventListener('change', e => { paused = e.matches; applyMotion(); });

// This is a locally scripted portrait, with expressions adapted from Shashi's chosen illustration.
const avatar = document.querySelector('#avatar-button');
const sprite = document.querySelector('#avatar-sprite');
const scene = document.querySelector('#avatar-scene');
const speech = document.querySelector('#avatar-speech');
let resetTimer, blinkTimer, avatarVisible = true;
const expressions = ['smiling', 'blinking', 'thinking', 'greeting'];
function setExpression(index) { sprite.dataset.expression = String(index); sprite.setAttribute('aria-label', `An illustrated avatar of Shashikant, ${expressions[index]}`); }
function clearExpressionTimer() { clearTimeout(resetTimer); clearTimeout(blinkTimer); avatar.classList.remove('wave'); }
function resetTilt() { ['--avatar-x','--avatar-y','--avatar-rx','--avatar-ry'].forEach(p => avatar.style.removeProperty(p)); }
applyMotion();
scene.addEventListener('pointermove', event => {
  if (paused || event.pointerType === 'touch') return;
  const r = scene.getBoundingClientRect();
  const x = Math.max(-1, Math.min(1, ((event.clientX - r.left) / r.width - .5) * 2));
  const y = Math.max(-1, Math.min(1, ((event.clientY - r.top) / r.height - .5) * 2));
  avatar.style.setProperty('--avatar-x', `${x * 3}px`); avatar.style.setProperty('--avatar-y', `${y * 2}px`);
  avatar.style.setProperty('--avatar-rx', `${-y * 3}deg`); avatar.style.setProperty('--avatar-ry', `${x * 6}deg`);
}, {passive:true});
scene.addEventListener('pointerleave', resetTilt);
function confetti() {
  const container = document.querySelector('#confetti'); container.replaceChildren();
  if (paused) return;
  for (let i = 0; i < 16; i++) {
    const piece = document.createElement('i'); piece.className = 'confetti-piece';
    const angle = i / 16 * Math.PI * 2;
    piece.style.setProperty('--cx', `${Math.cos(angle) * (80 + Math.random() * 100)}px`);
    piece.style.setProperty('--cy', `${Math.sin(angle) * (70 + Math.random() * 100) - 35}px`);
    piece.style.setProperty('--cr', `${Math.random() * 500}deg`);
    piece.style.background = [ '#ffd42a', '#3748ed', '#f3f3f0' ][i % 3];
    container.append(piece);
  }
  setTimeout(() => container.replaceChildren(), 1000);
}
function wave() {
  clearExpressionTimer(); setExpression(3);
  document.querySelectorAll('[data-avatar]').forEach(b => b.setAttribute('aria-pressed','false'));
  speech.textContent = 'Hey! Great to meet you. Take a look around — there’s AI, maths, and a bit of me in everything.';
  if (!paused) { void avatar.offsetWidth; avatar.classList.add('wave'); }
  resetTimer = setTimeout(() => { setExpression(0); avatar.classList.remove('wave'); }, 2400);
}
avatar.addEventListener('click', wave);
const interests = {
  ai: {expression:2, text:'My AI side: learning agents, language models, and published research into conversational risk.'},
  maths: {expression:2, text:'My maths side: a master’s in Mathematics & Computing, AI reasoning evaluation, and university teaching.'},
  human: {expression:3, text:'My human side: helping a difficult idea click, supporting students, and making technology useful to people.'}
};
document.querySelectorAll('[data-avatar]').forEach(button => button.addEventListener('click', () => {
  clearExpressionTimer(); const interest = interests[button.dataset.avatar]; setExpression(interest.expression); speech.textContent = interest.text;
  document.querySelectorAll('[data-avatar]').forEach(b => b.setAttribute('aria-pressed',String(b === button)));
}));
let surpriseIndex = 0;
const surprises = ['AI + maths + teaching. Three different ways to make something click.', 'Two master’s degrees. A published paper. And plenty more questions to ask.', 'From Arduino sensors to learning agents. Curiosity is the connecting thread.'];
function surprise() { clearExpressionTimer(); setExpression(1); speech.textContent = surprises[surpriseIndex++ % surprises.length]; confetti(); document.querySelectorAll('[data-avatar]').forEach(b=>b.setAttribute('aria-pressed','false')); resetTimer = setTimeout(()=>setExpression(0),200); }
document.querySelector('#surprise-button').addEventListener('click', surprise);
document.addEventListener('keydown', e => { if (e.key.toLowerCase() === 's' && !e.repeat && !e.ctrlKey && !e.metaKey && !e.altKey && !e.target.closest('input,textarea,select,[contenteditable]') && !document.querySelector('#project-dialog').open) surprise(); });
new IntersectionObserver(entries => { avatarVisible = entries[0].isIntersecting; }).observe(scene);
setInterval(() => { if (!paused && !document.hidden && avatarVisible && sprite.dataset.expression === '0') { setExpression(1); blinkTimer = setTimeout(()=>setExpression(0),150); } }, 7500);

const revealObserver = new IntersectionObserver(entries => { entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); } }); }, {threshold:.07});
document.querySelectorAll('.reveal').forEach(e => revealObserver.observe(e));
let scrollFrame = 0;
function updateProgress() { scrollFrame = 0; const max = document.documentElement.scrollHeight - innerHeight; document.querySelector('.scroll-progress').style.transform = `scaleX(${max > 0 ? Math.min(1,scrollY / max) : 0})`; }
addEventListener('scroll', () => { if (!scrollFrame) scrollFrame = requestAnimationFrame(updateProgress); }, {passive:true});
addEventListener('resize', updateProgress); updateProgress();
document.addEventListener('visibilitychange', () => document.documentElement.classList.toggle('tab-hidden', document.hidden));

document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
  const filter = button.dataset.filter;
  document.querySelectorAll('[data-filter]').forEach(b => { const active = b === button; b.classList.toggle('active', active); b.setAttribute('aria-pressed', String(active)); });
  let count = 0;
  document.querySelectorAll('.project[data-category]').forEach(project => { const visible = filter === 'all' || project.dataset.category === filter; project.hidden = !visible; if (visible) count++; });
  document.querySelector('#project-count').textContent = `Showing ${count} projects`;
  updateProgress();
}));

const dialog = document.querySelector('#project-dialog');
let dialogTrigger;
document.querySelectorAll('[data-project]').forEach(button => button.addEventListener('click', () => {
  const project = projects[button.dataset.project]; dialogTrigger = button;
  document.querySelector('#dialog-category').textContent = project.category;
  document.querySelector('#dialog-title').textContent = project.title;
  document.querySelector('#dialog-summary').textContent = project.summary;
  const content = document.querySelector('#dialog-content'); content.replaceChildren();
  if (project.fact) { const fact = document.createElement('div'); fact.className = 'dialog-fact'; fact.textContent = project.fact; content.append(fact); }
  project.sections.forEach(([heading, text]) => {
    const h = document.createElement('h3'); h.textContent = heading; content.append(h);
    if (Array.isArray(text)) { const ul = document.createElement('ul'); text.forEach(item => { const li = document.createElement('li'); li.textContent = item; ul.append(li); }); content.append(ul); }
    else { const p = document.createElement('p'); p.textContent = text; content.append(p); }
  });
  if (project.note) { const note = document.createElement('p'); note.className = 'dialog-note'; note.textContent = project.note; content.append(note); }
  const links = document.querySelector('#dialog-links'); links.replaceChildren();
  project.links.forEach(([label, url]) => { const a = document.createElement('a'); a.href = url; a.target = '_blank'; a.rel = 'noopener noreferrer'; a.className = 'text-link'; a.textContent = `${label} ↗`; links.append(a); });
  document.body.classList.add('dialog-open'); dialog.showModal(); dialog.scrollTop = 0;
}));
document.querySelector('#dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', e => { const r = dialog.getBoundingClientRect(); if (e.target === dialog && (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom)) dialog.close(); });
dialog.addEventListener('close', () => { document.body.classList.remove('dialog-open'); if (dialogTrigger) dialogTrigger.focus({preventScroll:true}); });
