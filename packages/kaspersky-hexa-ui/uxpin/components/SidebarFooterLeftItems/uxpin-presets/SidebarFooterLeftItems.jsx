import React from 'react';

import SidebarFooterLeftItems from '../SidebarFooterLeftItems';
import Button from '../../Button/Button';

export default (
  <SidebarFooterLeftItems uxpId="sidebar-footer-left-items-1">
    <Button
      uxpId="sidebar-footer-save"
      mode="primary"
      size="medium"
      text="Save"
      style={{ width: 'fit-content' }}
    />
    <Button
      uxpId="sidebar-footer-cancel"
      mode="secondary"
      size="medium"
      text="Cancel"
      style={{ width: 'fit-content' }}
    />
  </SidebarFooterLeftItems>
);
