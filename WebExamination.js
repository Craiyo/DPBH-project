// background.js
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === "popup_open") {
    // Handle the "popup_open" message
    console.log("Popup is open!");
  }
});
