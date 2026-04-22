import React from 'react';

import ToggleButtonGroup from '../ToggleButtonGroup';
import ToggleButton from '../../ToggleButton/ToggleButton';

export default (
  <ToggleButtonGroup
    uxpId="toggle-button-group-1"
    size="medium"
    variant="button"
  >
    <ToggleButton uxpId="toggle-button-group-item-1" text="One" value="one" selected />
    <ToggleButton uxpId="toggle-button-group-item-2" text="Two" value="two" />
    <ToggleButton uxpId="toggle-button-group-item-3" text="Three" value="three" />
  </ToggleButtonGroup>
);
