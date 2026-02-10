import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProjectDetail from "./pages/ProjectDetail";
import Report from "./pages/Report";
import Profile from "./pages/Profile";
import Inbox from "./pages/Inbox";
// 👇 IMPORT HALAMAN REGISTER
import Register from "./pages/Register";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Halaman Login (Default) */}
        <Route path="/" element={<LoginPage />} />
        
        {/* 👇 ROUTE REGISTER (Penting buat Google Auth User Baru) */}
        <Route path="/register" element={<Register />} />

        {/* Halaman Utama */}
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Detail Project */}
        <Route path="/projects/:id" element={<ProjectDetail />} />

        {/* Fitur Tambahan */}
        <Route path="/report" element={<Report />} />
        <Route path="/profile" element={<Profile />} />
        
        {/* Route Inbox (Kotak Masuk Ide) */}
        <Route path="/inbox" element={<Inbox />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;