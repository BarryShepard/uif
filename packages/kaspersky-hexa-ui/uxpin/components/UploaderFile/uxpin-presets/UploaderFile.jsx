import React from 'react';

import UploaderFile from '../UploaderFile';

export default (
  <UploaderFile
    uxpId="uploader-file-1"
    name="report.pdf"
    sizeKb={240}
    status="uploaded"
    progress={45}
    errorText="Upload failed"
  />
);
