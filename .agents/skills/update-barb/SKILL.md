---
name: update-barb
description: Safely update a section of Barb's deployed system prompt, validate the duplicated prompt variants, show the diff, and preserve the approval gate before commit, push or deployment.
---

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
