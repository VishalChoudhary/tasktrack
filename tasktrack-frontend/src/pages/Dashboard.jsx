import React from "react";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="">
      <h1 className="">Welcome, {user?.name}! 👋</h1>
      <p className="">
        This is your dashboard. Coming next: stats, tasks, and more!
      </p>

      {/* Placeholder for Day 8 */}
      <div className="">
        <div className="">
          <h2 className="">Total Tasks</h2>
          <p className="">Coming Soon...</p>
        </div>
        <div className="">
          <h2 className="">Completion %</h2>
          <p className="">Coming Soon...</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
