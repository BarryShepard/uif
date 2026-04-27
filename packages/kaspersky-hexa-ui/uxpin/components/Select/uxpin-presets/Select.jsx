import React from 'react';

import Select from '../Select';
import Dropdown from '../../Dropdown/Dropdown';
import DropdownItem from '../../DropdownItem/DropdownItem';

export default (
  <Select
    uxpId="select-1"
    withSearch={false}
    optionsText="Option 1\nOption 2\nOption 3"
    componentBefore={false}
    elementAfter={true}
    placeholder={true}
    placeholderText="Select value"
  >
    <Dropdown uxpId="select-dropdown-1" variant="single choice" maxHeight={200}>
      <DropdownItem uxpId="select-option-1" text="Option 1" selected />
      <DropdownItem uxpId="select-option-2" text="Option 2" />
      <DropdownItem uxpId="select-option-3" text="Option 3" />
    </Dropdown>
  </Select>
);
