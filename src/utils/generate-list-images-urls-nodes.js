// CSS functions that can have an URL image
// From: https://github.com/postcss/postcss-url/blob/a9d1d4307b061210b1e051d1c2e9c481ca6afbf5/index.js#L26-L29
const URL_VALUE_PATTERNS = [
  /(url\(\s*['"]?)([^"')]+)(["']?\s*\))/g,
  /(AlphaImageLoader\(\s*src=['"]?)([^"')]+)(["'])/g
];
// CSS properties that can have an URL image
// From: https://github.com/bezoerb/postcss-image-inliner/blob/8b825acebace2f1567195b49e47c0d454de4a3ae/index.js#L69
const URL_PROPERTY_PATTERN = /^(background(?:-image)?)|(content)|(cursor)/;

export default function generateListOfImagesURLsAndNodes(root) {
  let list = [];

  root.walkDecls(URL_PROPERTY_PATTERN, (node) => {
    const newList = generateList(node);

    if (newList && newList.length > 0) {
      list = list.concat(newList);
    }
  });

  return list;
}

function generateList(node) {
  return URL_VALUE_PATTERNS
    .filter(valuePattern => valuePattern.test(node.value))
    .map(valuePattern => generateItems(node, valuePattern))[0];
}

function generateItems(node, valuePattern) {
  const URLs = getURLs(node, valuePattern);
  const URLsAndNodes = URLs.map(url => ({ url, node }));

  return URLsAndNodes;
}

function getURLs(node, valuePattern) {
  const v = node.value.match(valuePattern)[0];
  const URLs = v.replace(valuePattern, '$2');
  const splitURLs = URLs.split(',').map(url => url.trim());

  return splitURLs;
}
