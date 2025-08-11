import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { NavLink } from "react-router-dom";

// --- API Service Functions ---
const fetchVenues = async () => {
  const response = await fetch(
    "http://localhost:8000/api/v1/venues/getAllVenuesByOwner",
    {
      credentials: "include",
    }
  );
  if (!response.ok) {
    throw new Error("Network response was not ok while fetching venues");
  }
  const data = await response.json();
  return data.data;
};

const fetchCourts = async () => {
  const response = await fetch(
    "http://localhost:8000/api/v1/courts/getAllCourtsByOwner",
    { credentials: "include" }
  );
  if (!response.ok) {
    throw new Error("Network response was not ok while fetching courts");
  }
  const data = await response.json();
  return data.data;
};

// --- Reusable Table Component ---
function TanstackTable({ data, columns, isLoading, isError, error }) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) return <div className="p-4 text-center">Loading data...</div>;
  if (isError)
    return (
      <div className="p-4 text-center text-red-500">Error: {error.message}</div>
    );

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-100">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="p-4 text-left text-sm font-semibold text-gray-600"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className="border-b border-gray-200 hover:bg-gray-50"
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="p-4 text-sm text-gray-800">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// --- Venues Table Component ---
function VenuesList() {
  const {
    data = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["venuesList"],
    queryFn: fetchVenues,
  });

  const columns = [
    { header: "Venue Name", accessorKey: "name" },
    { header: "City", accessorKey: "location.city" },
    { header: "State", accessorKey: "location.state" },
    {
      header: "Sports Offered",
      accessorKey: "sportsTypes",
      cell: (info) => info.getValue().flat().join(", "),
    },
  ];

  return (
    <TanstackTable
      data={data}
      columns={columns}
      isLoading={isLoading}
      isError={isError}
      error={error}
    />
  );
}

// --- Courts Table Component ---
function CourtsList() {
  const {
    data = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["courtsList"],
    queryFn: fetchCourts,
  });

  const columns = [
    { header: "Court Name", accessorKey: "name" },
    {
      header: "Venue",
      accessorKey: "venueId.name",
    },
    { header: "Sport", accessorKey: "sportsType" },
    {
      header: "Weekday Price",
      accessorKey: "operatingHours",
      cell: ({ row }) => {
        const price = row.original.operatingHours?.weekdays?.[0]?.pricePerHour;
        return price ? `₹${price}` : "N/A";
      },
    },
    {
      header: "Weekend Price",
      accessorKey: "operatingHours",
      cell: ({ row }) => {
        const price = row.original.operatingHours?.weekends?.[0]?.pricePerHour;
        return price ? `₹${price}` : "N/A";
      },
    },
  ];

  return (
    <TanstackTable
      data={data}
      columns={columns}
      isLoading={isLoading}
      isError={isError}
      error={error}
    />
  );
}

// --- Main Component with Tabs ---
export default function FacilityOwnerVenuesAndCourtList() {
  const [activeTab, setActiveTab] = React.useState("venues");

  const TabButton = ({ tabName, children }) => (
    <button
      onClick={() => setActiveTab(tabName)}
      className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
        activeTab === tabName
          ? "bg-indigo-600 text-white"
          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="w-full min-h-full p-4 md:p-8">
      <div className="w-full max-w-6xl mx-auto bg-white p-6 rounded-xl shadow-lg border border-gray-200">
        <div className="flex justify-between items-center gap-4 mb-6">
          <h2 className="text-3xl font-bold text-gray-800">
            My Venues and Courts
          </h2>
          <div className="flex gap-2">
            <NavLink to="/facilityowner/venues/create">
              <button className="flex items-center gap-2 bg-gray-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-gray-700 transition-colors">
                + Add Venue
              </button>
            </NavLink>
            <NavLink to="add-court">
              <button className="flex items-center gap-2 bg-indigo-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors">
                + Add Court
              </button>
            </NavLink>
          </div>
        </div>

        <div className="flex justify-center gap-4 mb-6 border-b border-gray-200 pb-4">
          <TabButton tabName="venues">Venues</TabButton>
          <TabButton tabName="courts">Courts</TabButton>
        </div>

        <div className="transition-opacity duration-300">
          {activeTab === "venues" && <VenuesList />}
          {activeTab === "courts" && <CourtsList />}
        </div>
      </div>
    </div>
  );
}
