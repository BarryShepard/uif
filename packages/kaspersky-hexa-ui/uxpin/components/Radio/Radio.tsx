import React from 'react'

import { Radio as HexaRadio } from '@src/radio'
import { RadioProps } from '@src/radio/types'

import { previewRadioOptions } from '../../preview'
import { resolveUXPinRuntimeProps } from '../../uxpinRuntime'

type UXPinRadioOption = {
  label: string,
  value: string,
  disabled?: boolean
}

export type UXPinRadioProps = {
  vertical?: boolean,
  disabled?: boolean,
  readonly?: boolean,
  invalid?: boolean,
  role?: string,
  value?: string,
  onChange?: RadioProps['onChange'],
  options?: UXPinRadioOption[],
  codeComponentProps?: Partial<UXPinRadioProps>,
  overriddenCodeProps?: Partial<UXPinRadioProps>
}

const Radio = ({
  onChange,
  options,
  value,
  ...props
}: UXPinRadioProps): JSX.Element => {
  const resolved = resolveUXPinRuntimeProps({ onChange, options, value, ...props }) as UXPinRadioProps
  const {
    codeComponentProps: _codeComponentProps,
    onChange: resolvedOnChange,
    options: resolvedOptions,
    overriddenCodeProps: _overriddenCodeProps,
    value: resolvedValue,
    ...resolvedProps
  } = resolved
  const [previewValue, setPreviewValue] = React.useState(resolvedValue ?? previewRadioOptions[0]?.value)

  React.useEffect(() => {
    if (resolvedValue !== undefined) {
      setPreviewValue(resolvedValue as string)
    }
  }, [resolvedValue])

  return (
    <HexaRadio
      onChange={(event) => {
        if (resolvedValue === undefined) {
          setPreviewValue(event.target.value)
        }
        resolvedOnChange?.(event)
      }}
      options={(resolvedOptions ?? previewRadioOptions) as RadioProps['options']}
      value={resolvedValue ?? previewValue}
      {...resolvedProps}
    />
  )
}

export default Radio
