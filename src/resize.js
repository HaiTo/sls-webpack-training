'use strict';

import ImageMagick from 'imagemagick';
import Aws from 'aws-sdk';

const s3 = new Aws.S3({ apiVersion: '2006-03-01' })

class LambdaResponse {
  constructor() {
    this.statusCode = 200;
    this.headers = {};
    this.body = '';
    this.isBase64Encoded = true;
  }
}

const resize = (event, context, callback) => {
  const key = 'HDR.jpg';
  const bucket = 'sls-test-buckets';
  const params = {
    Bucket: bucket,
    Key: key
  }
  const response = new LambdaResponse()

  s3.getObject(params, (err, data) => {
    if (err) {
      callback(err);
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
          const encodedImage = new Buffer(stdout, 'binary').toString('base64');
          const headers = {
            'Content-Type': 'image/jpeg',
            "Access-Control-Allow-Origin" : "*",
            "Accept": 'image/jpeg'
          };
          response.body = encodedImage;
          response.headers = headers;



          callback(null, response);
        }
      })
    }
  })
}

export default resize;
