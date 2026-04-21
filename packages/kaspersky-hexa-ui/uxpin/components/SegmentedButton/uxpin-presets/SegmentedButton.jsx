import React from 'react';

import SegmentedButton from '../SegmentedButton';
import SegmentedButtonItem from '../../SegmentedButtonItem/SegmentedButtonItem';

export default (
  <SegmentedButton uxpId="segmented-button-1" size="medium">
    <SegmentedButtonItem uxpId="segmented-button-item-1" text="One" value="one" selected />
    <SegmentedButtonItem uxpId="segmented-button-item-2" text="Two" value="two" />
    <SegmentedButtonItem uxpId="segmented-button-item-3" text="Three" value="three" counter counterValue="3" />
  </SegmentedButton>
);
