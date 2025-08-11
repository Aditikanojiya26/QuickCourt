import Navbar from "../components/Navbar.jsx";

const RootLayout = () => {
  return (
    <div className="text-gray-800">

      {/* Navbar at the top */}
      <Navbar />

      {/* Section 1: Hero */}
      <section className="w-full h-screen bg-gradient-to-br from-purple-600 via-indigo-500 to-blue-500 flex items-center justify-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white">Section 1</h1>
      </section>

      {/* Section 2 */}
      <section className="w-full h-screen bg-gradient-to-br from-yellow-100 via-pink-100 to-rose-200 flex items-center justify-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-800">Section 2</h1>
      </section>

      {/* Section 3 */}
      <section className="w-full h-screen bg-gradient-to-br from-yellow-100 via-orange-100 to-rose-200 flex items-center justify-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900">Section 3</h1>
      </section>

    </div>
  );
};

export default RootLayout;
