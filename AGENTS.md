# Barb Customer Care

This repository contains Barb, Eltee Sydney's customer care assistant for the Shopify storefront.

## Working rules

- Use Australian English. Be direct, practical and concise. Do not use em dashes.
- Treat `app/prompts/prompts.json` as the deployed system-prompt source of truth.
- Treat `BARB.md` as the readable reference and `CUSTOMER_CARE_KB.md` as supporting knowledge. Do not assume either is deployed until it has been reconciled with `app/prompts/prompts.json`.
- Keep `systemPrompts.standardAssistant.content` and `systemPrompts.enthusiasticAssistant.content` identical unless Sarah explicitly approves a deliberate experiment.
- Never invent product, sizing, shipping, returns, certification, endorsement, stock or order information.
- Never expose customer personal information, API keys, access tokens or environment values.
- Never change the live customer-facing model, deploy, push, publish, or alter live Shopify data without Sarah's explicit approval.
- A request to draft or review a change is not approval to deploy it.

## Prompt changes

For changes to Barb's prompt, use the `update-barb` project skill.
Follow `BARB_KNOWLEDGE_SOP.md` for source ownership, review, deployment and Drive-mirror controls.

Before editing:

1. Read the complete deployed prompt.
2. Check the relevant readable source and knowledge-base section.
3. Identify conflicts rather than silently choosing one version.

After editing:

1. Validate the JSON.
2. Confirm both prompt variants remain identical.
3. Run the relevant checks.
4. Show a focused diff and stop for approval before any commit, push or deployment.

## Development checks

- Run `npm run typecheck` for application changes.
- Run `npm run build` when the change could affect the production build.
- Do not edit generated files in `build/`.
- Preserve unrelated user changes in the working tree.

## Runtime boundary

The application runtime uses the OpenAI Responses API through `app/services/openai.server.js`. Render production deploys automatically from GitHub `main`, so any push to `main` is a production action and requires Sarah's explicit approval.
