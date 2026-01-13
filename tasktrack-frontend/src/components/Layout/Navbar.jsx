import React from "react";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="">
      <div className="">
        {/* Logo / Brand */}
        <Link to="/" className="">
          📋 TaskTrack
        </Link>

        {/* Navigation Links */}
        <div className="">
          {isAuthenticated ? (
            <>
              {/* Authenticated Links */}
              <Link to="/dashboard" className="">
                Dashboard
              </Link>
              <Link to="/tasks" className="">
                Tasks
              </Link>

              {/* User Info & Logout */}
              <div className="">
                <span className="">
                  Hi, <strong>{user && user.name ? user.name : "User"}</strong>
                </span>
                <button onClick={handleLogout} className="">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Unauthenticated Links */}
              <Link to="/login" className="">
                Login
              </Link>
              <Link to="/register" className="">
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
