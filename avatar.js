'use strict';

(() => {
  const avatar = document.querySelector('#avatar-button');
  const sprite = document.querySelector('#avatar-sprite');
  const scene = document.querySelector('#avatar-scene');
  const speech = document.querySelector('#avatar-speech');
  const topicButtons = [...document.querySelectorAll('[data-avatar]')];
  let paused = window.portfolioMotion?.paused ?? matchMedia('(prefers-reduced-motion: reduce)').matches;
  let resetTimer, blinkTimer, visible = true;
  const expressions = ['smiling', 'blinking', 'thinking', 'greeting'];
  function expression(index) {
    if (index === 1 && paused) index = 0;
    sprite.dataset.expression = String(index);
    sprite.setAttribute('aria-label', `An illustrated avatar of Shashikant, ${expressions[index]}`);
  }
  function resetTilt() {
    ['--avatar-rx','--avatar-ry'].forEach(property => avatar.style.removeProperty(property));
  }
  function clearTimers() {
    clearTimeout(resetTimer); clearTimeout(blinkTimer); avatar.classList.remove('greeting');
  }
  document.addEventListener('portfolio:motion', event => {
    paused = event.detail.paused;
    if (paused) {
      resetTilt();
      if (sprite.dataset.expression === '1') { clearTimeout(blinkTimer); expression(0); }
    }
  });
  scene.addEventListener('pointermove', event => {
    if (paused || event.pointerType === 'touch') return;
    const bounds = scene.getBoundingClientRect();
    const x = Math.max(-1, Math.min(1, ((event.clientX-bounds.left)/bounds.width-.5)*2));
    const y = Math.max(-1, Math.min(1, ((event.clientY-bounds.top)/bounds.height-.5)*2));
    avatar.style.setProperty('--avatar-rx', `${-y*2}deg`);
    avatar.style.setProperty('--avatar-ry', `${x*3}deg`);
  }, {passive:true});
  scene.addEventListener('pointerleave', resetTilt);
  avatar.addEventListener('click', () => {
    clearTimers(); expression(3);
    topicButtons.forEach(button => button.setAttribute('aria-pressed','false'));
    speech.textContent = 'Hey! Good to meet you. Take a look around—there’s AI, maths, and a bit of making things.';
    resetTimer = setTimeout(() => expression(0), 2400);
  });
  const topics = {
    ai:{pose:0,text:'My AI side: learning agents, language models, and research into conversational risk.'},
    maths:{pose:2,text:'My maths side: mathematical foundations, AI reasoning evaluation, and university teaching.'},
    human:{pose:3,text:'My human side: helping a difficult idea click, supporting students, and making useful things.'}
  };
  topicButtons.forEach(button => button.addEventListener('click', () => {
    clearTimers();
    const topic = topics[button.dataset.avatar];
    expression(topic.pose); speech.textContent = topic.text;
    topicButtons.forEach(other => other.setAttribute('aria-pressed', String(other === button)));
  }));
  new IntersectionObserver(entries => { visible = entries[0].isIntersecting; }).observe(scene);
  setInterval(() => {
    if (!paused && !document.hidden && visible && sprite.dataset.expression === '0') {
      expression(1); blinkTimer = setTimeout(() => expression(0), 240);
    }
  }, 2000);
})();
