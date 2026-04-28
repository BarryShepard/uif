# UXPin Reliable Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Establish a reliable UXPin Merge integration workflow for Hexa UI by adding tier classification, production canary checklists, and reference runtime coverage for `Tag`, `Tabs`, and `Table`.

**Architecture:** Keep the first implementation increment small and package-scoped. Add a lightweight reliability module under `uxpin/reliability`, use existing `helpers/uxpin*.test.tsx` patterns for runtime coverage, and update UXPin docs/backlog so production smoke checks are part of the workflow.

**Tech Stack:** React, TypeScript, Jest, React Testing Library, styled-components, UXPin Merge CLI, package-level `npm run lint-ts` and targeted Jest tests.

---

## File Structure

- Create: `uxpin/reliability/componentTiers.ts`
  - Owns the UXPin reliability tier model and known reference components.
  - Provides small pure helpers that tests and future scripts can reuse.
- Create: `helpers/uxpinReliabilityTiers.test.ts`
  - Tests tier classification and reference component choices.
- Create: `uxpin/reliability/canary-checklist.md`
  - Defines the manual production canary pages and smoke steps.
- Create: `uxpin/reliability/component-integration-card.md`
  - Provides the per-component contract card that engineers fill before implementation.
- Create: `helpers/uxpinReliableReferenceRuntime.test.tsx`
  - Locks the first reference runtime behaviors for `Tag`, `Tabs`, and `Table`.
- Modify: `uxpin/BACKLOG.md`
  - Adds a stable backlog entry for the reliability rollout and production canary ownership.
- Modify: `README.md`
  - Adds a short link from the existing UXPin section to the new reliability workflow.

## Task 1: Add Tier Classification Module

**Files:**
- Create: `uxpin/reliability/componentTiers.ts`
- Test: `helpers/uxpinReliabilityTiers.test.ts`

- [ ] **Step 1: Create the failing tier tests**

Create `helpers/uxpinReliabilityTiers.test.ts`:

```ts
import {
  UXPIN_RELIABILITY_REFERENCE_COMPONENTS,
  getUXPinComponentTier,
  getUXPinTierValidation,
  isUXPinReferenceComponent
} from '../uxpin/reliability/componentTiers'

describe('UXPin reliability tiers', () => {
  it('classifies reference components by reliability tier', () => {
    expect(getUXPinComponentTier('Tag')).toBe('atomic')
    expect(getUXPinComponentTier('Tabs')).toBe('editable-composite')
    expect(getUXPinComponentTier('Table')).toBe('stateful-product-flow')
  })

  it('falls back to editable-composite for unknown UXPin components', () => {
    expect(getUXPinComponentTier('NewComposite')).toBe('editable-composite')
  })

  it('exposes the selected rollout reference components', () => {
    expect(UXPIN_RELIABILITY_REFERENCE_COMPONENTS).toEqual({
      atomic: 'Tag',
      'editable-composite': 'Tabs',
      'stateful-product-flow': 'Table'
    })
    expect(isUXPinReferenceComponent('Tag')).toBe(true)
    expect(isUXPinReferenceComponent('Menu')).toBe(false)
  })

  it('returns tier-specific validation commands and manual checks', () => {
    expect(getUXPinTierValidation('atomic')).toEqual({
      commands: [
        'npm run lint-ts'
      ],
      manualChecks: [
        'Insert the component in UXPin editor',
        'Edit common props',
        'Resize the component frame',
        'Verify the pushed UXPin branch in cloud editor'
      ]
    })

    expect(getUXPinTierValidation('stateful-product-flow').manualChecks).toContain(
      'Verify prototype-mode state transitions'
    )
  })
})
```

- [ ] **Step 2: Run the failing tier tests**

Run:

```bash
npm run test:only -- helpers/uxpinReliabilityTiers.test.ts
```

Expected result:

```text
FAIL helpers/uxpinReliabilityTiers.test.ts
Cannot find module '../uxpin/reliability/componentTiers'
```

- [ ] **Step 3: Implement the tier module**

Create `uxpin/reliability/componentTiers.ts`:

