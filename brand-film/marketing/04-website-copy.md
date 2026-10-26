# Firststone: Website v1 (structure and copy)

**Prepared with:** `site-architecture` and `copywriting` skills (marketingskills)
**Reads first:** `../.agents/product-marketing.md`, `messaging.md`, `voice.md`, `identity.md`
**Copywriting diagnosis:** Situation B, real voice present. The brand foundations already contain locked lines ("Start here. Start right.", the level-2 statement, the four key messages). They are kept; the work here is structure, specificity and flagging what can't be claimed yet.

---

## 1. Decisions to challenge first

**The site is a credibility check, not the main channel.** Owners will meet Firststone in their shop, on Instagram or through a neighbour, then look it up. The page has one job: make it easy to believe, see the price, and open WhatsApp. One page is enough for launch.

**Language: Arabic should lead.** `voice.md` assigns English to the website, but the audience is Arabic-first and the site's visitors are those owners. Recommendation: Arabic page at the root, English at `/en`, same structure, a language switch in the header. English copy is drafted below (it's the voice guide's register for web and decks); Arabic is given for the hero, headings and CTAs. The Arabic body needs a native copy pass in Egyptian-friendly light MSA, not a literal translation.

**Don't sell what isn't ready.** Kitchen and stock screens are in the brand promise but not in the launch offer (`02-offer-and-pricing.md` §3). The page presents "how it runs" through what the launch product actually does (customers order from the QR menu and the order reaches the shop's WhatsApp written out with the total) and lists kitchen and stock screens honestly as coming next, with a "tell me when it's ready" button that doubles as a demand test.

**Let the product sell itself.** The strongest thing on the page is a working demo: embed or link a live sample menu (3amo Fouad's, once the owner agrees, or a Firststone demo café) with a note: "Try it: add two items and press Send on WhatsApp."

---

## 2. Site architecture

```
/                     Arabic one-page home (anchors below)
├── #looks            How it looks
├── #runs             How it runs
├── #packages         Packages and prices
├── #how              How it works
├── #checklist        Built to run every day
├── #about            Who we are
├── #faq              Questions
└── #contact          WhatsApp, phone, area served
/en                   English mirror of /
/privacy              Privacy notice (needed for WhatsApp opt-in and contact data)
Later (after cases):  /work/{client-slug}   one page per permission-granted case
```

- **Header:** mark + wordmark · Packages · How it works · Questions · language switch · button "WhatsApp us".
- **Footer:** area served, WhatsApp, phone, Instagram, Facebook, Google Maps link, privacy, © Firststone.
- **Primary CTA everywhere:** a `wa.me` link with a pre-filled first message, so the conversation starts with intent:
  `https://wa.me/[number]?text=` + «أهلاً، عايز تصميم مقترح للمنيو. ده نوع المكان: » / "Hi, I'd like a free menu draft. My place is a: "
- **Mobile first:** nearly all visitors will be on a phone. The WhatsApp button stays fixed at the bottom on mobile.

---

## 3. Page copy (English, `/en`)

### Hero
**Eyebrow (mono):** MEDIA · SOFTWARE · BUSINESS SYSTEMS
**H1:** Start here. Start right.
**Subhead:** Firststone sets up how your place looks and how it runs (printed menus, a QR menu customers order from, ads, and prices that stay right) and then stays to keep it working. One team, clear prices, no surprises.
**Primary CTA:** Get a free menu draft
**Microcopy under CTA:** Send a photo of your menu on WhatsApp. We'll send a draft within 3 working days.
**Visual:** a phone showing the QR ordering page next to the printed menu it matches (3amo Fouad with permission, otherwise a demo café). Brand film as the secondary visual.

**Arabic hero (`/`):**
- H1: «ابدأ من هنا… ابدأ صح»
- Subhead: «بنجهّز شكل مكانك وطريقة شغله: المنيو المطبوع، منيو QR الزبون يطلب منه على واتساب، الإعلانات، والأسعار مظبوطة في كل مكان. وبنفضل معاك بعدها.»
- CTA: «ابعت صورة المنيو»
- Microcopy: «ونبعتلك تصميم مقترح ببلاش خلال ٣ أيام عمل.»

> **Alternatives**
> - H1 A (recommended): "Start here. Start right." Locked brand line; works as headline, sign-off and film end frame.
> - H1 B: "Your menu, your prices, your look. Set up right, in one go." From `messaging.md` §05; more concrete, better for an ad landing page.
> - CTA A (recommended): "Get a free menu draft". Names what they get.
> - CTA B: "Send us your menu". Shorter; names the action rather than the reward.

### Problem
**H2:** Paper slips, WhatsApp orders and last month's prices
Most small places run this way. The menu on the wall says 70, the till says 85, and every second customer asks. The freelancer who made the menu doesn't answer any more. The big platforms are built and priced for chains.
**Arabic H2:** «ورق، طلبات على واتساب، وأسعار الشهر اللي فات»

### How it looks (#looks)
**H2:** How it looks
Your menu, screens and ads are designed in your colours and your logo, in Arabic and English, so the place looks as considered as the big names.
- Menus for the wall, the table and the screen
- Product ads and social posts in the same look
- Print-ready files you own
**Arabic H2:** «شكل مكانك»

### How it runs (#runs)
**H2:** How it runs
Customers scan the QR on the table or the counter, pick items and sizes, and press Send. The order reaches your WhatsApp written out: items, quantities, total, pickup or delivery, name and address. Nothing to download, for them or for you. Change a price once and we update the page and the print file together.
**Try it:** [link to live demo menu]
**Coming next:** kitchen screen (orders from counter to kitchen) and stock screen (what to reorder). Tell us if you need one and we'll call you when it's ready.
**Button:** Tell me when it's ready
**Arabic H2:** «طريقة شغله»

### And we stay
**H2:** And we stay
Message us on WhatsApp and get a reply [same business day]. Each month we send a short note on what changed and what's coming, like your Ramadan menu.
**[NEED: written support time before publishing this section.]**
**Arabic H2:** «وبنفضل معاك»

### Packages (#packages)
**H2:** Clear prices before we start
| QR menu + WhatsApp ordering | Monthly plan: Updates | Monthly plan: Updates + content |
|---|---|---|
| **[X] EGP** once | **[Y] EGP** / month | **[Z] EGP** / month |
| Printed menu with QR · mobile menu page with search and cart · orders to your WhatsApp with the total · pickup or delivery · live in [5] working days | Price and item changes · one small design change a month · WhatsApp support, reply [same business day] | Everything in Updates · [N] product ads or posts a month |
| Get a free draft first | Stop any month | Stop any month |

Below the table: "If your setup isn't live on the date in your quote, for a reason on our side, your first month of the plan is free."
Second line: "Your designs and data are yours. Ask and we hand them over."
**Founding clients:** "Our first 5 clients get a founding price for 6 months, in return for letting us show their before and after." (Remove when the 5 are signed.)
**[NEED: all prices. Do not publish this section with placeholders.]**

### How it works (#how)
**H2:** How it works
1. **Send a photo of your menu.** On WhatsApp, with your current prices.
2. **Get a free draft in 3 working days.** Your menu, redesigned. No commitment.
3. **We set it up.** Fixed price and date in writing. We install it and train your staff.
4. **We keep it right.** Price changes, specials and seasonal menus on your monthly plan.

### Built to run every day (#checklist)
**H2:** Checked before it goes live
Every setup goes through the same checklist before we hand it over:
- Tested on your screens and your phones
- Every price checked against your list
- Staff walked through it
- A plan for when the internet drops: the page runs on the customer's data and the printed menu matches it
- Signed off with you

### About (#about)
**H2:** Who we are
We're [Fady and Hamdy]. One of us has spent years making sure complex systems change safely and keep running; the other [Hamdy's strength]. We started Firststone because good small places deserve a setup that looks right, works every day, and doesn't cost what the chains pay.
**[NEED: Hamdy's background. Do not name Fady's employer or sector until the employer policy check is done; "years making sure complex systems keep running" is safe.]**
**Photo:** both founders in a real shop, daylight (identity imagery rules).

### FAQ (#faq)
**How much is it per month?**
[Y] EGP for Updates, [Z] EGP for Updates + content. Setup is [X] EGP once.

**Does it work if the internet drops?**
The menu opens on your customer's own mobile data, so your shop's WiFi doesn't matter. The printed menu on the table has the same prices, and your phone number is on it. **[verify hosting uptime and load time on a weak 4G signal before publishing]**

**Do my customers need to download an app?**
No. The QR opens the menu in the phone's browser.

**I'm already on Talabat.**
Keep it for new customers. The QR menu is for your regulars and walk-ins to order straight to your WhatsApp, with no commission per order from us.

**My staff aren't technical.**
We train them on handover day and keep it to what they need. Most changes go through us on WhatsApp anyway.

**I already have a POS / Foodics.**
Keep it. We set up the look around it: menus, screens and ads.

**Can I stop the plan?**
Yes, any month, with 30 days' notice. Your files and data are yours.

**Which areas do you cover?**
[NEED: neighbourhoods.] We come to you.

### Final CTA (#contact)
**H2:** Start with your menu
Send a photo on WhatsApp. We'll send a free draft within 3 working days.
**Button:** WhatsApp us
**Below:** [phone] · [area] · Sat–Thu, [hours]

---

## 4. Meta
- **Title (en):** Firststone | QR menus with WhatsApp ordering for restaurants and cafés in Cairo
- **Meta description (en):** A printed menu and a QR menu your customers order from. Orders reach your WhatsApp with the total. Clear package prices. Free menu draft on WhatsApp.
- **Title (ar):** Firststone | منيو QR وطلبات على واتساب للمطاعم والكافيهات في القاهرة
- Add LocalBusiness structured data (name, area served, phone, opening hours, sameAs links) once the name is cleared. The `schema` skill isn't vendored; add it when the site is built.

---

## 5. Pre-publish check
- [ ] Every [NEED] resolved or its section removed
- [ ] No claim of clients, counts, uptime or results
- [ ] No employer or banking reference
- [ ] Name spelled **Firststone** everywhere
- [ ] No exclamation marks; numerals for prices and times; sentence case
- [ ] WhatsApp link opens with the pre-filled message on Android and iPhone
- [ ] Arabic copy reviewed by a native speaker for register (not literal translation)
- [ ] Contrast: text on cobalt uses `#FAF9F6`, never ink (`identity.md`)
