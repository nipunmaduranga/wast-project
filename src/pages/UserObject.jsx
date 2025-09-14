import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const UserObject = () => {
  const [data, setData] = useState([]);
  const [latestMaterial, setLatestMaterial] = useState("");
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef(null);
  const navigate = useNavigate();

  const getMaterialColor = (material) => {
    const colors = {
      plastic: "#00ffcc",
      metal: "#39ff14",
      glass: "#1effff",
      default: "#7f8c8d",
    };
    return colors[material?.toLowerCase()] || colors.default;
  };

  const fetchData = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/joystick");
      const json = await res.json();
      if (json.length > 0) {
        setData(json);
        setLatestMaterial(json[0].material);
      }
    } catch (err) {
      console.error("Error fetching joystick data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    intervalRef.current = setInterval(fetchData, 2000);
    return () => clearInterval(intervalRef.current);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black p-6 font-mono text-green-300">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-green-400 tracking-wider drop-shadow-lg">
          Real Time Dashboard
        </h1>
        <div className="flex items-center gap-2 bg-green-700/30 border border-green-500 px-4 py-2 rounded-full shadow-lg animate-pulse">
          <i className="fas fa-signal"></i> Live
        </div>
      </div>

      {/* Real-time Display */}
      <div className="flex flex-col items-center gap-6">
        <div className="flex justify-center items-center h-56 w-full md:w-1/3 mx-auto bg-black/30 backdrop-blur-sm rounded-full shadow-lg border border-green-500">
          {latestMaterial ? (
            <span
              className="font-extrabold text-5xl animate-pulse drop-shadow-xl"
              style={{ color: getMaterialColor(latestMaterial) }}
            >
              {latestMaterial.toUpperCase()}
            </span>
          ) : (
            <span className="text-green-500 text-2xl">No Object</span>
          )}
        </div>

        {/* Button */}
        <button
          onClick={() => navigate("/dashboard")}
          className="px-6 py-3 bg-green-600 text-black font-bold rounded-xl shadow-lg hover:bg-green-500 transition-all duration-300"
        >
          Dashboard
        </button>
      </div>

      {/* Footer */}
      <div className="mt-6 text-center text-green-400 text-sm tracking-wide">
        Last updated: {new Date().toLocaleTimeString()}
      </div>
    </div>
  );
};

export default UserObject;
