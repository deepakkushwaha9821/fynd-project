import { Routes, Route } from "react-router-dom";
import Feedback from "./components/Feedback";
import AdminDashboard from "./components/AdminDashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Feedback />} />
      <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  );
}

export default App;
