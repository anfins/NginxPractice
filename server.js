const express = require("express"); // Web framework for Node.js - handles routing, middleware, server setup
const cors = require("cors"); // Allows frontend to call backend
const bodyParser = require("body-parser"); // Parses incoming request bodies (needed for POST requests)
const { spawn } = require("child_process"); // Allows Node.js to run other processes like Python

const app = express();
app.use(cors());
app.use(bodyParser.json());

/** Listens for a POST request from the frontend
 * Req = {userInput: "userInput"}
 * Res = {result: "result"}
 */
app.post("/run-python", (req, res) => {
  const { userInput } = req.body;

  // Validate userInput to ensure it's not empty
  if (!userInput) {
    return res.status(400).json({ error: "userInput is required" });
  }

  /** Create a new Python process to run our script */
  const pythonProcess = spawn("python3", [
    "./src/Scripts/LLM.py", // Path to our Python script
    userInput, // Pass userInput as a command line argument
  ]);

  // Handle the output of the Python script
  pythonProcess.stdout.on("data", (data) => {
    try {
      const parsedData = JSON.parse(data.toString().trim());
      res.json({ result: parsedData }); // Send the parsed result immediately
    } catch (error) {
      console.error("Error parsing Python output:", error);
      res.status(500).json({ error: "Failed to parse results" });
    }
  });

  pythonProcess.stderr.on("data", (data) => {
    console.error(`Python Error: ${data}`);
    res.status(500).json({ error: "Python script error" }); // Send error response immediately
  });

  pythonProcess.on("close", (code) => {
    if (code !== 0) {
      return res
        .status(500)
        .json({ error: "Python script exited with error code: " + code });
    }
  });
});

const PORT = 5000;
/** Starts the server on port 5000 and listens for requests */
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
