import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProjectDetail from "./pages/ProjectDetail";
import Report from "./pages/Report";
import Profile from "./pages/Profile";
import Inbox from "./pages/Inbox";
import Register from "./pages/Register";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 👇 1. Route Root: Kalau buka web, langsung arahkan ke /login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* 👇 2. INI YANG KURANG TADI! (Route Login Eksplisit) */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Route Register */}
        <Route path="/register" element={<Register />} />

        {/* Halaman Utama */}
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Detail Project */}
        <Route path="/projects/:id" element={<ProjectDetail />} />

        {/* Fitur Tambahan */}
        <Route path="/report" element={<Report />} />
        <Route path="/profile" element={<Profile />} />
        
        {/* Route Inbox */}
        <Route path="/inbox" element={<Inbox />} />

        {/* 👇 TAMBAHAN: Wildcard (Kalau user asal ketik url ngawur, balikin ke login) */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;