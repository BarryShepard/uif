import React from 'react';

import ToolbarButton from '../../ToolbarButton/ToolbarButton';
import ToolbarLeftItems from '../ToolbarLeftItems';

export default (
  <ToolbarLeftItems uxpId="toolbar-left-items-1">
    <ToolbarButton
      uxpId="toolbar-left-button-1"
      variant="default"
      text="Button 1"
      iconBefore={true}
      disabled={false}
      iconAfter={false}
      indicator={false}
    />
    <ToolbarButton
      uxpId="toolbar-left-button-2"
      variant="dropdown"
      text="Button 2"
      iconBefore={true}
      disabled={false}
      iconAfter={true}
      indicator={false}
    />
    <ToolbarButton
      uxpId="toolbar-left-button-3"
      variant="default"
      text="Button 3"
      iconBefore={false}
      disabled={false}
      iconAfter={false}
      indicator={false}
    />
  </ToolbarLeftItems>
);
