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
