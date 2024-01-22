// style-utils.js

var getBackgroundColor = function (element) {
  var style = window.getComputedStyle(element);
  var tagName = element.tagName.toLowerCase();

  if (style === null || style.backgroundColor === "transparent") {
    var parent = element.parentElement;
    return parent === null || tagName === "body"
      ? "rgb(255, 255, 255)"
      : getBackgroundColor(parent);
  } else {
    return style.backgroundColor;
  }
};

var isShown = function (element) {
    var displayed = function (element, style) {
      if (!style) {
        style = window.getComputedStyle(element);
      }
  
      if (style.display === "none") {
        return false;
      } else {
        var parent = element.parentNode;
  
        if (parent && parent.nodeType === Node.DOCUMENT_NODE) {
          return true;
        }
  
        return parent && displayed(parent, null);
      }
    };
  
    var getOpacity = function (element, style) {
      if (!style) {
        style = window.getComputedStyle(element);
      }
  
      if (style.position === "relative") {
        return 1.0;
      } else {
        return parseFloat(style.opacity);
      }
    };
  
    var positiveSize = function (element, style) {
      if (!style) {
        style = window.getComputedStyle(element);
      }
  
      var tagName = element.tagName.toLowerCase();
      var rect = getClientRect(element);
      if (rect.height > 0 && rect.width > 0) {
        return true;
      }
  
      if (tagName == "path" && (rect.height > 0 || rect.width > 0)) {
        var strokeWidth = element.strokeWidth;
        return !!strokeWidth && parseInt(strokeWidth, 10) > 0;
      }
  
      return (
        style.overflow !== "hidden" &&
        Array.from(element.childNodes).some(
          (n) =>
            (n.nodeType === Node.TEXT_NODE && !!filterText(n.nodeValue)) ||
            (n.nodeType === Node.ELEMENT_NODE &&
              positiveSize(n) &&
              window.getComputedStyle(n).display !== "none")
        )
      );
    };
  
    var getOverflowState = function (element) {
      var region = getClientRect(element);
      var htmlElem = document.documentElement;
      var bodyElem = document.body;
      var htmlOverflowStyle = window.getComputedStyle(htmlElem).overflow;
      var treatAsFixedPosition;
  
      function getOverflowParent(e) {
        var position = window.getComputedStyle(e).position;
        if (position === "fixed") {
          treatAsFixedPosition = true;
          return e == htmlElem ? null : htmlElem;
        } else {
          var parent = e.parentElement;
  
          while (parent && !canBeOverflowed(parent)) {
            parent = parent.parentElement;
          }
  
          return parent;
        }
  
        function canBeOverflowed(container) {
          if (container == htmlElem) {
            return true;
          }
  
          var style = window.getComputedStyle(container);
          var containerDisplay = style.display;
          if (containerDisplay.startsWith("inline")) {
            return false;
          }
  
          if (position === "absolute" && style.position === "static") {
            return false;
          }
  
          return true;
        }
      }
  
      function getOverflowStyles(e) {
        var overflowElem = e;
        if (htmlOverflowStyle === "visible") {
          if (e == htmlElem && bodyElem) {
            overflowElem = bodyElem;
          } else if (e == bodyElem) {
            return {
              x: "visible",
              y: "visible",
            };
          }
        }
  
        var ostyle = window.getComputedStyle(overflowElem);
        var overflow = {
          x: ostyle.overflowX,
          y: ostyle.overflowY,
        };
  
        if (e == htmlElem) {
          overflow.x = overflow.x === "visible" ? "auto" : overflow.x;
          overflow.y = overflow.y === "visible" ? "auto" : overflow.y;
        }
  
        return overflow;
      }
  
      function getScroll(e) {
        if (e == htmlElem) {
          return {
            x: htmlElem.scrollLeft,
            y: htmlElem.scrollTop,
          };
        } else {
          return {
            x: e.scrollLeft,
            y: e.scrollTop,
          };
        }
      }
  
      for (
        var container = getOverflowParent(element);
        !!container;
        container = getOverflowParent(container)
      ) {
        var containerOverflow = getOverflowStyles(container);
  
        if (
          containerOverflow.x === "visible" &&
          containerOverflow.y === "visible"
        ) {
          continue;
        }
  
        var containerRect = getClientRect(container);
  
        if (containerRect.width == 0 || containerRect.height == 0) {
          return "hidden";
        }
  
        var underflowsX = region.right < containerRect.left;
        var underflowsY = region.bottom < containerRect.top;
  
        if (
          (underflowsX && containerOverflow.x === "hidden") ||
          (underflowsY && containerOverflow.y === "hidden")
        ) {
          return "hidden";
        } else if (
          (underflowsX && containerOverflow.x !== "visible") ||
          (underflowsY && containerOverflow.y !== "visible")
        ) {
          var containerScroll = getScroll(container);
          var unscrollableX =
            region.right < containerRect.left - containerScroll.x;
          var unscrollableY =
            region.bottom < containerRect.top - containerScroll.y;
          if (
            (unscrollableX && containerOverflow.x !== "visible") ||
            (unscrollableY && containerOverflow.x !== "visible")
          ) {
            return "hidden";
          }
  
          var containerState = getOverflowState(container);
          return containerState === "hidden" ? "hidden" : "scroll";
        }
  
        var overflowsX = region.left >= containerRect.left + containerRect.width;
        var overflowsY = region.top >= containerRect.top + containerRect.height;
  
        if (
          (overflowsX && containerOverflow.x === "hidden") ||
          (overflowsY && containerOverflow.y === "hidden")
        ) {
          return "hidden";
        } else if (
          (overflowsX && containerOverflow.x !== "visible") ||
          (overflowsY && containerOverflow.y !== "visible")
        ) {
          if (treatAsFixedPosition) {
            var docScroll = getScroll(container);
            if (
              region.left >= htmlElem.scrollWidth - docScroll.x ||
              region.right >= htmlElem.scrollHeight - docScroll.y
            ) {
              return "hidden";
            }
          }
  
          var containerState = getOverflowState(container);
          return containerState === "hidden" ? "hidden" : "scroll";
        }
      }
  
      return "none";
    };
  
    function hiddenByOverflow(element) {
      return (
        getOverflowState(element) === "hidden" &&
        Array.from(element.childNodes).every(
          (n) =>
            n.nodeType !== Node.ELEMENT_NODE ||
            hiddenByOverflow(n) ||
            !positiveSize(n)
        )
      );
    }
  
    var tagName = element.tagName.toLowerCase();
  
    if (tagName === "body") {
      return true;
    }
  
    if (tagName === "input" && element.type.toLowerCase() === "hidden") {
      return false;
    }
  
    if (tagName === "noscript" || tagName === "script" || tagName === "style") {
      return false;
    }
  
    var style = window.getComputedStyle(element);
  
    if (style == null) {
      return false;
    }
  
    if (style.visibility === "hidden" || style.visibility === "collapse") {
      return false;
    }
  
    if (!displayed(element, style)) {
      return false;
    }
  
    if (getOpacity(element, style) === 0.0) {
      return false;
    }
  
    if (!positiveSize(element, style)) {
      return false;
    }
  
    return !hiddenByOverflow(element);
  };
