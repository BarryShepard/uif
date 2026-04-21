import React from 'react'
import styled from 'styled-components'

import { CodeViewer as HexaCodeViewer } from '@src/code-viewer'
import { CodeViewerProps } from '@src/code-viewer/types'

import { previewCode } from '../../preview'
import { resolveUXPinRuntimeProps } from '../../uxpinRuntime'

type CodeViewerPreviewProps = Omit<CodeViewerProps<Record<string, any>>, 'height'> & {
  /** Default editor height in pixels. */
  defaultHeight?: number,
  /** Current editor height in pixels. */
  height?: number,
  codeComponentProps?: Partial<CodeViewerPreviewProps>,
  overriddenCodeProps?: Partial<CodeViewerPreviewProps>
}

const CodeViewerFrame = styled.div`
  width: 100%;
  min-width: 0;

  .kl6-code-viewer,
  .react-resizable {
    width: 100% !important;
    max-width: 100%;
  }

  .cm-scroller {
    overflow: auto;
  }
`

const CodeViewer = (rawProps: CodeViewerPreviewProps): JSX.Element => {
  const {
    codeComponentProps: _codeComponentProps,
    defaultHeight = 240,
    height,
    initialValue = previewCode,
    language = 'javascript',
    overriddenCodeProps: _overriddenCodeProps,
    resizable = true,
    resizeAxis = 'y',
    ...props
  } = resolveUXPinRuntimeProps(rawProps)

  return (
    <CodeViewerFrame>
      <HexaCodeViewer
        height={height ?? defaultHeight}
        initialValue={initialValue}
        language={language}
        resizable={resizable}
        resizeAxis={resizeAxis}
        {...props}
      />
    </CodeViewerFrame>
  )
}

export default CodeViewer
