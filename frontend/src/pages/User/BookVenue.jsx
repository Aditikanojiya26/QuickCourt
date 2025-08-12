import React, { useState } from "react";
import book from "../../assets/book.jpg"; // Assuming this path is correct
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
import SimulatedPaymentGateway from "../Payment/SimulatedPaymentGateway"; // Import the new payment gateway component

const BookVenue = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { venueId, venueName } = location.state || {}; // Assuming venueName is also passed

  const [courtId, setCourtId] = useState("");
  const [courtName, setCourtName] = useState(""); // State to store court name for payment summary
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [duration, setDuration] = useState(1);
  const [error, setError] = useState(null);
  const [showPaymentGateway, setShowPaymentGateway] = useState(false); // New state for payment gateway visibility
  const [bookingPayload, setBookingPayload] = useState(null); // To store booking details for payment

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
      setShowPaymentGateway(false); // Hide payment gateway
      navigate("/user/dashboard"); // Adjust if needed
    },
    onError: (err) => {
      setError(err.response?.data?.message || "Booking failed");
      toast.error(err.response?.data?.message || "Booking failed!");
      setShowPaymentGateway(false); // Hide payment gateway on error
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    // Prepare booking details to pass to the payment gateway
    const selectedCourt = courts.find((court) => court._id === courtId);
    if (!selectedCourt) {
      toast.error("Please select a valid court.");
      return;
    }

    const payload = {
      venueId,
      courtId,
      date,
      startTime: Number(startTime),
      duration: Number(duration),
      courtName: selectedCourt.name || selectedCourt._id, // Pass court name for display
      venueName: venueName, // Pass venue name for display
    };
    setBookingPayload(payload);
    setShowPaymentGateway(true); // Show the payment gateway
  };

  // Callback from SimulatedPaymentGateway when payment is successful
  const handlePaymentSuccess = (payload) => {
    mutation.mutate(payload); // Trigger the actual booking mutation
  };

  // Callback from SimulatedPaymentGateway when payment fails or is cancelled
  const handlePaymentFailure = () => {
    setShowPaymentGateway(false); // Hide payment gateway
    setError("Payment was not completed.");
  };

  const handleCancelPayment = () => {
    setShowPaymentGateway(false);
    setBookingPayload(null);
    setError("Booking cancelled by user.");
  };

  if (!venueId)
    return (
      <p className="text-center text-red-600 font-semibold mt-10">
        Please select a venue first to book a slot.
      </p>
    );

  return (
    <div
      className="h-screen flex justify-center items-center p-4"
      style={{
        backgroundImage: `url(${book})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {!showPaymentGateway ? ( // Conditionally render booking form or payment gateway
        <form
          onSubmit={handleSubmit}
          className="max-w-md w-full p-6 space-y-6 bg-white rounded-lg shadow-xl"
        >
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Book Your Slot
          </h2>

          {/* Courts dropdown */}
          <div>
            <Label
              htmlFor="court"
              className="mb-1 block font-semibold text-gray-700"
            >
              Court
            </Label>
            {courtsLoading ? (
              <p className="text-gray-600">Loading courts...</p>
            ) : courtsError ? (
              <p className="text-red-600">Error loading courts.</p>
            ) : (
              <Select
                value={courtId}
                onValueChange={(value) => {
                  setCourtId(value);
                  const selectedCourt = courts.find((c) => c._id === value);
                  if (selectedCourt) setCourtName(selectedCourt.name);
                }}
                id="court"
                required
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a court" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {courts.map((court) => (
                      <SelectItem key={court._id} value={court._id}>
                        {court.name || `Court ${court._id.substring(0, 4)}`}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Date input */}
          <div>
            <Label
              htmlFor="date"
              className="mb-1 block font-semibold text-gray-700"
            >
              Date
            </Label>
            <Input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              min={new Date().toISOString().split("T")[0]} // Prevents selecting past dates
            />
          </div>

          {/* Start Time dropdown */}
          <div>
            <Label
              htmlFor="startTime"
              className="mb-1 block font-semibold text-gray-700"
            >
              Start Time
            </Label>
            {slotsLoading ? (
              <p className="text-gray-600">Loading available slots...</p>
            ) : (
              <Select
                value={startTime}
                onValueChange={setStartTime}
                id="startTime"
                required
                disabled={!slots.length || !courtId || !date}
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={
                      slots.length
                        ? "Select a start time"
                        : "No slots available for selected date/court"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {slots
                      .filter((slot) => slot.status === "available")
                      .map((slot, idx) => (
                        <SelectItem
                          key={idx}
                          value={String(slot.time.split("-")[0])}
                        >
                          {slot.time}
                        </SelectItem>
                      ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Duration input */}
          <div>
            <Label
              htmlFor="duration"
              className="mb-1 block font-semibold text-gray-700"
            >
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
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300"
          >
            Proceed to Payment
          </Button>

          {error && <p className="text-red-600 mt-4 text-center">{error}</p>}
        </form>
      ) : (
        // Render the payment gateway when showPaymentGateway is true
        <SimulatedPaymentGateway
          bookingDetails={bookingPayload}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentFailure={handlePaymentFailure}
          onCancel={handleCancelPayment}
        />
      )}
    </div>
  );
};

export default BookVenue;
