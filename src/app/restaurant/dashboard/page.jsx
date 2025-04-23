"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuth, signOut } from "firebase/auth";
import { app } from "@/libs/firebase-client";
import { Clock, Utensils, Bell, Package, Plus, LogOut } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
import OrderCard from "@/components/ui/OrderCard";
import MenuItemForm from "@/components/ui/MenuItemForm";
import MenuItemList from "@/components/ui/MenuItemList";
import NotificationList from "@/components/ui/NotificationList";
import ProfileEditModal from "@/components/ui/ProfileEditModal";
import { motion, AnimatePresence } from "framer-motion";

export default function RestaurantDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        console.log("No user, redirecting to login");
        router.push("/login");
        return;
      }
      console.log("Authenticated user UID:", user.uid);
      try {
        setLoading(true);
        const token = await user.getIdToken(true);
        console.log("Fetching profile with token:", token.slice(0, 20) + "...");
        const profileRes = await fetch("/api/restaurants/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Profile response:", {
          status: profileRes.status,
          statusText: profileRes.statusText,
        });
        if (!profileRes.ok) {
          const errorData = await profileRes.json();
          console.error("Profile fetch error:", errorData);
          if (profileRes.status === 403) {
            await signOut(auth); // Sign out to prevent loop
            throw new Error("Unauthorized: Restaurant access required");
          } else if (profileRes.status === 404) {
            router.push("/restaurant/setup");
            return;
          }
          throw new Error(
            errorData.error || "Failed to verify restaurant profile"
          );
        }
        await fetchData(user);
      } catch (err) {
        console.error("Dashboard initialization error:", err);
        setError(err.message);
        toast.error(err.message);
        if (
          err.message.includes("Unauthorized") ||
          err.message.includes("Restaurant owner")
        ) {
          setError(
            "You do not have restaurant access. Please contact support."
          );
          router.push("/login"); // Redirect after sign-out
        }
      } finally {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  const fetchData = async (user) => {
    try {
      setLoading(true);
      setError(null);

      const token = await user.getIdToken();
      console.log("Fetching data for user:", user.uid);

      const [profileRes, ordersRes, menuRes, notificationsRes] =
        await Promise.all([
          fetch("/api/restaurants/profile", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("/api/restaurants/orders", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("/api/restaurants/menu", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("/api/restaurants/notifications", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

      // Handle profile response
      if (!profileRes.ok) {
        const error = await profileRes.text();
        throw new Error(error || "Failed to fetch profile");
      }
      const profileData = await profileRes.json();
      setRestaurant(profileData);

      // Handle orders response
      if (!ordersRes.ok) {
        const error = await ordersRes.text();
        throw new Error(error || "Failed to fetch orders");
      }
      const ordersData = await ordersRes.json();
      setOrders(Array.isArray(ordersData) ? ordersData : []);

      // Handle menu response
      if (!menuRes.ok) {
        const error = await menuRes.text();
        throw new Error(error || "Failed to fetch menu items");
      }
      const menuData = await menuRes.json();
      setMenuItems(Array.isArray(menuData) ? menuData : []);

      // Handle notifications response
      if (!notificationsRes.ok) {
        const error = await notificationsRes.text();
        throw new Error(error || "Failed to fetch notifications");
      }
      const notificationsData = await notificationsRes.json();
      setNotifications(
        Array.isArray(notificationsData) ? notificationsData : []
      );

      console.log("Fetched data:", {
        profileData,
        ordersData,
        menuData,
        notificationsData,
      });
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message);
      toast.error(err.message);

      // Redirect if unauthorized
      if (
        err.message.includes("Unauthorized") ||
        err.message.includes("Restaurant owner")
      ) {
        router.push("/");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      const auth = getAuth(app);
      const user = auth.currentUser;

      if (!user) {
        toast.error("Please log in to update orders");
        return router.push("/login");
      }

      // Show loading state immediately
      toast.loading("Updating order status...");

      const token = await user.getIdToken();

      const response = await fetch("/api/restaurants/orders", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderId, status }),
      });

      // Dismiss loading toast
      toast.dismiss();

      // Handle non-OK responses
      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;

        try {
          const errorData = await response.json();
          if (errorData.error) {
            errorMessage = errorData.error;
          }
        } catch (e) {
          console.warn("Could not parse error response:", e);
        }

        throw new Error(errorMessage);
      }

      // Parse successful response
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Order update failed");
      }

      // Update local state
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status } : order
        )
      );

      toast.success("Order status updated successfully!");
    } catch (err) {
      console.error("Update order status error:", {
        error: err,
        time: new Date().toISOString(),
      });

      toast.error(err.message || "Failed to update order status");

      // Re-fetch orders to ensure sync with server
      try {
        const token = await getAuth(app).currentUser?.getIdToken();
        if (token) {
          const res = await fetch("/api/restaurants/orders", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const data = await res.json();
            setOrders(Array.isArray(data) ? data : []);
          }
        }
      } catch (refreshError) {
        console.error("Failed to refresh orders:", refreshError);
      }
    }
  };

  const addMenuItem = async (formData) => {
    try {
      const auth = getAuth(app);
      const user = auth.currentUser;
      const token = await user.getIdToken();

      const response = await fetch("/api/restaurants/menu", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add menu item");
      }

      const newItem = await response.json();
      setMenuItems([...menuItems, newItem]);
      toast.success("Menu item added!");
    } catch (err) {
      console.error("Add menu item error:", err);
      toast.error(err.message || "Failed to add menu item");
      throw err;
    }
  };

  const handleProfileUpdate = (updatedProfile) => {
    setRestaurant(updatedProfile);
  };

  const markNotificationAsRead = async (notificationId) => {
    try {
      const auth = getAuth(app);
      const user = auth.currentUser;
      const token = await user.getIdToken();

      const response = await fetch("/api/restaurants/notifications", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: notificationId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Failed to mark notification as read"
        );
      }

      const updatedNotification = await response.json();
      setNotifications(
        notifications.map((notification) =>
          notification._id === updatedNotification._id
            ? updatedNotification
            : notification
        )
      );
      toast.success("Notification marked as read!");
    } catch (err) {
      console.error("Mark notification error:", err);
      setError(err.message);
      toast.error(err.message);
    }
  };

  const handleLogout = async () => {
    try {
      const auth = getAuth(app);
      await signOut(auth);
      toast.success("Logged out successfully!");
      router.push("/login");
    } catch (err) {
      console.error("Logout error:", err);
      toast.error("Failed to log out: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-orange-50 to-white">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500"
        ></motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 bg-gradient-to-br from-orange-50 to-white min-h-screen flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md"
        >
          <h2 className="text-xl font-semibold text-red-500 mb-4">{error}</h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:shadow-md transition-all"
          >
            Try Again
          </motion.button>
          {error.includes("forbidden") && (
            <p className="mt-4 text-sm text-gray-500">
              Your restaurant is not yet approved. Please contact support or
              wait for admin approval.
            </p>
          )}
        </motion.div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="text-center py-12 bg-gradient-to-br from-orange-50 to-white min-h-screen flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md"
        >
          <h2 className="text-xl font-semibold mb-4">
            Restaurant profile not found
          </h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/restaurant/setup")}
            className="mt-4 px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:shadow-md transition-all"
          >
            Setup Your Restaurant
          </motion.button>
        </motion.div>
      </div>
    );
  }

  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
      <Toaster position="top-center" />
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-bold text-gray-900"
          >
            {restaurant.name} Dashboard
          </motion.h1>
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsProfileModalOpen(true)}
              className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:shadow-md transition-all"
            >
              Edit Profile
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setActiveTab("notifications")}
              className="relative p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <Bell className="h-6 w-6" />
              {notifications.some((n) => !n.read) && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full"
                ></motion.span>
              )}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleLogout}
              className="p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              title="Log Out"
            >
              <LogOut className="h-6 w-6" />
            </motion.button>
          </div>
        </div>
      </header>

      <ProfileEditModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        restaurant={restaurant}
        onProfileUpdate={handleProfileUpdate}
      />

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white shadow-lg rounded-xl p-6 mb-6"
        >
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
            {restaurant.image ? (
              <motion.img
                whileHover={{ scale: 1.05 }}
                src={restaurant.image}
                alt={restaurant.name}
                className="w-24 h-24 object-cover rounded-full border-4 border-orange-100"
              />
            ) : (
              <div className="w-24 h-24 bg-gradient-to-r from-orange-100 to-orange-200 rounded-full flex items-center justify-center">
                <span className="text-gray-500">No Image</span>
              </div>
            )}
            <div className="text-center md:text-left">
              <h2 className="text-xl font-semibold">{restaurant.name}</h2>
              <p className="text-gray-600">
                Eco-Friendly: {restaurant.isEcoFriendly ? "✅ Yes" : "❌ No"}
              </p>
            </div>
          </div>
        </motion.div>

        <div className="relative">
          <div className="overflow-x-auto pb-2">
            <div className="flex space-x-4 w-max">
              {["orders", "menu", "add-item", "notifications"].map((tab) => (
                <motion.button
                  key={tab}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab(tab)}
                  className={`whitespace-nowrap py-3 px-4 rounded-lg font-medium text-sm flex items-center ${
                    activeTab === tab
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md"
                      : "bg-white text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {tab === "orders" && <Package className="mr-2 h-4 w-4" />}
                  {tab === "menu" && <Utensils className="mr-2 h-4 w-4" />}
                  {tab === "add-item" && <Plus className="mr-2 h-4 w-4" />}
                  {tab === "notifications" && <Bell className="mr-2 h-4 w-4" />}
                  {tab
                    .split("-")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              {activeTab === "orders" && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Orders</h2>
                  {orders.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-8 bg-white rounded-xl shadow-sm"
                    >
                      <Package className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                      <p>No orders yet</p>
                    </motion.div>
                  ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {orders.map((order) => (
                        <motion.div
                          key={order._id}
                          whileHover={{ y: -5 }}
                          transition={{ duration: 0.2 }}
                        >
                          <OrderCard
                            order={order}
                            onUpdateStatus={handleUpdateOrderStatus}
                          />
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "menu" && (
                <MenuItemList items={menuItems} restaurantId={restaurant._id} />
              )}

              {activeTab === "add-item" && (
                <MenuItemForm
                  onSubmit={addMenuItem}
                  restaurantId={restaurant._id}
                />
              )}

              {activeTab === "notifications" && (
                <NotificationList
                  notifications={notifications}
                  onMarkAsRead={markNotificationAsRead}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
