chrome.runtime.sendMessage({ message: "analyzeTab" });
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === "extractElements") {
    console.log("inside content loaded");
    var paragraphs = document.querySelectorAll("a");
    var extractedText = Array.from(paragraphs)
      .map((p) => p.textContent)
      .join("\n");
    console.log("Extracted Text:", extractedText);
  }
});
