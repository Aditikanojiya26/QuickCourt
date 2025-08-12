import React, { useRef, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { NavLink, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axios";

const VenuesPage = ({ city = "" }) => {
  const navigate = useNavigate();

  const fetchVenues = async (city) => {
    if (!city) {
      const { data } = await axiosInstance.get("/venues");
      return data.data;
    }
    const { data } = await axiosInstance.get(`/venues/search?city=${city}`);
    return data.data;
  };

  const {
    data: venues = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["venuesByCity", city || "all"],
    queryFn: () => fetchVenues(city),
  });

  const carouselRef = useRef(null);
  const [isMobileView, setIsMobileView] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Detect screen size to toggle mobile/desktop view
  useEffect(() => {
    const checkMobile = () => setIsMobileView(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Carousel scroll for desktop
  const scroll = (direction) => {
    if (!carouselRef.current) return;
    const scrollAmount = 320;
    if (direction === "left") {
      carouselRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    } else {
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  // Handlers for mobile single card navigation
  const prev = () => {
    setCurrentIndex((prev) => (prev === 0 ? venues.length - 1 : prev - 1));
  };

  const next = () => {
    setCurrentIndex((prev) => (prev === venues.length - 1 ? 0 : prev + 1));
  };

  if (isLoading) return <div>Loading venues...</div>;
  if (isError) return <div>Error loading venues: {error.message}</div>;
  if (venues.length === 0)
    return <div>No venues found{city ? ` in "${city}"` : ""}.</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto relative">
      <h1 className="text-3xl text-center font-bold mb-6">
        {city ? `Venues in "${city}"` : "All Venues"}
      </h1>

      {isMobileView ? (
        // Mobile: single card with prev/next arrows
        <div className="relative max-w-md mx-auto">
          <NavLink
            to={`/venues/${venues[currentIndex]._id}`}
            className="border rounded-lg shadow-md overflow-hidden flex flex-col bg-white hover:shadow-xl transition-shadow"
          >
            {venues[currentIndex].photos && venues[currentIndex].photos.length > 0 && (
              <img
                src={venues[currentIndex].photos[0]}
                alt={venues[currentIndex].name}
                className="h-48 w-full object-cover"
                loading="lazy"
              />
            )}
            <div className="p-4 flex flex-col flex-grow">
              <h2 className="text-xl font-semibold mb-1">{venues[currentIndex].name}</h2>
              <p className="text-gray-700 mb-2 line-clamp-3">{venues[currentIndex].description}</p>
              <div className="mt-auto">
                <p className="text-sm text-gray-500 mb-1">
                  <strong>Venue Type:</strong> {venues[currentIndex].venueType}
                </p>
                <p className="text-sm text-gray-500 mb-1">
                  <strong>Sports Types:</strong> {venues[currentIndex].sportsTypes.join(", ")}
                </p>
                <p className="text-sm text-gray-500 mb-3">
                  <strong>Amenities:</strong> {venues[currentIndex].amenities.join(", ")}
                </p>
              </div>
            </div>
          </NavLink>

          {/* Left Arrow */}
          <button
            onClick={prev}
            aria-label="Previous Venue"
            className="absolute left-0 top-1/2 -translate-y-1/2 rounded-full bg-white p-2 shadow-md hover:bg-gray-100 transition"
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

          {/* Right Arrow */}
          <button
            onClick={next}
            aria-label="Next Venue"
            className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full bg-white p-2 shadow-md hover:bg-gray-100 transition"
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
          <div className="flex justify-center">
            <button
              className="bg-blue-700 text-white px-4 py-2 rounded mb-6 mt-5"
              onClick={() => navigate("/browse")}
            >
              View More
            </button>
          </div>
        </div>
      ) : (
        // Desktop: horizontal scroll carousel with left/right arrows
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
                to={`/venues/${venue._id}`}
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
                      <strong>Venue City:</strong> {venue.location.city}
                    </p>
                    <p className="text-sm text-gray-500 mb-1">
                      <strong>Venue Type:</strong> {venue.venueType}
                    </p>
                    <p className="text-sm text-gray-500 mb-1">
                      <strong>Sports Types:</strong> {venue.sportsTypes.join(", ")}
                    </p>
                    <p className="text-sm text-gray-500 mb-3">
                      <strong>Amenities:</strong> {venue.amenities.join(", ")}
                    </p>
                    <p className="text-sm text-gray-500 mb-3">
                      <strong>Rating:</strong> {venue.rate} ⭐
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
          <div className="flex justify-center">
            <button
              className="bg-blue-700 text-white px-4 py-2 rounded mb-6 mt-5"
              onClick={() => navigate("/browse")}
            >
              View More
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VenuesPage;
