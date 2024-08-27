import React from "react";
import { LabelList } from "recharts";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

const ProjectChart = ({ projectData, month }) => {
    const chartData = projectData.map(project => ({
        projectName: project.projectName,
        emailCount: project.emailCount,
    }));

    return (
        <div>
            <h3>Emails sent by project in {month}</h3>
            <BarChart width={600} height={300} data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="projectName" />
                <YAxis />
                <Bar dataKey="emailCount" fill="#82ca9d">
                    <LabelList dataKey="emailCount" position="top" />
                </Bar>
            </BarChart>
        </div>
    );
};

export default ProjectChart;
