import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import StudentCourses from "./pages/StudentCourses";
import AlumniNetwork from "./pages/AlumniNetwork";
import Messages from "./pages/Messages";
import UserProfile from "./components/UserProfile";
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
         <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}>
    <Route path="profile" element={<Profile />} />
    <Route path="courses" element={<StudentCourses />} />
    <Route path="alumni" element={<AlumniNetwork />} />
    <Route path="messages" element={<Messages />} />
    <Route path="profile/:userId" element={<UserProfile />} />
  </Route>
      </Routes>
    </Router>
  );
}
