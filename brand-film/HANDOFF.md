# Handoff — 2026-10-28 (second session)

## Session Summary

Continued Firststone go-to-market on 3amo Fouad. This session:
- turned the live PDF menu into one data file;
- received Hamdy's ordering source and found it already live on a separate address, with orders now saved on a server;
- checked all three menu copies against each other;
- recorded Mostafa's menu decisions;
- updated the case file, the QR explainer and the marketing context (v4);
- wrote the fixes for Hamdy as a message (Arabic + English) and as a change spec.

PR [#3](https://github.com/daz117-stack/agentbay-skills/pull/3) is stacked on PR #2.

## Next-Session Focus

1. Send Hamdy the message or the spec (not sent yet), then track it: release 1 → gate checks → release 2 (QR switch).
2. Make the printed QR lead to the ordering site (spec R2). Change the redirect behind `3amo-fouad-menu.pages.dev`; never change the address.
3. Settle the counter workflow and staff access with Mostafa before that switch (spec G1, G2).
4. Founders decide: simple or server ordering as the default offer. Then set prices.
5. Owner conversations, then the website.

## Current State

- **Done:**
  - `brand-film/clients/3amo-fouad/menu.json`: 93 items, 109 item-sizes, in print order, keyed by the ordering site's product ids.
  - `check-menu.mjs`: compares `menu.json` with the site's `app.js` menu and `server/catalog.json`.
  - Last run: 0 id/size/price differences, 4 name differences.
  - Case file, QR explainer (§5, §6) and `product-marketing.md` (v4) updated with the live state.
  - `message-to-hamdy.md`: the fixes as a message, Egyptian Arabic and English, 11 points. **Draft, not sent.** Read its two "before sending" notes first.
  - `ordering-site-spec.md`: the same content as a change spec with done-when criteria:
    - release 1: names, title and preview;
    - gate G1–G4: counter trial, staff access, two-factor login, PDF size;
    - release 2: QR switch and device test;
    - C1: item list in WhatsApp, only if G1 fails;
    - backlog B1–B2: single source, retention.
- **In progress:** nothing mid-edit.
- **Known broken / blocked:**
  - **The QR doesn't lead to ordering.** `3amo-fouad-menu.pages.dev` (the printed QR) still redirects to the 6.3 MB PDF. The ordering site is live at `https://3amo-fouad.pages.dev/` but nothing on the print sends customers there.
  - **Counter workload is untested.** The WhatsApp message carries only `AF-…`. Staff must sign in and paste the reference to see each order.
  - **Staff access has one allow-listed email.** Confirm it's one the restaurant uses.
  - **Cloudflare two-factor login is off** (deferred by Hamdy). The account now holds customer names and addresses.
  - **Orders have no retention period.**
  - **Not tested:** iPhone / Safari, and the real QR scan → order → counter lookup.

## Decisions Made

- **Cheese spelling:** موتزريلا everywhere (Mostafa). Still to apply on the site (`discs.3.0`) and in the next PDF print.
- **Cheese add-on (+15) stays a line item of its own** (Mostafa).
- **«4 أقراص طعمية قماطي» is one item**, 4 small patties.
- **PDF size:** Hamdy is checking it.
- Earlier decisions stand (launch product, one place to update, fixed QR address, no client credit, portfolio case, seasonal North Coast, Cloudflare to a shared account with two-factor login, "Firststone" spelling). Reasoning is in the Learnings table of `brand-film/.agents/product-marketing.md`.

## Artifacts

- **PRs:**
  - Brand film + brand kit: https://github.com/daz117-stack/agentbay-skills/pull/1 (draft, base `main`)
  - Marketing docs: https://github.com/daz117-stack/agentbay-skills/pull/2 (draft, base `claude/brand-film`)
  - 3amo Fouad menu data + live-state update: https://github.com/daz117-stack/agentbay-skills/pull/3 (draft, base `claude/gracious-johnson-1hlm5j`)
- **Menu data and check:** `brand-film/clients/3amo-fouad/` (`menu.json`, `check-menu.mjs`, `README.md`)
- **Message to Hamdy:** `brand-film/clients/3amo-fouad/message-to-hamdy.md` (Arabic + English draft)
- **Change spec:** `brand-film/clients/3amo-fouad/ordering-site-spec.md` (the work plan for Hamdy; track items by their IDs: R1.x, G1–G4, R2.x, C1, B1–B2)
- **Case:** `brand-film/marketing/cases/3amo-fouad.md` (notes #8–15 are new)
- **QR stack explainer:** `brand-film/product/qr-menu-how-it-works.md` (§5 live state, §6 server version)
- **Marketing context:** `brand-film/.agents/product-marketing.md` (v4)
- **Live:**
  - QR address `https://3amo-fouad-menu.pages.dev` (redirects to `/menu.pdf`)
  - Ordering site `https://3amo-fouad.pages.dev/`
  - Staff lookup `https://staff.3amo-fouad.pages.dev/staff/`
- **What went live, in order:** `brand-film/marketing/cases/3amo-fouad.md` §2a. Customers use the printed menu + QR, which open the PDF.
- **Hamdy's ordering source (not in the repo):** shared as chat uploads (`secure-ordering-source.zip`, deploy ZIP, pre-server local ZIP). It holds deployment ids and a staff email, so it was not committed. Its README names the rollback deployment and a recovery folder on Hamdy's laptop. Re-request it for `check-menu.mjs` runs.

## Open Questions

- **Simple or server ordering as the default offer?** It changes scope, price, upkeep and the website line "the order reaches your WhatsApp written out" (`marketing/04-website-copy.md`). Founders.
- **Counter workflow:** should the server write the item list into the WhatsApp message beside the reference, so the lookup is only for checking? Hamdy, after a rush-hour test with Mostafa's counter.
- **Single source in Hamdy's project:** should one file generate the `app.js` menu, `catalog.json` and the print page? Hamdy.
- **The 3 [confirm] names** in `clients/3amo-fouad/README.md`.
- **Delivery fee per area on the page** (built now as agreed by chat before the order goes out). Mostafa.
- **Retention period** for orders. Check what Egypt's data protection law asks **[confirm]**.
- **Window sticker:** still wanted, given the no-credit decision?
- Founder decisions in `brand-film/marketing/README.md` (now 9, with simple vs server ordering).

## Next Steps

1. Fady sends Hamdy `message-to-hamdy.md` or `ordering-site-spec.md`. Confirm first:
   - the 3 names with Mostafa (spec R1.2);
   - the page title wording (R1.3);
   - the PDF size target (G4).
2. Release 1 (spec R1.1–R1.4): cheese spelling, names, title and preview. Re-run `check-menu.mjs` on the new source and expect 0 differences.
3. Gate (spec G1–G4):
   - counter trial at rush hour;
   - restaurant email on the staff list;
   - Cloudflare two-factor login, and the move to a shared Firststone account;
   - smaller PDF.
4. Release 2 (spec R2.1–R2.3): QR redirect to the ordering site, PDF one tap away. Test on Android and iPhone. Then update the case file §2a and the QR explainer §5.
5. Demo copy that sends to Firststone's own WhatsApp **and its own database**, never the live site (`cases/3amo-fouad.md` §6).
6. Owner conversations (`marketing/03-customer-interviews.md`), then prices (`marketing/02-offer-and-pricing.md` §4). Update `product-marketing.md` to v5.
7. One-page website from `marketing/04-website-copy.md` once prices, the name and the simple/server decision are settled.

## Recommended Skills

- `product-marketing`: v5 after the owner conversations.
- `customer-research`: the owner conversations.
- `pricing` and `offers`: prices, and the simple/server packaging.
- `copywriting` and `site-architecture`: the website.
- `sms`: the restaurant-side WhatsApp flow with order references.
- `run` / `pdf`: preview the ordering site; check a regenerated PDF.

## Environment Notes

- **Repo:** `daz117-stack/agentbay-skills`.
- **Branches:** this session pushed to `claude/firststone-gtm-planning-tsg6hf`, rebuilt on PR #2's head. The PR targets `claude/gracious-johnson-1hlm5j`.
- **Branch rule:** push only to the branch the session names.
- **Push and PR:** `git push -u origin <branch>`; GitHub MCP tools for PRs; no `gh` CLI.
- **`check-menu.mjs`:** needs Node 18+. Hamdy's project itself requires Node 24.
- **Never commit** client personal data or Hamdy's deployment config (staff emails, Access audience, database ids).
- **Writing rules:** no invented prices or claims; open items marked `[NEED]` or `[confirm]`; follow `brand-film/.agents/voice.md`.
- **The founder:** Fady prefers direct, analytical answers and wants weak assumptions challenged.
