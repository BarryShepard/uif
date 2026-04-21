import React from 'react';

import Field from '../Field';
import FieldLabel from '../../FieldLabel/FieldLabel';
import Tag from '../../Tag/Tag';

export default (
  <Field
    uxpId="field-1"
    variant="inputText"
    label={true}
    text="Label"
    disabled={false}
    readonly={false}
    required={false}
    buttonInfo={false}
    buttonInfoText="Additional information"
    tagsAfter={false}
    placeholderText="Value"
    labelPositionRange={4}
  >
    <FieldLabel uxpId="field-label-1" text="Label" tagsAfter={false}>
      <Tag uxpId="field-label-tag-1" label="Tag 1" />
      <Tag uxpId="field-label-tag-2" label="Tag 2" />
    </FieldLabel>
  </Field>
);
