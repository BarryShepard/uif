import React from 'react'
import { create } from 'react-test-renderer'

let mockHexaTreeListProps: Record<string, unknown> | undefined

jest.mock('@src/tree', () => ({
  TreeList: (props: Record<string, unknown>) => {
    mockHexaTreeListProps = props

    return null
  }
}))

import TreeList from '../uxpin/components/TreeList/TreeList'
import {
  treeListChildrenToData
} from '../uxpin/components/TreeListItem/TreeListItem'

const treeListItemDescriptor = (
  presetElementId: string,
  overriddenCodeProps: Record<string, unknown> = {},
  id?: string
): React.ReactNode => ({
  ...(id ? { id } : {}),
  overriddenCodeProps,
  presetElementId,
  uxpinTargetElementType: 'CodeComponent'
} as unknown as React.ReactNode)

const runtimeTreeListItemDescriptor = (
  overriddenCodeProps: Record<string, unknown>,
  id?: string
): React.ReactNode => ({
  ...(id ? { id } : {}),
  overriddenCodeProps,
  uxpinTargetElementType: 'CodeComponent'
} as unknown as React.ReactNode)

describe('UXPin TreeList runtime children', () => {
  beforeEach(() => {
    mockHexaTreeListProps = undefined
  })

  it('restores nested preset children from shallow UXPin descriptors', () => {
    const built = treeListChildrenToData([
      treeListItemDescriptor('tree-list-item-1'),
      treeListItemDescriptor('tree-list-item-2')
    ])

    expect(built.nodes.map((node) => node.key)).toEqual(['workspace', 'shared'])
    expect(built.nodes[0].children?.map((node) => node.key)).toEqual([
      'devices',
      'policies'
    ])
    expect(built.nodes[0].children?.[1].children?.map((node) => node.key)).toEqual([
      'default-policy'
    ])
    expect(built.expandedKeys).toEqual(['workspace', 'policies'])
    expect(built.selectedKeys).toEqual(['workspace'])
  })

  it('does not restore preset children when UXPin explicitly clears them', () => {
    const built = treeListChildrenToData([
      treeListItemDescriptor('tree-list-item-1', { children: [] })
    ])

    expect(built.nodes[0].key).toBe('workspace')
    expect(built.nodes[0].children).toBeUndefined()
    expect(built.expandedKeys).toEqual([])
  })

  it('uses generated UXPin ids before preset default values for duplicated items', () => {
    const built = treeListChildrenToData([
      treeListItemDescriptor('tree-list-item-1'),
      treeListItemDescriptor('tree-list-item-1', {}, 'duplicated-tree-list-item')
    ])

    expect(built.nodes.map((node) => node.key)).toEqual([
      'workspace',
      'duplicated-tree-list-item'
    ])
    expect(built.nodes[1].children?.map((node) => node.key)).toEqual([
      'duplicated-tree-list-item-devices',
      'duplicated-tree-list-item-policies'
    ])
  })

  it('passes restored tree data and expanded keys through the TreeList wrapper', () => {
    create(
      <TreeList
        overriddenCodeProps={{
          children: [
            treeListItemDescriptor('tree-list-item-1'),
            treeListItemDescriptor('tree-list-item-2')
          ]
        }}
      />
    )

    expect(mockHexaTreeListProps?.treeData).toEqual([
      expect.objectContaining({
        key: 'workspace',
        children: [
          expect.objectContaining({ key: 'devices' }),
          expect.objectContaining({
            key: 'policies',
            children: [expect.objectContaining({ key: 'default-policy' })]
          })
        ]
      }),
      expect.objectContaining({ key: 'shared' })
    ])
    expect(mockHexaTreeListProps?.expandedKeys).toEqual(['workspace', 'policies'])
    expect(mockHexaTreeListProps?.checkedKeys).toEqual(['workspace'])
  })

  it('keeps non-preset runtime tree list items when only one node is selected', () => {
    const built = treeListChildrenToData([
      runtimeTreeListItemDescriptor({
        text: 'Workspace',
        value: 'workspace',
        selected: true,
        children: [
          runtimeTreeListItemDescriptor({
            text: 'Devices',
            value: 'devices'
          }),
          runtimeTreeListItemDescriptor({
            text: 'Policies',
            value: 'policies',
            children: [
              runtimeTreeListItemDescriptor({
                text: 'Default policy',
                value: 'default-policy'
              })
            ]
          })
        ]
      }),
      runtimeTreeListItemDescriptor({
        text: 'Shared',
        value: 'shared'
      })
    ])

    expect(built.nodes.map((node) => node.key)).toEqual(['workspace', 'shared'])
    expect(built.nodes[0].children?.map((node) => node.key)).toEqual([
      'devices',
      'policies'
    ])
    expect(built.nodes[0].children?.[1].children?.map((node) => node.key)).toEqual([
      'default-policy'
    ])
    expect(built.expandedKeys).toEqual(['workspace', 'policies'])
    expect(built.selectedKeys).toEqual(['workspace'])
  })

  it('hides all leading item icons when TreeList elementBefore is explicitly false', () => {
    create(<TreeList elementBefore={false} />)

    const treeData = mockHexaTreeListProps?.treeData as Array<{ title: React.ReactNode }>

    expect(treeData[0].title).toBe('Workspace')
    expect(treeData[1].title).toBe('Shared')
  })

  it('uses inferred preview keys when UXPin provides empty key arrays', () => {
    create(<TreeList expandedKeys={[]} checkedKeys={[]} />)

    expect(mockHexaTreeListProps?.expandedKeys).toEqual(['workspace', 'policies'])
    expect(mockHexaTreeListProps?.checkedKeys).toEqual(['workspace'])
  })

  it('does not pass Ant Tree virtual height unless virtual scrolling is explicitly enabled', () => {
    create(<TreeList height={24} />)

    expect(mockHexaTreeListProps?.height).toBeUndefined()
    expect(mockHexaTreeListProps?.virtual).toBe(false)

    create(<TreeList height={24} virtual />)

    expect(mockHexaTreeListProps?.height).toBe(24)
    expect(mockHexaTreeListProps?.virtual).toBe(true)
  })
})
