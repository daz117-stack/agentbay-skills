# Case #1: 3amo Fouad (عمو فؤاد)

**Status:** Printed menu and QR live since about 24 Oct 2026, no complaints after 3 days (founders, 27 Oct). Ordering site live since 27 Oct, but not yet reachable from the QR. OK to show as Firststone portfolio work: the owner, Mostafa, is a friend and has agreed.
**Client relationship:** Friends-and-family project. Paid in kind (dinner, and Mostafa is covering Hamdy's Claude subscription), so **there is no price data point** from this job.
**Hosting:** two Cloudflare Pages projects, set up by Hamdy (see `../../product/qr-menu-how-it-works.md`):
- `https://3amo-fouad-menu.pages.dev`: the printed QR's address. Redirects to the PDF menu.
- `https://3amo-fouad.pages.dev`: the ordering site, live since 27 Oct 2026 with orders saved on the server. **The QR doesn't lead here yet.**

**Client files:** Hamdy's ordering source (tests, build, security notes) was shared on 27 Oct 2026. It isn't committed here: it holds deployment ids and a staff email. Menu data and the check against the source are in `../../clients/3amo-fouad/`.

---

## 1. The client

Egyptian street-food and grill restaurant run by its founder, Mostafa: foul, ta'meya, eggs, potato sandwiches, grilled meat and chicken by weight, meals, and an eastern dishes ("sharqi") box range. Brand line on the cover: «الطعم ليه كلمة».

- **New Cairo branch** (Fifth Settlement, Gardenia Heights, Valley Mall): open all year; **the current focus**
- **North Coast branch** (km 58): open in summer high season only, June to early October

This is the first-fit segment in `../01-marketing-plan.md` §2: takeaway- and delivery-heavy, already ordering over WhatsApp, many items in several sizes.

## 2. What Firststone built

**Printed menu (A4, 4 pages).** This is what the QR opens today.
- Illustrated cover: Mostafa's portrait, a blue door, a speech bubble with the brand line, branches, WhatsApp number, and the QR code
- 3 pages of prices in EGP, size columns (quarter / half / kilo; baladi / Syrian bread), "served with" notes on meals

**Ordering site (mobile, Arabic).** Live at `https://3amo-fouad.pages.dev/` since 27 Oct 2026. **Not at the QR address**: the printed QR still opens the PDF, so customers can't reach it from the menu yet.
- 13 category tabs that follow the scroll, and search that matches Arabic spelling variants
- 93 items, 109 with sizes counted. Every price matches the printed PDF (checked 27 Oct, `../../clients/3amo-fouad/README.md`)
- Cart with quantities and a running total, kept if the page reloads. Name, address and notes are not kept
- Pickup (New Cairo branch) or delivery, with name, address and notes

**How an order flows (since 27 Oct):**
1. The customer presses **Confirm and save order**. The server checks every item against its own price list, saves the order and returns a reference like `AF-…` with the confirmed total. Prices or totals sent from the phone are ignored.
2. The customer opens WhatsApp from the page. The message is only «طلب جديد رقم AF-…», and the customer presses Send.
3. Staff open a protected lookup page, sign in with an emailed code, paste the reference and see the saved order: items, unit prices, total, pickup or delivery, name, address and notes.
4. The delivery fee is not in the total. The restaurant agrees it with the customer before sending the order.

**Verified by Hamdy's build (fact, from its reports):** 70 automated tests passed; 30 live checks passed; a test pickup and a test delivery were looked up end to end, then marked cancelled. Tested in Chrome on desktop and at phone size. **Not tested on an iPhone or Safari, or by scanning the printed QR.**

## 2a. What went live, in order

| When | What | Where | Notes |
|---|---|---|---|
| ~24 Oct 2026 | **Printed menu + QR: what customers use.** PDF re-uploaded 26 Oct | QR → `3amo-fouad-menu.pages.dev` → `/menu.pdf` | The source for `../../clients/3amo-fouad/menu.json` |
| Before 27 Oct (date [confirm]) | Ordering page, simple version (order written out in WhatsApp) | `3amo-fouad.pages.dev` | Not linked from the QR. All 109 prices matched the PDF. Kept as Cloudflare's rollback deployment |
| 27 Oct 2026 | Ordering site, server version (saved orders, reference in WhatsApp) | Same address, replaced the above | Not linked from the QR. All 109 prices match the PDF |

**Earlier draft, never live:** `3amo-fouad-reviewed.html`. Its menu differed from the PDF: no ta'meya-disc section, an older sharqi section, and 3 Syrian-bread prices higher than printed. These were fixed before the ordering page went live, so the drift noted on 27 Oct was in this draft, not on a live page.

**Files received (chat uploads, 27 Oct; not committed):**
- the live PDF;
- Hamdy's server source, deploy bundle and README;
- the pre-server local project (simple-version page, the draft above, `_headers`);
- 19 restaurant photos. The same photos are in `3amo fouad.rar`: storefront, food, logo; usable for the portfolio with Mostafa's OK.

## 3. Product notes and decisions

| # | Note | Decision / status |
|---|---|---|
| 1 | The menu lives in three hand-edited copies: the PDF, the site's page code and the server price list | **Prices now match in all three** (109 of 109; the earlier «بطاطس تومية كاتشب» gap is closed). 4 wording differences remain. Single source still decided, not built. Until then `../../clients/3amo-fouad/check-menu.mjs` catches drift |
| 2 | Pickup offers only the New Cairo branch | **Correct as is.** North Coast is seasonal (June to early Oct). Before June, add a branch choice or a second page for the summer |
| 3 | Delivery fee is decided after the order, which adds a round trip on WhatsApp | **As built:** agreed with the customer before the order goes out, outside the total. Fee per area on the page is still open with Mostafa |
| 4 | Link preview shows a bare title (still `3amo-fouad` on the live site) | **Decided:** add a proper title and a preview image (the cover). Not done yet |
| 5 | Fonts load from Google; slower on weak signal | Minor; host fonts with the page when convenient |
| 6 | No Firststone credit on the client's work | **Decided:** Firststone doesn't put a "Made by Firststone" credit on client deliverables. Show the work in Firststone's own portfolio instead |
| 7 | The QR opens a 6.3 MB PDF | Heavy on weak mobile data. **Hamdy is checking the PDF size.** When the QR leads to ordering, keep the PDF one tap away |
| 8 | Cheese spelled two ways (موزاريلا once, موتزريلا six times) | **Decided:** موتزريلا everywhere. To fix on the site and in the next print |
| 9 | Cheese add-on (+15) is a line item of its own | **Decided (Mostafa):** keep it that way |
| 10 | «4 أقراص طعمية قماطي» (10) | **Confirmed:** one item, 4 small patties |
| 11 | **The printed QR doesn't lead to the ordering site** | Open. Without it the ordering site gets no customers. Change what's behind the QR address (point it at the ordering site, PDF one tap away), never the address |
| 12 | Every order needs a staff lookup to see what was ordered: sign in, paste reference, read | Open, **check with Mostafa's counter before launch.** Safer against edited WhatsApp messages, but slower at rush hour than an order written out in the chat. Option for Hamdy: the server writes the item list into the WhatsApp message next to the reference; the lookup stays for checking |
| 13 | Staff lookup allows one email today | Open. **Confirm it's an address the restaurant uses.** If it's Hamdy's, the restaurant can't see its own orders without him |
| 14 | Orders (customer name, address, notes) are kept with no deletion date | Open. Pick a retention period with Mostafa. Check what Egypt's data protection law asks of a small shop **[confirm]** |
| 15 | Cloudflare account two-factor login is off (deferred) | Open. Same decision as moving to a Firststone account with two-factor login. More urgent now the account holds customer orders |

## 4. Permission

- [x] OK to show the name, menu and ordering page as Firststone portfolio work (Mostafa, friend, agreed)
- [ ] Recommended: one WhatsApp line from Mostafa saying so, saved. It costs nothing, and the cover shows his portrait.
- [ ] One quote in his words after a few weeks
- [ ] A number, if he's willing: e.g., WhatsApp orders per week before vs after **[NEED]**

## 5. Case draft

**Headline:** 3amo Fouad: a printed menu and a QR menu in one look

**Before:** **[NEED: how orders and the menu worked before. Ask Mostafa.]**

**What we set up:** An illustrated printed menu with a QR code that opens the menu on any phone, no app needed, and an ordering site where customers pick items and sizes, get a confirmed total, and send the order reference to the restaurant's WhatsApp. **[Hold until the QR leads to the ordering site and real orders have come through it.]**

**After:** Live since late October 2026. **[NEED: Mostafa's quote; a number if available.]**

**Arabic (Instagram caption draft):**
> «عمو فؤاد: منيو مطبوع بنفس روح المكان، وعليه QR يفتح المنيو على أي موبايل من غير أبليكيشن. [جملة من مصطفى]»

## 6. Using it as a sample for other customers

- **Portfolio copy:** a demo copy of the ordering site that **sends orders to Firststone's own WhatsApp number and its own database**, so demos don't land in Mostafa's order chat or his order records. The live site counts every saved order against its abuse limits, so never demo on it.
- **In sales visits:** show the live printed menu via the QR, then the demo ordering page. Let the owner add two items and press Send.
- **On the website and Instagram:** cover image, a page or two, and a screen recording of an order being sent (from the demo copy).
