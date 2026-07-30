require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Report = require('./models/Report');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/disaster-alert';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes

// Get all reports
app.get('/api/reports', async (req, res) => {
    try {
        const reports = await Report.find().sort({ createdAt: -1 });
        res.json({
            message: "success",
            data: reports
        });
    } catch (err) {
        console.error("Error fetching reports:", err);
        res.status(500).json({ error: "Server error fetching reports" });
    }
});

// Add a new report
app.post('/api/reports', async (req, res) => {
    const { id, type, severity, description, latitude, longitude, address, createdAt } = req.body;
    
    // Basic validation
    if (!id || !type || !latitude || !longitude || !createdAt) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        const newReport = new Report({ id, type, severity, description, latitude, longitude, address, createdAt });
        await newReport.save();
        
        res.json({
            message: "success",
            data: newReport
        });
    } catch (err) {
        console.error("Error saving report:", err);
        res.status(500).json({ error: "Server error saving report" });
    }
});

// Export the Express API for Vercel
module.exports = app;
