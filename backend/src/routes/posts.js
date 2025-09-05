import express from "express";
import Post from "../models/post.js";
import upload from "../middleware/multer.js";  // multer memory storage
import cloudinary from "../middleware/cloudinary.js";
import  authMiddleware  from "../middleware/auth.js"; // your JWT middleware

const router = express.Router();

// Create post (Alumni only)
router.post("/", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    if (req.user.role !== "Alumni") {
      return res.status(403).json({ error: "Only alumni can post" });
    }

    let imageUrl = null;
    if (req.file) {
      const fileBuffer = req.file.buffer.toString("base64");
      const result = await cloudinary.uploader.upload(
        `data:${req.file.mimetype};base64,${fileBuffer}`,
        { folder: "alumni_posts" }
      );
      imageUrl = result.secure_url;
    }

    const post = new Post({
      author: req.user._id,
      text: req.body.text,
      image: imageUrl,
    });

    await post.save();
    res.json(post);
  } catch (err) {
    console.error("Post creation failed:", err);
    res.status(500).json({ error: "Failed to create post" });
  }
});

// Get all posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "fullName role") // show name & role
      .sort({ createdAt: -1 }); // newest first
    res.json(posts);
  } catch (err) {
    console.error("Fetch posts failed:", err);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});
// Get all posts or by author
router.get("/", async (req, res) => {
  try {
    const query = {};
    if (req.query.author) {
      query.author = req.query.author;
    }

    const posts = await Post.find(query)
      .populate("author", "fullName role")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    console.error("Fetch posts failed:", err);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});
// ✅ Get posts by a specific alumni
router.get("/user/:userId", authMiddleware, async (req, res) => {
  try {
    const posts = await Post.find({ author: req.params.userId })
      .populate("author", "fullName profilePhoto")
      .sort({ createdAt: -1 });

    res.json({ posts });
  } catch (err) {
    console.error("Error fetching user posts:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
