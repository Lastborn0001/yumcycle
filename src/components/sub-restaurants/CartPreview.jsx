import React from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Eye, Trash2 } from "lucide-react";

const CartPreview = ({ cart, itemCount, onViewCart, onRemoveItem }) => {
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4">
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <ShoppingCart className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Your Cart</h3>
              <p className="text-orange-100 text-sm">
                {itemCount} {itemCount === 1 ? "item" : "items"}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">₦{totalPrice.toLocaleString()}</p>
            <p className="text-orange-100 text-sm">Total</p>
          </div>
        </div>
      </div>

      {/* Cart Items */}
      <div className="p-6">
        <div className="space-y-4 max-h-60 overflow-y-auto">
          {cart.slice(0, 5).map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center space-x-3">
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-10 h-10 object-cover rounded-lg"
                  />
                )}
                <div>
                  <p className="font-medium text-gray-900 text-sm">
                    {item.name}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {item.quantity || 1}x ₦{item.price.toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-gray-900 text-sm">
                  ₦{(item.price * (item.quantity || 1)).toFixed(2)}
                </span>
                {onRemoveItem && (
                  <button
                    onClick={() => onRemoveItem(index)}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                )}
              </div>
            </motion.div>
          ))}

          {cart.length > 5 && (
            <div className="text-center py-2 text-sm text-gray-500">
              +{cart.length - 5} more items
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-600">Subtotal:</span>
            <span className="font-semibold text-gray-900">
              ₦{totalPrice.toFixed(2)}
            </span>
          </div>

          {/* Action Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onViewCart}
            className="w-full flex items-center justify-center cursor-pointer space-x-2 px-6 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
          >
            <Eye className="h-5 w-5" />
            <span>View Full Cart</span>
          </motion.button>
        </div>

        {/* Quick Actions */}
        <div className="mt-4 flex space-x-3 text-xs">
          <button className="flex-1 py-2 text-gray-600 cursor-pointer hover:text-orange-600 transition-colors text-center">
            Continue Shopping
          </button>
          <button className="flex-1 py-2 text-gray-600 cursor-pointer hover:text-red-600 transition-colors text-center">
            Clear Cart
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default CartPreview;
