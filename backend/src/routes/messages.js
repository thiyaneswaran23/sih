import express from "express";
import { Message } from "../models/Message.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

router.get("/:userId", authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId: req.userId, receiverId: userId },
        { senderId: userId, receiverId: req.userId },
      ],
    })
      .sort({ createdAt: 1 })
      .populate("senderId", "fullName")   
      .populate("receiverId", "fullName"); 
    res.json({ messages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
});

export default router;
