import React from "react";
import { useAuth } from "../../context/AuthContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { IMAGES } from "../../constants/images";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-gray-700  text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo / Brand */}
        <Link to="/" className="flex items-center gap-2">
          <img src={IMAGES.LOGO} alt="Task.io" className="h-8 w-auto" />
          <span className="text-xl font-bold">Task.io</span>
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

              {/* Dark Mode Theme Button */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-gray-600 transition-colors"
              >
                {theme === "dark" ? (
                  // Sun Icon (for Dark Mode -> Switch to Light)
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-yellow-400"
                  >
                    <circle cx="12" cy="12" r="5"></circle>
                    <line x1="12" y1="1" x2="12" y2="3"></line>
                    <line x1="12" y1="21" x2="12" y2="23"></line>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                    <line x1="1" y1="12" x2="3" y2="12"></line>
                    <line x1="21" y1="12" x2="23" y2="12"></line>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                  </svg>
                ) : (
                  // Moon Icon (for Light Mode -> Switch to Dark)
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-white"
                  >
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                  </svg>
                )}
              </button>

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
              <Link
                to="/login"
                className={`px-4 py-2 rounded transition ${
                  currentPath === "/login"
                    ? "border border-gray-500  px-4 py-2 rounded transition"
                    : "hover:bg-gray-600"
                }`}
              >
                Login
              </Link>
              <Link
                to="/register"
                className={`px-4 py-2 rounded transition ${
                  currentPath === "/register"
                    ? "border border-gray-500  px-4 py-2 rounded transition"
                    : "hover:bg-gray-600"
                }`}
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
