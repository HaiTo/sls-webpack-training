'use strict';

import ImageMagick from 'imagemagick';
import Aws from 'aws-sdk';

const s3 = new Aws.S3({ apiVersion: '2006-03-01' })

const resize = (event, context, callback) => {
  const key = 'HDR.jpg';
  const bucket = 'sls-test-buckets';
  const params = {
    Bucket: bucket,
    Key: key
  }

  s3.getObject(params, (err, data) => {
    if (err) {
      callback(`Error getting object ${key} from bucket ${bucket}. Make sure they exist and your bucket is in the same region as this function.`);
    } else {
      const resizeParam = {
        srcData: data.Body,
        format: 'jpg',
        width: 200
      }
      ImageMagick.resize(resizeParam, (err, stdout, stderr) => {
        if (err) {
          callback('resize failed', err);
        } else {
          callback(null, new Buffer(stdout, 'binary').toString('base64'));
        }
      })
    }
  })
}

export default resize;
