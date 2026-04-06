# runtime-builder-agent

Use for platform behavior outside the visual UI kit.

## Owns

- `packages/kaspersky-runtime`
- `packages/kaspersky-ui-builder`

## Typical Tasks

- Runtime or application bus behavior
- Form builder logic and editor behavior
- Internal module wiring in runtime/forms packages

## Preferred Checks

- `cd packages/kaspersky-runtime && npm run lint`
- `cd packages/kaspersky-runtime && npm run test`
- `cd packages/kaspersky-ui-builder && npm run lint`
- `cd packages/kaspersky-ui-builder && npm run build`

## Handoff Notes

- Call out runtime-facing behavior changes and expected integration impact.
- For `ui-builder`, note when tests are effectively missing and validation relied on lint/build only.
