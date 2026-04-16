import React from 'react';

import Dropdown from '../Dropdown';
import DropdownItem from '../../DropdownItem/DropdownItem';
import Button from '../../Button/Button';

export default (
  <Dropdown
    uxpId="dropdown-1"
    variant="single choice"
    maxHeight={280}
    stickyFooter={<Button text="Reset filter" mode="tertiary" size="small" />}
  >
    <DropdownItem
      uxpId="dropdown-item-1"
      text="Option 1"
      selected={true}
    />
    <DropdownItem
      uxpId="dropdown-item-2"
      text="Option 2"
      description={true}
      descriptionText="Additional description"
    />
    <DropdownItem
      uxpId="dropdown-item-3"
      text="Option 3"
      elementBefore={true}
      elementAfter={true}
    />
  </Dropdown>
);
