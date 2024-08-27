const jwt = require("jsonwebtoken");
const { Project } = require("../db");

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, "ultrasupersecret");
    const project = await Project.findById(decoded.projectId);

    if (!project) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.project = project;
    next();
  } catch (error) {
    res.status(500).json({ error: "Server error in auth middleware", details: error.message });
  }
};

module.exports = authMiddleware;
