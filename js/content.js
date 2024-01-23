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

function highlight(element, type) {
  element.style = "";
  element.className = "dark-force-highlight";
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

  const filtered_elements = Array.from(elements)
    .map((element) => element.innerText.trim().replace(/\t/g, " "))
    .filter((text) => text.length > 0);

  // Checking for false Urgency
  var content = filtered_elements.join(" ");
  var triggeredIndex = checkForFalseUrgency(content, filtered_elements);
  if (triggeredIndex !== -1) {
    console.log("False Urgency triggered at index:", triggeredIndex);
    darkPatterns.push("False Urgency");
    nDarkPatterns = nDarkPatterns + 1;
  }

  // Alert and voice generation
  var message =
    "We have found " +
    nDarkPatterns +
    " dark patterns in this website. These Dark Patterns are " +
    darkPatterns.join(" ");
  console.log(message, voices);
  alert(message);
  var utter = new SpeechSynthesisUtterance("hi");
  utter.voice = voices[0];
  window.speechSynthesis.speak(utter);

  // highlight
  let element_index = 0;
  for (let i = 0; i < elements.length; i++) {
    let text = elements[i].innerText.trim().replace(/\t/g, " ");
    if (text.length == 0) {
      continue;
    }

    if (text === filtered_elements[triggeredIndex]) {
      highlight(elements[i], "False Urgency");
      console.log(filtered_elements[triggeredIndex]);
      console.log(elements[i], text);
      console.log(i);
    }
    element_index++;
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === "extractElements") {
    extractElements();
  } else if (request.message === "otherMessage") {
  }
});
chrome.runtime.sendMessage({ message: "analyzeTab" });
