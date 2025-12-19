import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 80;
const DATA_FILE = path.join(__dirname, 'data', 'formats.json');

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// Ensure data directory exists
if (!fs.existsSync(path.join(__dirname, 'data'))) {
    fs.mkdirSync(path.join(__dirname, 'data'));
    // Create default file if not exists
    if (!fs.existsSync(DATA_FILE)) {
        fs.writeFileSync(DATA_FILE, '[]');
    }
}

// API Routes
app.get('/api/formats', (req, res) => {
    try {
        if (fs.existsSync(DATA_FILE)) {
            const data = fs.readFileSync(DATA_FILE, 'utf8');
            res.json(JSON.parse(data));
        } else {
            // Fallback to empty or initial (should be handled by deployment copy)
            res.json([]);
        }
    } catch (err) {
        console.error("Error reading formats:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.post('/api/formats', (req, res) => {
    try {
        const newData = req.body;
        // Basic validation could go here
        fs.writeFileSync(DATA_FILE, JSON.stringify(newData, null, 2));
        res.json({ success: true, message: "Formats saved successfully" });
    } catch (err) {
        console.error("Error writing formats:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Catch-all handler for SPA (Must be last)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
