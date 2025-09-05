import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import PostForm from "./PostForm";
import PostFeed from "./PostFeed";

export default function DashboardHome() {
  const { user } = useOutletContext();
  const [refreshPosts, setRefreshPosts] = useState(false);

  return (
    <>
      <h5 className="mb-4 text-muted">
        Welcome, <strong>{user.fullName}</strong> | Role:{" "}
        <strong>{user.role}</strong>
      </h5>

      {/* Show PostForm only for Alumni */}
      {user.role === "Alumni" && (
        <PostForm onPostCreated={() => setRefreshPosts(!refreshPosts)} />
      )}

      {/* Feed visible to all */}
      <PostFeed key={refreshPosts} />
    </>
  );
}
