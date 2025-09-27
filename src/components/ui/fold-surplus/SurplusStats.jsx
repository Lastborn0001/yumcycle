import React from "react";
import { motion } from "framer-motion";
import { Package, DollarSign, Percent, Store } from "lucide-react";

const SurplusStats = ({ stats }) => {
  const statCards = [
    {
      title: "Available Items",
      value: stats.totalItems,
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      suffix: "",
    },
    {
      title: "Total Savings",
      value: Math.round(stats.totalSavings),
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      prefix: "₦",
      suffix: "",
    },
    {
      title: "Avg Discount",
      value: Math.round(stats.avgDiscount),
      icon: Percent,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      suffix: "%",
    },
    {
      title: "Partner Restaurants",
      value: stats.restaurants,
      icon: Store,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      suffix: "",
    },
  ];

  if (stats.totalItems === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
    >
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Surplus Impact
        </h3>
        <p className="text-gray-600">
          Real-time savings and environmental impact
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;

          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className={`${stat.bgColor} ${stat.borderColor} border rounded-2xl p-6 hover:shadow-lg transition-all duration-200 group`}
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`p-3 bg-white rounded-xl ${stat.color} shadow-sm group-hover:scale-110 transition-transform duration-200`}
                >
                  <Icon className="h-6 w-6" />
                </div>

                {/* Trend Indicator */}
                {stat.title === "Available Items" && stats.totalItems > 50 && (
                  <div className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                    High Availability
                  </div>
                )}
                {stat.title === "Avg Discount" && stats.avgDiscount > 50 && (
                  <div className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                    Great Deals
                  </div>
                )}
              </div>

              <div>
                <p className="text-3xl font-bold text-gray-900 mb-2">
                  {stat.prefix}
                  {stat.value.toLocaleString()}
                  {stat.suffix}
                </p>
                <p className="text-sm text-gray-600">{stat.title}</p>
              </div>

              {/* Progress Bar for Discount */}
              {stat.title === "Avg Discount" && (
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(stat.value, 100)}%` }}
                      transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                      className={`bg-gradient-to-r from-purple-400 to-purple-600 h-2 rounded-full`}
                    />
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Additional Impact Info */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-2xl font-bold text-green-600">
              {Math.round(stats.totalSavings * 0.1)}kg
            </div>
            <div className="text-sm text-gray-600">Food Waste Reduced</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {Math.round(stats.totalSavings * 0.05)}kg
            </div>
            <div className="text-sm text-gray-600">CO₂ Emissions Saved</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">
              {stats.totalItems}
            </div>
            <div className="text-sm text-gray-600">Meals Rescued</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SurplusStats;
