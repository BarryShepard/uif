import React from 'react';

import Toolbar from '../Toolbar';
import Dropdown from '../../Dropdown/Dropdown';
import DropdownItem from '../../DropdownItem/DropdownItem';
import ToolbarButton from '../../ToolbarButton/ToolbarButton';
import ToolbarLeftItems from '../../ToolbarLeftItems/ToolbarLeftItems';
import ToolbarRightItems from '../../ToolbarRightItems/ToolbarRightItems';
import ToolbarSearch from '../../ToolbarSearch/ToolbarSearch';

export default (
  <Toolbar
    uxpId="toolbar-1"
    leftItems={true}
    search={true}
    rightItems={true}
  >
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
      >
        <Dropdown uxpId="toolbar-left-button-2-dropdown">
          <DropdownItem uxpId="toolbar-left-button-2-dropdown-item-1" text="Action 1" />
          <DropdownItem uxpId="toolbar-left-button-2-dropdown-item-2" text="Action 2" />
          <DropdownItem uxpId="toolbar-left-button-2-dropdown-item-3" text="Action 3" />
        </Dropdown>
      </ToolbarButton>
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
    <ToolbarSearch
      uxpId="toolbar-search-1"
      variant="default"
      placeholderText="Search"
    />
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
  </Toolbar>
);
