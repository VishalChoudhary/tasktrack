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
    <div className="">
      <div className="">
        <h2 className="">Welcome Back</h2>
        <p className="">Sign in to your account</p>

        <form onSubmit={handleSubmit} className="">
          {/* Email Input */}
          <div>
            <label className="">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className=""
              disabled={loading}
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className=""
              disabled={loading}
            />
          </div>

          {/* Error Message */}
          {displayError && <div className="">{displayError}</div>}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded-lg font-medium text-white transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800"
            }`}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Link to Register */}
        <p className="">
          Don't have an account?{""}
          <Link to="/register" className="">
            Create One
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