```ts
export type UXPinReliabilityTier =
  | 'atomic'
  | 'editable-composite'
  | 'stateful-product-flow'

type UXPinTierValidation = {
  commands: string[],
  manualChecks: string[]
}

export const UXPIN_RELIABILITY_REFERENCE_COMPONENTS: Record<UXPinReliabilityTier, string> = {
  atomic: 'Tag',
  'editable-composite': 'Tabs',
  'stateful-product-flow': 'Table'
}

const ATOMIC_COMPONENTS = new Set([
  'Badge',
  'Button',
  'Icon',
  'Label',
  'Link',
  'Status',
  'Tag',
  'Text',
  'Toggle'
])

const STATEFUL_PRODUCT_FLOW_COMPONENTS = new Set([
  'Menu',
  'PageWrapper',
  'Sidebar',
  'Table',
  'TreeList',
  'Wizard'
])

const TIER_VALIDATION: Record<UXPinReliabilityTier, UXPinTierValidation> = {
  atomic: {
    commands: [
      'npm run lint-ts'
    ],
    manualChecks: [
      'Insert the component in UXPin editor',
      'Edit common props',
      'Resize the component frame',
      'Verify the pushed UXPin branch in cloud editor'
    ]
  },
  'editable-composite': {
    commands: [
      'npm run lint-ts',
      'npm run test:only -- helpers/uxpinReliableReferenceRuntime.test.tsx'
    ],
    manualChecks: [
      'Insert the component in UXPin editor',
      'Edit common props',
      'Add a child layer',
      'Delete a child layer',
      'Hide a child layer',
      'Reorder child layers',
      'Verify editor-mode rendering in UXPin cloud',
      'Verify prototype-mode interactions when the component exposes actions'
    ]
  },
  'stateful-product-flow': {
    commands: [
      'npm run lint-ts',
      'npm run test:only -- helpers/uxpinReliableReferenceRuntime.test.tsx'
    ],
    manualChecks: [
      'Insert the component in UXPin editor',
      'Edit common props',
      'Add a child layer',
      'Delete a child layer',
      'Hide a child layer',
      'Resize the component frame',
      'Verify editor-mode rendering in UXPin cloud',
      'Verify prototype-mode state transitions',
      'Record production-only limitations in uxpin/BACKLOG.md'
    ]
  }
}

export const getUXPinComponentTier = (componentName: string): UXPinReliabilityTier => {
  if (ATOMIC_COMPONENTS.has(componentName)) {
    return 'atomic'
  }

  if (STATEFUL_PRODUCT_FLOW_COMPONENTS.has(componentName)) {
    return 'stateful-product-flow'
  }

  return 'editable-composite'
}

export const getUXPinTierValidation = (
  tier: UXPinReliabilityTier
): UXPinTierValidation => TIER_VALIDATION[tier]

export const isUXPinReferenceComponent = (componentName: string): boolean => (
  Object.values(UXPIN_RELIABILITY_REFERENCE_COMPONENTS).includes(componentName)
)
```

- [ ] **Step 4: Run tier tests and typecheck**

Run:

```bash
npm run test:only -- helpers/uxpinReliabilityTiers.test.ts
npm run lint-ts
```

Expected result:

```text
PASS helpers/uxpinReliabilityTiers.test.ts
```

`npm run lint-ts` exits with code `0`.

- [ ] **Step 5: Commit tier module**

Run:

```bash
git add uxpin/reliability/componentTiers.ts helpers/uxpinReliabilityTiers.test.ts
git commit -m "chore(uxpin): add reliability tier model"
```

## Task 2: Add Production Canary And Component Contract Docs

**Files:**
- Create: `uxpin/reliability/canary-checklist.md`
- Create: `uxpin/reliability/component-integration-card.md`
- Modify: `README.md`

- [ ] **Step 1: Add the production canary checklist**

Create `uxpin/reliability/canary-checklist.md`:

