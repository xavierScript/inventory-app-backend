const mongoose = require("mongoose");
const User = require("./models/User");

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

// Initialize database with default admin user
const initDatabase = async () => {
  try {
    // Check if admin user exists
    const adminExists = await User.findOne({ username: "admin" });

    if (!adminExists) {
      // Create default admin user
      const adminUser = new User({
        username: "admin",
        email: "admin@inventory.com",
        password: "admin123", // Will be hashed by the pre-save hook
        role: "admin",
      });

      await adminUser.save();
      console.log(
        "Default admin user created (username: admin, password: admin123)"
      );
    } else {
      console.log("Admin user already exists");
    }

    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Database initialization error:", error);
    throw error;
  }
};

module.exports = {
  connectDB,
  initDatabase,
};
