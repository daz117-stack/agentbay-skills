# 3amo Fouad — menu data

`menu.json` holds 3amo Fouad's items, sizes and prices in print order, keyed by the ordering site's product ids. `check-menu.mjs` compares it with the live ordering site's source, so the printed menu and the ordering site can't drift without anyone noticing.

## Where the menu lives today (2026-10-27)

| Copy | Where | Used for |
|---|---|---|
| Printed PDF | `https://3amo-fouad-menu.pages.dev/menu.pdf` (QR address) | Print and what the QR opens |
| `MENU` in `app.js` | Hamdy's ordering source, live at `https://3amo-fouad.pages.dev/` | What customers see and tap |
| `server/catalog.json` | Same source, read by the server | What orders are saved and totalled at |
| `menu.json` | This folder | Reference in print order; the check below |

Three hand-edited copies. Their README says "change the visible menu and `server/catalog.json` together". The project has no automated test that enforces it; an independent review checked it once. Recommendation: in Hamdy's project, generate the `app.js` menu and `catalog.json` from one file at build time, and print the PDF from the same file. `menu.json` already carries the product ids to be that file.

## Check

```
node check-menu.mjs <path-to-ordering-source>
```

It exits 1 if any product id, size or price differs between `menu.json`, `app.js` and `server/catalog.json`, and lists name differences without failing. Run it before every menu deploy and before every PDF reprint.

Last run, 2026-10-27, against the source of deployment `edd11ae5`: **109 product ids, 0 id/size/price differences, 4 name differences** (below).

## Name differences, ordering site vs `menu.json`

| Product id | Ordering site | `menu.json` | Status |
|---|---|---|---|
| `discs.3.0` | قرص كيري أو موزاريلا | قرص كيري أو موتزريلا | **Decided 2026-10-27:** use موتزريلا, as on the other six rows. To fix on the site and in the next PDF print |
| `falafel.6.0` | طعمية ميكس جبنة | طعمية ميكس جبن | [confirm] Printed form matches the other «ميكس جبن» rows |
| `syrian.0.0` | طعميه | طعمية | [confirm] Likely a typo on the site |
| `grillsand.6.0` | إضافة جبنة (موتزريلا / رومي / كيري) | إضافة (موتزريلا / رومي / كيري) | [confirm] Site wording is clearer; pick one for both |

Pick one wording per row with Hamdy, and apply it to all three copies in one deploy. Changing a name doesn't change the product id, and saved orders keep their own snapshot of the name.

## Owner decisions (Mostafa, via founders, 2026-10-27)

- **Cheese spelling:** موتزريلا everywhere.
- **Cheese add-on (+15):** stays a line item of its own, as it is on the site today. It's not built as an option on a sandwich.
- **«4 أقراص طعمية قماطي» (10):** one item, 4 small patties. Recorded as `internal_note`. Show it to customers only if Mostafa wants.

## Shape

- Section ids match the ordering site (`foul`, `falafel`, `potato` …).
- Each item's `id` is `section.index` on the ordering site. The product id for an order is `id.variant`, with `.0` for single-price items: e.g. `meat.0.2` is كفتة مشوية, كيلو.
- `price` for single-price items. `prices` lines up with the section's `variants` (بلدي / سوري; ربع / نصف / كيلو).
- Pickup is New Cairo only. The North Coast branch is seasonal and printed on the cover, but isn't a pickup option.

**Product ids are array positions in `app.js`.** Inserting an item mid-section in `app.js` renumbers every item after it. If `catalog.json` isn't renumbered identically, customers tap one item and the order is saved as another. Add new items at the end of a section, retire old ones as inactive, and run the check.

## Open

- [ ] PDF is 6.3 MB for 4 pages, slow on mobile data. Hamdy is checking it.
- [ ] The 3 [confirm] names above.
- [ ] Single source in Hamdy's project (recommendation above). Hamdy's call; it's his build.
