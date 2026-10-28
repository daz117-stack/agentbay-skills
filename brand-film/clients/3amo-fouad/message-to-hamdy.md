# Message to Hamdy: ordering-site fixes (draft, 2026-10-28)

Draft from Fady to Hamdy. Not sent yet. Arabic version first (Egyptian), then English. Item ids and file names stay in Latin so they can go straight to Codex.

Before sending:
- **Point 2:** the wording is a guess at Mostafa's preference. If he hasn't seen these three names, send them as questions.
- **Point 7:** the allow-listed email is deliberately not named here.

---

## عربي

حمدي، راجعت موقع الطلبات على المنيو المطبوع. الـ 109 سعر متطابقين في الـ PDF وصفحة المنيو و`catalog.json`، شغل حلو. فيه شوية تعديلات صغيرة، وبعدين حاجتين لازم نخلصهم قبل ما نوجّه الـ QR على الموقع.

**تعديلات للـ deploy الجاي** (غيّر الاسم في `app.js` و`server/catalog.json` في نفس الـ deploy، والـ product IDs زي ما هي):

1. `discs.3.0`: «قرص كيري أو موزاريلا» تبقى «قرص كيري أو موتزريلا». مصطفى عايز موتزريلا في كل حتة زي باقي الستة. وصلّحها كمان في طبعة الـ PDF الجاية.
2. تلات أسامي مختلفة عن المنيو المطبوع. رأيي كده، قولّي لو مش موافق:
   - `syrian.0.0`: «طعميه» تبقى «طعمية» (شكلها غلطة كتابة)
   - `falafel.6.0`: «طعمية ميكس جبنة» تبقى «طعمية ميكس جبن»، زي المطبوع وزي باقي سطور «ميكس جبن»
   - `grillsand.6.0`: الموقع كاتب «إضافة جبنة (…)» والمطبوع «إضافة (…)». نختار واحدة ونستخدمها في الاتنين. أنا أفضّل صيغة الموقع، أوضح.
