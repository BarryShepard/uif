import React from 'react';

import Menu from '../Menu';
import MenuItem from '../../MenuItem/MenuItem';

export default (
  <Menu
    uxpId="menu-1"
    minimized={false}
    header={true}
    footer={true}
    title="Configuration Service"
    description="Kaspersky Next"
  >
    <MenuItem
      uxpId="menu-item-1"
      label="Overview"
      elementBefore={true}
      elementBeforeIcon="Browser"
      state="active"
    />
    <MenuItem
      uxpId="menu-item-2"
      label="Monitoring & reporting"
      elementBefore={true}
      elementBeforeIcon="Browser"
      notification={true}
      collapsible={true}
    >
      <MenuItem uxpId="menu-item-2-1" label="Dashboard" state="active" />
      <MenuItem uxpId="menu-item-2-2" label="Reports" />
      <MenuItem uxpId="menu-item-2-3" label="Notifications" notification={true} />
    </MenuItem>
    <MenuItem
      uxpId="menu-item-3"
      label="Assets (Devices)"
      elementBefore={true}
      elementBeforeIcon="Shield"
      description={true}
      descriptionText="Nested navigation"
      collapsible={true}
    >
      <MenuItem uxpId="menu-item-3-1" label="Policies & profiles" />
      <MenuItem uxpId="menu-item-3-2" label="Tasks" />
      <MenuItem uxpId="menu-item-3-3" label="Managed devices" />
    </MenuItem>
    <MenuItem
      uxpId="menu-item-4"
      label="Users & roles"
      elementBefore={true}
      elementBeforeIcon="UserGroup"
      collapsible={true}
    >
      <MenuItem uxpId="menu-item-4-1" label="Users" />
      <MenuItem uxpId="menu-item-4-2" label="Roles" />
      <MenuItem
        uxpId="menu-item-4-3"
        label="Groups"
        elementBefore={true}
        elementBeforeIcon="Folder"
      />
    </MenuItem>
    <MenuItem
      uxpId="menu-item-5"
      label="Settings"
      elementBefore={true}
      elementBeforeIcon="SettingsGear"
      elementAfter={true}
    />
  </Menu>
);
