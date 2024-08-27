const express = require("express");
const router = express.Router();
const { Email } = require("../db");
const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware);

router.post("/addEmail", async (req, res) => {
  const emails = Array.isArray(req.body) ? req.body : [req.body];
  const projectId = req.project._id;
  const fromEmail = req.project.projectName;

  try {
    const emailPromises = emails.map(email => {
      const { to, cc, bcc, subject, body } = email;

      if (!to || !subject || !body) {
        throw new Error("Required fields are missing");
      }

      return Email.create({
        ProjectId: projectId,
        fromEmail,
        to,
        cc,
        bcc,
        subject,
        body,
        createdAt: new Date(),
      });
    });

    await Promise.all(emailPromises);

    res.status(201).json({ message: "Emails have been stored" });
  } catch (error) {
    res.status(500).send({ error: "Error in saving email", details: error.message });
  }
});

router.get("/getEmail", async (req, res) => {
  try {
    let emails;
    if (req.project.isAdmin) {
      emails = await Email.find().populate("ProjectId");
    } else {
      emails = await Email.find({ ProjectId: req.project._id }).populate("ProjectId");
    }
    res.status(200).json(emails);
  } catch (error) {
    console.error("Error fetching emails:", error);
    res.status(500).send({ error: "Error fetching emails" });
  }
});

router.delete("/deleteEmail", async (req, res) => {
  const { emailId } = req.body;

  if (!emailId) {
    return res.status(400).json({ error: "Email ID is required" });
  }

  try {
    const result = await Email.deleteOne({ _id: emailId, ProjectId: req.project._id });

      if (result.deletedCount === 0 ) {
        return res.status(404).json({ error: "Email not found or not authorized to delete" });
      }
    res.status(200).json({ message: "Email deleted successfully" });
  } catch (error) {
    console.error("Error deleting email:", error);
    res.status(500).json({ error: "Error deleting email", details: error.message });
  }
});



router.get("/emailReport", async (req, res) => {
  try {
      const { year, projectId } = req.query;

      if (!year) {
          return res.status(400).json({ error: "Year is required" });
      }

      const startDate = new Date(year, 0, 1);
      const endDate = new Date(year, 11, 31, 23, 59, 59, 999);

      let filter = {
          createdAt: { $gte: startDate, $lte: endDate },
      };

      if (projectId) {
          filter.ProjectId = projectId;
      }

      const emails = await Email.aggregate([
          { $match: filter },
          {
              $group: {
                  _id: { month: { $month: "$createdAt" }, projectId: "$ProjectId" },
                  count: { $sum: 1 },
              },
          },
          {
              $lookup: {
                  from: "projects",
                  localField: "_id.projectId",
                  foreignField: "_id",
                  as: "project",
              },
          },
          {
              $unwind: "$project",
          },
          {
              $project: {
                  month: "$_id.month",
                  projectName: "$project.projectName",
                  count: 1,
              },
          },
      ]);

      res.status(200).json(emails);
  } catch (error) {
      console.error("Error fetching email report:", error);
      res.status(500).json({ error: "Error fetching email report", details: error.message });
  }
});

router.get("/monthlyEmailReport", async (req, res) => {
  try {
    const { year } = req.query;

    if (!year) {
      return res.status(400).json({ error: "Year is required" });
    }

    const startDate = new Date(year, 0, 1); // January 1st of the year
    const endDate = new Date(year, 12, 0, 23, 59, 59, 999); // December 31st of the year

    let filter = {
      createdAt: { $gte: startDate, $lte: endDate },
    };

    if (!req.project.isAdmin) {
      filter.ProjectId = req.project._id;
    }

    const emailCounts = await Email.aggregate([
      { $match: filter },
      {
        $group: {
          _id: { $month: "$createdAt" },
          emailCount: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    // Ensure every month is represented
    const monthlyData = Array.from({ length: 12 }, (_, i) => {
      const monthData = emailCounts.find(item => item._id === i + 1) || { emailCount: 0 };
      return { month: new Date(0, i).toLocaleString("en-US", { month: "long" }), emailCount: monthData.emailCount };
    });

    res.status(200).json({ year, monthlyData });
  } catch (error) {
    console.error("Error fetching monthly email report:", error);
    res.status(500).json({ error: "Error fetching monthly email report", details: error.message });
  }
});

router.get("/projectReport", async (req, res) => {
  try {
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({ error: "Month and year are required" });
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    const projectsEmails = await Email.aggregate([
      { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
      {
        $group: {
          _id: "$ProjectId",
          emailCount: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "projects",
          localField: "_id",
          foreignField: "_id",
          as: "project",
        },
      },
      {
        $unwind: "$project",
      },
      {
        $project: {
          _id: 0,
          projectName: "$project.projectName",
          emailCount: 1,
        },
      },
    ]);

    res.status(200).json(projectsEmails);
  } catch (error) {
    console.error("Error fetching project report:", error);
    res.status(500).json({ error: "Error fetching project report", details: error.message });
  }
});

module.exports = router;


module.exports = router;
