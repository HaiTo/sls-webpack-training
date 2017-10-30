'use strict';

import ImageMagick from 'imagemagick';
import Aws from 'aws-sdk';

const s3 = new Aws.S3({ apiVersion: '2006-03-01' })

class LambdaResponse {
  constructor() {
    this.statusCode = 200;
    this.headers = {
      'Content-Type': 'image/jpeg',
      "Access-Control-Allow-Origin" : "*",
      "Accept": 'image/jpeg'
    };
    this.body = '';
    this.isBase64Encoded = true;
  }
}

const resize = (event, context, callback) => {
  const pathParameters = event.pathParameters;
  const queryStringParameters = event.queryStringParameters;
  const width = parseInt(queryStringParameters.width);
  const height = parseInt(queryStringParameters.height);

  const key = pathParameters.filename;
  const bucket = 'sls-test-buckets';
  const params = {
    Bucket: bucket,
    Key: key
  };
  const response = new LambdaResponse();

  s3.getObject(params, (err, data) => {
    if (err) {
      return callback(err);
    };

    const resizeParam = {
      srcData: data.Body,
      format: 'jpg',
      width: parseInt(queryStringParameters.width),
      height: parseInt(queryStringParameters.height)
    };

    ImageMagick.resize(resizeParam, (err, stdout) => {
      if (err) {
        return callback('resize failed', err);
      }

      const encodedImage = new Buffer(stdout, 'binary').toString('base64');
      const headers = {
        'Content-Type': 'image/jpeg',
        "Access-Control-Allow-Origin" : "*",
        "Accept": 'image/jpeg'
      };
      response.body = encodedImage;
      response.headers = headers;

      return callback(null, response);
    });
  })
}
export default resize;
