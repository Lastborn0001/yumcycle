"use client";
import { Clock, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useState } from "react";

export default function OrderCard({ order, onUpdateStatus }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "failed":
      case "cancelled":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    setIsUpdating(true);
    setUpdateError(null);
    try {
      await onUpdateStatus(order._id, newStatus);
    } catch (error) {
      setUpdateError(error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="rounded-lg border border-gray-300 p-6 bg-white">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">
          Order #{order._id.toString().slice(-6)}
        </h3>
        <div className="flex items-center gap-2">
          {getStatusIcon(order.status)}
          <span className="capitalize">{order.status}</span>
        </div>
      </div>
      <p className="text-sm text-gray-500 mb-2">
        Placed on: {new Date(order.createdAt).toLocaleString()}
      </p>
      <p className="text-sm text-gray-500 mb-2">
        Customer Phone: {order.phoneNumber || "Not provided"}
      </p>
      <p className="text-sm text-gray-500 mb-4">
        Delivery Address: {order.address || "Not provided"}
      </p>
      <div className="space-y-2 mb-4">
        {order.items.map((item) => (
          <div key={item._id} className="flex justify-between text-sm">
            <span>
              {item.name} x {item.quantity}
            </span>
            <span>₦{(item.price * item.quantity).toLocaleString()}</span>
          </div>
        ))}
      </div>
      <div className="flex justify-between font-semibold mb-4">
        <span>Total</span>
        <span>₦{order.total.toLocaleString()}</span>
      </div>
      {order.status === "pending" && (
        <div className="mt-4">
          {updateError && (
            <p className="text-red-500 text-sm mb-2">{updateError}</p>
          )}
          <div className="flex gap-4">
            <button
              onClick={() => handleStatusUpdate("completed")}
              disabled={isUpdating}
              className={`px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center gap-2 ${
                isUpdating ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isUpdating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Complete
                </>
              )}
            </button>
            <button
              onClick={() => handleStatusUpdate("cancelled")}
              disabled={isUpdating}
              className={`px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 flex items-center gap-2 ${
                isUpdating ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isUpdating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4" />
                  Cancel
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
