import express from "express";
import { User } from "../models/User.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// ✅ Get logged-in user's profile
router.get("/", authMiddleware, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ user: req.user }); // middleware already removed password
  } catch (err) {
    console.error("Profile fetch error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Update logged-in user's profile
router.put("/", authMiddleware, async (req, res) => {
  try {
    const allowedFields = [
      "fullName",
      "dob",
      "gender",
      "education",
      "company",
      "phone",
      "address",
      "linkedin",
      "department",
      "yearOfStudy",
      "graduationYear",
      "jobTitle",
    ];

    const updates = {};
    for (let field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user._id, // ✅ use req.user from middleware
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Profile updated successfully", user });
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
