/************* Imports ***********/
const path = require('path');
const fs = require('fs');

import PredictionModel from './PredictionModel';

/*******************
 * Class
 * *****************/
export default class Mlr extends PredictionModel {
  constructor() {
    super();
  }

  predict(descriptor: Array<number>) {
    console.log;
  }
}
