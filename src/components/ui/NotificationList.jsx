import React from "react";
import {
  Bell,
  Clock,
  ShoppingBag,
  DollarSign,
  MapPin,
  Phone,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const NotificationList = ({ notifications = [], onMarkAsRead }) => {
  const getNotificationIcon = (type) => {
    switch (type) {
      case "order":
        return ShoppingBag;
      case "payment":
        return DollarSign;
      default:
        return Bell;
    }
  };

  const getNotificationColor = (read) => {
    return read
      ? { bg: "bg-gray-50", border: "border-gray-200", accent: "text-gray-400" }
      : {
          bg: "bg-white",
          border: "border-orange-200",
          accent: "text-orange-500",
        };
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
        <div className="text-sm text-gray-500">
          {notifications.filter((n) => !n.read).length} unread
        </div>
      </div>

      {notifications.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100"
        >
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bell className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No notifications yet
          </h3>
          <p className="text-gray-500">
            You'll see notifications about new orders here
          </p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {notifications.map((notification, index) => {
              const colors = getNotificationColor(notification.read);
              const IconComponent = getNotificationIcon(notification.type);

              return (
                <motion.div
                  key={notification._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`${colors.bg} ${colors.border} border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 group relative overflow-hidden`}
                >
                  {/* Unread indicator */}
                  {!notification.read && (
                    <div className="absolute top-4 right-4 w-3 h-3 bg-orange-500 rounded-full"></div>
                  )}

                  <div className="flex items-start space-x-4">
                    {/* Icon */}
                    <div
                      className={`p-3 rounded-xl ${
                        notification.read ? "bg-gray-100" : "bg-orange-50"
                      } flex-shrink-0`}
                    >
                      <IconComponent className={`h-5 w-5 ${colors.accent}`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 text-sm">
                          New Order Notification
                        </h3>
                        <span className="text-xs text-gray-500 flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{formatDate(notification.createdAt)}</span>
                        </span>
                      </div>

                      {/* Message */}
                      <p className="text-gray-700 mb-3 leading-relaxed">
                        {notification.message}
                      </p>

                      {/* Order Details Card */}
                      {notification.orderDetails && (
                        <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-4 border border-gray-100">
                          {/* Order Header */}
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium text-gray-900">
                                Order #{notification.orderId.slice(-6)}
                              </span>
                              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                New
                              </span>
                            </div>
                            <span className="text-sm text-gray-500">
                              {formatDate(notification.orderDetails.createdAt)}
                            </span>
                          </div>

                          {/* Customer Info */}
                          {(notification.orderDetails.phoneNumber ||
                            notification.orderDetails.address) && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 text-sm">
                              {notification.orderDetails.phoneNumber && (
                                <div className="flex items-center space-x-2 text-gray-600">
                                  <Phone className="h-4 w-4" />
                                  <span>
                                    {notification.orderDetails.phoneNumber}
                                  </span>
                                </div>
                              )}
                              {notification.orderDetails.address && (
                                <div className="flex items-center space-x-2 text-gray-600">
                                  <MapPin className="h-4 w-4" />
                                  <span className="truncate">
                                    {notification.orderDetails.address}
                                  </span>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Order Items */}
                          <div className="space-y-2 mb-4">
                            {notification.orderDetails.items.map(
                              (item, idx) => (
                                <div
                                  key={idx}
                                  className="flex justify-between items-center text-sm"
                                >
                                  <div className="flex items-center space-x-2">
                                    <span className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full text-xs flex items-center justify-center font-medium">
                                      {item.quantity}
                                    </span>
                                    <span className="text-gray-700">
                                      {item.name}
                                    </span>
                                  </div>
                                  <span className="font-medium text-gray-900">
                                    ₦
                                    {(
                                      item.price * item.quantity
                                    ).toLocaleString()}
                                  </span>
                                </div>
                              )
                            )}
                          </div>

                          {/* Total */}
                          <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                            <span className="font-semibold text-gray-900">
                              Total Amount
                            </span>
                            <span className="text-lg font-bold text-orange-600">
                              ₦
                              {notification.orderDetails.total?.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center space-x-3">
                          {!notification.read && (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => onMarkAsRead(notification._id)}
                              className="flex cursor-pointer items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                              <span>Mark as Read</span>
                            </motion.button>
                          )}
                        </div>

                        {notification.read && (
                          <div className="flex items-center space-x-1 text-green-600 text-sm">
                            <CheckCircle2 className="h-4 w-4" />
                            <span>Read</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default NotificationList;
