function highlight(element, color) {
  element.style = " ";
  element.classList.add("dark-force-highlight");
  element.style.backgroundColor = color;
  let body = document.createElement("span");
  body.classList.add("dark-force-highlight-body");
  /* content */
  let content = document.createElement("div");
  content.classList.add("modal-content");
  content.innerHTML = "";
  body.appendChild(content);

  element.appendChild(body);
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
  contentBox.style.position = "fixed";
  contentBox.style.top = "20px";
  contentBox.style.left = "10px";
  contentBox.style.zIndex = "9999";
}

const arr = [
  "Urgency",
  "Not Dark Pattern",
  "Scarcity",
  "Misdirection",
  "Forced Action",
];

function updateContentBox(data) {
  let contentBox = document.getElementById("extensionContentBox");
  contentBox.innerHTML =
    "<p>Website analyzed...</p>" + generateContentHTML(data);

  // Create canvas element for the pie chart
  let canvas = document.createElement("canvas");
  canvas.id = "pieChart";
  canvas.width = 200; // Set width as needed
  canvas.height = 200; // Set height as needed
  contentBox.appendChild(canvas);

  // Generate data for the pie chart
  let chartData = generateChartData(data);

  // Render the pie chart
  renderPieChart(chartData);
}

function generateChartData(data) {
  // Count occurrences of each category
  let counts = {
    Urgency: 0,
    "Not Dark Pattern": 0,
    Scarcity: 0,
    Misdirection: 0,
    "Forced Action": 0,
  };

  data.forEach((item, index) => {
    counts[arr[index]] = item;
  });

  return counts;
}

function renderPieChart(chartData) {
  let ctx = document.getElementById("pieChart").getContext("2d");
  lab = Object.keys(chartData);
  let myChart = new Chart(ctx, {
    type: "pie",
    data: {
      datasets: [
        {
          data: Object.values(chartData),
          backgroundColor: ["red", "green", "blue", "yellow", "orange"],
        },
      ],
    },
    options: {
      legend: {
        display: true,
        position: "bottom",
        labels: { lab },
      },
    },
  });
}

function generateContentHTML(data) {
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

function getColor(prediction) {
  switch (prediction) {
    case 0:
      return "red"; // color for Urgency
    case 2:
      return "blue"; // color for Scarcity
    case 3:
      return "yellow"; // color for Misdirection
    case 7:
      return "orange"; // color for Forced Action
  }
}
