# UIF Hexa Contract

Use this reference when the task touches `packages/kaspersky-hexa-ui`.

## Repository Reality

- UIF is a Lerna/Yarn monorepo.
- `packages/kaspersky-hexa-ui` is the main UI-kit package.
- Storybook is already the main docs surface.
- Component docs are enriched through `.storybook/components/Meta/withMeta.tsx`.
- Global Storybook docs behavior is configured in `.storybook/preview.ts`.
- Component typing doctrine already exists in `docs/03-ComponentsTyping.mdx`.

## Preferred Source Of Truth

For public component APIs, prefer this order:

1. Public TypeScript props
2. Storybook presentation config
3. Metadata and completeness status

That means:

- Public `*Props` should live in `types.ts` or a clear equivalent.
- `index.ts` should re-export public props.
- Storybook `argTypes` and design controls should describe or present the API, not redefine it independently.
- `meta.json` should track docs completeness and design links, not replace the public API contract.

## Component Contract Checklist

For a public component, the minimum useful contract is:

- `index.ts`
- exported public `*Props`
- `types.ts` or equivalent typed source
- at least one story
- `meta.json`
- tests, or an explicit note that tests are missing

The next-level completeness checks are:

- `usage` filled in `meta.json`
- `designLink` filled when design exists
- `pixsoView` filled when design docs exist
- `apiTable` aligned with actual public API documentation state
- component present in `helpers/resolveDesignControls.ts` when Storybook design props are supported

## Audit Command

Run:

```bash
cd packages/kaspersky-hexa-ui
npm run audit:contracts
```

Use `npm run audit:contracts:strict` when you want missing docs completeness and design-control coverage to fail the check too.

## First-Wave Targets

These are good early candidates for cleanup because they expose public API friction without forcing broad runtime rewrites:

- `menu`
- `notification`
- `lock-group`
- `repeater`

## Storybook Files To Check

- `.storybook/preview.ts`
- `.storybook/components/Meta/withMeta.tsx`
- `helpers/resolveDesignControls.ts`
- `src/<component>/**/*.stories.tsx`
- `src/<component>/**/meta.json`
