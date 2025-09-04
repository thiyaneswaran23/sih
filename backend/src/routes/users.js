import express from "express";
import { User } from "../models/User.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();


router.get("/", authMiddleware, async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.userId } }).select(
      "fullName role _id"
    );
    res.json({ users });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Server error" });
  }
});


 
router.get("/search", authMiddleware, async (req, res) => {
  try {
    const query = req.query.query || "";

    const users = await User.find({
      fullName: { $regex: query, $options: "i" },
      _id: { $ne: req.userId }, 
    }).select("fullName role _id");

    res.json({ users });
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ message: "Failed to search users" });
  }
});


router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      "-password"
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch (err) {
    console.error("Failed to fetch user:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
