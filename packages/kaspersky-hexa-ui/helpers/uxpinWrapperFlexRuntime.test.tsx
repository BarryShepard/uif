import '@testing-library/jest-dom'
import 'jest-styled-components'

import { act, render } from '@testing-library/react'
import React from 'react'

import GroupWrapper from '../uxpin/components/GroupWrapper/GroupWrapper'
import Menu from '../uxpin/components/Menu/Menu'
import PageWrapper from '../uxpin/components/PageWrapper/PageWrapper'
import SectionWrapper from '../uxpin/components/SectionWrapper/SectionWrapper'
import Submenu from '../uxpin/components/Submenu/Submenu'

const PageWrapperRuntime = PageWrapper as React.ComponentType<Record<string, unknown>>
const SectionWrapperRuntime = SectionWrapper as React.ComponentType<Record<string, unknown>>
const GroupWrapperRuntime = GroupWrapper as React.ComponentType<Record<string, unknown>>
const MenuRuntime = Menu as React.ComponentType<Record<string, unknown>>
const SubmenuRuntime = Submenu as React.ComponentType<Record<string, unknown>>

const mockElementRect = (element: HTMLElement, width: number, height: number): (() => void) => {
  const originalGetBoundingClientRect = element.getBoundingClientRect

  Object.defineProperty(element, 'getBoundingClientRect', {
    configurable: true,
    writable: true,
    value: jest.fn(() => ({
      x: 0,
      y: 0,
      top: 0,
      left: 0,
      bottom: height,
      right: width,
      width,
      height,
      toJSON: () => ({})
    } as DOMRect))
  })

  return () => {
    Object.defineProperty(element, 'getBoundingClientRect', {
      configurable: true,
      writable: true,
      value: originalGetBoundingClientRect
    })
  }
}

