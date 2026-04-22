import React from 'react'

import {
  getVisibleUXPinChildrenArray,
  isUXPinHiddenElement
} from '../uxpin/visibility'

describe('uxpin visibility helpers', () => {
  it('detects hidden state from merged props', () => {
    const hiddenNode = {
      codeComponentProps: { style: { visibility: 'visible' } },
      overriddenCodeProps: {
        style: { display: 'none' }
      },
      style: { visibility: 'visible' },
      uxpinTargetElementType: 'CodeComponent'
    } as const

    expect(isUXPinHiddenElement(hiddenNode)).toBe(true)
    expect(isUXPinHiddenElement(<div />)).toBe(false)
  })

  it('returns only visible flattened children', () => {
    const visibleChildren = getVisibleUXPinChildrenArray(
      <>
        <span key="visible-1">Visible 1</span>
        <>
          <span key="hidden" hidden>Hidden</span>
          {'Visible 2'}
        </>
      </>
    )

    expect(visibleChildren).toHaveLength(2)
    expect((visibleChildren[0] as React.ReactElement).props.children).toBe('Visible 1')
    expect(visibleChildren[1]).toBe('Visible 2')
  })
})
