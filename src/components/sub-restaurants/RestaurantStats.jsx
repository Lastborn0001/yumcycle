import React from "react";
import { motion } from "framer-motion";
import { Utensils, Tag, DollarSign, Percent } from "lucide-react";

const RestaurantStats = ({ stats }) => {
  const statItems = [
    {
      icon: Utensils,
      title: "Menu Items",
      value: stats.totalItems,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      icon: Tag,
      title: "Categories",
      value: stats.categories,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    {
      icon: DollarSign,
      title: "Avg Price",
      value: `₦${stats.avgPrice.toFixed(0)}`,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
    },
    {
      icon: Percent,
      title: "Surplus Items",
      value: stats.surplusItems,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
    >
      <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Stats</h3>

      <div className="space-y-4">
        {statItems.map((stat, index) => {
          const Icon = stat.icon;

          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className={`${stat.bgColor} rounded-xl p-4 border ${stat.borderColor} hover:shadow-md transition-all duration-200`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 bg-white rounded-lg ${stat.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="font-medium text-gray-900">
                    {stat.title}
                  </span>
                </div>
                <span className={`text-2xl font-bold ${stat.color}`}>
                  {stat.value}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Additional Info */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-3">Menu Highlights</h4>
        <div className="space-y-2 text-sm">
          {stats.surplusItems > 0 && (
            <div className="flex items-center justify-between p-2 bg-red-50 rounded-lg">
              <span className="text-red-700">Surplus Deals</span>
              <span className="font-medium text-red-600">
                {stats.surplusItems} available
              </span>
            </div>
          )}

          <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
            <span className="text-gray-700">Price Range</span>
            <span className="font-medium text-gray-600">₦200 - ₦2,000</span>
          </div>

          {stats.totalItems > 10 && (
            <div className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
              <span className="text-blue-700">Large Menu</span>
              <span className="font-medium text-blue-600">Many options</span>
            </div>
          )}
        </div>
      </div>

      {/* Progress Indicators */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-3">Menu Distribution</h4>

        {stats.surplusItems > 0 && (
          <div className="mb-3">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Surplus Items</span>
              <span>
                {Math.round((stats.surplusItems / stats.totalItems) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${(stats.surplusItems / stats.totalItems) * 100}%`,
                }}
                transition={{ duration: 1, delay: 0.5 }}
                className="bg-gradient-to-r from-orange-400 to-orange-500 h-2 rounded-full"
              />
            </div>
          </div>
        )}

        <div className="mb-3">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Menu Variety</span>
            <span>{stats.categories} categories</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${Math.min((stats.categories / 4) * 100, 100)}%`,
              }}
              transition={{ duration: 1, delay: 0.7 }}
              className="bg-gradient-to-r from-blue-400 to-blue-500 h-2 rounded-full"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RestaurantStats;
