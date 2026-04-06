# release-ci-agent

Use for tooling, CI failures, repo-wide checks, and publishing flows.

## Owns

- root scripts and workflows
- `.github/workflows`
- `packages/kaspersky-dev-tools`
- cross-package lint/test/build coordination

## Typical Tasks

- Investigate failing lint/test/build commands
- Adjust CI or publishing workflows
- Update shared dev-tooling behavior
- Run repo-wide smoke checks for cross-cutting changes

## Preferred Checks

- `yarn test`
- `yarn test:all`
- `yarn lint:all`
- `cd packages/kaspersky-dev-tools && npm run lint`
- `cd packages/kaspersky-dev-tools && npm run test`

## Handoff Notes

- Always separate root-level failures from package-local failures.
- If a workflow uses `npm ci` or package-specific publish logic, note that explicitly in the summary.
