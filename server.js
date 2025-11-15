import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import smartLineBreak from "./smartLineBreak.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT;

if (!/^\d+$/.test(PORT)) {
  throw new Error(`PORT env var is not defined`);
}

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname)));
app.use(express.json());

app.post("/generate", (req, res) => {
  const { text, limit } = req.body;

  const lines = smartLineBreak(text, limit);
  const generatedHtml = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Handwriting Practice</title>
            <link rel="stylesheet" href="../style.css" />
        </head>
        <body>
            ${lines.map((line) => `<div class="line">${line}</div>`).join("")}
        </body>
        </html>
    `;
  const now = new Date();
  const fileName = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(now.getDate()).padStart(2, "0")}-${String(
    now.getHours()
  ).padStart(2, "0")}_${String(now.getMinutes()).padStart(2, "0")}.html`;

  const dirPath = path.join(__dirname, "generated");

  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath);
  }

  const filePath = path.join(dirPath, fileName);

  fs.writeFileSync(filePath, generatedHtml);

  res.json({ url: `/generated/${fileName}` });
});

// Start the server
app.listen(PORT, () => {
  console.log(`WYSIWYG Editor running at http://localhost:${PORT}`);
});
