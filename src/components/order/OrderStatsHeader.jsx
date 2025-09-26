import React from "react";
import { motion } from "framer-motion";
import { ShoppingBag, CheckCircle, Clock, DollarSign } from "lucide-react";

const OrderStatsHeader = ({ stats }) => {
  const statCards = [
    {
      title: "Total Orders",
      value: stats.total,
      icon: ShoppingBag,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
    },
    {
      title: "Completed",
      value: stats.completed,
      icon: CheckCircle,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      textColor: "text-green-700",
    },
    {
      title: "In Progress",
      value: stats.pending,
      icon: Clock,
      color: "from-yellow-500 to-yellow-600",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-700",
    },
    {
      title: "Total Spent",
      value: `₦${stats.totalSpent.toLocaleString()}`,
      icon: DollarSign,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-700",
    },
  ];

  return (
    <div className="mb-8">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-2">My Orders</h1>
        <p className="text-gray-600">
          Track and manage all your food orders in one place
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;

          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ y: -2 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.textColor}`} />
                </div>
                <div
                  className={`px-2 py-1 rounded-full text-xs font-medium ${stat.bgColor} ${stat.textColor}`}
                >
                  {stat.title === "Total Spent" ? "Lifetime" : "All Time"}
                </div>
              </div>

              <div>
                <p className="text-2xl font-bold text-gray-900 mb-1">
                  {typeof stat.value === "number"
                    ? stat.value.toLocaleString()
                    : stat.value}
                </p>
                <p className="text-sm text-gray-500">{stat.title}</p>
              </div>

              {/* Progress indicator for completed orders */}
              {stat.title === "Completed" && stats.total > 0 && (
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Success Rate</span>
                    <span>
                      {Math.round((stats.completed / stats.total) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${(stats.completed / stats.total) * 100}%`,
                      }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className={`bg-gradient-to-r ${stat.color} h-2 rounded-full`}
                    />
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderStatsHeader;
