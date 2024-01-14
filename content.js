chrome.runtime.sendMessage({ message: "analyzeTab" });
// Extract elements
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === "extractElements") {
    console.log("Extract elements");
    let elements = segments(document.body);
    let filtered_elements = [];
    for (let i = 0; i < elements.length; i++) {
      let text = elements[i].innerText.trim().replace(/\t/g, " ");
      if (text.length == 0) {
        continue;
      }
      filtered_elements.push(text);
    }
    console.log(filtered_elements);
  }
});
