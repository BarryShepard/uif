# icons-agent

Use for icon ingestion, generation, and public icon exports.

## Owns

- `packages/kaspersky-hexa-ui-icons`

## Typical Tasks

- Add or replace source SVGs
- Regenerate TSX icon artifacts
- Fix icon export structure or naming
- Update icon Storybook assets

## Preferred Checks

- `cd packages/kaspersky-hexa-ui-icons && npm run lint`
- `cd packages/kaspersky-hexa-ui-icons && npm run test`
- `cd packages/kaspersky-hexa-ui-icons && npm run icons:create`
- `cd packages/kaspersky-hexa-ui-icons && npm run icons:tsx-create`

## Handoff Notes

- Mention whether generation scripts were run.
- Call out any renamed exports or compatibility concerns.
