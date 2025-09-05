import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import axios from "axios";
import ConnectButton from "../components/ConnectButton";

export default function AlumniNetwork() {
  const { user } = useOutletContext(); // ✅ logged-in user
  const [alumni, setAlumni] = useState([]);
  const [selectedAlumni, setSelectedAlumni] = useState(null); // ✅ track selected profile
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);

  // Fetch all alumni (exclude current user)
  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/users/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setAlumni(
          res.data.users.filter(
            (u) => u.role === "Alumni" && u._id !== user._id
          )
        );
      } catch (err) {
        console.error("Failed to fetch alumni", err);
      }
    };
    fetchAlumni();
  }, [user._id]);

  // Fetch posts for selected alumni
  const fetchAlumniPosts = async (alumniId) => {
    try {
      setLoadingPosts(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:5000/api/posts/user/${alumniId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts(res.data.posts);
    } catch (err) {
      console.error("Failed to fetch posts", err);
    } finally {
      setLoadingPosts(false);
    }
  };

  const handleViewProfile = (alum) => {
    setSelectedAlumni(alum);
    fetchAlumniPosts(alum._id);
  };

  const handleBack = () => {
    setSelectedAlumni(null);
    setPosts([]);
  };

  return (
    <div className="card shadow p-4">
      {!selectedAlumni ? (
        <>
          <h2 className="mb-3">Alumni Network</h2>
          <p>Connect with alumni and view their contributions.</p>

          <div className="row">
            {alumni.map((alum) => (
              <div key={alum._id} className="col-md-4 mb-3">
                <div className="card shadow-sm p-3 text-center">
                  <img
                    src={alum.profilePhoto}
                    alt={alum.fullName}
                    className="rounded-circle mb-2"
                    style={{ width: "60px", height: "60px" }}
                  />
                  <h6>{alum.fullName}</h6>
                  <p className="text-muted small">
                    {alum.jobTitle || alum.role}
                  </p>
                  <ConnectButton targetUser={alum} />
                  <button
                    className="btn btn-sm btn-primary mt-2"
                    onClick={() => handleViewProfile(alum)}
                  >
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <button className="btn btn-secondary mb-3" onClick={handleBack}>
            ← Back to Alumni List
          </button>

          <div className="card shadow-sm p-3 mb-3 text-center">
            <img
              src={selectedAlumni.profilePhoto}
              alt={selectedAlumni.fullName}
              className="rounded-circle mb-2"
              style={{ width: "80px", height: "80px" }}
            />
            <h5>{selectedAlumni.fullName}</h5>
            <p className="text-muted">{selectedAlumni.jobTitle || selectedAlumni.role}</p>
            <ConnectButton targetUser={selectedAlumni} />
          </div>

          <h4 className="mb-3">Posts by {selectedAlumni.fullName}</h4>

          {loadingPosts ? (
            <p>Loading posts...</p>
          ) : posts.length > 0 ? (
            posts.map((post) => (
              <div key={post._id} className="card shadow-sm p-3 mb-3">
                <p>{post.text}</p>
                {post.image && (
                  <img
                    src={post.image}
                    alt="post"
                    className="img-fluid rounded mt-2"
                  />
                )}
                <small className="text-muted">
                  {new Date(post.createdAt).toLocaleString()}
                </small>
              </div>
            ))
          ) : (
            <p>No posts yet.</p>
          )}
        </>
      )}
    </div>
  );
}
