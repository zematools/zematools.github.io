/* A checkout return is display data, never proof of payment or entitlement.
   Only the existing extension license service can unlock Pro. */
(function (root) {
  'use strict';
  function parseCheckoutReturn(search) {
    const params = new URLSearchParams(search);
    const result = { state: 'missing', key: '', reference: '' };
    const names = ['status', 'payment_id', 'license_key', 'email'];
    if (!names.some(name => params.has(name))) return result;
    if (names.some(name => params.getAll(name).length > 1)) {
      result.state = 'unconfirmed';
      return result;
    }
    const status = (params.get('status') || '').trim().toLowerCase();
    const reference = params.get('payment_id') || '';
    const key = params.get('license_key') || '';
    if (/^pay_[A-Za-z0-9_-]{1,128}$/.test(reference)) result.reference = reference;
    if (status === 'failed' || status === 'cancelled' || status === 'canceled') {
      result.state = 'incomplete';
      return result;
    }
    if (status === 'processing' || status === 'pending' || status === 'requires_customer_action' || status === 'requires_payment_method') {
      result.state = 'pending';
      return result;
    }
    if (status !== 'succeeded' || !result.reference) {
      result.state = 'unconfirmed';
      return result;
    }
    // Quantity remains 1. Never join or silently choose among multiple keys.
    if (!/^[A-Za-z0-9_-]{8,512}$/.test(key)) {
      result.state = 'missing-key';
      return result;
    }
    result.state = 'key';
    result.key = key;
    return result;
  }
  root.FontSmoothCheckout = Object.freeze({ parseCheckoutReturn });
})(typeof globalThis !== 'undefined' ? globalThis : window);
