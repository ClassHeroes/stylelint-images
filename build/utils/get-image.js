'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getImage;

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var path = require('path');
var fs = require('fs');

var cacheImageResults = new Map();

// Remote URLs
// From: http://stackoverflow.com/a/19709846/4709891
var REMOTE_URL = /^(?:[a-z]+:)?\/\//i;

function getImage(url, source) {
  var fileExistsCheck = null;
  var testPath = null;

  if (cacheImageResults.has(url)) {
    return preservePromiseMethods(cacheImageResults.get(url));
  }

  if (!url.match(REMOTE_URL)) {
    testPath = path.join(path.dirname(source), url);
    fileExistsCheck = localFileExists;
  } else {
    testPath = url;
    fileExistsCheck = remoteFileExists;
  }

  return fileExistsCheck(testPath).then(function (response) {
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

function remoteFileExists(fileURL) {
  return _axios2.default.get(fileURL, { responseType: 'arraybuffer' });
}

function localFileExists(filePath) {
  return new Promise(function (resolve, reject) {
    fs.stat(filePath, function (error, stat) {
      if (error) {
        error.response = { status: 404 };
        reject(error);
      } else {
        resolve(stat);
      }
    });
  });
}
//# sourceMappingURL=get-image.js.map