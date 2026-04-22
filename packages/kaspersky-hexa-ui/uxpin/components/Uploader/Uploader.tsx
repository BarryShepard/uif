import React from 'react'
import styled from 'styled-components'

import { Uploader as HexaUploader } from '@src/upload'
import { UploaderProps, UploadFile } from '@src/upload/types'

import { FrameFill } from '../../preview'
import { previewUploadCustomRequest } from '../../preview'
import {
  hasUXPinChildrenProp,
  resolveUXPinChildrenFromProps,
  resolveUXPinRuntimeProps
} from '../../uxpinRuntime'
import UploaderFile, { uploaderFileChildrenToUploadFiles } from '../UploaderFile/UploaderFile'

export type UXPinUploaderProps = Omit<UploaderProps, 'fileList'> & {
  /** Allows more than one file. */
  multiple?: boolean,
  /** Shows uploaded file examples. */
  uploaded?: boolean,
  /** Shows uploading file examples. */
  loading?: boolean,
  /** Lowercase alias for fullHeight. */
  fullheight?: boolean,
  /** Controlled file list. */
  fileList?: UploadFile[],
  /** Editable file children shown when uploaded/loading is enabled. */
  children?: React.ReactNode,
  codeComponentProps?: Partial<UXPinUploaderProps>,
  overriddenCodeProps?: Partial<UXPinUploaderProps>
}

const DEFAULT_UPLOADER_FILE_CHILDREN = (
  <>
    <UploaderFile name="report.pdf" sizeKb={240} status="uploaded" uid="preview-upload-1" />
    <UploaderFile name="screenshot.png" sizeKb={512} status="uploaded" uid="preview-upload-2" />
    <UploaderFile name="archive.zip" sizeKb={820} status="uploaded" uid="preview-upload-3" />
    <UploaderFile
      name="long-file-name-for-overflow-check.json"
      sizeKb={128}
      status="uploaded"
      uid="preview-upload-4"
    />
  </>
)

const UploaderFrame = styled.div<{ $fullHeight?: boolean }>`
  width: 100%;
  min-width: 0;
  height: ${({ $fullHeight }) => $fullHeight ? '100%' : 'fit-content'};

  .hexa-upload {
    min-width: 0;
  }

  .hexa-upload-drag-container,
  .hexa-upload-select-container {
    max-height: ${({ $fullHeight }) => $fullHeight ? '100%' : '360px'};
    min-height: 0;
    overflow-y: auto;
  }
`

const Uploader = (rawProps: UXPinUploaderProps): JSX.Element => {
  const explicitChildren = resolveUXPinChildrenFromProps(rawProps)
  const hasExplicitChildren = hasUXPinChildrenProp(rawProps)
  const {
    children = DEFAULT_UPLOADER_FILE_CHILDREN,
    codeComponentProps: _codeComponentProps,
    customRequest = previewUploadCustomRequest,
    description = 'Maximum 8 files, total size up to 320 KB',
    disabled = false,
    fileList,
    fullHeight,
    fullheight,
    loading = false,
    maxCount,
    maxTotalSize = 320,
    multiple = true,
    overriddenCodeProps: _overriddenCodeProps,
    size = 'medium',
    uploaded = false,
    ...props
  } = resolveUXPinRuntimeProps(rawProps)
  const resolvedFullHeight = fullHeight ?? fullheight ?? false
  const resolvedMaxCount = multiple ? maxCount ?? 8 : 1
  const childFiles = uploaderFileChildrenToUploadFiles(
    hasExplicitChildren ? explicitChildren : children,
    { loading }
  )
  const previewFiles = uploaded || loading
    ? childFiles.slice(0, resolvedMaxCount)
    : []

  return (
    <UploaderFrame $fullHeight={resolvedFullHeight}>
      <FrameFill style={{ height: resolvedFullHeight ? '100%' : 'fit-content' }}>
        <HexaUploader
          customRequest={customRequest}
          description={description}
          disabled={disabled}
          fileList={fileList ?? (previewFiles.length ? previewFiles : undefined)}
          fullHeight={resolvedFullHeight}
          maxCount={resolvedMaxCount}
          maxTotalSize={maxTotalSize}
          showProgress
          size={size}
          {...props}
        />
      </FrameFill>
    </UploaderFrame>
  )
}

Uploader.displayName = 'Uploader'

export default Uploader
