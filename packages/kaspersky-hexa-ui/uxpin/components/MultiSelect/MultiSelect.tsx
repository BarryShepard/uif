import React from 'react'

import Select, { UXPinSelectProps } from '../Select/Select'

const MultiSelect = (props: UXPinSelectProps): JSX.Element => (
  <Select mode="multiple" placeholderText="Select values" {...props} />
)

MultiSelect.displayName = 'MultiSelect'

export default MultiSelect
