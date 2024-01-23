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
  checkAndLogFalseUrgency(filtered_elements);
  
  const isDripPricingDetected = detectDripPricing(document);
  if (isDripPricingDetected) {
    console.log('Drip pricing detected!');
    window.alert('Drip pricing detected!');
  }
}

function containsDripPricingPattern(text) {
  const dripPricingKeywords = [
    "additional fees", "extra charges", "hidden costs",
    "fees may apply",
    "shipping and handling",
    "taxes not included",
    "service charges",
    "processing fees",
    "membership fees",
    "reservation fees",
    "convenience fees",
    "upgrade fees",
    "fuel surcharge",
    "facility fees",
    "booking fees",
    "administrative fees",
    "subscription fees",
    "maintenance fees",
    "surcharge",
    "fine print",
    "terms and conditions apply"
  ];
  return dripPricingKeywords.some(keyword => text.toLowerCase().includes(keyword));
}

function detectDripPricing() {
  // Option 1: Multiple Price Components
  const priceElements = document.querySelectorAll('.price, .shipping, .taxes');
  if (priceElements.length > 1) {
    sendMessageToBackground('Drip pricing detected!');
    return true;
  }

  // Option 2: Dynamic Price Changes
  const totalPriceElement = document.getElementById('totalPrice');
  if (totalPriceElement) {
    totalPriceElement.addEventListener('change', () => {
      sendMessageToBackground('Drip pricing detected!');
      return true;
    });
  }

  // Option 3: Delayed Price Information
  const shippingOptions = document.getElementById('shippingOptions');
  if (shippingOptions) {
    shippingOptions.addEventListener('change', () => {
      sendMessageToBackground('Drip pricing detected!');
      return true;
    });
  }

  // Option 4: Check for Phrases or Keywords
  const pageText = document.body.innerText.toLowerCase();
  if (containsDripPricingPattern(pageText)) {
    sendMessageToBackground('Drip pricing detected!');
    console.log('Drip pricing detected!');  // Add this line for debugging
    return true;
  }

  // drip pricing not detected
  return false;
}

function sendMessageToBackground(message) {
  chrome.runtime.sendMessage({ action: 'showPopup', message: message });
}

function checkAndLogFalseUrgency(content) {
  if (checkForFalseUrgency(content.join(' '), falseUrgencyIndicators)) {
    console.log("False urgency detected on this page!");
    window.alert("False urgency detected on this page!");
  }
  else{
    console.log("False urgency might not  detected on this page!");
  }
}

const falseUrgencyIndicators = [
  "limited-time offer",
  "only \\d+ items left",  // Example: Matches "only 5 items left"
  "exclusive deal",
  "don't miss out",
  "act now",
  "hurry, offer ends soon",
  "sale ends today",
  "last chance",
  "offer expires",
  "get it before it's gone",
  "while supplies last",
  "deal of the day",
  "special promotion",
  "today only",
  "flash sale",
  "time-limited offer",
  "limited stock available",
  "expires at midnight",
  "early bird special",
  "final hours",
  "instant savings",
  "guaranteed",
  "unbeatable",
  "never before seen",
  "exclusive offer",
  "won't believe your eyes",
  "one-time offer",
  "don't wait",
  "new lower price",
  "lowest price ever",
  "price drop",
  "today's deal",
  "clearance",
  "going out of business",
  "liquidation",
  "everything must go",
  "50% off (or more)",
  "special discount",
  "secret sale",
  "hidden offer",
  "urgent",
  "don't delay",
  "must end soon",
  "limited quantity",
  "instant rebate",
  "member only",
  "new offer every day",
  "lowest price guaranteed",
  "exclusive access",
  "free gift",
  "bonus",
  "double your order",
  "order today and get a free gift",
  "risk-free",
  "money-back guarantee",
  "100% satisfaction guarantee",
  "no obligation",
  "no strings attached",
  "cancel anytime",
  "terms and conditions apply",
  "see website for details",
  "claim your discount",
  "secret code",
  "act fast",
  "don't hesitate",
  "final sale",
  "limited time only",
  "exclusively for you",
  "get yours now",
  "instant approval",
  "reserve now",
  "confirm your order",
  "unlock savings",
  "offer ends tonight",
  "buy now, pay later",
  "limited-time price",
  "insider access",
  "exclusive early access",
  "first come, first served",
  "for a limited time only",
  "don't pass up",
  "special introductory offer",
  "exclusive member deal",
  "vip offer",
  "pre-sale",
  "invitation-only",
  "exclusive pre-launch",
  "limited-time bonus",
  "exclusive savings",
  "get exclusive access",
  "never to be repeated",
  "only available to subscribers",
  "24-hour special",
  "today's exclusive",
  "deal expires tonight",
  "midnight madness sale",
  "special 1-day offer",
  "early access deal",
  "today's featured deal",
  "limited-time surprise",
  "exclusive flash event",
  "members-only flash sale",
  "exclusive weekend pricing",
  "secret member discount",
  "limited-time app offer",
  "exclusive app deal",
  "today's secret sale",
  "early bird savings",
  "limited-time member price",
  "exclusive holiday offer",
  "limited-time holiday deal",
  "VIP holiday sale",
  "exclusive Black Friday savings",
  "Cyber Monday special",
  "12 Days of Deals",
  "limited-time winter sale",
  "holiday countdown offer",
  "today's holiday surprise",
  "exclusive New Year deal",
  "limited-time Valentine's Day offer",
  "spring clearance event",
  "summer flash sale",
  "back-to-school special",
  "fall exclusive deal",
  "holiday gift guide special",
  "today's exclusive anniversary offer",
  "limited-time birthday discount",
  "exclusive loyalty member deal",
  "limited-time reward member offer",
  "today's loyalty program special",
  "exclusive referral program discount",
  "limited-time friend referral offer",
  "exclusive social media follower deal",
  "today's Twitter/Facebook/Instagram offer",
  "limited-time email subscriber special",
  "today's newsletter subscriber deal",
];
function checkForFalseUrgency(content, indicators) {
  for (var i = 0; i < indicators.length; i++) {
      var indicator = new RegExp(indicators[i], 'i'); // 'i' flag for case-insensitive matching

      if (indicator.test(content)) {
          return true; // Found a false urgency indicator
      }
  }
  return false; // No false urgency indicators found
}
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === "extractElements") {
    extractElements();
  } else if (request.message === "otherMessage") {
  }
});
chrome.runtime.sendMessage({ message: "analyzeTab" });
