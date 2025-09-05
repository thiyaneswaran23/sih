import express from "express";
import authMiddleware from "../middleware/auth.js";
import { Connection } from "../models/Connection.js";

const router = express.Router();

router.post("/request", authMiddleware, async (req, res) => {
  try {
    const { targetUserId } = req.body;
    const exists = await Connection.findOne({
      $or: [
        { requester: req.userId, recipient: targetUserId },
        { requester: targetUserId, recipient: req.userId }
      ]
    });

    if (exists) return res.status(400).json({ message: "Connection already exists" });

    const newConn = await Connection.create({ requester: req.userId, recipient: targetUserId });
    res.json({ connection: newConn });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create connection" });
  }
});

router.get("/status/:targetUserId", authMiddleware, async (req, res) => {
  try {
    const conn = await Connection.findOne({
      $or: [
        { requester: req.userId, recipient: req.params.targetUserId },
        { requester: req.params.targetUserId, recipient: req.userId }
      ]
    });

    if (!conn) return res.json({ status: "not_connected" });
    res.json({ status: conn.status });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get connection status" });
  }
});
router.get("/requests", authMiddleware, async (req, res) => {
  try {
    const requests = await Connection.find({
      recipient: req.userId,
      status: "pending"
    }).populate("requester", "fullName role _id"); 

    res.json({ requests });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch connection requests" });
  }
});

router.post("/accept", authMiddleware, async (req, res) => {
  try {
    const { requestId } = req.body;
    const conn = await Connection.findById(requestId);
    if (!conn) return res.status(404).json({ message: "Request not found" });

    if (conn.recipient.toString() !== req.userId)
      return res.status(403).json({ message: "Not authorized" });

    conn.status = "connected";
    await conn.save();

    res.json({ message: "Connection accepted", connection: conn });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to accept connection" });
  }
});

// Get all connected users for the logged-in user
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const connections = await Connection.find({
      $or: [
        { requester: req.userId, status: "connected" },
        { recipient: req.userId, status: "connected" },
      ],
    })
      .populate("requester", "fullName role profilePhoto")
      .populate("recipient", "fullName role profilePhoto");

    // return only the *other user* in each connection
    const users = connections.map((c) =>
      c.requester._id.toString() === req.userId.toString()
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
