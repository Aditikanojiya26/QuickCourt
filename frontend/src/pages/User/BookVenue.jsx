import React, { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import axiosInstance from "../../utils/axios";
import { toast } from "sonner";
import { useLocation, useNavigate } from "react-router-dom";

export default function BookingForm() {
   const location = useLocation();
   const navigate = useNavigate();
  const venueId = location.state?.venueId;
  const [sportType, setSportType] = useState("");
  const [courtId, setCourtId] = useState("");
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");

  // 1️⃣ Fetch courts for venue
  const { data: courtsData, isLoading: courtsLoading } = useQuery({
    queryKey: ["courts", venueId],
    queryFn: async () => {
      const res = await axiosInstance.get(`courts/venue/${venueId}`);
      return res.data.data; // ApiResponse.data
    },
    enabled: !!venueId,
  });

  // Extract available sport types
  const sportTypes = useMemo(() => {
    if (!courtsData) return [];
    return [...new Set(courtsData.map(c => c.sportsType))];
  }, [courtsData]);

  // Filter courts by selected sport
  const filteredCourts = useMemo(() => {
    if (!courtsData || !sportType) return [];
    return courtsData.filter(c => c.sportsType === sportType);
  }, [courtsData, sportType]);

  // 2️⃣ Fetch available slots
  const { data: slotsData, isLoading: slotsLoading } = useQuery({
    queryKey: ["slots", courtId, date],
    queryFn: async () => {
      const res = await axiosInstance.get(`booking/slots`, {
        params: { courtId, date }
      });
      return res.data.data; // ApiResponse.data
    },
    enabled: !!courtId && !!date,
  });

  // 3️⃣ Book slot
  const mutation = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.post("/booking/bookslot", {
        venueId,
        courtId,
        sport: sportType,
        date,
        slot
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Booking successful!");
      navigate("/user/dashboard");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Booking failed");
    }
  });

  return (
    <div className="max-w-lg mx-auto p-4 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Book a Court</h2>

      {/* Sport Type */}
      <label className="block mb-2 font-medium">Select Sport</label>
      <select
        value={sportType}
        onChange={e => {
          setSportType(e.target.value);
          setCourtId("");
          setSlot("");
        }}
        className="w-full border p-2 rounded mb-4"
      >
        <option value="">-- Select Sport --</option>
        {sportTypes.map(type => (
          <option key={type} value={type}>{type}</option>
        ))}
      </select>

      {/* Court */}
      {filteredCourts.length > 0 && (
        <>
          <label className="block mb-2 font-medium">Select Court</label>
          <select
            value={courtId}
            onChange={e => {
              setCourtId(e.target.value);
              setSlot("");
            }}
            className="w-full border p-2 rounded mb-4"
          >
            <option value="">-- Select Court --</option>
            {filteredCourts.map(court => (
              <option key={court._id} value={court._id}>{court.name}</option>
            ))}
          </select>
        </>
      )}

      {/* Date */}
      {courtId && (
        <>
          <label className="block mb-2 font-medium">Select Date</label>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="w-full border p-2 rounded mb-4"
            min={new Date().toISOString().split("T")[0]}
          />
        </>
      )}

      {/* Slots */}
      {slotsLoading && <p>Loading slots...</p>}
      {slotsData && slotsData.length > 0 && (
        <>
          <label className="block mb-2 font-medium">Select Slot</label>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {slotsData.map(s => (
              <button
                key={s.slot}
                onClick={() => setSlot(s.slot)}
                className={`p-2 border rounded ${
                  slot === s.slot ? "bg-blue-500 text-white" : "hover:bg-blue-100"
                }`}
              >
                {s.slot}
              </button>
            ))}
          </div>
        </>
      )}

      {/* Book Button */}
      <button
        onClick={() => mutation.mutate()}
        disabled={!slot || mutation.isLoading}
        className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 disabled:bg-gray-300"
      >
        {mutation.isLoading ? "Booking..." : "Book Now"}
      </button>
    </div>
  );
}
