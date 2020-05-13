/************* Imports ***********/
const path = require('path');
const fs = require('fs');

import Analyzer = require('../../Analyzer');
import FolderReader, { CelebrityType, CelebrityImagesMapType } from '../../FolderReader';
const vector = require('../util/vector.ts');
const utils = require('../util/misc');

/************* Code ***********/
const CELEB_IMAGES_PATH: string = path.resolve(__dirname, '../../../Images/Celeb');

/***************
 * Entry point
 **************/
type CelebrityScoreType = Array<number>;
type CelebrityScoreMapType = Record<string, CelebrityScoreType>;
let celebrityScoreMap: CelebrityScoreMapType = {};

const scoreAllFaces = async (): Promise<void> => {
  try {
    const analyzer: Analyzer = new Analyzer();
    await analyzer.loadModels();
    const reader = new FolderReader();

    const celebrityFolderNames: Array<string> = fs.readdirSync(CELEB_IMAGES_PATH);
    const celebImageMap: CelebrityImagesMapType = reader.getImages(
      CELEB_IMAGES_PATH,
      celebrityFolderNames,
      'extracted'
    );

    console.time('Scoring');
    await reader.executeEachCelebImageBatch(
      celebrityFolderNames,
      celebImageMap,
      scoreCelebrity,
      analyzer
    );

    // reader.executeEachCelebImageBatch(
    //   celebrityFolderNames,
    //   celebImageMap,
    //   extractCelebrity,
    //   analyzer
    // );

    console.timeEnd('Scoring');

    utils.saveJson(celebrityScoreMap, `${CELEB_IMAGES_PATH}/../scores`, 'celebrityScores.json');
  } catch (err) {
    console.log(err);
  }
};
module.exports = scoreAllFaces;

const scoreCelebrity = async (celebName: string, imageNames: Array<string>, analyzer: Analyzer) => {
  let descriptors = [];

  for (const imageName of imageNames) {
    const imagePath = path.normalize(`${CELEB_IMAGES_PATH}/${celebName}/extracted/${imageName}`);

    const descriptor = await analyzer.getRawFaceDescriptor(imagePath);
    descriptors.push(descriptor);
  }

  celebrityScoreMap[celebName] = vector.sum(descriptors);
};
const extractCelebrity = async (
  celebName: string,
  imageNames: Array<string>,
  analyzer: Analyzer
) => {
  for (let i = 0; i < imageNames.length; i++) {
    const imageName = imageNames[i];
    const imagePath = path.normalize(`${CELEB_IMAGES_PATH}/${celebName}/training/${imageName}`);

    const { alignedRect } = await analyzer.getFaceAndLandmarks(imagePath);

    const extractedFace = await analyzer.extractFace(imagePath, alignedRect);

    utils.saveFile(
      `${celebName}__extracted__${i}.jpg`,
      `${CELEB_IMAGES_PATH}/${celebName}/extracted`,
      extractedFace[0].toBuffer('image/jpeg')
    );
  }
};
