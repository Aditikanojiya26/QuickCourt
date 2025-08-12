import React from "react";

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

const PopularSports = () => {
  return (
    <section
      className="relative w-full max-w-[1440px] mx-auto py-8 px-4 sm:px-6 lg:px-8"
      style={{
        backgroundImage:
          "url('https://www.ballarat.vic.gov.au/sites/default/files/styles/content_header_large_1000_x_640/public/page/field_image/2021-04/shutterstock_1026630514_LR.jpg?itok=KL24kV88')",
        backgroundSize: "contain",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        height: "auto",
      }}
    >
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-center text-black drop-shadow-md">
        Popular Sports
      </h2>
      <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {sportsData.map((sport) => (
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
  );
};

export default PopularSports;
