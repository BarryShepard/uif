import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'

import Field from '../uxpin/components/Field/Field'
import MultiSelect from '../uxpin/components/MultiSelect/MultiSelect'
import Textbox from '../uxpin/components/Textbox/Textbox'

const FieldRuntime = Field as React.ComponentType<Record<string, unknown>>

describe('UXPin Field validation runtime', () => {
  it('reveals blur-triggered validation and cascades error state to the default textbox preview', () => {
    const { container } = render(
      <FieldRuntime
        message="Field is required"
        validationState="error"
        validationTrigger="blur"
      />
    )

    const textbox = container.querySelector('input')

    expect(textbox).toBeInTheDocument()
    expect(textbox).not.toHaveClass('error')
    expect(screen.queryByText('Field is required')).not.toBeInTheDocument()

    fireEvent.blur(textbox as HTMLInputElement)

    expect(textbox).toHaveClass('error')
    expect(screen.getByText('Field is required')).toBeInTheDocument()
  })

  it('uses external validation visibility for submit-like flows and cascades success state to nested controls', () => {
    const { container, rerender } = render(
      <FieldRuntime
        message="Looks good"
        validationState="success"
        validationTrigger="external"
        validationVisible={false}
      >
        <Textbox variant="text" />
      </FieldRuntime>
    )

    const textbox = container.querySelector('input')

    expect(textbox).toBeInTheDocument()
    expect(textbox).not.toHaveClass('success')
    expect(screen.queryByText('Looks good')).not.toBeInTheDocument()

    rerender(
      <FieldRuntime
        message="Looks good"
        validationState="success"
        validationTrigger="external"
        validationVisible={true}
      >
        <Textbox variant="text" />
      </FieldRuntime>
    )

    expect(textbox).toHaveClass('success')
    expect(screen.getByText('Looks good')).toBeInTheDocument()
  })

  it('validates email format on blur in rule mode', () => {
    render(
      <FieldRuntime
        message="Enter a valid email"
        validationMode="rule"
        validationRule="email"
        validationTrigger="blur"
      >
        <Textbox defaultText="not-an-email" variant="text" />
      </FieldRuntime>
    )

    const textbox = screen.getByRole('textbox')

    expect(screen.queryByText('Enter a valid email')).not.toBeInTheDocument()

    fireEvent.blur(textbox)

    expect(textbox).toHaveClass('error')
    expect(screen.getByText('Enter a valid email')).toBeInTheDocument()
  })

  it('validates multi-select count from an external CTA-like trigger', () => {
    const { rerender } = render(
      <FieldRuntime
        message="Select at least one asset"
        minSelected={1}
        validationMode="rule"
        validationRule="selectionCount"
        validationTrigger="external"
        validationVisible={false}
      >
        <MultiSelect value={[]} />
      </FieldRuntime>
    )

    expect(screen.queryByText('Select at least one asset')).not.toBeInTheDocument()

    rerender(
      <FieldRuntime
        message="Select at least one asset"
        minSelected={1}
        validationMode="rule"
        validationRule="selectionCount"
        validationTrigger="external"
        validationVisible={true}
      >
        <MultiSelect value={[]} />
      </FieldRuntime>
    )

    expect(screen.getByText('Select at least one asset')).toBeInTheDocument()
  })
})
