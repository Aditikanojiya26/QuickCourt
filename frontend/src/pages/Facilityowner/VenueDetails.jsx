import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useVenueByIdQuery } from "../../services/facilityowner/venueApi";
import {
  MapPin,
  Star,
  Clock,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import axiosInstance from "../../utils/axios";
const fetchCourtsByVenue = async (venueId) => {
  const { data } = await axiosInstance.get(`/courts/venue/${venueId}`);
  console.log(data);
  return data.data; // assuming ApiResponse structure { status, data, message }
};

const VenueDetails = () => {


  const { id } = useParams();
  const navigate = useNavigate();
  const { data: venue, isLoading, isError, error } = useVenueByIdQuery(id);
  const [mediaIndex, setMediaIndex] = useState(0);
  const [courts, setCourts] = useState([]);
  const [slots, setSlots] = useState([]);
  // Modal state for sport price popup
  const [selectedSport, setSelectedSport] = useState(null);
  const [showPricePopup, setShowPricePopup] = useState(false);
  const generateSlots = (start, end) => {
    const result = [];
    let current = start;
    while (current < end) {
      result.push(`${current}:00 - ${current + 1}:00`);
      current++;
    }
    return result;
  };

  useEffect(() => {
    if (id) {
      fetchCourtsByVenue(id).then((courtsData) => {
        setCourts(courtsData);

        // Example: take first court for slot generation
        if (courtsData.length > 0) {
          const court = courtsData[0];
          const oh = court.operatingHours;
          if (oh?.weekdays?.length > 0) {
            const { start, end } = oh.weekdays[0];
            setSlots(generateSlots(start, end));
          }
        }
      });
    }
  }, [id])
  if (isLoading) return <div>Loading venue...</div>;
  if (isError) return <div>Error: {error?.message}</div>;
  if (!venue) return <div>No venue found</div>;

  if (isLoading)
    return (
      <div className="flex justify-center py-20 text-muted-foreground">
        Loading venue...
      </div>
    );
  if (isError)
    return (
      <div className="flex justify-center py-20 text-destructive">
        Error: {error?.message}
      </div>
    );
  if (!venue)
    return (
      <div className="flex justify-center py-20 text-muted-foreground">
        No venue found
      </div>
    );

  const media = venue.photos || [];
  const mediaCount = media.length;

  const handlePrev = () =>
    setMediaIndex((i) => (i === 0 ? mediaCount - 1 : i - 1));
  const handleNext = () =>
    setMediaIndex((i) => (i === mediaCount - 1 ? 0 : i + 1));

  const rating = 4.5;
  const ratingCount = 6;
  const locationLabel = `${venue.location.city}, ${venue.location.state}`;

  // Reviews fallback if none provided
  const reviews = venue.reviews || [
    {
      id: 1,
      name: "John Doe",
      rating: 5,
      comment: "Great venue, well maintained and clean.",
    },
    {
      id: 2,
      name: "Jane Smith",
      rating: 4,
      comment: "Good facilities but parking is limited.",
    },
  ];

  // Ensure sportsTypes is an array, split if string comma-separated
  const sportsArray =
    typeof venue.sportsTypes === "string"
      ? venue.sportsTypes.split(",").map((item) => item.trim())
      : venue.sportsTypes || [];

  // Modal open/close handlers
  const selectedCourt = courts.find(
    (court) => court.sportsType === selectedSport
  );
  const openPricePopup = (sport) => {
    setSelectedSport(sport);
    setShowPricePopup(true);
  };
  const closePricePopup = () => {
    setShowPricePopup(false);
    setSelectedSport(null);
  };

  return (
    <>
      <div className="max-w-7xl mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Content */}
        <section className="lg:col-span-2 flex flex-col">
          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-4">{venue.name}</h1>

          {/* Location & Rating */}
          <div className="flex flex-wrap items-center gap-6 text-muted-foreground mb-6 text-sm sm:text-base">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-red-600" />
              <span className="font-medium">{locationLabel}</span>
            </div>

            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" />
              <span className="font-medium">
                {rating} ({ratingCount})
              </span>
            </div>
          </div>

          {/* Media Carousel aligned to left */}
          <div className="relative w-full max-w-md rounded-lg overflow-hidden shadow-lg mb-8 self-center sm:self-start">
            {mediaCount > 0 ? (
              <>
                {media[mediaIndex].endsWith(".mp4") ? (
                  <video
                    key={mediaIndex}
                    src={media[mediaIndex]}
                    controls
                    className="w-full h-56 sm:h-80 object-cover rounded-md"
                  />
                ) : (
                  <img
                    key={mediaIndex}
                    src={media[mediaIndex]}
                    alt={`Media ${mediaIndex + 1}`}
                    className="w-full h-56 sm:h-80 object-cover rounded-md"
                  />
                )}

                <button
                  onClick={handlePrev}
                  aria-label="Previous media"
                  className="absolute top-1/2 left-2 -translate-y-1/2 rounded-full bg-white p-2 shadow-md hover:bg-gray-100 transition"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                <button
                  onClick={handleNext}
                  aria-label="Next media"
                  className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-white p-2 shadow-md hover:bg-gray-100 transition"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            ) : (
              <div className="h-56 sm:h-80 flex items-center justify-center bg-gray-100 text-gray-400 rounded-md">
                No media available
              </div>
            )}
          </div>

          {/* Sports Available */}
          <section className="mb-10 border rounded-lg p-6 shadow-sm bg-white">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 flex items-center gap-2">
              Select a Sport to See the Price
            </h2>


            <div className="flex flex-wrap gap-4">
              {sportsArray.map((sport, idx) => (
                <Button
                  key={idx}
                  variant="outline"
                  size="lg"
                  className="capitalize"
                  onClick={() => openPricePopup(sport)}
                  title={`Click to view ${sport} price chart`}
                >
                  {sport}
                </Button>
              ))}
            </div>
          </section>

          {/* Reviews */}
          {/* <section>
            <h2 className="text-xl sm:text-2xl font-semibold mb-6">Reviews</h2>
            {reviews.length === 0 ? (
              <p className="text-muted-foreground">No reviews yet.</p>
            ) : (
              <ul className="space-y-6">
                {reviews.map(({ id, name, rating, comment }) => (
                  <li
                    key={id}
                    className="border p-4 rounded-md shadow-sm bg-white"
                  >
                    <div className="flex items-center mb-2">
                      <Star className="w-5 h-5 text-yellow-400 mr-2" />
                      <span className="font-semibold">{rating.toFixed(1)}</span>
                      <span className="ml-4 font-medium text-gray-700">{name}</span>
                    </div>
                    <p className="text-gray-600">{comment}</p>
                  </li>
                ))}
              </ul>
            )}
          </section> */}
        </section>

        {/* Right Sidebar */}
        <aside className="space-y-8 mt-10 lg:mt-0">
          <Button
            className="w-full bg-green-600 hover:bg-green-700 text-white text-lg font-semibold shadow-lg"
            onClick={() => navigate("/book", { state: { venueId: id } })}
          >
            Book This Venue
          </Button>

          {/* Operating Hours */}

          {/* Operating Hours */}
{courts.length > 0 && (
  <div className="border rounded-xl p-4 shadow-sm hover:shadow-md transition bg-white">
    <h2 className="text-xl font-semibold mb-4">Operating Hours</h2>
    {courts[0].operatingHours?.weekdays?.length > 0 && (
      <p className="text-s text-gray-600">
        Weekdays: {courts[0].operatingHours.weekdays[0].start}:00 -{" "}
        {courts[0].operatingHours.weekdays[0].end}:00
      </p>
    )}
    {courts[0].operatingHours?.weekends?.length > 0 && (
      <p className="text-s text-gray-600">
        Weekends: {courts[0].operatingHours.weekends[0].start}:00 -{" "}
        {courts[0].operatingHours.weekends[0].end}:00
      </p>
    )}
    {courts[0].operatingHours?.holidays?.length > 0 && (
      <p className="text-s text-gray-600">
        Holidays: {courts[0].operatingHours.holidays[0].start}:00 -{" "}
        {courts[0].operatingHours.holidays[0].end}:00
      </p>
    )}
  </div>
)}


          {/* <h2 className="text-xl font-semibold mt-8 mb-4">Available Slots</h2>
<div className="flex flex-wrap gap-2">
  {slots.length > 0 ? (
    slots.map((slot, idx) => (
      <span
        key={idx}
        className="px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm border border-green-200"
      >
        {slot}
      </span>
    ))
  ) : (
    <p className="text-gray-500">No slots available</p>
  )}
</div> */}



          {/* Address */}
          {/* Address with Google Maps Link */}
<div className="border rounded-lg p-5 shadow-sm bg-white">
  <div className="flex items-center gap-3 text-lg font-semibold text-muted-foreground mb-3">
    <MapPin className="w-6 h-6 text-red-600" />
    Address
  </div>
 {venue.location && (
  <>
    <a
      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        `${venue.location.address}, ${venue.location.city}, ${venue.location.state} ${venue.location.pincode}`
      )}`}
      target="_blank"
      rel="noopener noreferrer"
      className="block text-blue-600 hover:underline text-base leading-relaxed mb-2"
    >
      {venue.location.address}
      <br />
      {venue.location.city}, {venue.location.state} - {venue.location.pincode}
    </a>

    <iframe
      title="Google Map"
      width="100%"
      height="300"
      style={{ border: 0 }}
      loading="lazy"
      allowFullScreen
      referrerPolicy="no-referrer-when-downgrade"
      src={`https://www.google.com/maps?q=${encodeURIComponent(
        `${venue.location.address}, ${venue.location.city}, ${venue.location.state} ${venue.location.pincode}`
      )}&output=embed`}
    ></iframe>
  </>
)}

</div>



          {/* Amenities */}
          <section className="border rounded-lg p-6 shadow-sm bg-white">
            <h2 className="text-xl sm:text-2xl font-semibold mb-6">Amenities</h2>
            <ul className="grid grid-cols-1 gap-4 text-muted-foreground">
              {venue.amenities.map((amenity, idx) => (
                <li
                  key={idx}
                  className="flex items-center gap-3 border border-muted rounded-md p-3"
                >
                  <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
                  <span>{amenity}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Location Map Placeholder */}
          <div className="border rounded-lg p-5 shadow-sm bg-white text-center text-gray-400 select-none">
            Location Map (Coming Soon)
          </div>
        </aside>

      </div>

      {/* Price Popup (Modal) */}
      {showPricePopup && selectedCourt && (
        <div
          className="fixed inset-0 backdrop-blur bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={closePricePopup}
        >
          <div
            className="bg-black/80 text-white rounded-lg p-6 max-w-md w-full shadow-lg overflow-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()} // Prevent modal close when clicking inside
          >
            <h3 className="text-xl font-semibold mb-4">
              Price Chart for {selectedSport}
            </h3>

            <table className="w-full border-collapse border border-gray-200 text-sm">
              <thead>
                <tr className="bg-black">
                  <th className="border border-gray-200 px-3 py-2 text-left">
                    Day Type
                  </th>
                  <th className="border border-gray-200 px-3 py-2 text-left">
                    Start - End
                  </th>
                  <th className="border border-gray-200 px-3 py-2 text-left">
                    Price / Hour
                  </th>
                </tr>
              </thead>
              <tbody>
                {selectedCourt.operatingHours?.weekdays?.map((slot, idx) => (
                  <tr key={`weekday-${idx}`}>
                    <td className="border border-gray-200 px-3 py-2">Weekday</td>
                    <td className="border border-gray-200 px-3 py-2">
                      {slot.start}:00 - {slot.end}:00
                    </td>
                    <td className="border border-gray-200 px-3 py-2">
                      ₹{slot.pricePerHour}
                    </td>
                  </tr>
                ))}
                {selectedCourt.operatingHours?.weekends?.map((slot, idx) => (
                  <tr key={`weekend-${idx}`}>
                    <td className="border border-gray-200 px-3 py-2">Weekend</td>
                    <td className="border border-gray-200 px-3 py-2">
                      {slot.start}:00 - {slot.end}:00
                    </td>
                    <td className="border border-gray-200 px-3 py-2">
                      ₹{slot.pricePerHour}
                    </td>
                  </tr>
                ))}
                {selectedCourt.operatingHours?.holidays?.map((slot, idx) => (
                  <tr key={`holiday-${idx}`}>
                    <td className="border border-gray-200 px-3 py-2">Holiday</td>
                    <td className="border border-gray-200 px-3 py-2">
                      {slot.start}:00 - {slot.end}:00
                    </td>
                    <td className="border border-gray-200 px-3 py-2">
                      ₹{slot.pricePerHour}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button
              className="mt-6 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              onClick={closePricePopup}
            >
              Close
            </button>
          </div>
        </div>
      )}

    </>
  );
};

export default VenueDetails;