3. عنوان الصفحة لسه `3amo-fouad`. خليه حاجة زي «عمو فؤاد | المنيو والطلب». وضيف صورة معاينة (`og:image`، الغلاف) كملف صورة حقيقي، عشان اللينك يبان كويس لما يتبعت على واتساب.
4. قبل ما تعمل deploy، شغّل فحص المنيو من الريبو بتاعنا (PR #3: `brand-film/clients/3amo-fouad/check-menu.mjs`، محتاج Node 18 أو أحدث):
   `node check-menu.mjs <path-to-your-ordering-source>`
   بيفشل لو أي ID أو حجم أو سعر مختلف بين المنيو المطبوع و`app.js` و`catalog.json`. النهارده النتيجة 0 اختلافات، والأربع أسامي اللي فوق بس.
5. وانت بتبص على حجم الـ PDF: هو 6.3 ميجا لأربع صفحات، وده بطيء على داتا الموبايل أول ما الزبون يعمل scan. غالباً صورة الغلاف هي أغلب الحجم.

**قبل ما نحوّل الـ QR على موقع الطلبات:**

6. تجربة على الكاشير. كل طلب دلوقتي بيوصل «طلب جديد رقم AF-…» بس، وحد لازم يعمل sign in ويلصق الرقم عشان يشوف الطلب. خلّينا نجرب ده عند كاشير مصطفى في وقت زحمة الأول. لو طلع بطيء، ينفع السيرفر يكتب الأصناف في رسالة الواتساب جنب الرقم، والـ lookup يفضل للتأكيد بس؟
7. دخول الستاف. مين الإيميل اللي في `STAFF_EMAILS`؟ لو إيميلك، ضيف إيميل المحل بيستخدمه فعلاً، وإلا مش هيقدروا يشوفوا طلباتهم.
8. شغّل الـ two-factor login على حساب Cloudflare. الحساب بقى فيه أسامي وعناوين زباين. ودي فرصة كمان ننقله لحساب Firststone مشترك.
9. وبعدين التحويل نفسه: في مشروع `3amo-fouad-menu`، غيّر الـ redirect من `/menu.pdf` لـ `https://3amo-fouad.pages.dev/`، وحط لينك «تحميل المنيو» للـ PDF في موقع الطلبات. عنوان الـ QR مش هيتغير، فمفيش إعادة طباعة. بعد كده جرّب scan ← طلب ← lookup على أندرويد وآيفون. لحد دلوقتي اتجرب على Chrome بس.

**مش مستعجلين، القرار ليك:**

10. المنيو دلوقتي متكتب بإيدنا في `app.js` و`catalog.json`، والـ ID بتاع كل صنف هو مكانه في الليستة. لو صنف اتضاف في نص قسم في ملف واحد بس، الزبون يدوس على صنف والطلب يتسجل صنف تاني. إضافة الأصناف الجديدة في آخر القسم بتمنع ده دلوقتي. الحل الأنضف ملف واحد يطلّع الاتنين وقت الـ build، وصفحة الطباعة كمان. `menu.json` بتاعنا فيه الـ product IDs بتاعتك لو حبيت تبدأ منه.
11. الطلبات متخزنة من غير تاريخ مسح. محتاجين نتفق مع مصطفى على مدة احتفاظ.

---

## English

Hamdy, I checked the ordering site against the printed PDF. All 109 prices match on the PDF, the page menu and `catalog.json`, so nice work there. A few fixes, then two things to sort out before we point the QR at the site.

**Fixes for the next deploy** (change the name in both `app.js` and `server/catalog.json` in the same deploy; the product IDs stay the same):

1. `discs.3.0`: «قرص كيري أو موزاريلا» → «قرص كيري أو موتزريلا». Mostafa wants موتزريلا everywhere, like the other six rows. Fix it in the next PDF print too.
2. Three names don't match the printed menu. Here's what I'd do, tell me if you disagree:
   - `syrian.0.0`: «طعميه» → «طعمية» (looks like a typo)
   - `falafel.6.0`: «طعمية ميكس جبنة» → «طعمية ميكس جبن», to match the print and the other «ميكس جبن» rows
   - `grillsand.6.0`: the site says «إضافة جبنة (…)» and the print says «إضافة (…)». Pick one and use it in both. I'd keep the site's wording, it's clearer.
3. Page title is still `3amo-fouad`. Change it to something like «عمو فؤاد | المنيو والطلب». Add a preview image (`og:image`, the cover) as a real image file, so the link looks right when it's shared on WhatsApp.
4. Before you deploy, run the menu check from our repo (PR #3: `brand-film/clients/3amo-fouad/check-menu.mjs`, needs Node 18+):
   `node check-menu.mjs <path-to-your-ordering-source>`
   It fails if any ID, size or price differs between the printed menu, `app.js` and `catalog.json`. Today it shows 0 differences and the 4 names above.
5. When you check the PDF size: it's 6.3 MB for 4 pages, which is slow on mobile data right after a scan. The cover image is probably most of it.

**Before we switch the QR to the ordering site:**

6. Counter trial. Every order now arrives as just «طلب جديد رقم AF-…», and someone has to sign in, paste the reference and read the order. Let's try that at Mostafa's counter during a busy hour first. If it's too slow, could the server put the item list in the WhatsApp message next to the reference, and keep the lookup for checking?
7. Staff sign-in. Whose email is on `STAFF_EMAILS`? If it's yours, add an email the restaurant actually uses, otherwise they can't see their own orders.
8. Turn on two-factor login on the Cloudflare account. It now holds customer names and addresses. This is also the moment to move it into a shared Firststone account.
9. Then the switch itself: in the `3amo-fouad-menu` project, change the redirect from `/menu.pdf` to `https://3amo-fouad.pages.dev/`, and put a "download the menu" link to the PDF on the ordering site. The QR address stays the same, so nothing needs reprinting. After that, test scan → order → lookup on Android and an iPhone. So far it's only been tested in Chrome.

**No rush, your call:**

10. Right now the menu lives in `app.js` and `catalog.json`, both edited by hand, and each item's ID is its position in the list. If an item gets inserted mid-section in one file and not the other, a customer taps one item and the order is saved as another. Adding new items at the end of a section avoids that for now. The cleaner fix is one file that generates both at build time, and the print page too. Our `menu.json` already uses your product IDs if you want to start from it.
11. Orders are kept with no deletion date. We need to agree a retention period with Mostafa.
