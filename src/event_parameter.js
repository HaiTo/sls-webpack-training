/**
 * lambdaEventから適切に画像を修正するための各種パラメーターを表現するClass
 */
export default class EventParameter {
  sizeQualityMap = {
    small: { long: 150, quality: 85 },
    small_2: { long: 300, quality: 85 },
    medium: { long: 360, quality: 85 },
    medium_2x: { long: 720, quality: 85 },
    large: { long: 1080, quality: 95 },
    exlarge: { long: 3000, quality: 95 }
  };

  /**
   * @param {Object} lambdaEvent lambdaの関数に渡される第一引数の event 
   */
  constructor(lambdaEvent) {
    this.pathParameters = event.pathParameters;
    this.queryStringParameters = event.queryStringParameters;
  }
  
  /**
   * @return {number} 長辺の長さを返却する。
   * ImageMagickにはwidth, height ともに同値を与えても長辺に合わせてresizeされるため、長辺だけでよい
   */
  get longLength() {
    return sizeQualityMap[_size()];
  }

  /**
   * @return {number} jpeg 圧縮の quality を返却する
   */
  get quality() {
    return sizeQualityMap[_size()];
  }

  /**
   * @return 
   */
  get s3ObjectKey() {
    return this.pathParameters.filename;
  }

  /**
   * size を返却する。外部からの利用を想定しない
   * @private {number}
   */
  _size() {
    return this.queryStringParameters.size;
  }
}