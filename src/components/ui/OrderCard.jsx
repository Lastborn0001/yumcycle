import React from "react";
import {
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  UtensilsCrossed,
} from "lucide-react";
import { motion } from "framer-motion";

export default function OrderCard({ order, onUpdateStatus, onClick }) {
  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        icon: Clock,
        color: "text-yellow-600",
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-200",
        label: "Pending",
      },
      preparing: {
        icon: UtensilsCrossed,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
        label: "Preparing",
      },
      "in-transit": {
        icon: Truck,
        color: "text-purple-600",
        bgColor: "bg-purple-50",
        borderColor: "border-purple-200",
        label: "In Transit",
      },
      delivered: {
        icon: CheckCircle,
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
        label: "Delivered",
      },
      completed: {
        icon: CheckCircle,
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
        label: "Completed",
      },
      cancelled: {
        icon: XCircle,
        color: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        label: "Cancelled",
      },
    };
    return configs[status] || configs.pending;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const statusConfig = getStatusConfig(order.status);
  const StatusIcon = statusConfig.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-semibold text-lg mb-1">
              Order #{order._id.slice(-6)}
            </h3>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {formatDate(order.createdAt)}
            </p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-sm flex items-center gap-2 ${statusConfig.bgColor} ${statusConfig.color}`}
          >
            <StatusIcon className="h-4 w-4" />
            <span>{statusConfig.label}</span>
          </span>
        </div>

        <div className="space-y-2 mb-4">
          <p className="text-sm text-gray-600">Customer: {order.phoneNumber}</p>
          <p className="text-sm text-gray-600 line-clamp-1">
            Address: {order.address}
          </p>
          <div className="border-t pt-2 mt-2">
            {order.items.map((item, index) => (
              <div key={index} className="text-sm text-gray-600">
                {item.quantity}x {item.name}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <span className="text-sm font-medium">Total</span>
          <span className="font-semibold">₦{order.total.toLocaleString()}</span>
        </div>
      </div>
    </motion.div>
  );
}
