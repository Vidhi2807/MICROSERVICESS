
const dns = require("dns");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

require("dotenv").config();

const express = require("express");

const connectDB = require("./db");

const {
  connectRabbitMQ
} = require("./rabbitmq");

const userRoutes = require("./userRoutes");

const app = express();

// Middleware
app.use(express.json());

// User Routes
app.use("/api/users", userRoutes);

// Health Check
app.get("/health", (req, res) => {
  res.json({
    service: "user-service",
    status: "running"
  });
});

// Port
const PORT = process.env.PORT || 5001;

// Start Server
const startServer = async () => {
  try {

    // Connect MongoDB
    await connectDB();

    console.log("MongoDB Connected Successfully!");

    // Connect RabbitMQ
    await connectRabbitMQ();

    console.log("RabbitMQ Connected Successfully!");

    // Start Express Server
    app.listen(PORT, () => {
      console.log(`User Service running on port ${PORT}`);
    });

  } catch (error) {

    console.error(
      "User Service Startup Failed:",
      error.message
    );

    process.exit(1);
  }
};

startServer();
