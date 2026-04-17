import { getClassNameWithTheme } from '@helpers/getClassNameWithTheme'
import { useTestAttribute } from '@helpers/hooks/useTestAttribute'
import cn from 'classnames'
import React, { FC, useMemo, useState } from 'react'

import styles from './Submenu.module.scss'
import { SubmenuItems } from './SubmenuItems'
import {
  LeveledRowProps,
  LeveledSubmenuItemProps,
  RowProps,
  SubmenuDragTarget,
  SubmenuDropPosition,
  SubmenuItemProps,
  SubmenuProps
} from './types'

export const Submenu: FC<SubmenuProps> = (rawProps) => {
  const {
    activeKey,
    collapseOnTextClick = true,
    defaultActiveKey,
    elementAfter,
    elementBefore,
    items,
    onChange,
    testAttributes,
    truncateText = true,
    ...rest
  } = useTestAttribute(rawProps)
  const [orderByParentKey, setOrderByParentKey] = useState<Record<string, string[]>>({})
  const [draggedRow, setDraggedRow] = useState<DraggedRow | null>(null)
  const [dragTarget, setDragTarget] = useState<SubmenuDragTarget | null>(null)
  const orderedItems = useMemo(() => applyOrderToItems(items, orderByParentKey), [items, orderByParentKey])

  const pathToActiveRowFromProps = useMemo(() => findPathToActiveRow(orderedItems, activeKey || defaultActiveKey), [orderedItems, activeKey, defaultActiveKey])
  const activeRowFromProps = pathToActiveRowFromProps?.[pathToActiveRowFromProps.length - 1]

  const itemsWithLevels = useMemo(() =>
    addLevelsToRows(orderedItems, pathToActiveRowFromProps?.map((item) => item.key).slice(0, -1))
  , [orderedItems, pathToActiveRowFromProps])

  const [activeRow, setActiveRow] = useState(pathToActiveRowFromProps ? activeRowFromProps : findFirstRow(itemsWithLevels))
  const activeRowFromOrderedItems = useMemo(() => {
    const activePath = findPathToActiveRow(itemsWithLevels, activeRow?.key)

    return activePath?.[activePath.length - 1]
  }, [activeRow?.key, itemsWithLevels])

  const handleActiveRowChange = (row: LeveledRowProps) => {
    if (!activeKey) {
      setActiveRow(row)
    }
    onChange?.(row.key)
  }

  const handleRowDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    row: LeveledRowProps,
    parentKey?: string
  ) => {
    event.stopPropagation()
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', row.key)
    setDraggedRow({ key: row.key, parentKey })
    setDragTarget(null)
  }

  const handleRowDragOver = (
    event: React.DragEvent<HTMLDivElement>,
    row: LeveledRowProps,
    parentKey?: string
  ) => {
    if (!draggedRow || draggedRow.parentKey !== parentKey || draggedRow.key === row.key) {
      setDragTarget(null)
      return
    }

    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'

    const position = getDropPosition(event)

    setDragTarget((currentDragTarget) => {
      if (
        currentDragTarget?.targetKey === row.key &&
        currentDragTarget?.parentKey === parentKey &&
        currentDragTarget?.position === position
      ) {
        return currentDragTarget
      }

      return {
        parentKey,
        position,
        targetKey: row.key
      }
    })
  }

  const handleRowDrop = (
    event: React.DragEvent<HTMLDivElement>,
    row: LeveledRowProps,
    parentKey?: string
  ) => {
    event.preventDefault()
    event.stopPropagation()

    if (!draggedRow || draggedRow.parentKey !== parentKey || draggedRow.key === row.key) {
      setDraggedRow(null)
      setDragTarget(null)
      return
    }

    const position = dragTarget?.targetKey === row.key && dragTarget.parentKey === parentKey
      ? dragTarget.position
      : getDropPosition(event)

    setOrderByParentKey((currentOrderByParentKey) => {
      const currentItems = applyOrderToItems(items, currentOrderByParentKey)
      const rowKeys = findSiblingRowKeys(currentItems, parentKey)
      const nextRowKeys = reorderRowKeys(rowKeys, {
        position,
        sourceKey: draggedRow.key,
        targetKey: row.key
      })

      return {
        ...currentOrderByParentKey,
        [getParentOrderKey(parentKey)]: nextRowKeys
      }
    })
    setDraggedRow(null)
    setDragTarget(null)
  }

  const activeRowToRender = activeKey ? activeRowFromProps : activeRowFromOrderedItems ?? activeRow

  return (
    <div className={styles.wrapper}>
      <div
        {...rest}
        {...testAttributes}
        className={cn(styles.submenu, getClassNameWithTheme(rawProps))}
      >
        {elementBefore && <div className={styles.elementBefore}>{elementBefore}</div>}
        <div className={styles.itemsStack}>
          <SubmenuItems
            handleActiveRowChange={handleActiveRowChange}
            truncateText={truncateText}
            collapseOnTextClick={collapseOnTextClick}
            draggedRowKey={draggedRow?.key}
            dragTarget={dragTarget}
            handleRowDragEnd={() => {
              setDraggedRow(null)
              setDragTarget(null)
            }}
            handleRowDragOver={handleRowDragOver}
            handleRowDragStart={handleRowDragStart}
            handleRowDrop={handleRowDrop}
            items={itemsWithLevels}
            activeRowKey={activeKey || activeRow?.key}
          />
        </div>
        {elementAfter && <div className={styles.elementAfter}>{elementAfter}</div>}
      </div>
      {activeRowToRender?.content && (
        <div className={cn(styles.content, activeRowToRender.contentClassName)}>
          {activeRowToRender.content}
        </div>
      )}
    </div>
  )
}

