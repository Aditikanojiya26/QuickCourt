import React, { useState } from "react";
import Navbar from "../components/Navbar.jsx";
import banner from "../assets/banner2.jpg";
import LocationSearch from "../pages/User/Location_search.jsx";
import VenuesPage from "../pages/Facilityowner/VenuesPage.jsx";
const sportsData = [
  {
    name: "Football",
    img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Basketball",
    img: "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Tennis",
    img: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Cricket",
    img: "https://images.unsplash.com/photo-1535914254981-b5012eebbd15?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Badminton",
    img: "https://gameonfamily.com/cdn/shop/articles/Depositphotos_9388060_original.jpg?v=1739840875&width=1100",
  },
  {
    name: "Volleyball",
    img: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=800&q=80",
  },
];
const RootLayout = () => {
  const [city, setCity] = useState(""); // state lifted here

  return (
    <div className="text-gray-800">
      {/* Navbar at the top */}
      <Navbar />

      {/* Section 1: Hero with background banner */}
      <section
        className="w-full h-screen flex items-center justify-center"
        style={{
          height: "calc(100vh - 4rem)", // 4rem = h-16
          backgroundImage: `url(${banner})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center md:text-left">
          {/* Pass setCity down to LocationSearch */}
          <LocationSearch setCity={setCity} />
          <h1 className="text-4xl md:text-4xl font-bold text-black mb-4">
            Your city. Your sport. Your squad.
          </h1>
          <p className="text-black/100">
            Easily explore sports venues and play with enthusiasts just like you.
          </p>
        </div>
      </section>

      {/* Section 2: Venues listing filtered by city */}
      <section className="w-full h-screen bg-gradient-to-br from-yellow-100 via-pink-100 to-rose-200 flex items-center justify-center">
        <VenuesPage city={city} />
      </section>

      {/* Section 3: Empty or future content */}
     <div
  className="relative w-full bg-fixed bg-no-repeat bg-center"
  style={{
    // backgroundImage:
    //   "url('https://www.ballarat.vic.gov.au/sites/default/files/styles/content_header_large_1000_x_640/public/page/field_image/2021-04/shutterstock_1026630514_LR.jpg?itok=KL24kV88')",
    backgroundSize: "cover", // or "contain" if you want it fully visible
  }}
>
  <section
    className="relative   max-w-[1440px] mx-auto py-8 px-4 sm:px-6 lg:px-8"
    style={{ height: "auto" }}
  >
    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-center text-black drop-shadow-md">
      Popular Sports
    </h2>
    <div className="max-w-6xl xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {sportsData.map((sport, index) => (
        <div
          key={sport.name}
         className="relative rounded-lg overflow-hidden shadow-xl cursor-pointer hover:shadow-2xl transition-shadow duration-300 transform hover:scale-105"

        >
          <img
            src={sport.img}
            alt={sport.name}
            className="w-full h-32 sm:h-36 md:h-40 lg:h-48 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70"></div>
          <div className="absolute bottom-0 left-0 right-0 text-white text-center py-2 text-xs sm:text-sm font-semibold">
            {sport.name}
          </div>
        </div>
      ))}
    </div>
  </section>
</div  >
    </div>
  );
};

export default RootLayout;
