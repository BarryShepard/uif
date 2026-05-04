import '@testing-library/jest-dom'

import { render, screen } from '@testing-library/react'
import React from 'react'

import PageHeader from '../uxpin/components/PageHeader/PageHeader'

describe('UXPin PageHeader runtime', () => {
  it('exposes stable UXPin identity for Page slot detection', () => {
    const PageHeaderRuntime = PageHeader as React.FC & {
      displayName?: string,
      uxpinRole?: string
    }

    expect(PageHeaderRuntime.uxpinRole).toBe('hexa-uxpin-page-header')
    expect(PageHeaderRuntime.displayName).toBe('PageHeader')
  })

  it('does not mutate an ancestor Page merge frame when rendered inside Page', () => {
    const { container } = render(
      <div
        className="merge-component"
        data-testid="page-frame"
        style={{
          height: 640,
          minHeight: 640,
          minWidth: 875,
          width: 875
        }}
      >
        <div data-testid="page-header-zone">
          <PageHeader title="Nested page header" />
        </div>
      </div>
    )

    const pageFrame = container.querySelector('[data-testid="page-frame"]') as HTMLElement

    expect(screen.getByText('Nested page header')).toBeVisible()
    expect(pageFrame).toHaveStyle({
      height: '640px',
      minHeight: '640px',
      minWidth: '875px',
      width: '875px'
    })
  })
})
