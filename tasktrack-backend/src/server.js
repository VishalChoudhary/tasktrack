require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database");

const app = express();

connectDB(); //Connecting to MongoDB

//Middleware Setup

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Test Route (verify server is running)
app.get("/api/health", (req, res) => {
  res.json({
    message: "Server is running",
    timestamp: new Date(),
  });
});

//Attach authentication routes under the /api/auth base path
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

// Task routes
const taskRoutes = require("./routes/taskRoutes");
app.use("/api/tasks", taskRoutes);

//Error Handling Middleware
app.use((err, req, res, next) => {
  console.log("Error", err);
  res.status(err.status || 500).json({
    error: err.message || "Something went wrong",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server: http://localhost:${PORT}
      Environment: ${process.env.NODE_ENV}
    `);
});
