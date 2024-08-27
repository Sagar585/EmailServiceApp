const express = require("express");
const router = express.Router();
const { Email, Project } = require("../db");
const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware);

router.get("/projects", async (req, res) => {
    try {
        if (!req.project.isAdmin) {
            return res.status(403).json({ error: "Access denied" });
        }
        const projects = await Project.find();
        res.status(200).json({ projects });
    } catch (error) {
        console.error("Error fetching projects:", error);
        res.status(500).send({ error: "Error fetching projects" });
    }
});

router.get("/emailReport", async (req, res) => {
    const { year } = req.query;

    if (!year) {
        return res.status(400).json({ error: "Year is required" });
    }

    try {
        const startDate = new Date(year, 0, 1);
        const endDate = new Date(year, 11, 31, 23, 59, 59, 999);

        const emails = await Email.aggregate([
            { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
            { $group: { _id: { $month: "$createdAt" }, count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ]);

        const emailCountByMonth = Array.from({ length: 12 }, (_, i) => {
            const monthData = emails.find(e => e._id === i + 1);
            return {
                month: new Date(0, i).toLocaleString("en-US", { month: "short" }),
                count: monthData ? monthData.count : 0
            };
        });

        res.status(200).json({ emailCountByMonth });
    } catch (error) {
        console.error("Error fetching email report:", error);
        res.status(500).send({ error: "Error fetching email report" });
    }
});

router.get("/emailCountByProject", async (req, res) => {
    const { year } = req.query;

    if (!year) {
        return res.status(400).json({ error: "Year is required" });
    }

    try {
        const startDate = new Date(year, 0, 1);
        const endDate = new Date(year, 11, 31, 23, 59, 59, 999);

        const emails = await Email.aggregate([
            { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
            { $group: { _id: "$ProjectId", count: { $sum: 1 } } },
            { $lookup: { from: "projects", localField: "_id", foreignField: "_id", as: "project" } },
            { $unwind: "$project" },
            { $project: { _id: 0, projectName: "$project.projectName", count: 1 } }
        ]);

        res.status(200).json({ emailCountByProject: emails });
    } catch (error) {
        console.error("Error fetching email count by project:", error);
        res.status(500).send({ error: "Error fetching email count by project" });
    }
});

module.exports = router;
