const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// In-memory Database for Vercel
let reports = [
    {
        id: "1",
        type: "Fire",
        description: "Large brush fire spreading quickly near the highway.",
        latitude: 28.6139,
        longitude: 77.2090,
        address: "New Delhi, India",
        severity: "Critical",
        createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString() // 30 mins ago
    },
    {
        id: "2",
        type: "Flood",
        description: "Heavy rains caused the river to overflow.",
        latitude: 19.0760,
        longitude: 72.8777,
        address: "Mumbai, India",
        severity: "High",
        createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString() // 2 hours ago
    }
];

// Routes

// Get all reports
app.get('/api/reports', (req, res) => {
    res.json({
        message: "success",
        data: reports
    });
});

// Add a new report
app.post('/api/reports', (req, res) => {
    const { id, type, severity, description, latitude, longitude, address, createdAt } = req.body;
    
    // Basic validation
    if (!id || !type || !latitude || !longitude || !createdAt) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const newReport = { id, type, severity, description, latitude, longitude, address, createdAt };
    reports.unshift(newReport); // Add to top of array
    
    res.json({
        message: "success",
        data: newReport
    });
});

// Export the Express API for Vercel
module.exports = app;
