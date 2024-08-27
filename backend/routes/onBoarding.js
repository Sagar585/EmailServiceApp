const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { Project } = require("../db");
const { z } = require("zod");
const authMiddleware = require("../middleware/authMiddleware");

const generateApiKey = () => {
  return crypto.randomBytes(32).toString("hex");
};

const projectSchema = z.object({
  projectName: z.string(),
});

router.post("/onBoarding", async (req, res) => {
  const validationProject = projectSchema.safeParse(req.body);
  const { password } = req.body;

  if (!validationProject.success) {
    return res.status(400).json({ msg: "Input Error: send a proper project name" });
  }
  const { projectName } = validationProject.data;

  if (!password) {
    return res.status(400).json({ msg: "Password is required" });
  }

  try {
    const existingProject = await Project.findOne({ projectName: projectName });
    if (existingProject) {
      return res.status(400).json({ msg: "Project name already exists" });
    }

    const apiKey = generateApiKey();
    const newProject = new Project({
      projectName: projectName,
      password: password,
      apiKey,
    });

    await newProject.save();

    res.status(201).json({
      message: "Project has been onboarded/signed up",
      apiKey: newProject.apiKey,
    });
  } catch (error) {
    console.error("Error during onboarding:", error);
    res.status(500).send({ error: "Error saving project" });
  }
});

router.post("/login", async (req, res) => {
  const { projectName, password } = req.body;

  try {
    const project = await Project.findOne({ projectName: projectName, password: password });
    if (!project) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }
    const token = jwt.sign({ projectId: project._id }, "ultrasupersecret", { expiresIn: "1D" });
    if (project.isAdmin) {
      res.status(200).json({
        message: "Login successful",
        auth: "Admin",
        token,
      });
    } else {
      res.status(200).json({
        message: "Login successful",
        auth: "User",
        token,
      });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).send({ error: "Error during login" });
  }
});

// New route to get all projects
router.get("/projects", authMiddleware, async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json({ projects });
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).send({ error: "Error fetching projects" });
  }
});

module.exports = router;
