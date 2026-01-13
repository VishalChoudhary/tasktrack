import React from "react";

const StatCard = ({ label, value, color = "blue", icon }) => {
  const colorClasses = {
    blue: "bg-blue-50 border-blue-200 text-blue-600",
    green: "bg-green-50 border-green-200 text-green-600",
    orange: "bg-orange-50 border-orange-200 text-orange-600",
    yellow: "bg-yellow-50 border-yellow-200 text-yellow-600",
    red: "bg-red-50 border-red-200 text-red-600",
    purple: "bg-purple-50 border-purple-200 text-purple-600",
  };

  return (
    <div
      className={`${
        colorClasses[color] || colorClasses[blue]
      } border-2 rounded-lg p-6 shadow-sm hover:shadow-md trasition`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
          <p className="text-3xl font-bold">{value}</p>
          <p className="text-4xl">{icon}</p>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
