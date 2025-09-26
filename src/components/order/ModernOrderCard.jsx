import React from "react";
import { motion } from "framer-motion";
import {
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  UtensilsCrossed,
  MapPin,
  Eye,
  RefreshCw,
  Calendar,
} from "lucide-react";

const ModernOrderCard = ({ order, onTrackOrder, onReorder }) => {
  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        icon: Clock,
        color: "text-yellow-600",
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-200",
        label: "Pending",
        gradient: "from-yellow-400 to-yellow-500",
      },
      preparing: {
        icon: UtensilsCrossed,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
        label: "Preparing",
        gradient: "from-blue-400 to-blue-500",
      },
      "in-transit": {
        icon: Truck,
        color: "text-purple-600",
        bgColor: "bg-purple-50",
        borderColor: "border-purple-200",
        label: "In Transit",
        gradient: "from-purple-400 to-purple-500",
      },
      delivered: {
        icon: CheckCircle,
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
        label: "Delivered",
        gradient: "from-green-400 to-green-500",
      },
      completed: {
        icon: CheckCircle,
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
        label: "Completed",
        gradient: "from-green-400 to-green-500",
      },
      cancelled: {
        icon: XCircle,
        color: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        label: "Cancelled",
        gradient: "from-red-400 to-red-500",
      },
      failed: {
        icon: XCircle,
        color: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        label: "Failed",
        gradient: "from-red-400 to-red-500",
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
  const restaurantName = order.items[0]?.restaurantName || "Unknown Restaurant";
  const canReorder =
    order.status === "completed" || order.status === "delivered";

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={`bg-white rounded-2xl shadow-sm border ${statusConfig.borderColor} overflow-hidden hover:shadow-lg transition-all duration-200`}
    >
      {/* Header */}
      <div
        className={`${statusConfig.bgColor} px-6 py-4 border-b ${statusConfig.borderColor}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div
              className={`p-2 ${statusConfig.bgColor} rounded-lg ${statusConfig.borderColor} border`}
            >
              <StatusIcon className={`h-4 w-4 ${statusConfig.color}`} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">
                Order #{order._id.slice(-6)}
              </p>
              <div className="flex items-center space-x-2 text-xs text-gray-600">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(order.createdAt)}</span>
              </div>
            </div>
          </div>
          <div
            className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig.color} ${statusConfig.bgColor} border ${statusConfig.borderColor}`}
          >
            {statusConfig.label}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Restaurant Info */}
        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <div className="p-1 bg-gray-100 rounded">
              <UtensilsCrossed className="h-3 w-3 text-gray-600" />
            </div>
            <p className="font-medium text-gray-900 text-sm">
              {restaurantName}
            </p>
          </div>

          {order.address && (
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <MapPin className="h-3 w-3" />
              <span className="truncate">{order.address}</span>
            </div>
          )}
        </div>

        {/* Items */}
        <div className="mb-4">
          <div className="space-y-2">
            {order.items.slice(0, 2).map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center text-sm"
              >
                <div className="flex items-center space-x-2">
                  <span className="w-5 h-5 bg-orange-100 text-orange-600 rounded-full text-xs flex items-center justify-center font-medium">
                    {item.quantity}
                  </span>
                  <span className="text-gray-700 truncate">{item.name}</span>
                </div>
                <span className="font-medium text-gray-900 text-xs">
                  ₦{(item.price * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}

            {order.items.length > 2 && (
              <div className="text-xs text-gray-500 text-center py-1">
                +{order.items.length - 2} more items
              </div>
            )}
          </div>
        </div>

        {/* Total */}
        <div className="mb-6 p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-900 text-sm">
              Total Amount
            </span>
            <span className="text-lg font-bold text-gray-900">
              ₦{order.total.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onTrackOrder}
            className="w-full flex items-center cursor-pointer justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-200 font-medium"
          >
            <Eye className="h-4 w-4" />
            <span>Track Order</span>
          </motion.button>

          {canReorder && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onReorder}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 border-2 border-gray-200 text-gray-700 rounded-xl cursor-pointer hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-medium"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Reorder</span>
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ModernOrderCard;
