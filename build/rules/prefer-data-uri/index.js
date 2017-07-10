'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.messages = exports.ruleName = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = ruleDataURI;

var _stylelint = require('stylelint');

var _lodash = require('lodash');

var _utils = require('../../utils');

var ruleName = exports.ruleName = (0, _utils.namespace)('prefer-data-uri');
var messages = exports.messages = _stylelint.utils.ruleMessages(ruleName, {
  expected: function expected(imageURL) {
    return `Expected image "${imageURL}" to be as data-URI.`;
  }
});

function ruleDataURI(limitBytes) {
  return function (root, result) {
    var validOptions = _stylelint.utils.validateOptions(result, ruleName, {
      actual: limitBytes,
      possible: [_lodash.isNumber]
    });

    if (!validOptions) {
      return null;
    }

    var list = (0, _utils.generateListOfImagesURLsAndNodes)(root);

    return checkImagesSizes(list, result).then(function (results) {
      return reportImagesWithSizeGreaterThan(results, result, limitBytes);
    });
  };
}

function checkImagesSizes(list) {
  var checkList = list.map(getImageAndSize);

  return Promise.all(checkList);
}

function getImageAndSize(listItem) {
  return (0, _utils.getImage)(listItem.url).then(function (response) {
    return _extends({}, listItem, {
      bytesSize: response.data.length
    });
  }).catch(function () {});
}

function reportImagesWithSizeGreaterThan(results, result, limitBytes) {
  results.filter(function (resultItem) {
    return !!resultItem;
  }).forEach(function (_ref) {
    var node = _ref.node,
        url = _ref.url,
        bytesSize = _ref.bytesSize;

    if (bytesSize < limitBytes) {
      _stylelint.utils.report({ message: messages.expected(url), node, result, ruleName });
    }
  });
}
//# sourceMappingURL=index.js.map