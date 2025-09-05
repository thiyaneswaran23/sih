import { useState } from "react";
import axios from "axios";

export default function PostForm({ onPostCreated }) {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("text", text);
      if (file) formData.append("image", file);

      const res = await axios.post("http://localhost:5000/api/posts", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      onPostCreated(res.data);
      setText("");
      setFile(null);
    } catch (err) {
      console.error("Failed to create post", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 p-3 border rounded bg-light">
      <textarea
        className="form-control mb-2"
        placeholder="Write something..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        required
      />
      <input
        type="file"
        className="form-control mb-2"
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button type="submit" className="btn btn-primary">Post</button>
    </form>
  );
}
