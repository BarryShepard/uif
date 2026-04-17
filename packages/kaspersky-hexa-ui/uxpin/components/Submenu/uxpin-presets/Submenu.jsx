import React from 'react';

import Submenu from '../Submenu';
import SubmenuItem from '../../SubmenuItem/SubmenuItem';

export default (
  <Submenu
    uxpId="submenu-1"
    draggable={false}
    truncateText={true}
  >
    <SubmenuItem
      uxpId="submenu-item-1"
      variant="item"
      text="Overview"
      selected={true}
      iconBefore={true}
      iconBeforeSlot="Browser"
    />
    <SubmenuItem
      uxpId="submenu-item-2"
      variant="item"
      text="Assets"
      iconBefore={true}
      iconBeforeSlot="StorageServer"
    />
    <SubmenuItem
      uxpId="submenu-item-3"
      variant="item"
      text="Policies"
      iconBefore={true}
      iconBeforeSlot="Shield"
    />
    <SubmenuItem
      uxpId="submenu-item-4"
      variant="item"
      text="Reports"
      iconBefore={true}
      iconBeforeSlot="Folder"
    />
    <SubmenuItem
      uxpId="submenu-item-5"
      variant="item"
      text="Settings"
      iconBefore={true}
      iconBeforeSlot="SettingsGear"
    />
  </Submenu>
);
