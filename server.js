import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

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

app.post('/generate', (req, res) => {
    const { text } = req.body;
    const lines = text.split('\n').map(a => a.trim()).filter(Boolean);
    const generatedHtml = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Handwriting Practice</title>
            <style>
                body {
                    font-family: sans-serif;
                }
                .line {
                    position: relative;
                    margin-bottom: 2.1em; /* Provides space for the handwriting line */
                }
                .line::after {
                    content: '';
                    position: absolute;
                    left: 0;
                    right: 0;
                    bottom: -1.8em; /* Position the top of the handwriting line */
                    height: 1.3em; /* The height of the handwriting space */
                    border-top: 1px solid #ccc;
                    border-bottom: 1px solid #ccc;
                }
            </style>
        </head>
        <body>
            ${lines.map(line => `<div class="line">${line}</div>`).join('')}
        </body>
        </html>
    `;
    const now = new Date();
    const fileName = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}-${String(now.getHours()).padStart(2, '0')}_${String(now.getMinutes()).padStart(2, '0')}.html`;
    const dirPath = path.join(__dirname, 'generated');
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
