import React, { useState, useEffect } from "react";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../components/ui/card";
import Charts from "../components/Charts";

const Report = () => {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState("");
    const [year, setYear] = useState("");
    const [emailCountByMonth, setEmailCountByMonth] = useState(null);
    const [emailCountByProject, setEmailCountByProject] = useState(null);
    const [error, setError] = useState(null);
    const token = localStorage.getItem("token");

    const fetchProjects = async () => {
        try {
            const response = await fetch("http://localhost:2000/projects", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (response.ok) {
                setProjects(data.projects);
                setError(null);
            } else {
                setError(data.error || "Error fetching projects");
                setProjects([]);
            }
        } catch (err) {
            setError("Error fetching projects");
            setProjects([]);
        }
    };

    const fetchEmailReport = async () => {
        try {
            const response = await fetch(`http://localhost:2000/emailReport?year=${year}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (response.ok) {
                setEmailCountByMonth(data.emailCountByMonth);
                setError(null);
            } else {
                setError(data.error || "Error fetching email report");
                setEmailCountByMonth(null);
            }
        } catch (err) {
            setError("Error fetching email report");
            setEmailCountByMonth(null);
        }
    };

    const fetchEmailCountByProject = async () => {
        try {
            const response = await fetch(`http://localhost:2000/emailCountByProject?year=${year}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (response.ok) {
                setEmailCountByProject(data.emailCountByProject);
                setError(null);
            } else {
                setError(data.error || "Error fetching email count by project");
                setEmailCountByProject(null);
            }
        } catch (err) {
            setError("Error fetching email count by project");
            setEmailCountByProject(null);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, [token]);

    useEffect(() => {
        if (year) {
            fetchEmailReport();
        }
    }, [year, token]);

    useEffect(() => {
        if (selectedProject && year) {
            fetchEmailCountByProject();
        }
    }, [selectedProject, year, token]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (year) {
            fetchEmailReport();
        } else {
            setError("Please select a year.");
        }
    };

    return (
        <div className="flex justify-center mt-8">
            <Card>
                <CardHeader>
                    <CardTitle>Email Report</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="year">Year:</label>
                            <input
                                type="number"
                                id="year"
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                                placeholder="e.g., 2024"
                                min="2020" // Adjust as necessary
                            />
                        </div>
                        <div>
                            <label htmlFor="project">Project:</label>
                            <select
                                id="project"
                                value={selectedProject}
                                onChange={(e) => setSelectedProject(e.target.value)}
                            >
                                <option value="">Select Project</option>
                                {projects.map((project) => (
                                    <option key={project._id} value={project._id}>
                                        {project.projectName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button type="submit">Get Report</button>
                    </form>
                    {emailCountByMonth !== null && (
                        <div>
                            <h3>Emails sent in {year}:</h3>
                            <Charts data={emailCountByMonth} />
                        </div>
                    )}
                    {selectedProject && emailCountByProject && (
                        <div>
                            <h3>Emails sent by {selectedProject} in {year}:</h3>
                            <Charts data={emailCountByProject} />
                        </div>
                    )}
                    {error && <div style={{ color: "red" }}>{error}</div>}
                </CardContent>
                <CardFooter>
                    <p>Ensure all details are correct before submitting</p>
                </CardFooter>
            </Card>
        </div>
    );
};

export default Report;
