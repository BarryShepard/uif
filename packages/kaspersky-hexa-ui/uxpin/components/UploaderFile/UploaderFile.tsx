import React from 'react'

import { UploadFile } from '@src/upload/types'

import {
  getUXPinChildrenArray,
  getUXPinElementProps,
  getUXPinElementPropSources,
  resolveUXPinElementChildren,
  resolveUXPinRuntimeProps
} from '../../uxpinRuntime'
import { isUXPinHiddenElement } from '../../visibility'

export type UXPinUploaderFileStatus = 'uploaded' | 'uploading' | 'error'

export type UXPinUploaderFileProps = {
  /** File name. */
  name?: string,
  /** File size in KB. */
  sizeKb?: number,
  /** File state. */
  status?: UXPinUploaderFileStatus,
  /** Upload progress for uploading state. */
  progress?: number,
  /** Error message for error state. */
  errorText?: string,
  /** Stable file uid. */
  uid?: string,
  children?: React.ReactNode,
  codeComponentProps?: Partial<UXPinUploaderFileProps>,
  overriddenCodeProps?: Partial<UXPinUploaderFileProps>
}

type UploaderFileComponent = React.FC<UXPinUploaderFileProps> & {
  uxpinRole?: string,
  defaultProps?: Partial<UXPinUploaderFileProps>
}

const UPLOADER_FILE_ROLE = 'hexa-uxpin-uploader-file'

const hasUploaderFileShape = (props: Record<string, unknown> = {}): boolean => (
  'sizeKb' in props ||
  'progress' in props ||
  'errorText' in props ||
  (
    'name' in props &&
    'status' in props
  )
)

const getFirstStringProp = (
  node: React.ReactNode,
  propNames: string[]
): string | undefined => {
  for (const props of getUXPinElementPropSources(node)) {
    for (const propName of propNames) {
      const value = props[propName]

      if (typeof value === 'string' && value.length) {
        return value
      }
    }
  }

  return undefined
}

export const isUXPinUploaderFileElement = (
  node: React.ReactNode
): boolean => (
  Boolean(
    React.isValidElement(node) &&
    (
      (node.type as UploaderFileComponent)?.uxpinRole === UPLOADER_FILE_ROLE ||
      (node.type as { displayName?: string })?.displayName === 'UploaderFile' ||
      (node.type as { name?: string })?.name === 'UploaderFile'
    )
  ) ||
  getUXPinElementPropSources(node).some((props) => (
    hasUploaderFileShape(props) ||
    props.name === 'UploaderFile' ||
    (
      typeof props.uxpId === 'string' &&
      props.uxpId.toLowerCase().includes('uploader-file')
    ) ||
    (
      typeof props.presetElementId === 'string' &&
      props.presetElementId.toLowerCase().includes('uploader-file')
    ) ||
    (
      typeof props.uxpinPresetElementId === 'string' &&
      props.uxpinPresetElementId.toLowerCase().includes('uploader-file')
    )
  ))
)

const resolveUploaderFilePresetDefaults = (
  node: React.ReactNode
): Partial<UXPinUploaderFileProps> => {
  const id = getFirstStringProp(node, ['uxpId', 'presetElementId', 'uxpinPresetElementId'])?.toLowerCase()

  if (!id) {
    return {}
  }

  if (id.includes('uploader-file-1')) {
    return { name: 'report.pdf', sizeKb: 240, status: 'uploaded', uid: 'preview-upload-1' }
  }

  if (id.includes('uploader-file-2')) {
    return { name: 'screenshot.png', sizeKb: 512, status: 'uploaded', uid: 'preview-upload-2' }
  }

  if (id.includes('uploader-file-3')) {
    return { name: 'archive.zip', sizeKb: 820, status: 'uploaded', uid: 'preview-upload-3' }
  }

  if (id.includes('uploader-file-4')) {
    return {
      name: 'long-file-name-for-overflow-check.json',
      sizeKb: 128,
      status: 'uploaded',
      uid: 'preview-upload-4'
    }
  }

  return {}
}

export const resolveUploaderFileRuntimeProps = (
  rawProps: UXPinUploaderFileProps = {}
): UXPinUploaderFileProps => resolveUXPinRuntimeProps(rawProps, UploaderFile.defaultProps)

export const resolveUploaderFileNodeRuntimeProps = (
  node: React.ReactNode
): UXPinUploaderFileProps => (
  resolveUXPinRuntimeProps(
    (getUXPinElementProps(node) || {}) as UXPinUploaderFileProps,
    {
      ...UploaderFile.defaultProps,
      ...resolveUploaderFilePresetDefaults(node)
    }
  )
)

const getUploaderFileChildren = (
  children: React.ReactNode
): React.ReactNode[] => (
  getUXPinChildrenArray(children).flatMap((child) => {
    if (!child || isUXPinHiddenElement(child)) {
      return []
    }

    if (isUXPinUploaderFileElement(child)) {
      return [child]
    }

    const nestedChildren = resolveUXPinElementChildren(child)

    return nestedChildren ? getUploaderFileChildren(nestedChildren) : []
  })
)

const mapUploaderFileStatus = (
  status: UXPinUploaderFileStatus
): UploadFile['status'] => {
  switch (status) {
    case 'error':
      return 'error'
    case 'uploading':
      return 'uploading'
    case 'uploaded':
    default:
      return 'success'
  }
}

export const uploaderFileChildrenToUploadFiles = (
  children: React.ReactNode,
  options: {
    loading?: boolean
  } = {}
): UploadFile[] => (
  getUploaderFileChildren(children).map((child, index) => {
    const props = resolveUploaderFileNodeRuntimeProps(child)
    const id = getFirstStringProp(child, ['uid', 'id', 'uxpId', 'presetElementId', 'uxpinPresetElementId'])
    const status = options.loading && index === 0 ? 'uploading' : props.status ?? 'uploaded'
    const file: UploadFile = {
      name: props.name ?? `file-${index + 1}.txt`,
      size: (props.sizeKb ?? 128) * 1024,
      status: mapUploaderFileStatus(status),
      uid: props.uid ?? id ?? `preview-upload-${index + 1}`
    }

    if (file.status === 'uploading') {
      file.percent = props.progress ?? 45
    }

    if (file.status === 'error') {
      file.error = props.errorText ?? 'Upload failed'
    }

    return file
  })
)

const UploaderFile: UploaderFileComponent = (_props: UXPinUploaderFileProps): JSX.Element => (
  null as unknown as JSX.Element
)

UploaderFile.uxpinRole = UPLOADER_FILE_ROLE
UploaderFile.displayName = 'UploaderFile'
UploaderFile.defaultProps = {
  name: 'report.pdf',
  sizeKb: 240,
  status: 'uploaded',
  progress: 45,
  errorText: 'Upload failed'
}

export default UploaderFile
