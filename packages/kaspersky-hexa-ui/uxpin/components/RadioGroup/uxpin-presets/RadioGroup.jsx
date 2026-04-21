import React from 'react';

import RadioGroup from '../RadioGroup';
import RadioItem from '../../RadioItem/RadioItem';

export default (
  <RadioGroup uxpId="radio-group-1" orientation="vertical" disabled={false} readonly={false}>
    <RadioItem uxpId="radio-group-item-1" text="Option 1" value="option-1" selected />
    <RadioItem uxpId="radio-group-item-2" text="Option 2" value="option-2" />
    <RadioItem uxpId="radio-group-item-3" text="Option 3" value="option-3" />
    <RadioItem uxpId="radio-group-item-4" text="Option 4" value="option-4" />
    <RadioItem uxpId="radio-group-item-5" text="Option 5" value="option-5" />
  </RadioGroup>
);
