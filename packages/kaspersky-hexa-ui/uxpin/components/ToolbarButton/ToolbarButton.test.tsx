import React from 'react'

import Dropdown from '../Dropdown/Dropdown'
import DropdownItem from '../DropdownItem/DropdownItem'

import ToolbarButton, { toolbarButtonElementToItem } from './ToolbarButton'

describe('ToolbarButton UXPin integration', () => {
  test('should build dropdown overlay from nested Dropdown child', () => {
    const item = toolbarButtonElementToItem(
      (
        <ToolbarButton text="Actions" variant="dropdown">
          <Dropdown>
            <DropdownItem text="Action 1" />
            <DropdownItem text="Action 2" />
          </Dropdown>
        </ToolbarButton>
      ),
      0
    )

    expect(item.type).toBe('dropdown')

    if (item.type !== 'dropdown') {
      throw new Error('ToolbarButton did not resolve to dropdown item')
    }

    expect(Array.isArray(item.overlay)).toBe(true)

    if (!Array.isArray(item.overlay)) {
      throw new Error('ToolbarButton overlay is not an items array')
    }

    expect(item.overlay).toHaveLength(2)
    expect(item.overlay[0]).toMatchObject({ children: 'Action 1' })
    expect(item.overlay[1]).toMatchObject({ children: 'Action 2' })
  })

  test('should use overridden plain UXPin dropdown layers for overlay updates', () => {
    const item = toolbarButtonElementToItem(
      (
        <ToolbarButton
          text="Actions"
          variant="dropdown"
          overriddenCodeProps={{
            children: [
              {
                name: 'Dropdown',
                overriddenCodeProps: {
                  children: [
                    {
                      name: 'DropdownItem',
                      overriddenCodeProps: {
                        text: 'Edited action'
                      }
                    }
                  ]
                }
              }
            ] as unknown as React.ReactNode
          }}
        >
          <Dropdown>
            <DropdownItem text="Action 1" />
            <DropdownItem text="Action 2" />
          </Dropdown>
        </ToolbarButton>
      ),
      0
    )

    expect(item.type).toBe('dropdown')

    if (item.type !== 'dropdown') {
      throw new Error('ToolbarButton did not resolve to dropdown item')
    }

    expect(Array.isArray(item.overlay)).toBe(true)

    if (!Array.isArray(item.overlay)) {
      throw new Error('ToolbarButton overlay is not an items array')
    }

    expect(item.overlay).toHaveLength(1)
    expect(item.overlay[0]).toMatchObject({ children: 'Edited action' })
  })

  test('should build dropdown overlay from nested dropdown items even when the dropdown wrapper is not recognized directly', () => {
    const item = toolbarButtonElementToItem(
      (
        <ToolbarButton
          text="Actions"
          variant="dropdown"
          overriddenCodeProps={{
            children: [
              {
                uxpinTargetElementType: 'CodeComponent',
                overriddenCodeProps: {
                  children: [
                    {
                      name: 'DropdownItem',
                      overriddenCodeProps: {
                        text: 'Nested action 1'
                      }
                    },
                    {
                      name: 'DropdownItem',
                      overriddenCodeProps: {
                        text: 'Nested action 2',
                        disabled: true
                      }
                    }
                  ]
                }
              }
            ] as unknown as React.ReactNode
          }}
        />
      ),
      0
    )

    expect(item.type).toBe('dropdown')

    if (item.type !== 'dropdown') {
      throw new Error('ToolbarButton did not resolve to dropdown item')
    }

    expect(item.overlay).toEqual([
      expect.objectContaining({ children: 'Nested action 1' }),
      expect.objectContaining({ children: 'Nested action 2', disabled: true })
    ])
  })
})
