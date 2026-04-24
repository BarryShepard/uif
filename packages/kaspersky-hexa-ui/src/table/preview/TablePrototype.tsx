import { ActionButton } from '@src/action-button'
import { Textbox } from '@src/input'
import { Link } from '@src/link'
import { Placeholder as HexaPlaceholder } from '@src/placeholder'
import { PlaceholderImageVariant, PlaceholderSize } from '@src/placeholder/types'
import { Tooltip } from '@src/tooltip'
import { Select } from '@src/select'
import { Status } from '@src/status'
import type { StatusMode } from '@src/status'
import { Table } from '@src/table'
import { TableColumn, TableRecord } from '@src/table/types'
import { TagProps, TagReductionGroup } from '@src/tag'
import { Toggle } from '@src/toggle'
import React, { CSSProperties, Key, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'

import {
  Placeholder as PlaceholderIcon,
  Search,
  SettingsGear,
  StatusInfoOutline
} from '@kaspersky/hexa-ui-icons/16'

const noop = (): void => undefined

export type TablePrototypeSize = 'standard' | 'compact'
export type TablePrototypeSelectionMode = 'none' | 'checkbox' | 'radio'

export type TablePrototypeHeaderVariant = 'checkbox' | 'empty' | 'text' | 'text+filters+sort'
export type TablePrototypeHeaderState = 'enabled' | 'hover' | 'active' | 'disabled'
export type TablePrototypeSortState = 'notApplied' | 'ascending' | 'descending'
export type TablePrototypeFilterState = 'notApplied' | 'applied'

export type TablePrototypeCellVariant =
  | 'checkbox'
  | 'text'
  | 'radio'
  | 'icon'
  | 'status'
  | 'link'
  | 'tag-group'
  | 'toggle'
  | 'actions'
  | 'tree'
  | 'treeLink'
  | 'input-text'
  | 'input-select'
  | 'input-multiselect'

export type TablePrototypeCellType = TablePrototypeCellVariant

export type TablePrototypeDataMode = 'generated' | 'manual'
export type TablePrototypePlaceholderImage = 'error404' | 'no data' | 'error403' | 'error503'

export type TablePrototypeOption = {
  label: string,
  value: string
}

export type TablePrototypeTextValue = {
  text?: string,
  before?: ReactNode,
  after?: ReactNode
}

export type TablePrototypeLinkValue = {
  text?: string,
  href?: string,
  before?: ReactNode,
  after?: ReactNode
}

export type TablePrototypeStatusValue = {
  label?: string,
  mode?: StatusMode
}

export type TablePrototypeToggleValue = {
  checked?: boolean,
  text?: string,
  disabled?: boolean
}

export type TablePrototypeChoiceValue = {
  checked?: boolean
}

export type TablePrototypeTagGroupValue = {
  items?: Array<string | TagProps>
}

export type TablePrototypeSelectValue = {
  value?: string | string[],
  options?: TablePrototypeOption[]
}

export type TablePrototypeIconValue = {
  icon?: ReactNode
}

export type TablePrototypeCellValue =
  | string
  | number
  | boolean
  | ReactNode
  | TablePrototypeChoiceValue
  | TablePrototypeIconValue
  | TablePrototypeLinkValue
  | TablePrototypeSelectValue
  | TablePrototypeStatusValue
  | TablePrototypeTagGroupValue
  | TablePrototypeTextValue
  | TablePrototypeToggleValue

export type TablePrototypeRow = TableRecord & {
  key?: Key,
  children?: TablePrototypeRow[]
}

export type TablePrototypeColumnConfig = {
  key?: string,
  field?: string,
  dataIndex?: string,
  title?: string,
  headerText?: string,
  width?: number,
  fill?: boolean,
  cellType?: TablePrototypeCellType,
  cellVariant?: TablePrototypeCellVariant,
  sortable?: boolean,
  filterable?: boolean,
  /** Comma- or newline-separated labels shown in the column filter dropdown. Empty value derives options from row data. */
  filterItems?: string,
  /** Shows the Reset filter action in the column dropdown. */
  resetFilterButton?: boolean,
  infoButton?: boolean,
  infoText?: string,
  buttonInfo?: boolean,
  sampleValue?: TablePrototypeCellValue,
  text?: string,
  toggleOnText?: string,
  toggleOffText?: string,
  options?: TablePrototypeOption[],
  elementBefore?: boolean,
  elementBeforeSlot?: ReactNode,
  elementAfter?: boolean,
  elementAfterSlot?: ReactNode,
  headerVariant?: TablePrototypeHeaderVariant,
  headerState?: TablePrototypeHeaderState,
  sort?: TablePrototypeSortState,
  filter?: TablePrototypeFilterState
}

export type TablePrototypePlaceholderConfig = {
  size?: PlaceholderSize,
  image?: boolean,
  imageType?: TablePrototypePlaceholderImage,
  titleText?: string,
  description?: boolean,
  descriptionText?: string,
  children?: ReactNode
}

export type TablePrototypeProps = {
  columns?: TablePrototypeColumnConfig[],
  placeholder?: TablePrototypePlaceholderConfig,
  dataMode?: TablePrototypeDataMode,
  dataSource?: TablePrototypeRow[],
  /** Preferred manual authoring format in UXPin. Expects a JSON array of rows. */
  dataSourceJson?: string,
  /** @deprecated Use rowsCount instead. Kept for backward compatibility in stories. */
  rows?: number,
  /** Total number of generated rows when dataMode is "generated". */
  rowsCount?: number,
  size?: TablePrototypeSize,
  showPagination?: boolean,
  /** @deprecated Use rowsPerPage instead. Kept for backward compatibility in stories. */
  pageSize?: number,
  /** How many rows should be shown on a page when pagination is enabled. */
  rowsPerPage?: number,
  /** Whether to show the summary block near pagination controls. */
  showPaginationSummary?: boolean,
  /** Whether to show the rows-per-page selector near pagination controls. */
  showRowsPerPageSelector?: boolean,
  selectionMode?: TablePrototypeSelectionMode,
  /** Internal UXPin mode: fill the available frame height and keep pagination docked at the bottom. */
  fillFrameHeight?: boolean,
  style?: CSSProperties
}

type ResolvedTextValue = {
  text: string,
  before?: ReactNode,
  after?: ReactNode
}

type ResolvedLinkValue = {
  text: string,
  href: string,
  before?: ReactNode,
  after?: ReactNode
}

type ResolvedSelectValue = {
  value: string[],
  options: TablePrototypeOption[]
}

type ResolvedToggleValue = {
  checked: boolean,
  text: string,
  disabled: boolean
}

type NormalizedColumn = {
  key: string,
  field: string,
  title: string,
  width: number,
  fill: boolean,
  cellType: TablePrototypeCellType,
  sortable: boolean,
  filterable: boolean,
  filterItems: string[],
  resetFilterButton: boolean,
  infoButton: boolean,
  infoText: string,
  sampleValue: TablePrototypeCellValue,
  hasCustomSampleValue: boolean,
  toggleOnText: string,
  toggleOffText: string,
  options: TablePrototypeOption[],
  elementBefore: boolean,
  elementBeforeSlot?: ReactNode,
  elementAfter: boolean,
  elementAfterSlot?: ReactNode,
  defaultSort: TablePrototypeSortState,
  defaultFilter: TablePrototypeFilterState
}

type TablePrototypeCellOverrides = Record<string, Record<string, TablePrototypeCellValue>>
type TablePrototypeRowLookup = Map<string, TablePrototypeRow>

const SELECT_OPTIONS: TablePrototypeOption[] = [
  { label: 'Option 1', value: 'option-1' },
  { label: 'Option 2', value: 'option-2' },
  { label: 'Option 3', value: 'option-3' }
]

const CHOICE_COLUMN_WIDTH = 22
const CHOICE_CONTROL_SIZE = 14
const DEFAULT_TOGGLE_ON_TEXT = 'Enabled'
const DEFAULT_TOGGLE_OFF_TEXT = 'Disabled'
const CHECKED_TEXT_VALUES = new Set(['1', 'active', 'checked', 'enabled', 'on', 'true', 'yes'])
const UNCHECKED_TEXT_VALUES = new Set(['0', 'disabled', 'false', 'inactive', 'no', 'off', 'unchecked'])
const CHOICE_COLUMN_STYLE: CSSProperties = {
  width: CHOICE_COLUMN_WIDTH,
  minWidth: CHOICE_COLUMN_WIDTH,
  maxWidth: CHOICE_COLUMN_WIDTH,
  paddingLeft: 0,
  paddingRight: 0
}

const DEFAULT_PAGE_SIZE = 20
const PROTOTYPE_PAGE_SIZE_OPTIONS = ['20', '50', '100']
const DEFAULT_TABLE_PLACEHOLDER: TablePrototypePlaceholderConfig = {
  size: 'small',
  image: true,
  imageType: 'no data',
  titleText: 'No data',
  description: true,
  descriptionText: 'There is no table data to display yet.'
}

export const defaultTablePrototypeColumns: TablePrototypeColumnConfig[] = [
  {
    key: 'asset',
    field: 'asset',
    width: 240,
    title: 'Asset',
    sortable: true,
    filterable: true,
    cellType: 'treeLink',
    sampleValue: { text: 'Workstation' }
  },
  {
    key: 'status',
    field: 'status',
    width: 180,
    title: 'Status',
    cellType: 'status',
    sampleValue: { label: 'Protected', mode: 'positive' }
  },
  {
    key: 'owner',
    field: 'owner',
    width: 220,
    title: 'Owner',
    sortable: true,
    filterable: true,
    infoButton: true,
    cellType: 'text',
    sampleValue: { text: 'Operator' }
  },
  {
    key: 'controls',
    field: 'controls',
    width: 152,
    title: 'Actions',
    cellType: 'actions'
  }
]

export const TablePrototype = ({
  columns = defaultTablePrototypeColumns,
  placeholder = DEFAULT_TABLE_PLACEHOLDER,
  dataMode,
  dataSource,
  dataSourceJson,
  rows = 6,
  rowsCount,
  size = 'standard',
  showPagination = false,
  pageSize = DEFAULT_PAGE_SIZE,
  rowsPerPage,
  showPaginationSummary = true,
  showRowsPerPageSelector = true,
  selectionMode = 'none',
  fillFrameHeight = false,
  style
}: TablePrototypeProps): JSX.Element => {
  const rootRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(0)
  const [scrollViewportHeight, setScrollViewportHeight] = useState<number | undefined>(undefined)
  const hasExplicitFrameHeight = fillFrameHeight || hasConcreteFrameHeightStyle(style)
  const resolvedRowsCount = normalizeNonNegativeInteger(rowsCount ?? rows, rows)
  const resolvedRowsPerPage = normalizePositiveInteger(rowsPerPage ?? pageSize, DEFAULT_PAGE_SIZE)
  const normalizedColumns = useMemo(
    () => {
      const sourceColumns = columns.length ? columns : defaultTablePrototypeColumns
      return sourceColumns.map((column, index) => normalizePrototypeColumn(column, index))
    },
    [columns]
  )
  const resolvedManualData = useMemo(
    () => resolveManualDataSource({ dataSource, dataSourceJson }),
    [dataSource, dataSourceJson]
  )
  const resolvedDataMode = resolveDataMode(dataMode, dataSource, dataSourceJson)
  const resolvedDataSource = useMemo<TablePrototypeRow[]>(
    () => resolvedDataMode === 'manual'
      ? patchPrototypeRowKeys(resolvedManualData.rows)
      : buildGeneratedRows(normalizedColumns, resolvedRowsCount),
    [normalizedColumns, resolvedDataMode, resolvedManualData.rows, resolvedRowsCount]
  )
  const [cellOverrides, setCellOverrides] = useState<TablePrototypeCellOverrides>({})
  const cellOverridesRef = useRef(cellOverrides)
  const [committedCellOverrides, setCommittedCellOverrides] = useState<TablePrototypeCellOverrides>({})
  const rowKeys = useMemo(() => collectRowKeys(resolvedDataSource), [resolvedDataSource])
  const committedDataSource = useMemo(
    () => applyCellOverrides(resolvedDataSource, committedCellOverrides),
    [committedCellOverrides, resolvedDataSource]
  )
  const committedRowsByKey = useMemo(
    () => createPrototypeRowLookup(committedDataSource),
    [committedDataSource]
  )
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [activeRowsPerPage, setActiveRowsPerPage] = useState(resolvedRowsPerPage)

  useEffect(() => {
    cellOverridesRef.current = {}
    setCellOverrides({})
    setCommittedCellOverrides({})
  }, [resolvedDataSource])

  useEffect(() => {
    cellOverridesRef.current = cellOverrides
  }, [cellOverrides])

  useEffect(() => {
    setSelectedRowKeys((prevKeys) => prevKeys.filter((key) => rowKeys.includes(key)))
  }, [rowKeys])

  const updateCellValue = useCallback((
    rowKey: Key | undefined,
    field: string,
    value: TablePrototypeCellValue
  ) => {
    if (rowKey === undefined) {
      return
    }

    setCellOverrides((prevOverrides) => {
      const nextOverrides = {
        ...prevOverrides,
        [String(rowKey)]: {
          ...prevOverrides[String(rowKey)],
          [field]: value
        }
      }

      cellOverridesRef.current = nextOverrides

      return nextOverrides
    })
  }, [])
  const commitInteractiveDataState = useCallback(() => {
    setCommittedCellOverrides(cellOverridesRef.current)
  }, [])

  useEffect(() => {
    setActiveRowsPerPage(resolvedRowsPerPage)
    setCurrentPage(1)
  }, [resolvedRowsPerPage])

  useEffect(() => {
    if (!showPagination) {
      if (currentPage !== 1) {
        setCurrentPage(1)
      }

      return
    }

    const maxPage = Math.max(1, Math.ceil(resolvedDataSource.length / activeRowsPerPage))

    setCurrentPage((prevPage) => (
      prevPage > maxPage ? maxPage : prevPage
    ))
  }, [activeRowsPerPage, currentPage, resolvedDataSource.length, showPagination])

  useEffect(() => {
    const tableBody = rootRef.current?.querySelector('.ant-table-body') as HTMLElement | null
    if (tableBody) {
      tableBody.scrollTop = 0
    }
  }, [activeRowsPerPage, currentPage])

  useEffect(() => {
    if (!rootRef.current) {
      return
    }

    const element = rootRef.current
    let frameId = 0

    const updateMetrics = () => {
      frameId = 0
      const rootRect = element.getBoundingClientRect()
      setContainerWidth(rootRect.width)

      if (!hasExplicitFrameHeight) {
        setScrollViewportHeight(undefined)
        return
      }

      const scrollingWrapper = element.querySelector('.table-scrolling-wrapper') as HTMLElement | null

      if (!scrollingWrapper) {
        return
      }

      const headerElement = (
        scrollingWrapper.querySelector('.ant-table-header') ||
        scrollingWrapper.querySelector('.ant-table-thead')
      ) as HTMLElement | null
      const headerHeight = headerElement?.getBoundingClientRect().height ?? (size === 'compact' ? 28 : 40)
      const horizontalScrollbarHeight = (
        element.querySelector('.table-horizontal-scrollbar') as HTMLElement | null
      )?.getBoundingClientRect().height ?? 0
      const paginationHeight = (
        element.querySelector('.ant-pagination-container') as HTMLElement | null
      )?.getBoundingClientRect().height ?? 0
      const availableWrapperHeight = Math.max(
        Math.floor(rootRect.height - horizontalScrollbarHeight - paginationHeight),
        headerHeight + 80
      )
      const wrapperHeight = scrollingWrapper.getBoundingClientRect().height
      const constrainedWrapperHeight = Math.min(
        wrapperHeight > 0 ? wrapperHeight : availableWrapperHeight,
        availableWrapperHeight
      )
      const nextViewportHeight = Math.max(
        Math.floor(constrainedWrapperHeight - headerHeight),
        80
      )
      const bodyContentElement = (
        scrollingWrapper.querySelector('.ant-table-tbody') ||
        scrollingWrapper.querySelector('.ant-table-placeholder')
      ) as HTMLElement | null
      const bodyContentHeight = bodyContentElement?.getBoundingClientRect().height ?? 0
      const nextHasVerticalOverflow = bodyContentHeight > nextViewportHeight + 1
      const nextScrollViewportHeight = nextHasVerticalOverflow ? nextViewportHeight : undefined

      setScrollViewportHeight((currentHeight) => (
        currentHeight === nextScrollViewportHeight ? currentHeight : nextScrollViewportHeight
      ))
    }

    const scheduleMetricsUpdate = () => {
      if (frameId) {
        cancelAnimationFrame(frameId)
      }

      frameId = requestAnimationFrame(updateMetrics)
    }

    scheduleMetricsUpdate()

    const resizeObserver = new ResizeObserver(() => scheduleMetricsUpdate())
    resizeObserver.observe(element)
    ;[
      element.querySelector('.table-scrolling-wrapper'),
      element.querySelector('.table-horizontal-scrollbar'),
      element.querySelector('.ant-pagination-container'),
      element.querySelector('.ant-table-header'),
      element.querySelector('.ant-table-thead'),
      element.querySelector('.ant-table-tbody'),
      element.querySelector('.ant-table-placeholder')
    ]
      .filter((node): node is Element => Boolean(node))
      .forEach((node) => resizeObserver.observe(node))

    return () => {
      if (frameId) {
        cancelAnimationFrame(frameId)
      }

      resizeObserver.disconnect()
    }
  }, [activeRowsPerPage, currentPage, hasExplicitFrameHeight, resolvedDataSource.length, showPagination, size])

  const prototypeFilters = useMemo(
    () => createPrototypeFilters(committedDataSource, normalizedColumns, committedRowsByKey),
    [committedDataSource, committedRowsByKey, normalizedColumns]
  )
  const initialSorting = useMemo(() => {
    const sortedColumn = normalizedColumns.find((column) => column.defaultSort !== 'notApplied')

    if (!sortedColumn) {
      return undefined
    }

    return {
      field: sortedColumn.field,
      direction: sortedColumn.defaultSort === 'descending' ? 'desc' as const : 'asc' as const
    }
  }, [normalizedColumns])
  const initialFilters = useMemo(() => {
    const appliedFilters = normalizedColumns.reduce<Record<string, Record<string, (row: TablePrototypeRow) => boolean>>>(
      (acc, column) => {
        if (column.defaultFilter !== 'applied') {
          return acc
        }

        const fieldFilters = prototypeFilters[column.field]
        if (!fieldFilters?.length) {
          return acc
        }

        acc[column.field] = {
          [fieldFilters[0].name]: fieldFilters[0].filter
        }

        return acc
      },
      {}
    )

    return Object.keys(appliedFilters).length ? appliedFilters : undefined
  }, [normalizedColumns, prototypeFilters])
  const selectionColumnWidth = selectionMode === 'none' ? 0 : CHOICE_COLUMN_WIDTH
  const layoutColumns = useMemo(
    () => resolvePrototypeLayoutColumns(normalizedColumns, containerWidth, selectionColumnWidth),
    [normalizedColumns, containerWidth, selectionColumnWidth]
  )
  const allRowsSelected = selectionMode !== 'none' && rowKeys.length > 0 && rowKeys.every((rowKey) => selectedRowKeys.includes(rowKey))
  const partiallySelected = selectionMode === 'checkbox' && selectedRowKeys.length > 0 && !allRowsSelected
  const selectedRowKeySet = useMemo(() => new Set(selectedRowKeys), [selectedRowKeys])
  const toggleAllRows = (checked: boolean) => {
    setSelectedRowKeys(checked ? rowKeys : [])
  }
  const toggleSingleRow = (rowKey: Key, checked: boolean) => {
    setSelectedRowKeys((prevKeys) => {
      if (selectionMode === 'radio') {
        return checked ? [rowKey] : []
      }

      return checked
        ? Array.from(new Set([...prevKeys, rowKey]))
        : prevKeys.filter((key) => key !== rowKey)
    })
  }
  const tableColumns = useMemo<TableColumn[]>(() => (
    [
      ...(selectionMode === 'none'
        ? []
        : [{
            key: '__prototype-selection__',
            dataIndex: '__prototype-selection__',
            columnId: '__prototype-selection__',
            title: selectionMode === 'checkbox'
              ? (
                  <PrototypeSelectionHeader
                    checked={allRowsSelected}
                    indeterminate={partiallySelected}
                    onChange={toggleAllRows}
                  />
                )
              : '',
            width: CHOICE_COLUMN_WIDTH,
            align: 'center' as const,
            className: 'table-prototype-column table-prototype-column--selection',
            ellipsis: false,
            resizing: { disabled: true },
            onCell: () => ({ style: CHOICE_COLUMN_STYLE }),
            onHeaderCell: () => ({ style: CHOICE_COLUMN_STYLE }),
            render: (_value: unknown, record: TableRecord) => (
              <PrototypeSelectionCell
                selectionMode={selectionMode}
                checked={record.key !== undefined && selectedRowKeys.includes(record.key)}
                onChange={(checked) => {
                  if (record.key !== undefined) {
                    toggleSingleRow(record.key, checked)
                  }
                }}
              />
            )
          }]),
      ...layoutColumns.map((column) => ({
        key: column.key,
        dataIndex: column.field,
        columnId: column.field,
        title: <PrototypeHeaderTitle title={column.title} infoButton={column.infoButton} infoText={column.infoText} size={size} />,
        hideDefaultMenuIcon: !(column.sortable || column.filterable),
        showResetFilterButton: column.resetFilterButton,
        width: column.width,
        className: `table-prototype-column table-prototype-column--${column.cellType}`,
        ellipsis: false,
        align: column.cellType === 'checkbox' || column.cellType === 'radio' || column.cellType === 'icon'
          ? 'center' as const
          : undefined,
        resizing: column.cellType === 'checkbox' || column.cellType === 'radio'
          ? { disabled: true }
          : undefined,
        isSortable: column.sortable,
        sorter: column.sortable ? createPrototypeSorter(column, committedRowsByKey) : undefined,
        filters: column.filterable ? prototypeFilters[column.field] : undefined,
        allowMultipleFilters: false,
        render: (value: unknown, _record: TableRecord, rowIndex: number) => (
          <TablePrototypeCell
            column={column}
            size={size}
            value={resolveVisibleRecordColumnValue(_record, column, value, cellOverrides)}
            rowIndex={rowIndex}
            rowKey={_record.key}
            onCellValueChange={updateCellValue}
          />
        ),
        ...(isChoiceCellType(column.cellType)
          ? {
              onCell: () => ({ style: CHOICE_COLUMN_STYLE }),
              onHeaderCell: () => ({ style: CHOICE_COLUMN_STYLE })
            }
          : {})
      }))
    ]
  ), [
    allRowsSelected,
    cellOverrides,
    layoutColumns,
    partiallySelected,
    committedRowsByKey,
    prototypeFilters,
    selectedRowKeys,
    selectionMode,
    size,
    updateCellValue,
    rowKeys
  ])
  const treeColumn = layoutColumns.find((column) => (
    column.cellType === 'tree' || column.cellType === 'treeLink'
  ))
  const minWidth = layoutColumns.reduce((sum, column) => sum + column.width, selectionColumnWidth)
  const horizontalScrollX = containerWidth > 0 && minWidth > containerWidth + 1 ? minWidth : undefined
  const scroll = scrollViewportHeight || horizontalScrollX
    ? {
        ...(horizontalScrollX ? { x: horizontalScrollX } : {}),
        ...(scrollViewportHeight ? { y: scrollViewportHeight } : {})
      }
    : undefined
  const pagination = showPagination
    ? {
        current: currentPage,
        pageSize: activeRowsPerPage,
        pageSizeOptions: PROTOTYPE_PAGE_SIZE_OPTIONS,
        showSizeChanger: showRowsPerPageSelector,
        total: resolvedDataSource.length,
        showTotalSummary: showPaginationSummary,
        restoreCurrentWhenDataChange: true,
        onChange: (nextCurrent: number, nextPageSize: number) => {
          setCurrentPage(nextCurrent)

          if (nextPageSize !== activeRowsPerPage) {
            setActiveRowsPerPage(nextPageSize)
          }
        },
        onShowSizeChange: (nextCurrent: number, nextPageSize: number) => {
          setCurrentPage(nextCurrent)
          setActiveRowsPerPage(nextPageSize)
        }
      }
    : false
  const placeholderKey = useMemo(() => JSON.stringify({
    size: placeholder.size,
    image: placeholder.image,
    imageType: placeholder.imageType,
    titleText: placeholder.titleText,
    description: placeholder.description,
    descriptionText: placeholder.descriptionText,
    actionsCount: React.Children.count(placeholder.children)
  }), [placeholder])
  const tableInstanceKey = useMemo(() => JSON.stringify({
    columns: layoutColumns.map((column) => ({
      key: column.key,
      width: column.width,
      fill: column.fill,
      cellType: column.cellType,
      sortable: column.sortable,
      filterable: column.filterable,
      filterItems: column.filterItems.join('|'),
      defaultFilter: column.defaultFilter,
      defaultSort: column.defaultSort,
      resetFilterButton: column.resetFilterButton
    })),
    selectionMode,
    showPagination,
    showPaginationSummary,
    showRowsPerPageSelector,
    size,
    placeholder: placeholderKey
  }), [layoutColumns, placeholderKey, selectionMode, showPagination, showPaginationSummary, showRowsPerPageSelector, size])
  const emptyText = resolvedManualData.error
    ? <ManualDataError>{resolvedManualData.error}</ManualDataError>
    : resolvedDataSource.length === 0
      ? <TablePrototypePlaceholder placeholder={placeholder} />
      : undefined

  return (
    <PreviewRoot
      ref={rootRef}
      data-table-prototype-selection-mode={selectionMode}
      data-table-prototype-size={size}
      style={style}
    >
      <Table
        key={tableInstanceKey}
        columns={tableColumns}
        dataSource={resolvedDataSource}
        expandable={treeColumn ? { expandColumnName: treeColumn.field } : undefined}
        emptyText={emptyText}
        fullHeight={hasExplicitFrameHeight}
        initialFilters={initialFilters}
        initialSorting={initialSorting}
        onDropdownFiltersChange={commitInteractiveDataState}
        onSortChange={commitInteractiveDataState}
        pagination={pagination}
        resizingMode="manual"
        rowMode={size}
        scroll={scroll}
        rowClassName={(record) => (
          record.key !== undefined && selectedRowKeySet.has(record.key)
            ? 'ant-table-row-selected'
            : ''
        )}
        stickyFooter={hasExplicitFrameHeight && showPagination}
        tableLayout={horizontalScrollX ? 'fixed' : undefined}
      />
    </PreviewRoot>
  )
}

const resolveDataMode = (
  dataMode: TablePrototypeDataMode | undefined,
  dataSource: TablePrototypeRow[] | undefined,
  dataSourceJson: string | undefined
): TablePrototypeDataMode => {
  if (dataMode) {
    return dataMode
  }

  return (dataSource?.length || dataSourceJson?.trim()) ? 'manual' : 'generated'
}

const normalizePrototypeColumn = (
  column: TablePrototypeColumnConfig,
  index: number
): NormalizedColumn => {
  const cellType = column.cellType ?? column.cellVariant ?? 'text'
  const title = column.title ?? column.headerText ?? `Column ${index + 1}`
  const field = column.field ?? column.dataIndex ?? column.key ?? `column_${index + 1}`
  const sortable = column.sortable ?? Boolean(
    column.headerVariant === 'text+filters+sort' ||
    column.sort
  )
  const filterable = column.filterable ?? Boolean(
    column.headerVariant === 'text+filters+sort' ||
    column.filter
  )
  const hasCustomSampleValue = column.sampleValue !== undefined || column.text !== undefined

  return {
    key: column.key ?? field,
    field,
    title,
    width: resolveFixedWidth(cellType, column.width),
    fill: cellType === 'checkbox' || cellType === 'radio' ? false : (column.fill ?? false),
    cellType,
    sortable,
    filterable,
    filterItems: parseFilterItems(column.filterItems),
    resetFilterButton: column.resetFilterButton ?? false,
    infoButton: column.infoButton ?? column.buttonInfo ?? false,
    infoText: column.infoText ?? `About ${title}`,
    sampleValue: column.sampleValue ?? column.text ?? resolveDefaultSampleValue(cellType),
    hasCustomSampleValue,
    toggleOnText: column.toggleOnText ?? DEFAULT_TOGGLE_ON_TEXT,
    toggleOffText: column.toggleOffText ?? DEFAULT_TOGGLE_OFF_TEXT,
    options: column.options?.length ? column.options : SELECT_OPTIONS,
    elementBefore: column.elementBefore ?? false,
    elementBeforeSlot: column.elementBeforeSlot,
    elementAfter: column.elementAfter ?? false,
    elementAfterSlot: column.elementAfterSlot,
    defaultSort: column.sort ?? 'notApplied',
    defaultFilter: column.filter ?? 'notApplied'
  }
}

const resolvePrototypeLayoutColumns = (
  columns: NormalizedColumn[],
  containerWidth: number,
  selectionColumnWidth: number
): NormalizedColumn[] => {
  if (containerWidth <= 0) {
    return columns
  }

  const availableWidth = Math.max(containerWidth - selectionColumnWidth, 0)
  const totalWidth = columns.reduce((sum, column) => sum + column.width, 0)
  const remainingWidth = Math.max(availableWidth - totalWidth, 0)

  if (remainingWidth === 0) {
    return columns
  }

  const fillColumns = columns.filter((column) => column.fill)
  const stretchTargets = fillColumns.length
    ? fillColumns
    : [findStretchTarget(columns)].filter((column): column is NormalizedColumn => Boolean(column))

  if (!stretchTargets.length) {
    return columns
  }

  const targetExtraWidth = new Map(
    stretchTargets.map((column, index) => [
      column.key,
      Math.floor(remainingWidth / stretchTargets.length) + (index < (remainingWidth % stretchTargets.length) ? 1 : 0)
    ])
  )

  return columns.map((column) => ({
    ...column,
    width: column.width + (targetExtraWidth.get(column.key) ?? 0)
  }))
}

const findStretchTarget = (columns: NormalizedColumn[]): NormalizedColumn | undefined => (
  [...columns].reverse().find((column) => (
    column.cellType !== 'checkbox' &&
    column.cellType !== 'radio'
  )) ?? columns[columns.length - 1]
)

const normalizePositiveInteger = (
  value: number | undefined,
  fallback: number
): number => {
  const parsedValue = Number(value)

  if (!Number.isFinite(parsedValue) || parsedValue <= 0) {
    return fallback
  }

  return Math.round(parsedValue)
}

const normalizeNonNegativeInteger = (
  value: number | undefined,
  fallback: number
): number => {
  const parsedValue = Number(value)

  if (!Number.isFinite(parsedValue) || parsedValue < 0) {
    return fallback
  }

  return Math.round(parsedValue)
}

const parseFilterItems = (value: string | undefined): string[] => {
  if (!value?.trim()) {
    return []
  }

  return value
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean)
}

