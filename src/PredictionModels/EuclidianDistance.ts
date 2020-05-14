/************* Imports ***********/
const path = require('path');
const fs = require('fs');

import PredictionModel from './PredictionModel';

/*******************
 * Class
 * *****************/
export default class EuclidianDistance extends PredictionModel {
  constructor() {
    super();
  }

  predict(descriptor: Array<number>) {
    console.log;
  }
}
