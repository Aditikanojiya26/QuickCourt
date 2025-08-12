import { useState, useEffect } from "react";

export function useCurrentCity() {
  const [city, setCity] = useState("");

  useEffect(() => {
    if (!navigator.geolocation) {
      console.warn("Geolocation not supported");
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
          const cityName =
            data.address.city || data.address.town || data.address.village || "";
          if (cityName) setCity(cityName);
        } catch (error) {
          console.error("Failed to fetch location data:", error);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
      }
    );
  }, []);

  return city;
}
