import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
} from "recharts";

import { useUsersQuery } from "../../services/admin/Query";

export default function AdminDashboard() {
    const { data, isLoading, isError } = useUsersQuery();
    const [monthlyData, setMonthlyData] = useState([]);

    useEffect(() => {
        if (!data || !data.data || !data.data.length) {
            setMonthlyData([]);
            return;
        }

        const users = data.data;
        const monthCount = {};

        users.forEach((user) => {
            const month = new Date(user.createdAt).toLocaleString("default", {
                month: "short",
                year: "numeric",
            });
            monthCount[month] = (monthCount[month] || 0) + 1;
        });

        const sortedMonths = Object.entries(monthCount)
            .map(([month, count]) => {
                const [mon, yr] = month.split(" ");
                return { month, count, date: new Date(mon + " 1, " + yr) };
            })
            .sort((a, b) => a.date - b.date)
            .map(({ month, count }) => ({ month, count }));

        setMonthlyData(sortedMonths);
    }, [data]);

    return (
        <div className="max-w-6xl mx-auto flex flex-col gap-6">
            <Card className="p-6">
                <h2 className="text-lg font-semibold mb-2">Total Registered Users</h2>
                {isLoading ? (
                    <p>Loading...</p>
                ) : isError ? (
                    <p className="text-red-500">Failed to load users</p>
                ) : (
                    <p className="text-4xl font-bold">{data.data.length}</p>
                )}
            </Card>

            <Card className="p-6">
                <h2 className="text-lg font-semibold mb-4">Monthly Registrations</h2>
                {isLoading ? (
                    <p>Loading chart...</p>
                ) : isError ? (
                    <p className="text-red-500">Failed to load chart data</p>
                ) : monthlyData.length ? (
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={monthlyData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Line type="monotone" dataKey="count" stroke="#4f46e5" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>

                ) : (
                    <p>No registration data available</p>
                )}
            </Card>
        </div>
    );
}
