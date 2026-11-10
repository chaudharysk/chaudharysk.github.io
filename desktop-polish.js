'use strict';

// Arrow keys move between shortcuts in either the vertical or mobile row layout.
(() => {
  const grid = document.querySelector('.desktop-shortcuts');
  const shortcuts = [...grid.querySelectorAll('button')];
  grid.addEventListener('keydown', event => {
    const index = shortcuts.indexOf(document.activeElement);
    if (index < 0) return;
    const columns = getComputedStyle(grid).gridTemplateColumns.split(' ').length;
    const moves = {ArrowLeft: -1, ArrowRight: 1, ArrowUp: -columns, ArrowDown: columns};
    let next;
    if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = shortcuts.length - 1;
    else if (event.key in moves) next = Math.max(0, Math.min(shortcuts.length - 1, index + moves[event.key]));
    else return;
    event.preventDefault();
    shortcuts[next].focus();
  });
})();
