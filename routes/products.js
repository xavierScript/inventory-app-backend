const express = require("express");
const { body, validationResult } = require("express-validator");
const Product = require("../models/Product");
const { authenticateToken, requireAdmin } = require("../middleware/auth");

const router = express.Router();

// Get all products (accessible by all authenticated users)
router.get("/", authenticateToken, async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({ products });
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({ message: "Database error" });
  }
});

// Get single product by ID (accessible by all authenticated users)
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ product });
  } catch (error) {
    console.error("Get product error:", error);
    res.status(500).json({ message: "Database error" });
  }
});

// Create new product (admin only)
router.post(
  "/",
  [
    authenticateToken,
    requireAdmin,
    body("firstName").notEmpty().withMessage("First name is required"),
    body("lastName").notEmpty().withMessage("Last name is required"),
    body("staffId")
      .isInt({ min: 1 })
      .withMessage("Staff ID must be a positive integer"),
    body("designation").notEmpty().withMessage("Designation is required"),
    body("department").notEmpty().withMessage("Department is required"),
    body("location").notEmpty().withMessage("Location is required"),
    body("block").notEmpty().withMessage("Block is required"),
    body("roomNumber").notEmpty().withMessage("Room number is required"),
    body("make").notEmpty().withMessage("Make is required"),
    body("model").notEmpty().withMessage("Model is required"),
    body("serialNumber").notEmpty().withMessage("Serial number is required"),
    body("capacityVA").notEmpty().withMessage("Capacity VA is required"),
    body("issueDate").isISO8601().withMessage("Valid issue date is required"),
    body("status")
      .optional()
      .isIn(["functional", "non-functional"])
      .withMessage("Status must be functional or non-functional"),
  ],
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        firstName,
        lastName,
        staffId,
        designation,
        department,
        location,
        block,
        roomNumber,
        make,
        model,
        serialNumber,
        capacityVA,
        issueDate,
        status = "functional",
      } = req.body;

      // Create new product
      const product = new Product({
        firstName,
        lastName,
        staffId: parseInt(staffId),
        designation,
        department,
        location,
        block,
        roomNumber,
        make,
        model,
        serialNumber,
        capacityVA,
        issueDate: new Date(issueDate),
        status,
      });

      await product.save();

      res.status(201).json({
        message: "Product created successfully",
        product,
      });
    } catch (error) {
      console.error("Create product error:", error);
      if (error.code === 11000) {
        if (error.keyPattern.staffId) {
          return res.status(400).json({ message: "Staff ID already exists" });
        }
        if (error.keyPattern.serialNumber) {
          return res
            .status(400)
            .json({ message: "Serial number already exists" });
        }
      }
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Update product (admin only)
router.put(
  "/:id",
  [
    authenticateToken,
    requireAdmin,
    body("firstName")
      .optional()
      .notEmpty()
      .withMessage("First name cannot be empty"),
    body("lastName")
      .optional()
      .notEmpty()
      .withMessage("Last name cannot be empty"),
    body("staffId")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Staff ID must be a positive integer"),
    body("designation")
      .optional()
      .notEmpty()
      .withMessage("Designation cannot be empty"),
    body("department")
      .optional()
      .notEmpty()
      .withMessage("Department cannot be empty"),
    body("location")
      .optional()
      .notEmpty()
      .withMessage("Location cannot be empty"),
    body("block").optional().notEmpty().withMessage("Block cannot be empty"),
    body("roomNumber")
      .optional()
      .notEmpty()
      .withMessage("Room number cannot be empty"),
    body("make").optional().notEmpty().withMessage("Make cannot be empty"),
    body("model").optional().notEmpty().withMessage("Model cannot be empty"),
    body("serialNumber")
      .optional()
      .notEmpty()
      .withMessage("Serial number cannot be empty"),
    body("capacityVA")
      .optional()
      .notEmpty()
      .withMessage("Capacity VA cannot be empty"),
    body("issueDate")
      .optional()
      .isISO8601()
      .withMessage("Valid issue date is required"),
    body("status")
      .optional()
      .isIn(["functional", "non-functional"])
      .withMessage("Status must be functional or non-functional"),
  ],
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const updateData = { ...req.body };

      // Convert staffId to number if provided
      if (updateData.staffId) {
        updateData.staffId = parseInt(updateData.staffId);
      }

      // Convert issueDate to Date if provided
      if (updateData.issueDate) {
        updateData.issueDate = new Date(updateData.issueDate);
      }

      // Find and update product
      const product = await Product.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      });

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.json({
        message: "Product updated successfully",
        product,
      });
    } catch (error) {
      console.error("Update product error:", error);
      if (error.code === 11000) {
        if (error.keyPattern.staffId) {
          return res.status(400).json({ message: "Staff ID already exists" });
        }
        if (error.keyPattern.serialNumber) {
          return res
            .status(400)
            .json({ message: "Serial number already exists" });
        }
      }
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Delete product (admin only)
router.delete("/:id", [authenticateToken, requireAdmin], async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Search products (accessible by all authenticated users)
router.get("/search/:query", authenticateToken, async (req, res) => {
  try {
    const { query } = req.params;

    const products = await Product.find({
      $or: [
        { firstName: { $regex: query, $options: "i" } },
        { lastName: { $regex: query, $options: "i" } },
        { department: { $regex: query, $options: "i" } },
        { make: { $regex: query, $options: "i" } },
        { model: { $regex: query, $options: "i" } },
        { serialNumber: { $regex: query, $options: "i" } },
      ],
    }).sort({ createdAt: -1 });

    res.json({ products });
  } catch (error) {
    console.error("Search products error:", error);
    res.status(500).json({ message: "Database error" });
  }
});

module.exports = router;
