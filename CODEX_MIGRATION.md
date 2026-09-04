# Claude Code to Codex migration

## Completed

- `AGENTS.md` now gives Codex repository-wide operating instructions.
- `.agents/skills/barb-context/SKILL.md` replaces the Claude `barb-context` command for Codex.
- `.agents/skills/update-barb/SKILL.md` replaces the Claude `update-barb` command for Codex.
- The obsolete Claude Code commands have been removed.

## Runtime migration staged locally

- The application now uses the OpenAI Responses API with streaming and function calls.
- The staged default is `gpt-5.6-terra` with reasoning effort `none`, configurable through `OPENAI_MODEL`. Terra is the better starting tier for a latency-sensitive customer-care bot; the production model remains approval-gated.
- Existing stored conversation and tool-result records are translated into the OpenAI input format.
- Render has `OPENAI_API_KEY`. A minimal Responses API request returned HTTP 200 from `gpt-5.6-terra` on 7 August 2026.
- No production credentials, deployment configuration or live store data has been changed.
- The migration is isolated on `codex/barb-openai-runtime`; production remains on the pre-migration `main` code until explicit cutover approval.

## Production cutover

Optionally set `OPENAI_MODEL`, run a development smoke test, then approve the merge to `main`. Render deploys `main` automatically, so the merge is the production switch.

See `RENDER_CUTOVER.md` for the verified topology, test cases and rollback procedure.
