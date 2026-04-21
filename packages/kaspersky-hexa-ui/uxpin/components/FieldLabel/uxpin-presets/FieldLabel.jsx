import React from 'react';

import FieldLabel from '../FieldLabel';
import Tag from '../../Tag/Tag';

export default (
  <FieldLabel
    uxpId="field-label-1"
    text="Label"
    required={false}
    buttonInfo={false}
    buttonInfoText="Additional information"
    tagsAfter={true}
  >
    <Tag uxpId="field-label-tag-1" label="Tag 1" />
    <Tag uxpId="field-label-tag-2" label="Tag 2" />
  </FieldLabel>
);
