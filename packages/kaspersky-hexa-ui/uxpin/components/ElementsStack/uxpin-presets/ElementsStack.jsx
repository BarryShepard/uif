import React from 'react';

import ElementsStack from '../ElementsStack';
import Icon from '../../Icon/Icon';
import Status from '../../Status/Status';
import Tag from '../../Tag/Tag';
import Typography from '../../Typography/Typography';

export default (
  <ElementsStack uxpId="elements-stack-1" gap={4}>
    <Icon uxpId="elements-stack-icon-1" name="Placeholder" size="small" />
    <Status uxpId="elements-stack-status-1" label="Active" mode="positive" />
    <Tag uxpId="elements-stack-tag-1" label="Tag" />
    <Typography uxpId="elements-stack-text-1" type="body text/P4 (12, 16)/Regular">Text</Typography>
  </ElementsStack>
);
