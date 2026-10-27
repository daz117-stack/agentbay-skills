# 3amo Fouad — menu data

`menu.json` is the one place to update 3amo Fouad's items, sizes and prices. The ordering page and the print PDF should both be generated from it (decision of 2026-10-27, see `../../.agents/product-marketing.md` Learnings).

## Source

Transcribed on 2026-10-27 from the live PDF at the QR address (`https://3amo-fouad-menu.pages.dev` → `/menu.pdf`, created 2026-10-26 by a Chromium print). Checked two ways: each page read against its rendered image, and every price in the PDF's text layer matched one-for-one against the prices in `menu.json` (93 rows, 13 sections, no differences).

Names are copied as printed. Where the PDF itself is inconsistent, the JSON keeps the printed form so a reprint matches today's menu until the owner decides:

| Item | Printed | Elsewhere in the PDF |
|---|---|---|
| أقراص طعمية: «قرص كيري أو موزاريلا» | موزاريلا | موتزريلا (6 other rows) |

## Shape

- `sections[].items[]` have a stable `id` (section slug + row number). The cart and WhatsApp message should key on `id`, not the name.
- `price` for single-price items; `prices` lines up with the section's `variants` (بلدي / سوري for grill sandwiches; ربع / نصف / كيلو for grills by weight).
- `addon: true` marks «إضافة (موتزريلا / رومي / كيري)» +15 under السندوتشات. It is an extra on a sandwich, not an item on its own; the ordering page should offer it as an option.
- Pickup is New Cairo only. The North Coast branch is seasonal and printed on the cover, but not a pickup option.

## Open

- [NEED] Hamdy's current ordering page (`3amo-fouad-reviewed-new.html`) to reconcile against this file and to rebuild on top of it. Known gap: it lacks «بطاطس تومية كاتشب» (35).
- [confirm] Delivery: fee per area on the page, or a quick reply from the restaurant.
- [confirm] With the owner: the موزاريلا/موتزريلا spelling, and whether «4 أقراص طعمية قماطي» (10) is one orderable row.
- The live PDF is 6.3 MB for 4 pages. That is a slow first load on mobile data right after a scan. Compress the cover art when the PDF is regenerated.
