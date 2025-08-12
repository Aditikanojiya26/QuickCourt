import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { fetchOwnerBookings } from "../../services/User/api";


export default function OwnerBookingsTable() {
  const { data: bookings = [], isLoading, isError, error } = useQuery({
    queryKey: ["ownerBookings"],
    queryFn: fetchOwnerBookings,
  });

  const columns = React.useMemo(
    () => [
      {
        accessorKey: "_id",
        header: "Booking ID",
        cell: info => info.getValue().slice(-6), // show last 6 chars
      },
      {
        accessorKey: "userId.fullName",
        header: "User",
      },
      {
        accessorKey: "userId.email",
        header: "User Email",
      },
      {
        accessorKey: "courtId.name",
        header: "Court",
      },
      {
        accessorKey: "courtId.sportsType",
        header: "Sport",
      },
      {
        accessorKey: "venueId.name",
        header: "Venue",
      },
      {
        accessorKey: "venueId.location.city",
        header: "City",
      },
      {
        accessorKey: "date",
        header: "Date",
        cell: info => new Date(info.getValue()).toLocaleDateString(),
      },
      {
        accessorKey: "startTime",
        header: "Start Time",
        cell: info => `${info.getValue()}:00`,
      },
      {
        accessorKey: "endTime",
        header: "End Time",
        cell: info => `${info.getValue()}:00`,
      },
      {
        accessorKey: "totalPrice",
        header: "Price ($)",
      },
      {
        accessorKey: "status",
        header: "Status",
      },
    ],
    []
  );

  const table = useReactTable({
    data: bookings,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) return <div>Loading bookings...</div>;
  if (isError) return <div>Error: {error.message}</div>;
  if (!bookings.length) return <div>No bookings found.</div>;

  return (
    <div className="p-4 max-w-full overflow-x-auto">
      <table className="min-w-full border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold text-gray-700"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr
              key={row.id}
              className="even:bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              {row.getVisibleCells().map(cell => (
                <td
                  key={cell.id}
                  className="border border-gray-300 px-3 py-2 text-sm"
                >
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

