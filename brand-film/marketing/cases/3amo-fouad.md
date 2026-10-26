# Case #1: 3amo Fouad (عمو فؤاد)

**Status:** Delivered example. **Not for public use** until the owner gives written permission (§4).
**Client files:** kept out of this repo on purpose (the printed menu PDF and the ordering page). Add them under `cases/3amo-fouad/` only after permission.
**[confirm]** Paying client or pilot? Live URL and who hosts it? Date it went live? Is it in daily use?

---

## 1. The client

Egyptian street-food and grill restaurant: foul, ta'meya, eggs, potato sandwiches, grilled meat and chicken by weight, meals, and an eastern dishes ("sharqi") box range. Two branches listed on the menu: New Cairo (Fifth Settlement, Gardenia Heights, Valley Mall) and the North Coast (km 58). Takes orders on WhatsApp. Brand line on the cover: «الطعم ليه كلمة».

This is the first-fit segment in `../01-marketing-plan.md` §2: takeaway- and delivery-heavy, already ordering over WhatsApp, many items in several sizes.

## 2. What Firststone built

**Printed menu (A4, 4 pages)**
- Illustrated cover: the owner's portrait, a blue door, a speech bubble with the brand line, branches, WhatsApp number, and a QR code to the online menu
- 3 pages of prices in EGP, 12 sections, size columns (quarter / half / kilo; baladi / Syrian bread), "served with" notes on meals
- Footer on every page with the WhatsApp number

**QR ordering page (mobile, Arabic, right-to-left)**
- 12 category tabs that follow the scroll, and search that matches Arabic spelling variants
- About 90 items, each with its sizes and prices
- Cart with quantities and a running total, kept if the page reloads
- Pickup (New Cairo branch) or delivery, with name, address and notes
- **Send on WhatsApp** opens the restaurant's WhatsApp with the order written out: items, sizes, quantities, line totals, total, pickup or delivery, and a note that the delivery fee follows once the address is known
- Light and dark mode, readable with screen readers and a keyboard

## 3. Product notes before using it as the showcase

From a review of the delivered files, most important first:

1. **One source for prices.** The ordering page and the PDF each hold their own copy of every price. On a monthly plan, every price change has to be made twice and checked twice. That's the main delivery cost and the main risk of a wrong price. Recommendation: one menu data file that generates both the page and the print PDF. This matters more than any visual change, because it sets the cost of the monthly plan.
2. **Pickup offers only the New Cairo branch,** but the cover and header list the North Coast branch too. If the North Coast branch takes orders (even only in summer), add a branch choice. If it doesn't, say so on the page.
3. **Delivery fee is decided after the order.** That adds a round trip on WhatsApp for every delivery order. A small zone-and-fee table on the page, or a quick reply ready on the restaurant's side (`../05-whatsapp-playbook.md` §6), would close it faster.
4. **Link preview.** The page title is `3amo-fouad`. When the link is shared on WhatsApp, a proper title («عمو فؤاد | المنيو») and a preview image (the cover) would make it look finished.
5. **Fonts load from Google.** On a weak signal the page falls back to system fonts until they arrive. That's acceptable; hosting the fonts with the page would be smoother.
6. **No Firststone credit.** Add the small "Made by Firststone" line to the page and the PDF's last page if the owner agrees (`../06-referral-program.md` §1).

## 4. Permission checklist (ask the owner)

- [ ] OK to show the restaurant's name, menu and ordering page on Firststone's website, Instagram and in sales visits
- [ ] OK to show the illustrated cover (it includes the owner's portrait)
- [ ] One quote in his words (what changed after the QR menu)
- [ ] OK to share a number, if he's willing: e.g., WhatsApp orders a week before and after **[NEED]**
- [ ] OK to keep the "Made by Firststone" credit on the page and menu
- [ ] Written down: a WhatsApp message from the owner saying yes is enough at this stage; save it

## 5. Case draft (use only after §4)

**Headline:** 3amo Fouad: a printed menu and a QR menu customers order from, in one look

**Before:** **[NEED: how orders arrived before: phone calls, voice notes, unstructured WhatsApp messages? What went wrong?]**

**What we set up:** An illustrated printed menu with a QR code, and a mobile menu with search, sizes and a cart. Customers pick their order and press Send; it reaches the restaurant's WhatsApp written out with the total.

**After:** **[NEED: owner quote and, if available, one number]**

**Arabic (Instagram caption draft):**
> «عمو فؤاد: منيو مطبوع بنفس شكل المحل، وعليه QR. الزبون يختار ويبعت، والطلب يوصل على واتساب مكتوب بالأصناف والإجمالي. [جملة من عمو فؤاد]»

## 6. Using it in sales now (before permission)

Show it in person on your own phone as "a menu we built", without leaving files or screenshots and without posting it. The live page sends orders to the restaurant's number, so make a demo copy that sends to Firststone's own number. Let the owner add two items and press Send so they see the order arrive. Once permission is in, it becomes the public case and the website demo.
