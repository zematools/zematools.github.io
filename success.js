(() => {
  'use strict';
  // Capture only this navigation's data. Remove the legacy cross-purchase cache.
  let model = FontSmoothCheckout.parseCheckoutReturn(location.search);
  for (const name of ['fontSmoothPurchaseLicense', 'fontSmoothPurchaseEmail', 'fontSmoothPurchaseStatus']) {
    try { sessionStorage.removeItem(name); } catch (_) { /* Storage can be blocked. */ }
  }
  // Do not retain keys or email in browser history, analytics or outgoing links.
  try { history.replaceState(null, '', location.pathname); } catch (_) {}
  let copyTimer;
  let generation = 0;
  const messages = {
    key: ['Activate Pro', 'Your key is ready to copy.', 'Copy the license key below, then open Font Smooth to activate Pro. Keep the license email for future installations.'],
    'missing-key': ['Check your email', 'Your key isn’t shown here.', 'Check the email address you used at checkout for your license. If you have a purchase receipt but no key, follow the steps below. You do not need to buy again.'],
    pending: ['Payment pending', 'Your payment may still be processing.', 'Check your Dodo receipt or email before starting another purchase. If you have a receipt but no license, contact support.'],
    incomplete: ['Checkout incomplete', 'Checkout was not completed.', 'If you believe your payment went through, check your receipt and contact support before trying again.'],
    unconfirmed: ['Purchase not confirmed', 'We can’t confirm this purchase here.', 'Check your Dodo receipt and license email, or contact support using the steps below.'],
    missing: ['License help', 'Find your Font Smooth Pro license.', 'Already bought Pro? Use the email address you entered at checkout to find your license. You do not need to buy again.']
  };
  function render() {
    const [status, title, lead] = messages[model.state];
    document.getElementById('successStatus').textContent = status;
    document.getElementById('successTitle').textContent = title;
    document.getElementById('successLead').textContent = lead;
    document.getElementById('licenseBox').hidden = model.state !== 'key';
    document.getElementById('licenseKey').value = model.key;
    document.getElementById('copyLicense').disabled = model.state !== 'key';
    document.getElementById('copyLicense').textContent = 'Copy key';
    document.getElementById('copyFeedback').textContent = '';
    const steps = document.getElementById('activationSteps');
    if (model.state === 'key') document.getElementById('emailRecovery').before(steps);
    else document.querySelector('.recovery-contact').after(steps);
    // Email recovery and activation instructions remain visible in every state.
  }
  function forget() {
    generation++;
    clearTimeout(copyTimer);
    model = { state: 'missing', key: '', reference: '' };
    if (document.getElementById('licenseKey')) render();
  }
  function init() {
    render();
    const button = document.getElementById('copyLicense');
    const input = document.getElementById('licenseKey');
    const feedback = document.getElementById('copyFeedback');
    button.addEventListener('click', async () => {
      if (model.state !== 'key' || !model.key) return;
      const current = generation;
      const key = model.key;
      let copied = false;
      try {
        if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
        await navigator.clipboard.writeText(key);
        copied = true;
      } catch (_) {
        if (current !== generation) return;
        input.focus();
        input.select();
        try { copied = document.execCommand('copy') === true; } catch (_) {}
      }
      if (current !== generation) return;
      if (copied) {
        feedback.textContent = 'Copied. Paste it into Font Smooth to activate Pro.';
        button.textContent = 'Copied';
        clearTimeout(copyTimer);
        copyTimer = setTimeout(() => { button.textContent = 'Copy key'; }, 2000);
      } else {
        input.focus();
        input.select();
        feedback.textContent = 'Copy was blocked. The key is selected; use your browser’s Copy command or press Ctrl+C (Command+C on Mac).';
      }
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
  // Back/forward cache must not resurrect a key after another purchase.
  window.addEventListener('pagehide', forget);
  window.addEventListener('pageshow', event => { if (event.persisted) forget(); });
})();
