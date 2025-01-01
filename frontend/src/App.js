import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import HRDashboard from "./pages/HRDashboard";
import ProtectedRoute from "./utils/ProtectedRoute";
import ExitInterview from "./pages/ExitInterview";
import HRExitInterviews from "./pages/HRExitInterviews";
import Register from "./pages/Register";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Redirect root URL to /login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/employee-dashboard"
          element={
            <ProtectedRoute role="employee">
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hr-dashboard"
          element={
            <ProtectedRoute role="hr">
              <HRDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/exit-interview"
          element={
            <ProtectedRoute role={"employee"}>
              <ExitInterview />
            </ProtectedRoute>
          }
        />
        <Route
          path="/exit-responses"
          element={
            <ProtectedRoute role={"hr"}>
              <HRExitInterviews />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
