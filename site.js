(() => {
  const target = document.querySelector('[data-live-type]');
  if (!target) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reducedMotion.matches) return;

  const fontStates = [
    { family: '"Instrument Serif", Georgia, serif', style: 'italic', weight: '400' },
    { family: '"Lora", Georgia, serif', style: 'italic', weight: '400' },
    { family: '"DM Sans", Inter, Arial, sans-serif', style: 'italic', weight: '500' },
    { family: '"Manrope", Inter, Arial, sans-serif', style: 'normal', weight: '500' }
  ];

  let index = 0;
  let timer = null;

  const applyState = (state) => {
    target.style.fontFamily = state.family;
    target.style.fontStyle = state.style;
    target.style.fontWeight = state.weight;
  };

  const switchFont = () => {
    if (document.hidden) return;

    target.classList.add('is-switching');
    window.setTimeout(() => {
      index = (index + 1) % fontStates.length;
      applyState(fontStates[index]);
      window.requestAnimationFrame(() => target.classList.remove('is-switching'));
    }, 160);
  };

  const start = () => {
    if (timer !== null) return;
    timer = window.setInterval(switchFont, 2600);
  };

  const stop = () => {
    if (timer === null) return;
    window.clearInterval(timer);
    timer = null;
  };

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
    else start();
  });

  reducedMotion.addEventListener?.('change', (event) => {
    if (event.matches) {
      stop();
      target.classList.remove('is-switching');
      applyState(fontStates[0]);
    } else {
      start();
    }
  });

  start();
})();
