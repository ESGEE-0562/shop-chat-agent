---
name: update-barb
description: Safely update a section of Barb's deployed system prompt, validate the duplicated prompt variants, show the diff, and preserve the approval gate before commit, push or deployment.
---

## Resolve current sources before work

This installed plugin is a distribution package, not the application checkout. Relative application paths below refer to the verified `ESGEE-0562/shop-chat-agent` checkout, never the plugin cache or an unrelated current directory.

1. Locate the checkout in the active workspace (`shop-chat-agent/`, or the workspace root when it is the repository). Confirm its Git remote is `https://github.com/ESGEE-0562/shop-chat-agent` with or without `.git`, inspect branch and working-tree status, and check current GitHub `main`. Preserve all local work. Do not reset or pull over changes.
2. Read that checkout's `AGENTS.md`, `BARB_KNOWLEDGE_SOP.md` and `.agents/skills/update-barb/SKILL.md`. The current repository skill is the specialist source for this workflow; follow it together with these source and privacy boundaries.
3. If no checkout is available, use authorised GitHub access to read these exact files from current `ESGEE-0562/shop-chat-agent` `main`. For edits, obtain a verified local checkout before changing anything. If retrieval is unavailable, report BLOCKED or UNVERIFIED and identify the missing source.
4. Read current relevant knowledge from the repository. Do not treat the installed cache as deployed behaviour or current policy. Compare supporting guidance with prompt source where relevant and report conflicts as HOLD.
5. Current customers, products, prices, availability and orders require authorised live Shopify reads. This skills-only plugin adds no Shopify credentials, connection or order-lookup tool. Never infer a customer's order status from static files.
6. The GitHub repo is public. Never put customer details, order exports, private evidence, credentials or internal Drive routing into repository changes. Preserve all commit, push, merge, send, publish and deployment approval gates.

# Update Barb

Update only the requested section of `app/prompts/prompts.json`.

## Workflow

1. Read `AGENTS.md` and the complete `app/prompts/prompts.json` file.
2. Read the matching sections in `CUSTOMER_CARE_KB.md`.
3. Confirm the requested new fact or instruction is unambiguous. If sources conflict, report the conflict and stop before editing.
4. Make a surgical edit to both `systemPrompts.standardAssistant.content` and `systemPrompts.enthusiasticAssistant.content`. Keep them identical.
5. Do not change `version`, `lastUpdated` or `description` unless Sarah explicitly requests it.
6. Validate with:

   ```bash
   node -e 'const p=require("./app/prompts/prompts.json"); const s=p.systemPrompts; if(s.standardAssistant.content!==s.enthusiasticAssistant.content) process.exit(1); console.log("Prompt JSON valid; variants match")'
   ```

7. Show a focused diff containing the old and new text.
8. Stop and request Sarah's explicit approval before committing, pushing or deploying.

After approval, commit only the approved files with `Update Barb: <section> - <summary>`. Push only if the approval includes pushing. If a push fails, report the error and do not retry automatically.

For Pinky Test changes, reconcile both prompt variants, `CUSTOMER_CARE_KB.md` and the sizing `SKILL.md`. Preserve the placement under the seam around the widest part of the bum, the hygiene sticker and clean-underwear instructions, all three resistance outcomes, and the limit that fit guidance is not a guarantee against leaks.

Pinky Test placement rule: use this sentence verbatim when explaining where the finger goes: "Slide a pinky finger under the seam around the widest part of the bum." Do not add a location explanation or replace this placement with the leg opening, waistband, side of the hip, fabric or gusset. If asked to clarify the location, repeat the approved placement sentence rather than inventing an anatomical explanation.
