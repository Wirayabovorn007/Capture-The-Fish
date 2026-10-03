import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Home from "./pages/home"
import Styles from "./components/effects/Grig_bg"
import Competition from "./pages/competition"
import Challenge_detail from "./pages/challenge_detail"
import Login from "./pages/login"
import Profile from "./pages/profile"
import ManageProfile from "./pages/manage_profile"
import Contact from "./pages/contact"
import Leaderboard from "./pages/leaderboard"
import Story from "./pages/story"

import AdminDashboard from "./pages/admin/dashboard"
import Management from "./pages/admin/management"
import ChallengeManagement from "./pages/admin/ChallengeManagement"
import UserManagement from "./pages/admin/UserManagement"

import AdminRoute from "./components/auth/AdminRoute"
import UserRoute from "./components/auth/UserRoute"
import UserHeartbeat from "./components/auth/UserHeartbeat"

export default function App() {
  return (
    <Router>
      <Styles />
      <UserHeartbeat />

      <div className="relative min-h-screen">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />

          {/* Logged-in user routes */}
          <Route path="/competition" element={<UserRoute><Competition /></UserRoute>} />
          <Route path="/challenge" element={<UserRoute><Challenge_detail /></UserRoute>} />
          <Route path="/profile" element={<UserRoute><Profile /></UserRoute>} />
          <Route path="/profile-setting" element={<UserRoute><ManageProfile /></UserRoute>} />
          <Route path="/contact" element={<UserRoute><Contact /></UserRoute>} />
          <Route path="/leaderboard" element={<UserRoute><Leaderboard /></UserRoute>} />
          <Route path="/story" element={<UserRoute><Story /></UserRoute>} />

          {/* Admin routes */}
          <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/challenge" element={<AdminRoute><Challenge_detail /></AdminRoute>} />
          <Route path="/admin/management" element={<AdminRoute><Management /></AdminRoute>} />
          <Route path="/admin/challenges" element={<AdminRoute><ChallengeManagement /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><UserManagement /></AdminRoute>} />

          {/* Unknown routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  )
}
