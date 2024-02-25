function extractElements() {
  const synth = window.speechSynthesis;
  if (synth.onvoiceschanged !== undefined) {
    synth.onvoiceschanged = function () {
      const voices = synth.getVoices();
      processElements(voices);
    };
  }
}

function processElements(voices) {
  createContentBox();
  var speak = new SpeechSynthesisUtterance();
  let elements = segments(document.body);

  const links = Array.from(document.body.querySelectorAll("a"))
    .map((link) => link.href.trim())
    .filter((href) => href.length > 0);

  let filtered_elements = Array.from(elements)
    .map((element) => element.innerText.replace(/\t/g, " ").replace(/\n/g, " "))
    .filter((text) => text.length > 0);
  var bol, sum;
  console.log("filtered elements data is being to server");
  fetch("http://127.0.0.1:5000", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tokens: filtered_elements }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("predictions received from server");
      let d1 = 0;
      let d2 = 0;
      let d3 = 0;
      let d4 = 0;
      if (Array.isArray(data)) {
        data.forEach((item) => {
          const token = item.token;
          const prediction = item.prediction;
          if (prediction === 0) {
            d1 += 1;
          } else if (prediction === 2) {
            d3 += 1;
          } else if (prediction === 3) {
            d4 += 1;
          } else {
            d2 += 1;
          }

          let arr = [d1, d2, d3, d4];

          updateContentBox(arr);
          let matchingIndex = filtered_elements.indexOf(token);
          for (let j = 0; j < elements.length; j++) {
            let text = elements[j].innerText
              .replace(/\t/g, " ")
              .replace(/\n/g, " ");
            if (text.length > 0 && text === filtered_elements[matchingIndex]) {
              highlight(elements[j], getColor(prediction));
            }
          }
        });
      } else {
        console.error("Invalid response format:", data);
      }
      sum = d1 + d3 + d4;
      message =
        "we have found" +
        sum +
        "dark patterns in this website , remaining details are present in overlay";
      var utter = new SpeechSynthesisUtterance(message);
      utter.voice = voices[0];
      window.speechSynthesis.speak(utter);
    })
    .catch((error) => {
      console.error("Fetch error:", error);
    });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === "extractElements") {
    extractElements();
  }
});
chrome.runtime.sendMessage({ message: "analyzeTab" });
