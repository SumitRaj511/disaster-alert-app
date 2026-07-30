require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Report = require('./models/Report');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection Options
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/disaster-alert';
mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 3000 }) // fail quickly if DB is unreachable
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// In-memory Database Fallback for Vercel
let memoryReports = [
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
app.get('/api/reports', async (req, res) => {
    // If DB is connected, fetch from DB
    if (mongoose.connection.readyState === 1) {
        try {
            const reports = await Report.find().sort({ createdAt: -1 });
            return res.json({
                message: "success",
                data: reports
            });
        } catch (err) {
            console.error("Error fetching reports from DB:", err);
            // Fallthrough to memory fallback if DB query fails
        }
    }
    
    // Fallback to in-memory array if DB is not connected
    res.json({
        message: "success (fallback)",
        data: memoryReports
    });
});

// Add a new report
app.post('/api/reports', async (req, res) => {
    const { id, type, severity, description, latitude, longitude, address, createdAt } = req.body;
    
    // Basic validation
    if (!id || !type || !latitude || !longitude || !createdAt) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const reportData = { id, type, severity, description, latitude, longitude, address, createdAt };

    // If DB is connected, save to DB
    if (mongoose.connection.readyState === 1) {
        try {
            const newReport = new Report(reportData);
            await newReport.save();
            
            return res.json({
                message: "success",
                data: newReport
            });
        } catch (err) {
            console.error("Error saving report to DB:", err);
            // Fallthrough to memory fallback if DB query fails
        }
    }
    
    // Fallback to in-memory array if DB is not connected
    memoryReports.unshift(reportData);
    res.json({
        message: "success (fallback)",
        data: reportData
    });
});

// Export the Express API for Vercel
module.exports = app;
