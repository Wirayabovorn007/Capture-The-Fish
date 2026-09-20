import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
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
import UserHeartbeat from "./components/auth/UserHeartbeat"

export default function App() {
  return (
    <Router>
      <Styles />
      <UserHeartbeat />

      <div className="relative min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/competition" element={<Competition />} />
          <Route path="/challenge" element={<Challenge_detail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile-setting" element={<ManageProfile />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/story" element={<Story />} />

          <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/management" element={<AdminRoute><Management /></AdminRoute>} />
          <Route path="/admin/challenges" element={<AdminRoute><ChallengeManagement /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><UserManagement /></AdminRoute>} />
        </Routes>
      </div>
    </Router>
  )
}
