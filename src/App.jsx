// WeatherApp.jsx
import React, { useState, useEffect, useRef, useTransition } from "react";
import "./App.css";

const WeatherApp = () => {
  const [input, setInput] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const inputRef = useRef(null)
  const apiKey = "84b79da5e5d7c92085660485702f4ce8";
  const [loading, setLoading] = useState(false)

  // Default city: Lahore
  useEffect(() => {
    fetchWeatherByCity(input);

    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const kelvinToCelsius = (k) => Math.round(k - 273.15);
  const windSpeedKmH = (mps) => (mps * 3.6).toFixed(1);

  const fetchWeatherByCity = async (cityName) => {
     setLoading(true); 
    try {
      // Step 1: Get coordinates using geocoding
      const ipRes = await fetch("https://api.ipify.org?format=json");
      const ipData = await ipRes.json();

      const locRes = await fetch(`https://ipapi.co/${ipData.ip}/json/`);
      const locData = await locRes.json();

      // console.log("User City:", locData.city);
      // console.log("Country:", locData.country_name);

      const geoRes = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${cityName || locData.city}&limit=1&appid=${apiKey}`
      );
      const geoData = await geoRes.json();
      // console.log(geoData);
      if (!geoData.length) {
        alert("City not found!");
        return;
      }

      const { lat, lon } = geoData[0];

      // Step 2: Fetch weather using coordinates
      const weatherRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`
      );
      const weather = await weatherRes.json();
      setWeatherData(weather);
    } catch (err) {
      console.error("Error fetching weather:", err);
    }
    finally{
       setLoading(false); 
    }
  };

  const iconUrl = weatherData?.weather?.[0]?.icon
    ? `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`
    : "";

  return (
    <div className="min-h-screen  bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center px-4">
      <div className="bg-white relative rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center text-blue-800 mb-6">
          🌤️ Weather Dashboard
        </h1>

        {/* Search Bar */}
        <div className="flex items-center gap-2 mb-6">
          <input
            ref={inputRef}
            type="text"
            placeholder="Enter city name..."
            className="flex-1 px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                fetchWeatherByCity(input);
              }
            }}
          />
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition cursor-pointer"
            onClick={() => fetchWeatherByCity(input)} 
          >
            Search
          </button>
        </div>

        {/* Weather Info */}
        {loading ? <img src="https://i.gifer.com/4V0b.gif" alt="Loading..." width={100} className="mx-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" /> : null}
        {weatherData && (
          <div className="bg-blue-50 rounded-xl p-6 text-center shadow-inner">
            <h2 className="text-2xl font-semibold text-blue-700 mb-2">
              {weatherData.name}, {weatherData.sys.country}
            </h2>
            <p className="text-gray-600 mb-4">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric"
              })}
            </p>

            <div className="flex justify-center items-center mb-4">
              {iconUrl && (
                <img
                  src={iconUrl}
                  alt="Weather Icon"
                  className="w-16 h-16"
                />
              )}
              <span className="text-5xl font-bold text-blue-800 ml-4">
                {kelvinToCelsius(weatherData.main.temp)}°C
              </span>
            </div>

            <p className="text-blue-600 text-lg font-medium">
              {weatherData.weather[0].main}
            </p>
          </div>
        )}
        {/* Extra Info */}
        {weatherData && (
          <div className="mt-6 grid grid-cols-3 gap-4 text-sm text-gray-700 text-center">
            <div>
              <p className="font-medium">Humidity</p>
              <p>{weatherData.main.humidity}%</p>
            </div>
            <div>
              <p className="font-medium">Wind</p>
              <p>{windSpeedKmH(weatherData.wind.speed)} km/h</p>
            </div>
            <div>
              <p className="font-medium">Pressure</p>
              <p>{weatherData.main.pressure} hPa</p>
            </div>
          </div>
        )}
        <p className="text-center text-sm text-gray-600 mt-8">
          Made with
          <span className="inline-block animate-ping-slow text-red-500 mx-1">
            ❤️
          </span>
          by <span className="font-semibold text-gray-800">Muhammad Qasim</span>
        </p>
      </div>


    </div>
  );
};

export default WeatherApp;
