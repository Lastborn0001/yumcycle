"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuth, signOut } from "firebase/auth";
import { app } from "@/libs/firebase-client";
import { toast, Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Package } from "lucide-react";
import ModernHeader from "./ModernHeader";
import ModernNavigation from "./ModernNavigation";
import RestaurantInfoCard from "./RestaurantInfoCard";
import AnalyticsDashboard from "./AnalyticalDashboard";
import OrderCard from "@/components/ui/OrderCard";
import MenuItemForm from "@/components/ui/MenuItemForm";
import MenuItemList from "@/components/ui/MenuItemList";
import NotificationList from "@/components/ui/NotificationList";
import ProfileEditModal from "@/components/ui/ProfileEditModal";
import Loading from "@/components/ui/Loading";
import OrderDetailsModal from "@/components/ui/OrderDetailsModal";
import { ArrowRight } from "lucide-react";

export default function ModernRestaurantDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("analytics");
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const auth = getAuth(app);
      const user = auth.currentUser;
      if (!user) {
        toast.error("Please log in to update orders");
        return;
      }

      const token = await user.getIdToken();
      const response = await fetch("/api/restaurants/orders", {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
          status: newStatus,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update order status");
      }

      const { order } = await response.json();
      setOrders(
        orders.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
      );
      toast.success("Order status updated to " + newStatus);
    } catch (err) {
      console.error("Update status error:", err);
      toast.error(err.message);
    }
  };

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        router.push("/login");
        return;
      }

      try {
        setLoading(true);
        const token = await user.getIdToken(true);
        const profileRes = await fetch("/api/restaurants/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!profileRes.ok) {
          const errorData = await profileRes.json();
          console.error("Profile fetch error:", errorData);
          if (profileRes.status === 403) {
            await signOut(auth);
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
          router.push("/login");
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

      if (!profileRes.ok) {
        const error = await profileRes.text();
        throw new Error(error || "Failed to fetch profile");
      }
      const profileData = await profileRes.json();

      // Check if restaurant is approved - redirect if not
      if (profileData.status !== "approved") {
        setError(
          `Your restaurant account is ${profileData.status}. Only approved restaurants can access the dashboard.`
        );
        setLoading(false);
        return;
      }

      setRestaurant(profileData);

      if (!ordersRes.ok) {
        const error = await ordersRes.text();
        throw new Error(error || "Failed to fetch orders");
      }
      const ordersData = await ordersRes.json();
      setOrders(Array.isArray(ordersData) ? ordersData : []);

      if (!menuRes.ok) {
        const error = await menuRes.text();
        throw new Error(error || "Failed to fetch menu items");
      }
      const menuData = await menuRes.json();
      setMenuItems(Array.isArray(menuData) ? menuData : []);

      if (!notificationsRes.ok) {
        const error = await notificationsRes.text();
        throw new Error(error || "Failed to fetch notifications");
      }
      const notificationsData = await notificationsRes.json();
      setNotifications(
        Array.isArray(notificationsData) ? notificationsData : []
      );
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message);
      toast.error(err.message);

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

      toast.dismiss();

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

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || "Order update failed");
      }

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status } : order
        )
      );

      toast.success("Order status updated successfully!");
    } catch (err) {
      console.error("Update order status error:", err);
      toast.error(err.message || "Failed to update order status");

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
    return <Loading />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4">
        <Toaster position="top-center" />
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Something went wrong
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.reload()}
            className="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:shadow-lg transition-all font-medium"
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center"
        >
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="h-8 w-8 text-orange-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Setup Required
          </h2>
          <p className="text-gray-600 mb-6">
            Restaurant profile not found. Let's get you set up!
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/restaurant/setup")}
            className="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:shadow-lg transition-all font-medium"
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <Toaster position="top-center" />

      {/* Modern Header */}
      <ModernHeader
        restaurant={restaurant}
        notifications={notifications}
        onEditProfile={() => setIsProfileModalOpen(true)}
        onLogout={handleLogout}
        onNotificationClick={() => setActiveTab("notifications")}
      />

      {/* Navigation */}
      <ModernNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        notifications={notifications}
      />

      {/* Profile Edit Modal */}
      <ProfileEditModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        restaurant={restaurant}
        onProfileUpdate={handleProfileUpdate}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Restaurant Info Card - Show on analytics tab */}
        {activeTab === "analytics" && (
          <div className="mb-8">
            <RestaurantInfoCard restaurant={restaurant} orders={orders} />
          </div>
        )}

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={tabVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            {activeTab === "analytics" && (
              <AnalyticsDashboard orders={orders} />
            )}

            {activeTab === "orders" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Order Management
                  </h2>
                  <div className="text-sm text-gray-500">
                    {orders.length} {orders.length === 1 ? "order" : "orders"}{" "}
                    total
                  </div>
                </div>
                {orders.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100"
                  >
                    <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No orders yet
                    </h3>
                    <p className="text-gray-500">
                      Orders will appear here when customers place them
                    </p>
                  </motion.div>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {orders.map((order, index) => (
                      <motion.div
                        key={order._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <OrderCard
                          order={order}
                          onUpdateStatus={handleStatusUpdate}
                          onClick={() => setSelectedOrder(order)}
                        />
                      </motion.div>
                    ))}
                  </div>
                )}

                {selectedOrder && (
                  <OrderDetailsModal
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                    onStatusChange={(newStatus) => {
                      handleStatusUpdate(selectedOrder._id, newStatus);
                    }}
                  />
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
      </main>
    </div>
  );
}
