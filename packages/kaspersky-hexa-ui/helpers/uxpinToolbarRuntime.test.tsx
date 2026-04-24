import React from 'react'

import { toolbarChildrenToItems } from '../uxpin/components/ToolbarButton/ToolbarButton'

describe('UXPin toolbar runtime', () => {
  it('converts serialized plain toolbar buttons with nested dropdown items', () => {
    const [item] = toolbarChildrenToItems(
      [
        {
          presetElementId: 'toolbar-left-button-1',
          overriddenCodeProps: {
            variant: 'dropdown',
            text: 'Traffic scanning',
            iconAfter: true,
            children: [
              {
                presetElementId: 'toolbar-left-button-2-dropdown',
                overriddenCodeProps: {
                  variant: 'single choice',
                  children: [
                    {
                      name: 'DropdownItem',
                      overriddenCodeProps: {
                        text: 'Action 1'
                      }
                    },
                    {
                      name: 'DropdownItem',
                      overriddenCodeProps: {
                        text: 'Action 2',
                        disabled: true
                      }
                    }
                  ]
                }
              }
            ]
          }
        }
      ] as unknown as React.ReactNode,
      'toolbar-left'
    )

    expect(item.type).toBe('dropdown')

    if (item.type !== 'dropdown') {
      throw new Error('Serialized ToolbarButton did not resolve to dropdown item')
    }

    expect(Array.isArray(item.overlay)).toBe(true)

    if (!Array.isArray(item.overlay)) {
      throw new Error('Serialized ToolbarButton overlay is not an items array')
    }

    expect(item.overlay).toHaveLength(2)
    expect(item.overlay[0]).toMatchObject({ children: 'Action 1' })
    expect(item.overlay[1]).toMatchObject({ children: 'Action 2', disabled: true })
  })

  it('keeps dropdown preset behavior when UXPin only overrides nested dropdown children', () => {
    const [item] = toolbarChildrenToItems(
      [
        {
          presetElementId: 'toolbar-left-button-2',
          overriddenCodeProps: {
            children: [
              {
                presetElementId: 'toolbar-left-button-2-dropdown',
                overriddenCodeProps: {
                  variant: 'single choice',
                  children: [
                    {
                      name: 'DropdownItem',
                      overriddenCodeProps: {
                        text: 'Threats only'
                      }
                    }
                  ]
                }
              }
            ]
          }
        }
      ] as unknown as React.ReactNode,
      'toolbar-left'
    )

    expect(item.type).toBe('dropdown')

    if (item.type !== 'dropdown') {
      throw new Error('Serialized preset ToolbarButton did not stay a dropdown item')
    }

    expect(item.label).toBe('Button 2')
    expect(item.overlay).toEqual([
      expect.objectContaining({ children: 'Threats only' })
    ])
  })
})
