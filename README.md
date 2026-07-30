# 🌍 Disaster Alert App

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-HTML%20%7C%20CSS%20%7C%20JavaScript-blue?style=for-the-badge">
  <img src="https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-green?style=for-the-badge">
  <img src="https://img.shields.io/badge/Database-MongoDB-success?style=for-the-badge">
  <img src="https://img.shields.io/badge/API-REST-orange?style=for-the-badge">
  <img src="https://img.shields.io/badge/License-MIT-red?style=for-the-badge">
</p>

<p align="center">
A full-stack disaster reporting and visualization platform that enables users to report emergency incidents, visualize them on an interactive map, and manage disaster reports through a REST API backed by MongoDB.
</p>

---

# 🚀 Live Demo

### https://disaster-alert.vercel.app/

---

# 📖 Overview

Disaster Alert App is a modern full-stack web application designed to improve disaster awareness and emergency reporting. Users can report incidents using their live location, visualize disaster reports on an interactive map, and access real-time data through a backend API.

The application combines a responsive frontend with an Express.js backend and MongoDB database, providing persistent storage and scalable REST APIs.

---

# ✨ Features

## 🌍 Interactive Disaster Map

- Interactive map powered by Leaflet.js
- Live incident visualization
- Clickable map markers
- Auto-centering based on user location

## 📍 Live Location Detection

- Browser Geolocation API
- Automatic latitude & longitude detection
- Reverse geocoding using OpenStreetMap

## 📝 Disaster Reporting

Users can report:

- 🔥 Fire
- 🌊 Flood
- 🌍 Earthquake
- 🚨 Theft
- 💣 Bomb Threat
- 🚗 Accident
- 📌 Other Emergencies

Each report contains:

- Disaster Type
- Severity Level
- Description
- Coordinates
- Address
- Timestamp

---

# ⚡ Backend Features

- Express.js REST API
- MongoDB Database Integration
- Mongoose ODM
- Persistent Disaster Reports
- JSON-based APIs
- CORS Enabled
- Error Handling
- Environment Variable Support

---

# 🗄 Database

The application uses **MongoDB** to permanently store disaster reports.

Each report contains:

- Report ID
- Disaster Type
- Severity
- Description
- Latitude
- Longitude
- Address
- Created Time

---

# 🛠 Tech Stack

## Frontend

- HTML5
- CSS3
- JavaScript (ES6)
- Tailwind CSS

## Backend

- Node.js
- Express.js

## Database

- MongoDB
- Mongoose

## Libraries

- Leaflet.js
- GSAP
- Font Awesome
- CORS

## APIs

- Browser Geolocation API
- OpenStreetMap
- Nominatim Reverse Geocoding API

---

# 🏗 Project Architecture

```
                 User
                   │
                   ▼
        Frontend (HTML/CSS/JS)
                   │
                   ▼
          Express REST API
                   │
                   ▼
              MongoDB Database
```

---

# 📂 Project Structure

```
disaster-alert-app/
│
├── public/
│   ├── index.html
│   ├── app.js
│   ├── style.css
│   └── assets/
│
├── api/
│   ├── routes/
│   ├── models/
│   ├── config/
│   └── index.js
│
├── package.json
├── .env
└── README.md
```

---

# ⚙ Installation

## Clone Repository

```bash
git clone https://github.com/SumitRaj511/disaster-alert-app.git
```

## Navigate to Project

```bash
cd disaster-alert-app
```

## Install Dependencies

```bash
npm install
```

---

# ▶ Running the Project

Start the backend server

```bash
npm start
```

or

```bash
node server.js
```

Visit

```
http://localhost:3000
```

---

# 🚀 Deployment

The project can be deployed on

- Vercel
- Render
- Railway
- Netlify (Frontend)
- GitHub Pages (Frontend Only)

---

# 📷 Screenshots

## Home Page

<p align="center">
<img src="https://github.com/user-attachments/assets/869a149c-79d9-47ec-bd0b-15af8af41f6c" width="850">
</p>

---

## Report Disaster

<p align="center">
<img src="https://github.com/user-attachments/assets/879ee511-14d0-458f-bc3b-2e5aeb8ffe0b" width="400">
</p>

---

## Safety Guide

<p align="center">
<img src="https://github.com/user-attachments/assets/dea0d84a-0318-42ab-afe7-ab64b2300503" width="400">
</p>
---

---

# 📚 Learning Outcomes

This project helped in understanding:

- Full Stack Web Development
- REST API Design
- MongoDB Database Integration
- Mongoose ODM
- CRUD Operations
- API Communication
- Browser Geolocation
- Interactive Maps
- Reverse Geocoding
- Responsive UI Design
- Frontend Animations
- Backend Deployment
- Environment Variables
- Client-Server Architecture

---

# 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create your feature branch

```bash
git checkout -b feature-name
```

3. Commit your changes

```bash
git commit -m "Add new feature"
```

4. Push to your branch

```bash
git push origin feature-name
```

5. Open a Pull Request

---

# 👨‍💻 Author

## Sumit Raj

GitHub:
https://github.com/SumitRaj511

LinkedIn:
https://www.linkedin.com/in/sumitraj511/

---

# ⭐ Support

If you found this project useful, please consider giving it a ⭐ on GitHub.

It helps others discover the project and motivates further development.

---

## 📜 License

This project is licensed under the **MIT License**.
