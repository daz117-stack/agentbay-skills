# Firststone: WhatsApp Playbook v1

**Prepared with:** `sms` skill (marketingskills), WhatsApp reference (platform facts as of 2026-10). Overlaps with the vendored brand skill `whatsapp-marketing`; this playbook is the operating version for launch.
**Reads first:** `../.agents/product-marketing.md`, `voice.md` §06
**Why WhatsApp:** it is where Egyptian owners already talk to suppliers, and the plan's conversion action is "send us a WhatsApp". It is the storefront, the pipeline and the support desk.

---

## 1. App or platform

| | WhatsApp Business **app** (start here) | WhatsApp Business **Platform** (API, later) |
|---|---|---|
| Cost | Free | Per-message fees (marketing templates charged on every delivery; since 1 Oct 2026, service replies beyond 1,000/month per number and in-window utility messages are also charged) plus the provider's fee |
| Fits | Two founders answering by hand, under ~50 active chats | Broadcasts to many opted-in contacts, automation, several agents |
| Trigger to move | Missed replies, or monthly messages to 40+ clients become a chore | — |

Meta changes pricing and limits often; check the current rate card for Egypt before moving to the platform.

**Setup (week 1):**
- A dedicated business number, not a founder's personal one (so it can be handed between founders and survives staff changes).
- Profile: Firststone mark on stone as avatar, category, description from `messaging.md` §06, area, hours, website.
- **Catalogue:** one item per package with the price (QR menu + WhatsApp ordering, Updates, Updates + content). Owners ask "how much?" first; the catalogue answers before you do.
- **Linked devices:** both founders on the same account.

---

## 2. Automatic messages (app)

**Greeting** (sent on first contact):
> «أهلاً بيك في Firststone 👋 قولّنا نوع مكانك (كافيه، مطعم، محل) وابعت صورة المنيو، ونبعتلك تصميم مقترح ببلاش خلال ٣ أيام عمل.»
> ("Welcome to Firststone. Tell us what kind of place you have and send a photo of the menu. We'll send a free proposed design within 3 working days.")

**Away message** (outside hours):
> «وصلتنا رسالتك. مواعيدنا [السبت–الخميس، ١٠–٨]. هنرد عليك [بكرة قبل ١٢].»
> ("Got your message. Our hours are [Sat–Thu, 10–8]. We'll reply [tomorrow before 12].")

Every automatic message states a time. That is the "support you can reach" promise in practice; never write a time the team can't keep.

---

## 3. Quick replies (type `/` + shortcut)

| Shortcut | Use | Text (Egyptian colloquial) |
|---|---|---|
| `/price` | "How much?" | «تجهيز المنيو [X] جنيه مرة واحدة. باقة التحديثات [Y] جنيه في الشهر وتوقفها في أي شهر. تحب نبدأ بتصميم مقترح ببلاش؟» |
| `/draft` | Asking for the photo | «ابعتلنا صورة واضحة للمنيو والأسعار الحالية، واسم المكان. التصميم المقترح هيوصلك يوم [اليوم].» |
| `/sent` | Draft delivered | «ده التصميم المقترح لـ [المكان]. تحب نعدّي عليك [يوم] ١٥ دقيقة نوريك شكله على الشاشة ونتكلم في العرض؟» |
| `/quote` | After the visit | Quote template from `02-offer-and-pricing.md` §5 |
| `/live` | Go-live day | «كله جاهز. الفريق اتدرّب، والأسعار متراجعة. أي تعديل ابعتهولنا هنا.» |
| `/got` | Support acknowledgement | «وصلتنا رسالتك. بنبص عليها دلوقتي ونرد عليك قبل [الساعة].» |
| `/done` | Change made | «اتعدّل. السعر الجديد ظاهر على [الشاشة / الـQR]. ابعت صورة لو حابب تتأكد.» |
| `/review` | After first month | See `06-referral-program.md` §3 |

Voice rules hold here: at most one emoji per message, none in prices or support; numerals for times and prices; no exclamation marks in support or billing.

---

## 4. Labels = the sales pipeline

`visited` → `draft requested` → `draft sent` → `quoted` → `won` → `live` → `on plan` · plus `lost` (add reason in the chat note) and `partner`.

