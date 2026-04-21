import React from 'react';

import MultiSelect from '../MultiSelect';
import Dropdown from '../../Dropdown/Dropdown';
import DropdownItem from '../../DropdownItem/DropdownItem';

export default (
  <MultiSelect
    uxpId="multi-select-1"
    withSearch={true}
    optionsText="Option 1\nOption 2\nOption 3"
    componentBefore={false}
    placeholder={true}
    placeholderText="Select values"
  >
    <Dropdown uxpId="multi-select-dropdown-1">
      <DropdownItem uxpId="multi-select-option-1" text="Option 1" selected />
      <DropdownItem uxpId="multi-select-option-2" text="Option 2" />
      <DropdownItem uxpId="multi-select-option-3" text="Option 3" />
    </Dropdown>
  </MultiSelect>
);
