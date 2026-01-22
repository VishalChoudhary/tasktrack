import React from "react";

const StatCard = ({ label, value, color = "blue", icon }) => {
  const colorClasses = {
    blue: `
    bg-blue-50 border-blue-200 text-blue-600
    dark:bg-gradient-to-br dark:from-blue-950/40 dark:to-gray-900
    dark:border-blue-900/30 dark:text-blue-200
  `,
    green: `
    bg-green-50 border-green-200 text-green-600
    dark:bg-gradient-to-br dark:from-green-950/40 dark:to-gray-900
    dark:border-green-900/30 dark:text-green-200
  `,
    orange: `
    bg-orange-50 border-orange-200 text-orange-600
    dark:bg-gradient-to-br dark:from-orange-950/40 dark:to-gray-900
    dark:border-orange-900/30 dark:text-orange-200
  `,
    yellow: `
    bg-yellow-50 border-yellow-200 text-yellow-600
    dark:bg-gradient-to-br dark:from-yellow-950/40 dark:to-gray-900
    dark:border-yellow-900/30 dark:text-yellow-200
  `,
    red: `
    bg-red-50 border-red-200 text-red-600
    dark:bg-gradient-to-br dark:from-red-950/40 dark:to-gray-900
    dark:border-red-900/30 dark:text-red-200
  `,
    purple: `
    bg-purple-50 border-purple-200 text-purple-600
    dark:bg-gradient-to-br dark:from-purple-950/40 dark:to-gray-900
    dark:border-purple-900/30 dark:text-purple-200
  `,
  };

  return (
    <div
      className={`
        ${colorClasses[color] || colorClasses.blue}
        border rounded-xl p-6
        shadow-sm hover:shadow-md
        transition-colors
      `}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {label}
          </p>
          <p className="text-3xl font-bold">{value}</p>
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </div>
  );
};

export default StatCard;
