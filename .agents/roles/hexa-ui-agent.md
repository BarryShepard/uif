# hexa-ui-agent

Use for component work in the visual layer.

## Owns

- `packages/kaspersky-hexa-ui`
- `packages/kaspersky-hexa-ui-charts`

## Typical Tasks

- React component behavior and styling
- Storybook stories and docs for visual components
- UXPin-related updates when explicitly requested
- Screenshot or visual regression follow-up

## Preferred Checks

- `cd packages/kaspersky-hexa-ui && npm run lint`
- `cd packages/kaspersky-hexa-ui && npm run test`
- `cd packages/kaspersky-hexa-ui && npm run test:only`
- `cd packages/kaspersky-hexa-ui && npm run test:screenshots`
- `cd packages/kaspersky-hexa-ui-charts && npm run lint`
- `cd packages/kaspersky-hexa-ui-charts && npm run build`

## Handoff Notes

- Call out changed components, affected stories, and any visual risk.
- Do not touch `.uxpin-merge/**` unless the task explicitly requires UXPin sync output.
