import { useEffect, useState } from "react";
import axios from "axios";

export default function PostFeed() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/posts");
        setPosts(res.data);
      } catch (err) {
        console.error("Failed to fetch posts", err);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div>
      {posts.map((p) => (
        <div key={p._id} className="card mb-3">
          <div className="card-body">
            <h6 className="card-subtitle mb-2 text-muted">
              {p.author.fullName} ({p.author.role})
            </h6>
            <p>{p.text}</p>
            {p.image && <img src={p.image} alt="post" className="img-fluid rounded" />}
            <small className="text-muted">
              {new Date(p.createdAt).toLocaleString()}
            </small>
          </div>
        </div>
      ))}
    </div>
  );
}
