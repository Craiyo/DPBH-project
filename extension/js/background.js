console.log("Background Script");

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("inside Analyzer");
  if (request.message === "analyzeTab") {
    chrome.tabs.query(
      { active: true, lastFocusedWindow: true },
      function (tabs) {
        var url = tabs[0].url;
        if (isIndianEcommerceWebsite(url)) {
          const tabId = tabs[0].id;
          console.log(tabId);
          chrome.tabs.sendMessage(tabId, { message: "extractElements" });
        }
      }
    );
  }
});

function isIndianEcommerceWebsite(url) {
  const websites = ["flipkart.com", "amazon.in", "snapdeal.com", "myntra.com"];
  const domain = new URL(url).hostname;
  return websites.some((website) => domain.includes(website));
}
