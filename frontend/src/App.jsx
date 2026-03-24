// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "sonner";

import { AppRoutes } from "./components/AppRoutes";

// Pages (dashboard lives under src/pages)
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    // BrowserRouter must wrap AuthProvider so useNavigate() works inside AuthContext
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" richColors />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
