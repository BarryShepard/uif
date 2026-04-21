import React from 'react';

import StatusGroup from '../StatusGroup';
import Status from '../../Status/Status';

export default (
  <StatusGroup uxpId="status-group-1" orientation="vertical">
    <Status uxpId="status-group-item-1" text="Active" mode="positive" />
    <Status uxpId="status-group-item-2" text="In progress" mode="inprogress" />
    <Status uxpId="status-group-item-3" text="Critical" mode="critical" />
  </StatusGroup>
);
