'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.imageProcessResize = exports.imageProcessPlaceholder = void 0;
const sharp_1 = __importDefault(require('sharp'));
const path_1 = __importDefault(require('path'));
const fs_1 = __importDefault(require('fs'));
//Directories
const imageDir = path_1.default.join(__dirname, '../images');
const cacheDir = path_1.default.join(__dirname, '../cachedImages');
// const myCache: nodeCache = new nodeCache({ stdTTL: 3600 });
if (!fs_1.default.existsSync(cacheDir)) {
  fs_1.default.mkdirSync(cacheDir);
}
function validateRequestParameters(width, height) {
  if (isNaN(width) || width === 0 || isNaN(height) || height === 0) {
    return false;
  }
  return true;
}
const resize = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const width = parseInt(req.query.width);
    const height = parseInt(req.query.height);
    // Validate width and height and image name
    if (!validateRequestParameters(width, height)) {
      return res.status(400).send('Invalid width or height');
    }
    const imageName = req.query.imageName;
    // Validate image name
    if (!imageName || typeof imageName !== 'string') {
      return res
        .status(400)
        .send('Image filename is required and must be a string');
    }
    const imagePath = path_1.default.join(imageDir, imageName);
    const cacheKey = `${width}_${height}_${imageName}`;
    const cachedImagePath = path_1.default.join(cacheDir, cacheKey);
    //if image found in the cache, will be served directly
    if (fs_1.default.existsSync(cachedImagePath)) {
      console.log('Image aleady cached, and now being sent');
      const cachedImageBuffer = yield (0, sharp_1.default)(
        cachedImagePath,
      ).toBuffer();
      res.send(cachedImageBuffer);
    } else {
      console.log('Image not cached, will be generated and sent right away');
      (0, exports.imageProcessResize)(
        imagePath,
        imageName,
        width,
        height,
        res,
        cachedImagePath,
      );
    }
  });
const placeholder = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const width = parseInt(req.query.width);
    const height = parseInt(req.query.height);
    if (!validateRequestParameters(width, height)) {
      return res.status(400).send('Invalid width or height');
    }
    const imageName = req.query.imageName;
    // Validate image name
    if (!imageName || typeof imageName !== 'string') {
      return res
        .status(400)
        .send('Image filename is required and must be a string');
    }
    const imagePath = path_1.default.join(imageDir, imageName);
    try {
      yield (0, exports.imageProcessPlaceholder)(
        imagePath,
        imageName,
        width,
        height,
        res,
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      res.status(500).send('Error processing image');
    }
  });
const imageProcessPlaceholder = (imagePath, imageName, width, height, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const resizedImage = yield (0, sharp_1.default)(imagePath)
        .resize(width, height) // Resize to widthxheight pixels
        .toBuffer(); // Get the resized image as a buffer
      res.set('Content-Type', 'image/jpeg'); // Set the appropriate content type
      res.send(resizedImage); // Send the resized image buffer
    } catch (err) {
      console.error(err);
      res.status(500).send('Error resizing image');
    }
  });
exports.imageProcessPlaceholder = imageProcessPlaceholder;
const imageProcessResize = (
  imagePath,
  imageName,
  width,
  height,
  res,
  cachedImagePath,
) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      //resizing image
      const newImage = yield (0, sharp_1.default)(imagePath)
        .resize(width, height)
        .jpeg()
        .toBuffer();
      //saving new sized image to cache
      fs_1.default.writeFileSync(cachedImagePath, newImage);
      //sending image to browser
      res.set('Content-type', 'image/jpg');
      res.send(newImage);
    } catch (error) {
      console.error('Error while generating the image', error);
      res.status(500).send('Error while generating the image');
    }
  });
exports.imageProcessResize = imageProcessResize;
const imageProcessRoutes = (app) => {
  app.get('/resize', resize);
  app.get('/placeholder', placeholder);
};
exports.default = imageProcessRoutes;
