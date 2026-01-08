const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getCurrentUser,
} = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

//PUBLIC ROUTES
router.post("/register", register);
router.post("/login", login);

//PROTECTED ROUTES (require valid JWT)
router.get("/me", authMiddleware, getCurrentUser);

module.exports = router;
