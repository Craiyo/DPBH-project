// Function to extract elements
const descriptions = {
  Sneaking:
    "Coerces users to act in ways that they would not normally act by obscuring information.",
  "False Urgency":
    "Places deadlines on things to make them appear more desirable",
  Misdirection:
    "Aims to deceptively incline a user towards one choice over the other.",
  "Social Proof":
    "Gives the perception that a given action or product has been approved by other people.",
  Scarcity:
    "Tries to increase the value of something by making it appear to be limited in availability.",
  Obstruction:
    "Tries to make an action more difficult so that a user is less likely to do that action.",
  "Forced Action":
    "Forces a user to complete extra, unrelated tasks to do something that should be simple.",
};

const endpoint = "http://localhost:5000/dark-patterns";

function highlight(element, type) {
  element.style = " ";
  element.classList.add("dark-force-highlight");
  element.style.backgroundColor = "#f7e660";
  let body = document.createElement("span");
  body.classList.add("dark-force-highlight-body");
  /* content */
  let content = document.createElement("div");
  content.classList.add("modal-content");
  content.innerHTML = type;
  body.appendChild(content);

  element.appendChild(body);
}

function extractElements() {
  // Selecting voice for speech
  const synth = window.speechSynthesis;

  // Wait for voices to be loaded
  if (synth.onvoiceschanged !== undefined) {
    synth.onvoiceschanged = function () {
      // Now get the voices
      const voices = synth.getVoices();
      console.log(voices);

      // Call the function to process elements after voices are loaded
      processElements(voices);
    };
  } else {
    // If onvoiceschanged is not supported, try getting voices immediately
    const voices = synth.getVoices();
    console.log(voices);

    // Call the function to process elements
    processElements(voices);
  }
}

function processElements(voices) {
  var darkPatterns = [];
  let nDarkPatterns = 0;
  console.log("Extracting elements");
  let elements = segments(document.body);

  const links = Array.from(document.body.querySelectorAll("a"))
    .map((link) => link.href.trim())
    .filter((href) => href.length > 0);

  let filtered_elements = Array.from(elements)
    .map((element) => element.innerText.trim().replace(/\t/g, " "))
    .filter((text) => text.length > 0);

  // Define a global array to store the indices
  let matchingIndices = [];

  fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tokens: filtered_elements }),
  })
    .then((resp) => resp.json())
    .then((data) => {
      if (Array.isArray(data)) {
        data.forEach((item, index) => {
          let token = item["token"];
          let prediction = item["prediction"];
          // console.log(token, prediction, sena);
          // prediction 0 is scarcity
          if (prediction === 0) {
            let matchingIndex = filtered_elements.indexOf(token);
            if (matchingIndex !== -1) {
              matchingIndices.push(matchingIndex);
            }
          }
        });
        console.log("Matching Indices:", matchingIndices);
        let element_index = 0;

        for (let i = 0; i < matchingIndices.length; i++) {
          console.log("inside matchingIndices:");
          for (let j = 0; j < elements.length; j++) {
            console.log("inside elements");
            let text = elements[j].innerText.trim().replace(/\t/g, " ");

            if (text.length > 0) {
              // Check if the text matches the value in filtered_elements
              if (text === filtered_elements[matchingIndices[i]]) {
                console.log(elements[j]);
                console.log(filtered_elements[matchingIndices[i]]);
                highlight(elements[j], "False Urgency");
              }
            }
            element_index++;
          }
        }

        if (matchingIndices.length != 0) {
          console.log("False Urgency triggered at index:", matchingIndices);
          darkPatterns.push("False Urgency");
          nDarkPatterns = nDarkPatterns + 1;
        }
      } else {
        console.error("Invalid response format:", data);
      }
    })
    .catch((error) => {
      console.error("Fetch error:", error);
    });

  // Checking for false Urgency

  // // checking for drip pricing
  // const isDripPricingDetected = detectDripPricing(document);
  // if (isDripPricingDetected) {
  //   darkPatterns.push("Drip Pricing");
  //   nDarkPatterns = nDarkPatterns + 1;
  // }

  // Alert and voice generation
  // var message =
  //   "We have found " +
  //   nDarkPatterns +
  //   " dark patterns in this website. " +
  //   darkPatterns.join(", ") +
  //   " may exist.";
  // // var utter = new SpeechSynthesisUtterance(message);
  // // utter.voice = voices[12];
  // // window.speechSynthesis.speak(utter);
  // alert(message);

  // highlight
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === "extractElements") {
    extractElements();
  } else if (request.message === "otherMessage") {
  }
});
chrome.runtime.sendMessage({ message: "analyzeTab" });
