# Update Barb

Update a section of Barb's system prompt in `app/prompts/prompts.json`, then commit and push to GitHub so Render redeploys automatically.

## Usage

```
/update-barb <section> "<new content or instruction>"
```

**Sections you can update:**
- `shipping` - shipping costs, thresholds, timeframes, origins
- `returns` - return window, portals, refund processing times
- `products` - product descriptions, absorbency, sizing notes, variants
- `sizing` - size guide URLs, between-size guidance, pinky test
- `care` - wash instructions, tumble dryer rules
- `discounts` - promo code rules, pricing policy
- `certifications` - OEKO-TEX, Swimming Australia endorsement
- `escalation` - contact emails, escalation situations
- `rules` - the numbered rules at the bottom of the prompt
- `voice` - tone guidance, banned words
- `prompt` - replace the entire prompt content (advanced)

If no section is specified, ask the user which section they want to update and what the change is.

## Instructions

1. Read `app/prompts/prompts.json` in full.

2. Identify which section of the prompt content needs updating based on the user's argument. The prompt content is one long string inside `systemPrompts.standardAssistant.content` and `systemPrompts.enthusiasticAssistant.content` - both are identical and must always be kept in sync.

3. Make the targeted edit. Be surgical - only change what the user specifies. Preserve all formatting, newlines (`\n`), and surrounding content exactly. Do not rewrite sections the user didn't mention.

4. If the user's instruction is ambiguous (e.g. "update shipping" with no detail), ask them what specifically has changed before editing.

5. After editing, show the user a clear diff of what changed - the old text and the new text - and ask them to confirm before proceeding.

6. Once confirmed:
   - Save the file
   - Run: `git add app/prompts/prompts.json`
   - Commit with a message in the format: `Update Barb: <section> - <one line summary>`
   - Push to `main`: `git push origin main`

7. Confirm to the user that the push succeeded and that Render will pick up the change automatically (usually within 2-3 minutes).

## Example

User: `/update-barb shipping "Australia free threshold is now $120 AUD, not $99"`

Steps:
- Find the line in the shipping section: `- Australia: free over $99 AUD, otherwise $10.95 standard or $15.95 express`
- Change to: `- Australia: free over $120 AUD, otherwise $10.95 standard or $15.95 express`
- Show diff, wait for confirmation
- Commit: `Update Barb: shipping - Australia free threshold raised to $120 AUD`
- Push to main

## Important

- Both `standardAssistant` and `enthusiasticAssistant` prompts must always be identical. Update both every time.
- Never change `version`, `lastUpdated` description fields - leave those alone.
- Never push without user confirmation of the diff first.
- If the push fails, report the error and do not retry automatically.
