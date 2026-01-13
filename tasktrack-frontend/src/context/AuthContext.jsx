import React, { createContext, useEffect, useState } from "react";
import { authAPI } from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user already logged in on app loading
  useEffect(() => {
    if (token) {
      verifyUser();
    } else {
      setLoading(false);
    }
  }, []);

  const verifyUser = async () => {
    try {
      const response = await authAPI.getCurrentUser();
      setUser(response.data.user);
      setError(null);
    } catch (error) {
      // Token invalid, clear it
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password, name) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authAPI.register({ email, password, name });
      const { token: newToken, user: userData } = response.data;

      localStorage.setItem("token", newToken);
      setToken(newToken);
      setUser(userData);

      return true;
    } catch (error) {
      const errorMsg = error.response?.data?.error || "Registeration failed";
      setError(errorMsg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authAPI.login({ email, password });
      const { token: newToken, user: userData } = response.data;

      localStorage.setItem("token", newToken);
      setToken(newToken);
      setUser(userData);

      return true;
    } catch (error) {
      const errorMsg = error.response?.data?.error || "Login failed";
      setError(errorMsg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        register,
        login,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
