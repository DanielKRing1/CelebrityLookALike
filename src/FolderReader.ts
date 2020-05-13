/************* Imports ***********/
const path = require('path');
const fs = require('fs');

/*******************
 * Class
 * *****************/
export default class FolderReader {
  static instance;

  constructor() {
    if (FolderReader.instance) {
      return FolderReader.instance;
    }

    FolderReader.instance = this;
  }

  getImages(
    path: string,
    celebrityNames: Array<string>,
    addtionalPath?: string
  ): CelebrityImagesMapType {
    const imageMap: CelebrityImagesMapType = {};

    celebrityNames.forEach((name: string) => {
      const celebFilePath = `${path}/${name}`;
      const imageNames: Array<string> = fs.readdirSync(`${celebFilePath}/${addtionalPath}`);

      imageMap[name] = {
        imageNames,
      };
    });

    return imageMap;
  }

  executeEachCelebImageBatch = async (
    celebNames: Array<string>,
    celebImageMap: CelebrityImagesMapType,
    cb: (celebName: string, imageNames: Array<string>, cbTools?: any) => void,
    cbTools?: any
  ): Promise<void> => {
    for (const name of celebNames) {
      const celeb: CelebrityType = celebImageMap[name];
      const { imageNames } = celeb;

      await cb(name, imageNames, cbTools);
    }
  };
}

export type CelebrityType = {
  imageNames: Array<string>;
};
export type CelebrityImagesMapType = Record<string, CelebrityType>;
