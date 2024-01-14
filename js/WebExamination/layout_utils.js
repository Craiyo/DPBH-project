const blockElements = [
  "div",
  "section",
  "article",
  "aside",
  "nav",
  "header",
  "footer",
  "main",
  "form",
  "fieldset",
  "table",
];

const ignoredElements = ["script", "style", "noscript", "br", "hr"];

const winWidth = window.innerWidth;
const winHeight = window.innerHeight;
const winArea = winWidth * winHeight;

var isInteractable = function (element) {
  function isEnabled(element) {
    var disabledSupportElements = [
      "button",
      "input",
      "optgroup",
      "option",
      "select",
      "textarea",
    ];
    var tagName = element.tagName.toLowerCase();

    if (!disabledSupportElements.includes(tagName)) {
      return true;
    }

    if (element.getAttribute("disabled")) {
      return false;
    }

    if (
      (element.parentElement && tagName === "optgroup") ||
      tagName === "option"
    ) {
      return isEnabled(element.parentElement);
    }

    return true;
  }

  function arePointerEventsDisabled(element) {
    var style = window.getComputedStyle(element);
    if (!style) {
      return false;
    }

    return style.pointerEvents === "none";
  }

  return (
    isShown(element) && isEnabled(element) && !arePointerEventsDisabled(element)
  );
};

var isPixel = function (element) {
  var rect = element.getBoundingClientRect();
  var height = rect.bottom - rect.top;
  var width = rect.right - rect.left;

  return height === 1 && width === 1;
};

var containsBlockElements = function (element, visibility = true) {
  for (var be of blockElements) {
    var children = Array.from(element.getElementsByTagName(be));
    if (visibility) {
      for (child of children) {
        if (isShown(child)) return true;
      }
    } else {
      return children.length > 0 ? true : false;
    }
  }

  return false;
};

var isWhitespace = function (element) {
  return (
    element.nodeType === element.TEXT_NODE &&
    element.textContent.trim().length === 0
  );
};

var allIgnoreChildren = function (element) {
  if (element.children.length === 0) {
    return false;
  } else {
    for (var child of element.children) {
      if (ignoredElements.includes(child.tagName.toLowerCase())) {
        continue;
      } else {
        return false;
      }
    }
    return true;
  }
};

var segments = function (element) {
  if (!element) {
    return [];
  }

  var tag = element.tagName.toLowerCase();
  if (!ignoredElements.includes(tag) && !isPixel(element) && isShown(element)) {
    if (blockElements.includes(tag)) {
      if (!containsBlockElements(element)) {
        if (allIgnoreChildren(element)) {
          return [];
        } else {
          if (getElementArea(element) / winArea > 0.3) {
            var result = [];

            for (var child of element.children) {
              result = result.concat(segments(child));
            }

            return result;
          } else {
            return [element];
          }
        }
      } else if (containsTextNodes(element)) {
        return [element];
      } else {
        var result = [];

        for (var child of element.children) {
          result = result.concat(segments(child));
        }

        return result;
      }
    } else {
      if (containsBlockElements(element, false)) {
        var result = [];

        for (var child of element.children) {
          result = result.concat(segments(child));
        }

        return result;
      } else {
        if (getElementArea(element) / winArea > 0.3) {
          var result = [];

          for (var child of element.children) {
            result = result.concat(segments(child));
          }

          return result;
        } else {
          return [element];
        }
      }
    }
  } else {
    return [];
  }
};

var getRandomSubarray = function (arr, size) {
  var shuffled = arr.slice(0),
    i = arr.length,
    temp,
    index;
  while (i--) {
    index = Math.floor((i + 1) * Math.random());
    temp = shuffled[index];
    shuffled[index] = shuffled[i];
    shuffled[i] = temp;
  }
  return shuffled.slice(0, size);
};

var elementCombinations = function (arguments) {
  var r = [],
    arg = arguments,
    max = arg.length - 1;

  function helper(arr, i) {
    for (var j = 0, l = arg[i].length; j < l; j++) {
      var a = arr.slice(0);
      a.push(arg[i][j]);
      if (i === max) {
        r.push(a);
      } else helper(a, i + 1);
    }
  }
  helper([], 0);

  return r.length === 0 ? arguments : r;
};

var containsTextNodes = function (element) {
  if (element) {
    if (element.hasChildNodes()) {
      var nodes = [];
      for (var cnode of element.childNodes) {
        if (cnode.nodeType === Node.TEXT_NODE) {
          var text = filterText(cnode.nodeValue);
          if (text.length !== 0) {
            nodes.push(text);
          }
        }
      }

      return nodes.length > 0 ? true : false;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

var filterText = function (text) {
  return text.replace(/(\r\n|\n|\r)/gm, "").trim();
};
