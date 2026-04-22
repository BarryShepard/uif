import React from 'react';

import TreeList from '../TreeList';
import TreeListItem from '../../TreeListItem/TreeListItem';

export default (
  <TreeList
    uxpId="tree-list-1"
    variant="multiplechoice"
    draggable={false}
    elementBefore={true}
  >
    <TreeListItem uxpId="tree-list-item-1" text="Workspace" value="workspace" elementBefore selected>
      <TreeListItem uxpId="tree-list-item-1-1" text="Devices" value="devices" />
      <TreeListItem uxpId="tree-list-item-1-2" text="Policies" value="policies">
        <TreeListItem uxpId="tree-list-item-1-2-1" text="Default policy" value="default-policy" />
      </TreeListItem>
    </TreeListItem>
    <TreeListItem uxpId="tree-list-item-2" text="Shared" value="shared" />
  </TreeList>
);
