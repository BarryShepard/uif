import React from 'react'

import { AnchorNavigation as HexaAnchorNavigation } from '@src/anchor-navigation'
import { AnchorNavigationProps } from '@src/anchor-navigation/types'

import {
  PreviewSurface,
  previewAnchorItems,
  previewLongText
} from '../../preview'
import { resolveUXPinRuntimeProps } from '../../uxpinRuntime'

type UXPinAnchorItem = {
  id: string,
  label: string,
  children?: UXPinAnchorItem[]
}

export type UXPinAnchorNavigationProps = {
  title?: string,
  className?: string,
  children?: React.ReactNode,
  items?: UXPinAnchorItem[],
  codeComponentProps?: Partial<UXPinAnchorNavigationProps>,
  overriddenCodeProps?: Partial<UXPinAnchorNavigationProps>
}

const AnchorNavigation = ({
  children,
  items,
  ...props
}: UXPinAnchorNavigationProps): JSX.Element => {
  const resolved = resolveUXPinRuntimeProps({
    children,
    items,
    ...props
  }) as UXPinAnchorNavigationProps
  const {
    codeComponentProps: _codeComponentProps,
    items: resolvedItems,
    overriddenCodeProps: _overriddenCodeProps,
    children: resolvedChildren,
    ...resolvedProps
  } = resolved

  return (
    <PreviewSurface minHeight={320}>
      <HexaAnchorNavigation items={(resolvedItems ?? previewAnchorItems) as AnchorNavigationProps['items']} {...resolvedProps}>
        {resolvedChildren ?? (
          <div>
            <section id="overview" style={{ marginBottom: 24 }}>
              <h3>Overview</h3>
              <p>{previewLongText}</p>
            </section>
            <section id="details" style={{ marginBottom: 24 }}>
              <h3>Details</h3>
              <p>{previewLongText}</p>
            </section>
            <section id="notes">
              <h3>Notes</h3>
              <p>{previewLongText}</p>
            </section>
          </div>
        )}
      </HexaAnchorNavigation>
    </PreviewSurface>
  )
}

export default AnchorNavigation
