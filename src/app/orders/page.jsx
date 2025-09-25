"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/libs/AuthContext";
import ClientLayout from "@/app/ClientLayout";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import { Toaster, toast } from "react-hot-toast";
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  UtensilsCrossed,
} from "lucide-react";
import Chatbot from "@/components/Chatbot";
import Loading from "@/components/ui/Loading";
import OrderTrackingModal from "@/components/ui/OrderTrackingModal";
import { motion } from "framer-motion";

const OrderHistoryPage = () => {
  const router = useRouter();
  const { firebaseUser, loading } = useAuth();
  const hasRedirected = useRef(false);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

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
      fetchOrders();
      setSelectedOrder(null);
    } catch (err) {
      console.error("Confirm delivery error:", err);
      toast.error(err.message);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "preparing":
        return <UtensilsCrossed className="h-5 w-5 text-blue-500" />;
      case "in-transit":
        return <Truck className="h-5 w-5 text-purple-500" />;
      case "delivered":
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "failed":
      case "cancelled":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  if (loading || isLoading) {
    return (
      <ClientLayout>
        <Nav />
        <main className="lg:w-[80%] p-5 w-full m-auto">
          <Loading />
        </main>
        <Footer />
      </ClientLayout>
    );
  }

  if (error) {
    return (
      <ClientLayout>
        <Nav />
        <main className="lg:w-[80%] p-5 pt-28 w-full m-auto">
          <div className="py-12 text-center text-red-500">{error}</div>
        </main>
        <Footer />
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <Nav />
      <Toaster position="top-right" />
      <main className="lg:w-[80%] p-5 pt-26 w-full m-auto min-h-screen">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">My Orders</h1>

          {orders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">
                No orders
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                You haven't placed any orders yet.
              </p>
              <button
                onClick={() => router.push("/restaurants")}
                className="mt-6 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Browse Restaurants
              </button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {orders.map((order) => (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-lg mb-1">
                          Order #{order._id.slice(-6)}
                        </h3>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          order.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : order.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : order.status === "preparing"
                            ? "bg-blue-100 text-blue-800"
                            : order.status === "in-transit"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <p className="text-sm text-gray-600">
                        Restaurant:{" "}
                        {order.items[0]?.restaurantName || "Unknown"}
                      </p>
                      {order.items.map((item, index) => (
                        <div key={index} className="text-sm text-gray-600">
                          {item.quantity}x {item.name}
                        </div>
                      ))}
                      <p className="text-sm font-medium mt-2">
                        Total: ₦{order.total.toLocaleString()}
                      </p>
                    </div>

                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="w-full bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      Track Order
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

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
