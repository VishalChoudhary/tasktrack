// Validate Email Format
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email) {
    return {
      isValid: false,
      error: "Email is required",
    };
  }

  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      error: "Email format is invalid",
    };
  }

  return {
    isValid: true,
    error: null,
  };
};

// Validate Password
const validatePassword = (password) => {
  if (!password) {
    return {
      isValid: false,
      error: "Password is required",
    };
  }

  if (password.length < 6) {
    return {
      isValid: false,
      error: "Password must be atleast 6 characters",
    };
  }

  return {
    isValid: true,
    error: null,
  };
};

// Validate Name
const validateName = (name) => {
  if (!name) {
    return {
      isValid: false,
      error: "Name is required",
    };
  }

  if (name.length < 2) {
    return {
      isValid: false,
      error: "Name must be atleast 2 characters",
    };
  }

  if (name.length > 50) {
    return {
      isValid: false,
      error: "Name cannot exceed 50 characters",
    };
  }

  return {
    isValid: true,
    error: null,
  };
};

module.exports = {
  validateEmail,
  validateName,
  validatePassword,
};
