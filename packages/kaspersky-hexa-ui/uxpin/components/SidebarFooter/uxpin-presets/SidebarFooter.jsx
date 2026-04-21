import React from 'react';

import SidebarFooter from '../SidebarFooter';
import SidebarFooterLeftItems from '../../SidebarFooterLeftItems/SidebarFooterLeftItems';
import SidebarFooterRightItems from '../../SidebarFooterRightItems/SidebarFooterRightItems';
import Button from '../../Button/Button';

export default (
  <SidebarFooter
    uxpId="sidebar-footer-1"
    additionalContent={false}
  >
    <SidebarFooterLeftItems uxpId="sidebar-footer-left-items">
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
    <SidebarFooterRightItems
      uxpId="sidebar-footer-right-items"
      children={[]}
    />
  </SidebarFooter>
);
