import React, { useEffect, useState } from "react";

const UserDashboard = () => {
  const [wasteRecords, setWasteRecords] = useState([]);
  const [totalReward, setTotalReward] = useState(0);
  const [latestMaterial, setLatestMaterial] = useState("");
  const [error, setError] = useState("");

  const materialRewards = {
    plastic: 10,
    metal: 20,
    glass: 30,
  };

  const fetchJoystickData = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/joystick");
      if (!res.ok) throw new Error("Failed to fetch data");
      const data = await res.json();

      if (Array.isArray(data)) {
        let total = 0;
        const records = data.map((row) => {
          const material = row.material || "unknown";
          const reward = materialRewards[material] || 0;
          total += reward;
          return {
            dateTime: row.time ? new Date(row.time).toLocaleString() : "-",
            type: material,
            quantity: 1,
            amount: reward,
          };
        });

        setWasteRecords(records);
        setTotalReward(total);

        if (records.length > 0) {
          setLatestMaterial(records[records.length - 1].type); // ✅ latest record
        }
      }
    } catch (err) {
      console.error("Error fetching joystick data:", err);
      setError("⚠️ Unable to fetch waste records. Please try again later.");
    }
  };

  useEffect(() => {
    fetchJoystickData();
    const interval = setInterval(fetchJoystickData, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black p-6 text-white font-mono">
      {/* Header */}
      <h1 className="text-4xl font-extrabold mb-6 text-green-400 tracking-wider drop-shadow-lg">
        User Dashboard
      </h1>

      {/* Error Message */}
      {error && (
        <div className="bg-red-900 text-red-300 p-4 rounded-xl mb-6 text-center">
          {error}
        </div>
      )}

      {/* Latest Material */}
      {latestMaterial && (
        <div className="bg-gradient-to-r from-green-900 to-green-600 p-8 rounded-2xl shadow-xl text-center mb-6 border border-green-400/50">
          <p className="text-6xl font-extrabold uppercase text-green-300 animate-pulse drop-shadow-lg">
            {latestMaterial}
          </p>
          <p className="text-green-200 mt-2 text-lg">Latest Submission</p>
        </div>
      )}

      {/* Total Reward */}
      <div className="bg-gradient-to-r from-purple-900 via-green-900 to-blue-900 p-6 rounded-2xl shadow-xl mb-6 text-center border border-green-400/50">
        <p className="text-2xl font-bold text-green-300">
          Total Reward Earned: Rs. {totalReward}
        </p>

        {/* Withdraw Money Button */}
        <button
          className="mt-4 px-6 py-2 rounded-full bg-green-400 text-black font-bold uppercase shadow-lg hover:shadow-green-500/50 transition-all duration-300 transform hover:scale-105"
          onClick={() => alert("Withdraw feature coming soon!")}
        >
          Withdraw Money
        </button>
      </div>

      {/* Waste Records Table */}
      <div className="overflow-x-auto bg-black/40 backdrop-blur-sm p-4 rounded-2xl shadow-xl border border-green-500">
        <h2 className="text-2xl font-semibold mb-4 text-green-400 tracking-wide">
          Waste Records
        </h2>

        {wasteRecords.length === 0 ? (
          <p className="text-gray-400 text-center">No waste records found.</p>
        ) : (
          <table className="w-full table-auto border border-green-700 text-sm">
            <thead>
              <tr className="bg-green-700/80 text-black">
                <th className="px-3 py-2 border border-green-600">
                  Date & Time
                </th>
                <th className="px-3 py-2 border border-green-600">
                  Material Type
                </th>
                <th className="px-3 py-2 border border-green-600">Quantity</th>
                <th className="px-3 py-2 border border-green-600">
                  Reward (Rs.)
                </th>
              </tr>
            </thead>
            <tbody>
              {wasteRecords.map((record, index) => (
                <tr
                  key={index}
                  className="hover:bg-green-900/30 transition-colors"
                >
                  <td className="px-3 py-2 border border-green-600">
                    {record.dateTime}
                  </td>
                  <td className="px-3 py-2 border border-green-600">
                    {record.type}
                  </td>
                  <td className="px-3 py-2 border border-green-600">
                    {record.quantity}
                  </td>
                  <td className="px-3 py-2 border border-green-600">
                    {record.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
