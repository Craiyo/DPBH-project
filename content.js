// document.addEventListener("DOMContentLoaded", function () {
console.log("dom content loaded");
chrome.runtime.sendMessage({ message: "analyzeTab" }, (response) => {
  console.log(response.message);
});
// });
console.log("outside content loaded");
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (request.message === "extractElements") {
    console.log("inside content loaded");
    // Your element extraction logic goes here
    // Example: Extracting all paragraph text from the current page
    var paragraphs = document.querySelectorAll("p");
    var extractedText = Array.from(paragraphs)
      .map((p) => p.textContent)
      .join("\n");
    console.log("Extracted Text:", extractedText);
  }
});
