// Basic Express server setup
const express = require("express");
const cors = require("cors");
const fs = require("node:fs").promises; // For asynchronous file writing
const path = require("node:path");
const app = express();
const port = 3001; // Or another port
const mammoth = require("mammoth");

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

/**
 * 
 * 
 */
app.get("/api/files/:fileId/content", async (req, res) => {
  /*
  Find the file metadata in data.json using the :fileId.
Check if the filename ends with .docx.
If it's a .docx file, read the file from the backend/data directory using its filename.
Use the chosen library (e.g., mammoth.convertToHtml()) to convert the .docx file buffer/content into an HTML string.
Handle potential errors during conversion.
Send the resulting HTML string back as the response (e.g., res.send(result.value)).
If the file is not a .docx file, proceed to the next check (or respond appropriately if no other preview type is supported).
*/
  const fileId = req.params.fileId; 
  const file = data.files.find((item) => {
    console.log(item);
    return item.id == fileId;//
  })

  if(!file) {
    return res.status(404).json({ error: "File not found" });
  }

  if (path.extname(file.filename) !== ".docx") {
    return res.status(415).json({ error: "File is not a docx" });
  }

  mammoth.convertToHtml({path: `./data/${file.filename}`})
    .then(function(result){
        const html = result.value; // The generated HTML
        //var messages = result.messages; // Any messages, such as warnings during conversion
        return res.json({html});
    })
    .catch(function(error) {
        console.error(error);
        //TODO: check official docs
        return res.status(415).json({ error: "Unable to convert this file to html" });
    });

  //res.json(file);
});

app.get("/api/files/:fileId/view", async (req, res) => {
  /*
  Find the file metadata in data.json using :fileId.
Get the filename (e.g., "contract.pdf").
Construct the full path to the file in backend/data.
Check if the file exists.
If the file is a .pdf, set the response header Content-Type to application/pdf.
Read the PDF file and send its contents in the response. Do not set the Content-Disposition: attachment header. (Using res.sendFile() in Express is recommended).
If the file is not a PDF (and wasn't handled by DOCX conversion), respond with an appropriate error (e.g., 400 or { message: 'Preview not supported' }).
*/
  const fileId = req.params.fileId; 
  const file = data.files.find((item) => {
    //console.log(item);
    return item.id == fileId;// && item.filename.split('.')[1] === 'pdf'
  })

  if(!file) {
    //TODO: handle for next parser
    return res.status(404).json({ error: "File not found" });
  }
  
  if (path.extname(file.filename) !== ".pdf") {
    return res.status(415).json({ error: "File is not a pdf" });
  }


  const filePath =  path.join(__dirname, "data", file.filename);
  try {
    const content = await fs.readFile(filePath);
    if(!content) {
      return res.status(404).json({ error: "File content not found" });
    }
  } catch(e) {
    console.error(e);
    return res.status(404).json({ error: "There's an error reading this file." });
  }
  return res.setHeader("Content-Type", "application/pdf").sendFile(filePath);
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
