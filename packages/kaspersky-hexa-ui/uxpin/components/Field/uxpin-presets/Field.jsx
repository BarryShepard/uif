import React from 'react';

import Field from '../Field';
import FieldLabel from '../../FieldLabel/FieldLabel';
import Tag from '../../Tag/Tag';
import Textbox from '../../Textbox/Textbox';

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
    validationMode="manual"
    validationRule="required"
    validationPattern=""
    validationState="default"
    validationTrigger="always"
    validationVisible={false}
    showSuccessState={false}
    successMessage=""
    trimValidationValue={true}
    minLength={0}
    maxLength={64}
    minValue={0}
    maxValue={100}
    minSelected={1}
    maxSelected={5}
    widthMode="flex"
    widthValue={320}
  >
    <FieldLabel uxpId="field-label-1" text="Label" tagsAfter={false}>
      <Tag uxpId="field-label-tag-1" label="Tag 1" />
      <Tag uxpId="field-label-tag-2" label="Tag 2" />
    </FieldLabel>
    <Textbox
      uxpId="field-text-input-1"
      variant="text"
      placeholder={true}
      placeholderText="Value"
    />
  </Field>
);
