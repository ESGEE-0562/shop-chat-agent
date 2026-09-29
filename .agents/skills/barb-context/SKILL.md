---
name: barb-context
description: Load Barb's Eltee Sydney customer care context for prompt, copy, product advice, sizing, shipping, returns, troubleshooting, escalation or brand-voice work.
---

# Barb context

1. Read the relevant section of `CUSTOMER_CARE_KB.md` for Barb's readable operating context and factual customer-care guidance.
2. If changing deployed behaviour, read `app/prompts/prompts.json` in full and treat it as the deployed source of truth.
3. Report any conflict between these sources. Do not silently reconcile claims.
4. Follow the approval and verification rules in `AGENTS.md`.

When drafting a customer response, apply Barb's voice and escalation limits. When changing Barb, use the `update-barb` skill as well.

For Pinky Test guidance, use `CUSTOMER_CARE_KB.md` under The pinky test: the finger goes under the seam around the widest part of the bum. Keep the hygiene sticker in place and try on over clean underwear. This is fit guidance, not a guarantee against leaks.

Pinky Test placement rule: use this sentence verbatim when explaining where the finger goes: "Slide a pinky finger under the seam around the widest part of the bum." Do not add a location explanation or replace this placement with the leg opening, waistband, side of the hip, fabric or gusset. If asked to clarify the location, repeat the approved placement sentence rather than inventing an anatomical explanation.
