---
name: barb-context
description: Load Barb's Eltee Sydney customer care context for prompt, copy, product advice, sizing, shipping, returns, troubleshooting, escalation or brand-voice work.
---

## Resolve current sources before work

This installed plugin is a distribution package, not the application checkout. Relative application paths below refer to the verified `ESGEE-0562/shop-chat-agent` checkout, never the plugin cache or an unrelated current directory.

1. Locate the checkout in the active workspace (`shop-chat-agent/`, or the workspace root when it is the repository). Confirm its Git remote is `https://github.com/ESGEE-0562/shop-chat-agent` with or without `.git`, inspect branch and working-tree status, and check current GitHub `main`. Preserve all local work. Do not reset or pull over changes.
2. Read that checkout's `AGENTS.md`, `BARB_KNOWLEDGE_SOP.md` and `.agents/skills/barb-context/SKILL.md`. The current repository skill is the specialist source for this workflow; follow it together with these source and privacy boundaries.
3. If no checkout is available, use authorised GitHub access to read these exact files from current `ESGEE-0562/shop-chat-agent` `main`. For edits, obtain a verified local checkout before changing anything. If retrieval is unavailable, report BLOCKED or UNVERIFIED and identify the missing source.
4. Read current relevant knowledge from the repository. Do not treat the installed cache as deployed behaviour or current policy. Compare supporting guidance with prompt source where relevant and report conflicts as HOLD.
5. Current customers, products, prices, availability and orders require authorised live Shopify reads. This skills-only plugin adds no Shopify credentials, connection or order-lookup tool. Never infer a customer's order status from static files.
6. The GitHub repo is public. Never put customer details, order exports, private evidence, credentials or internal Drive routing into repository changes. Preserve all commit, push, merge, send, publish and deployment approval gates.

# Barb context

1. Read the relevant section of `CUSTOMER_CARE_KB.md` for Barb's readable operating context and factual customer-care guidance.
2. If changing deployed behaviour, read `app/prompts/prompts.json` in full and treat it as the deployed source of truth.
3. Report any conflict between these sources. Do not silently reconcile claims.
4. Follow the approval and verification rules in `AGENTS.md`.

When drafting a customer response, apply Barb's voice and escalation limits. When changing Barb, use the `update-barb` skill as well.

For Pinky Test guidance, use `CUSTOMER_CARE_KB.md` under The pinky test: the finger goes under the seam around the widest part of the bum. Keep the hygiene sticker in place and try on over clean underwear. This is fit guidance, not a guarantee against leaks.

Pinky Test placement rule: use this sentence verbatim when explaining where the finger goes: "Slide a pinky finger under the seam around the widest part of the bum." Do not add a location explanation or replace this placement with the leg opening, waistband, side of the hip, fabric or gusset. If asked to clarify the location, repeat the approved placement sentence rather than inventing an anatomical explanation.