```md
# UXPin Production Canary Checklist

Use this checklist after pushing a UXPin branch with `npm run uxpin:push`.

## Canary Pages

1. Atomic components
   - Include `Tag`, `Text`, `Badge`, `Button`, and `Toggle`.
   - Validate prop editing and content-hugging frames.

2. Nested editable components
   - Include `Tabs`, `Toolbar`, `Dropdown`, and `Submenu`.
   - Validate add, delete, hide, and reorder behavior for child layers.

3. Frame and flex behavior
   - Include `PageWrapper`, `SectionWrapper`, `GroupWrapper`, `Menu`, and `Table`.
   - Validate hug, fill, flex-width, and full-height behavior.

4. Prototype interactions
   - Include `Tabs`, `ToolbarButton`, `MenuItem`, and `SubmenuItem`.
   - Validate per-child click actions in prototype mode.

5. Stateful product flows
   - Include `Table` and `Sidebar`.
   - Validate row selection, pagination, sidebar open and close behavior, and frame resizing.

## Per-Component Smoke

- Insert the component from the UXPin library.
- Edit the most common props.
- Add a child layer when the component supports editable children.
- Delete a child layer when the component supports editable children.
- Hide a child layer when the component supports editable children.
- Reorder child layers when order affects rendering.
- Resize the component frame.
- Check editor mode.
- Check prototype mode when interactions or state are involved.
- Record production-only limitations in `uxpin/BACKLOG.md`.

## Ready Criteria

- Local `npm run lint-ts` passed before push.
- Targeted runtime tests passed before push.
- UXPin cloud editor matches the intended layer model.
- UXPin prototype mode matches the intended interaction model.
- Any limitation is documented with a reproduction path.
```

- [ ] **Step 2: Add the per-component integration card**

Create `uxpin/reliability/component-integration-card.md`:

```md
# UXPin Component Integration Card

Copy this card into task notes before integrating or changing a UXPin component.

## Component

- Name:
- Reliability tier: atomic | editable-composite | stateful-product-flow
- Owner files:
  - Production component:
  - UXPin wrapper:
  - UXPin preset:
  - Runtime tests:

## Production Contract

- Public props used in UXPin:
- Public children or data model:
- Storybook or runtime behavior used as reference:

## UXPin Authoring Contract

- First-class UXPin controls:
- UXPin-only controls:
- Editable child layers:
- Named slots:
- Default preset children:
- Explicit empty state behavior:

## Runtime Contract

- Prop resolver:
- Children resolver:
- Hidden layer filtering:
- Placeholder conversion:
- Data conversion:
- Frame sizing:

## Validation

- Commands:
  - `npm run lint-ts`
  - `git diff --check -- README.md uxpin/BACKLOG.md uxpin/reliability/componentTiers.ts uxpin/reliability/canary-checklist.md uxpin/reliability/component-integration-card.md helpers/uxpinReliabilityTiers.test.ts helpers/uxpinReliableReferenceRuntime.test.tsx`
- Runtime tests:
- Local UXPin dev smoke:
- UXPin cloud editor smoke:
- UXPin prototype smoke:

## Limitations

- Production-only limitations:
- Follow-up backlog entry:
```

- [ ] **Step 3: Link reliability docs from README**

In `README.md`, add this paragraph after the `npm run uxpin:push -- --branch my-feature-branch` example in the UXPin section:

```md
#### Надежная интеграция UXPin компонентов

Для production-oriented интеграции используйте reliability workflow:

- дизайн процесса: `docs/superpowers/specs/2026-04-28-uxpin-reliable-integration-design.md`
- canary checklist: `uxpin/reliability/canary-checklist.md`
- component integration card: `uxpin/reliability/component-integration-card.md`

Локальный `npm run uxpin:dev` не считается достаточной проверкой для сложных компонентов. Для `Tabs`, `Toolbar`, `Dropdown`, `Table`, `Sidebar` и других nested/stateful компонентов нужен runtime test на serialized UXPin props и smoke в UXPin cloud editor/prototype mode.
```

- [ ] **Step 4: Validate docs formatting**

Run:

```bash
git diff --check -- README.md uxpin/reliability/canary-checklist.md uxpin/reliability/component-integration-card.md
rg -n "TBD|TODO|FIXME" uxpin/reliability README.md
```

Expected result:

```text
```

The `rg` command prints no matches and exits with code `1`.

- [ ] **Step 5: Commit reliability docs**

Run:

```bash
git add README.md uxpin/reliability/canary-checklist.md uxpin/reliability/component-integration-card.md
git commit -m "docs(uxpin): add reliability workflow checklists"
```

## Task 3: Add Reference Runtime Tests

**Files:**
- Create: `helpers/uxpinReliableReferenceRuntime.test.tsx`

- [ ] **Step 1: Create failing reference runtime tests**

Create `helpers/uxpinReliableReferenceRuntime.test.tsx`:

