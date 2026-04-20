import { render, screen } from '@testing-library/react'
import React from 'react'

import Sidebar from '../uxpin/components/Sidebar/Sidebar'
import SidebarFooter from '../uxpin/components/SidebarFooter/SidebarFooter'

const SidebarRuntime = Sidebar as React.ComponentType<Record<string, unknown>>
const SidebarFooterRuntime = SidebarFooter as React.ComponentType<Record<string, unknown>>

const footerDescriptor = (
  overriddenCodeProps: Record<string, unknown> = {}
): React.ReactNode => ({
  overriddenCodeProps,
  presetElementId: 'sidebar-footer',
  uxpinTargetElementType: 'CodeComponent'
} as unknown as React.ReactNode)

describe('UXPin SidebarFooter slot runtime', () => {
  it('renders leftItem and rightItem slots directly', () => {
    render(
      <SidebarFooterRuntime
        leftItem={<button type="button">Apply</button>}
        rightItem={<button type="button">Delete selected</button>}
      />
    )

    expect(screen.getByRole('button', { name: 'Apply' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Delete selected' })).toBeInTheDocument()
  })

  it('updates slot props from UXPin runtime props on rerender', () => {
    const { rerender } = render(
      <SidebarFooterRuntime
        codeComponentProps={{
          leftItem: <button type="button">Apply</button>
        }}
      />
    )

    expect(screen.getByRole('button', { name: 'Apply' })).toBeInTheDocument()

    rerender(
      <SidebarFooterRuntime
        codeComponentProps={{
          leftItem: <button type="button">Confirm</button>
        }}
      />
    )

    expect(screen.queryByRole('button', { name: 'Apply' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument()
  })

  it('does not restore internal defaults when slots are cleared', () => {
    render(
      <SidebarFooterRuntime
        additionalContent
        leftItem={null}
        rightItem={null}
      />
    )

    expect(screen.queryByRole('button', { name: 'Save' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Cancel' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Delete' })).not.toBeInTheDocument()
  })

  it('ignores legacy footer children and content props', () => {
    render(
      <SidebarFooterRuntime
        additionalContent
        leftContent={<button type="button">Legacy left</button>}
        rightContent={<button type="button">Legacy right</button>}
        codeComponentProps={{
          children: <button type="button">Nested child</button>
        }}
      />
    )

    expect(screen.queryByRole('button', { name: 'Legacy left' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Legacy right' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Nested child' })).not.toBeInTheDocument()
  })

  it('routes Sidebar footer descriptors through leftItem and rightItem only', () => {
    render(
      <SidebarRuntime
        codeComponentProps={{
          children: [
            footerDescriptor({
              leftItem: <button type="button">Left slot action</button>,
              rightItem: <button type="button">Right slot action</button>
            })
          ]
        }}
      />
    )

    expect(screen.getByRole('button', { name: 'Left slot action' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Right slot action' })).toBeInTheDocument()
  })

  it('does not restore default footer buttons for an explicit empty Sidebar footer', () => {
    render(
      <SidebarRuntime
        codeComponentProps={{
          children: [footerDescriptor()]
        }}
      />
    )

    expect(screen.queryByRole('button', { name: 'Save' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Cancel' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Delete' })).not.toBeInTheDocument()
  })

  it('keeps legacy Sidebar defaults when no footer layer is authored yet', () => {
    render(
      <SidebarRuntime
        codeComponentProps={{ children: undefined }}
      />
    )

    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument()
  })
})
