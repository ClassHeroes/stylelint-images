'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = generateListOfImagesURLsAndNodes;
// CSS functions that can have an URL image
// From: https://github.com/postcss/postcss-url/blob/a9d1d4307b061210b1e051d1c2e9c481ca6afbf5/index.js#L26-L29
var URL_VALUE_PATTERNS = [/(url\(\s*['"]?)([^"')]+)(["']?\s*\))/g, /(AlphaImageLoader\(\s*src=['"]?)([^"')]+)(["'])/g];
// CSS properties that can have an URL image
// From: https://github.com/bezoerb/postcss-image-inliner/blob/8b825acebace2f1567195b49e47c0d454de4a3ae/index.js#L69
var URL_PROPERTY_PATTERN = /^(background(?:-image)?)|(content)|(cursor)/;

function generateListOfImagesURLsAndNodes(root) {
  var list = [];

  root.walkDecls(URL_PROPERTY_PATTERN, function (node) {
    var newList = generateList(node);

    if (newList && newList.length > 0) {
      list = list.concat(newList);
    }
  });

  return list;
}

function generateList(node) {
  return URL_VALUE_PATTERNS.filter(function (valuePattern) {
    return valuePattern.test(node.value);
  }).map(function (valuePattern) {
    return generateItems(node, valuePattern);
  })[0];
}

function generateItems(node, valuePattern) {
  var URLs = getURLs(node, valuePattern);
  var URLsAndNodes = URLs.map(function (url) {
    return { url, node };
  });

  return URLsAndNodes;
}

function getURLs(node, valuePattern) {
  var URLs = node.value.replace(valuePattern, '$2');
  var splitURLs = URLs.split(',').map(function (url) {
    return url.trim();
  });

  return splitURLs;
}
//# sourceMappingURL=generate-list-images-urls-nodes.js.map