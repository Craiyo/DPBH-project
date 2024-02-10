// Get references to the toggle switches
const toggle1 = document.getElementById("toggle1");
const toggle2 = document.getElementById("toggle2");

// Add event listeners for toggle1
toggle1.addEventListener("change", function () {
  if (this.querySelector('input[type="checkbox"]').checked) {
    // Action when toggle is turned on
    console.log("Toggle 1 is turned on");
  } else {
    // Action when toggle is turned off
    console.log("Toggle 1 is turned off");
  }
});

// Add event listeners for toggle2
toggle2.addEventListener("change", function () {
  if (this.querySelector('input[type="checkbox"]').checked) {
    // Action when toggle is turned on
    console.log("Toggle 2 is turned on");
  } else {
    // Action when toggle is turned off
    console.log("Toggle 2 is turned off");
  }
});
