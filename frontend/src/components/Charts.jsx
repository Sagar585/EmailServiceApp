import React from "react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis, ResponsiveContainer } from "recharts";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "../components/ui/chart";

const Charts = ({ data = [], title = "Chart" }) => {
    // Debugging: Log the data to the console
    console.log("Charts component data:", data);

    if (!Array.isArray(data) || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">No data available for the selected criteria.</p>
            </div>
        );
    }

    // Transform data to match chart requirements
    const chartData = data.map(d => ({
        name: d.month || d.projectName || d.name || "Unknown",
        value: d.count || d.value || 0,
    }));

    const chartConfig = {
        value: {
            label: "Count",
            color: "hsl(var(--chart-1))",
        },
        label: {
            color: "hsl(var(--background))",
        },
    };

    return (
        <div className="w-full h-full">
            <ChartContainer config={chartConfig}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={chartData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                            dataKey="name"
                            tick={{ fontSize: 12 }}
                            angle={-45}
                            textAnchor="end"
                            height={80}
                        />
                        <YAxis 
                            tick={{ fontSize: 12 }}
                        />
                        <ChartTooltip
                            cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
                            content={<ChartTooltipContent />}
                        />
                        <Bar
                            dataKey="value"
                            fill="#3b82f6"
                            radius={4}
                        >
                            <LabelList
                                dataKey="value"
                                position="top"
                                className="fill-foreground"
                                fontSize={10}
                            />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </ChartContainer>
        </div>
    );
};

export default Charts;
