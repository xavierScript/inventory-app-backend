const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { connectDB, initDatabase } = require("./database");

// Load environment variables
dotenv.config({ path: "./config.env" });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000", // Frontend URL
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    message: "Inventory App Backend is running",
    timestamp: new Date().toISOString(),
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Initialize database with default admin user
    await initDatabase();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/api/health`);
      console.log(`API Base URL: http://localhost:${PORT}/api`);
      console.log("\nDefault admin credentials:");
      console.log("Username: admin");
      console.log("Password: admin123");
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
