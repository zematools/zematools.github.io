# Font Smooth

Font Smooth by **Amanuel Yohannes** changes website fonts, text size, line height and letter spacing. This repository contains the static product website; it does not contain the extension builds or license service.

## Install

- [Firefox](https://addons.mozilla.org/firefox/addon/font-smooth/)
- [Microsoft Edge](https://microsoftedge.microsoft.com/addons/detail/font-smooth/cjlipbnnehajonaealcogpnlbedjneii)
- [Opera](https://addons.opera.com/en/extensions/details/font-smooth/)

## Free and Pro

Free includes typography controls, three website profiles, three presets and one custom font. **Pro is $5.99 USD one-time, with no subscription**. It includes unlimited website profiles and presets, up to 20 custom fonts, separate fonts for Body, Headings and Code, and backup and restore. The existing limit remains five active browser installations per license. Checkout displays applicable taxes and the final total.

The existing live Dodo product is unchanged: `pdt_0Nno8gkTr9QPA5THt1474`.

[Buy Font Smooth Pro](https://checkout.dodopayments.com/buy/pdt_0Nno8gkTr9QPA5THt1474?quantity=1&redirect_url=https%3A%2F%2Fzematools.github.io%2Fsuccess.html)

The flow is: Buy Pro → Dodo Checkout → payment → success.html → copy the license → open Font Smooth → Settings → Activate a license → paste the key → Activate. Dodo currently displays **Zema Tools** as the checkout brand. The website explains that relationship; this change does not rename the payment account or alter its price configuration. Confirm that the live checkout itself charges the approved $5.99 price before release.

## Purchase recovery and trust boundary

Dodo documents `payment_id`, `status`, `email` and `license_key` as return parameters for static payment links. This website displays a single well-formed key only from the current return with `status=succeeded` and a payment reference. It rejects ambiguous duplicate fields, incomplete states and multiple-key payloads. Email is not displayed or cached. Return parameters are removed from browser history, and legacy purchase cache entries are deleted. Leaving the page clears the displayed key, including when returning through the browser's back/forward cache.

**A return URL is not proof of payment.** The page describes what checkout reported; it cannot independently authenticate a purchase. It never unlocks Pro. Existing server-side license validation in the extension remains responsible for entitlement. Do not add client-side success flags, cached licenses or secrets as substitutes for that validation.

“Find my license” is available in navigation, beside the purchase steps and in the footer. Recovery, Spam/Junk and Promotions guidance, exact activation steps and support remain visible in every return state. Customers are told not to buy again and to contact support with their checkout email and receipt reference (if available), never card details or a full license key. There is no public customer-portal link configured yet, and the static website does not resend email. Support recovery currently uses serviceamanuel@gmail.com. After a successful purchase Dodo sends the license to the checkout email address. Copy has success feedback and a manual fallback when clipboard permissions are blocked.

## Preview and checks

No build step is required. Serve the repository with any static HTTP server, for example `python3 -m http.server 8080`, then open http://localhost:8080. Open `success.html` directly to review missing-purchase recovery. Never put a real license or private QA code in screenshots, commits or public logs.

The pull-request workflow runs static and browser checks and uploads a **website-review** artifact containing the static preview and screenshots. It does not publish or deploy the website. The preview can also be downloaded as the branch ZIP and served locally.

Development checks:

```sh
npm install
npx playwright install chromium firefox
npm test
```

Browser checks cover mobile/tablet/desktop overflow, internal links, JavaScript errors, keyboard navigation, FAQ, screenshot dialog, accessibility, copy success/failure, unconfirmed/incomplete/missing-key returns, legacy cache clearing and history clearing. Synthetic keys are test data, not real purchases.

## Release verification

- Use the existing private Internal QA 100% discount in the actual live checkout. Confirm the final total is zero before submitting. Never make a charged test purchase and never commit the private code.
- Confirm the actual return parameters, license display, backup email and activation in the existing extension. Automated synthetic-return tests do not verify Dodo delivery or real entitlement.
- Verified in release 1.1.0.31: Firefox, Edge and Opera purchase links use this same live product, quantity 1 and success redirect. The packages remain outside this repository.
- Review the Dodo **Zema Tools** branding and store developer/contact details against the website’s Amanuel Yohannes credit. These external settings are unchanged.
- Current screenshots are the approved user-provided popup, font picker/import, font roles, website profiles and saved presets captures. Screenshots illustrate the controls; they are not proof of live payment or email delivery. The available-font count includes device fonts and is not advertised as an included-font count.

## Design and assets

The responsive layout uses Font Smooth’s logo, purple accent, light sections and a dark Pro section. Feature explanations are HTML text so they remain readable on mobile; screenshots can be enlarged. Inter is self-hosted; its SIL Open Font License is in `assets/Inter-LICENSE.txt`. Product images are self-hosted under `assets/screenshots/` and captured from the current extension UI. There are no application runtime dependencies, trackers or animation libraries. Test dependencies are development-only.

## Support and privacy

[Email Amanuel Yohannes](mailto:serviceamanuel@gmail.com?subject=Font%20Smooth%20support): **serviceamanuel@gmail.com**.

Typography preferences stay in browser storage. Font Smooth does not send the text you read to the developer. See [Privacy](privacy.html), [Terms](terms.html) and [Refunds](refunds.html) for the existing licensing, payment and support terms.

## October 25, 2026 release cleanup

- Extension support and feedback now open email to serviceamanuel@gmail.com. About names Font Smooth and Amanuel Yohannes; the extra GitHub profile row was removed.
- All three extension builds use version 1.1.0.31; Firefox author metadata is corrected without changing the add-on ID.
- Website images show the current interface with sample data. No personal browsing data, license keys or QA discount codes are included.
- User reported the preceding native Edge, Opera and Firefox feature checks passed. Automated extension UI checks use mocked APIs and do not replace those native results.
- Live payment/email delivery was not rerun in this cleanup. Existing checkout, Worker and license limits are unchanged.

## Purchase-help update

- Plain feature copy and current screenshots, including custom font import, profiles and presets.
- A three-step purchase guide explains email delivery and the exact extension activation controls before checkout.
- Missing, pending, incomplete and valid-key returns retain recovery and support instructions. Return parsing, license validation, price, product and redirect are unchanged.
- Local and CI checks use synthetic keys. The owner’s private 100% discount checkout is the separate live acceptance check: verify a zero total, return-page copy, license email (including Spam/Junk), and activation. No private discount belongs in this repository.
- Optional follow-up: add only the business’s public Dodo customer portal Static Link once provided. Never publish a customer-specific Dynamic Link. Portal login still requires email access.
