import express, { Request, Response } from 'express';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

//Directories
const imageDir: string = path.join(__dirname, '../images');
const cacheDir: string = path.join(__dirname, '../cachedImages');
// const myCache: nodeCache = new nodeCache({ stdTTL: 3600 });

if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir);
}

function validateRequestParameters(width: number, height: number) {
  if (isNaN(width) || width === 0 || isNaN(height) || height === 0) {
    return false;
  }
  return true;
}

const resize = async (req: Request, res: Response) => {
  const width: number = parseInt(req.query.width as string);
  const height: number = parseInt(req.query.height as string);
  // Validate width and height and image name
  if (!validateRequestParameters(width, height)) {
    return res.status(400).send('Invalid width or height');
  }

  const imageName: string = req.query.imageName as string;
  // Validate image name
  if (!imageName || typeof imageName !== 'string') {
    return res
      .status(400)
      .send('Image filename is required and must be a string');
  }

  const imagePath: string = path.join(imageDir, imageName);
  const cacheKey: string = `${width}_${height}_${imageName}`;
  const cachedImagePath: string = path.join(cacheDir, cacheKey);

  //if image found in the cache, will be served directly
  if (fs.existsSync(cachedImagePath)) {
    res.sendFile(imagePath, (err) => {
      if (err) {
        console.log('Error sending the file:', err);
        res.status(500).send('Error sending the image.');
      }
    });
  } else {
    console.log('Image not cached, will be generated and sent right away');
    imageProcessResize(
      imagePath,
      imageName,
      width,
      height,
      res,
      cachedImagePath,
    );
  }
};

const placeholder = async (req: Request, res: Response) => {
  const width: number = parseInt(req.query.width as string);
  const height: number = parseInt(req.query.height as string);
  if (!validateRequestParameters(width, height)) {
    return res.status(400).send('Invalid width or height');
  }
  const imageName: string = req.query.imageName as string;
  // Validate image name
  if (!imageName || typeof imageName !== 'string') {
    return res
      .status(400)
      .send('Image filename is required and must be a string');
  }

  const imagePath: string = path.join(imageDir, imageName);

  try {
    await imageProcessPlaceholder(imagePath, imageName, width, height, res);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    res.status(500).send('Error processing image');
  }
};

export const imageProcessPlaceholder = async (
  imagePath: string,
  imageName: string,
  width: number,
  height: number,
  res: Response,
) => {
  try {
    const resizedImage = await sharp(imagePath)
      .resize(width, height) // Resize to widthxheight pixels
      .toBuffer(); // Get the resized image as a buffer

    res.set('Content-Type', 'image/jpeg'); // Set the appropriate content type
    res.send(resizedImage); // Send the resized image buffer
  } catch (err) {
    console.error(err);
    res.status(500).send('Error resizing image');
  }
};

export const imageProcessResize = async (
  imagePath: string,
  imageName: string,
  width: number,
  height: number,
  res: Response,
  cachedImagePath: string,
) => {
  try {
    //resizing image
    const newImage: Buffer = await sharp(imagePath)
      .resize(width, height)
      .jpeg()
      .toBuffer();

    //saving new sized image to cache
    fs.writeFileSync(cachedImagePath, newImage);

    //sending image to browser
    res.set('Content-type', 'image/jpg');
    res.send(newImage);
  } catch (error) {
    console.error('Error while generating the image', error);
    res.status(500).send('Error while generating the image');
  }
};

const imageProcessRoutes = (app: express.Application) => {
  app.get('/resize', resize);
  app.get('/placeholder', placeholder);
};

export default imageProcessRoutes;