const hasConcreteFrameDimension = (
  value: CSSProperties['height'] | CSSProperties['minHeight'] | CSSProperties['maxHeight']
): boolean => {
  if (typeof value === 'number') {
    return Number.isFinite(value) && value > 0
  }

  if (typeof value !== 'string') {
    return false
  }

  const normalizedValue = value.trim().toLowerCase()

  if (!normalizedValue || normalizedValue === 'auto' || normalizedValue.endsWith('%')) {
    return false
  }

  return (
    normalizedValue.startsWith('calc(') ||
    /^-?\d+(\.\d+)?([a-z]+)?$/.test(normalizedValue)
  )
}

const hasConcreteFrameHeightStyle = (style?: CSSProperties): boolean => (
  hasConcreteFrameDimension(style?.height) ||
  hasConcreteFrameDimension(style?.minHeight) ||
  hasConcreteFrameDimension(style?.maxHeight)
)

const resolveDefaultSampleValue = (cellType: TablePrototypeCellType): TablePrototypeCellValue => {
  switch (cellType) {
    case 'status':
      return { label: 'Protected', mode: 'positive' }
    case 'link':
    case 'treeLink':
      return { text: 'Open details', href: '#' }
    case 'tag-group':
      return { items: ['Region', 'HQ', 'Critical'] }
    case 'toggle':
      return { checked: true, text: 'On' }
    case 'checkbox':
    case 'radio':
      return { checked: true }
    case 'input-select':
      return { value: SELECT_OPTIONS[0].value, options: SELECT_OPTIONS }
    case 'input-multiselect':
      return { value: [SELECT_OPTIONS[0].value, SELECT_OPTIONS[1].value], options: SELECT_OPTIONS }
    case 'actions':
      return 'Actions'
    case 'tree':
      return { text: 'Node' }
    case 'input-text':
      return { text: 'Value' }
    default:
      return { text: 'Value' }
  }
}

