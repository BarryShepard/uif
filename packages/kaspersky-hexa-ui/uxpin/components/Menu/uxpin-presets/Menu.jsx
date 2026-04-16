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
      label="Administration server"
      elementBefore={true}
      elementBeforeIcon="StorageServer"
      state="enabled"
    />
    <MenuItem
      uxpId="menu-item-2"
      label="Console navigation"
      elementBefore={true}
      elementBeforeIcon="Map"
      state="enabled"
    />
    <MenuItem
      uxpId="menu-item-3"
      label="Monitoring"
      elementBefore={true}
      elementBeforeIcon="EngineeringStation"
      state="enabled"
    />
    <MenuItem
      uxpId="menu-item-4"
      label="Detection and response"
      elementBefore={true}
      elementBeforeIcon="Sensor"
      state="enabled"
    />
    <MenuItem
      uxpId="menu-item-5"
      label="Settings"
      elementBefore={true}
      elementBeforeIcon="SettingsGear"
      state="enabled"
    />
  </Menu>
);
