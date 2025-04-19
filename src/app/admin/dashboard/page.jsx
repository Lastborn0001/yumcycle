"use client";
import {
  Clock,
  Map,
  Truck,
  Leaf,
  Plus,
  Utensils,
  Check,
  X,
  Trash2,
  LogOut, // Add LogOut icon
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { getAuth, signOut } from "firebase/auth"; // Add signOut
import { app } from "@/libs/firebase-client";
import { toast, Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation"; // Add useRouter

const AdminDashboard = () => {
  const router = useRouter(); // Add router
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("pending");
  const [processing, setProcessing] = useState(new Set());

  const getAuthToken = async () => {
    const auth = getAuth(app);
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");
    return await user.getIdToken();
  };

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push("/login");
        return;
      }
      fetchRestaurants();
    });

    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        const token = await getAuthToken();

        const response = await fetch(
          `/api/admin/restaurants?status=${activeTab}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch restaurants");
        }
        const data = await response.json();
        setRestaurants(data);
      } catch (err) {
        setError(err.message);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
    return () => unsubscribe();
  }, [activeTab, router]);

  const handleApprove = async (restaurantId, userId) => {
    if (processing.has(restaurantId)) return;
    if (!confirm("Are you sure you want to approve this restaurant?")) return;
    setProcessing((prev) => new Set(prev).add(restaurantId));
    try {
      const token = await getAuthToken();
      const response = await fetch("/api/admin/restaurants", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          action: "approve",
          restaurantId,
          userId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to approve restaurant");
      }

      setRestaurants(
        restaurants.map((r) =>
          r._id === restaurantId ? { ...r, status: "approved" } : r
        )
      );
      toast.success("Restaurant approved successfully!");
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setProcessing((prev) => {
        const newSet = new Set(prev);
        newSet.delete(restaurantId);
        return newSet;
      });
    }
  };

  const handleReject = async (restaurantId, userId) => {
    if (processing.has(restaurantId)) return;
    if (!confirm("Are you sure you want to reject this restaurant?")) return;
    setProcessing((prev) => new Set(prev).add(restaurantId));
    try {
      const token = await getAuthToken();
      const response = await fetch("/api/admin/restaurants", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          action: "reject",
          restaurantId,
          userId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to reject restaurant");
      }

      setRestaurants(
        restaurants.map((r) =>
          r._id === restaurantId ? { ...r, status: "rejected" } : r
        )
      );
      toast.success("Restaurant rejected successfully!");
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setProcessing((prev) => {
        const newSet = new Set(prev);
        newSet.delete(restaurantId);
        return newSet;
      });
    }
  };

  const handleDelete = async (restaurantId, userId) => {
    if (processing.has(restaurantId)) return;
    if (!confirm("Are you sure you want to delete this restaurant?")) return;
    setProcessing((prev) => new Set(prev).add(restaurantId));
    try {
      const token = await getAuthToken();
      const response = await fetch("/api/admin/restaurants", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          action: "delete",
          restaurantId,
          userId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete restaurant");
      }

      setRestaurants(restaurants.filter((r) => r._id !== restaurantId));
      toast.success("Restaurant deleted successfully!");
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setProcessing((prev) => {
        const newSet = new Set(prev);
        newSet.delete(restaurantId);
        return newSet;
      });
    }
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
    if (error) {
      const timer = setTimeout(() => setError(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error)
    return (
      <div className="text-center py-8 text-red-500">
        {error}
        <button
          onClick={() => setError("")}
          className="ml-4 px-4 py-2 bg-orange-500 text-white rounded"
        >
          Retry
        </button>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-center" />
      <header className="bg-orange-500 text-white p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="p-2 rounded-full bg-orange-600 hover:bg-orange-700 text-white"
          title="Log Out"
        >
          <LogOut className="h-6 w-6" />
        </button>
      </header>
      <main className="xl:w-[80%] p-9 w-full m-auto">
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Restaurant Approvals</h2>

          <div className="flex border-b border-gray-200">
            <button
              className={`py-2 px-4 font-medium ${
                activeTab === "pending"
                  ? "text-orange-600 border-b-2 border-orange-600"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("pending")}
            >
              Pending Approval{" "}
              {restaurants.filter((r) => r.status === "pending").length > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                  {restaurants.filter((r) => r.status === "pending").length}
                </span>
              )}
            </button>
            <button
              className={`py-2 px-4 font-medium ${
                activeTab === "approved"
                  ? "text-orange-600 border-b-2 border-orange-600"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("approved")}
            >
              Approved Restaurants
            </button>
          </div>

          <div className="mt-6">
            {restaurants.filter((r) => r.status === activeTab).length === 0 ? (
              <p className="text-center py-8">
                No {activeTab} restaurants found
              </p>
            ) : (
              <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3">
                {restaurants
                  .filter((r) => r.status === activeTab)
                  .map((restaurant) => (
                    <div
                      key={restaurant._id}
                      className="group w-full max-w-[400px] mx-auto overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 rounded-lg bg-white"
                    >
                      <div className="relative">
                        <img
                          src="/restaurant-placeholder.jpg"
                          alt={restaurant.name}
                          className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
                          <h3 className="truncate text-lg font-bold">
                            {restaurant.name}
                          </h3>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {restaurant.cuisine.map((type, index) => (
                              <span key={index} className="text-xs">
                                {type}
                                {index < restaurant.cuisine.length - 1
                                  ? " • "
                                  : ""}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            Owner: {restaurant.userId?.name || "Unknown"}
                          </span>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              restaurant.status === "approved"
                                ? "bg-green-100 text-green-800"
                                : restaurant.status === "rejected"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {restaurant.status}
                          </span>
                        </div>
                        <div className="mt-3">
                          <p className="text-sm text-gray-600">
                            {restaurant.address}
                          </p>
                        </div>
                        <div className="mt-4 flex justify-end space-x-2">
                          {restaurant.status === "pending" &&
                          restaurant.userId?.uid ? (
                            <>
                              <button
                                onClick={() =>
                                  handleApprove(
                                    restaurant._id,
                                    restaurant.userId.uid
                                  )
                                }
                                className="p-2 rounded-md bg-green-100 text-green-800 hover:bg-green-200"
                                title="Approve"
                                disabled={processing.has(restaurant._id)}
                              >
                                {processing.has(restaurant._id) ? (
                                  <span className="animate-spin">⏳</span>
                                ) : (
                                  <Check className="h-4 w-4" />
                                )}
                              </button>
                              <button
                                onClick={() =>
                                  handleReject(
                                    restaurant._id,
                                    restaurant.userId.uid
                                  )
                                }
                                className="p-2 rounded-md bg-red-100 text-red-800 hover:bg-red-200"
                                title="Reject"
                                disabled={processing.has(restaurant._id)}
                              >
                                {processing.has(restaurant._id) ? (
                                  <span className="animate-spin">⏳</span>
                                ) : (
                                  <X className="h-4 w-4" />
                                )}
                              </button>
                            </>
                          ) : (
                            restaurant.status === "pending" && (
                              <span className="text-xs text-red-500">
                                User data missing
                              </span>
                            )
                          )}
                          <button
                            onClick={() =>
                              restaurant.userId?.uid
                                ? handleDelete(
                                    restaurant._id,
                                    restaurant.userId.uid
                                  )
                                : toast.error(
                                    "Cannot delete: User data missing"
                                  )
                            }
                            className="p-2 rounded-md bg-gray-100 text-gray-800 hover:bg-gray-200"
                            title="Delete"
                            disabled={processing.has(restaurant._id)}
                          >
                            {processing.has(restaurant._id) ? (
                              <span className="animate-spin">⏳</span>
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
