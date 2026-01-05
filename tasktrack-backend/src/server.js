// src/server.js - TEMPORARY TEST FILE
// This is just to verify setup works

require("dotenv").config();

console.log("Environment variables loaded");
console.log(
  "MongoDB URI:",
  process.env.MONGODB_URI ? "Connected" : "Not found"
);
console.log("Port:", process.env.PORT);

// For now, just print success
console.log("Setup complete! Backend ready to build.");
