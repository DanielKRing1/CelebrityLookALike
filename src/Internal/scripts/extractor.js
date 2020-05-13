// implements nodejs wrappers for HTMLCanvasElement, HTMLImageElement, ImageData
const faceapi = require('face-api.js');
const canvas = require('canvas');

const Analyzer = require('../../Analyzer');

async function run() {
  const analyzer = new Analyzer();
  await analyzer.loadModels();

  analyzeImages();
}

/***************** FACE DETECTION *************************/
async function analyzeImages() {
  const minConfidence = 0.1;
  const detectFaceOptions = new faceapi.SsdMobilenetv1Options({ minConfidence });

  try {
    // Load image
    const url = './images/headshot.png';
    const headshot = await canvas.loadImage(url);

    // Detect face
    // Align face
    const detection = await faceapi
      .detectSingleFace(headshot)
      .withFaceLandmarks()
      .withFaceDescriptor();
    // const faceDescriptor = await faceapi.computeFaceDescriptor(sheldon_aligned);
    const { alignedRect, descriptor } = detection;
    console.log(detection);
    console.log(alignedRect);

    // console.log(descriptor);
    // console.log(faceDescriptor);

    // descriptor.forEach((val, i) => console.log(`${val} === ${faceDescriptor[i]}`));
    console.log('I suspect the LandmarkNet auto aligns faces');
    console.log('Then I am comparing an auto aligned img against a manually aligned image');
    console.log('So if all values are equal, then this is true');

    const out = await faceapi.extractFaces(headshot, [detection.alignedRect]);

    console.log(out[0]);

    saveFile('headshot_extracted_aligned.jpg', out[0].toBuffer('image/jpeg'));
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
