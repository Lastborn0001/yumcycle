"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/libs/AuthContext";
import ClientLayout from "@/app/ClientLayout";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import { Toaster, toast } from "react-hot-toast";
import { motion } from "framer-motion";
import OrderStatsHeader from "./OrderStatsHeader";
import OrderFilters from "./OrderFilters";
import OrderCard from "./ModernOrderCard";
import EmptyOrdersState from "./EmptyOrdersState";
import OrderTrackingModal from "./ModernOrderTrackingModal";
import Chatbot from "@/components/Chatbot";
import Loading from "@/components/ui/Loading";

const OrderHistoryPage = () => {
  const router = useRouter();
  const { firebaseUser, loading } = useAuth();
  const hasRedirected = useRef(false);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filters, setFilters] = useState({
    status: "all",
    timeRange: "all",
    restaurant: "all",
  });

  useEffect(() => {
    if (loading || hasRedirected.current) return;

    const redirectTimeout = setTimeout(() => {
      if (!loading && firebaseUser === null) {
        hasRedirected.current = true;
        toast.error("Please log in to view your orders");
        router.push("/login");
      }
    }, 500);

    return () => clearTimeout(redirectTimeout);
  }, [firebaseUser, loading, router]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const token = await firebaseUser.getIdToken();
      const response = await fetch("/api/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch orders");
      }

      const data = await response.json();
      setOrders(data.orders || []);
      setFilteredOrders(data.orders || []);
    } catch (err) {
      console.error("Fetch orders error:", err);
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (loading || !firebaseUser) return;
    fetchOrders();
  }, [firebaseUser, loading]);

  // Filter orders based on current filters
  useEffect(() => {
    let filtered = [...orders];

    // Status filter
    if (filters.status !== "all") {
      filtered = filtered.filter((order) => order.status === filters.status);
    }

    // Time range filter
    if (filters.timeRange !== "all") {
      const now = new Date();
      let startDate;

      switch (filters.timeRange) {
        case "today":
          startDate = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate()
          );
          break;
        case "week":
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "month":
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
      }

      if (startDate) {
        filtered = filtered.filter(
          (order) => new Date(order.createdAt) >= startDate
        );
      }
    }

    // Restaurant filter
    if (filters.restaurant !== "all") {
      filtered = filtered.filter(
        (order) => order.items[0]?.restaurantName === filters.restaurant
      );
    }

    setFilteredOrders(filtered);
  }, [orders, filters]);

  const handleConfirmDelivery = async (orderId) => {
    try {
      const token = await firebaseUser.getIdToken();
      const response = await fetch(`/api/orders/${orderId}/confirm`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to confirm delivery");

      toast.success("Order delivery confirmed!");
      await fetchOrders();
      setSelectedOrder(null);
    } catch (err) {
      console.error("Confirm delivery error:", err);
      toast.error(err.message);
    }
  };

  const handleReorder = async (order) => {
    try {
      // Add items to cart and redirect to checkout
      const cartItems = order.items.map((item) => ({
        ...item,
        restaurantId: order.restaurantId,
      }));

      // Store in localStorage for cart persistence
      localStorage.setItem("reorderItems", JSON.stringify(cartItems));
      toast.success("Items added to cart!");
      router.push("/cart");
    } catch (err) {
      console.error("Reorder error:", err);
      toast.error("Failed to reorder items");
    }
  };

  const getOrderStats = () => {
    return {
      total: orders.length,
      completed: orders.filter((o) => o.status === "completed").length,
      pending: orders.filter((o) => o.status === "pending").length,
      totalSpent: orders
        .filter((o) => o.status === "completed")
        .reduce((sum, order) => sum + order.total, 0),
    };
  };

  const getUniqueRestaurants = () => {
    const restaurants = new Set();
    orders.forEach((order) => {
      if (order.items[0]?.restaurantName) {
        restaurants.add(order.items[0].restaurantName);
      }
    });
    return Array.from(restaurants);
  };

  if (loading || isLoading) {
    return (
      <ClientLayout>
        <Nav />
        <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Loading />
          </div>
        </main>
        <Footer />
      </ClientLayout>
    );
  }

  if (error) {
    return (
      <ClientLayout>
        <Nav />
        <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-sm border border-red-200 p-8 text-center"
            >
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-red-600 text-2xl">⚠️</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Something went wrong
              </h2>
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </motion.div>
          </div>
        </main>
        <Footer />
      </ClientLayout>
    );
  }

  const orderStats = getOrderStats();
  const uniqueRestaurants = getUniqueRestaurants();

  return (
    <ClientLayout>
      <Nav />
      <Toaster position="top-center" />
      <main className="min-h-screen bg-gradient-to-br pt-20 from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header with Stats */}
          <OrderStatsHeader stats={orderStats} />

          {orders.length === 0 ? (
            <EmptyOrdersState
              onBrowseRestaurants={() => router.push("/restaurants")}
            />
          ) : (
            <div className="space-y-8">
              {/* Filters */}
              <OrderFilters
                filters={filters}
                onFiltersChange={setFilters}
                restaurants={uniqueRestaurants}
                resultCount={filteredOrders.length}
              />

              {/* Orders Grid */}
              {filteredOrders.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center"
                >
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-gray-400 text-2xl">🔍</span>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No orders match your filters
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Try adjusting your filters to see more results
                  </p>
                  <button
                    onClick={() =>
                      setFilters({
                        status: "all",
                        timeRange: "all",
                        restaurant: "all",
                      })
                    }
                    className="px-4 py-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                  >
                    Clear Filters
                  </button>
                </motion.div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredOrders.map((order, index) => (
                    <motion.div
                      key={order._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <OrderCard
                        order={order}
                        onTrackOrder={() => setSelectedOrder(order)}
                        onReorder={() => handleReorder(order)}
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Order Tracking Modal */}
          {selectedOrder && (
            <OrderTrackingModal
              isOpen={!!selectedOrder}
              onClose={() => setSelectedOrder(null)}
              order={selectedOrder}
              onConfirmDelivery={() => handleConfirmDelivery(selectedOrder._id)}
            />
          )}
        </div>
      </main>
      <Chatbot />
      <Footer />
    </ClientLayout>
  );
};

export default OrderHistoryPage;
