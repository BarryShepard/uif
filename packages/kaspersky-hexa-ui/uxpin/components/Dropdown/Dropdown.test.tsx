import React from 'react'

import DropdownItem from '../DropdownItem/DropdownItem'

import Dropdown, { dropdownNodeToOverlay } from './Dropdown'

describe('Dropdown UXPin integration', () => {
  test('should keep DropdownItem props in overlay result', () => {
    const overlay = dropdownNodeToOverlay(
      <Dropdown>
        <DropdownItem
          text="Option 1"
          selected
          description
          descriptionText="Additional description"
          disabled
        />
      </Dropdown>
    )

    expect(overlay).toBeDefined()
    expect(overlay?.selectedKeys).toHaveLength(1)
    expect(overlay?.items[0]).toMatchObject({
      children: 'Option 1',
      description: 'Additional description',
      disabled: true
    })
  })

  test('should reflect add, remove, and edit operations from overridden DropdownItem layers', () => {
    const overlay = dropdownNodeToOverlay(
      <Dropdown
        overriddenCodeProps={{
          children: [
            {
              name: 'DropdownItem',
              overriddenCodeProps: {
                text: 'Edited 1',
                selected: true
              }
            },
            {
              name: 'DropdownItem',
              overriddenCodeProps: {
                text: 'Edited 2',
                disabled: true
              }
            },
            {
              name: 'DropdownItem',
              overriddenCodeProps: {
                text: 'Added 3'
              }
            },
            {
              name: 'DropdownItem',
              overriddenCodeProps: {
                text: 'Added 4'
              }
            }
          ] as unknown as React.ReactNode
        }}
      >
        <DropdownItem text="Option 1" />
        <DropdownItem text="Option 2" />
        <DropdownItem text="Option 3" />
      </Dropdown>
    )

    expect(overlay).toBeDefined()
    expect(overlay?.items).toHaveLength(4)
    expect(overlay?.items.map((item) => item.children)).toEqual([
      'Edited 1',
      'Edited 2',
      'Added 3',
      'Added 4'
    ])
    expect(overlay?.selectedKeys).toHaveLength(1)
    expect(overlay?.items[1]).toMatchObject({ disabled: true })
  })

  test('should preserve explicit empty dropdown children without restoring defaults', () => {
    const overlay = dropdownNodeToOverlay(
      <Dropdown overriddenCodeProps={{ children: '__UXPIN_UNDEFINED__' as unknown as React.ReactNode }}>
        <DropdownItem text="Option 1" />
        <DropdownItem text="Option 2" />
      </Dropdown>
    )

    expect(overlay).toBeDefined()
    expect(overlay?.items).toHaveLength(0)
    expect(overlay?.selectedKeys).toHaveLength(0)
  })
})