const resolveDefaultColumnWidth = (cellType: TablePrototypeCellType): number => {
  switch (cellType) {
    case 'checkbox':
    case 'radio':
      return 22
    case 'icon':
      return 48
    case 'actions':
      return 152
    case 'toggle':
      return 140
    case 'status':
      return 180
    case 'tag-group':
      return 240
    case 'input-text':
    case 'input-select':
    case 'input-multiselect':
      return 220
    default:
      return 200
  }
}

const resolveFixedWidth = (
  cellType: TablePrototypeCellType,
  width: number | undefined
): number => {
  if (isChoiceCellType(cellType)) {
    return CHOICE_COLUMN_WIDTH
  }

  return width ?? resolveDefaultColumnWidth(cellType)
}

const isChoiceCellType = (cellType: TablePrototypeCellType): boolean => (
  cellType === 'checkbox' || cellType === 'radio'
)

const applyCellOverrides = (
  rows: TablePrototypeRow[],
  overrides: TablePrototypeCellOverrides
): TablePrototypeRow[] => {
  if (!Object.keys(overrides).length) {
    return rows
  }

  return rows.map((row) => {
    const rowKey = row.key === undefined ? undefined : String(row.key)
    const rowOverrides = rowKey ? overrides[rowKey] : undefined
    const nextRow: TablePrototypeRow = rowOverrides
      ? { ...row, ...rowOverrides }
      : { ...row }

    if (row.children) {
      nextRow.children = applyCellOverrides(row.children, overrides)
    }

    return nextRow
  })
}

