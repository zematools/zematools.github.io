(() => {
  const target = document.querySelector('[data-live-type-accent]');
  if (!target) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const fontStates = [
    {
      className: 'live-type-accent-instrument',
      load: '400 96px "Instrument Serif"'
    },
    {
      className: 'live-type-accent-inter',
      load: '500 96px "Inter"'
    },
    {
      className: 'live-type-accent-mono',
      load: '400 80px "JetBrains Mono"'
    }
  ];

  let index = 0;
  let timer = null;

  const applyState = (state) => {
    target.classList.remove(...fontStates.map((item) => item.className));
    target.classList.add(state.className);
  };

  const switchFont = () => {
    if (document.hidden || reducedMotion.matches) return;
    index = (index + 1) % fontStates.length;
    applyState(fontStates[index]);
  };

  const start = () => {
    if (timer !== null || reducedMotion.matches) return;
    timer = window.setInterval(switchFont, 2500);
  };

  const stop = () => {
    if (timer === null) return;
    window.clearInterval(timer);
    timer = null;
  };

  const preloadFonts = async () => {
    if (!document.fonts?.load) return;
    await Promise.allSettled(fontStates.map((state) => document.fonts.load(state.load)));
  };

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
    else start();
  });

  reducedMotion.addEventListener?.('change', (event) => {
    if (event.matches) {
      stop();
      index = 0;
      applyState(fontStates[0]);
    } else {
      start();
    }
  });

  applyState(fontStates[0]);
  preloadFonts().finally(start);
})();
