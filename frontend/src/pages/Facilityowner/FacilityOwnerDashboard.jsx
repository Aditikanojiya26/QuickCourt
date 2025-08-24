import React from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  BarChart, Bar,
  PieChart, Pie, Cell,
  ResponsiveContainer
} from "recharts";
import { useAuth } from "../../context/AuthContext";
import { fetchtotalBookings } from "../../services/facilityowner/venueApi";
import { useQuery } from "@tanstack/react-query";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

// Mock static data
const mockAnalysisData = {
  earnings: 12500,
};


const mockEarningsData = [
  { name: "Badminton", value: 5000 },
  { name: "Tennis", value: 3000 },

];

const mockPeakHoursData = [
  { hour: "9 AM", bookings: 5 },
  { hour: "10 AM", bookings: 8 },
  { hour: "11 AM", bookings: 7 },
  { hour: "12 PM", bookings: 10 },
  { hour: "1 PM", bookings: 6 },
  { hour: "2 PM", bookings: 4 },
];

export default function FacilityOwnerDashboard() {
  const { user, isLoading: userLoading, isError: userError } = useAuth();
  const { data, isLoading: analysisLoading, isError } = useQuery({
    queryKey: ["totalBookings"],
    queryFn: fetchtotalBookings,
  });
  console.log(data);
  if (analysisLoading) return <p>Loading...</p>;
  if (userLoading) return <p>Loading user info...</p>;
  if (userError) return <p>Error loading user info.</p>;

  const totalBookings = mockAnalysisData.totalBookings;
  const activeCourts = mockAnalysisData.activeCourts;
  const earnings = mockAnalysisData.earnings;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold">Welcome, {user.fullName}</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded shadow">
          <p className="text-gray-500">Total Bookings</p>
          <p className="text-3xl font-semibold">{data.totalBooking}</p>
        </div>
        <div className="bg-white p-6 rounded shadow">
          <p className="text-gray-500">Active Courts</p>
          <p className="text-3xl font-semibold">{data.totalCourts}</p>
        </div>
        <div className="bg-white p-6 rounded shadow">
          <p className="text-gray-500">Earnings</p>
          <p className="text-3xl font-semibold">₹ {data.totalEarningsResult[0].totalEarnings}</p>

        </div>
        <div className="bg-white p-6 rounded shadow"> 
          <p className="text-gray-500">Booking Calendar</p>
          <div className="mt-2 text-center text-gray-400">[Calendar component here]</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Booking Trends */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Bookings (Next 7 days)</h2>

          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data.chartData}>
              <XAxis dataKey="label" />
              <YAxis allowDecimals={false} />
              <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="bookings" stroke="#4f46e5" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>


        {/* Earnings */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Earnings Summary</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={mockEarningsData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={70}
                fill="#8884d8"
                label
              >
                {mockEarningsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Peak Hours */}
        {/* Peak Hours */}
<div className="bg-white p-6 rounded shadow">
  <h2 className="text-xl font-semibold mb-4">Peak Booking Hours</h2>
  <ResponsiveContainer width="100%" height={200}>
    <BarChart
      data={data.bookingsByStartTime.map(item => ({
        hour: item._id,          // startTime from backend
        bookings: item.count     // number of bookings
      }))}
    >
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
