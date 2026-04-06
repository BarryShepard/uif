import { ArgTypes, Controls, Primary, Stories } from '@storybook/addon-docs/blocks'
import type { Of } from '@storybook/addon-docs/blocks'
import React from 'react'

export type MetaDocsBlocksProps = {
  apiOf?: Of,
  showPrimary?: boolean,
  showControls?: boolean,
  showStories?: boolean
}

export const MetaDocsBlocks = ({
  apiOf,
  showPrimary = true,
  showControls = true,
  showStories = true
}: MetaDocsBlocksProps): JSX.Element => (
  <>
    {showPrimary && <Primary />}
    {showControls && <Controls />}
    {apiOf && <ArgTypes of={apiOf} />}
    {showStories && <Stories includePrimary={false} />}
  </>
)
