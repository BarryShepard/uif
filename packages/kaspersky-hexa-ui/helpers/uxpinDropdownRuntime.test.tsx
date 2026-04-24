import '@testing-library/jest-dom'

import React from 'react'

jest.mock('@src/button', () => ({
  Button: ({ children, text }: { children?: React.ReactNode, text?: string }) => (
    <button>{children ?? text}</button>
  )
}))

jest.mock('@src/dropdown', () => {
  const React = require('react')

  const Dropdown = ({ children }: { children?: React.ReactNode }) => <>{children}</>

  Dropdown.Menu = ({ children }: { children?: React.ReactNode }) => <>{children}</>
  Dropdown.SubMenu = ({ children, title }: { children?: React.ReactNode, title?: React.ReactNode }) => (
    <div data-submenu-title={title ? 'true' : 'false'}>{children}</div>
  )
  Dropdown.MenuItem = ({ children }: { children?: React.ReactNode }) => <div>{children}</div>
  Dropdown.MenuDivider = () => <hr />
  Dropdown.InnerActions = ({ children }: { children?: React.ReactNode }) => <div>{children}</div>

  return {
    Dropdown
  }
})

jest.mock('@src/tooltip', () => ({
  Tooltip: ({ children }: { children?: React.ReactNode }) => (
    <>{children}</>
  )
}))

jest.mock('../uxpin/components/Textbox/Textbox', () => ({
  __esModule: true,
  default: () => <input />
}))

jest.mock('../uxpin/components/Link/Link', () => ({
  __esModule: true,
  default: ({ text }: { text?: string }) => <a>{text}</a>
}))

import {
  dropdownNodeToOverlay
} from '../uxpin/components/Dropdown/Dropdown'

describe('UXPin dropdown runtime', () => {
  it('keeps identifiable preset dropdown items when a newly added serialized child has no identity yet', () => {
    const overlay = dropdownNodeToOverlay({
      name: 'Dropdown',
      children: [
        {
          uxpId: 'dropdown-item-1',
          name: 'DropdownItem',
          overriddenCodeProps: { text: 'Action 1' }
        },
        {
          uxpId: 'dropdown-item-2',
          name: 'DropdownItem',
          overriddenCodeProps: { text: 'Action 2' }
        },
        {
          uxpId: 'dropdown-item-3',
          name: 'DropdownItem',
          overriddenCodeProps: { text: 'Action 3' }
        }
      ] as unknown as React.ReactNode,
      overriddenCodeProps: {
        children: [
          {
            name: 'DropdownItem',
            overriddenCodeProps: {
              text: 'Added action'
            }
          }
        ] as unknown as React.ReactNode
      }
    } as unknown as React.ReactNode)

    expect(overlay).toBeDefined()
    expect(overlay?.items).toEqual([
      expect.objectContaining({ children: 'Action 1' }),
      expect.objectContaining({ children: 'Action 2' }),
      expect.objectContaining({ children: 'Action 3' }),
      expect.objectContaining({ children: 'Added action' })
    ])
  })

  it('does not fabricate default overlay items for plain serialized dropdown wrappers without explicit children', () => {
    const overlay = dropdownNodeToOverlay({
      uxpinTargetElementType: 'CodeComponent',
      presetElementId: 'toolbar-left-button-2-dropdown',
      overriddenCodeProps: {
        variant: 'single choice'
      }
    } as unknown as React.ReactNode)

    expect(overlay).toBeUndefined()
  })

  it('keeps explicit serialized dropdown children when they are present on a plain wrapper node', () => {
    const overlay = dropdownNodeToOverlay({
      uxpinTargetElementType: 'CodeComponent',
      presetElementId: 'toolbar-left-button-2-dropdown',
      overriddenCodeProps: {
        variant: 'single choice',
        children: [
          {
            uxpinTargetElementType: 'CodeComponent',
            name: 'DropdownItem',
            id: 'dropdown-item-1',
            overriddenCodeProps: {
              text: 'First action'
            }
          },
          {
            uxpinTargetElementType: 'CodeComponent',
            name: 'DropdownItem',
            id: 'dropdown-item-2',
            overriddenCodeProps: {
              text: 'Second action',
              disabled: true
            }
          }
        ] as unknown as React.ReactNode
      }
    } as unknown as React.ReactNode)

    expect(overlay).toBeDefined()
    expect(overlay?.items).toEqual([
      expect.objectContaining({
        children: 'First action'
      }),
      expect.objectContaining({
        children: 'Second action',
        disabled: true
      })
    ])
  })
})
