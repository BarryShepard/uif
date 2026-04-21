import { render, screen } from '@testing-library/react'
import React from 'react'

import Sidebar from '../uxpin/components/Sidebar/Sidebar'
import Button from '../uxpin/components/Button/Button'
import SidebarFooter from '../uxpin/components/SidebarFooter/SidebarFooter'
import SidebarFooterLeftItems from '../uxpin/components/SidebarFooterLeftItems/SidebarFooterLeftItems'
import SidebarFooterRightItems from '../uxpin/components/SidebarFooterRightItems/SidebarFooterRightItems'

const SidebarRuntime = Sidebar as React.ComponentType<Record<string, unknown>>
const SidebarFooterRuntime = SidebarFooter as React.ComponentType<Record<string, unknown>>

const footerDescriptor = (
  overriddenCodeProps: Record<string, unknown> = {}
): React.ReactNode => ({
  overriddenCodeProps,
  presetElementId: 'sidebar-footer',
  uxpinTargetElementType: 'CodeComponent'
} as unknown as React.ReactNode)

const footerItemsDescriptor = (
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

const footerButtonDescriptor = (
  uxpId: string,
  overriddenCodeProps: Record<string, unknown> = {}
): React.ReactNode => ({
  name: 'Button',
  overriddenCodeProps,
  uxpId,
  uxpinTargetElementType: 'CodeComponent'
} as unknown as React.ReactNode)

const footerButtonCodeComponentDescriptor = (
  id: string,
  codeComponentProps: Record<string, unknown> = {}
): React.ReactNode => ({
  codeComponentProps,
  id,
  uxpinTargetElementType: 'CodeComponent'
} as unknown as React.ReactNode)

const footerSlotContainerDescriptor = (
  children?: React.ReactNode
): React.ReactNode => ({
  codeComponentProps: children === undefined ? {} : { children },
  uxpinTargetElementType: 'CodeComponent'
} as unknown as React.ReactNode)

describe('UXPin SidebarFooter nested item runtime', () => {
  it('renders default nested footer items when no children are provided', () => {
    const { container } = render(<SidebarFooterRuntime />)

    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Delete' })).not.toBeInTheDocument()
    expect(container.querySelector('.sidebar-footer-right')).not.toBeInTheDocument()
  })

  it('does not restore default footer items when UXPin sends explicit empty footer children', () => {
    render(
      <SidebarFooterRuntime
        codeComponentProps={{
          children: []
        }}
      />
    )

    expect(screen.queryByRole('button', { name: 'Save' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Cancel' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Delete' })).not.toBeInTheDocument()
  })

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
    expect(screen.queryByRole('button', { name: 'Delete' })).not.toBeInTheDocument()

    rerender(
      <SidebarFooterRuntime
        codeComponentProps={{
          leftItem: <button type="button">Confirm</button>
        }}
      />
    )

    expect(screen.queryByRole('button', { name: 'Apply' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Delete' })).not.toBeInTheDocument()
  })

  it('converts UXPin leftItem slot descriptors and reflects child edits', () => {
    const { rerender } = render(
      <SidebarFooterRuntime
        codeComponentProps={{
          children: [],
          leftItem: footerSlotContainerDescriptor([
            footerButtonCodeComponentDescriptor('sidebar-footer-apply', {
              mode: 'primary',
              size: 'medium',
              text: 'Apply'
            })
          ])
        }}
      />
    )

    expect(screen.getByRole('button', { name: 'Apply' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Save' })).not.toBeInTheDocument()

    rerender(
      <SidebarFooterRuntime
        codeComponentProps={{
          children: [],
          leftItem: footerSlotContainerDescriptor([])
        }}
      />
    )

    expect(screen.queryByRole('button', { name: 'Apply' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Save' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Cancel' })).not.toBeInTheDocument()
  })

  it('does not restore internal defaults when slot descriptor children are cleared', () => {
    render(
      <SidebarFooterRuntime
        additionalContent
        leftItem={footerSlotContainerDescriptor([])}
        rightItem={footerSlotContainerDescriptor([])}
      />
    )

    expect(screen.queryByRole('button', { name: 'Save' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Cancel' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Delete' })).not.toBeInTheDocument()
  })

  it('renders direct UXPin child descriptors in the left footer zone and reflects removal', () => {
    const { rerender } = render(
      <SidebarFooterRuntime
        codeComponentProps={{
          children: [
            footerButtonDescriptor('sidebar-footer-apply', {
              mode: 'primary',
              size: 'medium',
              text: 'Apply'
            })
          ]
        }}
      />
    )

    expect(screen.getByRole('button', { name: 'Apply' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Save' })).not.toBeInTheDocument()

    rerender(
      <SidebarFooterRuntime
        codeComponentProps={{
          children: []
        }}
      />
    )

    expect(screen.queryByRole('button', { name: 'Apply' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Save' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Cancel' })).not.toBeInTheDocument()
  })

  it('renders nested left and right item children directly', () => {
    render(
      <SidebarFooterRuntime additionalContent>
        <SidebarFooterLeftItems>
          <Button mode="primary" size="medium" text="Apply" />
        </SidebarFooterLeftItems>
        <SidebarFooterRightItems>
          <Button mode="dangerOutlined" size="medium" text="Delete selected" />
        </SidebarFooterRightItems>
      </SidebarFooterRuntime>
    )

    expect(screen.getByRole('button', { name: 'Apply' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Delete selected' })).toBeInTheDocument()
  })

  it('keeps an empty nested right item container hidden by default', () => {
    const { container } = render(
      <SidebarFooterRuntime>
        <SidebarFooterLeftItems>
          <Button mode="primary" size="medium" text="Apply" />
        </SidebarFooterLeftItems>
        <SidebarFooterRightItems>
          {[]}
        </SidebarFooterRightItems>
      </SidebarFooterRuntime>
    )

    expect(screen.getByRole('button', { name: 'Apply' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Delete' })).not.toBeInTheDocument()
    expect(container.querySelector('.sidebar-footer-right')).not.toBeInTheDocument()
  })

  it('updates nested UXPin child descriptors on rerender', () => {
    const { rerender } = render(
      <SidebarFooterRuntime
        codeComponentProps={{
          children: [
            footerItemsDescriptor('sidebar-footer-left-items', [
              footerButtonDescriptor('sidebar-footer-apply', {
                mode: 'primary',
                size: 'medium',
                text: 'Apply'
              })
            ])
          ]
        }}
      />
    )

    expect(screen.getByRole('button', { name: 'Apply' })).toBeInTheDocument()

    rerender(
      <SidebarFooterRuntime
        codeComponentProps={{
          children: [
            footerItemsDescriptor('sidebar-footer-left-items', [
              footerButtonDescriptor('sidebar-footer-confirm', {
                mode: 'primary',
                size: 'medium',
                text: 'Confirm'
              })
            ])
          ]
        }}
      />
    )

    expect(screen.queryByRole('button', { name: 'Apply' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument()

    rerender(
      <SidebarFooterRuntime
        codeComponentProps={{
          children: [
            footerItemsDescriptor('sidebar-footer-left-items', [])
          ]
        }}
      />
    )

    expect(screen.queryByRole('button', { name: 'Confirm' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Save' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Cancel' })).not.toBeInTheDocument()
  })

  it('routes Sidebar footer descriptors through nested left and right items', () => {
    render(
      <SidebarRuntime
        codeComponentProps={{
          children: [
            footerDescriptor({
              additionalContent: true,
              children: [
                footerItemsDescriptor('sidebar-footer-left-items', [
                  footerButtonDescriptor('sidebar-footer-apply', {
                    mode: 'primary',
                    size: 'medium',
                    text: 'Left nested action'
                  })
                ]),
                footerItemsDescriptor('sidebar-footer-right-items', [
                  footerButtonDescriptor('sidebar-footer-remove', {
                    mode: 'dangerOutlined',
                    size: 'medium',
                    text: 'Right nested action'
                  })
                ])
              ]
            })
          ]
        }}
      />
    )

    expect(screen.getByRole('button', { name: 'Left nested action' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Right nested action' })).toBeInTheDocument()
  })

  it('routes direct Sidebar footer children when UXPin clears legacy slot props', () => {
    render(
      <SidebarRuntime
        codeComponentProps={{
          children: [
            footerDescriptor({
              additionalContent: true,
              leftItem: '__UXPIN_UNDEFINED__',
              rightItem: '__UXPIN_UNDEFINED__',
              children: footerButtonDescriptor('sidebar-footer-direct', {
                mode: 'primary',
                size: 'medium',
                text: 'Direct footer action'
              })
            })
          ]
        }}
      />
    )

    expect(screen.getByRole('button', { name: 'Direct footer action' })).toBeInTheDocument()
    expect(screen.queryByText('__UXPIN_UNDEFINED__')).not.toBeInTheDocument()
  })

  it('does not restore default footer buttons for an explicit empty Sidebar footer', () => {
    render(
      <SidebarRuntime
        codeComponentProps={{
          children: [footerDescriptor({ children: null })]
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
