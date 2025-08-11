import { useState, useEffect } from "react";
import { Search, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LocationSearchBar({ onSearch }) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=en`
          );
          const data = await response.json();

          const city =
            data.address.city ||
            data.address.town ||
            data.address.village ||
            data.address.suburb ||
            data.address.neighbourhood ||
            data.address.hamlet ||
            data.address.county ||
            data.address.state_district ||
            data.address.state ||
            "";

          if (city) {
            setQuery(city);
            onSearch(city);
          }
        } catch (error) {
          console.error("Failed to fetch city from coordinates", error);
        }
      });
    }
  }, [onSearch]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-lg mx-auto flex items-center gap-2">
      <div className="relative flex-1">
        <MapPin className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-black w-5 h-5" />
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search location..."
          className="pl-10 border-gray-800 text-black"
        />
      </div>
      <Button type="submit" size="icon">
        <Search className="w-4 h-4" />
      </Button>
    </form>
  );
}