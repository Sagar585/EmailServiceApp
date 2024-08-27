const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Onboarding = require("./routes/onBoarding.js");
const Email = require("./routes/email.js");
const cronJob = require("./features/cronJob.js"); 
const cors = require("cors");

const PORT = 2000;
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use("/", Onboarding);
app.use("/", Email);

app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});