const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { spawn } = require("child_process");

const app = express();
app.use(bodyParser.json());
app.use(cors()); // Enable CORS for all routes

app.post("/", async (req, res) => {
  try {
    const data = req.body.tokens;
    console.log("Data recieved from Extension");

    // Spawn a Python process with the input data as command line argument
    const pythonProcess = spawn("python", [
      "./js_call_python/prediction.py",
      JSON.stringify(data),
    ]);

    // Initialize pythonOutput variable to capture the output
    let pythonOutput = "";

    // Listen for data from the Python process
    pythonProcess.stdout.on("data", (data) => {
      pythonOutput += data.toString();
    });
    console.log("come out of python process");
    // Listen for errors from the Python process
    pythonProcess.stderr.on("data", (data) => {
      console.error(`Python Error: ${data}`);
    });

    // Handle the Python process exit event
    pythonProcess.on("close", (code) => {
      if (code === 0) {
        try {
          // Parse the processed data from Python and send it as a response
          console.log("data sent to extension");
          const result = JSON.parse(pythonOutput);
          res.status(200).json(result);
        } catch (error) {
          console.error("Error parsing Python output:", error);
          res.status(500).send("Internal Server Error");
        }
      } else {
        console.error(`Python process exited with code ${code}`);
        res.status(500).send("Internal Server Error");
      }
    });
    console.log("data sent to extension - 1");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
