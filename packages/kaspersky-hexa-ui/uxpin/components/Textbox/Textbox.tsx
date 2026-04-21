import React from 'react'
import styled from 'styled-components'

import { Textbox as HexaTextbox } from '@src/input'
import { TextboxProps } from '@src/input/types'

import { mergeFrameStyle } from '../../preview'
import { resolveUXPinRuntimeProps } from '../../uxpinRuntime'

export type UXPinTextboxVariant = 'number' | 'password' | 'text' | 'textarea'

export type UXPinTextboxProps = Omit<TextboxProps, 'placeholder'> & {
  /** Input variant. */
  variant?: UXPinTextboxVariant,
  /** Shows placeholder text. */
  placeholder?: boolean,
  /** Placeholder content. */
  placeholderText?: string,
  /** Input value. */
  text?: string,
  /** Shows textarea character counter. */
  counter?: boolean,
  /** Default textarea height in pixels. */
  defaultHeight?: number,
  /** Readonly state alias used by Field. */
  readonly?: boolean,
  codeComponentProps?: Partial<UXPinTextboxProps>,
  overriddenCodeProps?: Partial<UXPinTextboxProps>
}

const TextareaFrame = styled.div<{ defaultHeight?: number }>`
  width: 100%;
  min-width: 0;

  textarea {
    min-height: ${({ defaultHeight = 104 }) => defaultHeight}px;
    resize: vertical;
  }
`

const Textbox = (rawProps: UXPinTextboxProps): JSX.Element => {
  const {
    codeComponentProps: _codeComponentProps,
    counter = false,
    defaultHeight = 104,
    overriddenCodeProps: _overriddenCodeProps,
    placeholder = true,
    placeholderText = 'Input value',
    readonly,
    style,
    text,
    variant = 'text',
    ...props
  } = resolveUXPinRuntimeProps(rawProps)
  const resolvedPlaceholder = placeholder ? placeholderText : undefined
  const resolvedStyle = mergeFrameStyle(style)
  const inputProps = props as any

  if (variant === 'number') {
    return (
      <HexaTextbox.Number
        {...inputProps}
        placeholder={resolvedPlaceholder}
        readOnly={readonly ?? props.readOnly}
        style={resolvedStyle}
        value={text}
      />
    )
  }

  if (variant === 'password') {
    return (
      <HexaTextbox.Password
        {...inputProps}
        placeholder={resolvedPlaceholder}
        readOnly={readonly ?? props.readOnly}
        style={resolvedStyle}
        value={text}
      />
    )
  }

  if (variant === 'textarea') {
    return (
      <TextareaFrame defaultHeight={defaultHeight}>
        <HexaTextbox.Textarea
          {...inputProps}
          maxLength={500}
          placeholder={resolvedPlaceholder}
          readOnly={readonly ?? props.readOnly}
          showCount={counter}
          style={resolvedStyle}
          value={text}
        />
      </TextareaFrame>
    )
  }

  return (
    <HexaTextbox
      {...inputProps}
      placeholder={resolvedPlaceholder}
      readOnly={readonly ?? props.readOnly}
      style={resolvedStyle}
      value={text}
    />
  )
}

export default Textbox
