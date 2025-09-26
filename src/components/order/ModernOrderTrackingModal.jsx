import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  CheckCircle2,
  Clock,
  Truck,
  UtensilsCrossed,
  MapPin,
  Phone,
  Calendar,
  Package,
  Star,
} from "lucide-react";

const trackingSteps = [
  {
    title: "Order Confirmed",
    icon: CheckCircle2,
    description: "Restaurant has received your order",
    status: "pending",
  },
  {
    title: "Preparing",
    icon: UtensilsCrossed,
    description: "Your food is being prepared",
    status: "preparing",
  },
  {
    title: "In Transit",
    icon: Truck,
    description: "Order is on the way",
    status: "in-transit",
  },
  {
    title: "Delivered",
    icon: Package,
    description: "Ready for pickup/delivered",
    status: "delivered",
  },
];

const ModernOrderTrackingModal = ({
  isOpen,
  onClose,
  order,
  onConfirmDelivery,
}) => {
  if (!isOpen) return null;

  const getStepStatus = (status) => {
    const statusMap = {
      pending: 0,
      preparing: 1,
      "in-transit": 2,
      delivered: 3,
      completed: 4,
    };
    return statusMap[status] || 0;
  };

  const currentStep = getStepStatus(order.status);
  const estimatedTime = order.estimatedDeliveryTime || "30-45 minutes";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="relative p-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-t-2xl">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="pr-12">
              <h2 className="text-2xl font-bold mb-2">Order Tracking</h2>
              <div className="flex items-center space-x-4 text-white/90">
                <span>Order #{order._id.slice(-6)}</span>
                <span>•</span>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-8">
            {/* Order Summary Card */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Package className="h-5 w-5" />
                <span>Order Summary</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Restaurant</p>
                    <p className="font-medium text-gray-900">
                      {order.items[0]?.restaurantName || "Unknown Restaurant"}
                    </p>
                  </div>

                  {order.address && (
                    <div>
                      <p className="text-sm text-gray-600 flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>Delivery Address</span>
                      </p>
                      <p className="font-medium text-gray-900">
                        {order.address}
                      </p>
                    </div>
                  )}

                  {order.phoneNumber && (
                    <div>
                      <p className="text-sm text-gray-600 flex items-center space-x-1">
                        <Phone className="h-3 w-3" />
                        <span>Contact</span>
                      </p>
                      <p className="font-medium text-gray-900">
                        {order.phoneNumber}
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Total Amount</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ₦{order.total.toLocaleString()}
                    </p>
                  </div>

                  {order.status !== "delivered" &&
                    order.status !== "completed" && (
                      <div>
                        <p className="text-sm text-gray-600 flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>Estimated Time</span>
                        </p>
                        <p className="font-medium text-orange-600">
                          {estimatedTime}
                        </p>
                      </div>
                    )}
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">
                Items Ordered
              </h4>
              <div className="space-y-3">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
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
                    <p className="font-semibold text-gray-900">
                      ₦{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tracking Progress */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-6">
                Order Progress
              </h4>
              <div className="relative">
                {/* Progress Line */}
                <div className="absolute left-6 top-0 h-full/90 w-0.5 bg-gray-200" />
                <div
                  className="absolute left-6 top-0 w-0.5 bg-gradient-to-b from-orange-500 to-orange-600 transition-all duration-1000"
                  style={{
                    height: `${
                      (currentStep / (trackingSteps.length - 1)) * 60
                    }%`,
                  }}
                />

                {/* Steps */}
                {trackingSteps.map((step, index) => {
                  const StepIcon = step.icon;
                  const isCompleted = index <= currentStep;
                  const isActive = index === currentStep;
                  const isCancelled =
                    order.status === "cancelled" || order.status === "failed";

                  return (
                    <motion.div
                      key={step.title}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="relative flex items-start gap-6 pb-8"
                    >
                      {/* Step Icon */}
                      <motion.div
                        animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                        transition={{
                          duration: 2,
                          repeat: isActive ? Infinity : 0,
                        }}
                        className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 ${
                          isCompleted && !isCancelled
                            ? "bg-orange-500 border-orange-500"
                            : isCancelled
                            ? "bg-red-100 border-red-300"
                            : "bg-gray-100 border-gray-300"
                        } ${
                          isActive ? "ring-4 ring-orange-200 ring-offset-2" : ""
                        }`}
                      >
                        <StepIcon
                          className={`h-5 w-5 ${
                            isCompleted && !isCancelled
                              ? "text-white"
                              : isCancelled
                              ? "text-red-500"
                              : "text-gray-500"
                          }`}
                        />
                      </motion.div>

                      {/* Step Content */}
                      <div className="flex flex-col pt-2">
                        <h4
                          className={`font-semibold ${
                            isCompleted && !isCancelled
                              ? "text-gray-900"
                              : "text-gray-600"
                          }`}
                        >
                          {step.title}
                        </h4>
                        <p className="text-sm text-gray-500 mt-1">
                          {step.description}
                        </p>

                        {isActive && !isCancelled && (
                          <div className="flex items-center space-x-2 mt-2">
                            <div className="flex space-x-1">
                              {[...Array(3)].map((_, i) => (
                                <motion.div
                                  key={i}
                                  animate={{ opacity: [0.4, 1, 0.4] }}
                                  transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    delay: i * 0.2,
                                  }}
                                  className="w-1.5 h-1.5 bg-orange-500 rounded-full"
                                />
                              ))}
                            </div>
                            <span className="text-xs text-orange-600 font-medium">
                              In Progress
                            </span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-200">
              {order.status === "delivered" && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onConfirmDelivery}
                  className="flex-1 flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 font-semibold"
                >
                  <CheckCircle2 className="h-5 w-5" />
                  <span>Confirm Receipt</span>
                </motion.button>
              )}

              {order.status === "completed" && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 flex items-center justify-center space-x-2 cursor-pointer px-6 py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-xl hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 font-semibold"
                >
                  <Star className="h-5 w-5" />
                  <span>Rate Order</span>
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ModernOrderTrackingModal;
