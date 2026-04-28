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
