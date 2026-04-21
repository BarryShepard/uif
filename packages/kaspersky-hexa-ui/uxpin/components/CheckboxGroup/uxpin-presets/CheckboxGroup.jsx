import React from 'react';

import CheckboxGroup from '../CheckboxGroup';
import Checkbox from '../../Checkbox/Checkbox';

export default (
  <CheckboxGroup
    uxpId="checkbox-group-1"
    orientation="vertical"
    disabled={false}
    readonly={false}
  >
    <Checkbox uxpId="checkbox-group-item-1" text="Option 1" value="option-1" checked />
    <Checkbox uxpId="checkbox-group-item-2" text="Option 2" value="option-2" />
    <Checkbox uxpId="checkbox-group-item-3" text="Option 3" value="option-3" />
    <Checkbox uxpId="checkbox-group-item-4" text="Option 4" value="option-4" />
    <Checkbox uxpId="checkbox-group-item-5" text="Option 5" value="option-5" />
  </CheckboxGroup>
);
