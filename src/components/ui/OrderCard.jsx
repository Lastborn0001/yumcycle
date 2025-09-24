import React, { useState } from "react";
import {
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  Phone,
  MapPin,
  ShoppingBag,
  DollarSign,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import { motion } from "framer-motion";

export default function OrderCard({ order, onUpdateStatus }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState(null);

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        icon: Clock,
        color: "text-amber-600",
        bgColor: "bg-amber-50",
        borderColor: "border-amber-200",
        label: "Pending",
        gradient: "from-amber-400 to-amber-500",
      },
      completed: {
        icon: CheckCircle,
        color: "text-emerald-600",
        bgColor: "bg-emerald-50",
        borderColor: "border-emerald-200",
        label: "Completed",
        gradient: "from-emerald-400 to-emerald-500",
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
        icon: AlertTriangle,
        color: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        label: "Failed",
        gradient: "from-red-400 to-red-500",
      },
    };
    return configs[status] || configs.pending;
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
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className={`bg-white rounded-2xl shadow-sm border ${statusConfig.borderColor} overflow-hidden hover:shadow-lg transition-all duration-200`}
    >
      {/* Header with Status */}
      <div
        className={`${statusConfig.bgColor} px-6 py-4 border-b ${statusConfig.borderColor}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div
              className={`p-2 ${statusConfig.bgColor} rounded-xl ${statusConfig.borderColor} border`}
            >
              <StatusIcon className={`h-5 w-5 ${statusConfig.color}`} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Order #{order._id.toString().slice(-6)}
              </h3>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(order.createdAt)}</span>
              </div>
            </div>
          </div>
          <div
            className={`px-3 py-1 rounded-full text-sm font-medium ${statusConfig.color} ${statusConfig.bgColor} border ${statusConfig.borderColor}`}
          >
            {statusConfig.label}
          </div>
        </div>
      </div>

      {/* Order Content */}
      <div className="p-6">
        {/* Customer Information */}
        <div className="mb-6 space-y-3">
          <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
            Customer Details
          </h4>
          <div className="grid grid-cols-1 gap-3">
            {order.phoneNumber && (
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Phone className="h-4 w-4 text-blue-600" />
                </div>
                <span>{order.phoneNumber}</span>
              </div>
            )}
            {order.address && (
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <div className="p-2 bg-green-50 rounded-lg">
                  <MapPin className="h-4 w-4 text-green-600" />
                </div>
                <span className="line-clamp-2">{order.address}</span>
              </div>
            )}
          </div>
        </div>

        {/* Order Items */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
            Order Items
          </h4>
          <div className="bg-gray-50 rounded-xl p-4 space-y-3">
            {order.items.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <span className="text-orange-600 font-semibold text-sm">
                      {item.quantity}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      ₦{item.price.toLocaleString()} each
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    ₦{(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Total */}
        <div className="mb-6 p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl border border-orange-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-orange-600" />
              <span className="font-semibold text-gray-900">Total Amount</span>
            </div>
            <span className="text-2xl font-bold text-orange-600">
              ₦{order.total.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Error Display */}
        {updateError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl"
          >
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <p className="text-red-700 text-sm">{updateError}</p>
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        {order.status === "pending" && (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
              Quick Actions
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleStatusUpdate("completed")}
                disabled={isUpdating}
                className={`flex items-center justify-center space-x-3 px-4 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 font-medium ${
                  isUpdating
                    ? "opacity-70 cursor-not-allowed"
                    : "hover:shadow-lg"
                }`}
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    <span>Mark Complete</span>
                  </>
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleStatusUpdate("cancelled")}
                disabled={isUpdating}
                className={`flex items-center justify-center space-x-3 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 font-medium ${
                  isUpdating
                    ? "opacity-70 cursor-not-allowed"
                    : "hover:shadow-lg"
                }`}
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4" />
                    <span>Cancel Order</span>
                  </>
                )}
              </motion.button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
