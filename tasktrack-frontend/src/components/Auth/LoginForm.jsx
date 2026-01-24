import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");

  const { login, loading, error } = useAuth();
  const navigate = useNavigate();

  // Frontend Validation
  const validateForm = () => {
    if (!email.trim()) {
      setFormError("Email is Required");
      return false;
    }
    if (!email.includes("@")) {
      setFormError("Please enter a valid email");
      return false;
    }
    if (!password.trim()) {
      setFormError("Password is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    // Validate
    if (!validateForm()) return;

    // Call AuthContext Login
    const success = await login(email, password);
    if (success) {
      navigate("/dashboard");
    } else {
      // Error already defined in context;
    }
  };

  // Show either form error or context error
  const displayError = formError || error;

  return (
    <div className="w-full max-w-md rounded-2xl p-8 bg-slate-800/90 backdrop-blur-xl border border-white/10 shadow-2xl">
      <h2 className="text-2xl font-bold text-white mb-2 text-center">
        Welcome Back
      </h2>
      <p className="text-slate-300 text-center mb-6">Sign in to your account</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div>
          <label className="block text-slate-300 font-medium mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-4 py-2 rounded-lg bg-slate-800/70 border border-white/10 text-white placeholder-slate-400  focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-slate-300 font-medium mb-2">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full px-4 py-2 rounded-lg bg-slate-800/70 border border-white/10 text-white placeholder-slate-400  focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
        </div>

        {/* Error */}
        {displayError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {displayError}
          </div>
        )}

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-lg font-medium text-white transition ${
            loading
              ? "bg-slate-600 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
          }`}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <p className="text-center text-slate-300 mt-6">
        Don't have an account?{" "}
        <Link to="/register" className="text-blue-400 hover:underline">
          Create One
        </Link>
      </p>
    </div>
  );
};
export default LoginForm;
