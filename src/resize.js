'use strict';

import gm from 'gm';
import Aws from 'aws-sdk';

const s3 = new Aws.S3({ apiVersion: '2006-03-01' })

class LambdaResponse {
  constructor() {
    this.statusCode = 200;
    this.headers = {
      'Content-Type': 'image/jpeg',
      "Access-Control-Allow-Origin": "*",
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

    gm(data.Body)
      .options({ imageMagick: true })
      .resize(width, height)
      .font("/usr/share/fonts/dejavu/DejaVuSerif.ttf", 10)
      .stroke('#ffffff')
      .fill('#ffffff')
      .drawText(0, 0, data.Metadata.uploader, 'SouthWest')
      .toBuffer('jpeg', (err, buffer) => {
        if (err) { console.log(err); return callback(err); }

        response.body = buffer.toString('base64')
        callback(null, response);
      })
  })
}
export default resize;
