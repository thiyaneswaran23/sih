import { Outlet, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaBell } from "react-icons/fa";

export default function DashboardLayout() {
  const [user, setUser] = useState(null);
  const [requests, setRequests] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  // Fetch logged-in user profile
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

  // Fetch connection requests
  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "http://localhost:5000/api/connections/requests",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setRequests(res.data.requests);
    } catch (err) {
      console.error("Failed to fetch requests", err);
    }
  };

  useEffect(() => {
    if (user) fetchRequests();
  }, [user]);

  if (!user) return <p className="text-center mt-5">Loading...</p>;

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/signin");
  };

  // Accept request
  const handleAccept = async (requestId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/connections/accept",
        { requestId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRequests(requests.filter((r) => r._id !== requestId));
    } catch (err) {
      console.error("Failed to accept request", err);
    }
  };

  return (
    <div className="d-flex flex-column vh-100">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom">
        <div className="container-fluid">
          <Link className="navbar-brand me-3" to="/dashboard">
            Dashboard
          </Link>

          <div className="ms-auto d-flex align-items-center">
            {/* 🔔 Bell Icon */}
            <div className="position-relative me-3">
              <FaBell
                size={22}
                style={{ cursor: "pointer" }}
                onClick={() => setShowDropdown(!showDropdown)}
              />
              {requests.length > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {requests.length}
                </span>
              )}

              {/* Dropdown for requests */}
              {showDropdown && (
                <div
                  className="dropdown-menu dropdown-menu-end show mt-2 p-2 shadow"
                  style={{ minWidth: "250px", right: 0 }}
                >
                  <h6 className="dropdown-header">Connection Requests</h6>
                  {requests.length === 0 ? (
                    <p className="text-muted small px-2">No requests</p>
                  ) : (
                    requests.map((req) => (
                      <div
                        key={req._id}
                        className="d-flex align-items-center justify-content-between p-2 border-bottom"
                      >
                        <div>
                          <strong>{req.requester.fullName}</strong>
                          <p className="small text-muted mb-0">
                            {req.requester.role}
                          </p>
                        </div>
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => handleAccept(req._id)}
                        >
                          Accept
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            <button className="btn btn-danger" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Sidebar + Main */}
      <div className="d-flex flex-grow-1">
        {/* Sidebar */}
        <div
          className="bg-dark text-white p-3"
          style={{
            width: "250px",
            height: "calc(100vh - 56px)",
            position: "sticky",
            top: "56px",
            overflow: "hidden",
          }}
        >
          <ul className="nav flex-column">
            <li className="nav-item mb-2">
              <Link to="/dashboard/alumni" className="nav-link text-white">
                Alumni Network
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link to="/dashboard/jobs" className="nav-link text-white">
                Jobs
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link to="/dashboard/messages" className="nav-link text-white">
                Messages
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link to="/dashboard/profile" className="nav-link text-white">
                Profile
              </Link>
            </li>
          </ul>
        </div>

        {/* Main feed */}
        <div
          className="flex-grow-1 p-4"
          style={{
            height: "calc(100vh - 56px)",
            overflowY: "auto",
          }}
        >
          <Outlet context={{ user }} />
        </div>
      </div>
    </div>
  );
}
