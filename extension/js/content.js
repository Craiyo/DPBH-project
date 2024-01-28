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

function highlight(element, color) {
  element.style = " ";
  element.classList.add("dark-force-highlight");
  element.style.backgroundColor = color;
  let body = document.createElement("span");
  body.classList.add("dark-force-highlight-body");
  /* content */
  let content = document.createElement("div");
  content.classList.add("modal-content");
  content.innerHTML = "This is a dark Pattern";
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

function createContentBox() {
  let contentBox = document.getElementById("extensionContentBox");

  if (!contentBox) {
    contentBox = document.createElement("div");
    contentBox.id = "extensionContentBox";
    contentBox.innerHTML = "<p>Analyzing this Website...</p>";
    styleContentBox(contentBox);
    positionContentBox(contentBox);
    document.body.appendChild(contentBox);
  }
}

function styleContentBox(contentBox) {
  contentBox.style.backgroundColor = "rgba(255, 0, 0, 0.7)";
  contentBox.style.border = "2px solid #ff0000";
  contentBox.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
  contentBox.style.padding = "10px";
  contentBox.style.color = "#ffffff";
  contentBox.style.borderRadius = "8px";
}

function positionContentBox(contentBox) {
  contentBox.style.position = "fixed"; // or 'absolute'
  contentBox.style.top = "10px"; // Adjust as needed
  contentBox.style.left = "10px"; // Adjust as needed
  contentBox.style.zIndex = "9999";
}

function updateContentBox(data) {
  let contentBox = document.getElementById("extensionContentBox");
  contentBox.innerHTML =
    "<p>Website analyzed...</p>" + generateContentHTML(data);
}

function generateContentHTML(data) {
  const arr = ["False Urgency", "Misdirection", "Forced Action"];
  const listItemColor = "white";

  let newContentHTML = "";
  if (data && data.length > 0) {
    newContentHTML = `<ul style="color: ${listItemColor};">`;
    data.forEach((item, index) => {
      newContentHTML += `<li>${arr[index]} :- ${item}</li>`;
    });
    newContentHTML += "</ul>";
  }
  return newContentHTML;
}


function processElements(voices) {
  createContentBox();
  console.log("Extracting elements");
  let elements = segments(document.body);

  const links = Array.from(document.body.querySelectorAll("a"))
    .map((link) => link.href.trim())
    .filter((href) => href.length > 0);

  let filtered_elements = Array.from(elements)
    .map((element) => element.innerText.trim().replace(/\t/g, " "))
    .filter((text) => text.length > 0);

  // Define a global array to store the indices

  fetch("http://localhost:5000", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tokens: filtered_elements }),
  })
    .then((response) => response.json())
    .then((data) => {
      let d1 = 0;
      let d2 = 0;
      let d3 = 0;
      if (
        data &&
        Array.isArray(data.tokens) &&
        Array.isArray(data.predictions)
      ) {
        data.tokens.forEach((token, index) => {
          let prediction = data.predictions[index];
          console.log(token, prediction);
          if ((prediction === 0) | (prediction === 3) | (prediction === 7)) {
            if (prediction === 0) {
              d1 += 1;
            } else if (prediction === 3) {
              d2 += 1;
            } else if (prediction === 7) {
              d3 += 1;
            }
            arr = [d1, d2, d3];
            updateContentBox(arr);
            let matchingIndex = filtered_elements.indexOf(token);
            for (let j = 0; j < elements.length; j++) {
              let text = elements[j].innerText.trim().replace(/\t/g, " ");
              if (
                text.length > 0 &&
                text === filtered_elements[matchingIndex]
              ) {
                highlight(elements[j], getColor(prediction));
              }
            }
          }
        });
      } else {
        console.error("Invalid response format:", data);
      }
    })
    .catch((error) => {
      console.error("Fetch error:", error);
    });
}

function getColor(prediction) {
  switch (prediction) {
    case 0:
      return "red"; // Adjust color for False Urgency
    case 3:
      return "yellow"; // Adjust color for Misdirection
    case 7:
      return "orange"; // Adjust color for Forced Action
    default:
      return "gray"; // Default color
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === "extractElements") {
    extractElements();
  } else if (request.message === "otherMessage") {
  }
});
chrome.runtime.sendMessage({ message: "analyzeTab" });
