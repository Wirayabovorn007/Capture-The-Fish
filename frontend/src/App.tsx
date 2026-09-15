import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Styles from "./components/effects/Grig_bg";
import Competition from "./pages/competition";
import Challenge_detail from "./pages/challenge_detail";

export default function App() {
  return (
    <Router>
      <Styles />
      
      <div className="relative min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/competition" element={<Competition />} />
          <Route path="/challenge" element={<Challenge_detail />} />
        </Routes>
      </div>
    </Router>
  );
}