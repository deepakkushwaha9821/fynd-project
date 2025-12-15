import { Routes, Route } from "react-router-dom";
import Feedback from "./components/Feedback";
import AdminDashboard from "./components/AdminDashboard";
// function AdminDashboard() {
//   return (
//     <div className="min-h-screen bg-slate-900 text-white p-10">
//       <h1 className="text-4xl font-bold">ADMIN PAGE WORKING</h1>
//       <p>If you see this, routing is correct.</p>
//     </div>
//   );
// }

function App() {
  return (
    <Routes>
      <Route path="/" element={<Feedback />} />
      <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  );
}

export default App;
