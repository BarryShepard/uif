import React from 'react';

import TagGroup from '../TagGroup';
import ActionButton from '../../ActionButton/ActionButton';
import Link from '../../Link/Link';
import Tag from '../../Tag/Tag';

export default (
  <TagGroup
    uxpId="tag-group-1"
    orientation="horizontal"
  >
    <Tag uxpId="tag-group-tag-1" label="Tag 1" />
    <Tag uxpId="tag-group-tag-2" label="Tag 2" mode="marina" />
    <Link uxpId="tag-group-link-1" text="Link" href="#" />
    <ActionButton uxpId="tag-group-action-1" variant="button" mode="ghost" size="small" text="Action" />
  </TagGroup>
);
