import { ActionButton } from '@src/action-button'
import { Checkbox } from '@src/checkbox'
import { Textbox } from '@src/input'
import { Link } from '@src/link'
import { Radio } from '@src/radio'
import { Select } from '@src/select'
import { Status } from '@src/status'
import { Table } from '@src/table'
import { TableColumn } from '@src/table/types'
import { TagReductionGroup } from '@src/tag'
import { Toggle } from '@src/toggle'
import React, { CSSProperties, ReactNode, useMemo } from 'react'
import styled from 'styled-components'

import {
  ArrowDown1,
  ArrowRightMini,
  ArrowUp1,
  ArrowUpAndDown,
  Filter,
  FilterActive,
  Help,
  Placeholder,
  Search,
  SettingsGear
} from '@kaspersky/hexa-ui-icons/16'

const noop = (): void => undefined

export type TablePrototypeSize = 'standard' | 'compact'
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

export type TablePrototypeColumnConfig = {
  key?: string,
  width?: number,
  headerText?: string,
  headerVariant?: TablePrototypeHeaderVariant,
  headerState?: TablePrototypeHeaderState,
  sort?: TablePrototypeSortState,
  filter?: TablePrototypeFilterState,
  buttonInfo?: boolean,
  cellVariant?: TablePrototypeCellVariant,
  elementBefore?: boolean,
  elementBeforeSlot?: ReactNode,
  text?: string,
  elementAfter?: boolean,
  elementAfterSlot?: ReactNode
}

export type TablePrototypeProps = {
  columns?: TablePrototypeColumnConfig[],
  rows?: number,
  size?: TablePrototypeSize,
  style?: CSSProperties
}

const SELECT_OPTIONS = [
  { label: 'Option 1', value: 'option-1' },
  { label: 'Option 2', value: 'option-2' },
  { label: 'Option 3', value: 'option-3' }
]

export const defaultTablePrototypeColumns: TablePrototypeColumnConfig[] = [
  {
    key: 'asset',
    width: 220,
    headerText: 'Asset',
    headerVariant: 'text+filters+sort',
    sort: 'ascending',
    filter: 'applied',
    cellVariant: 'treeLink',
    elementBefore: true,
    text: 'Workstation'
  },
  {
    key: 'status',
    width: 180,
    headerText: 'Status',
    headerVariant: 'text',
    cellVariant: 'status',
    text: 'Protected'
  },
  {
    key: 'owner',
    width: 200,
    headerText: 'Owner',
    headerVariant: 'text+filters+sort',
    sort: 'notApplied',
    filter: 'notApplied',
    buttonInfo: true,
    cellVariant: 'text',
    elementBefore: true,
    text: 'Operator'
  },
  {
    key: 'controls',
    width: 160,
    headerText: 'Controls',
    headerVariant: 'text',
    cellVariant: 'actions',
    text: 'Actions'
  }
]

export const TablePrototype = ({
  columns = defaultTablePrototypeColumns,
  rows = 5,
  size = 'standard',
  style
}: TablePrototypeProps): JSX.Element => {
  const sanitizedColumns = columns.length ? columns : defaultTablePrototypeColumns
  const normalizedColumns = useMemo(
    () => sanitizedColumns.map((column, index) => normalizePrototypeColumn(column, index)),
    [sanitizedColumns]
  )
  const rowCount = Math.max(1, Math.min(rows, 12))
  const dataSource = useMemo(
    () => Array.from({ length: rowCount }, (_, index) => ({ key: `row-${index + 1}` })),
    [rowCount]
  )
  const previewColumns = useMemo<TableColumn[]>(() => (
    normalizedColumns.map((column, index) => ({
      key: column.key,
      dataIndex: column.key,
      title: <TablePrototypeHeader column={column} />,
      width: column.width,
      render: (_value, _record, rowIndex) => (
        <TablePrototypeCell column={column} rowIndex={rowIndex} />
      ),
      columnId: `prototype-column-${index}`
    }))
  ), [normalizedColumns])
  const minWidth = normalizedColumns.reduce((sum, column) => sum + column.width, 0)

  return (
    <PreviewRoot style={{ minWidth, ...style }}>
      <Table
        columns={previewColumns}
        dataSource={dataSource}
        pagination={false}
        resizingMode="scroll"
        rowMode={size}
        scroll={{ x: minWidth }}
        showHeader={true}
      />
    </PreviewRoot>
  )
}

