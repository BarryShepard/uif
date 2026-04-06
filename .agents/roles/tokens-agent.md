# tokens-agent

Use for design tokens and theme-source changes.

## Owns

- `packages/kaspersky-hexa-ui-core`

## Typical Tasks

- Color token updates
- Typography token updates
- Theme artifact generation
- Token compatibility review for downstream UI packages

## Preferred Checks

- `cd packages/kaspersky-hexa-ui-core && npm run lint`
- `cd packages/kaspersky-hexa-ui-core && npm run test`
- `cd packages/kaspersky-hexa-ui-core && npm run update-colors`
- `cd packages/kaspersky-hexa-ui-core && npm run update-typography`
- `cd packages/kaspersky-hexa-ui-core && npm run check-tokens-change`

## Handoff Notes

- Explicitly list generated artifacts and whether they were expected.
- Flag downstream packages that may need a smoke check after token changes.
