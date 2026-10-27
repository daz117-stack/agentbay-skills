# How the QR menu works (Cloudflare, QR code, WhatsApp)

Plain explanation for the founders, based on the 3amo Fouad build and a check of the live site on 2026-10-27. **Fact** = checked; **inference** = deduced from what the site returns, to confirm with Hamdy.

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

There is no server program, no database and no WhatsApp integration in this. That is why it is cheap and hard to break.

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

## 5. What's live vs what was shared (check with Hamdy)

**Fact:** the QR currently opens the **PDF menu**, not the ordering page with the cart. The ordering page file you shared (`3amo-fouad-reviewed-new.html`) isn't at that address.

**Inference:** the ordering page is the next version, not yet deployed, or it's deployed somewhere else.

**Fact: the two have already drifted.** The live PDF (re-uploaded 26 Oct) lists «بطاطس تومية كاتشب» at 35 EGP, which the ordering page doesn't have. This is the "two places to update" problem from `../marketing/cases/3amo-fouad.md` §3.

**Before switching the QR to the ordering page:**
1. Make one menu data source (items, sizes, prices) and build both the ordering page and the print PDF from it. The PDF was produced from a browser print (its file says Chromium), so the same page can likely print the PDF with a print layout.
2. Check every item and price against the current live PDF.
3. Point the address's main page at the ordering page and keep the PDF one tap away (e.g. "Download menu"). The 6.3 MB PDF is slow on weak mobile data; the ordering page is much lighter.
4. Add the page title and preview image so the link looks right when shared on WhatsApp.
5. Test on Android and iPhone: scan the printed QR, add items, send, and confirm the message arrives correctly.
