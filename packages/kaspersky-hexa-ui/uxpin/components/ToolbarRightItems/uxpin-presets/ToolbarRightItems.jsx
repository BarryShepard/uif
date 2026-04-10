import React from 'react';

import ToolbarButton from '../../ToolbarButton/ToolbarButton';
import ToolbarRightItems from '../ToolbarRightItems';

export default (
  <ToolbarRightItems uxpId="toolbar-right-items-1">
    <ToolbarButton
      uxpId="toolbar-right-button-1"
      variant="default"
      text="Filter"
      iconBefore={true}
      hideText={true}
      disabled={false}
      indicator={false}
    />
    <ToolbarButton
      uxpId="toolbar-right-button-2"
      variant="default"
      text="Settings"
      iconBefore={true}
      hideText={true}
      disabled={false}
      iconAfter={false}
      indicator={false}
    />
  </ToolbarRightItems>
);