type NormalizedColumn = Required<
  Pick<
    TablePrototypeColumnConfig,
    'buttonInfo' |
    'cellVariant' |
    'elementAfter' |
    'elementBefore' |
    'filter' |
    'headerState' |
    'headerText' |
    'headerVariant' |
    'key' |
    'sort' |
    'text' |
    'width'
  >
> &
Pick<TablePrototypeColumnConfig, 'elementAfterSlot' | 'elementBeforeSlot'>

const normalizePrototypeColumn = (
  column: TablePrototypeColumnConfig,
  index: number
): NormalizedColumn => {
  const cellVariant = column.cellVariant ?? 'text'

  return {
    buttonInfo: column.buttonInfo ?? false,
    cellVariant,
    elementAfter: column.elementAfter ?? false,
    elementAfterSlot: column.elementAfterSlot,
    elementBefore: column.elementBefore ?? false,
    elementBeforeSlot: column.elementBeforeSlot,
    filter: column.filter ?? 'notApplied',
    headerState: column.headerState ?? 'enabled',
    headerText: column.headerText ?? `Column ${index + 1}`,
    headerVariant: column.headerVariant ?? 'text',
    key: column.key ?? `column-${index + 1}`,
    sort: column.sort ?? 'notApplied',
    text: column.text ?? resolveDefaultText(cellVariant),
    width: column.width ?? resolveDefaultColumnWidth(cellVariant)
  }
}

const resolveDefaultText = (cellVariant: TablePrototypeCellVariant): string => {
  switch (cellVariant) {
    case 'status':
      return 'Protected'
    case 'link':
    case 'treeLink':
      return 'Open details'
    case 'input-select':
    case 'input-multiselect':
      return 'Assigned'
    case 'actions':
      return 'Actions'
    default:
      return 'Value'
  }
}

const resolveDefaultColumnWidth = (cellVariant: TablePrototypeCellVariant): number => {
  switch (cellVariant) {
    case 'checkbox':
    case 'radio':
    case 'icon':
      return 88
    case 'actions':
      return 144
    case 'toggle':
      return 124
    case 'status':
      return 160
    case 'tag-group':
      return 240
    case 'input-text':
    case 'input-select':
    case 'input-multiselect':
      return 200
    default:
      return 180
  }
}

const resolveRowText = (
  text: string,
  rowIndex: number,
  cellVariant: TablePrototypeCellVariant
): string => {
  switch (cellVariant) {
    case 'checkbox':
    case 'radio':
    case 'toggle':
    case 'actions':
      return text
    default:
      return `${text} ${rowIndex + 1}`
  }
}

const resolveSlotContent = (
  enabled: boolean,
  slot?: ReactNode
): ReactNode => {
  if (!enabled) {
    return null
  }

  return slot ?? <Placeholder />
}

const resolveSortIcon = (sort: TablePrototypeSortState): ReactNode => {
  switch (sort) {
    case 'ascending':
      return <ArrowUp1 />
    case 'descending':
      return <ArrowDown1 />
    default:
      return <ArrowUpAndDown />
  }
}

const resolveFilterIcon = (filter: TablePrototypeFilterState): ReactNode => (
  filter === 'applied' ? <FilterActive /> : <Filter />
)

const TablePrototypeHeader = ({
  column
}: {
  column: NormalizedColumn
}): JSX.Element => {
  if (column.headerVariant === 'empty') {
    return <HeaderContainer $state={column.headerState} />
  }

  if (column.headerVariant === 'checkbox') {
    return (
      <HeaderContainer $state={column.headerState}>
        <Checkbox checked={column.headerState === 'active'} disabled={column.headerState === 'disabled'} />
      </HeaderContainer>
    )
  }

  return (
    <HeaderContainer $state={column.headerState}>
      <span className="header-text">{column.headerText}</span>
      {column.headerVariant === 'text+filters+sort' && (
        <span className="header-icons">
          {resolveSortIcon(column.sort)}
          {resolveFilterIcon(column.filter)}
        </span>
      )}
      {column.buttonInfo && (
        <span className="header-icons">
          <Help />
        </span>
      )}
    </HeaderContainer>
  )
}

