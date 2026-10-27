# Firststone: Offer and Pricing v1

**Prepared with:** `offers` and `pricing` skills (marketingskills)
**Reads first:** `../.agents/product-marketing.md`, `positioning.md` §05, `messaging.md` §04
**Status:** Structure recommended; **all prices are [NEED]**. No price is invented here. §4 sets out how to choose them.

---

## 1. Diagnosis (value equation)

Value = (dream outcome × perceived likelihood) ÷ (time delay × effort and sacrifice). Scored 1–10 for a Cairo café owner meeting Firststone today:

| Lever | Score | Why | Fix |
|---|---|---|---|
| Dream outcome | 7 | "Look like the big places, stop orders and prices going wrong" is strong and concrete | Name it in their words after interviews |
| Perceived likelihood | **2** | No clients, no cases, no published prices, unknown name | Free draft (proof in their own shop), go-live checklist shown before sale, founding cases |
| Time delay | 5 | Unknown setup time | Fixed timeline in every quote (e.g., live 5 working days after photos and prices) |
| Effort and sacrifice | 6 | Done-for-you, but staff training and a monthly fee feel risky | Training on handover day; plan can stop any month; files and data handed over |

**Binding constraint: perceived likelihood.** The offer below spends its effort there: a free draft before any money, a timeline promise with a consequence, and a founding-client trade that produces proof.

---

## 2. The offer

### Format
Productized service (`offers` → service/freelance playbook): a named scope, a fixed timeline, a fixed price, the same extras every time, a defined gate.

### Ladder
| Step | What it is | Price |
|---|---|---|
| **Free menu draft** | One-page redesign of the owner's current menu in Firststone's system, sent on WhatsApp within 3 working days of the photo. Capped at 5 a week. | Free |
| **QR menu + WhatsApp ordering** (launch package) | The core offer, below | **[NEED] EGP**, one-off |
| **Monthly plan: Updates** | Keeps the setup right every week | **[NEED] EGP/month** |
| **Monthly plan: Updates + content** | Updates, plus a set number of ads/posts each month | **[NEED] EGP/month** |
| **Add-ons** | Illustrated cover / brand artwork (as on 3amo Fouad) · product ad pack · Ramadan/seasonal menu · extra branch · later: kitchen screen, stock screen | **[NEED]** each |

