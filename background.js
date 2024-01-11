const analyzedTabs = {};
console.log("Background Script");
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (request.message === "analyzeTab") {
    console.log("inside Analzer");
    const tabId = sender.tab.id;
    if (!analyzedTabs[tabId]) {
      analyzedTabs[tabId] = true;
      chrome.tabs.sendMessage(tabId, { message: "extractElements" });
    }
  }
  console.log(message);
  sendResponse({ message: "Response from background JS" });
});

chrome.tabs.onRemoved.addListener((tabId) => {
  delete analyzedTabs[tabId];
});
console.log("outside Analzer");
