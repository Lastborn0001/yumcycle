import React from "react";
import { motion } from "framer-motion";
import { ShoppingCart, MapPin, Clock, Percent, Star } from "lucide-react";

const SurplusItemCard = ({ item, onAddToCart }) => {
  const originalPrice = item.originalPrice ?? item.price ?? 0;
  const surplusPrice = item.surplusPrice ?? item.price ?? 0;
  const discountPercentage = Math.round(
    ((originalPrice - surplusPrice) / originalPrice) * 100
  );
  const savings = originalPrice - surplusPrice;

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      className="group bg-white rounded-2xl w-full max-w-[400px] shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      {/* Image Section */}
      <div className="relative overflow-hidden h-48">
        <img
          src={item.image || "/placeholder-food.jpg"}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Discount Badge */}
        <div className="absolute top-3 right-3 px-3 py-1 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full text-sm font-bold flex items-center space-x-1 shadow-lg">
          <Percent className="h-3 w-3" />
          <span>{discountPercentage}% OFF</span>
        </div>

        {/* Category Badge */}
        <div className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700 border border-white/50">
          {item.category || "Food"}
        </div>

        {/* Urgency Indicator */}
        <div className="absolute bottom-3 left-3 flex items-center space-x-1 px-2 py-1 bg-orange-500/90 backdrop-blur-sm text-white rounded-lg text-xs font-medium">
          <Clock className="h-3 w-3" />
          <span>Limited Time</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Item Header */}
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors line-clamp-1">
            {item.name}
          </h3>

          {/* Restaurant Info */}
          <div className="flex items-center space-x-1 text-sm text-gray-600 mb-2">
            <MapPin className="h-3 w-3" />
            <span className="truncate">
              {item.restaurantName || "Unknown Restaurant"}
            </span>
          </div>

          {/* Description */}
          {item.description && (
            <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
              {item.description}
            </p>
          )}
        </div>

        {/* Pricing Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-green-600">
                ₦{surplusPrice.toFixed(2)}
              </span>
              <span className="text-sm text-gray-500 line-through">
                ₦{originalPrice.toFixed(2)}
              </span>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold text-green-700">
                Save ₦{savings.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Savings Highlight */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-1 text-green-700">
                <Star className="h-4 w-4 fill-current" />
                <span className="font-medium">Great Deal!</span>
              </div>
              <span className="text-green-800 font-semibold">
                {discountPercentage}% discount
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onAddToCart}
          className="w-full flex items-center cursor-pointer justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl group"
        >
          <ShoppingCart className="h-5 w-5 group-hover:scale-110 transition-transform" />
          <span>Add to Cart</span>
        </motion.button>

        {/* Additional Info */}
        <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
          <span>Surplus item - Limited quantity</span>
          <span>Fresh & ready</span>
        </div>
      </div>
    </motion.div>
  );
};

export default SurplusItemCard;
