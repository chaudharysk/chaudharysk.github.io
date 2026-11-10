'use strict';

// Redirect links shared from earlier versions of the desktop homepage.
(() => {
  const routes = {
    '#profile': 'about.html', '#about': 'about.html', '#research': 'about.html#research',
    '#experience': 'experience.html', '#journey': 'experience.html', '#home-experience': 'experience.html',
    '#projects': 'projects.html', '#home-projects': 'projects.html',
    '#coursework': 'coursework.html', '#home-coursework': 'coursework.html',
    '#playground': 'playground.html', '#bench': 'playground.html#bench',
    '#cv': 'cv.html', '#project-hermes': 'projects/hermes.html', '#overview': '#intro',
    '#assistants': 'desktop.html#assistants', '#terminal': 'desktop.html#terminal',
    '#help': 'desktop.html#help'
  };
  const hash = location.hash;
  const project = /^#projects\/(hermes|edtuned|risk|oulad|govnav|sensors)$/.exec(hash);
  if (project) location.replace(`projects/${project[1]}.html`);
  else if (routes[hash]) location.replace(routes[hash]);
})();
