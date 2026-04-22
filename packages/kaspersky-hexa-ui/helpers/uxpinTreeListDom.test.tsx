import { render, screen } from '@testing-library/react'
import React from 'react'

import TreeList from '../uxpin/components/TreeList/TreeList'

describe('UXPin TreeList DOM preview', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn()
      }))
    })

    window.ResizeObserver =
      window.ResizeObserver ||
      jest.fn().mockImplementation(() => ({
        disconnect: jest.fn(),
        observe: jest.fn(),
        unobserve: jest.fn()
      }))
  })

  it('renders default expanded tree rows and switcher', () => {
    const { container } = render(<TreeList />)

    expect(screen.queryByText('Workspace')).not.toBeNull()
    expect(screen.queryByText('Devices')).not.toBeNull()
    expect(screen.queryByText('Policies')).not.toBeNull()
    expect(screen.queryByText('Default policy')).not.toBeNull()
    expect(screen.queryByText('Shared')).not.toBeNull()
    expect(container.querySelector('.ant-tree-switcher')).not.toBeNull()
    expect(container.querySelector('.ant-tree-switcher-icon')).not.toBeNull()
  })
})
