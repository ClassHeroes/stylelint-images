'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getImage;

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cacheImageResults = new Map();

function getImage(url) {
  if (cacheImageResults.has(url)) {
    return preservePromiseMethods(cacheImageResults.get(url));
  }

  return _axios2.default.get(url, { responseType: 'arraybuffer' }).then(function (response) {
    cacheImageResults.set(url, response);
    return response;
  }).catch(function (error) {
    cacheImageResults.set(url, error);
    return error;
  }).then(preservePromiseMethods);
}

function preservePromiseMethods(result) {
  if (result instanceof Error) {
    return Promise.reject(result);
  }

  return Promise.resolve(result);
}
//# sourceMappingURL=get-image.js.map