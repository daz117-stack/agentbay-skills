# 3amo Fouad ordering site: change spec (2026-10-28)

**Owner:** Hamdy (build, deploy). **Inputs:** Fady (decisions), Mostafa (wording, counter, retention).
**Scope:** the ordering site (`https://3amo-fouad.pages.dev/`, source with `app.js` + `server/catalog.json`) and the QR project (`3amo-fouad-menu`).
**Order of work:** release 1 → gate checks → release 2 (QR switch). Backlog items have no deadline.

Every change must keep:
- product IDs unchanged;
- `npm test` passing;
- `node check-menu.mjs <source>` exiting 0 (`brand-film/clients/3amo-fouad/check-menu.mjs`, Node 18+).

---

## Release 1: ordering site fixes (one deploy)

### R1.1 Cheese spelling
- **Change:** `discs.3.0` name «قرص كيري أو موزاريلا» → «قرص كيري أو موتزريلا» in `app.js` and `server/catalog.json`.
- **Why:** Mostafa's decision: موتزريلا everywhere.
- **Done when:**
  - both files show the new name;
  - the check lists no name difference for `discs.3.0`;
  - the next PDF print uses the same spelling.

### R1.2 Align three names with the printed menu
| ID | Now on site | Change to | Status |
|---|---|---|---|
| `syrian.0.0` | طعميه | طعمية | [confirm] typo fix |
| `falafel.6.0` | طعمية ميكس جبنة | طعمية ميكس جبن | [confirm] matches print and the other «ميكس جبن» rows |
| `grillsand.6.0` | إضافة جبنة (موتزريلا / رومي / كيري) | keep site wording; update `menu.json` and the next print | [confirm] |

- **Done when:** the wording is confirmed with Mostafa and applied in `app.js`, `catalog.json` and `menu.json`, and the check shows 0 name differences.

### R1.3 Page title and link preview
- **Change:**
  - `<title>` from `3amo-fouad` to «عمو فؤاد | المنيو والطلب» [confirm wording];
  - add `og:title`, `og:description` and `og:image`;
  - `og:image` is the cover, served as a real image file at an absolute HTTPS URL (not a data URI).
- **Done when:** pasting the site link into WhatsApp shows the title and the cover image.

### R1.4 Release checks
- [ ] `npm test` passes.
- [ ] `node check-menu.mjs <source>` exits 0 and reports 0 name differences, or only those still awaiting confirmation.
- [ ] The same bundle is deployed to production and the `staff` preview.

---

## Gate before release 2 (no code; decisions and trials)

### G1 Counter trial
- **What:** at Mostafa's counter during a busy hour, run real-size orders end to end: save order → WhatsApp reference → staff sign-in → lookup.
- **Pass:** staff read each order in an acceptable time [Mostafa to judge].
- **If it fails:** spec change C1 below.

### G2 Staff access
- **What:** confirm who is on `STAFF_EMAILS`. Add an email the restaurant uses daily.
- **Pass:** someone at the restaurant can sign in and look up an order without Hamdy.

### G3 Account security
- **What:** turn on two-factor login on the Cloudflare account. Plan the move to a shared Firststone account.
- **Pass:** two-factor login is on, and recovery codes are stored outside the project.

### G4 PDF size
- **What:** reduce `menu.pdf` from 6.3 MB. The cover image is the likely cause.
- **Pass:** the PDF opens quickly on mobile data. Target [confirm, e.g. under 1.5 MB].

---

## Release 2: point the QR at the ordering site

### R2.1 Redirect
- **Change:** in project `3amo-fouad-menu`, change the root redirect from `/menu.pdf` to `https://3amo-fouad.pages.dev/`.
- **Must not change:** the address `https://3amo-fouad-menu.pages.dev` (it is printed on the QR). Keep `/menu.pdf` reachable at its current path.

### R2.2 PDF link on the ordering site
- **Change:** add a visible "download the menu" link to `https://3amo-fouad-menu.pages.dev/menu.pdf`.

### R2.3 Device test
- [ ] Scan the printed QR → ordering site opens.
- [ ] Add items → save → WhatsApp opens with the reference → send.
- [ ] Staff look the reference up and the items and total match.
- [ ] Repeat on Android and iPhone (Safari). Only Chrome has been tested so far.
- **Rollback:** restore the old redirect target. Saved orders are unaffected.

---

## Change request (only if G1 fails)

### C1 Item list in the WhatsApp message
- **Change:** the server writes the saved items and total into the WhatsApp text next to the reference. Staff lookup stays for verification.
- **Constraint:** the text is built server-side from the saved record, never from browser input.
- **Done when:** staff can prepare an order from the WhatsApp message alone, and the lookup still shows the authoritative record.

---

## Backlog

### B1 Single menu source
- **Problem:** the menu is hand-edited in both `app.js` and `catalog.json`, and IDs are list positions. Inserting an item mid-section in one file mislabels orders.
- **Change:** one menu file generates the `app.js` menu, `catalog.json` and the print page at build time. `menu.json` already carries the product IDs.
- **Interim rule:** add new items only at the end of a section; retire old ones as inactive; run the check before every deploy and reprint.

### B2 Order retention
- **What:** agree a retention period with Mostafa. Then implement deletion or anonymisation of older orders.
- **Note:** check what Egypt's data protection law asks of a business this size [confirm].