```tsx
import '@testing-library/jest-dom'

import { render, screen } from '@testing-library/react'
import React from 'react'

import { resolveUXPinChildrenFromProps, resolveUXPinRuntimeProps } from '../uxpin/uxpinRuntime'
import Table from '../uxpin/components/Table/Table'
import Tabs from '../uxpin/components/Tabs/Tabs'
import Tag from '../uxpin/components/Tag/Tag'
import { tabChildrenToPanes } from '../uxpin/components/TabItem/TabItem'

describe('UXPin reliable reference runtime', () => {
  it('resolves Tag props from overriddenCodeProps as the atomic reference', () => {
    const props = resolveUXPinRuntimeProps({
      label: 'Default label',
      mode: 'neutral',
      overriddenCodeProps: {
        label: 'Overridden label',
        mode: 'medium'
      }
    })

    expect(props).toMatchObject({
      label: 'Overridden label',
      mode: 'medium'
    })
  })

  it('renders Tag with overridden serialized label', () => {
    render(
      <Tag
        label="Default label"
        overriddenCodeProps={{
          label: 'Serialized label'
        }}
      />
    )

    expect(screen.getByText('Serialized label')).toBeInTheDocument()
  })

  it('resolves Tabs children from overriddenCodeProps as the editable composite reference', () => {
    const children = resolveUXPinChildrenFromProps({
      children: null,
      overriddenCodeProps: {
        children: [
          {
            name: 'TabItem',
            overriddenCodeProps: {
              text: 'Runtime tab',
              selected: true
            }
          }
        ]
      }
    })

    const { panes, selectedKey } = tabChildrenToPanes(children)

    expect(panes).toHaveLength(1)
    expect(selectedKey).toBe('1')
  })

  it('renders Tabs from serialized overridden children', () => {
    render(
      <Tabs
        defaultActiveKey="1"
        overriddenCodeProps={{
          children: [
            {
              name: 'TabItem',
              overriddenCodeProps: {
                text: 'Runtime tab',
                selected: true,
                children: <div>Runtime content</div>
              }
            }
          ] as unknown as React.ReactNode
        }}
      />
    )

    expect(screen.getByRole('tab', { name: 'Runtime tab' })).toBeInTheDocument()
  })

  it('renders Table from serialized column children as the stateful reference', () => {
    const { container } = render(
      <Table
        rowsCount={3}
        showPagination={false}
        overriddenCodeProps={{
          children: [
            {
              name: 'TableColumn',
              overriddenCodeProps: {
                title: 'Runtime asset',
                field: 'asset',
                width: 240,
                cellType: 'text'
              }
            }
          ] as unknown as React.ReactNode
        }}
      />
    )

    expect(container.querySelector('[data-hexa-uxpin-table-root="true"]')).toBeInTheDocument()
    expect(screen.getByText('Runtime asset')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run reference tests to verify current behavior**

Run:

```bash
npm run test:only -- helpers/uxpinReliableReferenceRuntime.test.tsx
```

Expected result:

```text
PASS helpers/uxpinReliableReferenceRuntime.test.tsx
```

If the test fails because a component does not resolve serialized children from `overriddenCodeProps`, do not patch CSS. Fix the runtime chain in the component wrapper:

```text
rawProps
-> resolveUXPinRuntimeProps(rawProps)
-> resolveUXPinChildrenFromProps(rawProps)
-> converter
-> production component
```

- [ ] **Step 3: Run typecheck and focused UXPin tests**

Run:

```bash
npm run test:only -- helpers/uxpinReliableReferenceRuntime.test.tsx helpers/uxpinNestedInteractionsRuntime.test.tsx helpers/uxpinRuntimeVisibility.test.tsx
npm run lint-ts
```

Expected result:

```text
PASS helpers/uxpinReliableReferenceRuntime.test.tsx
PASS helpers/uxpinNestedInteractionsRuntime.test.tsx
PASS helpers/uxpinRuntimeVisibility.test.tsx
```

`npm run lint-ts` exits with code `0`.

- [ ] **Step 4: Commit reference runtime tests**

Run:

```bash
git add helpers/uxpinReliableReferenceRuntime.test.tsx
git commit -m "test(uxpin): cover reliable reference runtimes"
```

## Task 4: Record Rollout Ownership In UXPin Backlog

**Files:**
- Modify: `uxpin/BACKLOG.md`

- [ ] **Step 1: Add reliability rollout backlog entry**

Add this section near the top of `uxpin/BACKLOG.md`, after the `# UXPin Backlog` heading:

