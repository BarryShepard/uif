import React from 'react'
import { IMaskInputProps } from 'react-imask'
import styled from 'styled-components'

import { Textbox as HexaTextbox } from '@src/input'
import {
  TextboxMaskedProps,
  TextboxNumberProps,
  TextboxProps,
  TextboxTextareaProps
} from '@src/input/types'

import { mergeFrameStyle } from '../../preview'
import { resolveUXPinRuntimeProps } from '../../uxpinRuntime'

export type UXPinTextboxVariant = 'masked' | 'number' | 'password' | 'text' | 'textarea'
export type UXPinTextboxAllowedCharset = 'any' | 'cyrillic' | 'digits' | 'hex' | 'latin'
export type UXPinTextboxMaskPreset = 'custom' | 'date' | 'email' | 'ip' | 'mac' | 'none' | 'phone'

export type UXPinTextboxProps = Omit<TextboxProps, 'defaultValue' | 'onChange' | 'placeholder' | 'value'> & Pick<
TextboxNumberProps,
  'allowEmpty' | 'controls' | 'integerOnly' | 'max' | 'min'
> & Pick<
TextboxTextareaProps,
  'maxLength'
> & {
  /** Input variant. */
  variant?: UXPinTextboxVariant,
  /** Shows placeholder text. */
  placeholder?: boolean,
  /** Placeholder content. */
  placeholderText?: string,
  /** Input value. */
  text?: string,
  /** Initial input value when the field is uncontrolled. */
  defaultText?: string,
  /** Shows textarea character counter. */
  counter?: boolean,
  /** Default textarea height in pixels. */
  defaultHeight?: number,
  /** Readonly state alias used by Field. */
  readonly?: boolean,
  /** Restricts typed characters for text-like variants. */
  allowedCharset?: UXPinTextboxAllowedCharset,
  /** Predefined mask preset for the masked variant. */
  maskPreset?: UXPinTextboxMaskPreset,
  /** Custom mask pattern used when maskPreset is custom. */
  maskPattern?: string,
  /** Raw IMask options override for advanced cases. */
  maskOptions?: TextboxMaskedProps['maskOptions'],
  /** Maximum characters for text-like variants. */
  maxLength?: number,
  /** Minimum numeric value for number variant. */
  min?: TextboxNumberProps['min'],
  /** Maximum numeric value for number variant. */
  max?: TextboxNumberProps['max'],
  /** Limits number input to integers. */
  integerOnly?: boolean,
  /** Allows empty numeric value. */
  allowEmpty?: boolean,
  /** Value change handler. */
  onChange?: (...args: any[]) => void,
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

const TEXTBOX_ALLOWED_CHARSET_PATTERNS: Record<
Exclude<UXPinTextboxAllowedCharset, 'any'>,
RegExp
> = {
  cyrillic: /[\u0400-\u04FFЁё\s]/,
  digits: /[0-9]/,
  hex: /[0-9a-fA-F]/,
  latin: /[A-Za-z\s]/
}

const getMaskOptions = (
  maskPreset: UXPinTextboxMaskPreset,
  maskPattern: string | undefined,
  rawMaskOptions: TextboxMaskedProps['maskOptions']
): TextboxMaskedProps['maskOptions'] => {
  if (rawMaskOptions) {
    return rawMaskOptions
  }

  switch (maskPreset) {
    case 'custom':
      return maskPattern
        ? {
          mask: maskPattern,
          lazy: false,
          overwrite: true,
          autofix: true
        }
        : undefined
    case 'date':
      return {
        mask: Date,
        lazy: false,
        overwrite: true,
        autofix: true
      }
    case 'email':
      return {
        mask: 'NAME@HOST.CODE',
        blocks: {
          CODE: {
            mask: /^[a-zA-Zs.]{1,8}$/
          },
          HOST: {
            mask: /^[a-zA-Z0-9_-]*$/
          },
          NAME: {
            mask: /^[a-zA-Z0-9_.-]*$/
          }
        }
      }
    case 'ip':
      return {
        mask: 'NUM.NUM.NUM.NUM',
        blocks: {
          NUM: {
            mask: /^[0-9]{1,3}$/
          }
        }
      }
    case 'mac':
      return {
        mask: 'MACAD:MACAD:MACAD:MACAD',
        blocks: {
          MACAD: {
            mask: /^[0-9a-fA-F]{1,2}$/
          }
        },
        lazy: false,
        overwrite: true,
        autofix: true
      }
    case 'phone':
      return {
        mask: '+7 (000) 000-00-00',
        lazy: false,
        overwrite: true,
        autofix: true
      }
    case 'none':
    default:
      return undefined
  }
}

const sanitizeTextValue = (
  value: string,
  allowedCharset: UXPinTextboxAllowedCharset,
  maxLength?: number
): string => {
  let nextValue = value

  if (allowedCharset !== 'any') {
    const pattern = TEXTBOX_ALLOWED_CHARSET_PATTERNS[allowedCharset]

    nextValue = Array.from(value)
      .filter((char) => pattern.test(char))
      .join('')
  }

  if (typeof maxLength === 'number' && maxLength >= 0) {
    nextValue = nextValue.slice(0, maxLength)
  }

  return nextValue
}

const Textbox = (rawProps: UXPinTextboxProps): JSX.Element => {
  const {
    allowEmpty,
    allowedCharset = 'any',
    codeComponentProps: _codeComponentProps,
    controls,
    counter = false,
    defaultText,
    defaultHeight = 104,
    integerOnly,
    maskOptions,
    maskPattern,
    maskPreset = 'none',
    max,
    maxLength,
    min,
    onChange,
    overriddenCodeProps: _overriddenCodeProps,
    placeholder = true,
    placeholderText = 'Input value',
    readonly,
    style,
    text,
    variant = maskPreset !== 'none' ? 'masked' : 'text',
    ...props
  } = resolveUXPinRuntimeProps(rawProps)
  const resolvedPlaceholder = placeholder ? placeholderText : undefined
  const resolvedStyle = mergeFrameStyle(style)
  const inputProps = props as any
  const resolvedMaxLength = typeof maxLength === 'number'
    ? maxLength
    : counter
      ? 500
      : undefined
  const [previewText, setPreviewText] = React.useState<string | undefined>(() => {
    if (typeof text === 'string') {
      return sanitizeTextValue(text, allowedCharset, resolvedMaxLength)
    }

    if (typeof defaultText === 'string') {
      return sanitizeTextValue(defaultText, allowedCharset, resolvedMaxLength)
    }

    return undefined
  })

  React.useEffect(() => {
    if (typeof text === 'string') {
      setPreviewText(sanitizeTextValue(text, allowedCharset, resolvedMaxLength))
      return
    }

    if (text === undefined && typeof defaultText === 'string') {
      setPreviewText((currentValue) => (
        currentValue === undefined
          ? sanitizeTextValue(defaultText, allowedCharset, resolvedMaxLength)
          : currentValue
      ))
    }
  }, [allowedCharset, defaultText, resolvedMaxLength, text])

  const handleTextLikeChange = (
    nextValue: string,
    mask?: IMaskInputProps
  ): void => {
    const resolvedValue = sanitizeTextValue(nextValue, allowedCharset, resolvedMaxLength)

    if (text === undefined) {
      setPreviewText(resolvedValue)
    }

    onChange?.(resolvedValue, mask)
  }

  const resolvedTextValue = typeof text === 'string'
    ? sanitizeTextValue(text, allowedCharset, resolvedMaxLength)
    : previewText
  const resolvedMaskOptions = getMaskOptions(maskPreset, maskPattern, maskOptions)

  if (variant === 'number') {
    return (
      <HexaTextbox.Number
        allowEmpty={allowEmpty}
        controls={controls}
        {...inputProps}
        integerOnly={integerOnly}
        max={max}
        min={min}
        onChange={(nextValue) => onChange?.(nextValue)}
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
        maxLength={resolvedMaxLength}
        onChange={handleTextLikeChange}
        placeholder={resolvedPlaceholder}
        readOnly={readonly ?? props.readOnly}
        style={resolvedStyle}
        value={resolvedTextValue}
      />
    )
  }

  if (variant === 'masked') {
    return (
      <HexaTextbox.Masked
        {...inputProps}
        maskOptions={resolvedMaskOptions}
        onChange={handleTextLikeChange}
        placeholder={resolvedPlaceholder}
        readOnly={readonly ?? props.readOnly}
        style={resolvedStyle}
        value={resolvedTextValue}
      />
    )
  }

  if (variant === 'textarea') {
    return (
      <TextareaFrame defaultHeight={defaultHeight}>
        <HexaTextbox.Textarea
          {...inputProps}
          maxLength={resolvedMaxLength}
          onChange={handleTextLikeChange}
          placeholder={resolvedPlaceholder}
          readOnly={readonly ?? props.readOnly}
          showCount={counter}
          style={resolvedStyle}
          value={resolvedTextValue}
        />
      </TextareaFrame>
    )
  }

  return (
    <HexaTextbox
      {...inputProps}
      maxLength={resolvedMaxLength}
      onChange={handleTextLikeChange}
      placeholder={resolvedPlaceholder}
      readOnly={readonly ?? props.readOnly}
      style={resolvedStyle}
      value={resolvedTextValue}
    />
  )
}

export default Textbox
