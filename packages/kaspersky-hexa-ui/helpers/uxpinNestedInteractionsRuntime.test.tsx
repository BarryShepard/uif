import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'

import MenuItem, { menuItemElementsToNavItems } from '../uxpin/components/MenuItem/MenuItem'
import SubmenuItem, { submenuChildrenToItems } from '../uxpin/components/SubmenuItem/SubmenuItem'
import TabItem from '../uxpin/components/TabItem/TabItem'
import Tabs from '../uxpin/components/Tabs/Tabs'
import ToolbarButton, { toolbarButtonElementToItem } from '../uxpin/components/ToolbarButton/ToolbarButton'

describe('UXPin nested interactions runtime', () => {
  it('keeps ToolbarButton click handlers after toolbar item conversion', () => {
    const onClick = jest.fn()
    const item = toolbarButtonElementToItem(
      <ToolbarButton text="Open" onClick={onClick} />,
      0
    )

    expect(item.type).toBe('button')

    if (item.type !== 'button') {
      throw new Error('ToolbarButton did not resolve to a button item')
    }

    item.onClick?.({} as React.MouseEvent<HTMLElement>)

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('keeps MenuItem click handlers after nav item conversion', () => {
    const onClick = jest.fn()
    const [item] = menuItemElementsToNavItems(
      <MenuItem label="Assets" onClick={onClick} />
    )

    item.onClick?.()

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('keeps SubmenuItem click handlers after submenu item conversion', () => {
    const onClick = jest.fn()
    const result = submenuChildrenToItems(
      <SubmenuItem text="Details" onClick={onClick} />
    )
    const [item] = result.items

    expect(item?.type).toBe('row')

    if (!item || item.type !== 'row') {
      throw new Error('SubmenuItem did not resolve to a row item')
    }

    item.onClick?.(item.key, item)

    expect(onClick).toHaveBeenCalledWith(item.key, item)
  })

  it('triggers per-tab click handlers when a nested TabItem is clicked inside Tabs', () => {
    const onClick = jest.fn()

    render(
      <Tabs>
        <TabItem text="Overview" onClick={onClick}>
          <div>Overview content</div>
        </TabItem>
        <TabItem text="Details">
          <div>Details content</div>
        </TabItem>
      </Tabs>
    )

    fireEvent.click(screen.getByRole('tab', { name: 'Overview' }))

    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
