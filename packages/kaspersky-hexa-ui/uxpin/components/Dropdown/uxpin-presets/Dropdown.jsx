import React from 'react';

import Dropdown from '../Dropdown';
import DropdownItem from '../../DropdownItem/DropdownItem';

export default (
  <Dropdown
    uxpId="dropdown-1"
    variant="single choice"
    maxHeight={200}
  >
    <DropdownItem
      uxpId="dropdown-item-1"
      text="Option 1"
      selected={true}
    />
    <DropdownItem
      uxpId="dropdown-item-2"
      text="Option 2"
    />
    <DropdownItem
      uxpId="dropdown-item-3"
      text="Option 3"
    />
  </Dropdown>
);
