const { Project } = require("../db");

const adminMiddleware = async (req, res, next) => {
  try {
    const { projectName } = req.body;
    const project = await Project.findOne({ projectName });
    if (project && project.isAdmin) {
      next();
    } else {
      res.status(403).json({ message: "Forbidden: Admins only" });
    }
  } catch (error) {
    console.error("Error in admin middleware:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const userMiddleware = async (req, res, next) => {
  try {
    const { projectName } = req.body;
    const project = await Project.findOne({ projectName });
    if (project) {
      next();
    } else {
      res.status(403).json({ message: "Forbidden: Invalid user" });
    }
  } catch (error) {
    console.error("Error in user middleware:", error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  adminMiddleware,
  userMiddleware,
};
