const express = require("express");
const pythonFile = require("./callPython.js"); // Import the module

const app = express();

app.post("/", async (req, res) => {
  try {
    req.
    const pythonOutput = await pythonFile.runPythonProcess();
    res.send(`Output returned from python file: ${pythonOutput}`);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
