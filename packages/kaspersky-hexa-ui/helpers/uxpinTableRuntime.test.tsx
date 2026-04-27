import { ConfigProvider } from '@design-system/context'
import { ThemeKey } from '@design-system/types'
import { render, screen, waitFor } from '@testing-library/react'
import React from 'react'

import Table from '../uxpin/components/Table/Table'

describe('UXPin table runtime', () => {
  it('resolves serialized table props from overriddenCodeProps and keeps pagination footer content', async () => {
    const { container } = render(
      <ConfigProvider theme={ThemeKey.Light} locale="en-us">
        <div style={{ height: 640, width: 1200 }}>
          <Table
            overriddenCodeProps={{
              heightMode: 'fill',
              rowsCount: 100,
              rowsPerPage: '50 on page',
              showPagination: true,
              showPaginationSummary: true,
              showRowsPerPageSelector: true
            }}
          />
        </div>
      </ConfigProvider>
    )

    await waitFor(() => {
      expect(screen.getByText(/50 \/ page/i)).toBeInTheDocument()
    })

    await waitFor(() => {
      expect(screen.getByText(/total 100/i)).toBeInTheDocument()
    })

    await waitFor(() => {
      expect(container.querySelectorAll('.ant-pagination-item').length).toBeGreaterThanOrEqual(2)
    })
  })

  it('contains the fill-height table merge shell width', async () => {
    const { container } = render(
      <ConfigProvider theme={ThemeKey.Light} locale="en-us">
        <div style={{ width: 640 }}>
          <div className="merge-component" data-testid="table-shell">
            <Table
              overriddenCodeProps={{
                heightMode: 'fill',
                rowsCount: 100
              }}
            />
          </div>
        </div>
      </ConfigProvider>
    )

    const tableShell = container.querySelector('[data-testid="table-shell"]') as HTMLElement

    await waitFor(() => {
      expect(tableShell).not.toBeNull()
      expect(tableShell).toHaveStyle('width: 100%')
      expect(tableShell).toHaveStyle('min-width: 0')
      expect(tableShell).toHaveStyle('max-width: 100%')
      expect(tableShell).toHaveStyle('overflow-x: hidden')
    })
  })
})
