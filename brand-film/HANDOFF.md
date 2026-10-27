# Handoff — 2026-10-27 15:10 UTC

## Session Summary

This session applied the vendored marketingskills to Firststone, the company founded by Fady and Hamdy. Inputs were the brand kit and the first client build, 3amo Fouad's printed menu with a QR code and a WhatsApp ordering page. The session produced a marketing context file, a go-to-market plan and supporting docs, a case file, and an explanation of the QR stack. Everything is pushed to PR #2 (draft). Prices, the support reply time and several founder decisions are still open.

## Next-Session Focus

Continue Firststone go-to-market:
1. Get the 3amo Fouad ordering page live, fed from one menu data source.
2. Set launch prices.
3. Run the owner conversations.
4. Build the one-page website.

## Current State

- **Done:**
  - Vendored 10 marketingskills skills.
  - `product-marketing.md` is at v3.
  - Plan, offer, interview guide, website copy, WhatsApp playbook and referral docs are written and updated for the launch product (QR menu + WhatsApp ordering).
  - 3amo Fouad case file and the QR-stack explainer are written.
- **In progress:** nothing mid-edit. PR #2 is clean against `claude/brand-film`, has no CI checks and no review comments.
- **Known broken / blocked:**
  - **The QR doesn't open the ordering page.** It points to `https://3amo-fouad-menu.pages.dev`, which redirects to `/menu.pdf`. The ordering page with the cart isn't deployed there.
  - **Menu and ordering page have already drifted.** The live PDF lists «بطاطس تومية كاتشب» at 35 EGP; the ordering page the founders shared doesn't have it.
  - **Founder decisions are blocking the go-public steps.** The list is in `brand-film/marketing/README.md` ("Before anything goes public").

## Decisions Made

One line each. The Learnings table in `brand-film/.agents/product-marketing.md` holds the reasoning.
- **Launch product:** QR menu + WhatsApp ordering. Kitchen and stock screens come later.
- **One place to update** each client's menu data, feeding both the ordering page and the print PDF.
- **QR addresses never change.** Update the content behind the address, never the URL.
- **No "Made by Firststone" credit on client work.** Work is shown in Firststone's portfolio instead.
- **3amo Fouad stays a portfolio case.** It was paid in kind and the owner, Mostafa (a friend), agreed. It gives no price data point.
- **North Coast branch is seasonal** (June to early October). Pickup stays New Cairo only for now.
- **Hosting:** Cloudflare Pages, to be moved into a shared Firststone account with two-factor login.
- **Name spelling:** **Firststone**, one word. Not "FirstStone" (`brand-film/.agents/voice.md` §04).

## Artifacts

- **PRs:**
  - Brand film + brand kit: https://github.com/daz117-stack/agentbay-skills/pull/1 (draft, base `main`)
  - This work: https://github.com/daz117-stack/agentbay-skills/pull/2 (draft, base `claude/brand-film`)
- **Commits on this branch:** `0b81f3d` (vendored skills), `f597ccb` (context + plan), `04f9919` (QR ordering offer), `78f9618` (3amo Fouad facts, QR explainer)
- **Docs index:** `brand-film/marketing/README.md` lists every marketing doc and the open blockers.
- **Marketing context:** `brand-film/.agents/product-marketing.md`. Every marketing skill reads it first.
- **Brand foundations:** `brand-film/.agents/` (positioning, messaging, voice, identity, story, naming).
- **Brand kit:** `brand-film/output/Firststone-brand-kit/` (unchanged this session).
- **Case:** `brand-film/marketing/cases/3amo-fouad.md`
- **QR stack explainer:** `brand-film/product/qr-menu-how-it-works.md`
- **Live site:** https://3amo-fouad-menu.pages.dev (redirects to `/menu.pdf`)
- **Client files (not in the repo):** the ordering page `3amo-fouad-reviewed-new.html` and the menu PDF were chat uploads and won't carry to a new session. Ask the founders to re-share them, or get them from Hamdy's Cloudflare project.
- **Skill sources:** `brand-film/.claude/skills/SOURCE.md`

## Open Questions

- **Where is the ordering page deployed,** if anywhere? Is it the next version that will replace the PDF at the QR address? (Ask Hamdy.)
- **How does Hamdy update the Cloudflare project:** dashboard upload or a connected Git repo? Whose account is it in?
- **Delivery fee:** a fee per area on the page, or a quick reply? Founders are discussing it with Mostafa.
- **Window sticker:** still wanted, given the no-credit decision?
- **Founder decisions** (the list in `brand-film/marketing/README.md`): hours per week, Hamdy's role, name clearance, prices, support reply time, employer policy check, e-invoicing rules, neighbourhood choice.

## Next Steps

1. Get the current ordering page file and the live PDF from the founders or Hamdy.
2. Put the menu data in one data file. Generate the ordering page and a print layout from it (the PDF came from a Chromium print, so the same page can print it). Reconcile every item and price against the live PDF.
3. Add a page title and a preview image (the cover). Make the ordering page the main page at the QR address and keep the PDF one tap away. Test scan → cart → WhatsApp on Android and iPhone.
4. Make a demo copy of the ordering page that sends to Firststone's own WhatsApp, for sales visits and the portfolio (`cases/3amo-fouad.md` §6).
5. Help the founders run the owner conversations (`marketing/03-customer-interviews.md`), then set prices (`marketing/02-offer-and-pricing.md` §4). Update `product-marketing.md` to v4 with what they hear.
6. Build the one-page Arabic-first website from `marketing/04-website-copy.md` once prices and the name are settled.

## Recommended Skills

The repo-level skills in `brand-film/.claude/skills/` load when working under `brand-film/`. Keyword matches, checked by hand:
- `product-marketing`: update the context to v4 after the owner conversations.
- `customer-research`: run and synthesize the owner conversations.
- `pricing` and `offers`: set launch prices and finalize the package.
- `copywriting` and `site-architecture`: build the website copy into a page.
- `sms`: WhatsApp flows, including the restaurant-side order inbox.
- `referrals`: owner and partner referral setup.
- `web-artifacts-builder` or `artifact-design`: if the site or the menu page is built as an HTML page here.
- `run`: to preview and screenshot the ordering page during the data-source rebuild.
- `pdf` (recommender match): checking the generated print PDF against the live one.
- `design:user-research` (recommender match): an alternative to `customer-research` for the interview guide; prefer the vendored one, which already reads the context.

## Environment Notes

- **Repo and branch:** `daz117-stack/agentbay-skills`, branch `claude/gracious-johnson-1hlm5j`. Based on `claude/brand-film`, so the PR targets that branch, not `main`.
- **Branch rule:** cloud sessions are assigned a branch; push only to the one the session names.
- **Push and PR:** push with `git push -u origin <branch>`. Use the GitHub MCP tools for PR work; there is no `gh` CLI.
- **Never commit** client personal data beyond what's already in the public menu.
- **Writing rules:** no invented prices or claims; open items are marked `[NEED]` or `[confirm]`. Follow `brand-film/.agents/voice.md`: no exclamation marks in product, support or billing; numerals for prices.
- **The founder:** Fady prefers direct, analytical answers and wants weak assumptions challenged.
- **PR watching:** the previous session stopped its scheduled check-ins on PR #2. Subscribe again if the new session should watch it.
