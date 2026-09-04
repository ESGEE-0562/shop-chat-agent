# Render cutover runbook

## Current verified production topology

- Render project: `shop-chat-agent`
- Web service: `shop-chat-agent`
- Repository: `ESGEE-0562/shop-chat-agent`
- Production branch: `main`
- Auto-deploy: on commit
- App URL: `https://shop-chat-agent-0dtd.onrender.com`
- Database: Render PostgreSQL in the same Ohio region
- Shopify app: `Barb CS Agent`

Pushing to `main` is the production deployment action. Do not use `main` for the first OpenAI smoke test.

## Environment readiness

Add these variables directly in Render. Never place their values in source control or chat.

- `OPENAI_API_KEY`: present and verified with a successful minimal Responses API request on 7 August 2026
- `OPENAI_MODEL`: optional, staged default is `gpt-5.6-terra`

Keep `CLAUDE_API_KEY` during the first deployment as a rollback precaution. The migrated code does not read it.

## Pre-production test

1. Create a separate Render development service from the migration branch, or enable a manual PR preview.
2. Copy the existing non-secret configuration and connect an isolated development database where practical.
3. Add `OPENAI_API_KEY` directly in the development service.
4. Verify these scenarios:
   - General product question returns streamed text.
   - Product search calls Shopify Storefront MCP and displays product cards.
   - Order lookup refuses to run until both email and order number are supplied.
   - Valid development-store order lookup returns a customer-safe status.
   - Sizing guidance does not give a guaranteed size.
   - Fault, return and lost-parcel questions follow Barb's escalation rules.
   - An existing conversation created before the migration can continue.
5. Check Render logs for API, tool-call, database and streaming errors.

## Production cutover

1. Review the migration diff and test evidence.
2. Obtain Sarah's explicit approval to merge or push to `main`.
3. Confirm `OPENAI_API_KEY` exists in the production Render service.
4. Merge or push the approved commit to `main`.
5. Watch the automatic Render deployment until it is live.
6. Run the same smoke tests against the installed Shopify app.
7. Confirm new conversations appear in the embedded admin dashboard.

## Rollback

If customer responses, tools, streaming or authentication fail:

1. Roll back the Render service to the last known-good Claude deployment.
2. Confirm the service is live and the Shopify chat bubble responds.
3. Keep the failed deployment logs and exact test case for diagnosis.
4. Do not remove either provider key until the migration has been stable and explicitly signed off.
