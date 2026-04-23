import React from 'react'

import ToolbarButton, { toolbarChildrenToItems } from '../ToolbarButton/ToolbarButton'

import ToolbarDivider from './ToolbarDivider'

describe('ToolbarDivider UXPin integration', () => {
  test('should convert ToolbarDivider child to divider toolbar item', () => {
    const items = toolbarChildrenToItems(
      <>
        <ToolbarButton text="Action" />
        <ToolbarDivider />
      </>,
      'toolbar-items'
    )

    expect(items).toHaveLength(2)
    expect(items[1]).toMatchObject({
      type: 'divider',
      key: 'toolbar-items-2'
    })
  })
})
