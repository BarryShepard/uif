import React from 'react'

import { SegmentedControl as HexaSegmentedControl } from '@src/segmented-control'
import { SegmentedControlProps } from '@src/segmented-control/types'

import {
  previewSegmentedControlContentData,
  previewSegmentedControlTabsData
} from '../../preview'
import { resolveUXPinRuntimeProps } from '../../uxpinRuntime'

type UXPinSegmentedControlItem = {
  disabled?: boolean,
  infoTooltip?: string,
  text?: string,
  name?: string,
  content?: string
}

export type UXPinSegmentedControlProps = {
  className?: string,
  defaultActiveTab?: string,
  size?: SegmentedControlProps['size'],
  tabsData?: UXPinSegmentedControlItem[],
  contentData?: Record<string, unknown>,
  codeComponentProps?: Partial<UXPinSegmentedControlProps>,
  overriddenCodeProps?: Partial<UXPinSegmentedControlProps>
}

const SegmentedControl = ({
  contentData,
  defaultActiveTab,
  tabsData,
  ...props
}: UXPinSegmentedControlProps): JSX.Element => {
  const resolved = resolveUXPinRuntimeProps({ contentData, defaultActiveTab, tabsData, ...props }) as UXPinSegmentedControlProps
  const {
    contentData: resolvedContentData,
    codeComponentProps: _codeComponentProps,
    defaultActiveTab: resolvedDefaultActiveTab,
    overriddenCodeProps: _overriddenCodeProps,
    tabsData: resolvedTabsData,
    ...resolvedProps
  } = resolved

  return (
    <HexaSegmentedControl
      contentData={(resolvedContentData ?? previewSegmentedControlContentData) as SegmentedControlProps['contentData']}
      defaultActiveTab={resolvedDefaultActiveTab ?? 'overview'}
      tabsData={(resolvedTabsData ?? previewSegmentedControlTabsData) as SegmentedControlProps['tabsData']}
      {...resolvedProps}
    />
  )
}

export default SegmentedControl
