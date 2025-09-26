import React from "react";
import { motion } from "framer-motion";
import { Filter, RotateCcw } from "lucide-react";

const OrderFilters = ({
  filters,
  onFiltersChange,
  restaurants,
  resultCount,
}) => {
  const statusOptions = [
    { value: "all", label: "All Status", count: null },
    {
      value: "pending",
      label: "Pending",
      color: "bg-yellow-100 text-yellow-800",
    },
    {
      value: "preparing",
      label: "Preparing",
      color: "bg-blue-100 text-blue-800",
    },
    {
      value: "in-transit",
      label: "In Transit",
      color: "bg-purple-100 text-purple-800",
    },
    {
      value: "delivered",
      label: "Delivered",
      color: "bg-green-100 text-green-800",
    },
    {
      value: "completed",
      label: "Completed",
      color: "bg-green-100 text-green-800",
    },
    {
      value: "cancelled",
      label: "Cancelled",
      color: "bg-red-100 text-red-800",
    },
  ];

  const timeRangeOptions = [
    { value: "all", label: "All Time" },
    { value: "today", label: "Today" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
  ];

  const hasActiveFilters =
    filters.status !== "all" ||
    filters.timeRange !== "all" ||
    filters.restaurant !== "all";

  const clearAllFilters = () => {
    onFiltersChange({
      status: "all",
      timeRange: "all",
      restaurant: "all",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gray-100 rounded-lg">
            <Filter className="h-5 w-5 text-gray-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Filter Orders
            </h3>
            <p className="text-sm text-gray-500">
              {resultCount} {resultCount === 1 ? "order" : "orders"} found
            </p>
          </div>
        </div>

        {hasActiveFilters && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={clearAllFilters}
            className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors text-sm"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Clear All</span>
          </motion.button>
        )}
      </div>

      {/* Filter Options */}
      <div className="space-y-6">
        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Order Status
          </label>
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((option) => (
              <motion.button
                key={option.value}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() =>
                  onFiltersChange({ ...filters, status: option.value })
                }
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  filters.status === option.value
                    ? "bg-orange-500 text-white shadow-md"
                    : option.color ||
                      "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {option.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Time Range and Restaurant Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Time Range Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Time Period
            </label>
            <select
              value={filters.timeRange}
              onChange={(e) =>
                onFiltersChange({ ...filters, timeRange: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white transition-all duration-200"
            >
              {timeRangeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Restaurant Filter */}
          {restaurants.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Restaurant
              </label>
              <select
                value={filters.restaurant}
                onChange={(e) =>
                  onFiltersChange({ ...filters, restaurant: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white transition-all duration-200"
              >
                <option value="all">All Restaurants</option>
                {restaurants.map((restaurant) => (
                  <option key={restaurant} value={restaurant}>
                    {restaurant}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-6 pt-4 border-t border-gray-200"
        >
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-500">Active filters:</span>
            {filters.status !== "all" && (
              <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                Status:{" "}
                {statusOptions.find((o) => o.value === filters.status)?.label}
              </span>
            )}
            {filters.timeRange !== "all" && (
              <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                Time:{" "}
                {
                  timeRangeOptions.find((o) => o.value === filters.timeRange)
                    ?.label
                }
              </span>
            )}
            {filters.restaurant !== "all" && (
              <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                Restaurant: {filters.restaurant}
              </span>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default OrderFilters;