### QR menu + WhatsApp ordering: the core deliverable
Built once already, for 3amo Fouad (`cases/3amo-fouad.md`). Each new client gets the same build in their own look:
- **Print-ready menu (PDF, A4)** designed on the client's brand: cover, sections, size columns (e.g., quarter / half / kilo; baladi / shami bread), prices in EGP, branches, WhatsApp number and the QR code
- **Mobile menu page** (opens from the QR in any phone browser, no app): Arabic, category tabs, search, item sizes, light and dark mode
- **Ordering:** cart with quantities and running total (kept if the page reloads), pickup or delivery, name, address and notes, then **Send on WhatsApp**, which opens the restaurant's own WhatsApp with the itemized order and total already written
- **Prices kept identical** on the page and the PDF; on the monthly plan, one change request updates both
- **Handover on site:** 15 minutes with whoever answers the shop's WhatsApp (how orders arrive, how to confirm them), plus a one-page "how to ask for changes" card
- Go-live checklist completed and signed off (every item and price checked against the owner's list, tested on Android and iPhone, QR tested from print)
- **Timeline:** live within **[5] working days** of receiving the current menu and prices
- **Out of scope** (written in the quote): printing costs, logo or illustration design (quoted separately), payment collection, delivery-fee calculation, kitchen and stock screens, delivery-app integration
- **Hosting:** Cloudflare Pages (as for 3amo Fouad), in a Firststone account. The QR points to an address that never changes. If the client leaves, they take the files (a static page and PDF), in line with the no-lock-in promise. See `../product/qr-menu-how-it-works.md`.
- **One place to update:** each client's items, sizes and prices live in one data source that builds both the ordering page and the print PDF. This sets the cost of the monthly plan.

### Extras that come with every setup (bonus stack)
Kept small and real; each one makes the client more self-sufficient or makes the core easier to use.
1. Instagram highlight cover and a matching "menu" story set
2. Google Business Profile menu photos updated to the new design
3. One seasonal template prepared ahead (e.g., Ramadan) so the first seasonal change is fast

### Monthly plan: what "Updates" covers
- Price and item changes, up to **[N]** change requests a month, live within **[same/next] business day**
- One small design change a month (a daily special, a new item card)
- WhatsApp support with a written reply time **[NEED: e.g., same business day, 10:00–20:00, Sat–Thu]**
- Monthly "what changed" message
- Stop any month with 30 days' notice; files and data handed over on request

**Updates + content** adds **[N]** product ads or social posts a month in the client's look.

### Guarantee (service-level type)
> "If your setup isn't live on the date in your quote, for a reason on our side, your first month of the plan is free."

Why this type: the owner's biggest fear is "they'll be slow and then disappear", which an SLA answers. It costs Firststone one month of plan revenue only when Firststone fails, and it forces realistic timelines. A money-back guarantee on design work invites "I just don't like it" refunds and is not recommended.

Second risk reversal, stated once near the price: "Stop the plan any month. Your files and data are yours."

### Scarcity (real only)
- **Founding clients: 5 slots.** Founding price, locked for **6 months**, in return for written permission to photograph the work, publish the before/after and quote the owner. When 5 are signed, the founding price closes. True because capacity is genuinely limited and the permission has real value to Firststone.
- **Seasonal deadline:** "Ramadan menus ordered by [date] are live before the first iftar." True because delivery takes days.
- Never: countdown timers, "only today", invented slot counts (`voice.md` §08, `offers` banned patterns).

**Why 6 months and not 12:** EGP costs move quickly. A 12-month lock is a stronger offer but can turn founding clients unprofitable. Founders' call; 6 months is the safer default.

### Naming
Plain descriptors that say what the thing does (the voice guide rules out product names like "POS" and favours "order screen", "digital menu"). Named offers beat unnamed ones, so the names are fixed and reused everywhere: **QR menu + WhatsApp ordering**, **Monthly plan: Updates**, **Monthly plan: Updates + content**, **Kitchen screen**, **Stock screen**. Arabic equivalents **[decide with Arabic copy pass]**, e.g. «منيو QR وطلبات على واتساب», «باقة التحديثات الشهرية».

---

## 3. What not to do
- **No discounts to win clients.** Discount-seekers churn faster and anchor the brand as cheap; the position says "not the cheapest" (`positioning.md` §06). The founding price is a trade for proof, not a discount.
- **No custom projects at package prices.** Anything outside the written scope gets a separate quote. This is the main protection for the "affordable + well-designed" tension in `brand-context.md`.
- **No order or stock systems sold yet.** They need their own go-live checklist and offline fallback, and the Egyptian e-invoicing / e-receipt position must be verified first.
- **No prices hidden behind "contact us".** Owners ask "how much per month?" in the first message; publish it.

---

## 4. Setting the prices

`pricing`: the first price is a bet to learn from, not an optimum. Steps:

1. **Cost floor (do first).** Estimate delivery hours for one QR menu + WhatsApp ordering setup and for one plan-month. Multiply by the hourly value the founders need, add materials and transport. Neither price may sit below this.
2. **Alternative anchor.** What the owner pays today for the closest substitute: a freelancer menu design, a QR-menu setup (desk research found offers from about $20 on freelance marketplaces, which is the floor owners will compare against), a print shop. Collect real numbers in the owner conversations.
3. **Value ceiling.** What one fewer price argument a day, or one fewer lost order at rush hour, is worth to them. Ask in interviews (`03-customer-interviews.md` §4).
4. **Pick round numbers** between anchor and ceiling, above the floor. Avoid an ultra-low price "to get started": it attracts the wrong clients and is very hard to raise.
5. **Ratios to start from:** Updates + content at roughly 2× Updates; setup price at roughly 3–6× the Updates plan **[sanity-check against the cost floor]**.
6. **Review every 6 months** and write the review into the plan terms (EGP inflation). Raise for new clients first; existing clients keep their price until their lock ends.

**Signals to raise prices:** owners accept the quote without pushback in more than about 4 of 10 quotes; founding slots fill in under 4 weeks; delivery hours run over estimate.

---

## 5. Quote template (WhatsApp / PDF, Egyptian colloquial)

```
عرض Firststone لـ [اسم المكان]

منيو QR وطلبات على واتساب
• منيو مطبوع بتصميم على شكل مكانك، وعليه QR
• صفحة المنيو على الموبايل: بحث، أحجام، سلة
• الطلب يوصلك على واتساب مكتوب بالأصناف والإجمالي
• استلام من الفرع أو توصيل
• تدريب اللي بيرد على الواتساب يوم التسليم
السعر: [X] جنيه (مرة واحدة)
جاهز خلال [5] أيام عمل من استلام صور المنيو والأسعار

باقة التحديثات الشهرية: [Y] جنيه في الشهر
• تغيير الأسعار والأصناف (حتى [N] مرات في الشهر)
• رد على واتساب [في نفس يوم العمل]
• توقفها في أي شهر، والملفات ملكك

لو التسليم اتأخر عن الميعاد بسببنا، أول شهر في الباقة مجاني.

مش داخل في العرض: تكلفة الطباعة، الرسومات الخاصة، التحصيل، رسوم التوصيل، شاشات المطبخ والمخزون.
```

English equivalent for decks and the website lives in `04-website-copy.md` §Packages.

---

## 6. Open decisions
1. ~~Default digital format~~ Settled: QR menu + WhatsApp ordering, as built for 3amo Fouad.
2. ~~Hosting~~ Settled: Cloudflare Pages in a Firststone account. Still open: a Firststone domain for permanent QR addresses (after name clearance).
3. Whether item photos are in scope (3amo Fouad's page has none; photos raise cost and update work).
4. Support hours and reply time the founders can keep every week.
5. Founding-price lock: 6 or 12 months.
6. The prices themselves, after the owner conversations. 3amo Fouad was paid in kind, so the first real price comes from the first paying client.
