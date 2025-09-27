import React from "react";
import { motion } from "framer-motion";
import { Filter, RotateCcw, Search } from "lucide-react";

const SurplusFilters = ({
  filters,
  onFiltersChange,
  restaurants,
  categories,
  resultCount,
}) => {
  const sortOptions = [
    { value: "discount", label: "Highest Discount" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "name", label: "Name A-Z" },
  ];

  const priceRanges = [
    { value: "all", label: "All Prices" },
    { value: "0-500", label: "₦0 - ₦500" },
    { value: "500-1000", label: "₦500 - ₦1,000" },
    { value: "1000-2000", label: "₦1,000 - ₦2,000" },
    { value: "2000-999999", label: "₦2,000+" },
  ];

  const hasActiveFilters =
    filters.restaurant !== "all" ||
    filters.category !== "all" ||
    filters.priceRange !== "all" ||
    filters.sortBy !== "discount";

  const clearAllFilters = () => {
    onFiltersChange({
      restaurant: "all",
      category: "all",
      priceRange: "all",
      sortBy: "discount",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <Filter className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Filter Surplus Items
            </h3>
            <p className="text-sm text-gray-500">
              {resultCount} {resultCount === 1 ? "item" : "items"} found
            </p>
          </div>
        </div>

        {hasActiveFilters && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={clearAllFilters}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors text-sm font-medium"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Clear All</span>
          </motion.button>
        )}
      </div>

      {/* Filters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Restaurant Filter */}
        {restaurants.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Restaurant
            </label>
            <select
              value={filters.restaurant}
              onChange={(e) =>
                onFiltersChange({ ...filters, restaurant: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-sm"
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

        {/* Category Filter */}
        {categories.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={filters.category}
              onChange={(e) =>
                onFiltersChange({ ...filters, category: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-sm"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Price Range Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price Range
          </label>
          <select
            value={filters.priceRange}
            onChange={(e) =>
              onFiltersChange({ ...filters, priceRange: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-sm"
          >
            {priceRanges.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort By */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sort By
          </label>
          <select
            value={filters.sortBy}
            onChange={(e) =>
              onFiltersChange({ ...filters, sortBy: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-sm"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-6 pt-4 border-t border-gray-200"
        >
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm font-medium text-gray-700">
              Active filters:
            </span>
            {filters.restaurant !== "all" && (
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                Restaurant: {filters.restaurant}
              </span>
            )}
            {filters.category !== "all" && (
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                Category: {filters.category}
              </span>
            )}
            {filters.priceRange !== "all" && (
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                Price:{" "}
                {priceRanges.find((r) => r.value === filters.priceRange)?.label}
              </span>
            )}
            {filters.sortBy !== "discount" && (
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                Sort:{" "}
                {sortOptions.find((s) => s.value === filters.sortBy)?.label}
              </span>
            )}
          </div>
        </motion.div>
      )}

      {/* Quick Filter Buttons */}
      <div className="mt-6">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => onFiltersChange({ ...filters, sortBy: "discount" })}
            className={`px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors ${
              filters.sortBy === "discount"
                ? "bg-red-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            🔥 Best Deals
          </button>
          <button
            onClick={() => onFiltersChange({ ...filters, priceRange: "0-500" })}
            className={`px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors ${
              filters.priceRange === "0-500"
                ? "bg-green-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            💰 Budget Friendly
          </button>
          <button
            onClick={() => onFiltersChange({ ...filters, sortBy: "name" })}
            className={`px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors ${
              filters.sortBy === "name"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            🔤 A to Z
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default SurplusFilters;
