# How the QR menu works (Cloudflare, QR code, WhatsApp)

Plain explanation for the founders, based on the 3amo Fouad build, a check of both live sites and Hamdy's ordering source, all on 2026-10-27. **Fact** = checked; **inference** = deduced from what the site returns, to confirm with Hamdy.

---

## 1. The three pieces

```
 Printed menu ──(QR code = a web address)──▶ Cloudflare Pages ──▶ customer's phone browser
                                                                   │
                                     ordering page builds the order text
                                                                   ▼
                                      wa.me link ──▶ WhatsApp opens on the customer's phone
                                                     with the order typed in ──▶ customer taps Send
                                                                   ▼
                                                     restaurant's WhatsApp receives a normal chat
```

This is the **simple version**: no server program, no database, no WhatsApp integration. That is why it is cheap and hard to break.

3amo Fouad's live ordering site now runs the **server version** (§6): the server saves each order and WhatsApp carries only a reference. Which one Firststone sells by default is a founders' decision.

---

## 2. Cloudflare Pages: where the menu lives

**What it is.** A free static-website host. You give it files (an HTML page, images, a PDF); it stores copies on Cloudflare's network around the world and serves them over HTTPS at an address like `something.pages.dev`. "Static" means the files are sent as they are; nothing runs on the server.

**What 3amo Fouad uses (fact, from the live site):**
- Address: `https://3amo-fouad-menu.pages.dev`, served by Cloudflare
- Opening the address **redirects to `/menu.pdf`**, the 4-page PDF menu (6.3 MB)
- Other paths show a lightweight page made of the 4 menu pages as images
- The redirect is most likely a `_redirects` file in the project, a one-line Cloudflare Pages rule like `/ /menu.pdf 302` (**inference**)

**How Hamdy updates it (inference; usual Pages workflows):**
- **Upload:** in the Cloudflare dashboard, drag a folder with the new files onto the project. Each upload is a new "deployment"; earlier ones are kept and can be restored in one click.
- **Or connected to a Git repository:** each push publishes automatically. Codex-based setups often do this.

**Why it can be shared:** the `pages.dev` address is public. Anyone with the link or the QR can open it, which is the point.

**Things to settle:**
- **Whose account?** If it sits in Hamdy's personal Cloudflare account, move it to a Firststone account that both founders can open, with two-factor login. A client's live menu shouldn't depend on one person's login.
- **Free plan limits** are generous for a menu, but check the current limits on Cloudflare's site rather than assuming.

---

## 3. The QR code: just a printed web address

**Fact:** the QR on the 3amo Fouad cover decodes to `https://3amo-fouad-menu.pages.dev`.

A QR code is the web address drawn as squares. It doesn't contain the menu, and it doesn't "connect" to anything. Any free QR generator makes one from a URL.

**The one rule that matters:** printed QRs can't be updated, so **the address must never change.** Change what's at the address (new PDF, new page) as often as you like; never rename the project or move to a different address, or every printed menu and table sticker stops working.

**Recommendation for new clients:** point the QR to an address Firststone controls for good, e.g. `menu.<firststone-domain>/<client>` once the domain is bought (after name clearance), or keep each client's `pages.dev` project name fixed forever. A short address you own also lets you move hosts later without reprinting.

---

## 4. The WhatsApp connection: a pre-filled link

*This section describes the simple version, which 3amo Fouad ran until 27 Oct. The live site now works as in §6.*

**Fact, from the ordering page's code:** the page uses WhatsApp's public "click to chat" link format, `https://wa.me/<number>?text=<message>`.

1. The customer adds items; the cart (items, sizes, quantities, total) is kept in the customer's own browser.
2. On **Send on WhatsApp**, the page writes the order out as text: items, sizes, quantities, line totals, total, pickup or delivery, name, address, notes.
3. It puts that text into the `wa.me` link and opens it.
4. WhatsApp opens on the customer's phone, in a chat with the restaurant's number, with the order already typed. **The customer presses Send.**
5. The restaurant receives a normal WhatsApp message.

