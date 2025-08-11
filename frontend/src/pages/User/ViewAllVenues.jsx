import React from 'react'
import { useVenuesQuery } from '../../services/facilityowner/venueApi';
import { NavLink } from 'react-router-dom';

const ViewAllVenues = () => {
    const {data,isPending,isError} = useVenuesQuery();
    
  return (
    <>
      {isPending && <div>Loading...</div>}
      {isError && <div>Error fetching venues</div>}
      {data && data.map(venue => (
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
    </>
  )
}

export default ViewAllVenues