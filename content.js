// Function to extract elements
function extractElements() {
  console.log("Extracting elements");
  let elements = segments(document.body);
  const links = Array.from(document.body.querySelectorAll("a"))
    .map((link) => link.href.trim())
    .filter((href) => href.length > 0);
  let filtered_elements = Array.from(elements)
    .map((element) =>
      element.innerText.trim().replace(/\t/g, " ").replace(/\n/g, " ")
    )
    .filter((text) => text.length > 0);

  console.log("All elements in body tag:", elements);
  console.log("Filtered text nodes from body tag:", filtered_elements);
  console.log("All links in body tag:", links);
}

// Message listener
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === "extractElements") {
    extractElements();
  } else if (request.message === "otherMessage") {
  }
});
chrome.runtime.sendMessage({ message: "analyzeTab" });
