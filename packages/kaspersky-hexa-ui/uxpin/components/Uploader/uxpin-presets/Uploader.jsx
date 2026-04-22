import React from 'react';

import Uploader from '../Uploader';
import UploaderFile from '../../UploaderFile/UploaderFile';

export default (
  <Uploader
    uxpId="uploader-1"
    size="medium"
    disabled={false}
    multiple={true}
    uploaded={false}
    loading={false}
    fullHeight={false}
    fullheight={false}
  >
    <UploaderFile uxpId="uploader-file-1" name="report.pdf" sizeKb={240} status="uploaded" />
    <UploaderFile uxpId="uploader-file-2" name="screenshot.png" sizeKb={512} status="uploaded" />
    <UploaderFile uxpId="uploader-file-3" name="archive.zip" sizeKb={820} status="uploaded" />
    <UploaderFile
      uxpId="uploader-file-4"
      name="long-file-name-for-overflow-check.json"
      sizeKb={128}
      status="uploaded"
    />
  </Uploader>
);
