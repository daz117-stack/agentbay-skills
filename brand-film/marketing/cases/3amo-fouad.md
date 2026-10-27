# Case #1: 3amo Fouad (عمو فؤاد)

**Status:** Live since about 24 Oct 2026, with no complaints after 3 days (founders, 27 Oct). OK to show as Firststone portfolio work: the owner, Mostafa, is a friend and has agreed.
**Client relationship:** Friends-and-family project. Paid in kind (dinner, and Mostafa is covering Hamdy's Claude subscription), so **there is no price data point** from this job.
**Hosting:** Cloudflare Pages at `https://3amo-fouad-menu.pages.dev`, set up by Hamdy (see `../../product/qr-menu-how-it-works.md`).
**Client files:** not committed here yet. Add a sample copy under `cases/3amo-fouad/` for the portfolio (see §6).

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

**QR ordering page (mobile, Arabic).** Built and shared, **not yet at the QR address (check with Hamdy).**
- 12 category tabs that follow the scroll, and search that matches Arabic spelling variants
- About 90 items, each with its sizes and prices
- Cart with quantities and a running total, kept if the page reloads
- Pickup (New Cairo branch) or delivery, with name, address and notes
- **Send on WhatsApp** opens the restaurant's WhatsApp with the order written out: items, sizes, quantities, line totals, total, pickup or delivery. The delivery fee follows once the address is known.
- Light and dark mode, readable with screen readers and a keyboard

## 3. Product notes and decisions

| # | Note | Decision / status |
|---|---|---|
| 1 | Every price lives in two places (ordering page and PDF). **Already drifted:** the live PDF has «بطاطس تومية كاتشب» (35 EGP), which the ordering page doesn't | **Decided:** one place to update, either a single menu or one data source that feeds both. To build before the ordering page goes live |
| 2 | Pickup offers only the New Cairo branch | **Correct as is.** North Coast is seasonal (June to early Oct). Before June, add a branch choice or a second page for the summer |
| 3 | Delivery fee is decided after the order, which adds a round trip on WhatsApp | **To discuss with Mostafa:** fee per area on the page, or a ready quick reply |
| 4 | Link preview shows a bare title | **Decided:** add a proper title and a preview image (the cover) |
| 5 | Fonts load from Google; slower on weak signal | Minor; host fonts with the page when convenient |
| 6 | No Firststone credit on the client's work | **Decided:** Firststone doesn't put a "Made by Firststone" credit on client deliverables. Show the work in Firststone's own portfolio instead |
| 7 | The QR opens a 6.3 MB PDF | Heavy on weak mobile data. When the ordering page goes live, make it the main page and keep the PDF one tap away |

## 4. Permission

- [x] OK to show the name, menu and ordering page as Firststone portfolio work (Mostafa, friend, agreed)
- [ ] Recommended: one WhatsApp line from Mostafa saying so, saved. It costs nothing, and the cover shows his portrait.
- [ ] One quote in his words after a few weeks
- [ ] A number, if he's willing: e.g., WhatsApp orders per week before vs after **[NEED]**

## 5. Case draft

**Headline:** 3amo Fouad: a printed menu and a QR menu in one look

**Before:** **[NEED: how orders and the menu worked before. Ask Mostafa.]**

**What we set up:** An illustrated printed menu with a QR code that opens the menu on any phone, no app needed. Next step: the ordering page, where customers pick items and sizes and send the order to the restaurant's WhatsApp, written out with the total.

**After:** Live since late October 2026. **[NEED: Mostafa's quote; a number if available.]**

**Arabic (Instagram caption draft):**
> «عمو فؤاد: منيو مطبوع بنفس روح المكان، وعليه QR يفتح المنيو على أي موبايل من غير أبليكيشن. [جملة من مصطفى]»

## 6. Using it as a sample for other customers

- **Portfolio copy:** a sample copy (`cases/3amo-fouad/`, or a Firststone-hosted demo) of the ordering page that **sends orders to Firststone's own WhatsApp number**, so demos don't land in Mostafa's real order chat.
- **In sales visits:** show the live printed menu via the QR, then the demo ordering page. Let the owner add two items and press Send.
- **On the website and Instagram:** cover image, a page or two, and a screen recording of an order being sent (from the demo copy).