Every Sunday: count chats per label. That count is the funnel report in `01-marketing-plan.md` §13 until there's a reason for a CRM.

---

## 5. Flows

### New lead (from a visit, post, sticker or referral)
1. Greeting goes out automatically.
2. Within 2 working hours: `/draft`.
3. Draft delivered within 3 working days: `/sent`, offering a visit.
4. Visit with the draft on a tablet; quote the same day or within 24 hours (`/quote`).
5. No reply after 3 days: one follow-up only. «لسه التصميم موجود لو حابب تبدأ. لو مش دلوقتي، مفيش مشكلة.» ("The design is still here if you'd like to start. If not now, no problem.") Then stop.

### Onboarding (won → live)
- Day 0: confirm date, what we need (photos, prices, logo) in one message.
- Go-live day: `/live` plus the one-page "how to ask for changes" card as an image.
- Day 2 and day 7: short check-in. «في أي حاجة محتاجة تتعدّل بعد أول [يومين / أسبوع]؟»

### Monthly plan
- First working day of each month: "what changed" note (updates done, what's coming, one suggestion).
- Before Ramadan, Eid and summer: offer the seasonal menu 3–4 weeks ahead with a real order-by date.

### Support
- Acknowledge with `/got` and a time; fix; confirm with `/done`.
- Incident (something stopped working): state, own, fix, in that order (`voice.md` §03 Calm). «الشاشة وقفت من ١:٤٠ لـ ١:٥٥. الطلبات محفوظة. ضفنا اتصال احتياطي.»

---

## 6. Client side: the restaurant's order inbox

With QR menu + WhatsApp ordering, the client's own WhatsApp becomes their order inbox. Setting it up is part of the handover, and it is where "runs" either works or doesn't.

- **WhatsApp Business on the shop's number** (not the owner's personal one), with the shop's hours and address.
- **Quick replies for orders** (Egyptian colloquial, the client's voice):
  - `/ok` «وصل طلبك يا [الاسم]. هيكون جاهز خلال [٢٠] دقيقة.»
  - `/fee` «رسوم التوصيل لـ [المنطقة]: [X] جنيه. الإجمالي [Y] جنيه. نأكد؟»
  - `/out` «[الصنف] خلص النهارده. تحب [بديل]؟»
  - `/ready` «طلبك جاهز.»
- **Labels for order status:** `new`, `confirmed`, `out for delivery`, `done`. Whoever answers can see what's open at a glance.
- **Away message** with opening hours, so orders sent after closing get an answer.
- **Delivery fee:** the 3amo Fouad build says the fee is set after the address is known. Agree with each client who replies with the fee and how fast; a slow fee reply is where WhatsApp ordering loses the customer.

This is in scope for every setup and takes about 15 minutes on handover day.

## 7. Consent and data

- **Opt-in before marketing messages.** Meta requires it. A client who messages you has started a conversation; that is not consent to broadcasts. Ask once, in plain words, at go-live: «تحب نبعتلك عروض المواسم (رمضان، العيد) هنا على واتساب؟ تقدر توقفها في أي وقت.» Log the yes.
- **Easy stop.** Anyone who says stop gets one confirmation and no more marketing messages. Blocks lower the number's quality rating and can limit it.
- **Broadcast lists (app)** only reach people who saved your number; another reason to give every client a business card and ask them to save it.
- **Egyptian data law.** Contact lists and client data fall under Egypt's Personal Data Protection Law (Law No. 151 of 2020). **Unverified:** what registration or consent records it requires of a business this size. Check before running broadcasts or storing client customer data (e.g., order screens that capture diner phone numbers).
- Put the privacy notice on the website (`/privacy`) and link it in the WhatsApp profile.

---

## 8. Click-to-WhatsApp ads (held until §4 Move 7 gates are met)

When unlocked: a Facebook/Instagram ad aimed at business owners in the chosen neighbourhoods, opening WhatsApp with a pre-filled first message («عايز تصميم مقترح للمنيو»). A reply within 24 hours opens Meta's free entry-point window (Meta says up to 7 days, as of 2026-10; check actual expiry in delivery data), so the whole draft → quote conversation can happen inside it. Ask for marketing opt-in in that chat. Kill rule: stop the ad if cost per conversation that reaches `draft requested` exceeds **[NEED: set from the first month's numbers]**.
