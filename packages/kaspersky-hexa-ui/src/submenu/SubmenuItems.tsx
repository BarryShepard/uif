import { useTestAttribute } from '@helpers/hooks/useTestAttribute'
import React, { FC, useEffect, useState } from 'react'

import { SubmenuDivider, SubmenuRow, SubmenuTitle } from './SubComponents'
import { CommonSubComponentProps, LeveledRowProps, LeveledSubmenuItemProps } from './types'

export const SubmenuItems: FC<CommonSubComponentProps & {
  items: LeveledSubmenuItemProps[],
  parentKey?: string
}> = ({
  items,
  parentKey,
  ...props
}) => (
  <>
    {items.map((rawItem, index) => {
      const item = useTestAttribute(rawItem)
      switch (item.type) {
        case 'row':
          return <Row {...props} parentKey={parentKey} row={item} key={item.key} />
        case 'title':
          return <SubmenuTitle {...item} key={item.key} />
        case 'divider':
          return <SubmenuDivider {...item} key={index} />
        default:
          return null
      }
    })}
  </>
)

const Row: FC<CommonSubComponentProps & {
  parentKey?: string,
  row: LeveledRowProps
}> = ({ row, ...props }) => {
  const { children } = row
  const isDragTarget = (
    props.dragTarget?.targetKey === row.key &&
    props.dragTarget?.parentKey === props.parentKey
  )

  const [showChildren, setShowChildren] = useState(row.opened)

  useEffect(() => {
    setShowChildren(row.opened)
  }, [row.opened])

  const handleRowClick = async () => {
    if ((await row.onClick?.(row.key, row)) !== false) {
      props.handleActiveRowChange(row)
    }
    props.collapseOnTextClick && handleCollapsibleRowClick()
  }

  const handleCollapsibleRowClick = () => {
    children && setShowChildren(!showChildren)
  }

  return <>
    <SubmenuRow
      {...props}
      dragged={props.draggedRowKey === row.key}
      dropPosition={isDragTarget ? props.dragTarget?.position : undefined}
      row={{ ...row, opened: showChildren }}
      selected={props.activeRowKey === row.key}
      collapsible={!!children}
      onCollapsibleClick={handleCollapsibleRowClick}
      onClick={handleRowClick}
    />
    {children && showChildren && <SubmenuItems {...props} items={children} parentKey={row.key} />}
  </>
}
