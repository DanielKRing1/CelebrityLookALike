/************************* Singleton initializes Face-api.js, and loads Tensorflow and relevant Net models ********************/

/*******************
 * Include this before using Face-api.js
 * *****************/
// import nodejs bindings to native tensorflow,
// not required, but will speed up things drastically (python required)
require('@tensorflow/tfjs-node');
// implements nodejs wrappers for HTMLCanvasElement, HTMLImageElement, ImageData
const faceapi = require('face-api.js');
const canvas = require('canvas');
// patch nodejs environment, we need to provide an implementation of
// HTMLCanvasElement and HTMLImageElement
const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

/*******************
 * Class
 * *****************/
class Analyzer {
  static instance;

  constructor(minConfidence = 0.1) {
    if (Analyzer.instance) {
      return Analyzer.instance;
    }

    Analyzer.instance = this;
    this.alreadyLoaded = false;

    this.detectFaceOptions = new faceapi.SsdMobilenetv1Options({ minConfidence });
  }

  async loadModels() {
    if (this.alreadyLoaded) return;

    // Init nets
    try {
      const detectNet = faceapi.nets.ssdMobilenetv1;
      const landmarkNet = faceapi.nets.faceLandmark68Net;
      const recogNet = faceapi.nets.faceRecognitionNet;

      await detectNet.loadFromDisk('./weights');
      await landmarkNet.loadFromDisk('./weights');
      await recogNet.loadFromDisk('./weights');

      this.alreadyLoaded = true;
    } catch (err) {
      console.log(err);
    }
  }

  async getFullFaceInfo(path) {
    try {
      // Load image
      const img = await canvas.loadImage(path);

      console.log('----------------------------------');
      console.log(path);
      console.log(img);

      // Detect face
      // Align face
      const fullFaceInfo = await faceapi
        .detectSingleFace(img, this.detectFaceOptions)
        .withFaceLandmarks()
        .withFaceDescriptor();

      return fullFaceInfo;
    } catch (err) {
      console.log(err);
    }
  }
  async getRawFaceDescriptor(path) {
    try {
      // Load image
      const img = await canvas.loadImage(path);

      // Detect face
      // Align face
      const descriptor = await faceapi.computeFaceDescriptor(img, this.detectFaceOptions);

      return descriptor;
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = Analyzer;
