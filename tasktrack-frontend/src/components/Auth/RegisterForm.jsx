import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const RegisterForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState("");

  const { register, loading, error } = useAuth();
  const navigate = useNavigate();

  //Frontend Validation
  const validateForm = () => {
    if (!name.trim()) {
      setFormError("Name is required");
      return false;
    }
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
    if (password.length < 6) {
      setFormError("Password must be atleast 6 characters");
      return false;
    }
    if (password !== confirmPassword) {
      setFormError("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    //Validate
    if (!validateForm()) return;

    // Call authContext Register
    const success = await register(email, password, name);

    if (success) {
      navigate("/dashboard");
    } else {
      // Error already in context, will display below
    }
  };

  // Show either form error or context error
  const displayError = formError || error;

  return (
    <div className="w-full max-w-md rounded-2xl p-8 bg-slate-800/90 backdrop-blur-xl border border-white/10 shadow-2xl">
      <h2 className="text-2xl font-bold text-white mb-2 text-center">
        Create Account
      </h2>
      <p className="text-slate-300 text-center mb-6">Join us today</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-slate-300 font-medium mb-2">
            Full Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="w-full px-4 py-2 rounded-lg bg-slate-800/70 border border-white/10 text-white placeholder-slate-400  focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
        </div>

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

        {/* Confirm Password */}
        <div>
          <label className="block text-slate-300 font-medium mb-2">
            Confirm Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
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
          className={`w-full py-2 rounded-lg text-white font-medium ${
            loading ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>
      </form>

      <p className="text-center text-slate-300 mt-6">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-400 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default RegisterForm;
