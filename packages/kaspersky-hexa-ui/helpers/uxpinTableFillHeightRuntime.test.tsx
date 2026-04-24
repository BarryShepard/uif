import '@testing-library/jest-dom'

import { act, render, waitFor } from '@testing-library/react'
import React from 'react'

jest.mock('@src/action-button', () => ({
  ActionButton: ({ children }: { children?: React.ReactNode }) => <button>{children}</button>
}))

jest.mock('@src/input', () => ({
  Textbox: () => <input />
}))

jest.mock('@src/link', () => ({
  Link: ({ children, text }: { children?: React.ReactNode, text?: string }) => <a>{children ?? text}</a>
}))

jest.mock('@src/placeholder', () => ({
  Placeholder: ({ children }: { children?: React.ReactNode }) => (
    <div className="table-prototype-placeholder">{children}</div>
  )
}))

jest.mock('@src/select', () => ({
  Select: () => (
    <select>
      <option>Option</option>
    </select>
  )
}))

jest.mock('@src/status', () => ({
  Status: ({ label }: { label?: string }) => <span>{label}</span>
}))

jest.mock('@src/tag', () => ({
  TagReductionGroup: ({ items }: { items?: unknown[] }) => <div>{items?.length ?? 0}</div>
}))

jest.mock('@src/toggle', () => ({
  Toggle: ({ checked, text }: { checked?: boolean, text?: string }) => (
    <button aria-pressed={checked}>{text}</button>
  )
}))

jest.mock('@src/table', () => {
  const React = require('react')

  return {
    Table: ({
      dataSource = [],
      fullHeight,
      pagination,
      scroll
    }: {
      dataSource?: unknown[],
      fullHeight?: boolean,
      pagination?: unknown,
      scroll?: { y?: number }
    }) => (
      <>
        <div className={`table-scrolling-wrapper${fullHeight ? ' table-height-full' : ''}`}>
          <div className="ant-table-header">
            <div className="ant-table-thead" />
          </div>
          <div className="ant-table-body" style={scroll?.y ? { maxHeight: `${scroll.y}px` } : undefined}>
            {dataSource.length
              ? <div className="ant-table-tbody" />
              : <div className="ant-table-placeholder" />}
          </div>
        </div>
        <div className="table-horizontal-scrollbar" />
        {pagination ? <div className="ant-pagination-container" /> : null}
      </>
    )
  }
})

jest.mock('@src/tooltip', () => ({
  Tooltip: ({ children }: { children?: React.ReactNode }) => (
    <>{children}</>
  )
}))

import { TablePrototype } from '../src/table/preview/TablePrototype'

type ResizeObserverCallbackList = Array<ResizeObserverCallback>

const resizeObserverCallbacks: ResizeObserverCallbackList = []

class ResizeObserverMock {
  private readonly callback: ResizeObserverCallback

  constructor (callback: ResizeObserverCallback) {
    this.callback = callback
    resizeObserverCallbacks.push(callback)
  }

  observe (): void {}

  unobserve (): void {}

  disconnect (): void {
    const index = resizeObserverCallbacks.indexOf(this.callback)

    if (index >= 0) {
      resizeObserverCallbacks.splice(index, 1)
    }
  }
}

const triggerResizeObservers = (): void => {
  resizeObserverCallbacks.forEach((callback) => callback([], {} as ResizeObserver))
}

const setRect = (
  element: Element,
  {
    height,
    width = 800
  }: {
    height: number,
    width?: number
  }
): void => {
  Object.defineProperty(element, 'getBoundingClientRect', {
    configurable: true,
    value: () => ({
      width,
      height,
      top: 0,
      left: 0,
      right: width,
      bottom: height,
      x: 0,
      y: 0,
      toJSON: () => ({})
    })
  })
}

describe('UXPin table fill-height runtime', () => {
  const originalResizeObserver = global.ResizeObserver
  const originalRequestAnimationFrame = global.requestAnimationFrame
  const originalCancelAnimationFrame = global.cancelAnimationFrame

  beforeAll(() => {
    global.ResizeObserver = ResizeObserverMock as unknown as typeof ResizeObserver
    global.requestAnimationFrame = ((callback: FrameRequestCallback) => {
      callback(0)
      return 1
    }) as typeof requestAnimationFrame
    global.cancelAnimationFrame = (() => {}) as typeof cancelAnimationFrame
  })

  afterEach(() => {
    resizeObserverCallbacks.splice(0, resizeObserverCallbacks.length)
  })

  afterAll(() => {
    global.ResizeObserver = originalResizeObserver
    global.requestAnimationFrame = originalRequestAnimationFrame
    global.cancelAnimationFrame = originalCancelAnimationFrame
  })

  it('uses the constrained preview root height instead of an expanded scrolling wrapper height', async () => {
    const { container } = render(
      <div style={{ height: 400, width: 800 }}>
        <TablePrototype
          fillFrameHeight={true}
          rowsCount={100}
          rowsPerPage={20}
          showPagination={true}
        />
      </div>
    )

    const root = container.querySelector('[data-table-prototype-selection-mode]') as HTMLElement
    const scrollingWrapper = container.querySelector('.table-scrolling-wrapper') as HTMLElement
    const header = (
      container.querySelector('.ant-table-header') ||
      container.querySelector('.ant-table-thead')
    ) as HTMLElement
    const bodyContent = (
      container.querySelector('.ant-table-tbody') ||
      container.querySelector('.ant-table-placeholder')
    ) as HTMLElement
    const pagination = container.querySelector('.ant-pagination-container') as HTMLElement
    const horizontalScrollbar = container.querySelector('.table-horizontal-scrollbar') as HTMLElement

    expect(root).not.toBeNull()
    expect(scrollingWrapper).not.toBeNull()
    expect(header).not.toBeNull()
    expect(bodyContent).not.toBeNull()
    expect(pagination).not.toBeNull()
    expect(horizontalScrollbar).not.toBeNull()

    setRect(root, { height: 400 })
    setRect(scrollingWrapper, { height: 1040 })
    setRect(header, { height: 40 })
    setRect(bodyContent, { height: 1000 })
    setRect(pagination, { height: 48 })
    setRect(horizontalScrollbar, { height: 8 })

    await act(async () => {
      triggerResizeObservers()
    })

    await waitFor(() => {
      const tableBody = container.querySelector('.ant-table-body') as HTMLElement

      expect(tableBody).toHaveStyle('max-height: 304px')
    })
  })
})
