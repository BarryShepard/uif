import React from 'react';

import Tabs from '../Tabs';
import TabItem from '../../TabItem/TabItem';

export default (
  <Tabs
    uxpId="tabs-1"
    defaultActiveKey="tab-1"
    noMargin={true}
  >
    <TabItem uxpId="tabs-tab-1" text="Tab 1" selected={true} />
    <TabItem uxpId="tabs-tab-2" text="Tab 2" />
    <TabItem uxpId="tabs-tab-3" text="Tab 3" indicator={true} />
  </Tabs>
);
