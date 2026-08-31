import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import InterviewRoom from "./pages/InterviewRoom.jsx";
import Report from "./pages/Report.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/interview/:sessionId" element={<InterviewRoom />} />
      <Route path="/report/:sessionId" element={<Report />} />
    </Routes>
  );
}