const TablePrototypeCell = ({
  column,
  rowIndex
}: {
  column: NormalizedColumn,
  rowIndex: number
}): JSX.Element => {
  const text = resolveRowText(column.text, rowIndex, column.cellVariant)
  const elementBefore = resolveSlotContent(column.elementBefore, column.elementBeforeSlot)
  const elementAfter = resolveSlotContent(column.elementAfter, column.elementAfterSlot)
  const checkboxChecked = rowIndex % 2 === 0
  const radioChecked = rowIndex === 0
  const toggleChecked = rowIndex % 2 === 0
  const treeDepth = rowIndex % 3

  switch (column.cellVariant) {
    case 'checkbox':
      return <StaticCell><Checkbox checked={checkboxChecked} /></StaticCell>
    case 'radio':
      return (
        <StaticCell>
          <Radio
            options={[{ label: '', value: 'selected' }]}
            value={radioChecked ? 'selected' : undefined}
          />
        </StaticCell>
      )
    case 'icon':
      return <StaticCell>{elementBefore ?? <Placeholder />}</StaticCell>
    case 'status':
      return (
        <StaticCell>
          <Status mode={rowIndex % 2 === 0 ? 'positive' : 'critical'} label={text} />
        </StaticCell>
      )
    case 'link':
      return (
        <StaticCell>
          <Link href="#" text={text} />
        </StaticCell>
      )
    case 'tag-group':
      return (
        <StaticCell>
          <TagReductionGroup
            items={[
              { label: text },
              { label: `${text} B` },
              { label: `${text} C` }
            ]}
          />
        </StaticCell>
      )
    case 'toggle':
      return (
        <StaticCell>
          <Toggle checked={toggleChecked} text={toggleChecked ? 'On' : 'Off'} />
        </StaticCell>
      )
    case 'actions':
      return (
        <ActionsCell>
          <ActionButton mode="ghost" icon={<Search />} onClick={noop} />
          <ActionButton mode="ghost" icon={<SettingsGear />} onClick={noop} />
          <ActionButton mode="ghost" icon={<Placeholder />} onClick={noop} />
        </ActionsCell>
      )
    case 'tree':
      return (
        <TreeCell $depth={treeDepth}>
          <ArrowRightMini />
          <span>{text}</span>
        </TreeCell>
      )
    case 'treeLink':
      return (
        <TreeCell $depth={treeDepth}>
          <ArrowRightMini />
          <Link href="#" text={text} />
        </TreeCell>
      )
    case 'input-text':
      return (
        <StaticCell>
          <Textbox value={text} onChange={noop} />
        </StaticCell>
      )
    case 'input-select':
      return (
        <StaticCell>
          <Select
            defaultValue={SELECT_OPTIONS[0].value}
            options={SELECT_OPTIONS}
            style={{ width: '100%' }}
          />
        </StaticCell>
      )
    case 'input-multiselect':
      return (
        <StaticCell>
          <Select
            defaultValue={[SELECT_OPTIONS[0].value, SELECT_OPTIONS[1].value]}
            mode="multiple"
            options={SELECT_OPTIONS}
            style={{ width: '100%' }}
          />
        </StaticCell>
      )
    case 'text':
    default:
      return (
        <TextCell>
          {elementBefore && <span className="slot">{elementBefore}</span>}
          <span className="text">{text}</span>
          {elementAfter && <span className="slot">{elementAfter}</span>}
        </TextCell>
      )
  }
}

const PreviewRoot = styled.div`
  width: 100%;
  min-width: 0;

  .table-horizontal-scrollbar {
    display: none;
  }
`

const HeaderContainer = styled.div<{ $state: TablePrototypeHeaderState }>`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  min-height: 20px;
  color: inherit;
  opacity: ${({ $state }) => ($state === 'disabled' ? 0.48 : 1)};

  ${({ $state }) => $state === 'hover' && `
    background: rgba(0, 0, 0, 0.04);
    border-radius: 6px;
  `}

  ${({ $state }) => $state === 'active' && `
    background: rgba(0, 0, 0, 0.08);
    border-radius: 6px;
  `}

  .header-text {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .header-icons {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    flex-shrink: 0;
  }
`

const StaticCell = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 20px;

  .ant-select,
  .hexa-ui-toggle {
    width: 100%;
  }
`

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

const ActionsCell = styled(StaticCell)`
  justify-content: flex-end;
  gap: 4px;
`

const TreeCell = styled(StaticCell)<{ $depth: number }>`
  gap: 8px;
  padding-left: ${({ $depth }) => $depth * 16}px;

  > svg {
    flex-shrink: 0;
  }
`
