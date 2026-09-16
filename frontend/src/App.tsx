import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Styles from "./components/effects/Grig_bg";
import Competition from "./pages/competition";
import Challenge_detail from "./pages/challenge_detail";
import Login from "./pages/login";
import Profile from "./pages/profile";
import ManageProfile from "./pages/manage_profile";
import Contact from "./pages/contact";

export default function App() {
  return (
    <Router>
      <Styles />
      
      <div className="relative min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/competition" element={<Competition />} />
          <Route path="/challenge" element={<Challenge_detail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile-setting" element={<ManageProfile />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
    </Router>
  );
}