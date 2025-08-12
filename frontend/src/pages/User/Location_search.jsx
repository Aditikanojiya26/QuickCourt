import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input"; // adjust import path as needed
import { MapPin } from "lucide-react";

export default function LocationSearch({ setCity }) {
  const [inputValue, setInputValue] = useState("");
  const [geoError, setGeoError] = useState(false);

  useEffect(() => {
    if (!navigator.geolocation) {
      console.warn("Geolocation is not supported by this browser.");
      setGeoError(true);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=en`
          );
          const data = await res.json();

          const city =
            data.address.city ||
            data.address.town ||
            data.address.village ||
            data.address.county ||
            "";

          if (city) {
            setInputValue(city);
            setCity(city);
            setGeoError(false);
          }
        } catch (error) {
          console.error("Failed to fetch city from coordinates", error);
          setGeoError(true);
        }
      },
      (error) => {
        console.warn("Geolocation permission denied or unavailable", error);
        setGeoError(true);
      }
    );
  }, [setCity]);

  const handleChange = (e) => {
    setInputValue(e.target.value);
    setCity(e.target.value);
  };

  return (
    <div className="relative w-full max-w-md mx-auto border-black mb-3">
      <MapPin
        className="absolute left-3 top-1/2 -translate-y-1/2 text-black/40 "
        size={20}
      />
      <Input
        type="text"
        placeholder={
          geoError
            ? "Enter city (location permission denied)"
            : "Enter city"
        }
        value={inputValue}
        onChange={handleChange}
        className="pl-10 border-black"
        autoComplete="off"
      />
      {/* {geoError && (
        <p className="text-sm text-red-600 mt-1 text-center">
          Location permission denied. Please enter city manually.
        </p>
      )} */}
    </div>
  );
}
