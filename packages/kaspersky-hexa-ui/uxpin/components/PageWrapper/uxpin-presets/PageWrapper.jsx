import React from 'react';

import GroupWrapper from '../../GroupWrapper/GroupWrapper';
import SectionWrapper from '../../SectionWrapper/SectionWrapper';
import PageWrapper from '../PageWrapper';

export default (
  <PageWrapper uxpId="page-wrapper-1">
    <SectionWrapper uxpId="section-wrapper-1">
      <GroupWrapper
        uxpId="group-wrapper-1"
        flexWidth={true}
      />
    </SectionWrapper>
  </PageWrapper>
);
