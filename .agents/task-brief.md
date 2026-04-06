# UIF Task Brief

Use this template when you want to describe a task in 3-5 lines instead of writing a long prompt.

```text
Task:
Area:
Constraints:
Checks:
Context:
```

## Recommended Short Forms

```text
Task: fix visual regression in Select
Area: hexa-ui
Checks: package lint + relevant tests
```

```text
Task: add token for new brand color
Area: hexa-ui-core
Constraints: do not change existing names
Checks: lint + token update flow
```

```text
Task: update docs after API change
Area: docs + example
Constraints: keep examples runnable
Checks: npm run build in touched apps
```

## Area Keywords

- `hexa-ui`
- `core` or `tokens`
- `icons`
- `runtime`
- `ui-builder`
- `docs`
- `example`
- `tooling` or `ci`
