const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Database Setup
const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        // Initialize table if it doesn't exist
        db.run(`CREATE TABLE IF NOT EXISTS reports (
            id TEXT PRIMARY KEY,
            type TEXT,
            severity TEXT,
            description TEXT,
            latitude REAL,
            longitude REAL,
            address TEXT,
            createdAt TEXT
        )`, (err) => {
            if (err) {
                console.error('Error creating table', err.message);
            }
        });
    }
});

// Routes

// Get all reports
app.get('/api/reports', (req, res) => {
    const sql = `SELECT * FROM reports ORDER BY createdAt DESC`;
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: "success",
            data: rows
        });
    });
});

// Add a new report
app.post('/api/reports', (req, res) => {
    const { id, type, severity, description, latitude, longitude, address, createdAt } = req.body;
    
    // Basic validation
    if (!id || !type || !latitude || !longitude || !createdAt) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const sql = `INSERT INTO reports (id, type, severity, description, latitude, longitude, address, createdAt)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    const params = [id, type, severity, description, latitude, longitude, address, createdAt];
    
    db.run(sql, params, function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: "success",
            data: { id, type, severity, description, latitude, longitude, address, createdAt }
        });
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
