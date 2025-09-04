import { useState, useEffect } from "react";
import axios from "axios";

export default function ConnectButton({ targetUser }) {
  const [status, setStatus] = useState("not_connected");
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:5000/api/connections/status/${targetUser._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setStatus(res.data.status); 
      } catch (err) {
        console.error("Failed to fetch connection status", err);
      }
    };
    fetchStatus();
  }, [targetUser._id]);

  const handleConnect = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:5000/api/connections/request`,
        { targetUserId: targetUser._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStatus("pending");
    } catch (err) {
      console.error("Failed to send connection request", err);
    }
  };

  return (
    <>
      {status === "not_connected" && (
        <button className="btn btn-sm btn-primary" onClick={handleConnect}>
          Connect
        </button>
      )}
      {status === "pending" && <button className="btn btn-sm btn-secondary" disabled>Pending</button>}
      {status === "connected" && <button className="btn btn-sm btn-success" disabled>Connected</button>}
    </>
  );
}
