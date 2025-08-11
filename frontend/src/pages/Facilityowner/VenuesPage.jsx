import React, { useRef } from "react";
import { useVenuesQuery } from "../../services/facilityowner/venueApi";
import { NavLink } from "react-router-dom";

const VenuesPage = () => {
  const { data: venues, isLoading, isError, error } = useVenuesQuery();
  const carouselRef = useRef(null);

  if (isLoading) return <div>Loading venues...</div>;
  if (isError) return <div>Error loading venues: {error.message}</div>;

  const scroll = (direction) => {
    if (!carouselRef.current) return;
    const scrollAmount = 320;
    if (direction === "left") {
      carouselRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    } else {
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">All Venues</h1>

      <div className="relative">
        {/* Left Arrow */}
        <button
          onClick={() => scroll("left")}
          aria-label="Scroll Left"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white p-2 shadow-md hover:bg-gray-100 transition"
        >
          <svg
            className="h-6 w-6 text-gray-600"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        {/* Carousel Container */}
        <div
          ref={carouselRef}
          className="flex space-x-6 overflow-x-auto scroll-smooth px-8"
          style={{
            scrollbarWidth: "none", // Firefox
            msOverflowStyle: "none", // IE & Edge
          }}
        >
          <style>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>

          {venues.map((venue) => (
            <NavLink
              key={venue._id}
              to={`venues/${venue._id}`}
              className="min-w-[300px] max-w-[300px] border rounded-lg shadow-md overflow-hidden flex flex-col bg-white hover:shadow-xl transition-shadow"
            >
              {venue.photos && venue.photos.length > 0 && (
                <img
                  src={venue.photos[0]}
                  alt={venue.name}
                  className="h-48 w-full object-cover"
                  loading="lazy"
                />
              )}

              <div className="p-4 flex flex-col flex-grow">
                <h2 className="text-xl font-semibold mb-1">{venue.name}</h2>
                <p className="text-gray-700 mb-2">{venue.description}</p>
                <div className="mt-auto">
                  <p className="text-sm text-gray-500 mb-1">
                    <strong>Venue Type:</strong> {venue.venueType}
                  </p>
                  <p className="text-sm text-gray-500 mb-1">
                    <strong>Sports Types:</strong> {venue.sportsTypes.join(", ")}
                  </p>
                  <p className="text-sm text-gray-500 mb-3">
                    <strong>Amenities:</strong> {venue.amenities.join(", ")}
                  </p>
                </div>
              </div>
            </NavLink>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll("right")}
          aria-label="Scroll Right"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white p-2 shadow-md hover:bg-gray-100 transition"
        >
          <svg
            className="h-6 w-6 text-gray-600"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default VenuesPage;