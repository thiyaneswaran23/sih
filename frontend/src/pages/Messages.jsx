import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { useOutletContext } from "react-router-dom";
import axios from "axios";

export default function Messages() {
  const { user } = useOutletContext();
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const chatEndRef = useRef(null);

  const socketRef = useRef(null);
  const scrollToBottom = () => chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/users/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllUsers(res.data.users.filter(u => u._id !== user._id));
    };
    fetchUsers();
  }, [user._id]);
  useEffect(() => {
    socketRef.current = io("http://localhost:5000");
    socketRef.current.emit("join", user._id);

    socketRef.current.on("receive_message", (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    return () => socketRef.current.disconnect();
  }, [user._id]);
  useEffect(() => {
    if (!selectedUser) return;
    const fetchMessages = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:5000/api/messages/${selectedUser._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(res.data.messages);
    };
    fetchMessages();
  }, [selectedUser]);
  const handleSendMessage = async () => {
    if (!selectedUser || !message.trim()) return;

    const msgData = {
      senderId: user._id,
      receiverId: selectedUser._id,
      message: message.trim(),
    };
    socketRef.current.emit("send_message", msgData);

    setMessage("");
  };

  return (
    <div className="d-flex border rounded shadow" style={{ height: "600px" }}>
     
      <div className="bg-light p-3 border-end" style={{ width: "250px", overflowY: "auto" }}>
        <h5>Contacts</h5>
        {allUsers.length === 0 && <p className="text-muted">No users found</p>}
        {allUsers.map(u => (
          <div
            key={u._id}
            onClick={() => { setSelectedUser(u); setMessages([]); }}
            className={`p-2 rounded mb-1 ${selectedUser?._id === u._id ? "bg-primary text-white" : "bg-white"}`}
            style={{ cursor: "pointer" }}
          >
            {u.fullName} ({u.role})
          </div>
        ))}
      </div>

      <div className="flex-grow-1 d-flex flex-column">
        <div className="border-bottom p-2 bg-light">
          <h6 className="mb-0">
            Chat with {selectedUser ? selectedUser.fullName : "Select a user"}
          </h6>
        </div>

        <div className="flex-grow-1 p-3 overflow-auto" style={{ background: "#f5f5f5" }}>
          {!selectedUser && <p className="text-muted">Select a contact to start chat</p>}
         {messages.map((m, idx) => {
  const isSender = m.senderId._id === user._id;
  const time = new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div key={idx} className={`mb-2 d-flex ${isSender ? "justify-content-end" : "justify-content-start"}`}>
      <div style={{ maxWidth: "70%" }}>
     
        {!isSender && (
          <div className="text-muted small mb-1">{m.senderId.fullName}</div>
        )}

        <span className={`p-2 rounded ${isSender ? "bg-primary text-white" : "bg-secondary text-white"}`}>
          {m.message}
        </span>

        <div className={`text-muted small mt-1 ${isSender ? "text-end" : ""}`}>{time}</div>
      </div>
    </div>
  );
})}

          <div ref={chatEndRef} />
        </div>

        {selectedUser && (
          <div className="d-flex p-2 border-top">
            <input
              type="text"
              className="form-control me-2"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <button className="btn btn-primary" onClick={handleSendMessage}>Send</button>
          </div>
        )}
      </div>
    </div>
  );
}
