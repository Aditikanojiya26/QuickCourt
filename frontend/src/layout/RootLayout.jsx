import Navbar from "../components/Navbar.jsx";
import banner from "../assets/banner2.jpg"
import LocationSearch from "../pages/User/Location_search.jsx";


const RootLayout = () => {
  return (
    <div className="text-gray-800">

      {/* Navbar at the top */}
      <Navbar />

      {/* Section 1: Hero */}
      <section className="w-full h-screen flex items-center justify-center" style={{
        height: "calc(100vh - 4rem)", // 4rem = h-16
        backgroundImage: `url(${banner})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}>
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center md:text-left">
          <div><LocationSearch /></div>
          <h1 className="text-4xl md:text-4xl font-bold text-black mb-4">
            Your city. Your sport. Your squad.
          </h1>
          <p className="text-black/100">
            Easily explore sports venues and play with enthusiasts just like you.
          </p>
        </div>
      </section>

      {/* Section 2 */}
      <section className="w-full h-screen bg-gradient-to-br from-yellow-100 via-pink-100 to-rose-200 flex items-center justify-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-800"></h1>
      </section>

      {/* Section 3 */}
      <section className="w-full h-screen bg-gradient-to-br from-yellow-100 via-orange-100 to-rose-200 flex items-center justify-center">
      
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900"></h1>
      </section>

    </div>
  );
};

export default RootLayout;