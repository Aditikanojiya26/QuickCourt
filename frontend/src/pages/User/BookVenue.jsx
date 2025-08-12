import React, { useState } from "react";
import book from "../../assets/book.jpg"
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  createBookingApi,
  fetchAvailableSlots,
  fetchCourtsByVenue,
} from "../../services/User/api";

import { queryClient } from "../../utils/queryClient";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const BookVenue = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { venueId } = location.state || {};

  const [courtId, setCourtId] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [duration, setDuration] = useState(1);
  const [error, setError] = useState(null);

  // Fetch courts for venue
  const {
    data: courts = [],
    isLoading: courtsLoading,
    isError: courtsError,
  } = useQuery({
    queryKey: ["courts", venueId],
    queryFn: () => fetchCourtsByVenue(venueId),
    enabled: !!venueId,
  });

  const { data: slots = [], isLoading: slotsLoading } = useQuery({
    queryKey: ["slots", venueId, courtId, date],
    queryFn: () => fetchAvailableSlots({ venueId, courtId, date }),
    enabled: !!venueId && !!courtId && !!date,
  });

  const mutation = useMutation({
    mutationFn: createBookingApi,
    onSuccess: () => {
      toast.success("Booking created successfully!");
      queryClient.invalidateQueries(["slots", venueId, courtId, date]);
      navigate("/user/dashboard"); // adjust if needed
    },
    onError: (err) => {
      setError(err.response?.data?.message || "Booking failed");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    mutation.mutate({
      venueId,
      courtId,
      date,
      startTime: Number(startTime),
      duration: Number(duration),
    });
  };

  if (!venueId)
    return (
      <p className="text-center text-red-600 font-semibold">
        Please select a venue first.
      </p>
    );

  return (
    <div
  className="h-screen flex justify-center items-center"
  style={{
    backgroundImage: `url(${book})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  }}
>
  <form
    onSubmit={handleSubmit}
    className="max-w-md w-full p-6 space-y-6 bg-white rounded-lg shadow-md"
  >
      {/* Courts dropdown */}
      <div>
        <Label htmlFor="court" className="mb-1 block font-semibold">
          Court
        </Label>
        {courtsLoading ? (
          <p>Loading courts...</p>
        ) : courtsError ? (
          <p className="text-red-600">Error loading courts.</p>
        ) : (
          <Select value={courtId} onValueChange={setCourtId} id="court" required>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a court" />
            </SelectTrigger>
            <SelectContent>
              {courts.map((court) => (
                <SelectItem key={court._id} value={court._id}>
                  {court.name || court._id}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Date input */}
      <div>
        <Label htmlFor="date" className="mb-1 block font-semibold">
          Date
        </Label>
        <Input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>

      {/* Start Time dropdown */}
      <div>
        <Label htmlFor="startTime" className="mb-1 block font-semibold">
          Start Time
        </Label>
        {slotsLoading ? (
          <p>Loading available slots...</p>
        ) : (
          <Select
            value={startTime}
            onValueChange={setStartTime}
            id="startTime"
            required
            disabled={!slots.length}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a start time" />
            </SelectTrigger>
            <SelectContent>
              {slots
                .filter((slot) => slot.status === "available")
                .map((slot, idx) => (
                  <SelectItem key={idx} value={String(slot.time.split("-")[0])}>
                    {slot.time}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Duration input */}
      <div>
        <Label htmlFor="duration" className="mb-1 block font-semibold">
          Duration (hours)
        </Label>
        <Input
          type="number"
          min="1"
          max="10"
          id="duration"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          required
        />
      </div>

      <Button
        type="submit"
        disabled={mutation.isLoading}
        className="w-full"
      >
        {mutation.isLoading ? "Booking..." : "Book Venue"}
      </Button>

      {error && <p className="text-red-600 mt-2 text-center">{error}</p>}
    </form>
    </div>
  );
};

export default BookVenue;
