import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function AlumniProfile() {
  const { id } = useParams();
  const [alum, setAlum] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        // Fetch user profile
        const userRes = await axios.get(`http://localhost:5000/api/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAlum(userRes.data.user);

        // Fetch posts by this alumni
        const postRes = await axios.get(`http://localhost:5000/api/posts?author=${id}`);
        setPosts(postRes.data);
      } catch (err) {
        console.error("Failed to fetch alumni profile", err);
      }
    };
    fetchData();
  }, [id]);

  if (!alum) return <p>Loading...</p>;

  return (
    <div className="card shadow p-4">
      <div className="d-flex align-items-center mb-3">
        <img
          src={alum.profilePhoto}
          alt={alum.fullName}
          className="rounded-circle me-3"
          style={{ width: "80px", height: "80px" }}
        />
        <div>
          <h4>{alum.fullName}</h4>
          <p className="text-muted">{alum.jobTitle || alum.role}</p>
        </div>
      </div>

      <h5 className="mt-4">Posts</h5>
      {posts.length === 0 ? (
        <p>No posts yet.</p>
      ) : (
        posts.map((p) => (
          <div key={p._id} className="card mb-3">
            <div className="card-body">
              <p>{p.text}</p>
              {p.image && <img src={p.image} alt="post" className="img-fluid rounded" />}
              <small className="text-muted">
                {new Date(p.createdAt).toLocaleString()}
              </small>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
