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
    <div className="">
      <div className="">
        <h2 className="">Create Account</h2>
        <p className="">Join us today</p>

        <form onSubmit={handleSubmit} className="">
          {/* Name Input */}
          <div>
            <label className="">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className=""
              disabled={loading}
            />
          </div>

          {/* Email Input */}
          <div>
            <label className="">Email</label>
            <input
              type="text"
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

          {/* Confirm Password Input */}
          <div>
            <label className="">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        {/* Link to Login */}
        <p className="">
          Already have an account?{""}
          <Link to="/login" className="">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
