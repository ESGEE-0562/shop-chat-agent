# Barb knowledge management SOP

## Purpose

Keep Barb's customer answers accurate, reviewable and consistent across production, GitHub and the Drive mirror without allowing a reference copy to become a competing source of truth.

## Ownership and authority

- Sarah owns customer-care policy and approves customer-visible knowledge changes.
- Codex prepares changes, checks evidence, reconciles the affected files and verifies deployments.
- GitHub `main` is the release record.
- `app/prompts/prompts.json` is the only repository file that directly powers Barb's customer-facing instructions.
- Shopify remains the authority for live product, price, availability and order data. Do not hard-code volatile Shopify data into the prompt.
- A draft, task, branch, pull request or Drive copy is not approval to merge or deploy.

## Source map

| Source | Purpose | Authority |
|---|---|---|
| `app/prompts/prompts.json` | Barb's deployed instructions and durable customer-care knowledge | Production source of truth |
| Shopify Storefront and Admin APIs | Current products, availability and customer-safe order lookup | Live commerce source of truth |
| `CUSTOMER_CARE_KB.md` | Readable consolidated knowledge and evidence notes | Supporting reference |
| `SKILL.md` | Detailed sizing guidance and measurement provenance | Specialist supporting reference |
| `AGENTS.md` and `.agents/skills/` | Rules for maintaining Barb with Codex | Operating instructions |
| Drive mirror | Convenient read-only distribution copy | Never authoritative |

Intentional differences between the deployed prompt and supporting references must be labelled.

## Runtime and release boundary

- GitHub repository: `ESGEE-0562/shop-chat-agent`
- Production branch: `main`
- Render project: `shop-chat-agent`
- Render web service: `shop-chat-agent` (`srv-d7jgqfho3t8c73dgi0fg`)
- Production URL: `https://shop-chat-agent-0dtd.onrender.com`
- Shopify app: `Barb CS Agent`
- Runtime: OpenAI Responses API through `app/services/openai.server.js`

The Claude-to-OpenAI migration was completed on 4 September 2026 through pull requests #10 and #11. Claude is not part of the active application runtime. Render is configured to deploy `main`, but its GitHub trigger was unreliable during migration. After every approved merge, verify that Render deploys the exact merge commit and use a manual exact-commit deployment if no event appears.

If a release fails, roll back to the previous known-good Render deployment, verify the public endpoint and storefront widget, and retain the failed deployment logs and test case. Do not rely on a retired provider as the ongoing rollback plan.

## Standard change workflow

1. Record the requested change in the relevant Codex project task: General, Returns, Product information, Tariffs and taxes, Sizing, Wear and care, or Partnerships.
2. Identify the evidence owner before drafting:
   - Shopify for current product, price, stock and order data.
   - Approved Eltee policy for returns, shipping, tariffs, taxes, care and partnerships.
   - Confirmed product documentation for performance, materials, certifications and sizing.
3. Read the complete affected section in `app/prompts/prompts.json` and the related supporting files. Mark unresolved conflicts `HOLD` rather than choosing silently.
4. Make the change on a dedicated branch. Update every affected repository source in the same pull request. Do not edit the Drive mirror directly.
5. Run the required checks:
   - Validate `app/prompts/prompts.json` as JSON.
   - Confirm `standardAssistant.content` and `enthusiasticAssistant.content` remain identical unless Sarah approved an experiment.
   - Run tests, typecheck and the production build.
   - Test the changed customer scenario, plus order privacy when relevant.
6. Present a focused diff with the evidence used, intentional differences and test results.
7. Obtain Sarah's explicit approval before merging any customer-visible change to `main` or deploying it.
8. Merge the approved pull request and verify Render deploys the exact merge commit. If Render creates no event, use a manual deploy of the exact approved `main` commit.
9. Verify the live storefront answer, Shopify tool connection, logs and rollback availability. If a critical check fails, roll back to the previous known-good Render deployment.
10. Record the deployed commit, date, tests and any intentional source differences in the pull request.

## Drive mirror procedure

The mirror is outbound from GitHub only. GitHub `main` wins if the files differ.

The weekly sync should copy these files from GitHub `main` to the `shop-chat-agent-ELTEEHQ` Drive folder:

- `CUSTOMER_CARE_KB.md`
- `SKILL.md`
- `BARB_KNOWLEDGE_SOP.md`

After each run, the automation should compare each GitHub file with its Drive counterpart and record:

- GitHub commit SHA
- sync timestamp in Australia/Sydney
- per-file match or mismatch
- failed or missing files

Until that automation and its run history are directly verified, label Drive sync status `UNVERIFIED`. Do not use the Drive copy to decide what Barb currently tells customers.

If someone edits a mirrored Drive file, move the proposed change into a GitHub branch and pull request. The next successful sync may overwrite the Drive edit.

## Weekly review checklist

- [ ] Confirm the mirror automation ran successfully.
- [ ] Confirm all three mirrored files match GitHub `main`.
- [ ] Review unresolved `HOLD`, `REVIEW` and `UNVERIFIED` notes.
- [ ] Check that Shopify-dependent facts are still fetched live rather than duplicated in the prompt.
- [ ] Check recent failed chats and escalations for a knowledge gap.
- [ ] Open a scoped change task for any issue. Do not patch production ad hoc.

## Release checklist

- [ ] Evidence is current and attributable.
- [ ] Live prompt and affected references are reconciled.
- [ ] JSON, prompt parity, tests, typecheck and build pass.
- [ ] Privacy and Shopify tool behaviour pass where relevant.
- [ ] Sarah approved the exact customer-visible change.
- [ ] The exact approved commit is live on Render.
- [ ] Storefront response and logs are verified after deployment.
- [ ] The previous Render deployment remains available for rollback.
