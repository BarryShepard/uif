import React from 'react'

import type { UXPinRuntimeElementProps } from '../../uxpinRuntime'

type PageWrapperRailItemRole = 'MenuItem' | 'SubmenuItem'

type PageWrapperRailItemNode = UXPinRuntimeElementProps & {
  name: PageWrapperRailItemRole,
  id: string,
  uxpId: string,
  presetElementId: string,
  uxpinPresetElementId: string,
  uxpinTargetElementType: 'CodeComponent'
}

const createPageWrapperRailItemNode = (
  role: PageWrapperRailItemRole,
  elementId: string,
  itemProps: Record<string, unknown>
): PageWrapperRailItemNode => ({
  ...itemProps,
  name: role,
  id: elementId,
  uxpId: elementId,
  presetElementId: elementId,
  uxpinPresetElementId: elementId,
  uxpinTargetElementType: 'CodeComponent'
})

const pageWrapperMenuRailNodes: PageWrapperRailItemNode[] = [
  createPageWrapperRailItemNode('MenuItem', 'page-wrapper-menu-item-1', {
    label: 'Administration server',
    elementBefore: true,
    elementBeforeIcon: 'StorageServer',
    state: 'enabled'
  }),
  createPageWrapperRailItemNode('MenuItem', 'page-wrapper-menu-item-2', {
    label: 'Console navigation',
    elementBefore: true,
    elementBeforeIcon: 'Map',
    state: 'enabled'
  }),
  createPageWrapperRailItemNode('MenuItem', 'page-wrapper-menu-item-3', {
    label: 'Monitoring',
    elementBefore: true,
    elementBeforeIcon: 'EngineeringStation',
    state: 'enabled'
  })
]

const pageWrapperSubmenuRailNodes: PageWrapperRailItemNode[] = [
  createPageWrapperRailItemNode('SubmenuItem', 'page-wrapper-submenu-item-1', {
    variant: 'item',
    text: 'Overview',
    selected: true,
    iconBefore: true,
    iconBeforeSlot: 'Browser'
  }),
  createPageWrapperRailItemNode('SubmenuItem', 'page-wrapper-submenu-item-2', {
    variant: 'item',
    text: 'Assets',
    iconBefore: true,
    iconBeforeSlot: 'StorageServer'
  }),
  createPageWrapperRailItemNode('SubmenuItem', 'page-wrapper-submenu-item-3', {
    variant: 'item',
    text: 'Policies',
    iconBefore: true,
    iconBeforeSlot: 'Shield'
  })
]

export const pageWrapperMenuLayerChildren: React.ReactNode = (
  pageWrapperMenuRailNodes as unknown as React.ReactNode
)

export const pageWrapperSubmenuLayerChildren: React.ReactNode = (
  pageWrapperSubmenuRailNodes as unknown as React.ReactNode
)