**What this means:**
- **Costs nothing and needs no approval from Meta.** It is not the WhatsApp Business API; it's a link.
- **Orders live only in WhatsApp chats.** There is no order list, report or database. Fine for now; a kitchen screen or order log would be the paid upgrade later.
- **The customer must press Send.** If they don't, no order. The restaurant should confirm every order with a quick reply (`../marketing/05-whatsapp-playbook.md` §6).
- **The number is written into the page.** Changing the restaurant's WhatsApp number means updating the page.

---

## 5. What's live (updated 2026-10-27)

| Address | What it does | Fact |
|---|---|---|
| `https://3amo-fouad-menu.pages.dev` | **The printed QR's address.** Redirects to `/menu.pdf` (6.3 MB) | Checked live |
| `https://3amo-fouad.pages.dev/` | Ordering site, server version (§6). Deployed 27 Oct | Checked live; source shared by Hamdy |
| `https://staff.3amo-fouad.pages.dev/staff/` | Staff order lookup. Redirects to a Cloudflare sign-in | Checked live |

**The gap:** the QR leads to the PDF, not the ordering site. Hamdy's notes say the menu-download project and its QR were deliberately left untouched. Nothing on the printed menu sends a customer to the ordering site.

**Menu drift is closed for prices.** The PDF, the site's page and the server price list agree on all 109 item-size prices. Four names differ (`../clients/3amo-fouad/README.md`).

**Before the QR leads to ordering:**
1. In the `3amo-fouad-menu` project, change the redirect target from `/menu.pdf` to the ordering site, and keep the PDF one tap away. The QR address stays the same, so no reprint. Changing what's behind the address keeps the "never change the URL" rule.
2. Settle the staff lookup (§6 *Things to settle*) with Mostafa's counter.
3. Add the page title and preview image so the link looks right when shared.
4. Test on Android **and iPhone**: scan the printed QR, add items, save, send the reference, look it up at the counter.

---

## 6. The server version (3amo Fouad's ordering site)

```
 phone ──items + quantities only──▶ Cloudflare Worker ──checks prices──▶ D1 database (saved order)
   ▲                                          │
   └──── reference AF-… + confirmed total ◀───┘
   │
   └─▶ wa.me link with «طلب جديد رقم AF-…» ──▶ customer taps Send ──▶ restaurant's WhatsApp
                                                                         │
            staff lookup page (Cloudflare Access sign-in) ◀── paste reference
```

**What changes from the simple version (fact, from Hamdy's source and reports):**
- **Prices can't be changed by the customer.** The phone sends only item ids and quantities; the server prices the order. In the simple version, a customer could edit the typed WhatsApp message before sending.
- **Orders are saved** in a Cloudflare D1 database: items, prices, total, name, address, notes, status (`new` for now; no screen changes it yet). There's an order record, but no order list: staff look orders up one reference at a time.
- **Staff need a sign-in.** The lookup page is behind Cloudflare Access with an emailed code, and only allow-listed emails get in.
- **Abuse limits:** at most 10 orders per customer and 200 in total per 10 minutes.
- **Rollback** to the simple version is one click in Cloudflare (Hamdy's README names the deployment). Saved orders stay.
- **Still free** on Cloudflare's plan as built; no paid service was added.

**Things to settle:**
- **Counter workload.** Every order needs a lookup to see its items. Try it at rush hour with whoever takes orders before the QR leads here.
- **Who can sign in.** One allow-listed email today. The restaurant needs its own.
- **Retention.** Orders are kept with no deletion date. Pick a period with Mostafa.
- **Account security.** Two-factor login on the Cloudflare account is off (deferred). The account now holds customer names and addresses.
- **Upkeep.** The server version has tests, a build step and secrets. It's more work to copy to client #2 than a page, so it should be priced as more.
