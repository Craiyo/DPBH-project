function containsDripPricingPattern(text) {
  const dripPricingKeywords = [
    "additional fees",
    "extra charges",
    "hidden costs",
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
    "terms and conditions apply",
  ];
  return dripPricingKeywords.some((keyword) =>
    text.toLowerCase().includes(keyword)
  );
}

function detectDripPricing() {
  // Option 1: Multiple Price Components
  const priceElements = document.querySelectorAll(".price, .shipping, .taxes");
  if (priceElements.length > 1) {
    return true;
  }

  // Option 2: Dynamic Price Changes
  const totalPriceElement = document.getElementById("totalPrice");
  if (totalPriceElement) {
    totalPriceElement.addEventListener("change", () => {
      return true;
    });
  }

  // Option 3: Delayed Price Information
  const shippingOptions = document.getElementById("shippingOptions");
  if (shippingOptions) {
    shippingOptions.addEventListener("change", () => {
      return true;
    });
  }

  // Option 4: Check for Phrases or Keywords
  const pageText = document.body.innerText.toLowerCase();
  if (containsDripPricingPattern(pageText)) {
    console.log("Drip pricing detected!"); // Add this line for debugging
    return true;
  }
  return false;
}
