import React from "react";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-gray-700  text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo / Brand */}
        <Link to="/" className="text-xl font-bold">
          📋 TaskTrack
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-6">
          {isAuthenticated ? (
            <>
              {/* Authenticated Links */}
              <Link
                to="/dashboard"
                className="hover:text-indigo-200 transition"
              >
                Dashboard
              </Link>
              <Link to="/tasks" className="hover:text-indigo-200 transition">
                Tasks
              </Link>

              {/* User Info & Logout */}
              <div className="flex items-center gap-4 border-l gray-indigo-400 pl-4">
                <span className="text-sm">
                  Hi, <strong>{user && user.name ? user.name : "User"}</strong>
                </span>
                <button
                  onClick={handleLogout}
                  className="border border-gray-500 hover:bg-gray-600 px-4 py-2 rounded transition"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Unauthenticated Links */}
              <Link to="/login" className="hover:text-indigo-200 transition">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-white text-indigo-600 px-4 py-2 rounded hover:bg-indigo-50 transition"
              >
                Register
              </Link>
            </>
          )}
          <button
            onClick={toggleTheme}
            className="text-xl hover:scale-110 transition"
            title="Toggle theme"
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
