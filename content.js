window.onload = function () {
  chrome.runtime.sendMessage({ message: "analyze_site" });
};
