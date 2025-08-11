import { useParams } from "react-router-dom";
import { useVenueByIdQuery } from "../../services/facilityowner/venueApi";


const VenueDetails = () => {
  const { id } = useParams();
  console.log("Venue ID:", id);
  const { data: venue, isLoading, isError, error } = useVenueByIdQuery(id);

  if (isLoading) return <div>Loading venue...</div>;
  if (isError) return <div>Error: {error?.message}</div>;


  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{venue.name}</h1>
      <p className="text-gray-600 mb-4">{venue.description}</p>
      
      {/* Photos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {venue.photos.map((photo, index) => (
          <img
            key={index}
            src={photo}
            alt={`Venue ${index + 1}`}
            className="w-full h-48 object-cover rounded"
          />
        ))}
      </div>

      {/* Details */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <p><strong>Venue Type:</strong> {venue.venueType}</p>
        <p><strong>Sports Types:</strong> {venue.sportsTypes.join(", ")}</p>
        <p><strong>Amenities:</strong> {venue.amenities.join(", ")}</p>
        <p><strong>About:</strong> {venue.about}</p>
        <p><strong>Location:</strong> {venue.location.address}, {venue.location.city}, {venue.location.state} - {venue.location.pincode}</p>
      </div>
    </div>
  );
};

export default VenueDetails;
