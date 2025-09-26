import React from "react";
import { motion } from "framer-motion";
import { ShoppingBag, Search, Utensils } from "lucide-react";

const EmptyOrdersState = ({ onBrowseRestaurants }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center"
    >
      {/* Animated Icons */}
      <div className="relative mb-8">
        <motion.div
          animate={{
            rotate: [0, -10, 10, -10, 0],
            scale: [1, 1.1, 1, 1.1, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: "loop",
          }}
          className="w-24 h-24 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <ShoppingBag className="h-12 w-12 text-orange-600" />
        </motion.div>

        {/* Floating decorative elements */}
        <motion.div
          animate={{
            y: [-5, 5, -5],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: "loop",
          }}
          className="absolute top-0 right-1/4 w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center"
        >
          <Utensils className="h-4 w-4 text-yellow-600" />
        </motion.div>

        <motion.div
          animate={{
            y: [5, -5, 5],
            x: [-2, 2, -2],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: "loop",
          }}
          className="absolute top-4 left-1/4 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center"
        >
          <Search className="h-3 w-3 text-green-600" />
        </motion.div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto">
        <h3 className="text-2xl font-bold text-gray-900 mb-3">No Orders Yet</h3>
        <p className="text-gray-600 mb-8 leading-relaxed">
          You haven't placed any orders yet. Explore our amazing restaurants and
          discover delicious meals waiting for you!
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBrowseRestaurants}
            className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 cursor-pointer text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
          >
            Browse Restaurants
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 border-2 border-gray-200 cursor-pointer text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-semibold"
          >
            View Menu
          </motion.button>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 pt-8 border-t border-gray-100">
        <div className="text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Search className="h-6 w-6 text-blue-600" />
          </div>
          <h4 className="font-semibold text-gray-900 mb-2">Easy Discovery</h4>
          <p className="text-sm text-gray-600">
            Find restaurants and dishes you'll love
          </p>
        </div>

        <div className="text-center">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <ShoppingBag className="h-6 w-6 text-green-600" />
          </div>
          <h4 className="font-semibold text-gray-900 mb-2">Quick Ordering</h4>
          <p className="text-sm text-gray-600">
            Simple and fast checkout process
          </p>
        </div>

        <div className="text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Utensils className="h-6 w-6 text-purple-600" />
          </div>
          <h4 className="font-semibold text-gray-900 mb-2">Quality Food</h4>
          <p className="text-sm text-gray-600">
            Fresh meals from top restaurants
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default EmptyOrdersState;
