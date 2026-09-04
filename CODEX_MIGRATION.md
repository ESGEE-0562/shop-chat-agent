# Claude Code to Codex migration

## Completed

- `AGENTS.md` now gives Codex repository-wide operating instructions.
- `.agents/skills/barb-context/SKILL.md` replaces the Claude `barb-context` command for Codex.
- `.agents/skills/update-barb/SKILL.md` replaces the Claude `update-barb` command for Codex.
- The obsolete Claude Code commands have been removed.

## Runtime migration completed

- Production uses the OpenAI Responses API with streaming and function calls.
- The default is `gpt-5.6-terra` with reasoning effort `none`, configurable through `OPENAI_MODEL`. Any production model change remains approval-gated.
- Existing stored conversation and tool-result records are translated into the OpenAI input format.
- Render has `OPENAI_API_KEY` and successfully called the production model.
- Pull requests #10 and #11 were merged to `main`. Render deployed merge commit `6ec8914b8c4be66b950e697662462fbdf67fe0b6` on 4 September 2026.
- Production checks passed for the public chat stream, live storefront widget, Shopify Storefront product search, Shopify Admin order lookup, and the email-plus-order-number privacy gate.
- The previous Claude deployment and `CLAUDE_API_KEY` remain available temporarily for rollback.

## Ongoing maintenance

Follow `BARB_KNOWLEDGE_SOP.md` for customer-care knowledge changes. Follow `RENDER_CUTOVER.md` for future releases and rollback.

Render is configured to deploy `main` on commit, but the GitHub event did not trigger a deployment during the migration. Verify the exact commit appears in Render after every approved merge and use a manual deployment when it does not.