const findFirstRow = (items: LeveledSubmenuItemProps[]) => (
  items.find(isLeveledRowItem)
)

type DraggedRow = {
  key: string,
  parentKey?: string
}

type ReorderOptions = {
  position: SubmenuDropPosition,
  sourceKey: string,
  targetKey: string
}

const ROOT_ORDER_KEY = '__root__'

const isRowItem = (item: SubmenuItemProps): item is RowProps => item.type === 'row'

const isLeveledRowItem = (item: LeveledSubmenuItemProps): item is LeveledRowProps => item.type === 'row'

const findPathToActiveRow = (items: SubmenuItemProps[], activeKey?: string): RowProps[] | undefined => {
  for (const item of items) {
    if (isRowItem(item)) {
      if (item.key === activeKey) {
        return [item]
      }
      if (item?.children) {
        const path = findPathToActiveRow(item.children, activeKey)
        if (path) {
          return [item, ...path]
        }
      }
    }
  }
}

const addLevelsToRows = <T extends SubmenuItemProps>(items: T[], openedRowsKeys: string[] = [], level = 0): T[] => {
  const hasCollapsibleItemsOnLevel = items.some((item) => (
    item.type === 'row' && Boolean(item.children)
  ))

  return items.map((item) => {
    if (item.type === 'row') {
      return {
        ...item,
        level,
        opened: item.expanded === true || openedRowsKeys.includes(item.key),
        extraLeftPadding: !item.children && hasCollapsibleItemsOnLevel ? 20 : 0,
        children: item.children && addLevelsToRows(item.children, openedRowsKeys, level + 1)
      }
    }

    return item
  })
}

const getDropPosition = (event: React.DragEvent<HTMLDivElement>): SubmenuDropPosition => {
  const { top, height } = event.currentTarget.getBoundingClientRect()

  return event.clientY > top + height / 2 ? 'after' : 'before'
}

const getParentOrderKey = (parentKey?: string): string => parentKey ?? ROOT_ORDER_KEY

const applyOrderToItems = (
  items: SubmenuItemProps[],
  orderByParentKey: Record<string, string[]>,
  parentKey?: string
): SubmenuItemProps[] => {
  const rowOrder = orderByParentKey[getParentOrderKey(parentKey)] ?? []
  const rowItems = items.filter(isRowItem)
  const rowsByKey = new Map(
    rowItems.map((item) => [item.key, item])
  )
  const orderedRows = [
    ...rowOrder.map((key) => rowsByKey.get(key)).filter((row): row is RowProps => Boolean(row)),
    ...rowItems.filter((item) => !rowOrder.includes(item.key))
  ]
  let nextRowIndex = 0

  return items.map((item) => {
    if (!isRowItem(item)) {
      return item
    }

    const nextRow = orderedRows[nextRowIndex++] ?? item

    return {
      ...nextRow,
      children: nextRow.children
        ? applyOrderToItems(nextRow.children, orderByParentKey, nextRow.key) as RowProps[]
        : undefined
    }
  })
}

const findSiblingRowKeys = (
  items: SubmenuItemProps[],
  parentKey?: string
): string[] => {
  if (!parentKey) {
    return items
      .filter(isRowItem)
      .map((item) => item.key)
  }

  for (const item of items) {
    if (!isRowItem(item) || !item.children) {
      continue
    }

    if (item.key === parentKey) {
      return item.children.map((child) => child.key)
    }

    const rowKeys = findSiblingRowKeys(item.children, parentKey)

    if (rowKeys.length) {
      return rowKeys
    }
  }

  return []
}

const reorderRowKeys = (rowKeys: string[], {
  position,
  sourceKey,
  targetKey
}: ReorderOptions): string[] => {
  const sourceIndex = rowKeys.indexOf(sourceKey)
  const targetIndex = rowKeys.indexOf(targetKey)

  if (sourceIndex === -1 || targetIndex === -1) {
    return rowKeys
  }

  const nextRowKeys = [...rowKeys]
  const [sourceItem] = nextRowKeys.splice(sourceIndex, 1)
  const targetIndexAfterRemoval = nextRowKeys.indexOf(targetKey)
  const insertionIndex = position === 'after'
    ? targetIndexAfterRemoval + 1
    : targetIndexAfterRemoval

  nextRowKeys.splice(insertionIndex, 0, sourceItem)

  return nextRowKeys
}
