'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.messages = exports.ruleName = undefined;
exports.default = brokenRule;

var _stylelint = require('stylelint');

var _utils = require('../../utils');

var ruleName = exports.ruleName = (0, _utils.namespace)('broken');
var messages = exports.messages = _stylelint.utils.ruleMessages(ruleName, {
  unexpected: function unexpected(imageURL) {
    return `Unexpected broken image "${imageURL}"`;
  }
});

function brokenRule(enabled) {
  return function (root, result) {
    var validOptions = _stylelint.utils.validateOptions(result, ruleName, {
      actual: enabled,
      possible: [true, false]
    });

    if (!validOptions) {
      return null;
    }

    var list = (0, _utils.generateListOfImagesURLsAndNodes)(root);

    return checkIfImagesExists(list, result).then(function (results) {
      return reportBrokenImages(results, result);
    });
  };
}

function checkIfImagesExists(list) {
  var checkList = list.map(checkIfImageExists);

  return Promise.all(checkList);
}

function checkIfImageExists(listItem) {
  return (0, _utils.getImage)(listItem.url, listItem.node.source.input.file).then(function () {}).catch(function (error) {
    if (error && error.response && error.response.status === 404) {
      return listItem;
    }

    return null;
  });
}

function reportBrokenImages(results, result) {
  results.filter(function (resultItem) {
    return !!resultItem;
  }).forEach(function (_ref) {
    var node = _ref.node,
        url = _ref.url;

    _stylelint.utils.report({ message: messages.unexpected(url), node, result, ruleName });
  });
}
//# sourceMappingURL=index.js.map