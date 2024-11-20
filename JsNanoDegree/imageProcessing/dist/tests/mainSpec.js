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
const supertest_1 = __importDefault(require('supertest'));
const main_1 = __importDefault(require('../main'));
const utilities_1 = __importDefault(require('../utilities'));
const sharp_1 = __importDefault(require('sharp'));
const utilities_2 = require('../utilities');
const fs_1 = __importDefault(require('fs'));
/************************************************************************* */
describe('Image Process Resize', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockResponse;
  let mockSharp;
  let mockFsWriteFileSync;
  beforeEach(() => {
    // Mock the response object
    mockResponse = {
      set: jasmine.createSpy('set'),
      send: jasmine.createSpy('send'),
      status: jasmine.createSpy('status').and.returnValue({
        send: jasmine.createSpy('statusSend'),
      }),
    };
    // Mock sharp to return a buffer
    mockSharp = spyOn(sharp_1.default.prototype, 'resize').and.returnValue({
      jpeg: () => ({
        toBuffer: () =>
          __awaiter(void 0, void 0, void 0, function* () {
            return Buffer.from('mockImageBuffer');
          }),
      }),
    });
    // Mock fs.writeFileSync
    mockFsWriteFileSync = spyOn(fs_1.default, 'writeFileSync').and.callFake(
      () => {},
    );
  });
  it('should resize the image and respond with the new image', () =>
    __awaiter(void 0, void 0, void 0, function* () {
      const imagePath = '../../images/';
      const imageName = 'cat.jpg';
      const width = 200;
      const height = 200;
      const cachedImagePath = '../../cachedImages/';
      // Call the function
      // await imageProcessResize(imagePath, imageName, width, height, mockResponse, cachedImagePath);
      yield (0, utilities_2.imageProcessResize)(
        imagePath,
        imageName,
        width,
        height,
        mockResponse,
        cachedImagePath,
      );
      // Expect the image to be resized with sharp
      expect(mockSharp).toHaveBeenCalledWith(width, height);
      // Expect fs.writeFileSync to be called to save the resized image
      expect(mockFsWriteFileSync).toHaveBeenCalledWith(
        cachedImagePath,
        Buffer.from('mockImageBuffer'),
      );
      // Expect the response headers to be set and the image sent
      expect(mockResponse.set).toHaveBeenCalledWith(
        'Content-type',
        'image/jpg',
      );
      expect(mockResponse.send).toHaveBeenCalledWith(
        Buffer.from('mockImageBuffer'),
      );
    }));
  it('should handle errors and send a 500 status', () =>
    __awaiter(void 0, void 0, void 0, function* () {
      // Make sharp throw an error to test error handling
      mockSharp.and.throwError('Sharp error');
      const imagePath = '../../images/';
      const imageName = 'cat.jpg';
      const width = 200;
      const height = 200;
      const cachedImagePath = '../../cachedImages/';
      // Call the function
      yield (0, utilities_2.imageProcessResize)(
        imagePath,
        imageName,
        width,
        height,
        mockResponse,
        cachedImagePath,
      );
      // Expect a 500 status and an error message to be sent
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.status().send).toHaveBeenCalledWith(
        'Error while generating the image',
      );
    }));
});
/******************************************************************************* */
describe('image Process Placeholder', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockResponse;
  let mockSharp;
  beforeEach(() => {
    // Mock the response object
    mockResponse = {
      set: jasmine.createSpy('set'),
      send: jasmine.createSpy('send'),
      status: jasmine.createSpy('status').and.returnValue({
        send: jasmine.createSpy('statusSend'),
      }),
    };
    // Mock sharp's resize and toBuffer methods
    mockSharp = spyOn(sharp_1.default.prototype, 'resize').and.returnValue({
      toBuffer: () =>
        __awaiter(void 0, void 0, void 0, function* () {
          return Buffer.from('mockImageBuffer');
        }),
    });
  });
  it('should resize the image and send the buffer', () =>
    __awaiter(void 0, void 0, void 0, function* () {
      const imagePath = 'path/to/image.jpg';
      const imageName = 'image.jpg';
      const width = 300;
      const height = 200;
      // Call the function
      yield (0, utilities_2.imageProcessPlaceholder)(
        imagePath,
        imageName,
        width,
        height,
        mockResponse,
      );
      // Check that sharp's resize was called correctly
      expect(mockSharp).toHaveBeenCalledWith(width, height);
      // Check that response headers are set and the image is sent
      expect(mockResponse.set).toHaveBeenCalledWith(
        'Content-Type',
        'image/jpeg',
      );
      expect(mockResponse.send).toHaveBeenCalledWith(
        Buffer.from('mockImageBuffer'),
      );
    }));
});
/******************************************************************************* */
describe('test wrong url', () => {
  it('Should return 404 as wrong URL is sent', () =>
    __awaiter(void 0, void 0, void 0, function* () {
      const response = yield (0, supertest_1.default)(main_1.default).get(
        '/http://localhost:5000',
      );
      expect(response.status).toBe(404);
    }));
});
/******************************************************************************* */
describe('testing resize endpoint', () => {
  it('returns 200 as a status for valid request', () =>
    __awaiter(void 0, void 0, void 0, function* () {
      const response = yield (0, supertest_1.default)(main_1.default).get(
        '/resize?width=700&height=2000&imageName=cat.jpg',
      );
      expect(response.status).toBe(200);
    }));
  it('returns a buffer as expected for valid request', () =>
    __awaiter(void 0, void 0, void 0, function* () {
      const response = yield (0, supertest_1.default)(main_1.default).get(
        '/resize?width=800&height=1000&imageName=cat.jpg',
      );
      expect(response.body).toBeInstanceOf(Buffer);
    }));
  it('returns 400 for missing image parameter', () =>
    __awaiter(void 0, void 0, void 0, function* () {
      const response = yield (0, supertest_1.default)(main_1.default).get(
        '/resize?width=2000&height=1500',
      );
      expect(response.status).toBe(400);
      expect(response.text).toContain(
        'Image filename is required and must be a string',
      );
    }));
  it('returns 400 for invalid width and height', () =>
    __awaiter(void 0, void 0, void 0, function* () {
      const response = yield (0, supertest_1.default)(main_1.default).get(
        '/resize?width=abc&height=xyz&imageName=cat.jpg',
      );
      expect(response.status).toBe(400);
      expect(response.text).toContain('Invalid width or height');
    }));
  it('returns 500 for non-existent image', () =>
    __awaiter(void 0, void 0, void 0, function* () {
      const response = yield (0, supertest_1.default)(main_1.default).get(
        '/resize?width=700&height=700&imageName=non-existent-image.jpg',
      );
      expect(response.status).toBe(500);
      expect(response.text).toContain('Error while generating the image');
    }));
  it('returns cached image on subsequent requests', () =>
    __awaiter(void 0, void 0, void 0, function* () {
      // First request to cache the image
      yield (0, supertest_1.default)(main_1.default).get(
        '/resize?width=500&height=500&imageName=cat.jpg',
      );
      // Second request should return cached image
      const cachedResponse = yield (0, supertest_1.default)(main_1.default).get(
        '/resize?width=2200&height=1900&imageName=cat.jpg',
      );
      expect(cachedResponse.status).toBe(200);
      expect(cachedResponse.body).toBeInstanceOf(Buffer);
    }));
  it('should process the image without throwing errors', () =>
    __awaiter(void 0, void 0, void 0, function* () {
      yield expect(() =>
        __awaiter(void 0, void 0, void 0, function* () {
          yield (0, utilities_1.default)(main_1.default);
        }),
      ).not.toThrow();
    }));
});
/******************************************************************************* */
describe('testing placeholder endpoint', () => {
  it('returns 200 for valid placeholder request', () =>
    __awaiter(void 0, void 0, void 0, function* () {
      const response = yield (0, supertest_1.default)(main_1.default).get(
        '/placeholder?imageName=cat.jpg&width=300&height=200',
      );
      expect(response.status).toBe(200);
    }));
  it('returns a buffer for placeholder request', () =>
    __awaiter(void 0, void 0, void 0, function* () {
      const response = yield (0, supertest_1.default)(main_1.default).get(
        '/placeholder?imageName=cat.jpg&width=300&height=200',
      );
      expect(response.body).toBeInstanceOf(Buffer);
    }));
  it('returns 400 for invalid width and height in placeholder', () =>
    __awaiter(void 0, void 0, void 0, function* () {
      const response = yield (0, supertest_1.default)(main_1.default).get(
        '/placeholder?width=abc&height=xyz',
      );
      expect(response.status).toBe(400);
      expect(response.text).toContain('Invalid width or height');
    }));
});
