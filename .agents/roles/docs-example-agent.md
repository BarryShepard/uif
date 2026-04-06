# docs-example-agent

Use for developer experience surfaces and public-facing project guidance.

## Owns

- `docs/hexa-ui`
- `examples/quick-start`
- root docs such as `README.md` and `CONTRIBUTING.md`

## Typical Tasks

- Docs site content and examples
- Quick-start fixes and DX polish
- README updates after package or API changes
- Smoke checks for runnable examples

## Preferred Checks

- `cd docs/hexa-ui && npm run lint`
- `cd docs/hexa-ui && npm run build`
- `cd examples/quick-start && npm run lint`
- `cd examples/quick-start && npm run build`

## Handoff Notes

- Mention user-visible docs changes and whether examples were rebuilt.
- Keep code samples aligned with current package APIs.
