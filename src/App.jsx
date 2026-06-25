import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import { ToastContainer } from "react-toastify";           
import "react-toastify/dist/ReactToastify.css"; 
import Layout from "./components/layout/Layout";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";


// Lazy Loaded Pages
const Login = React.lazy(() => import("./features/auth/pages/Login"));
const UploadPage = React.lazy(() => import("./features/upload/pages/UploadPage"));
const Settings = React.lazy(() => import("./features/settings/pages/Settings"));
const ReportsPage = React.lazy(() => import("./features/reports/pages/ReportsPage"));
const ReportDetails = React.lazy(() => import("./features/reports/pages/ReportDetails"));

// Loading Component
const Loading = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
    }}
  >
    <h3>Loading...</h3>
  </div>
);

export default function App() {
  return (
    <Suspense fallback={<Loading />}>
      <CssBaseline />

        <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="colored"
      />


      <Routes>

        {/* Public Route */}
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
         }
           />


         {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<UploadPage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route
              path="/reports/:batchId/:processNo"
              element={<ReportDetails />}
            />
          </Route>
        </Route>

        <Route path="*" element={<div>Page Not Found</div>} />
        
      </Routes>
    </Suspense>
  );
}
