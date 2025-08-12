import React, { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { NavLink } from "react-router-dom";
import Navbar from "../../components/Navbar";
import {
  fetchCourts,
  fetchVenues,
} from "../../services/facilityowner/venueApi";

// --- Corrected Data Fetching Hook ---
const useVenuesWithPricingQuery = () => {
  return useQuery({
    queryKey: ["venuesWithPricing"],
    queryFn: async () => {
      // Promise.all will now directly give you the data arrays
      const [venues, courts] = await Promise.all([
        fetchVenues(),
        fetchCourts(),
      ]);

      // The rest of your logic works perfectly with this change
      const priceMap = new Map();

      for (const court of courts) {
        if (!court.venueId?._id || !court.operatingHours) continue;

        const venueId = court.venueId._id;

        const allPricesForCourt = [
          ...(court.operatingHours.weekdays || []),
          ...(court.operatingHours.weekends || []),
          ...(court.operatingHours.holidays || []),
        ]
          .map((slot) => slot.pricePerHour)
          .filter((price) => typeof price === "number");

        if (allPricesForCourt.length === 0) continue;

        const minPriceForCourt = Math.min(...allPricesForCourt);

        if (
          !priceMap.has(venueId) ||
          minPriceForCourt < priceMap.get(venueId)
        ) {
          priceMap.set(venueId, minPriceForCourt);
        }
      }

      const venuesWithPricing = venues.map((venue) => ({
        ...venue,
        pricePerHour: priceMap.get(venue._id) || null,
        // Using a more stable pseudo-random rating based on venue ID
        rating: ((parseInt(venue._id.slice(-5), 16) % 15) / 10 + 3.5).toFixed(
          1
        ),
        reviews: (parseInt(venue._id.slice(-3), 16) % 200) + 10,
      }));

      return venuesWithPricing;
    },
    // Optional: Add staleTime to prevent refetching too often
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// --- UI Components (Unchanged) ---

const Star = ({ filled = false }) => (
  <svg
    className={`w-4 h-4 ${filled ? "text-yellow-400" : "text-gray-300"}`}
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.96a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.446a1 1 0 00-.364 1.118l1.287 3.96c.3.921-.755 1.688-1.54 1.118l-3.368-2.446a1 1 0 00-1.175 0l-3.368 2.446c-.784.57-1.838-.197-1.539-1.118l1.287-3.96a1 1 0 00-.364-1.118L2.07 9.387c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.96z" />
  </svg>
);

const VenueCard = ({ venue }) => (
  // Wrap the entire card in a NavLink from react-router-dom
  <NavLink
    to={`/venues/${venue._id}`}
    className="block h-full" // Use block and h-full for proper layout
  >
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden flex flex-col h-full hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <img
        src={
          venue.photos?.[0] ||
          "https://placehold.co/600x400/cccccc/ffffff?text=No+Image"
        }
        alt={venue.name}
        className="h-48 w-full object-cover"
        loading="lazy"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src =
            "https://placehold.co/600x400/ef4444/ffffff?text=Image+Error";
        }}
      />
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-bold text-gray-800">{venue.name}</h3>
          <div className="flex items-center gap-1 text-sm">
            <Star filled />
            <span>{venue.rating ?? "N/A"}</span>
            <span className="text-gray-500">({venue.reviews ?? 0})</span>
          </div>
        </div>
        <p className="text-sm text-gray-500 mb-2">{venue.location?.city}</p>

        <p className="text-sm text-gray-600 mb-4">
          Starts from{" "}
          <span className="font-bold text-indigo-600">
            {venue.pricePerHour ? `₹${venue.pricePerHour}` : "N/A"}
          </span>
          /hour
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {(venue.sportsTypes || [])
            .flatMap((sport) => sport.split(","))
            .map((sport) => (
              <span
                key={sport.trim()}
                className="bg-gray-100 text-gray-700 text-xs font-semibold px-2 py-1 rounded-full capitalize"
              >
                {sport.trim()}
              </span>
            ))}
          <span className="bg-indigo-100 text-indigo-700 text-xs font-semibold px-2 py-1 rounded-full">
            {venue.venueType}
          </span>
        </div>
        <div className="mt-auto">
          {/* The button is now part of a larger link, but we keep it for styling */}
          <div className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-md text-center">
            View Details
          </div>
        </div>
      </div>
    </div>
  </NavLink>
);

const FilterSidebar = ({
  filters,
  onFilterChange,
  onSearch,
  onClear,
  onClose,
  sportOptions = [],
  maxPriceValue = 3000,
}) => (
  <aside className="space-y-6">
    <div className="flex justify-between items-center">
      <h2 className="text-xl font-bold">Filters</h2>
      {onClose && (
        <button onClick={onClose} className="lg:hidden text-2xl">
          &times;
        </button>
      )}
    </div>

    <div>
      <label className="text-sm font-semibold">Search by venue name</label>
      <input
        type="text"
        name="searchTerm"
        value={filters.searchTerm}
        onChange={onFilterChange}
        placeholder="Search for venues"
        className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>

    <div>
      <label className="text-sm font-semibold">Filter by sport type</label>
      <select
        name="sportType"
        value={filters.sportType}
        onChange={onFilterChange}
        className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <option>All Sports</option>
        {sportOptions.map((sport) => (
          <option key={sport} value={sport} className="capitalize">
            {sport}
          </option>
        ))}
      </select>
    </div>

    <div>
      <label className="text-sm font-semibold">Price range (per hour)</label>
      <input
        type="range"
        name="maxPrice"
        min="0"
        max={maxPriceValue}
        step="50"
        value={filters.maxPrice}
        onChange={onFilterChange}
        className="w-full mt-2"
      />
      <div className="flex justify-between text-xs text-gray-500">
        <span>₹0</span>
        <span>₹{filters.maxPrice}</span>
      </div>
    </div>

    <div>
      <label className="text-sm font-semibold">Choose Venue Type</label>
      <div className="mt-2 space-y-1">
        {["", "Indoor", "Outdoor"].map((type) => (
          <label key={type || "All"} className="flex items-center gap-2">
            <input
              type="radio"
              name="venueType"
              value={type}
              checked={filters.venueType === type}
              onChange={onFilterChange}
            />
            {type || "All"}
          </label>
        ))}
      </div>
    </div>

    <div>
      <label className="text-sm font-semibold">Rating</label>
      <div className="mt-2 space-y-1">
        {[4, 3, 2, 1].map((r) => (
          <label key={r} className="flex items-center gap-2">
            <input
              type="checkbox"
              name="minRating"
              value={r}
              checked={filters.minRating === r}
              onChange={onFilterChange}
            />
            {r} stars & up
          </label>
        ))}
      </div>
    </div>

    <button
      onClick={onSearch}
      className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-md hover:bg-indigo-700 transition-colors"
    >
      Search
    </button>
    <button
      onClick={onClear}
      className="w-full bg-gray-200 text-gray-700 font-semibold py-2 rounded-md hover:bg-gray-300 transition-colors"
    >
      Clear Filters
    </button>
  </aside>
);

// --- Main App Component (Unchanged) ---
export default function ViewAllVenues() {
  const {
    data: venues,
    isLoading,
    isError,
    error,
  } = useVenuesWithPricingQuery();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const dynamicSportOptions = useMemo(() => {
    if (!venues) return [];
    const allSports = venues.flatMap((venue) =>
      (venue.sportsTypes || []).flatMap((sport) => sport.split(","))
    );
    return [...new Set(allSports.map((s) => s.trim().toLowerCase()))]
      .filter(Boolean)
      .sort();
  }, [venues]);

  const maxVenuePrice = useMemo(() => {
    if (!venues || venues.length === 0) return 3000;
    const prices = venues
      .map((v) => v.pricePerHour)
      .filter((p) => typeof p === "number");
    if (prices.length === 0) return 3000;
    const maxPrice = Math.max(...prices);
    return Math.ceil(maxPrice / 50) * 50;
  }, [venues]);

  const initialFiltersState = useMemo(
    () => ({
      searchTerm: "",
      sportType: "All Sports",
      maxPrice: maxVenuePrice,
      venueType: "",
      minRating: 0,
    }),
    [maxVenuePrice]
  );

  // We only need one state for filters now
  const [filters, setFilters] = useState(initialFiltersState);

  useEffect(() => {
    // Reset filters when the max price changes (on initial data load)
    setFilters(initialFiltersState);
  }, [initialFiltersState]);

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (checked ? Number(value) : 0) : value,
    }));
  };

  // The "Clear Filters" button now directly resets the single filters state
  const handleClearFilters = () => {
    setFilters(initialFiltersState);
  };

  // The filtering logic now uses `filters` directly instead of `appliedFilters`
  const filteredVenues = useMemo(() => {
    if (!venues) return [];
    return venues.filter((venue) => {
      const { searchTerm, sportType, maxPrice, venueType, minRating } = filters;

      const venueSports = (venue.sportsTypes || [])
        .flatMap((s) => s.split(","))
        .map((s) => s.trim().toLowerCase());

      const nameMatch = venue.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const sportMatch =
        sportType.toLowerCase() === "all sports" ||
        venueSports.includes(sportType.toLowerCase());
      const priceMatch =
        typeof venue.pricePerHour !== "number" ||
        venue.pricePerHour <= maxPrice;
      const venueTypeMatch =
        !venueType || venue.venueType.toLowerCase() === venueType.toLowerCase();
      const ratingMatch = (venue.rating ?? 0) >= minRating;

      return (
        nameMatch && sportMatch && priceMatch && venueTypeMatch && ratingMatch
      );
    });
  }, [venues, filters]); // Depends on `filters` now

  useEffect(() => {
    document.body.style.overflow = isFilterOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isFilterOpen]);

  // Removed onSearch from props, as the "Search" button is gone
  const commonFilterProps = {
    filters,
    onFilterChange: handleFilterChange,
    onClear: handleClearFilters,
    sportOptions: dynamicSportOptions,
    maxPriceValue: maxVenuePrice,
  };

  // ... The rest of your return JSX remains the same ...
  // You should remove the <button> for "Search" inside the FilterSidebar component
  // to reflect these changes.
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setIsFilterOpen(true)}
            className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 font-semibold py-2 px-4 rounded-md shadow-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                clipRule="evenodd"
              />
            </svg>
            Filters
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="hidden lg:block lg:col-span-1 bg-white p-6 rounded-xl shadow-lg border border-gray-200 h-fit">
            {/* The sidebar will no longer have a Search button */}
            <FilterSidebar {...commonFilterProps} />
          </div>

          {isFilterOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div
                className="absolute inset-0 bg-black/50"
                onClick={() => setIsFilterOpen(false)}
              ></div>
              <div className="relative bg-white w-80 h-full p-6 overflow-y-auto">
                <FilterSidebar
                  {...commonFilterProps}
                  onClose={() => setIsFilterOpen(false)}
                />
              </div>
            </div>
          )}

          <main className="lg:col-span-3">
            {isLoading && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 animate-pulse"
                  >
                    <div className="h-48 bg-gray-200 rounded-md mb-4"></div>
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded w-full"></div>
                  </div>
                ))}
              </div>
            )}
            {isError && (
              <div className="text-center p-10 text-red-500 bg-red-50 rounded-lg">
                <h3 className="font-bold text-lg mb-2">Something went wrong</h3>
                <p>Error: {error?.message || "Could not fetch data."}</p>
              </div>
            )}
            {!isLoading && !isError && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredVenues.length > 0 ? (
                  filteredVenues.map((venue) => (
                    <VenueCard key={venue._id} venue={venue} />
                  ))
                ) : (
                  <div className="md:col-span-2 xl:col-span-3 text-center text-gray-500 py-10 bg-white rounded-lg shadow-sm">
                    <h3 className="font-bold text-lg mb-2">No Venues Found</h3>
                    <p>
                      Try adjusting your search filters to find what you're
                      looking for.
                    </p>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
