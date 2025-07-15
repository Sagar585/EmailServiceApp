import React, { useState, useEffect } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../components/ui/select";
import Charts from "../components/Charts";

const Report = () => {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState("");
    const [selectedProjectName, setSelectedProjectName] = useState("");
    const [year, setYear] = useState("");
    const [emailCountByMonth, setEmailCountByMonth] = useState(null);
    const [emailCountByProject, setEmailCountByProject] = useState(null);
    const [projectEmailsByMonth, setProjectEmailsByMonth] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const token = localStorage.getItem("token");

    const fetchProjects = async () => {
        setLoading(true);
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
        } finally {
            setLoading(false);
        }
    };

    const fetchEmailReport = async () => {
        if (!year) return;
        
        setLoading(true);
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
        } finally {
            setLoading(false);
        }
    };

    const fetchEmailCountByProject = async () => {
        if (!year) return;
        
        setLoading(true);
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
        } finally {
            setLoading(false);
        }
    };

    const fetchProjectEmailsByMonth = async () => {
        if (!year || !selectedProject) return;
        
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:2000/emailsByProjectAndMonth?year=${year}&projectId=${selectedProject}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (response.ok) {
                setProjectEmailsByMonth(data.emailCountByMonth);
                setError(null);
            } else {
                setError(data.error || "Error fetching project emails by month");
                setProjectEmailsByMonth(null);
            }
        } catch (err) {
            setError("Error fetching project emails by month");
            setProjectEmailsByMonth(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    useEffect(() => {
        if (year) {
            fetchEmailReport();
            fetchEmailCountByProject();
        }
    }, [year]);

    useEffect(() => {
        if (selectedProject && year) {
            fetchProjectEmailsByMonth();
        }
    }, [selectedProject, year]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!year) {
            setError("Please select a year.");
            return;
        }
        fetchEmailReport();
        fetchEmailCountByProject();
        if (selectedProject) {
            fetchProjectEmailsByMonth();
        }
    };

    const handleProjectChange = (projectId) => {
        setSelectedProject(projectId);
        const project = projects.find(p => p._id === projectId);
        setSelectedProjectName(project ? project.projectName : "");
    };

    const clearReports = () => {
        setEmailCountByMonth(null);
        setEmailCountByProject(null);
        setProjectEmailsByMonth(null);
        setSelectedProject("");
        setSelectedProjectName("");
        setYear("");
        setError(null);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Email Analytics Dashboard</h1>
                    <p className="mt-2 text-gray-600">View comprehensive email reports and analytics</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Controls Panel */}
                    <div className="lg:col-span-1">
                        <Card className="shadow-lg">
                            <CardHeader className="bg-blue-600 text-white">
                                <CardTitle className="text-lg">Report Controls</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-6">
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="year" className="text-sm font-medium text-gray-700">
                                            Select Year
                                        </Label>
                                        <Input
                                            id="year"
                                            type="number"
                                            placeholder="e.g., 2024"
                                            value={year}
                                            onChange={(e) => setYear(e.target.value)}
                                            min="2020"
                                            max="2030"
                                            className="w-full bg-white text-black border-gray-300"
                                            style={{ backgroundColor: 'white', color: 'black' }}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="project" className="text-sm font-medium text-gray-700">
                                            Select Project (Optional)
                                        </Label>
                                        <Select value={selectedProject} onValueChange={handleProjectChange}>
                                            <SelectTrigger className="w-full bg-white text-black border-gray-300">
                                                <SelectValue placeholder="Choose a project" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white">
                                                {projects.map((project) => (
                                                    <SelectItem key={project._id} value={project._id}>
                                                        {project.projectName}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="flex space-x-3">
                                        <Button 
                                            type="submit" 
                                            className="flex-1 bg-blue-600 hover:bg-blue-700"
                                            disabled={loading}
                                        >
                                            {loading ? "Loading..." : "Generate Report"}
                                        </Button>
                                        <Button 
                                            type="button" 
                                            variant="outline" 
                                            onClick={clearReports}
                                            className="flex-1"
                                        >
                                            Clear
                                        </Button>
                                    </div>
                                </form>

                                {error && (
                                    <div className="bg-red-50 border border-red-200 rounded-md p-4">
                                        <p className="text-red-800 text-sm">{error}</p>
                                    </div>
                                )}

                                {loading && (
                                    <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                                        <p className="text-blue-800 text-sm">Loading reports...</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Charts Panel */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Overall Email Report */}
                        {emailCountByMonth && (
                            <Card className="shadow-lg">
                                <CardHeader className="bg-green-600 text-white">
                                    <CardTitle className="text-lg">
                                        Total Emails Sent in {year}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="h-80">
                                        <Charts data={emailCountByMonth} />
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Project-specific Email Report */}
                        {selectedProject && projectEmailsByMonth && (
                            <Card className="shadow-lg">
                                <CardHeader className="bg-purple-600 text-white">
                                    <CardTitle className="text-lg">
                                        Emails Sent by {selectedProjectName} in {year}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="h-80">
                                        <Charts data={projectEmailsByMonth} />
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Email Count by All Projects */}
                        {emailCountByProject && emailCountByProject.length > 0 && (
                            <Card className="shadow-lg">
                                <CardHeader className="bg-orange-600 text-white">
                                    <CardTitle className="text-lg">
                                        Email Distribution by Projects in {year}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="h-80">
                                        <Charts data={emailCountByProject} />
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* No Data Message */}
                        {year && !emailCountByMonth && !loading && !error && (
                            <Card className="shadow-lg">
                                <CardContent className="p-12 text-center">
                                    <div className="text-gray-500">
                                        <svg
                                            className="mx-auto h-12 w-12 text-gray-400"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            aria-hidden="true"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                            />
                                        </svg>
                                        <h3 className="mt-2 text-sm font-medium text-gray-900">No data available</h3>
                                        <p className="mt-1 text-sm text-gray-500">
                                            No email data found for the selected year.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Report;
