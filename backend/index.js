const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Onboarding = require("./routes/onBoarding.js");
const Email = require("./routes/email.js");
const Report = require("./routes/report.js");
const cronJob = require("./features/cronJob.js"); 
const cors = require("cors");

const PORT = 2000;
const app = express();

app.use(cors());
app.use(bodyParser.json());

// Route setup
app.use("/", Onboarding);
app.use("/", Email);
app.use("/", Report);

// Test endpoint to verify server is running
app.get("/test", (req, res) => {
    res.json({ message: "Server is running!" });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
});

// 404 handler
app.use("*", (req, res) => {
    res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`);
});