describe('UXPin wrapper flex height runtime', () => {
  it('propagates fill-height selectors through intermediate merge-component shells', () => {
    const { container } = render(
      <PageWrapperRuntime>
        <div className="merge-component" data-testid="section-shell">
          <SectionWrapperRuntime flexHeight={true}>
            <div className="merge-component" data-testid="group-shell">
              <GroupWrapperRuntime flexHeight={true}>
                <div className="merge-component" data-testid="table-shell">
                  <div data-hexa-uxpin-table-height-mode="fill" />
                </div>
              </GroupWrapperRuntime>
            </div>
          </SectionWrapperRuntime>
        </div>
      </PageWrapperRuntime>
    )

    const pageRoot = container.querySelector('[data-hexa-uxpin-page-wrapper="true"]') as HTMLDivElement
    const sectionRoot = container.querySelector('[data-hexa-uxpin-section-wrapper="true"]') as HTMLDivElement
    const groupRoot = container.querySelector('[data-hexa-uxpin-group-wrapper="true"]') as HTMLDivElement

    // @ts-ignore
    expect(pageRoot).toHaveStyleRule('display', 'flex', { modifier: '> .merge-component' })
    // @ts-ignore
    expect(sectionRoot).toHaveStyleRule('display', 'flex', { modifier: '> .merge-component' })
    // @ts-ignore
    expect(groupRoot).toHaveStyleRule('display', 'flex', { modifier: '> .merge-component' })

    // @ts-ignore
    expect(pageRoot).toHaveStyleRule('flex', '1 1 auto !important', {
      modifier: "> .merge-component[data-hexa-uxpin-fill-shell='true']"
    })
    // @ts-ignore
    expect(sectionRoot).toHaveStyleRule('flex', '1 1 auto !important', {
      modifier: "> .merge-component[data-hexa-uxpin-fill-shell='true']"
    })
    // @ts-ignore
    expect(groupRoot).toHaveStyleRule('flex', '1 1 auto !important', {
      modifier: "> .merge-component[data-hexa-uxpin-fill-shell='true']"
    })

    // @ts-ignore
    expect(pageRoot).toHaveStyleRule('min-height', '0', {
      modifier: "> .merge-component[data-hexa-uxpin-fill-shell='true']"
    })
    // @ts-ignore
    expect(sectionRoot).toHaveStyleRule('min-height', '0', {
      modifier: "> .merge-component[data-hexa-uxpin-fill-shell='true']"
    })
    // @ts-ignore
    expect(groupRoot).toHaveStyleRule('min-height', '0', {
      modifier: "> .merge-component[data-hexa-uxpin-fill-shell='true']"
    })
  })

  it('does not force wrapper shell width when Menu is nested inside wrappers', () => {
    const { container } = render(
      <PageWrapperRuntime>
        <SectionWrapperRuntime flexHeight={true}>
          <GroupWrapperRuntime flexHeight={true} flexWidth={true}>
            <div className="merge-component" data-testid="menu-shell">
              <MenuRuntime />
            </div>
          </GroupWrapperRuntime>
        </SectionWrapperRuntime>
      </PageWrapperRuntime>
    )

    const menuShell = container.querySelector('[data-testid="menu-shell"]') as HTMLDivElement
    const menuRoot = menuShell.firstElementChild as HTMLDivElement
    const restoreMenuRootRect = mockElementRect(menuRoot, 280, 640)

    try {
      act(() => {
        window.dispatchEvent(new Event('resize'))
      })

      expect(menuShell.style.width).toBe('')
      expect(menuShell.style.minWidth).toBe('')
      expect(menuShell.style.maxWidth).toBe('')
      expect(menuShell.style.flex).toBe('')
    } finally {
      restoreMenuRootRect()
    }
  })

  it('syncs top-level PageWrapper height to its merge shell', () => {
    const { container } = render(
      <div className="merge-component" data-testid="page-shell">
        <PageWrapperRuntime />
      </div>
    )

    const pageShell = container.querySelector('[data-testid="page-shell"]') as HTMLDivElement
    const pageRoot = container.querySelector('[data-hexa-uxpin-page-wrapper="true"]') as HTMLDivElement
    const restorePageRootRect = mockElementRect(pageRoot, 1200, 560)

    try {
      act(() => {
        window.dispatchEvent(new Event('resize'))
      })

      expect(pageShell.style.height).toBe('560px')
      expect(pageShell.style.minHeight).toBe('560px')
    } finally {
      restorePageRootRect()
    }
  })

  it('applies fixed width when PageWrapper flexWidth is disabled', () => {
    const { container } = render(
      <PageWrapperRuntime flexWidth={false} width={960} />
    )

    const pageRoot = container.querySelector('[data-hexa-uxpin-page-wrapper="true"]') as HTMLDivElement

    expect(pageRoot.style.width).toBe('960px')
    expect(pageRoot.style.flex).toBe('0 1 960px')
    expect(pageRoot.style.maxWidth).toBe('100%')
    expect(pageRoot.style.alignSelf).toBe('flex-start')
  })

  it('keeps PageWrapper stretched when flexWidth is enabled', () => {
    const { container } = render(
      <PageWrapperRuntime flexWidth={true} width={960} />
    )

    const pageRoot = container.querySelector('[data-hexa-uxpin-page-wrapper="true"]') as HTMLDivElement

    expect(pageRoot.style.width).toBe('100%')
    expect(pageRoot.style.flex).toBe('1 1 auto')
    expect(pageRoot.style.alignSelf).toBe('stretch')
  })

  it('syncs top-level Menu width to its merge shell', () => {
    const { container } = render(
      <div className="merge-component" data-testid="menu-shell">
        <MenuRuntime />
      </div>
    )

    const menuShell = container.querySelector('[data-testid="menu-shell"]') as HTMLDivElement
    const menuRoot = menuShell.firstElementChild as HTMLDivElement
    const restoreMenuRootRect = mockElementRect(menuRoot, 280, 640)

    try {
      act(() => {
        window.dispatchEvent(new Event('resize'))
      })

      expect(menuShell.style.width).toBe('280px')
      expect(menuShell.style.minWidth).toBe('280px')
      expect(menuShell.style.maxWidth).toBe('280px')
      expect(menuShell.style.flex).toBe('0 0 280px')
    } finally {
      restoreMenuRootRect()
    }
  })

  it('does not sync shared merge shell width from nested Menu content', () => {
    const { container } = render(
      <div className="merge-component" data-testid="shared-shell">
        <div data-testid="shared-flex" style={{ display: 'flex', gap: 16 }}>
          <div data-testid="menu-host">
            <MenuRuntime />
          </div>
          <div data-testid="sibling-flex" style={{ display: 'flex', flex: '1 1 auto' }}>
            <div>Sibling content</div>
          </div>
        </div>
      </div>
    )

    const sharedShell = container.querySelector('[data-testid="shared-shell"]') as HTMLDivElement
    const menuHost = container.querySelector('[data-testid="menu-host"]') as HTMLDivElement
    const menuRoot = menuHost.firstElementChild as HTMLDivElement
    const restoreMenuRootRect = mockElementRect(menuRoot, 280, 640)

    try {
      act(() => {
        window.dispatchEvent(new Event('resize'))
      })

      expect(sharedShell.style.width).toBe('')
      expect(sharedShell.style.minWidth).toBe('')
      expect(sharedShell.style.maxWidth).toBe('')
      expect(sharedShell.style.flex).toBe('')
    } finally {
      restoreMenuRootRect()
    }
  })

  it('does not sync shared merge shell width from nested Submenu content', () => {
    const { container } = render(
      <div className="merge-component" data-testid="shared-shell">
        <div data-testid="shared-flex" style={{ display: 'flex', gap: 16 }}>
          <div data-testid="submenu-host">
            <SubmenuRuntime />
          </div>
          <div data-testid="sibling-flex" style={{ display: 'flex', flex: '1 1 auto' }}>
            <div>Sibling content</div>
          </div>
        </div>
      </div>
    )

    const sharedShell = container.querySelector('[data-testid="shared-shell"]') as HTMLDivElement
    const submenuHost = container.querySelector('[data-testid="submenu-host"]') as HTMLDivElement
    const submenuRoot = submenuHost.firstElementChild as HTMLDivElement
    const restoreSubmenuRootRect = mockElementRect(submenuRoot, 264, 640)

    try {
      act(() => {
        window.dispatchEvent(new Event('resize'))
      })

      expect(sharedShell.style.width).toBe('')
      expect(sharedShell.style.minWidth).toBe('')
      expect(sharedShell.style.maxWidth).toBe('')
      expect(sharedShell.style.flex).toBe('')
    } finally {
      restoreSubmenuRootRect()
    }
  })

  it('keeps UXPin Submenu width aligned with production submenu rail width', () => {
    const { container } = render(
      <div data-testid="submenu-host">
        <SubmenuRuntime />
      </div>
    )

    const submenuHost = container.querySelector('[data-testid="submenu-host"]') as HTMLDivElement
    const submenuRoot = submenuHost.firstElementChild as HTMLDivElement

    expect(submenuRoot.style.minWidth).toBe('264px')
  })

  it('keeps legacy compact submenu frame width inside Sidebar runtime', () => {
    const { container } = render(
      <div data-testid="submenu-host">
        <SubmenuRuntime {...({ withinSidebar: true } as Record<string, unknown>)} />
      </div>
    )

    const submenuHost = container.querySelector('[data-testid="submenu-host"]') as HTMLDivElement
    const submenuRoot = submenuHost.firstElementChild as HTMLDivElement

    expect(submenuRoot.style.minWidth).toBe('232px')
  })
})
