import React from 'react'
import styled from 'styled-components'

import { TreeList as HexaTreeList } from '@src/tree'
import { TreeListProps } from '@src/tree/types'

import {
  getUXPinPropSources,
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

const TreeListFrame = styled.div<{ $virtual?: boolean }>`
  width: 100%;
  height: fit-content;
  overflow: visible;

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
    color: var(--action_button--icon--ghost--enabled, #1d1d1b);
    opacity: 1;
    visibility: visible;
  }

  .ant-tree-switcher-icon svg {
    display: block;
    color: inherit;
    fill: currentColor;
  }

  .ant-tree-switcher-noop .ant-tree-switcher-icon {
    display: none !important;
  }

  ${({ $virtual }) => !$virtual && `
    .ant-tree,
    .ant-tree-list,
    .ant-tree-list-holder,
    .ant-tree-list-holder-inner {
      height: auto !important;
      max-height: none !important;
      overflow: visible !important;
    }
  `}
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

const normalizePreviewKeys = (
  keys: unknown
): string[] | undefined => (
  Array.isArray(keys) && keys.length > 0
    ? keys.map(String)
    : undefined
)

const hasExplicitElementBeforeProp = (
  rawProps: UXPinTreeListProps
): boolean => (
  getUXPinPropSources(rawProps).some((props) => Object.prototype.hasOwnProperty.call(props, 'elementBefore'))
)

const TreeList = (rawProps: UXPinTreeListProps): JSX.Element => {
  const elementBeforeExplicit = hasExplicitElementBeforeProp(rawProps)
  const {
    children = DEFAULT_TREE_LIST_CHILDREN,
    checkedKeys,
    codeComponentProps: _codeComponentProps,
    defaultCheckedKeys,
    defaultExpandedKeys,
    draggable = false,
    elementBefore = false,
    expandedKeys,
    height,
    onCheck,
    onExpand,
    overriddenCodeProps: _overriddenCodeProps,
    selectedKeys,
    virtual = false,
    variant = 'multiplechoice',
    ...props
  } = resolveUXPinRuntimeProps(rawProps)
  const rootRef = useAutoHeightMergeFrame()
  const resolvedChildren = resolveUXPinMergedChildrenFromProps(rawProps, DEFAULT_TREE_LIST_CHILDREN)
  const built = treeListChildrenToData(resolvedChildren, {
    elementBefore,
    elementBeforeExplicit,
    variant: mapItemVariant(variant)
  })
  const controlledExpandedKeys = normalizePreviewKeys(expandedKeys)
  const controlledCheckedKeys = normalizePreviewKeys(checkedKeys)
  const inferredExpandedKeys = (
    controlledExpandedKeys ??
    normalizePreviewKeys(defaultExpandedKeys) ??
    built.expandedKeys
  )
  const inferredCheckedKeys = (
    controlledCheckedKeys ??
    normalizePreviewKeys(defaultCheckedKeys) ??
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
    <TreeListFrame $virtual={virtual} ref={rootRef}>
      <HexaTreeList
        {...props}
        checkedKeys={controlledCheckedKeys ?? previewCheckedKeys}
        draggable={draggable}
        expandedKeys={controlledExpandedKeys ?? previewExpandedKeys}
        {...(virtual && height !== undefined ? { height } : {})}
        mode={mapTreeListVariant(variant)}
        onCheck={(nextCheckedKeys, event) => {
          const nextKeys = nextCheckedKeys.map(String)

          if (controlledCheckedKeys === undefined) {
            setPreviewCheckedKeys(nextKeys)
          }

          onCheck?.(nextKeys, event)
        }}
        onExpand={(nextExpandedKeys, info) => {
          const nextKeys = nextExpandedKeys.map(String)

          if (controlledExpandedKeys === undefined) {
            setPreviewExpandedKeys(nextKeys)
          }

          onExpand?.(nextKeys, info)
        }}
        selectedKeys={selectedKeys}
        treeData={built.nodes}
        virtual={virtual}
      />
    </TreeListFrame>
  )
}

TreeList.displayName = 'TreeList'

export default TreeList
