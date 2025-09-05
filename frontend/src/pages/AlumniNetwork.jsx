import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import axios from "axios";
import ConnectButton from "../components/ConnectButton"; 

export default function AlumniNetwork() {
  const { user } = useOutletContext();   // ✅ get logged-in user
  const [alumni, setAlumni] = useState([]);

  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/users/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // filter only alumni, exclude current user
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
  }, [user._id]); // ✅ re-run if logged-in user changes

  return (
    <div className="card shadow p-4">
      <h2 className="mb-3">Alumni Network</h2>
      <p>Connect with alumni and view shared resources.</p>

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
              <p className="text-muted small">{alum.jobTitle || alum.role}</p>
              <ConnectButton targetUser={alum} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
