require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database");

// routes import
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

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

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/dashboard", dashboardRoutes);

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
