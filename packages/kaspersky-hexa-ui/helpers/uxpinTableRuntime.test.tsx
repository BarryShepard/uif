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
})
