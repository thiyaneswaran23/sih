import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import AlumniProfile from "./pages/AlumniProfile";  
import AlumniNetwork from "./pages/AlumniNetwork";
import Messages from "./pages/Messages";
import UserProfile from "./components/UserProfile";
import DashboardLayout from "./pages/DashBoardLayout"
import Jobs from "./pages/Jobs";
export default function App() {
  return (
    <Router>
  <Routes>
    {/* Public Routes */}
    <Route path="/" element={<LandingPage />} />
    <Route path="/signin" element={<SignIn />} />
    <Route path="/signup" element={<SignUp />} />

    {/* Protected Dashboard Routes */}
    <Route
      path="/dashboard"
      element={
        <ProtectedRoute>
          <DashboardLayout /> {/* 👈 Layout with navbar + sidebar */}
        </ProtectedRoute>
      }
    >
      {/* Index route = DashboardHome */}
      <Route index element={<Dashboard />} />

      {/* Other pages inside dashboard */}
      <Route path="profile" element={<Profile />} />
      <Route path="alumni" element={<AlumniNetwork />} />
      <Route path="alumni/:id" element={<AlumniProfile />} />
      <Route path="messages" element={<Messages />} />
      <Route path="profile/:userId" element={<UserProfile />} />
      <Route path="jobs" element={<Jobs />} />
    </Route>
  </Routes>
</Router>

  );
}
