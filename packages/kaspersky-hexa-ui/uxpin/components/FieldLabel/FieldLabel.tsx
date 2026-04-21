import React from 'react'
import styled from 'styled-components'

import { FormLabel as HexaFormLabel } from '@src/form-label'
import { FormLabelProps } from '@src/form-label/types'
import { TagProps } from '@src/tag/types'

import {
  getUXPinChildrenArray,
  getUXPinPropSources,
  hasUXPinChildrenProp,
  resolveUXPinChildrenFromProps,
  resolveUXPinRuntimeProps
} from '../../uxpinRuntime'
import { isUXPinHiddenElement } from '../ToolbarButton/ToolbarButton'
import Tag from '../Tag/Tag'

export type UXPinFieldLabelProps = Omit<FormLabelProps, 'children' | 'tooltip' | 'tagsAfter'> & {
  /** Label text. */
  text?: string,
  /** Shows the info button near the label. */
  buttonInfo?: boolean,
  /** Info popover text. */
  buttonInfoText?: string,
  /** Shows editable tags after the label. */
  tagsAfter?: boolean,
  /** Editable tag children. */
  children?: React.ReactNode,
  /** Readonly state inherited from Field. */
  readonly?: boolean,
  codeComponentProps?: Partial<UXPinFieldLabelProps>,
  overriddenCodeProps?: Partial<UXPinFieldLabelProps>
}

type FieldLabelComponent = React.FC<UXPinFieldLabelProps> & {
  uxpinRole?: string,
  defaultProps?: Partial<UXPinFieldLabelProps>
}

const FIELD_LABEL_ROLE = 'hexa-uxpin-field-label'

const DEFAULT_FIELD_LABEL_TAGS = (
  <>
    <Tag label="Tag 1" />
    <Tag label="Tag 2" />
  </>
)

const FieldLabelRoot = styled.span`
  display: inline-flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  min-width: 0;

  .hexa-uxpin-field-label-tags {
    display: inline-flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 4px;
    min-width: 0;
  }
`

const hasFieldLabelShape = (props: Record<string, unknown> = {}): boolean => (
  'buttonInfo' in props ||
  'buttonInfoText' in props ||
  'tagsAfter' in props ||
  (
    'text' in props &&
    'required' in props
  )
)

export const isUXPinFieldLabelElement = (
  node: React.ReactNode
): node is React.ReactElement<UXPinFieldLabelProps> => (
  React.isValidElement(node) &&
  (
    (node.type as FieldLabelComponent)?.uxpinRole === FIELD_LABEL_ROLE ||
    (node.type as { displayName?: string })?.displayName === 'FieldLabel' ||
    (node.type as { name?: string })?.name === 'FieldLabel' ||
    getUXPinPropSources(node.props).some(hasFieldLabelShape)
  )
)

const applyTagState = (
  child: React.ReactNode,
  disabled?: boolean,
  readonly?: boolean
): React.ReactNode => {
  if (!React.isValidElement<TagProps>(child)) {
    return child
  }

  return React.cloneElement(child, {
    disabled: child.props.disabled ?? disabled,
    readOnly: child.props.readOnly ?? readonly
  })
}

const FieldLabel: FieldLabelComponent = (rawProps: UXPinFieldLabelProps): JSX.Element => {
  const runtimeProps = resolveUXPinRuntimeProps(rawProps, FieldLabel.defaultProps)
  const {
    buttonInfo,
    buttonInfoText,
    children,
    codeComponentProps: _codeComponentProps,
    disabled = false,
    overriddenCodeProps: _overriddenCodeProps,
    readonly = false,
    tagsAfter = true,
    text = 'Label',
    ...props
  } = runtimeProps
  const explicitChildren = resolveUXPinChildrenFromProps(rawProps)
  const tagChildrenSource = hasUXPinChildrenProp(rawProps) ? explicitChildren : children ?? DEFAULT_FIELD_LABEL_TAGS
  const tagChildren = getUXPinChildrenArray(tagChildrenSource)
    .filter((child) => !isUXPinHiddenElement(child))
    .map((child) => applyTagState(child, disabled, readonly))

  return (
    <FieldLabelRoot>
      <HexaFormLabel
        disabled={disabled || readonly}
        tooltip={buttonInfo ? buttonInfoText : undefined}
        {...props}
      >
        {text}
      </HexaFormLabel>
      {tagsAfter && tagChildren.length > 0 && (
        <span className="hexa-uxpin-field-label-tags">
          {tagChildren}
        </span>
      )}
    </FieldLabelRoot>
  )
}

FieldLabel.uxpinRole = FIELD_LABEL_ROLE
FieldLabel.displayName = 'FieldLabel'
FieldLabel.defaultProps = {
  text: 'Label',
  required: false,
  disabled: false,
  readonly: false,
  buttonInfo: false,
  buttonInfoText: 'Additional information',
  tagsAfter: true
}

export default FieldLabel
