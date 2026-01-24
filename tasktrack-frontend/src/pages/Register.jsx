import React from "react";
import RegisterForm from "../components/Auth/RegisterForm";
import { IMAGES } from "../constants/images";

const Register = () => {
  return (
    <div
      className="h-full bg-cover bg-center grid grid-cols-1 md:grid-cols-2"
      style={{ backgroundImage: `url(${IMAGES.BACKGROUND})` }}
    >
      {/* Left side (logo in background image) */}
      <div className="hidden md:block" />

      {/* Right side (register form) */}
      <div className="flex items-center justify-center px-6">
        <RegisterForm />
      </div>
    </div>
  );
};

export default Register;
