import React from 'react'
import styled from 'styled-components'

import { TreeList as HexaTreeList } from '@src/tree'
import { TreeListProps } from '@src/tree/types'

import {
  resolveUXPinMergedChildrenFromProps,
  resolveUXPinRuntimeProps
} from '../../uxpinRuntime'
import { useAutoHeightMergeFrame } from '../../useAutoHeightMergeFrame'
import TreeListItem, {
  treeListChildrenToData,
  UXPinTreeListItemVariant
} from '../TreeListItem/TreeListItem'

export type UXPinTreeListVariant = 'readonly' | 'multiplechoice' | 'singlechoice'

export type UXPinTreeListProps = Omit<TreeListProps, 'draggable' | 'mode' | 'treeData'> & {
  /** Tree selection behavior. */
  variant?: UXPinTreeListVariant,
  /** Enables drag handles. */
  draggable?: boolean,
  /** Shows leading icon for items unless item overrides it. */
  elementBefore?: boolean,
  /** Editable TreeListItem children. */
  children?: React.ReactNode,
  codeComponentProps?: Partial<UXPinTreeListProps>,
  overriddenCodeProps?: Partial<UXPinTreeListProps>
}

const DEFAULT_TREE_LIST_CHILDREN = (
  <>
    <TreeListItem uxpId="tree-list-item-1" text="Workspace" value="workspace" elementBefore selected>
      <TreeListItem uxpId="tree-list-item-1-1" text="Devices" value="devices" />
      <TreeListItem uxpId="tree-list-item-1-2" text="Policies" value="policies">
        <TreeListItem uxpId="tree-list-item-1-2-1" text="Default policy" value="default-policy" />
      </TreeListItem>
    </TreeListItem>
    <TreeListItem uxpId="tree-list-item-2" text="Shared" value="shared" />
  </>
)

const TreeListFrame = styled.div`
  width: 100%;
  height: fit-content;

  .ant-tree-switcher {
    display: inline-flex !important;
    align-items: center;
    justify-content: center;
    flex: 0 0 22px;
    width: 22px !important;
    min-width: 22px;
    opacity: 1;
    visibility: visible;
  }

  .ant-tree-switcher-icon {
    display: inline-flex !important;
    align-items: center;
    justify-content: center;
    opacity: 1;
    visibility: visible;
  }

  .ant-tree-switcher-noop .ant-tree-switcher-icon {
    display: none !important;
  }
`

const mapTreeListVariant = (
  variant?: UXPinTreeListVariant
): TreeListProps['mode'] => {
  switch (variant) {
    case 'multiplechoice':
      return 'multipleChoice'
    case 'singlechoice':
      return 'singleChoice'
    case 'readonly':
    default:
      return 'readOnly'
  }
}

const mapItemVariant = (
  variant?: UXPinTreeListVariant
): UXPinTreeListItemVariant => {
  switch (variant) {
    case 'singlechoice':
      return 'singlechoice'
    case 'readonly':
      return 'readonly'
    case 'multiplechoice':
    default:
      return 'multiplechoice'
  }
}

const TreeList = (rawProps: UXPinTreeListProps): JSX.Element => {
  const {
    children = DEFAULT_TREE_LIST_CHILDREN,
    checkedKeys,
    codeComponentProps: _codeComponentProps,
    defaultCheckedKeys,
    defaultExpandedKeys,
    draggable = false,
    elementBefore = false,
    expandedKeys,
    onCheck,
    onExpand,
    overriddenCodeProps: _overriddenCodeProps,
    selectedKeys,
    variant = 'multiplechoice',
    ...props
  } = resolveUXPinRuntimeProps(rawProps)
  const rootRef = useAutoHeightMergeFrame()
  const resolvedChildren = resolveUXPinMergedChildrenFromProps(rawProps, DEFAULT_TREE_LIST_CHILDREN)
  const built = treeListChildrenToData(resolvedChildren, {
    elementBefore,
    variant: mapItemVariant(variant)
  })
  const inferredExpandedKeys = (
    expandedKeys ??
    defaultExpandedKeys?.map(String) ??
    built.expandedKeys
  )
  const inferredCheckedKeys = (
    checkedKeys ??
    defaultCheckedKeys?.map(String) ??
    built.selectedKeys
  )
  const [previewExpandedKeys, setPreviewExpandedKeys] = React.useState<string[]>(inferredExpandedKeys)
  const [previewCheckedKeys, setPreviewCheckedKeys] = React.useState<string[]>(inferredCheckedKeys)
  const expandedKeysSignature = inferredExpandedKeys.join('|')
  const checkedKeysSignature = inferredCheckedKeys.join('|')

  React.useEffect(() => {
    setPreviewExpandedKeys(inferredExpandedKeys)
  }, [expandedKeysSignature])

  React.useEffect(() => {
    setPreviewCheckedKeys(inferredCheckedKeys)
  }, [checkedKeysSignature])

  return (
    <TreeListFrame ref={rootRef}>
      <HexaTreeList
        {...props}
        checkedKeys={checkedKeys ?? previewCheckedKeys}
        draggable={draggable}
        expandedKeys={expandedKeys ?? previewExpandedKeys}
        mode={mapTreeListVariant(variant)}
        onCheck={(nextCheckedKeys, event) => {
          const nextKeys = nextCheckedKeys.map(String)

          if (checkedKeys === undefined) {
            setPreviewCheckedKeys(nextKeys)
          }

          onCheck?.(nextKeys, event)
        }}
        onExpand={(nextExpandedKeys, info) => {
          const nextKeys = nextExpandedKeys.map(String)

          if (expandedKeys === undefined) {
            setPreviewExpandedKeys(nextKeys)
          }

          onExpand?.(nextKeys, info)
        }}
        selectedKeys={selectedKeys}
        treeData={built.nodes}
      />
    </TreeListFrame>
  )
}

TreeList.displayName = 'TreeList'

export default TreeList
