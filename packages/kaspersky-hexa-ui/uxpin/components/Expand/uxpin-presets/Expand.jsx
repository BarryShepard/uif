import React from 'react';

import Expand from '../Expand';
import ActionButton from '../../ActionButton/ActionButton';
import Typography from '../../Typography/Typography';

export default (
  <Expand uxpId="expand-1" maxHeight={104} expandText="Show more">
    <Typography uxpId="expand-text-1" type="body text/P4 (12, 16)/Regular">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent vel justo ac nibh luctus volutpat.
      Sed interdum, nisl at dapibus gravida, dui massa mattis sem, vitae viverra lectus arcu eget nibh.
    </Typography>
    <ActionButton
      uxpId="expand-action-1"
      variant="button"
      mode="ghost"
      size="large"
      text="Show more"
      elementAfter={true}
    />
  </Expand>
);
