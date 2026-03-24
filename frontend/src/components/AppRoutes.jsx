// Components (based on your structure)
import Login from "./auth/Login";
import Register from "./auth/Register";
import AdminDashboard from "../pages/AdminDashboard";
import { ProtectedRoute } from "./auth/ProtectedRoute";
import PublicEStop from "./Public/PublicEStop";
import { Link, Navigate, Route, Routes } from "react-router-dom";
import { PageNotFound } from "../pages/PageNotFound";

export function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/public-estop" element={<PublicEStop />} />
      <Route path="/page-not-found" element={<PageNotFound />} />

      {/* Protected Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/supervisor/dashboard"
        element={
          <ProtectedRoute allowedRoles={["supervisor", "admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/operator/dashboard"
        element={
          <ProtectedRoute allowedRoles={["operator"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Unauthorized */}
      <Route
        path="/unauthorized"
        element={
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-red-600 mb-4">
                403 - Unauthorized
              </h1>
              <p className="text-gray-600 mb-4">
                You don't have permission to access this page.
              </p>
              <Link
                to="/login"
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                Go back to login
              </Link>
            </div>
          </div>
        }
      />

      {/* Default Route */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/page-not-found" replace />} />
    </Routes>
  );
}
