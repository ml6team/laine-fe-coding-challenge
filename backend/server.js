// Basic Express server setup
const express = require("express");
const cors = require("cors");
const fs = require("node:fs").promises; // For asynchronous file writing
const path = require("node:path");
const app = express();
const port = 3001; // Or another port

app.use(cors());
app.use(express.json()); // To parse JSON request bodies

// Define your API routes here
const data = require("./data/data.json");

app.get("/api/files", (req, res) => {
  res.json(data.files);
});

app.get("/api/files/:fileId/comments", (req, res) => {
  const fileId = req.params.fileId;
  const comments = data.comments[fileId] || [];
  res.json(comments);
});

app.post("/api/files/:fileId/comments", async (req, res) => {
  const fileId = req.params.fileId;
  const newComment = {
    id: `c${Date.now()}`, // Simple unique ID
    author: "Candidate", // You can hardcode this for the challenge
    text: req.body.text,
  };

  if (!data.comments[fileId]) {
    data.comments[fileId] = [];
  }
  data.comments[fileId].push(newComment);

  // Persist the updated data to data.json (basic implementation)
  try {
    await fs.writeFile(
      path.join(__dirname, "data", "data.json"),
      JSON.stringify(data, null, 2)
    );
    res.status(201).json(newComment); // Respond with the newly created comment
  } catch (error) {
    console.error("Error writing to data.json:", error);
    res.status(500).json({ error: "Failed to save comment" });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
