import '@testing-library/jest-dom'

import { render, screen } from '@testing-library/react'
import React from 'react'

import Page from '../uxpin/components/Page/Page'

const PageRuntime = Page as React.ComponentType<Record<string, unknown>>

const getByDataTestId = (container: HTMLElement, testId: string): HTMLElement => {
  const element = container.querySelector(`[data-testid="${testId}"]`)

  if (!element) {
    throw new Error(`Unable to find [data-testid="${testId}"]`)
  }

  return element as HTMLElement
}

const pageSlotDescriptor = (
  name: string,
  presetElementId: string,
  overriddenCodeProps: Record<string, unknown> = {}
): React.ReactNode => ({
  name,
  overriddenCodeProps,
  presetElementId,
  uxpId: presetElementId,
  uxpinPresetElementId: presetElementId,
  uxpinTargetElementType: 'CodeComponent'
} as unknown as React.ReactNode)

const childDescriptor = (
  name: string,
  presetElementId: string,
  overriddenCodeProps: Record<string, unknown> = {}
): React.ReactNode => ({
  name,
  overriddenCodeProps,
  presetElementId,
  uxpId: presetElementId,
  uxpinPresetElementId: presetElementId,
  uxpinTargetElementType: 'CodeComponent'
} as unknown as React.ReactNode)

const pageChildren = (): React.ReactNode[] => [
  pageSlotDescriptor('Menu', 'page-menu', {
    children: [
      childDescriptor('MenuItem', 'page-menu-item-1', {
        elementBefore: false,
        label: 'Security dashboard',
        state: 'enabled'
      })
    ],
    footer: false,
    header: false
  }),
  pageSlotDescriptor('Submenu', 'page-submenu', {
    children: [
      childDescriptor('SubmenuItem', 'page-submenu-item-1', {
        selected: true,
        text: 'Assets',
        variant: 'item'
      })
    ]
  }),
  pageSlotDescriptor('PageHeader', 'page-header', {
    title: 'Custom page title'
  }),
  pageSlotDescriptor('PageWrapper', 'page-wrapper', {
    children: <div>Page body content</div>
  }),
  pageSlotDescriptor('SidebarFooter', 'page-footer', {
    additionalContent: false,
    leftItem: <button type="button">Footer action</button>
  })
]

