'use strict';

// Ordered colour dithering of a real South Australian coastal photograph.
// Rendering at the visible pixel resolution keeps the motion inexpensive.
(() => {
  const canvas = document.querySelector('#landscape-canvas');
  if (!canvas) return;
  const hero = canvas.closest('.landscape-hero');
  const copy = hero.querySelector('.landscape-copy');
  const motionButton = document.querySelector('#landscape-motion');
  const rippleButton = document.querySelector('#landscape-ripple');
  const context = canvas.getContext('2d', {alpha: false});
  const sampler = document.createElement('canvas');
  const sampleContext = sampler.getContext('2d', {willReadFrequently: true});
  if (!context || !sampleContext) {
    rippleButton.disabled = true;
    motionButton.disabled = true;
    return;
  }

  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const photograph = new Image();
  const clamp = (value, low, high) => Math.min(high, Math.max(low, value));
  const threshold = [
    0, 8, 2, 10,
    12, 4, 14, 6,
    3, 11, 1, 9,
    15, 7, 13, 5
  ];

  function colour(hex) {
    const bytes = new Uint8Array([
      parseInt(hex.slice(0, 2), 16),
      parseInt(hex.slice(2, 4), 16),
      parseInt(hex.slice(4, 6), 16),
      255
    ]);
    return new Uint32Array(bytes.buffer)[0];
  }

  const palettes = {
    sky: ['b6cbe4', 'c3d6ed', 'd4e3f4', 'e6eef7', 'f8fbff'].map(colour),
    stone: ['172328', '273837', '75502b', 'b64e25', 'f27b30', 'ffb52e', 'f0d86a', 'fff1bc'].map(colour),
    plants: ['132b2a', '28453b', '46754b', '80a951', 'c1d581', 'efebbc'].map(colour),
    water: ['103556', '1c528c', '266cae', '218dba', '39b9c1', '9be0d6', 'e7f5ec'].map(colour)
  };
  const rippleColours = ['a2badf', 'fff1b3', 'b4e4df'].map(colour);
  // Positions of the coastline's upper edge in the source photograph, expressed
  // as fractions of the original image. This keeps the sky in its light palette.
  const ridge = [
    [0, .674], [.105, .682], [.145, .672], [.187, .647],
    [.22, .65], [.25, .588], [.275, .575], [.335, .562],
    [.385, .558], [.414, .521], [.438, .520], [.49, .552],
    [.545, .55], [.588, .548], [.65, .558], [.719, .542],
    [.775, .516], [.83, .489], [.893, .465], [.95, .444], [1, .434]
  ];
  const shore = [
    [0, .702], [.16, .702], [.235, .715], [.31, .73],
    [.42, .746], [.5, .759], [.61, .774], [.72, .794],
    [.81, .817], [.87, .868], [.93, .913], [1, .966]
  ];

  function boundaryAt(points, x) {
    for (let i = 1; i < points.length; i++) {
      const [nextX, nextY] = points[i];
      if (x <= nextX) {
        const [previousX, previousY] = points[i - 1];
        const portion = (x - previousX) / (nextX - previousX);
        return previousY + (nextY - previousY) * portion;
      }
    }
    return points[points.length - 1][1];
  }

  function shade(palette, tone, dither) {
    const value = clamp(tone, 0, 1) * (palette.length - 1);
    const lower = Math.floor(value);
    return palette[Math.min(palette.length - 1, lower + (value - lower > dither ? 1 : 0))];
  }

  let width = 0;
  let height = 0;
  let columns = 0;
  let rows = 0;
  let currentPadding = -1;
  let imageData;
  let base;
  let output;
  let regions;
  let waterStart;
  let inView = true;
  let frame = 0;
  let lastPaint = 0;
  const pointer = {x: 0, y: 0, strength: 0, target: 0};
  let ripple = null;

  function pixelScene() {
    return document.body.dataset.wallpaper === 'coast';
  }
  function paused() {
    return reducedMotion.matches || !!window.portfolioMotion?.paused;
  }
  function animating() {
    return imageData && pixelScene() && inView && !document.hidden && !paused();
  }

  function rebuild() {
    if (!photograph.complete || !photograph.naturalWidth) return;
    const nextWidth = hero.clientWidth;
    const nextHeight = hero.clientHeight;
    if (!nextWidth || !nextHeight) return;
    const step = nextWidth < 620 ? 3.4 : 4.0;
    const nextColumns = Math.ceil(nextWidth / step);
    const nextRows = Math.ceil(nextHeight / step);
    const copyBottom = copy.offsetTop + copy.offsetHeight;
    const requiredSky = Math.min(nextHeight * .76, copyBottom + 16);
    const padding = Math.round(clamp((requiredSky - nextHeight * .445) / .555, 0, nextHeight * .48) / nextHeight * nextRows);
    if (nextColumns === columns && nextRows === rows && currentPadding === padding &&
        nextWidth === width && nextHeight === height) return;

    width = nextWidth;
    height = nextHeight;
    columns = nextColumns;
    rows = nextRows;
    currentPadding = padding;
    canvas.width = sampler.width = columns;
    canvas.height = sampler.height = rows;
    hero.style.setProperty('--grid-x', width / columns + 'px');
    hero.style.setProperty('--grid-y', height / rows + 'px');
    context.imageSmoothingEnabled = false;

    const cropWidth = Math.min(photograph.naturalWidth, photograph.naturalHeight * Math.max(.88, width / height));
    const cropLeft = (photograph.naturalWidth - cropWidth) * .63;
    // Expand the original sky when the heading needs extra room. Its clouds
    // remain continuous with the coastline instead of introducing a flat seam.
    const skySourceHeight = photograph.naturalHeight * .4;
    const skyRows = Math.round(padding + (rows - padding) * .4);
    sampleContext.drawImage(photograph, cropLeft, 0, cropWidth, skySourceHeight,
      0, 0, columns, skyRows);
    sampleContext.drawImage(photograph, cropLeft, skySourceHeight, cropWidth, photograph.naturalHeight - skySourceHeight,
      0, skyRows, columns, rows - skyRows);

    const pixels = sampleContext.getImageData(0, 0, columns, rows).data;
    imageData = context.createImageData(columns, rows);
    base = new Uint32Array(columns * rows);
    output = new Uint32Array(imageData.data.buffer);
    regions = new Uint8Array(base.length);
    waterStart = rows;
    const skyline = new Float32Array(columns);
    const shoreline = new Float32Array(columns);
    for (let x = 0; x < columns; x++) {
      const sourceX = (cropLeft + (x + .5) * cropWidth / columns) / photograph.naturalWidth;
      skyline[x] = boundaryAt(ridge, sourceX);
      shoreline[x] = boundaryAt(shore, sourceX);
    }

    for (let y = 0; y < rows; y++) {
      const sourceY = y < skyRows ? y / skyRows * .4 : .4 + (y - skyRows) / (rows - skyRows) * .6;
      for (let x = 0; x < columns; x++) {
        const index = y * columns + x;
        const r = pixels[index * 4];
        const g = pixels[index * 4 + 1];
        const b = pixels[index * 4 + 2];
        const light = (.2126 * r + .7152 * g + .0722 * b) / 255;
        const grain = ((Math.imul(x + 3, 73856093) ^ Math.imul(y + 7, 19349663)) >>> 0) / 4294967296;
        const dither = .72 * (threshold[(y % 4) * 4 + x % 4] + .5) / 16 + .28 * grain;

        if (sourceY < skyline[x]) {
          base[index] = shade(palettes.sky, .15 + light * .83, dither);
        } else if (sourceY > shoreline[x] || (sourceY > .675 && g > r * 1.05 && b > r * 1.05)) {
          regions[index] = 2;
          waterStart = Math.min(waterStart, y);
          base[index] = shade(palettes.water, light * 1.17, dither);
        } else {
          regions[index] = 1;
          const palette = g > r * .93 && b < g * .77 ? palettes.plants : palettes.stone;
          base[index] = shade(palette, (light - .07) * 1.24, dither);
        }
      }
    }
    pointer.strength = pointer.target = 0;
    ripple = null;
    paintStill();
    canvas.classList.add('ready');
    syncMotion();
  }

  function paintStill() {
    if (!imageData) return;
    output.set(base);
    context.putImageData(imageData, 0, 0);
  }

  function waterMotion(now, strength) {
    for (let y = waterStart; y < rows; y++) {
      const wave = Math.sin(y * .55 - now * .0017) * strength;
      const row = y * columns;
      for (let x = 0; x < columns; x++) {
        const index = row + x;
        if (regions[index] !== 2) continue;
        const offset = Math.round(wave + Math.sin(x * .14 + y * .25 + now * .001) * strength);
        const neighbour = row + clamp(x + offset, 0, columns - 1);
        if (regions[neighbour] === 2) output[index] = base[neighbour];
      }
    }
  }

  function warpPixel(x, y, dx, dy, distance, displacement) {
    const sampleX = clamp(Math.round(x - dx * displacement / (distance + 1)), 0, columns - 1);
    const sampleY = clamp(Math.round(y - dy * displacement / (distance + 1)), 0, rows - 1);
    output[y * columns + x] = base[sampleY * columns + sampleX];
  }

  function pointerMotion(now, strength) {
    pointer.strength += (pointer.target - pointer.strength) * .2;
    if (pointer.strength < .015) return;
    const radius = Math.min(33, Math.max(21, columns * .12));
    const power = pointer.strength * strength;
    for (let y = Math.max(0, Math.floor(pointer.y - radius)); y <= Math.min(rows - 1, Math.ceil(pointer.y + radius)); y++) {
      for (let x = Math.max(0, Math.floor(pointer.x - radius)); x <= Math.min(columns - 1, Math.ceil(pointer.x + radius)); x++) {
        const dx = x - pointer.x;
        const dy = y - pointer.y;
        const distance = Math.hypot(dx, dy);
        if (distance >= radius) continue;
        const falloff = (1 - distance / radius) ** 2;
        const displacement = power * falloff * (4 + 3.5 * Math.sin(distance * .34 - now * .007));
        warpPixel(x, y, dx, dy, distance, displacement);
        if (regions[y * columns + x] === 0 && distance < radius * .82 &&
            Math.abs(Math.sin(distance * .37 - now * .004)) > .86 && (x + y) % 4 === 0 && power > .28) {
          output[y * columns + x] = rippleColours[0];
        }
      }
    }
  }

  function expandingRipple(now, strength) {
    if (!ripple) return;
    const progress = (now - ripple.start) / 1200;
    if (progress >= 1) {
      ripple = null;
      return;
    }
    const radius = 2 + progress * Math.min(70, Math.max(columns, rows) * .52);
    const band = 6;
    const extent = radius + band;
    for (let y = Math.max(0, Math.floor(ripple.y - extent)); y <= Math.min(rows - 1, Math.ceil(ripple.y + extent)); y++) {
      for (let x = Math.max(0, Math.floor(ripple.x - extent)); x <= Math.min(columns - 1, Math.ceil(ripple.x + extent)); x++) {
        const dx = x - ripple.x;
        const dy = y - ripple.y;
        const distance = Math.hypot(dx, dy);
        const offset = distance - radius;
        if (Math.abs(offset) >= band) continue;
        const displacement = Math.cos(offset / band * Math.PI / 2) * Math.sin(offset * .55) * 6 * strength * (1 - progress);
        warpPixel(x, y, dx, dy, distance, displacement);
        if (Math.abs(offset) < 1.6 && (x + y) % 3 === 0) {
          const index = y * columns + x;
          output[index] = rippleColours[regions[index]];
        }
      }
    }
  }

  function animate(now) {
    frame = 0;
    if (!animating()) return;
    if (now - lastPaint >= 33) {
      const strength = window.portfolioScene?.intensity === 'calm' ? .5 : 1;
      output.set(base);
      waterMotion(now, strength);
      pointerMotion(now, strength);
      expandingRipple(now, strength);
      context.putImageData(imageData, 0, 0);
      lastPaint = now;
    }
    frame = requestAnimationFrame(animate);
  }

  function syncMotion() {
    const stopped = paused();
    motionButton.textContent = stopped ? 'Play motion' : 'Pause motion';
    motionButton.disabled = reducedMotion.matches;
    motionButton.title = reducedMotion.matches ? 'Reduced motion is enabled on your device' : '';
    rippleButton.disabled = !imageData || stopped;
    if (animating()) {
      if (!frame) frame = requestAnimationFrame(animate);
    } else {
      cancelAnimationFrame(frame);
      frame = 0;
      pointer.target = pointer.strength = 0;
      ripple = null;
      paintStill();
    }
  }

  function localPoint(event) {
    const bounds = hero.getBoundingClientRect();
    return {
      x: clamp((event.clientX - bounds.left) / bounds.width * columns, 0, columns - 1),
      y: clamp((event.clientY - bounds.top) / bounds.height * rows, 0, rows - 1)
    };
  }

  function startRipple(point) {
    if (!animating()) return;
    ripple = {...point, start: performance.now()};
  }

  hero.addEventListener('pointermove', event => {
    if (!animating() || event.pointerType === 'touch') return;
    Object.assign(pointer, localPoint(event));
    pointer.target = 1;
  }, {passive: true});
  hero.addEventListener('pointerleave', () => { pointer.target = 0; });
  hero.addEventListener('pointerdown', event => {
    if (event.button === 0 && !event.target.closest('a, button, .landscape-copy')) startRipple(localPoint(event));
  }, {passive: true});
  rippleButton.addEventListener('click', () => startRipple({x: columns * .46, y: rows * .72}));
  motionButton.addEventListener('click', () => document.querySelector('#desktop-motion').click());
  document.addEventListener('portfolio:motion', syncMotion);
  document.addEventListener('portfolio:wallpaper', syncMotion);
  document.addEventListener('visibilitychange', syncMotion);
  reducedMotion.addEventListener('change', syncMotion);

  const resize = new ResizeObserver(rebuild);
  resize.observe(hero);
  resize.observe(copy);
  const intersection = new IntersectionObserver(entries => {
    inView = entries[0].isIntersecting;
    syncMotion();
  });
  intersection.observe(hero);
  photograph.addEventListener('load', rebuild, {once: true});
  photograph.addEventListener('error', () => { rippleButton.disabled = true; }, {once: true});
  photograph.src = new URL(canvas.dataset.source, document.baseURI).href;
  syncMotion();
})();
