const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    staffId: {
      type: Number,
      required: true,
      unique: true,
    },
    designation: {
      type: String,
      required: true,
      trim: true,
    },
    department: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    block: {
      type: String,
      required: true,
      trim: true,
    },
    roomNumber: {
      type: String,
      required: true,
      trim: true,
    },
    make: {
      type: String,
      required: true,
      trim: true,
    },
    model: {
      type: String,
      required: true,
      trim: true,
    },
    serialNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    capacityVA: {
      type: String,
      required: true,
      trim: true,
    },
    issueDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["functional", "non-functional"],
      default: "functional",
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for better search performance
productSchema.index({
  firstName: "text",
  lastName: "text",
  department: "text",
  make: "text",
  model: "text",
});
productSchema.index({ staffId: 1 });
productSchema.index({ serialNumber: 1 });

module.exports = mongoose.model("Product", productSchema);
