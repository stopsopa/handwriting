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

// Start the server
app.listen(PORT, () => {
  console.log(`WYSIWYG Editor running at http://localhost:${PORT}`);
});
