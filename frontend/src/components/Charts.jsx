import React from "react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "../components/ui/card";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "../components/ui/chart";

const Charts = ({ data = [], year }) => {
    // Debugging: Log the data to the console
    console.log("Charts component data:", data);

    if (!Array.isArray(data) || data.length === 0) {
        return (
            <div style={{ padding: "20px" }}>
                <p>No data available for the selected year.</p>
            </div>
        );
    }

    // Transform data to match chart requirements
    const chartData = data.map(d => ({
        month: d.month,
        emailCount: d.emailCount || 0,
    }));

    const chartConfig = {
        emailCount: {
            label: "Emails Sent",
            color: "hsl(var(--chart-1))",
        },
        label: {
            color: "hsl(var(--background))",
        },
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Emails Sent in {year}</CardTitle>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart
                        data={chartData}
                        layout="vertical"
                        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                    >
                        <CartesianGrid horizontal={false} />
                        <YAxis
                            dataKey="month"
                            type="category"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <XAxis dataKey="emailCount" type="number" hide />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="line" />}
                        />
                        <Bar
                            dataKey="emailCount"
                            fill="var(--color-desktop)"
                            radius={4}
                        >
                            <LabelList
                                dataKey="month"
                                position="insideLeft"
                                offset={8}
                                className="fill-[--color-label]"
                                fontSize={12}
                            />
                            <LabelList
                                dataKey="emailCount"
                                position="right"
                                offset={8}
                                className="fill-foreground"
                                fontSize={12}
                            />
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
};

export default Charts;