describe('UXPin Page runtime', () => {
  it('routes known UXPin child descriptors into the full page layout', () => {
    const { container } = render(
      <PageRuntime
        codeComponentProps={{
          children: pageChildren()
        }}
      />
    )

    const pageRoot = container.querySelector('[data-hexa-uxpin-page="true"]') as HTMLDivElement
    const pageContent = getByDataTestId(container, 'hexa-uxpin-page-content')
    const pageWrapperZone = getByDataTestId(container, 'hexa-uxpin-page-wrapper-zone')

    expect(pageRoot).toBeInTheDocument()
    expect(pageRoot).toHaveStyle({
      display: 'flex',
      height: '100vh',
      overflow: 'hidden',
      width: '100vw'
    })
    expect(pageContent).toHaveStyle({
      display: 'flex',
      flex: '1 1 auto',
      flexDirection: 'column'
    })
    expect(pageWrapperZone).toHaveStyle({
      flex: '1 1 auto',
      minHeight: '0'
    })

    expect(screen.getByText('Security dashboard')).toBeInTheDocument()
    expect(screen.getByText('Assets')).toBeInTheDocument()
    expect(screen.getByText('Custom page title')).toBeInTheDocument()
    expect(screen.getByText('Page body content')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Footer action' })).toBeInTheDocument()
  })

  it('visually hides toggled zones while keeping their child trees mounted', () => {
    const { container } = render(
      <PageRuntime
        menu={false}
        submenu={false}
        pageHeader={false}
        pageFooter={false}
        codeComponentProps={{
          children: pageChildren()
        }}
      />
    )

    expect(getByDataTestId(container, 'hexa-uxpin-page-menu-zone')).not.toBeVisible()
    expect(getByDataTestId(container, 'hexa-uxpin-page-submenu-zone')).not.toBeVisible()
    expect(getByDataTestId(container, 'hexa-uxpin-page-header-zone')).not.toBeVisible()
    expect(getByDataTestId(container, 'hexa-uxpin-page-footer-zone')).not.toBeVisible()

    expect(screen.getByText('Security dashboard')).not.toBeVisible()
    expect(screen.getByText('Assets')).not.toBeVisible()
    expect(screen.getByText('Custom page title')).not.toBeVisible()
    expect(screen.getByRole('button', { hidden: true, name: 'Footer action' })).not.toBeVisible()

    expect(getByDataTestId(container, 'hexa-uxpin-page-wrapper-zone')).toBeVisible()
    expect(screen.getByText('Page body content')).toBeVisible()
  })

  it('does not recreate default zones when UXPin children are deleted', () => {
    render(
      <PageRuntime
        codeComponentProps={{
          children: [
            pageSlotDescriptor('PageWrapper', 'page-wrapper', {
              children: <div>Only body remains</div>
            })
          ]
        }}
      />
    )

    expect(screen.getByText('Only body remains')).toBeVisible()
    expect(screen.queryByText('Security dashboard')).not.toBeInTheDocument()
    expect(screen.queryByText('Assets')).not.toBeInTheDocument()
    expect(screen.queryByText('Custom page title')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Footer action' })).not.toBeInTheDocument()
    expect(screen.queryByText('Administration server')).not.toBeInTheDocument()
    expect(screen.queryByText('Page title')).not.toBeInTheDocument()
  })

  it('keeps preset page zones when UXPin overrides nested page content', () => {
    render(
      <PageRuntime
        codeComponentProps={{
          children: pageChildren()
        }}
        overriddenCodeProps={{
          children: [
            pageSlotDescriptor('PageWrapper', 'page-wrapper', {
              children: <div>Edited page body content</div>
            })
          ]
        }}
      />
    )

    expect(screen.getByText('Custom page title')).toBeVisible()
    expect(screen.getByText('Edited page body content')).toBeVisible()
    expect(screen.queryByText('Page body content')).not.toBeInTheDocument()
  })

  it('syncs the inserted UXPin component size from the frame viewport', () => {
    const createFrameRect = (width: number, height: number): DOMRect => ({
      bottom: height,
      height,
      left: 0,
      right: width,
      top: 0,
      width,
      x: 0,
      y: 0,
      toJSON: () => ({})
    } as DOMRect)
    let frameRect = createFrameRect(1195, 881)
    const rectSpy = jest.spyOn(HTMLElement.prototype, 'getBoundingClientRect')

    rectSpy.mockImplementation(function getBoundingClientRectMock (this: HTMLElement): DOMRect {
      if (this.getAttribute('data-hexa-uxpin-page') === 'true') {
        return frameRect
      }

      return createFrameRect(0, 0)
    })

    try {
      const { container } = render(
        <div
          className="merge-component"
          data-testid="page-shell"
          style={{
            height: 640,
            minHeight: 640,
            minWidth: 875,
            width: 875
          }}
        >
          <PageRuntime
            codeComponentProps={{
              children: [
                pageSlotDescriptor('PageWrapper', 'page-wrapper', {
                  children: <div>Frame-sized page body</div>
                })
              ]
            }}
          />
        </div>
      )

      const pageShell = container.querySelector('[data-testid="page-shell"]') as HTMLDivElement
      const pageRoot = container.querySelector('[data-hexa-uxpin-page="true"]') as HTMLDivElement

      expect(pageRoot.style.width).toBe('100vw')
      expect(pageRoot.style.height).toBe('100vh')
      expect(pageShell.style.height).toBe('881px')
      expect(pageShell.style.minHeight).toBe('881px')
      expect(pageShell.style.width).toBe('1195px')
      expect(pageShell.style.minWidth).toBe('1195px')

      frameRect = createFrameRect(1440, 900)
      window.dispatchEvent(new Event('resize'))

      expect(pageShell.style.height).toBe('900px')
      expect(pageShell.style.minHeight).toBe('900px')
      expect(pageShell.style.width).toBe('1440px')
      expect(pageShell.style.minWidth).toBe('1440px')
      expect(screen.getByText('Frame-sized page body')).toBeVisible()
    } finally {
      rectSpy.mockRestore()
    }
  })
})
