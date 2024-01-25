// dom-utils.js

var getElementArea = function (element) {
  var rect = element.getBoundingClientRect();
  return rect.height * rect.width;
};

var getClientRect = function (element) {
  if (element.tagName.toLowerCase() === "html") {
    var w = Math.max(
      document.documentElement.clientWidth,
      window.innerWidth || 0
    );
    var h = Math.max(
      document.documentElement.clientHeight,
      window.innerHeight || 0
    );

    return {
      top: 0,
      left: 0,
      bottom: h,
      right: w,
      width: w,
      height: h,
      x: 0,
      y: 0,
    };
  } else {
    return element.getBoundingClientRect();
  }
};

var getVisibleChildren = function (element) {
  if (element) {
    var children = Array.from(element.children);
    return children.filter((child) => isShown(child));
  } else {
    return [];
  }
};

var getParents = function (node) {
  const result = [];
  while ((node = node.parentElement)) {
    result.push(node);
  }
  return result;
};
