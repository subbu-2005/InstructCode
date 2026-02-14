import { useUser } from "@clerk/clerk-react";
import { Navigate, Route, Routes } from "react-router";
import { useEffect } from "react";
import HomePage from "./pages/HomePage";

import { Toaster } from "react-hot-toast";
import DashboardPage from "./pages/DashboardPage";
import ProblemPage from "./pages/ProblemPage";
import ProblemsPage from "./pages/ProblemsPage";
import SessionPage from "./pages/SessionPage";
import ProgressPage from "./pages/ProgressPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminSessions from "./pages/admin/AdminSessions";
import AdminProblems from "./pages/admin/AdminProblems";
import AdminProblemForm from "./pages/admin/AdminProblemForm";

function App() {
  const { isSignedIn, isLoaded, user } = useUser();

  // Debug logging
  useEffect(() => {
    console.log("=".repeat(50));
    console.log("🔍 Frontend Status:");
    console.log("   Clerk Loaded:", isLoaded);
    console.log("   User Signed In:", isSignedIn);
    console.log("   User ID:", user?.id);
    console.log("   User Email:", user?.primaryEmailAddress?.emailAddress);
    console.log("   Clerk Object:", window.Clerk ? "✓ Available" : "✗ Not Available");
    console.log("   API Base URL:", import.meta.env.VITE_API_URL);
    console.log("=".repeat(50));
  }, [isLoaded, isSignedIn, user]);

  // this will get rid of the flickering effect
  if (!isLoaded) return null;

  return (
    <>
      <Routes>
        <Route path="/" element={!isSignedIn ? <HomePage /> : <Navigate to={"/dashboard"} />} />
        <Route path="/dashboard" element={isSignedIn ? <DashboardPage /> : <Navigate to={"/"} />} />

        <Route path="/problems" element={isSignedIn ? <ProblemsPage /> : <Navigate to={"/"} />} />
        <Route path="/problem/:id" element={isSignedIn ? <ProblemPage /> : <Navigate to={"/"} />} />
        <Route path="/session/:id" element={isSignedIn ? <SessionPage /> : <Navigate to={"/"} />} />
        <Route path="/progress" element={isSignedIn ? <ProgressPage /> : <Navigate to={"/"} />} />
        <Route path="/leaderboard" element={isSignedIn ? <LeaderboardPage /> : <Navigate to={"/"} />} />

        {/* Admin Routes */}
        <Route path="/admin" element={isSignedIn ? <AdminLayout /> : <Navigate to={"/"} />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="sessions" element={<AdminSessions />} />
          <Route path="problems" element={<AdminProblems />} />
          <Route path="problems/new" element={<AdminProblemForm />} />
          <Route path="problems/:id" element={<AdminProblemForm />} />
        </Route>
      </Routes>

      <Toaster toastOptions={{ duration: 3000 }} />
    </>
  );
}

export default App;