```md
## Reliable UXPin integration rollout

Status: active

Context:
- UXPin integration is optimized for production correctness over raw component count.
- Local `npm run uxpin:dev` is required but not sufficient for Tier 2 and Tier 3 components.
- Reference components are `Tag` for atomic behavior, `Tabs` for editable child behavior, and `Table` for stateful product-flow behavior.
- Production canary checks live in `uxpin/reliability/canary-checklist.md`.
- Per-component contract cards live in `uxpin/reliability/component-integration-card.md`.

Current rollout gates:
1. Classify the component tier before implementation.
2. Map the production TypeScript API before adding UXPin-only props.
3. Add serialized runtime tests for Tier 2 and Tier 3 changes.
4. Run local validation before UXPin push.
5. Run UXPin cloud editor and prototype smoke before marking the component ready.

Open decisions:
1. Decide whether `Toolbar` should replace `Tabs` as the long-term Tier 2 reference after dropdown and toolbar action behavior stabilizes.
2. Decide whether `Sidebar` should join `Table` as a second Tier 3 reference after sidebar trigger behavior stabilizes.
3. Decide where production smoke evidence should be stored for release branches.
```

- [ ] **Step 2: Validate backlog entry**

Run:

```bash
rg -n "Reliable UXPin integration rollout|Status: active|Reference components" uxpin/BACKLOG.md
git diff --check -- uxpin/BACKLOG.md
```

Expected result:

```text
uxpin/BACKLOG.md:3:## Reliable UXPin integration rollout
uxpin/BACKLOG.md:5:Status: active
```

`git diff --check` exits with code `0`.

- [ ] **Step 3: Commit backlog entry**

Run:

```bash
git add uxpin/BACKLOG.md
git commit -m "docs(uxpin): track reliable integration rollout"
```

## Task 5: Final Package Validation

**Files:**
- Verify: all files changed by Tasks 1-4

- [ ] **Step 1: Run focused tests**

Run:

```bash
npm run test:only -- helpers/uxpinReliabilityTiers.test.ts helpers/uxpinReliableReferenceRuntime.test.tsx helpers/uxpinNestedInteractionsRuntime.test.tsx helpers/uxpinRuntimeVisibility.test.tsx
```

Expected result:

```text
PASS helpers/uxpinReliabilityTiers.test.ts
PASS helpers/uxpinReliableReferenceRuntime.test.tsx
PASS helpers/uxpinNestedInteractionsRuntime.test.tsx
PASS helpers/uxpinRuntimeVisibility.test.tsx
```

- [ ] **Step 2: Run package typecheck**

Run:

```bash
npm run lint-ts
```

Expected result:

```text
```

The command exits with code `0`.

- [ ] **Step 3: Run whitespace validation**

Run:

```bash
git diff --check -- uxpin/reliability/componentTiers.ts helpers/uxpinReliabilityTiers.test.ts helpers/uxpinReliableReferenceRuntime.test.tsx uxpin/reliability/canary-checklist.md uxpin/reliability/component-integration-card.md uxpin/BACKLOG.md README.md
```

Expected result:

```text
```

The command exits with code `0`.

- [ ] **Step 4: Review final diff**

Run:

```bash
git diff --stat HEAD
git diff -- uxpin/reliability/componentTiers.ts helpers/uxpinReliabilityTiers.test.ts helpers/uxpinReliableReferenceRuntime.test.tsx uxpin/reliability/canary-checklist.md uxpin/reliability/component-integration-card.md uxpin/BACKLOG.md README.md
```

Expected result:

```text
```

Review confirms the diff only contains the reliability workflow, tests, and docs from this plan.

- [ ] **Step 5: Final commit if validation changes were needed**

If Task 5 required edits, commit them:

```bash
git add uxpin/reliability/componentTiers.ts helpers/uxpinReliabilityTiers.test.ts helpers/uxpinReliableReferenceRuntime.test.tsx uxpin/reliability/canary-checklist.md uxpin/reliability/component-integration-card.md uxpin/BACKLOG.md README.md
git commit -m "chore(uxpin): validate reliable integration workflow"
```

If Task 5 required no edits, do not create an empty commit.

## Execution Notes

- Keep unrelated dirty worktree changes untouched.
- Do not manually edit `.uxpin-merge/*`.
- Do not run `npm run uxpin:push` until local tests and `npm run lint-ts` pass.
- If a reference runtime test exposes a production behavior mismatch, fix the runtime data flow before changing styles.
- If UXPin cloud behavior differs from local `uxpin:dev`, record the exact component, branch, editor/prototype mode, reproduction steps, and fallback decision in `uxpin/BACKLOG.md`.
