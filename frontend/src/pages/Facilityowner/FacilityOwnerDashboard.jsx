import React, { useState, useEffect } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  BarChart, Bar,
  PieChart, Pie, Cell,
  ResponsiveContainer
} from "recharts";
import { format, subDays, subWeeks, subMonths } from "date-fns";
import { useAuth } from "../../context/AuthContext";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

function generateDateLabels(period = "daily") {
  const today = new Date();
  let labels = [];
  if (period === "daily") {
    for (let i = 6; i >= 0; i--) {
      labels.push(format(subDays(today, i), "MMM d"));
    }
  } else if (period === "weekly") {
    for (let i = 5; i >= 0; i--) {
      labels.push(`Week ${format(subWeeks(today, i), "w")}`);
    }
  } else if (period === "monthly") {
    for (let i = 5; i >= 0; i--) {
      labels.push(format(subMonths(today, i), "MMM yyyy"));
    }
  }
  return labels;
}

// Simulate booking data for charts
function generateBookingTrendData(period = "daily") {
  const labels = generateDateLabels(period);
  return labels.map(label => ({
    label,
    bookings: Math.floor(Math.random() * 50) + 5,
  }));
}

function generateEarningsData() {
  return [
    { name: "Courts", value: 400 },
    { name: "Matches", value: 300 },
    { name: "Rentals", value: 300 },
    { name: "Others", value: 200 },
  ];
}

function generatePeakHoursData() {
  const hours = Array.from({ length: 12 }, (_, i) => `${8 + i} AM`);
  return hours.map(hour => ({
    hour,
    bookings: Math.floor(Math.random() * 20),
  }));
}

export default function FacilityOwnerDashboard() {
  const [bookingTrendData, setBookingTrendData] = useState(generateBookingTrendData("daily"));
  const [earningsData] = useState(generateEarningsData());
  const [peakHoursData] = useState(generatePeakHoursData());

  // KPIs - simulated
  const totalBookings = 152;
  const activeCourts = 7;
  const earnings = 3500; // in dollars, simulated
 const { user, isLoading, isError } = useAuth();
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Welcome */}
      <h1 className="text-3xl font-bold">Welcome, {user.fullName}</h1>

      {/* KPI cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded shadow">
          <p className="text-gray-500">Total Bookings</p>
          <p className="text-3xl font-semibold">{totalBookings}</p>
        </div>
        <div className="bg-white p-6 rounded shadow">
          <p className="text-gray-500">Active Courts</p>
          <p className="text-3xl font-semibold">{activeCourts}</p>
        </div>
        <div className="bg-white p-6 rounded shadow">
          <p className="text-gray-500">Earnings</p>
          <p className="text-3xl font-semibold">${earnings.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded shadow">
          <p className="text-gray-500">Booking Calendar</p>
          <div className="mt-2 text-center text-gray-400">[Calendar component here]</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Booking trends */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Booking Trends (Last 7 days)</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={bookingTrendData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <XAxis dataKey="label" />
              <YAxis allowDecimals={false} />
              <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="bookings" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Earnings summary */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Earnings Summary</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={earningsData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={70}
                fill="#8884d8"
                label
              >
                {earningsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Peak booking hours */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Peak Booking Hours</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={peakHoursData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <XAxis dataKey="hour" />
              <YAxis allowDecimals={false} />
              <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
              <Tooltip />
              <Legend />
              <Bar dataKey="bookings" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
