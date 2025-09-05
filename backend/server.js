import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./src/routes/auth.js";
import profileRoutes from "./src/routes/profile.js";
import messageRoutes from "./src/routes/messages.js";
import { Message } from "./src/models/Message.js";
import authMiddleware from "./src/middleware/auth.js";

dotenv.config();

const app = express();
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
import postsRouter from "./src/routes/posts.js";
app.use("/api/posts", postsRouter);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MONGODB CONNECTED"))
  .catch(err => console.error("MongoDB Connection ERROR:", err));
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);
  socket.on("join", (userId) => {
    console.log(`User ${userId} joined their room`);
    socket.join(userId);
  });
  socket.on("send_message", async (data) => {
    try {
      const { senderId, receiverId, message } = data;

      const newMsg = await Message.create({ senderId, receiverId, message });
      io.to(receiverId).emit("receive_message", newMsg);
      io.to(senderId).emit("receive_message", newMsg);

    } catch (err) {
      console.error("Failed to save message:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});
import connectionRoutes from "./src/routes/connection.js";
app.get("/", (req, res) => res.send("API is Working"));
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/connections", connectionRoutes);
import("./src/routes/users.js").then(module => {
  app.use("/api/users", module.default);
});
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
