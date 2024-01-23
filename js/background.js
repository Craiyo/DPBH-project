console.log("Background Script");
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("inside Analzer");
  console.log(sender);
  if (request.message === "analyzeTab") {
    console.log("inside if Analzer");
    const tabId = sender.tab.id;
    console.log(tabId);
    console.log("Sending 'extractElements' message to tab", tabId);
    chrome.tabs.sendMessage(tabId, { message: "extractElements" });
  }
  console.log(request.message);
});


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'showPopup') {
    chrome.browserAction.setPopup({ popup: 'popup.html' });
    chrome.runtime.sendMessage({ action: 'popupMessage', message: message.message });
  }
});

// chrome.tabs.onRemoved.addListener((tabId) => {
//   delete analyzedTabs[tabId];
// });
// console.log("outside Analzer");
