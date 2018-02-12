import axios from 'axios';

const path = require('path');
const fs = require('fs');

const cacheImageResults = new Map();

// Remote URLs
// From: http://stackoverflow.com/a/19709846/4709891
const REMOTE_URL = /^(?:[a-z]+:)?\/\//i;

export default function getImage(url, source) {
  let fileExistsCheck = null;
  let testPath = null;

  if (!url.match(REMOTE_URL)) {
    testPath = path.join(path.dirname(source), url);
    fileExistsCheck = localFileExists;
  } else {
    testPath = url;
    fileExistsCheck = remoteFileExists;
  }

  if (cacheImageResults.has(testPath)) {
    return preservePromiseMethods(cacheImageResults.get(testPath));
  }

  return fileExistsCheck(testPath)
    .then((response) => {
      cacheImageResults.set(testPath, response);
      return response;
    })
    .catch((error) => {
      cacheImageResults.set(testPath, error);
      return error;
    })
    .then(preservePromiseMethods);
}

function preservePromiseMethods(result) {
  if (result instanceof Error) {
    return Promise.reject(result);
  }

  return Promise.resolve(result);
}

function remoteFileExists(fileURL) {
  return axios.get(fileURL, { responseType: 'arraybuffer' });
}

function localFileExists(filePath) {
  return new Promise((resolve, reject) => {
    fs.stat(filePath, (error, stat) => {
      if (error) {
        error.response = { status: 404 };
        reject(error);
      } else {
        resolve(stat);
      }
    });
  });
}
