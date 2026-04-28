import React from 'react'

import { HorizontalNav as HexaHorizontalNav } from '@src/horizontal-nav'
import { HorizontalNavProps } from '@src/horizontal-nav/types'

import { previewHorizontalNavItems } from '../../preview'
import { resolveUXPinRuntimeProps } from '../../uxpinRuntime'

type UXPinHorizontalNavItem = {
  key?: string,
  label?: string,
  selected?: boolean,
  disabled?: boolean
}

export type UXPinHorizontalNavProps = {
  activeKey?: string,
  className?: string,
  borderless?: boolean,
  items?: UXPinHorizontalNavItem[],
  codeComponentProps?: Partial<UXPinHorizontalNavProps>,
  overriddenCodeProps?: Partial<UXPinHorizontalNavProps>
}

const HorizontalNav = ({
  activeKey,
  items,
  ...props
}: UXPinHorizontalNavProps): JSX.Element => {
  const resolved = resolveUXPinRuntimeProps({ activeKey, items, ...props }) as UXPinHorizontalNavProps
  const {
    activeKey: resolvedActiveKey,
    codeComponentProps: _codeComponentProps,
    items: resolvedItems,
    overriddenCodeProps: _overriddenCodeProps,
    ...resolvedProps
  } = resolved

  return (
    <HexaHorizontalNav
      activeKey={resolvedActiveKey ?? 'overview'}
      items={(resolvedItems ?? previewHorizontalNavItems) as HorizontalNavProps['items']}
      {...resolvedProps}
    />
  )
}

export default HorizontalNav
