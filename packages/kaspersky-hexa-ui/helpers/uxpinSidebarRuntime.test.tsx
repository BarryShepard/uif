import { render, screen } from '@testing-library/react'
import React from 'react'

import Sidebar from '../uxpin/components/Sidebar/Sidebar'

const SidebarRuntime = Sidebar as React.ComponentType<Record<string, unknown>>

const sidebarSlotDescriptor = (
  presetElementId: string,
  children?: React.ReactNode,
  overriddenCodeProps: Record<string, unknown> = {}
): React.ReactNode => ({
  overriddenCodeProps: {
    ...overriddenCodeProps,
    ...(children === undefined ? {} : { children })
  },
  presetElementId,
  uxpinTargetElementType: 'CodeComponent'
} as unknown as React.ReactNode)

const submenuItemDescriptor = (
  presetElementId: string,
  overriddenCodeProps: Record<string, unknown> = {}
): React.ReactNode => ({
  overriddenCodeProps,
  presetElementId,
  uxpinTargetElementType: 'CodeComponent'
} as unknown as React.ReactNode)

const tabItemDescriptor = (
  id: string,
  overriddenCodeProps: Record<string, unknown> = {}
): React.ReactNode => ({
  overriddenCodeProps,
  uxpId: id,
  uxpinTargetElementType: 'CodeComponent'
} as unknown as React.ReactNode)

const genericWrapperDescriptor = (
  children?: React.ReactNode,
  overriddenCodeProps: Record<string, unknown> = {}
): React.ReactNode => ({
  overriddenCodeProps: {
    ...overriddenCodeProps,
    ...(children === undefined ? {} : { children })
  },
  uxpinTargetElementType: 'CodeComponent'
} as unknown as React.ReactNode)

const emptyCodeComponentDescriptor = (
  name: string
): React.ReactNode => ({
  name,
  uxpinTargetElementType: 'CodeComponent'
} as unknown as React.ReactNode)

describe('UXPin Sidebar runtime children', () => {
  it('renders submenu, tabs, and footer from plain UXPin child descriptors', () => {
    render(
      <SidebarRuntime
        codeComponentProps={{
          children: [
            sidebarSlotDescriptor('sidebar-submenu', [
              submenuItemDescriptor('sidebar-submenu-item-1', {
                iconBefore: true,
                iconBeforeSlot: 'Browser',
                selected: true,
                text: 'Overview'
              }),
              submenuItemDescriptor('sidebar-submenu-item-2', {
                iconBefore: true,
                iconBeforeSlot: 'StorageServer',
                text: 'Assets'
              })
            ]),
            sidebarSlotDescriptor('sidebar-tabs', [
              tabItemDescriptor('sidebar-tab-1', { selected: true, text: 'Tab 1' }),
              tabItemDescriptor('sidebar-tab-2', { text: 'Tab 2' })
            ]),
            sidebarSlotDescriptor('sidebar-footer', undefined, {
              leftItem: <button type="button">Footer left slot</button>,
              rightItem: <button type="button">Footer right slot</button>
            })
          ]
        }}
      />
    )

    expect(screen.getAllByText('Overview').length).toBeGreaterThan(0)
    expect(screen.getByText('Assets')).toBeInTheDocument()
    expect(screen.getAllByRole('tab').length).toBeGreaterThanOrEqual(2)
    expect(screen.getByRole('button', { name: 'Footer left slot' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Footer right slot' })).toBeInTheDocument()
  })

  it('does not route generic wrapper children as footer buttons', () => {
    render(
      <SidebarRuntime
        codeComponentProps={{
          children: [
            genericWrapperDescriptor([
              {
                id: 'direct-footer-button-1',
                name: 'Button',
                uxpinTargetElementType: 'CodeComponent'
              } as unknown as React.ReactNode
            ])
          ]
        }}
      />
    )

    expect(screen.queryByRole('button', { name: 'Button' })).not.toBeInTheDocument()
  })

  it('keeps visual defaults for empty Submenu and Tabs child component descriptors', () => {
    render(
      <SidebarRuntime
        codeComponentProps={{
          children: [
            emptyCodeComponentDescriptor('Submenu'),
            emptyCodeComponentDescriptor('Tabs')
          ]
        }}
      />
    )

    expect(screen.getAllByText('Overview').length).toBeGreaterThan(0)
    expect(screen.getByRole('tab', { name: 'Tab 1' })).toBeInTheDocument()
  })

  it('does not restore default sidebar slots when UXPin explicitly clears children', () => {
    render(
      <SidebarRuntime
        overriddenCodeProps={{ children: null }}
      />
    )

    expect(screen.queryByText('Overview')).not.toBeInTheDocument()
    expect(screen.queryByRole('tab', { name: 'Tab 1' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Save' })).not.toBeInTheDocument()
    expect(screen.getByText('Sidebar content area')).toBeInTheDocument()
  })

  it('keeps default sidebar slots while runtime children are still undefined', () => {
    render(
      <SidebarRuntime
        codeComponentProps={{ children: undefined }}
      />
    )

    expect(screen.getAllByText('Overview').length).toBeGreaterThan(0)
    expect(screen.getByRole('tab', { name: 'Tab 1' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument()
  })
})
