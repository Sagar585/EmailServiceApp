const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/emailService");

const ProjectSchema = new mongoose.Schema({
  projectName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  addedOn: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    default: "Active",
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  apiKey: {
    type: String,
    required: true,
  },
});

const EmailSchema = new mongoose.Schema({
  ProjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  fromEmail: {
    type: String,
    required: true,
  },
  to: {
    type: [String],
    required: true,
  },
  cc: [String],
  bcc: [String],
  subject: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "Pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Project = mongoose.model("Project", ProjectSchema);
const Email = mongoose.model("Email", EmailSchema);

module.exports = {
  Project,
  Email,
};
