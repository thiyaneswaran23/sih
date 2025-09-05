import express from "express";
import authMiddleware from "../middleware/auth.js";
import { Connection } from "../models/Connection.js";

const router = express.Router();

// Send connection request
router.post("/request", authMiddleware, async (req, res) => {
  try {
    const { targetUserId } = req.body;

    const exists = await Connection.findOne({
      $or: [
        { requester: req.user._id, recipient: targetUserId },
        { requester: targetUserId, recipient: req.user._id }
      ]
    });

    if (exists) return res.status(400).json({ message: "Connection already exists" });

    const newConn = await Connection.create({
      requester: req.user._id,   // ✅ FIXED
      recipient: targetUserId
    });

    res.json({ connection: newConn });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create connection" });
  }
});

// Get status of a connection
router.get("/status/:targetUserId", authMiddleware, async (req, res) => {
  try {
    const conn = await Connection.findOne({
      $or: [
        { requester: req.user._id, recipient: req.params.targetUserId },
        { requester: req.params.targetUserId, recipient: req.user._id }
      ]
    });

    if (!conn) return res.json({ status: "not_connected" });
    res.json({ status: conn.status });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get connection status" });
  }
});

// Get pending requests
router.get("/requests", authMiddleware, async (req, res) => {
  try {
    const requests = await Connection.find({
      recipient: req.user._id,
      status: "pending"
    }).populate("requester", "fullName role _id");

    res.json({ requests });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch connection requests" });
  }
});

// Accept connection
router.post("/accept", authMiddleware, async (req, res) => {
  try {
    const { requestId } = req.body;
    const conn = await Connection.findById(requestId);
    if (!conn) return res.status(404).json({ message: "Request not found" });

    if (conn.recipient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    conn.status = "connected";
    await conn.save();

    res.json({ message: "Connection accepted", connection: conn });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to accept connection" });
  }
});

// Get all connected users
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const connections = await Connection.find({
      $or: [
        { requester: req.user._id, status: "connected" },
        { recipient: req.user._id, status: "connected" },
      ],
    })
      .populate("requester", "fullName role profilePhoto")
      .populate("recipient", "fullName role profilePhoto");

    const users = connections.map((c) =>
      c.requester._id.toString() === req.user._id.toString()
        ? c.recipient
        : c.requester
    );

    res.json({ users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch connections" });
  }
});

export default router;
