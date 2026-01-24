import React from "react";
import LoginForm from "../components/Auth/LoginForm";
import { IMAGES } from "../constants/images";

const Login = () => {
  return (
    <div
      className="h-full bg-cover bg-center grid grid-cols-1 md:grid-cols-2"
      style={{ backgroundImage: `url(${IMAGES.BACKGROUND})` }}
    >
      {/* Left side (logo already in image) */}
      <div className="hidden md:block" />

      {/* Right side (form) */}
      <div className="flex items-center justify-center px-6">
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
