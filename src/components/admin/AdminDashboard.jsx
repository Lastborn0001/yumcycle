"use client";
import React, { useState, useEffect } from "react";
import { getAuth, signOut } from "firebase/auth";
import { app } from "@/libs/firebase-client";
import { toast, Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Loading from "@/components/ui/Loading";
import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";
import RestaurantsTable from "@/components/info/RestaurantsTable";
import UsersTable from "@/components/table/UsersTable";
import Analytics from "@/components/analytic/Analytics"; // Ensure correct path

const AdminDashboard = () => {
  const router = useRouter();
  const [activeView, setActiveView] = useState("restaurants");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const getAuthToken = async () => {
    const auth = getAuth(app);
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");
    return await user.getIdToken();
  };

  const handleLogout = async () => {
    try {
      const auth = getAuth(app);
      await signOut(auth);
      toast.success("Logged out successfully!");
      router.push("/login");
    } catch (err) {
      toast.error("Failed to log out: " + err.message);
      console.error("Logout error:", err);
    }
  };

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push("/login");
        return;
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4 text-lg">{error}</div>
          <button
            onClick={() => setError("")}
            className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

 

  return (
    <div className="flex h-screen bg-gray-50">
      <Toaster position="top-right" />

      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />

      <div
        className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
          sidebarCollapsed ? "ml-16" : "ml-64"
        }`}
      >
        <Header
          onLogout={handleLogout}
          toggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          sidebarCollapsed={sidebarCollapsed}
        />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {activeView === "restaurants" && (
              <RestaurantsTable getAuthToken={getAuthToken} />
            )}
            {activeView === "users" && (
              <UsersTable getAuthToken={getAuthToken} />
            )}
            {activeView === "analytics" && (
              <Analytics getAuthToken={getAuthToken} />
            )}
            {activeView === "settings" && (
              <div>Settings View (To be implemented)</div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
