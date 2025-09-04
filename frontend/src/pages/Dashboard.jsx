import { Outlet, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [connectionRequests, setConnectionRequests] = useState([]);
  const [showRequestsDropdown, setShowRequestsDropdown] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.user);
      } catch (err) {
        console.error("Failed to fetch profile", err);
        navigate("/signin");
      }
    };
    fetchProfile();
  }, [navigate]);
  useEffect(() => {
    if (!user) return;
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:5000/api/connections/requests",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setConnectionRequests(res.data.requests);
      } catch (err) {
        console.error("Failed to fetch connection requests", err);
      }
    };
    fetchRequests();
  }, [user]);
  const handleAccept = async (requestId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/connections/accept",
        { requestId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setConnectionRequests(prev => prev.filter(r => r._id !== requestId));
    } catch (err) {
      console.error("Failed to accept connection request", err);
    }
  };

 
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:5000/api/users/search?query=${searchQuery}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSearchResults(res.data.users.filter(u => u._id !== user._id));
      } catch (err) {
        console.error("Failed to search users", err);
      }
    };
    fetchUsers();
  }, [searchQuery, user?._id]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/signin");
  };

  if (!user) return <p className="text-center mt-5">Loading...</p>;

  return (
    <div className="d-flex flex-column vh-100">
     
      <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom">
        <div className="container-fluid">
          <div className="d-flex align-items-center">
            <Link className="navbar-brand me-3" to="/dashboard">
              Dashboard
            </Link>

            
            <div className="position-relative me-3">
              <button
                className="btn btn-outline-primary"
                onClick={() => setShowRequestsDropdown(!showRequestsDropdown)}
              >
                🔔
                {connectionRequests.length > 0 && (
                  <span className="badge bg-danger position-absolute top-0 start-100 translate-middle">
                    {connectionRequests.length}
                  </span>
                )}
              </button>

              {showRequestsDropdown && (
                <ul
                  className="list-group position-absolute"
                  style={{ top: "40px", zIndex: 10, width: "250px" }}
                >
                  {connectionRequests.length === 0 ? (
                    <li className="list-group-item">No requests</li>
                  ) : (
                    connectionRequests.map(r => (
                      <li
                        key={r._id}
                        className="list-group-item d-flex justify-content-between align-items-center"
                      >
                        <span>{r.requester.fullName} ({r.requester.role})</span>
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => handleAccept(r._id)}
                        >
                          Accept
                        </button>
                      </li>
                    ))
                  )}
                </ul>
              )}
            </div>

            <form className="d-flex position-relative" style={{ width: "400px" }}>
              <input
                type="search"
                className="form-control me-2"
                placeholder="Search students & alumni..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              {searchResults.length > 0 && (
                <ul
                  className="list-group position-absolute"
                  style={{ top: "40px", zIndex: 10, width: "100%" }}
                >
                  {searchResults.map(u => (
                    <li
                      key={u._id}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      <Link to={`profile/${u._id}`} className="text-decoration-none">
                        {u.fullName} ({u.role})
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </form>
          </div>

          <button className="btn btn-danger ms-auto" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      <div className="d-flex flex-grow-1">
     
        <div
          className="bg-dark text-white p-3 vh-100 d-flex flex-column justify-content-between"
          style={{ width: "250px" }}
        >
          <ul className="nav flex-column">
            {user.role === "Student" && (
              <li className="nav-item mb-2">
                <Link to="courses" className="nav-link text-white">
                  My Courses
                </Link>
              </li>
            )}
            {user.role === "Alumni" && (
              <li className="nav-item mb-2">
                <Link to="alumni" className="nav-link text-white">
                  Alumni Network
                </Link>
              </li>
            )}
            <li className="nav-item mb-2">
              <Link to="messages" className="nav-link text-white">
                Messages
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link to="profile" className="nav-link text-white">
                Profile
              </Link>
            </li>
          </ul>
        </div>

     
        <div className="flex-grow-1 p-4 overflow-auto">
          <h5 className="mb-4 text-muted">
            Welcome, <strong>{user.fullName}</strong> | Role: <strong>{user.role}</strong>
          </h5>
          <Outlet context={{ user }} />
        </div>
      </div>
    </div>
  );
}
