"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuth, signOut } from "firebase/auth";
import { app } from "@/libs/firebase-client";
import {
  Clock,
  Utensils,
  Bell,
  Package,
  CheckCircle,
  XCircle,
  Plus,
  LogOut,
} from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
import OrderCard from "@/components/ui/OrderCard";
import MenuItemForm from "@/components/ui/MenuItemForm";
import MenuItemList from "@/components/ui/MenuItemList";
import NotificationList from "@/components/ui/NotificationList";
import ProfileEditModal from "@/components/ui/ProfileEditModal";

export default function RestaurantDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [restaurant, setRestaurant] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        router.push("/login");
        return;
      }

      try {
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

        const parseResponse = async (res, errorMessage) => {
          const contentType = res.headers.get("content-type");
          const text = await res.text();

          if (!res.ok) {
            if (!text) {
              if (res.status === 405) {
                throw new Error(`${errorMessage}: Method not allowed`);
              }
              if (res.status === 403) {
                throw new Error(
                  `${errorMessage}: Access forbidden - restaurant may not be approved`
                );
              }
              if (res.status === 404) {
                throw new Error(`${errorMessage}: Resource not found`);
              }
              throw new Error(
                `${errorMessage}: Empty response (status ${res.status})`
              );
            }

            if (contentType?.includes("application/json")) {
              try {
                const data = JSON.parse(text);
                throw new Error(data.error || `${errorMessage}: Unknown error`);
              } catch (e) {
                console.error("Invalid JSON response:", text);
                throw new Error(
                  `${errorMessage}: Invalid JSON - ${text.slice(0, 50)}`
                );
              }
            } else {
              throw new Error(
                `${errorMessage}: Non-JSON response - ${text.slice(0, 50)}`
              );
            }
          }

          if (!contentType?.includes("application/json")) {
            throw new Error(
              `${errorMessage}: Expected JSON, got ${contentType}`
            );
          }
          if (!text) {
            throw new Error(`${errorMessage}: Empty JSON response`);
          }

          try {
            return JSON.parse(text);
          } catch (e) {
            console.error("Invalid JSON response:", text);
            throw new Error(
              `${errorMessage}: Invalid JSON - ${text.slice(0, 50)}`
            );
          }
        };

        const profileData = await parseResponse(
          profileRes,
          "Failed to fetch restaurant profile"
        );
        const ordersData = await parseResponse(
          ordersRes,
          "Failed to fetch orders"
        );
        const menuData = await parseResponse(
          menuRes,
          "Failed to fetch menu items"
        );
        const notificationsData = await parseResponse(
          notificationsRes,
          "Failed to fetch notifications"
        );

        setRestaurant(profileData);
        setOrders(ordersData);
        setMenuItems(menuData);
        setNotifications(notificationsData);
      } catch (err) {
        setError(err.message);
        toast.error(err.message);
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const updateOrderStatus = async (orderId, status) => {
    try {
      const auth = getAuth(app);
      const user = auth.currentUser;
      const token = await user.getIdToken();

      const response = await fetch("/api/restaurants/orders", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderId, status }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update order status");
      }

      const updatedOrder = await response.json();
      setOrders(
        orders.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order
        )
      );
      toast.success("Order status updated!");
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
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
      toast.error("Failed to log out: " + err.message);
      console.error("Logout error:", err);
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error)
    return (
      <div className="text-center py-8 text-red-500">
        {error}
        <button
          onClick={() => {
            setError("");
            setLoading(true);
            router.refresh();
          }}
          className="ml-4 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
        >
          Retry
        </button>
        {error.includes("not approved") && (
          <p className="mt-2 text-sm text-gray-500">
            Your restaurant is not yet approved. Please contact support or wait
            for admin approval.
          </p>
        )}
      </div>
    );
  if (!restaurant)
    return (
      <div className="text-center py-8 text-gray-500">
        Restaurant not found.{" "}
        <a href="/register" className="text-orange-500 underline">
          Register your restaurant
        </a>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-center" />
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            {restaurant.name} Dashboard
          </h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
            >
              Edit Profile
            </button>
            <button
              onClick={() => setActiveTab("notifications")}
              className="relative p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <Bell className="h-6 w-6" />
              {notifications.some((n) => !n.read) && (
                <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full"></span>
              )}
            </button>
            <button
              onClick={handleLogout}
              className="p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              title="Log Out"
            >
              <LogOut className="h-6 w-6" />
            </button>
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
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex items-center space-x-4">
            {restaurant.image ? (
              <img
                src={restaurant.image}
                alt={restaurant.name}
                className="w-24 h-24 object-cover rounded-full"
              />
            ) : (
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-gray-500">No Image</span>
              </div>
            )}
            <div>
              <h2 className="text-xl font-semibold">{restaurant.name}</h2>
              <p className="text-gray-600">
                Eco-Friendly: {restaurant.isEcoFriendly ? "Yes" : "No"}
              </p>
            </div>
          </div>
        </div>

        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("orders")}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeTab === "orders"
                  ? "border-orange-500 text-orange-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Package className="mr-2 h-4 w-4" /> Orders
            </button>
            <button
              onClick={() => setActiveTab("menu")}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeTab === "menu"
                  ? "border-orange-500 text-orange-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Utensils className="mr-2 h-4 w-4" /> Menu
            </button>
            <button
              onClick={() => setActiveTab("add-item")}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeTab === "add-item"
                  ? "border-orange-500 text-orange-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Plus className="mr-2 h-4 w-4" /> Add Item
            </button>
            <button
              onClick={() => setActiveTab("notifications")}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeTab === "notifications"
                  ? "border-orange-500 text-orange-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Bell className="mr-2 h-4 w-4" /> Notifications
            </button>
          </nav>
        </div>

        <div className="mt-6">
          {activeTab === "orders" && (
            <div className="space-y-4">
              {orders.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No orders found
                </div>
              ) : (
                orders.map((order) => (
                  <OrderCard
                    key={order._id}
                    order={order}
                    onUpdateStatus={updateOrderStatus}
                  />
                ))
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
        </div>
      </main>
    </div>
  );
}
