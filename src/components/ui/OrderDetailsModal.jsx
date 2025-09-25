import { motion } from "framer-motion";
import OrderStatusManager from "./OrderStatusManager";
import { X } from "lucide-react";

export default function OrderDetailsModal({ order, onClose, onStatusChange }) {
  if (!order) return null;

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
        className="bg-white rounded-lg w-full max-w-2xl shadow-xl"
      >
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">Order Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Order Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Order ID</p>
              <p className="font-medium">#{order._id.slice(-6)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date</p>
              <p className="font-medium">
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Customer Phone</p>
              <p className="font-medium">{order.phoneNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Delivery Address</p>
              <p className="font-medium">{order.address}</p>
            </div>
          </div>

          {/* Order Status */}
          <div className="py-4">
            <h3 className="text-sm font-medium mb-4">Order Status</h3>
            <OrderStatusManager
              currentStatus={order.status}
              onStatusChange={onStatusChange}
            />
          </div>

          {/* Order Items */}
          <div>
            <h3 className="text-sm font-medium mb-4">Order Items</h3>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center py-2 border-b last:border-0"
                >
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <p className="font-medium">
                    ₦{(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-medium">
                  ₦{order.subtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Delivery Fee</span>
                <span className="font-medium">
                  ₦{order.deliveryFee.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Service Fee</span>
                <span className="font-medium">
                  ₦{order.serviceFee.toLocaleString()}
                </span>
              </div>
              {order.tip > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Tip</span>
                  <span className="font-medium">
                    ₦{order.tip.toLocaleString()}
                  </span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t">
                <span className="font-medium">Total</span>
                <span className="font-bold">
                  ₦{order.total.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
