const jwt = require("jsonwebtoken");

// Auth Middleware Function
const authMiddleware = (req, res, next) => {
  try {
    //Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        error: "Authorization header missing",
      });
    }

    //Extract token from "Bearer <token>" format
    const token = authHeader.startsWith("Bearer")
      ? authHeader.slice(7)
      : authHeader;

    if (!token) {
      return res.status(401).json({
        error: "Token not found",
      });
    }

    //Verify Token Signature
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach User to Request
    req.user = decoded; //Controllers can access: req.user.userId, req.user.email

    next();
  } catch (error) {
    console.log("Auth Error: ", error.message);

    if (error.name === "TokenExpiredError") {
      // ↑ jwt.verify throws TokenExpiredError if token expired
      return res.status(401).json({
        error: "Token has expired. Please login again.",
      });
    }

    //if signature invalid
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        error: "Invalid Token",
      });
    }

    // For any other error
    return res.status(401).json({
      error: "Authentication failed",
    });
  }
};

module.exports = authMiddleware;