const resolveRecordColumnValue = (
  record: TableRecord,
  column: NormalizedColumn,
  value: unknown
): unknown => {
  if (value !== undefined) {
    return value
  }

  for (const alias of getColumnFieldAliases(column)) {
    if (alias in record && record[alias] !== undefined) {
      return record[alias]
    }
  }

  return value
}

const resolveVisibleRecordColumnValue = (
  record: TableRecord,
  column: NormalizedColumn,
  value: unknown,
  overrides: TablePrototypeCellOverrides
): unknown => {
  const rowOverrides = record.key !== undefined ? overrides[String(record.key)] : undefined

  if (rowOverrides && Object.prototype.hasOwnProperty.call(rowOverrides, column.field)) {
    return rowOverrides[column.field]
  }

  return resolveRecordColumnValue(record, column, value)
}

const getColumnFieldAliases = (column: NormalizedColumn): string[] => {
  const aliases = [
    column.field,
    column.key,
    column.title,
    ...createFieldNameAliases(column.title)
  ]

  return Array.from(new Set(aliases.filter(Boolean)))
}

const createFieldNameAliases = (value: string): string[] => {
  const words = value.match(/[A-Za-zА-Яа-я0-9]+/g) ?? []

  if (!words.length) {
    return []
  }

  const normalizedWords = words.map((word) => word.toLowerCase())
  const camelCase = normalizedWords
    .map((word, index) => index === 0 ? word : `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
    .join('')

  return [
    camelCase,
    normalizedWords.join('_'),
    normalizedWords.join('-'),
    normalizedWords.join('')
  ]
}

const resolveManualDataSource = ({
  dataSource,
  dataSourceJson
}: {
  dataSource?: TablePrototypeRow[],
  dataSourceJson?: string
}): {
  rows: TablePrototypeRow[],
  error?: string
} => {
  const rawJson = dataSourceJson?.trim()

  if (rawJson) {
    try {
      const parsed = JSON.parse(rawJson)

      if (!Array.isArray(parsed)) {
        return {
          rows: [],
          error: 'dataSourceJson must be a JSON array of rows'
        }
      }

      return {
        rows: parsed as TablePrototypeRow[]
      }
    } catch {
      return {
        rows: [],
        error: 'dataSourceJson contains invalid JSON'
      }
    }
  }

  return {
    rows: dataSource || []
  }
}

const buildGeneratedRows = (
  columns: NormalizedColumn[],
  rows: number
): TablePrototypeRow[] => {
  const safeRows = Math.max(0, rows)
  const hasTreeColumn = columns.some((column) => (
    column.cellType === 'tree' || column.cellType === 'treeLink'
  ))

  return Array.from({ length: safeRows }, (_, index) => createGeneratedRow({
    columns,
    hasTreeColumn,
    path: [index + 1]
  }))
}

const createGeneratedRow = ({
  columns,
  hasTreeColumn,
  path
}: {
  columns: NormalizedColumn[],
  hasTreeColumn: boolean,
  path: number[]
}): TablePrototypeRow => {
  const rowKey = path.join('.')
  const row: TablePrototypeRow = { key: rowKey }

  columns.forEach((column) => {
    row[column.field] = createGeneratedCellValue(column, path)
  })

  const depth = path.length - 1
  const topLevelIndex = path[0]
  const shouldCreateChildren = hasTreeColumn && depth === 0 && topLevelIndex <= 3

  if (shouldCreateChildren) {
    row.children = [
      createGeneratedRow({ columns, hasTreeColumn, path: [...path, 1] }),
      createGeneratedRow({ columns, hasTreeColumn, path: [...path, 2] })
    ]
  }

  if (hasTreeColumn && depth === 1 && topLevelIndex === 1 && path[1] === 1) {
    row.children = [
      createGeneratedRow({ columns, hasTreeColumn, path: [...path, 1] })
    ]
  }

  return row
}

const createGeneratedCellValue = (
  column: NormalizedColumn,
  path: number[]
): TablePrototypeCellValue => {
  const displayId = path.join('.')
  const isEvenRow = path[path.length - 1] % 2 === 0
  const textSeed = extractTextContent(column.sampleValue, column.title)
  const withDisplayId = `${textSeed} ${displayId}`

  if (column.hasCustomSampleValue) {
    switch (column.cellType) {
      case 'checkbox':
      case 'radio':
        return { checked: resolveCheckedValue(column.sampleValue) }
      case 'icon':
        return { icon: extractIconValue(column.sampleValue) ?? column.elementBeforeSlot ?? <PlaceholderIcon /> }
      case 'status':
        return extractStatusValue(column.sampleValue)
      case 'link':
      case 'treeLink':
        return extractLinkValue(column.sampleValue)
      case 'tag-group':
        return { items: extractTagGroupItems(column.sampleValue, 'medium').map((item) => extractTextContent(item.label, 'Tag')) }
      case 'toggle':
        return extractToggleValue(column.sampleValue, column)
      case 'input-select':
      case 'input-multiselect':
        return extractSelectValue(column.sampleValue)
      case 'input-text':
      case 'tree':
      case 'text':
      default:
        return extractTextValue(column.sampleValue, column)
    }
  }

  switch (column.cellType) {
    case 'checkbox':
    case 'radio':
      return { checked: isEvenRow }
    case 'icon':
      return { icon: column.elementBeforeSlot ?? <PlaceholderIcon /> }
    case 'status':
      return {
        label: withDisplayId,
        mode: isEvenRow ? 'positive' : 'critical'
      }
    case 'link':
    case 'treeLink':
      return {
        text: withDisplayId,
        href: '#',
        before: column.elementBefore ? resolveSlotContent(true, column.elementBeforeSlot) : undefined,
        after: column.elementAfter ? resolveSlotContent(true, column.elementAfterSlot) : undefined
      }
    case 'tag-group':
      return {
        items: [`${textSeed} ${displayId}`, `Scope ${path[0]}`, isEvenRow ? 'Primary' : 'Secondary']
      }
    case 'toggle':
      return {
        checked: isEvenRow,
        text: isEvenRow ? column.toggleOnText : column.toggleOffText
      }
    case 'input-select':
      return {
        value: column.options[0]?.value,
        options: column.options
      }
    case 'input-multiselect':
      return {
        value: column.options.slice(0, 2).map((option) => option.value),
        options: column.options
      }
    case 'input-text':
      return { text: withDisplayId }
    case 'tree':
    case 'text':
    default:
      return {
        text: withDisplayId,
        before: column.elementBefore ? resolveSlotContent(true, column.elementBeforeSlot) : undefined,
        after: column.elementAfter ? resolveSlotContent(true, column.elementAfterSlot) : undefined
      }
  }
}

const patchPrototypeRowKeys = (
  rows: TablePrototypeRow[],
  parentPath: number[] = []
): TablePrototypeRow[] => (
  rows.map((row, index) => {
    const currentPath = [...parentPath, index + 1]
    const nextRow: TablePrototypeRow = {
      ...row,
      key: row.key ?? currentPath.join('.')
    }

    if (Array.isArray(row.children) && row.children.length) {
      nextRow.children = patchPrototypeRowKeys(row.children, currentPath)
    }

    return nextRow
  })
)

const collectRowKeys = (rows: TablePrototypeRow[]): Key[] => (
  rows.flatMap((row) => {
    const currentKey = row.key !== undefined ? [row.key] : []
    const childKeys = row.children ? collectRowKeys(row.children) : []
    return [...currentKey, ...childKeys]
  })
)

const createPrototypeRowLookup = (rows: TablePrototypeRow[]): TablePrototypeRowLookup => {
  const rowsByKey: TablePrototypeRowLookup = new Map()

  flattenPrototypeRows(rows).forEach((row) => {
    if (row.key !== undefined) {
      rowsByKey.set(String(row.key), row)
    }
  })

  return rowsByKey
}

const resolveOperationRow = (
  row: TableRecord,
  rowsByKey: TablePrototypeRowLookup
): TableRecord => (
  row.key !== undefined ? rowsByKey.get(String(row.key)) ?? row : row
)

const createPrototypeSorter = (
  column: NormalizedColumn,
  rowsByKey: TablePrototypeRowLookup
) => (
  (rowA: TableRecord, rowB: TableRecord, isAsc: boolean): number => {
    const operationRowA = resolveOperationRow(rowA, rowsByKey)
    const operationRowB = resolveOperationRow(rowB, rowsByKey)
    const valueA = resolveComparableValue(resolveRecordColumnValue(operationRowA, column, operationRowA[column.field]), column)
    const valueB = resolveComparableValue(resolveRecordColumnValue(operationRowB, column, operationRowB[column.field]), column)

    if (valueA === valueB) {
      return 0
    }

    if ((valueA > valueB && isAsc) || (valueA < valueB && !isAsc)) {
      return 1
    }

    return -1
  }
)

const createPrototypeFilters = (
  rows: TablePrototypeRow[],
  columns: NormalizedColumn[],
  rowsByKey: TablePrototypeRowLookup
): Record<string, NonNullable<TableColumn['filters']>> => (
  columns.reduce<Record<string, NonNullable<TableColumn['filters']>>>((acc, column) => {
    if (!column.filterable) {
      return acc
    }

    const values = column.filterItems.length
      ? column.filterItems
      : Array.from(
        new Set(
          flattenPrototypeRows(rows)
            .map((row) => resolveFilterLabel(resolveRecordColumnValue(row, column, row[column.field]), column))
            .filter((value): value is string => Boolean(value))
        )
      ).slice(0, 8)

    acc[column.field] = values.map((value) => ({
      name: value,
      filter: (row: TablePrototypeRow) => {
        const operationRow = resolveOperationRow(row, rowsByKey)

        return resolveFilterLabel(resolveRecordColumnValue(operationRow, column, operationRow[column.field]), column) === value
      }
    }))

    return acc
  }, {})
)

const flattenPrototypeRows = (rows: TablePrototypeRow[]): TablePrototypeRow[] => (
  rows.flatMap((row) => [
    row,
    ...(row.children ? flattenPrototypeRows(row.children) : [])
  ])
)

const resolveComparableValue = (
  value: unknown,
  column: Pick<NormalizedColumn, 'cellType' | 'toggleOffText' | 'toggleOnText'>
): string | number => {
  switch (column.cellType) {
    case 'checkbox':
    case 'radio':
      return resolveCheckedValue(value) ? 1 : 0
    case 'toggle':
      return resolveCheckedValue(value, column) ? 1 : 0
    case 'status':
      return extractStatusValue(value).label.toUpperCase()
    case 'tag-group':
      return extractTagGroupItems(value, 'medium').map((item) => extractTextContent(item.label, '')).join(' | ').toUpperCase()
    case 'input-select':
    case 'input-multiselect':
      return extractSelectValue(value).value.join(' | ').toUpperCase()
    case 'actions':
      return ''
    case 'link':
    case 'treeLink':
      return extractLinkValue(value).text.toUpperCase()
    case 'tree':
    case 'text':
    case 'input-text':
    default:
      return extractTextContent(value, '').toUpperCase()
  }
}

const resolveFilterLabel = (
  value: unknown,
  column: Pick<NormalizedColumn, 'cellType' | 'toggleOffText' | 'toggleOnText'>
): string => {
  switch (column.cellType) {
    case 'status':
      return extractStatusValue(value).label
    case 'tag-group':
      return extractTagGroupItems(value, 'medium').map((item) => extractTextContent(item.label, '')).join(', ')
    case 'link':
    case 'treeLink':
      return extractLinkValue(value).text
    case 'input-select':
    case 'input-multiselect':
      return extractSelectValue(value).value.join(', ')
    case 'checkbox':
    case 'radio':
      return resolveCheckedValue(value) ? 'Enabled' : 'Disabled'
    case 'toggle':
      return resolveCheckedValue(value, column) ? column.toggleOnText : column.toggleOffText
    case 'actions':
      return ''
    case 'tree':
    case 'text':
    case 'input-text':
    default:
      return extractTextContent(value, '')
  }
}

const TablePrototypeCell = ({
  column,
  onCellValueChange,
  size,
  value,
  rowKey,
  rowIndex
}: {
  column: NormalizedColumn,
  onCellValueChange?: (rowKey: Key | undefined, field: string, value: TablePrototypeCellValue) => void,
  size: TablePrototypeSize,
  value: unknown,
  rowKey?: Key,
  rowIndex: number
}): JSX.Element => {
  const checkedColumn = column.cellType === 'toggle' ? column : undefined
  const [checkedValue, setCheckedValue] = useState(resolveCheckedValue(value, checkedColumn))

  useEffect(() => {
    setCheckedValue(resolveCheckedValue(value, checkedColumn))
  }, [checkedColumn, value])

  switch (column.cellType) {
    case 'checkbox':
      return (
        <ChoiceCell>
          <PrototypeCheckbox
            checked={checkedValue}
            onChange={setCheckedValue}
          />
        </ChoiceCell>
      )
    case 'radio':
      return (
        <ChoiceCell>
          <PrototypeRadio
            checked={checkedValue}
            onClick={() => setCheckedValue(true)}
          />
        </ChoiceCell>
      )
    case 'icon':
      return <StaticCell>{extractIconValue(value) ?? resolveSlotContent(true, column.elementBeforeSlot)}</StaticCell>
    case 'status': {
      const status = extractStatusValue(value)
      return (
        <StaticCell>
          <Status mode={status.mode} label={status.label} />
        </StaticCell>
      )
    }
    case 'link':
    case 'treeLink': {
      const link = extractLinkValue(value)
      return (
        <TextCell className={column.cellType === 'treeLink' ? 'table-prototype-tree-link-cell' : undefined}>
          {link.before && <span className="slot">{link.before}</span>}
          <Link href={link.href} text={link.text} />
          {link.after && <span className="slot">{link.after}</span>}
        </TextCell>
      )
    }
    case 'tag-group':
      return (
        <StaticCell>
          <TagGroupCell>
            <TagReductionGroup
              items={extractTagGroupItems(value, size === 'compact' ? 'small' : 'medium')}
              reductionTag={{
                outlined: true,
                size: size === 'compact' ? 'small' : 'medium'
              }}
            />
          </TagGroupCell>
        </StaticCell>
      )
    case 'toggle': {
      const toggle = extractToggleValue(value, column)
      const toggleText = checkedValue ? column.toggleOnText : column.toggleOffText
      const handleToggleChange = (nextChecked: boolean) => {
        const checked = Boolean(nextChecked)
        setCheckedValue(checked)
        onCellValueChange?.(rowKey, column.field, {
          checked,
          disabled: toggle.disabled,
          text: checked ? column.toggleOnText : column.toggleOffText
        })
      }

      return (
        <StaticCell>
          <Toggle
            checked={checkedValue}
            disabled={toggle.disabled}
            onChange={handleToggleChange}
          >
            {toggleText}
          </Toggle>
        </StaticCell>
      )
    }
    case 'actions':
      return (
        <ActionsCell>
          <ActionButton mode="ghost" icon={<Search />} onClick={noop} />
          <ActionButton mode="ghost" icon={<SettingsGear />} onClick={noop} />
          <ActionButton mode="ghost" icon={<PlaceholderIcon />} onClick={noop} />
        </ActionsCell>
      )
    case 'input-text':
      return (
        <StaticCell>
          <Textbox value={extractTextContent(value, `Value ${rowIndex + 1}`)} onChange={noop} />
        </StaticCell>
      )
    case 'input-select': {
      const select = extractSelectValue(value)
      return (
        <StaticCell>
          <Select
            defaultValue={select.value[0]}
            options={select.options}
            style={{ width: '100%' }}
          />
        </StaticCell>
      )
    }
    case 'input-multiselect': {
      const select = extractSelectValue(value)
      return (
        <StaticCell>
          <Select
            defaultValue={select.value}
            mode="multiple"
            options={select.options}
            style={{ width: '100%' }}
          />
        </StaticCell>
      )
    }
    case 'tree':
    case 'text':
    default: {
      const textValue = extractTextValue(value, column)
      return (
        <TextCell>
          {textValue.before && <span className="slot">{textValue.before}</span>}
          <span className="text">{textValue.text}</span>
          {textValue.after && <span className="slot">{textValue.after}</span>}
        </TextCell>
      )
    }
  }
}

const resolveCheckedValue = (
  value: unknown,
  column?: Pick<NormalizedColumn, 'toggleOffText' | 'toggleOnText'>
): boolean => {
  if (typeof value === 'boolean') {
    return value
  }

  if (typeof value === 'number') {
    return value !== 0
  }

  if (typeof value === 'string') {
    return resolveCheckedTextValue(value, column)
  }

  if (value && typeof value === 'object' && 'checked' in value) {
    const checked = (value as TablePrototypeChoiceValue).checked

    if (checked !== undefined) {
      return typeof checked === 'boolean' ? checked : resolveCheckedValue(checked, column)
    }
  }

  if (value && typeof value === 'object' && 'text' in value) {
    return resolveCheckedTextValue((value as TablePrototypeToggleValue).text, column)
  }

  return false
}

const resolveCheckedTextValue = (
  value: unknown,
  column?: Pick<NormalizedColumn, 'toggleOffText' | 'toggleOnText'>
): boolean => {
  const normalizedValue = normalizeBooleanText(value)

  if (!normalizedValue) {
    return false
  }

  if (column) {
    if (normalizedValue === normalizeBooleanText(column.toggleOnText)) {
      return true
    }

    if (normalizedValue === normalizeBooleanText(column.toggleOffText)) {
      return false
    }
  }

  if (CHECKED_TEXT_VALUES.has(normalizedValue)) {
    return true
  }

  if (UNCHECKED_TEXT_VALUES.has(normalizedValue)) {
    return false
  }

  return false
}

const normalizeBooleanText = (value: unknown): string => (
  typeof value === 'string' || typeof value === 'number'
    ? String(value).trim().toLowerCase()
    : ''
)

const extractIconValue = (value: unknown): ReactNode | null => {
  if (value && typeof value === 'object' && 'icon' in value) {
    return (value as TablePrototypeIconValue).icon ?? null
  }

  return React.isValidElement(value) ? value : null
}

const extractStatusValue = (value: unknown): Required<TablePrototypeStatusValue> => {
  if (value && typeof value === 'object' && ('label' in value || 'mode' in value)) {
    return {
      label: String((value as TablePrototypeStatusValue).label ?? 'Protected'),
      mode: (value as TablePrototypeStatusValue).mode ?? 'positive'
    }
  }

  return {
    label: extractTextContent(value, 'Protected'),
    mode: 'positive'
  }
}

const extractLinkValue = (value: unknown): ResolvedLinkValue => {
  if (value && typeof value === 'object' && ('text' in value || 'href' in value)) {
    return {
      text: extractTextContent((value as TablePrototypeLinkValue).text, 'Open details'),
      href: (value as TablePrototypeLinkValue).href ?? '#',
      before: (value as TablePrototypeLinkValue).before,
      after: (value as TablePrototypeLinkValue).after
    }
  }

  return {
    text: extractTextContent(value, 'Open details'),
    href: '#',
    before: undefined,
    after: undefined
  }
}

const extractTextValue = (
  value: unknown,
  column: Pick<NormalizedColumn, 'elementAfter' | 'elementAfterSlot' | 'elementBefore' | 'elementBeforeSlot'>
): ResolvedTextValue => {
  if (value && typeof value === 'object' && ('text' in value || 'before' in value || 'after' in value)) {
    return {
      text: extractTextContent((value as TablePrototypeTextValue).text, 'Value'),
      before: (value as TablePrototypeTextValue).before ?? (column.elementBefore ? resolveSlotContent(true, column.elementBeforeSlot) : undefined),
      after: (value as TablePrototypeTextValue).after ?? (column.elementAfter ? resolveSlotContent(true, column.elementAfterSlot) : undefined)
    }
  }

  return {
    text: extractTextContent(value, 'Value'),
    before: column.elementBefore ? resolveSlotContent(true, column.elementBeforeSlot) : undefined,
    after: column.elementAfter ? resolveSlotContent(true, column.elementAfterSlot) : undefined
  }
}

const extractToggleValue = (
  value: unknown,
  column?: Pick<NormalizedColumn, 'toggleOffText' | 'toggleOnText'>
): ResolvedToggleValue => {
  if (value && typeof value === 'object' && ('checked' in value || 'text' in value || 'disabled' in value)) {
    const checked = resolveCheckedValue(value, column)
    return {
      checked,
      disabled: Boolean((value as TablePrototypeToggleValue).disabled),
      text: extractTextContent(
        (value as TablePrototypeToggleValue).text,
        checked ? column?.toggleOnText ?? DEFAULT_TOGGLE_ON_TEXT : column?.toggleOffText ?? DEFAULT_TOGGLE_OFF_TEXT
      )
    }
  }

  const checked = resolveCheckedValue(value, column)
  return {
    checked,
    disabled: false,
    text: checked ? column?.toggleOnText ?? DEFAULT_TOGGLE_ON_TEXT : column?.toggleOffText ?? DEFAULT_TOGGLE_OFF_TEXT
  }
}

const extractTagGroupItems = (
  value: unknown,
  size: TagProps['size']
): TagProps[] => {
  if (Array.isArray(value)) {
    return normalizeTagGroupItems(value, size)
  }

  if (typeof value === 'string' || typeof value === 'number') {
    return parseTagGroupText(String(value)).map((label) => ({ label, size }))
  }

  if (value && typeof value === 'object' && 'items' in value) {
    const items = (value as TablePrototypeTagGroupValue).items ?? []

    if (Array.isArray(items)) {
      return normalizeTagGroupItems(items, size)
    }

    if (typeof items === 'string' || typeof items === 'number') {
      return parseTagGroupText(String(items)).map((label) => ({ label, size }))
    }
  }

  return []
}

const normalizeTagGroupItems = (
  items: Array<string | number | TagProps>,
  size: TagProps['size']
): TagProps[] => (
  items.map((item, index) => {
    if (typeof item === 'string' || typeof item === 'number') {
      return { label: String(item), size }
    }

    const rawLabel = item.label ?? (item as { text?: ReactNode }).text ?? (item as { value?: ReactNode }).value
    const label = React.isValidElement(rawLabel)
      ? rawLabel
      : extractTextContent(rawLabel, `Tag ${index + 1}`)

    return {
      ...item,
      label,
      size: item.size ?? size
    }
  })
)

const parseTagGroupText = (value: string): string[] => (
  value
    .split(/[\n,|;]/)
    .map((item) => item.trim())
    .filter(Boolean)
)

const extractSelectValue = (value: unknown): ResolvedSelectValue => {
  if (value && typeof value === 'object' && ('value' in value || 'options' in value)) {
    const selectValue = (value as TablePrototypeSelectValue).value

    return {
      value: Array.isArray(selectValue) ? selectValue : [String(selectValue ?? SELECT_OPTIONS[0].value)],
      options: (value as TablePrototypeSelectValue).options?.length
        ? (value as TablePrototypeSelectValue).options as TablePrototypeOption[]
        : SELECT_OPTIONS
    }
  }

  return {
    value: [SELECT_OPTIONS[0].value],
    options: SELECT_OPTIONS
  }
}

const extractTextContent = (value: unknown, fallback: string): string => {
  if (typeof value === 'string' || typeof value === 'number') {
    return String(value)
  }

  if (value && typeof value === 'object') {
    if ('text' in value && (typeof (value as TablePrototypeTextValue).text === 'string' || typeof (value as TablePrototypeTextValue).text === 'number')) {
      return String((value as TablePrototypeTextValue).text)
    }

    if ('label' in value && typeof (value as TablePrototypeStatusValue).label === 'string') {
      return String((value as TablePrototypeStatusValue).label)
    }
  }

  return fallback
}

const resolveSlotContent = (
  enabled: boolean,
  slot?: ReactNode
): ReactNode => {
  if (!enabled) {
    return null
  }

  return slot ?? <PlaceholderIcon />
}

const resolvePlaceholderImage = (
  imageType: TablePrototypePlaceholderConfig['imageType']
): PlaceholderImageVariant => (
  imageType === 'no data' ? 'noData' : imageType ?? 'noData'
)

const TablePrototypePlaceholder = ({
  placeholder
}: {
  placeholder: TablePrototypePlaceholderConfig
}): JSX.Element => {
  const {
    children,
    description = DEFAULT_TABLE_PLACEHOLDER.description,
    descriptionText = DEFAULT_TABLE_PLACEHOLDER.descriptionText,
    image = DEFAULT_TABLE_PLACEHOLDER.image,
    imageType = DEFAULT_TABLE_PLACEHOLDER.imageType,
    size = DEFAULT_TABLE_PLACEHOLDER.size,
    titleText = DEFAULT_TABLE_PLACEHOLDER.titleText
  } = placeholder
  const resolvedChildren = React.Children.toArray(children).filter(Boolean)

  return (
    <TablePlaceholderRoot className="table-prototype-placeholder">
      <HexaPlaceholder
        mode="filled"
        size={size}
        image={image ? resolvePlaceholderImage(imageType) : undefined}
        title={titleText ?? DEFAULT_TABLE_PLACEHOLDER.titleText ?? 'No data'}
        description={description ? descriptionText : undefined}
      />
      {resolvedChildren.length > 0 && (
        <TablePlaceholderActions>
          {resolvedChildren}
        </TablePlaceholderActions>
      )}
    </TablePlaceholderRoot>
  )
}

const PrototypeHeaderTitle = ({
  title,
  infoButton = false,
  infoText = 'Column info',
  size
}: {
  title: string,
  infoButton?: boolean,
  infoText?: string,
  size: TablePrototypeSize
}): JSX.Element => (
  <HeaderTitle $compact={size === 'compact'}>
    <span className="text">{title}</span>
    {infoButton && (
      <Tooltip text={infoText}>
        <HeaderInfoButton>
          <StatusInfoOutline />
        </HeaderInfoButton>
      </Tooltip>
    )}
  </HeaderTitle>
)

const PrototypeSelectionHeader = ({
  checked,
  indeterminate,
  onChange
}: {
  checked: boolean,
  indeterminate: boolean,
  onChange: (checked: boolean) => void
}): JSX.Element => (
  <HeaderChoiceCell>
    <PrototypeCheckbox
      checked={checked}
      indeterminate={indeterminate}
      onChange={onChange}
    />
  </HeaderChoiceCell>
)

const PrototypeSelectionCell = ({
  selectionMode,
  checked,
  onChange
}: {
  selectionMode: TablePrototypeSelectionMode,
  checked: boolean,
  onChange: (checked: boolean) => void
}): JSX.Element => (
  <ChoiceCell>
    {selectionMode === 'checkbox'
      ? (
          <PrototypeCheckbox
            checked={checked}
            onChange={onChange}
          />
        )
      : (
          <PrototypeRadio
            checked={checked}
            onClick={() => onChange(true)}
          />
        )}
  </ChoiceCell>
)

const PreviewRoot = styled.div`
  width: 100%;
  height: 100%;
  flex: 1 1 auto;
  align-self: stretch;
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;

  > .table-scrolling-wrapper.table-height-full {
    flex: 1 1 auto;
    min-height: 0;
  }

  > .table-horizontal-scrollbar,
  > .ant-pagination-container {
    width: 100%;
    min-width: 0;
    max-width: 100%;
  }

  > .table-horizontal-scrollbar {
    flex: 0 0 auto;
  }

  > .ant-pagination-container {
    flex: 0 0 auto;
  }

  && {
    .table-height-full .ant-table table {
      height: auto;
    }

    .table-height-full .ant-table:has(.table-prototype-placeholder) table {
      height: 100%;
    }

    .table-height-full .ant-table-wrapper,
    .table-height-full .ant-spin-nested-loading,
    .table-height-full .ant-spin-container,
    .table-height-full .ant-table,
    .table-height-full .ant-table-container,
    .table-height-full .ant-table-content,
    .table-height-full .ant-table-body {
      min-height: 0;
    }

    .table-height-full .ant-table-body {
      flex: 1 1 auto;
      display: block;
      min-height: 0;
    }

    .table-height-full .ant-table-tbody {
      height: 100%;
    }

    .ant-table-tbody > tr.ant-table-placeholder > td {
      padding: 0 !important;
      background: #f4f6fa;
    }

    .ant-table-tbody > tr.ant-table-placeholder:hover > td {
      background: #f4f6fa;
    }

    .ant-table-placeholder > .ant-table-cell > .table-prototype-placeholder {
      position: sticky;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      width: 100%;
      min-height: 200px;
    }

    .table-height-full .ant-table-placeholder,
    .table-height-full .ant-table-placeholder > .ant-table-cell,
    .table-height-full .ant-table-placeholder > .ant-table-cell > .table-prototype-placeholder {
      height: 100%;
    }

    .ant-table-thead > tr > th.table-prototype-column {
      padding-top: 0 !important;
      padding-bottom: 0 !important;
      box-sizing: border-box !important;
      vertical-align: middle !important;
    }

    .ant-table-thead > tr > th.table-prototype-column .kl6-table-dropdown {
      display: flex;
      align-items: center;
      max-width: 100%;
      padding-top: 0 !important;
      padding-bottom: 0 !important;
      box-sizing: border-box;
    }

    .ant-table-thead > tr > th.table-prototype-column .kl6-table-dropdown > div {
      align-items: center;
      min-width: 0;
    }

    &[data-table-prototype-size="compact"] .ant-table-thead > tr > th.table-prototype-column {
      height: 28px !important;
      min-height: 28px !important;
    }

    &[data-table-prototype-size="compact"] .ant-table-thead > tr > th.table-prototype-column .kl6-table-dropdown,
    &[data-table-prototype-size="compact"] .ant-table-thead > tr > th.table-prototype-column .kl6-table-dropdown > div {
      height: 28px !important;
      min-height: 28px !important;
    }

    &[data-table-prototype-size="standard"] .ant-table-thead > tr > th.table-prototype-column {
      height: 40px !important;
      min-height: 40px !important;
    }

    &[data-table-prototype-size="standard"] .ant-table-thead > tr > th.table-prototype-column .kl6-table-dropdown,
    &[data-table-prototype-size="standard"] .ant-table-thead > tr > th.table-prototype-column .kl6-table-dropdown > div {
      height: 40px !important;
      min-height: 40px !important;
    }

    &[data-table-prototype-size="compact"] .ant-table-tbody > tr > td.table-prototype-column {
      height: 28px !important;
      padding-top: 4px !important;
      padding-bottom: 3px !important;
      box-sizing: border-box !important;
    }

    &[data-table-prototype-size="standard"] .ant-table-tbody > tr > td.table-prototype-column {
      height: 40px !important;
      padding-top: 10px !important;
      padding-bottom: 9px !important;
      box-sizing: border-box !important;
    }

    .ant-table-thead > tr > th.table-prototype-column,
    .ant-table-tbody > tr > td.table-prototype-column {
      min-width: 0 !important;
      max-width: none !important;
    }

    col.ant-table-selection-col,
    .ant-table-selection-column,
    .ant-table-selection-column.ant-table-cell,
    .ant-table-thead > tr > th.ant-table-selection-column,
    .ant-table-tbody > tr > td.ant-table-selection-column {
      width: 22px !important;
      min-width: 22px !important;
      max-width: 22px !important;
    }

    .ant-table-selection-column {
      padding-left: 0 !important;
      padding-right: 0 !important;
    }

    .ant-table-thead > tr > th.table-prototype-column--selection::after,
    .ant-table-thead > tr > th.table-prototype-column--checkbox::after,
    .ant-table-thead > tr > th.table-prototype-column--radio::after {
      left: 4px !important;
      right: 4px !important;
    }

    .ant-table-selection-column .kl6-checkbox-wrapper,
    .ant-table-selection-column .ant-checkbox-wrapper,
    .ant-table-selection-column .ant-radio-wrapper,
    .ant-table-selection-column .ant-checkbox,
    .ant-table-selection-column .ant-radio,
    .ant-table-tbody > tr > td.table-prototype-column--checkbox .kl6-checkbox-wrapper,
    .ant-table-tbody > tr > td.table-prototype-column--checkbox .ant-checkbox-wrapper,
    .ant-table-tbody > tr > td.table-prototype-column--checkbox .ant-checkbox,
    .ant-table-tbody > tr > td.table-prototype-column--radio .ant-radio-group,
    .ant-table-tbody > tr > td.table-prototype-column--radio .ant-radio-wrapper,
    .ant-table-tbody > tr > td.table-prototype-column--radio .ant-radio {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 14px;
      min-width: 14px;
      max-width: 14px;
      margin: 0 auto;
      flex: 0 0 14px;
    }

    .ant-table-thead > tr > th.table-prototype-column--checkbox,
    .ant-table-thead > tr > th.table-prototype-column--radio,
    .ant-table-thead > tr > th.table-prototype-column--selection,
    .ant-table-tbody > tr > td.table-prototype-column--checkbox,
    .ant-table-tbody > tr > td.table-prototype-column--radio,
    .ant-table-tbody > tr > td.table-prototype-column--selection {
      width: ${CHOICE_COLUMN_WIDTH}px !important;
      min-width: ${CHOICE_COLUMN_WIDTH}px !important;
      max-width: ${CHOICE_COLUMN_WIDTH}px !important;
      padding-left: 0 !important;
      padding-right: 0 !important;
    }

    && .ant-table .ant-table-tbody > tr > td.table-prototype-column--selection:first-child,
    .ant-table-thead > tr > th.table-prototype-column--selection:first-child,
    .ant-table-tbody > tr > td.table-prototype-column--selection:first-child,
    .ant-table-tbody > tr > td.table-prototype-column--checkbox:first-child,
    .ant-table-tbody > tr > td.table-prototype-column--radio:first-child {
      padding-left: 0 !important;
      padding-right: 0 !important;
    }

    &[data-table-prototype-selection-mode="checkbox"] colgroup col:first-child,
    &[data-table-prototype-selection-mode="radio"] colgroup col:first-child {
      width: ${CHOICE_COLUMN_WIDTH}px !important;
      min-width: ${CHOICE_COLUMN_WIDTH}px !important;
      max-width: ${CHOICE_COLUMN_WIDTH}px !important;
    }

    .ant-table-thead > tr > th.table-prototype-column--selection,
    .ant-table-thead > tr > th.table-prototype-column--checkbox,
    .ant-table-thead > tr > th.table-prototype-column--radio,
    .ant-table-tbody > tr > td.table-prototype-column--selection,
    .ant-table-tbody > tr > td.table-prototype-column--checkbox,
    .ant-table-tbody > tr > td.table-prototype-column--radio {
      flex: 0 0 ${CHOICE_COLUMN_WIDTH}px !important;
      overflow: visible !important;
    }

    .table-prototype-column--selection .kl6-checkbox-wrapper,
    .table-prototype-column--selection .ant-checkbox-wrapper,
    .table-prototype-column--selection .ant-radio-wrapper,
    .table-prototype-column--selection .table-prototype-checkbox,
    .table-prototype-column--selection .table-prototype-radio,
    .table-prototype-column--checkbox .kl6-checkbox-wrapper,
    .table-prototype-column--checkbox .ant-checkbox-wrapper,
    .table-prototype-column--checkbox .table-prototype-checkbox,
    .table-prototype-column--checkbox .table-prototype-radio,
    .table-prototype-column--radio .ant-radio-wrapper,
    .table-prototype-column--radio .table-prototype-radio {
      overflow: visible;
    }

    .table-prototype-column--selection .ant-checkbox-wrapper,
    .table-prototype-column--checkbox .ant-checkbox-wrapper,
    .table-prototype-column--selection .ant-radio-wrapper,
    .table-prototype-column--radio .ant-radio-wrapper {
      gap: 0 !important;
    }

    .table-prototype-column--selection .ant-checkbox-wrapper > span:not(.ant-checkbox):empty,
    .table-prototype-column--checkbox .ant-checkbox-wrapper > span:not(.ant-checkbox):empty,
    .table-prototype-column--selection .ant-radio-wrapper > span + span:empty,
    .table-prototype-column--radio .ant-radio-wrapper > span + span:empty {
      display: none !important;
      padding: 0 !important;
    }

    .ant-table-tbody > tr > td.table-prototype-column--treeLink.ant-table-cell-with-append {
      vertical-align: middle !important;
    }

    .ant-table-tbody > tr > td.table-prototype-column--treeLink.ant-table-cell-with-append .kl-components-expandable-icon.icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      height: 20px;
      margin-top: 0;
      vertical-align: middle;
    }

    .ant-table-tbody > tr > td.table-prototype-column--treeLink.ant-table-cell-with-append .table-prototype-tree-link-cell {
      display: inline-flex;
      width: auto;
      max-width: calc(100% - 24px);
      vertical-align: middle;
    }
  }
`

const HeaderTitle = styled.span.withConfig<{ $compact: boolean }>({
  shouldForwardProp: prop => prop !== '$compact'
})`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 100%;
  min-height: ${({ $compact }) => $compact ? '28px' : '40px'};
  min-width: 0;
  padding: 0;

  .text {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`

const HeaderInfoButton = styled.span`
  display: inline-flex;
  align-items: center;
  color: #7e8797;
  flex: 0 0 auto;
`

const ManualDataError = styled.span`
  color: #d4380d;
`

const TablePlaceholderRoot = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%;
  box-sizing: border-box;
  min-height: 200px;
  padding: 24px;
  background: #f4f6fa;

  .hexa-ui-placeholder {
    height: auto;
    padding: 0;
    background: transparent;
  }
`

const TablePlaceholderActions = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;
  max-width: 100%;

  > * {
    width: auto !important;
    min-width: 0;
    flex: 0 0 auto;
  }
`

const StaticCell = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  min-width: 0 !important;
  min-height: 20px;
  overflow: hidden;

  .ant-select,
  .hexa-ui-toggle {
    width: 100%;
  }
`

const ChoiceCell = styled(StaticCell)`
  justify-content: center;
  width: 14px;
  min-width: 14px !important;
  max-width: 14px !important;
  margin: 0 auto;

  .kl6-checkbox-wrapper,
  .ant-radio-group {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 14px;
    min-width: 14px !important;
    max-width: 14px !important;
    margin: 0 auto;
    flex: 0 0 14px;
  }

  .ant-radio-group > div {
    display: inline-flex;
  }

  .kl6-checkbox-wrapper,
  .ant-checkbox-wrapper,
  .ant-radio-wrapper {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin: 0;
    width: 14px;
    min-width: 14px !important;
    max-width: 14px !important;
  }
`

const HeaderChoiceCell = styled(ChoiceCell)``

const TagGroupCell = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  min-width: 0;

  > div {
    min-width: 0;
  }
`

const PrototypeCheckboxButton = styled.span.withConfig({
  shouldForwardProp: prop => !['$checked', '$indeterminate'].includes(String(prop))
})<{ $checked: boolean, $indeterminate: boolean }>`
  display: block;
  position: relative;
  width: 14px;
  height: 14px;
  min-width: 14px;
  max-width: 14px;
  padding: 0;
  margin: -1px 0 0;
  border-radius: 4px;
  border: 1px solid ${({ $checked, $indeterminate }) => ($checked || $indeterminate) ? '#3367F6' : '#7E8797'};
  background: ${({ $checked, $indeterminate }) => ($checked || $indeterminate) ? '#3367F6' : '#FFFFFF'};
  box-sizing: border-box;
  cursor: pointer;
  user-select: none;
  flex: 0 0 14px;
  line-height: 0;
  vertical-align: top;

  &::after {
    content: '';
    position: absolute;
    left: 50%;
    top: 50%;
    ${({ $checked, $indeterminate }) => {
      if ($indeterminate) {
        return `
          width: 6px;
          height: 2px;
          border-radius: 2px;
          background: #FFFFFF;
          transform: translate(-50%, -50%);
        `
      }

      if ($checked) {
        return `
          width: 4px;
          height: 7px;
          border-right: 2px solid #FFFFFF;
          border-bottom: 2px solid #FFFFFF;
          transform: translate(-50%, -58%) rotate(45deg);
        `
      }

      return `
        width: 0;
        height: 0;
        transform: translate(-50%, -50%);
      `
    }}
  }
`

const PrototypeCheckbox = ({
  checked,
  indeterminate = false,
  onChange
}: {
  checked: boolean,
  indeterminate?: boolean,
  onChange: (checked: boolean) => void
}): JSX.Element => {
  const nextChecked = indeterminate ? true : !checked
  const handleActivate = () => onChange(nextChecked)

  return (
    <PrototypeCheckboxButton
      className="table-prototype-checkbox"
      $checked={checked}
      $indeterminate={indeterminate}
      role="checkbox"
      aria-checked={indeterminate ? 'mixed' : checked}
      tabIndex={0}
      onClick={handleActivate}
      onKeyDown={(event) => {
        if (event.key === ' ' || event.key === 'Enter') {
          event.preventDefault()
          handleActivate()
        }
      }}
    />
  )
}

const PrototypeRadioButton = styled.span.withConfig({
  shouldForwardProp: prop => String(prop) !== '$checked'
})<{ $checked: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  min-width: 14px;
  max-width: 14px;
  padding: 0;
  margin: 0;
  border-radius: 50%;
  border: 1px solid ${({ $checked }) => $checked ? '#3367F6' : '#7E8797'};
  background: #FFFFFF;
  box-sizing: border-box;
  cursor: pointer;
  user-select: none;

  &::after {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${({ $checked }) => $checked ? '#3367F6' : 'transparent'};
  }
`

const PrototypeRadio = ({
  checked,
  onClick
}: {
  checked: boolean,
  onClick: () => void
}): JSX.Element => (
  <PrototypeRadioButton
    className="table-prototype-radio"
    $checked={checked}
    role="radio"
    aria-checked={checked}
    onClick={onClick}
  />
)

const TextCell = styled(StaticCell)`
  gap: 8px;

  .slot {
    display: inline-flex;
    align-items: center;
    flex-shrink: 0;
  }

  .text {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`

const ActionsCell = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  width: 100%;
  min-width: 0 !important;

  .hexa-ui-button {
    flex-shrink: 0;
  }
`
