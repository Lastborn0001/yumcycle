import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Clock, Truck, UtensilsCrossed } from "lucide-react";

const steps = [
  {
    title: "Order Confirmed",
    icon: CheckCircle2,
    description: "Restaurant has received your order",
  },
  {
    title: "Preparing",
    icon: UtensilsCrossed,
    description: "Your food is being prepared",
  },
  {
    title: "In Transit",
    icon: Truck,
    description: "Order is on the way",
  },
  {
    title: "Delivered",
    icon: Clock,
    description: "Ready for pickup/delivered",
  },
];

const OrderTrackingModal = ({ isOpen, onClose, order, onConfirmDelivery }) => {
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="bg-white rounded-lg p-6 w-full max-w-2xl shadow-xl"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Order Tracking</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        <div className="space-y-8">
          {/* Order Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Order Summary</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <p>
                Order ID: <span className="font-medium">{order._id}</span>
              </p>
              <p>
                Total:{" "}
                <span className="font-medium">₦{order.total.toFixed(2)}</span>
              </p>
            </div>
          </div>

          {/* Tracking Steps */}
          <div className="relative">
            <div className="absolute left-[21px] top-0 h-full w-0.5 bg-gray-200" />
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const isCompleted = index <= currentStep;
              const isActive = index === currentStep;

              return (
                <div
                  key={step.title}
                  className="relative flex items-start gap-4 pb-8"
                >
                  <div
                    className={`relative z-10 flex h-11 w-11 items-center justify-center rounded-full ${
                      isCompleted ? "bg-green-600" : "bg-gray-200"
                    } ${isActive ? "ring-2 ring-green-600 ring-offset-2" : ""}`}
                  >
                    <StepIcon
                      className={`h-5 w-5 ${
                        isCompleted ? "text-white" : "text-gray-500"
                      }`}
                    />
                  </div>
                  <div className="flex flex-col">
                    <h4 className="font-medium">{step.title}</h4>
                    <p className="text-sm text-gray-500">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Confirm Delivery Button */}
          {order.status === "delivered" && (
            <div className="flex justify-end">
              <button
                onClick={onConfirmDelivery}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Confirm Receipt
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default OrderTrackingModal;
