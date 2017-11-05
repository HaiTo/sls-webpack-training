'use strict';

import gm from 'gm';
import Aws from 'aws-sdk';
import EventParameter from './event_parameter';

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
  const eventParameter = new EventParameter(event);

  const bucket = 'sls-test-buckets';
  const params = {
    Bucket: bucket,
    Key: eventParameter.s3ObjectKey()
  };
  const response = new LambdaResponse();

  s3.getObject(params, (err, data) => {
    if (err) {
      return callback(err);
    };

    gm(data.Body)
      .options({ imageMagick: true })
      .resize(eventParameter.longLength, eventParameter.longLength)
      .quality(eventParameter.quality)
      .font("/usr/share/fonts/dejavu/DejaVuSerif.ttf", 10)
      .stroke(data.Metadata.color)
      .fill(data.Metadata.color)
      .drawText(0, 0, data.Metadata.uploader, data.Metadata.gravity)
      .toBuffer('jpeg', (err, buffer) => {
        if (err) { console.log(err); return callback(err); }

        response.body = buffer.toString('base64')
        callback(null, response);
      })
  })
}
export default resize;
