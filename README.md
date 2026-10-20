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

The flow is: Buy Pro → Dodo Checkout → payment → success.html → copy the license → activate through the existing extension license service. Dodo currently displays **Zema Tools** as the checkout brand. The website explains that relationship; this change does not rename the payment account or alter its price configuration. Confirm that the live checkout itself charges the approved $5.99 price before release.

## Purchase recovery and trust boundary

Dodo documents `payment_id`, `status`, `email` and `license_key` as return parameters for static payment links. This website displays a single well-formed key only from the current return with `status=succeeded` and a payment reference. It rejects ambiguous duplicate fields, incomplete states and multiple-key payloads. Email is not displayed or cached. Return parameters are removed from browser history, and legacy purchase cache entries are deleted. Leaving the page clears the displayed key, including when returning through the browser's back/forward cache.

**A return URL is not proof of payment.** The page describes what checkout reported; it cannot independently authenticate a purchase. It never unlocks Pro. Existing server-side license validation in the extension remains responsible for entitlement. Do not add client-side success flags, cached licenses or secrets as substitutes for that validation.

Recovery, Spam/Junk guidance and support remain visible in every state. After a successful purchase Dodo sends the license to the checkout email address. Copy has success feedback and a manual fallback when clipboard permissions are blocked.

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

## Release verification still required

- Use the existing private Internal QA 100% discount in the actual live checkout. Confirm the final total is zero before submitting. Never make a charged test purchase and never commit the private code.
- Confirm the actual return parameters, license display, backup email and activation in the existing extension. Automated synthetic-return tests do not verify Dodo delivery or real entitlement.
- Inspect the Firefox, Edge and Opera release packages and confirm their purchase URL uses the same live product and success redirect. Those packages are outside this repository.
- Review the Dodo **Zema Tools** branding and store developer/contact details against the website’s Amanuel Yohannes credit. These external settings are unchanged.
- Review the website in each target browser. The screenshots are genuine images from the published Firefox listing; they may show an older extension version. Replace them with approved current-release screenshots when available.

## Design and assets

The layout follows the spacing, typography and simplicity of the Runseta reference while preserving Font Smooth's logo and purple accent. Inter is self-hosted; its SIL Open Font License is in `assets/Inter-LICENSE.txt`. Product screenshot links point to the genuine Mozilla listing images. There are no application runtime dependencies, trackers or animation libraries. Test dependencies are development-only.

## Support and privacy

[Email Amanuel Yohannes](mailto:serviceamanuel@gmail.com?subject=Font%20Smooth%20support): **serviceamanuel@gmail.com**.

Typography preferences stay in browser storage. Font Smooth does not send the text you read to the developer. See [Privacy](privacy.html), [Terms](terms.html) and [Refunds](refunds.html) for the existing licensing, payment and support terms.
