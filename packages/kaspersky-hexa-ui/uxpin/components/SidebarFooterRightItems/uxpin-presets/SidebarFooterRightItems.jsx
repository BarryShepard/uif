import React from 'react';

import SidebarFooterRightItems from '../SidebarFooterRightItems';
import Button from '../../Button/Button';

export default (
  <SidebarFooterRightItems uxpId="sidebar-footer-right-items-1">
    <Button
      uxpId="sidebar-footer-delete"
      mode="dangerOutlined"
      size="medium"
      text="Delete"
      style={{ width: 'fit-content' }}
    />
  </SidebarFooterRightItems>
);
