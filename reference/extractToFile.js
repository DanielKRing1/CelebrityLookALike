/***************** This example extracts a face from an image and saves the new aligned image to disk ******************/

// import nodejs bindings to native tensorflow,
// not required, but will speed up things drastically (python required)
// require('@tensorflow/tfjs-node');

// implements nodejs wrappers for HTMLCanvasElement, HTMLImageElement, ImageData
const faceapi = require('face-api.js');
const canvas = require('canvas');

// patch nodejs environment, we need to provide an implementation of
// HTMLCanvasElement and HTMLImageElement
const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

/***************** FACE DETECTION *************************/
async function detectFace() {
  try {
    // Init nets
    const detectNet = faceapi.nets.ssdMobilenetv1;
    const landmarkNet = faceapi.nets.faceLandmark68Net;
    const recogNet = faceapi.nets.faceRecognitionNet;
    await detectNet.loadFromDisk('./weights');
    await landmarkNet.loadFromDisk('./weights');
    await recogNet.loadFromDisk('./weights');

    const minConfidence = 0.3;
    const detectFaceOptions = new faceapi.SsdMobilenetv1Options({ minConfidence });

    // Load image
    // const url = './images/headshot.png';
    const img1 = './images/sheldon_raw.PNG';
    const img2 = './images/test.PNG';
    const sheldon_raw = await canvas.loadImage(img1);
    const sheldon_aligned = await canvas.loadImage(img2);

    // Detect face
    // Align face
    const detection = await faceapi
      .detectSingleFace(sheldon_raw)
      .withFaceLandmarks()
      .withFaceDescriptor();
    const detection2 = await faceapi
      .detectSingleFace(sheldon_aligned, detectFaceOptions)
      .withFaceLandmarks()
      .withFaceDescriptor();
    const { descriptor: faceDescriptor } = detection2;
    // const faceDescriptor = await faceapi.computeFaceDescriptor(sheldon_aligned);
    const { alignedRect, descriptor } = detection;
    console.log(detection);
    console.log(alignedRect);

    // console.log(descriptor);
    // console.log(faceDescriptor);

    descriptor.forEach((val, i) => console.log(`${val} === ${faceDescriptor[i]}`));
    console.log('I suspect the LandmarkNet auto aligns faces');
    console.log('Then I am comparing an auto aligned img against a manually aligned image');
    console.log('So if all values are equal, then this is true');

    // const out = await faceapi.extractFaces(sheldon_raw, [detection.alignedRect]);
    // const out2 = await faceapi.extractFaces(sheldon_aligned, [detection2.alignedRect]);

    // console.log(out[0]);
    // console.log(out2[0]);

    // saveFile('extracted_raw.jpg', out[0].toBuffer('image/jpeg'));
    // saveFile('extracted_aligned.jpg', out2[0].toBuffer('image/jpeg'));
  } catch (err) {
    console.log(err);
  }
}

const fs = require('fs');
const path = require('path');

const baseDir = path.resolve(__dirname, '../out');

function saveFile(fileName, buf) {
  if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir);
  }

  fs.writeFileSync(path.resolve(baseDir, fileName), buf);
}

detectFace();
