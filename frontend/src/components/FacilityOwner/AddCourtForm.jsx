import React, { useEffect } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// --- API Service Functions ---
const fetchVenues = async () => {
  const response = await fetch(
    "http://localhost:8000/api/v1/venues/getAllVenuesByOwner",
    {
      credentials: "include", // Ensure you're sending cookies if needed for auth
    }
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await response.json();
  return data.data;
};

const createCourts = async (newCourts) => {
  const response = await fetch("http://localhost:8000/api/v1/courts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ courts: newCourts }),
  });

  if (!response.ok) {
    let errorMessage = `API Error: ${response.status} ${response.statusText}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch (e) {
      console.error("Could not parse error response as JSON", e);
    }
    throw new Error(errorMessage);
  }
  return response.json();
};

// --- Helper Component for Each Court Entry ---
function CourtEntryCard({
  courtIndex,
  control,
  remove,
  venues,
  errors,
  setValue,
}) {
  const venueId = useWatch({
    control,
    name: `courts.${courtIndex}.venueId`,
  });

  const selectedVenue = venues.find((v) => v._id === venueId);

  // Safely handle both ["Badminton", "Tennis"] and ["badminton,tennis"] formats
  const availableSports =
    selectedVenue?.sportsTypes
      ?.flatMap((sport) => sport.split(","))
      .map((s) => s.trim()) || [];

  // This effect now correctly resets the sportsType for this specific card
  // whenever its corresponding venueId changes.
  useEffect(() => {
    setValue(`courts.${courtIndex}.sportsType`, "");
  }, [venueId, courtIndex, setValue]);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 relative space-y-4 shadow-sm transition-all hover:shadow-md">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold text-gray-700">
          Court #{courtIndex + 1}
        </h3>
        <button
          type="button"
          onClick={() => remove(courtIndex)}
          className="h-7 w-7 flex items-center justify-center bg-gray-200 hover:bg-red-500 text-gray-600 hover:text-white font-bold rounded-full transition-colors"
        >
          &times;
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Venue *
          </label>
          <select
            {...control.register(`courts.${courtIndex}.venueId`, {
              required: "Venue is required",
            })}
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">-- Choose a Venue --</option>
            {venues.map((venue) => (
              <option key={venue._id} value={venue._id}>
                {venue.name}
              </option>
            ))}
          </select>
          {errors.courts?.[courtIndex]?.venueId && (
            <p className="text-sm text-red-600 mt-1">
              {errors.courts[courtIndex].venueId.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sport Type *
          </label>
          <select
            {...control.register(`courts.${courtIndex}.sportsType`, {
              required: "Sport is required",
            })}
            disabled={!venueId}
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm disabled:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">-- Choose a Sport --</option>
            {availableSports.map((sport) => (
              <option key={sport} value={sport}>
                {sport}
              </option>
            ))}
          </select>
          {errors.courts?.[courtIndex]?.sportsType && (
            <p className="text-sm text-red-600 mt-1">
              {errors.courts[courtIndex].sportsType.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-gray-200">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Court Name *
          </label>
          <input
            {...control.register(`courts.${courtIndex}.name`, {
              required: "Court name is required",
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="e.g., Court A"
          />
          {errors.courts?.[courtIndex]?.name && (
            <p className="text-sm text-red-600 mt-1">
              {errors.courts[courtIndex].name.message}
            </p>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <h4 className="md:col-span-3 text-sm font-semibold text-gray-600">
            Weekday Hours
          </h4>
          <input
            type="number"
            {...control.register(
              `courts.${courtIndex}.operatingHours.weekdays.start`,
              { required: true, valueAsNumber: true }
            )}
            placeholder="Start (24hr)"
            className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="number"
            {...control.register(
              `courts.${courtIndex}.operatingHours.weekdays.end`,
              { required: true, valueAsNumber: true }
            )}
            placeholder="End (24hr)"
            className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="number"
            {...control.register(
              `courts.${courtIndex}.operatingHours.weekdays.pricePerHour`,
              { required: true, valueAsNumber: true }
            )}
            placeholder="Price/Hour"
            className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <h4 className="md:col-span-3 text-sm font-semibold text-gray-600">
            Weekend Hours
          </h4>
          <input
            type="number"
            {...control.register(
              `courts.${courtIndex}.operatingHours.weekends.start`,
              { required: true, valueAsNumber: true }
            )}
            placeholder="Start (24hr)"
            className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="number"
            {...control.register(
              `courts.${courtIndex}.operatingHours.weekends.end`,
              { required: true, valueAsNumber: true }
            )}
            placeholder="End (24hr)"
            className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="number"
            {...control.register(
              `courts.${courtIndex}.operatingHours.weekends.pricePerHour`,
              { required: true, valueAsNumber: true }
            )}
            placeholder="Price/Hour"
            className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
    </div>
  );
}

// --- Main Form Component ---
export default function AddCourtForm() {
  const queryClient = useQueryClient();
  const {
    data: venues = [],
    isLoading: isLoadingVenues,
    isError: isErrorVenues,
    error,
  } = useQuery({
    queryKey: ["venues"],
    queryFn: fetchVenues,
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue, // Get setValue from useForm to pass to children
  } = useForm({
    defaultValues: {
      courts: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "courts",
  });

  const mutation = useMutation({
    mutationFn: createCourts,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["courts"] });
      toast.success(data.message);
      reset({ courts: [] });
    },
    onError: (error) => alert(`Error: ${error.message}`),
  });

  const addNewCourt = () => {
    append({
      venueId: "",
      sportsType: "",
      name: "",
      operatingHours: {
        weekdays: { start: 9, end: 17, pricePerHour: 100 },
        weekends: { start: 10, end: 20, pricePerHour: 150 },
      },
    });
  };

  const onSubmit = (data) => {
    if (data.courts.length === 0) {
      alert("Please add at least one court to submit.");
      return;
    }
    mutation.mutate(data.courts);
  };

  if (isLoadingVenues)
    return <div className="p-8 text-center">Loading venues...</div>;
  if (isErrorVenues)
    return (
      <div className="p-8 text-center text-red-500">
        Failed to load venues: {error.message}
      </div>
    );

  return (
    <div className="w-full min-h-full flex justify-center p-4">
      <div className="w-full max-w-4xl bg-white p-8 rounded-xl shadow-lg border border-gray-200">
        <h2 className="text-3xl font-bold text-center mb-2 text-gray-800">
          Add New Courts
        </h2>

        {mutation.isError && (
          <div className="bg-red-100 border-red-400 text-red-700 p-3 rounded-md mb-6">
            {mutation.error.message}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-6 max-h-[50vh] overflow-y-auto p-2 -mr-2">
            {fields.map((field, index) => (
              <CourtEntryCard
                key={field.id}
                courtIndex={index}
                control={control}
                remove={remove}
                venues={venues}
                errors={errors}
                setValue={setValue} // Pass setValue down to the card
              />
            ))}
            {fields.length === 0 && (
              <div className="text-center py-10 border-2 border-dashed border-gray-300 rounded-lg">
                <p className="text-gray-500">
                  Click the button below to add your first court.
                </p>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={addNewCourt}
            className="w-full flex items-center justify-center gap-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-800 font-bold py-2 px-4 rounded-md border border-indigo-200 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Add Another Court
          </button>

          <div className="pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={mutation.isPending || fields.length === 0}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-md transition duration-300 ease-in-out disabled:bg-indigo-300 disabled:cursor-not-allowed"
            >
              {mutation.isPending
                ? "Submitting..."
                : `Submit ${fields.length} Court(s)`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
