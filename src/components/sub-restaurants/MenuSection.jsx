import React from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Tag, Percent } from "lucide-react";

const MenuSection = ({
  menuItems,
  categories,
  selectedCategory,
  onCategoryChange,
  onAddToCart,
  restaurantName,
}) => {
  const MenuItem = ({ item, index }) => {
    const effectivePrice =
      item.isSurplus && item.surplusPrice
        ? item.surplusPrice
        : item.originalPrice ?? item.price ?? 0;

    const originalPrice = item.originalPrice ?? item.price ?? 0;
    const discountPercentage =
      item.isSurplus && item.surplusPrice
        ? Math.round(
            ((originalPrice - item.surplusPrice) / originalPrice) * 100
          )
        : 0;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        whileHover={{ y: -5 }}
        className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300"
      >
        {/* Image Section */}
        <div className="relative overflow-hidden h-48">
          <img
            src={item.image || "/placeholder-food.jpg"}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Category Badge */}
          <div className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700 border border-white/50">
            {item.category || "Other"}
          </div>

          {/* Surplus Badge */}
          {item.isSurplus && (
            <div className="absolute top-3 right-3 px-3 py-1 bg-red-500 text-white rounded-full text-xs font-bold flex items-center space-x-1">
              <Percent className="h-3 w-3" />
              <span>{discountPercentage}% OFF</span>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-6">
          {/* Item Name and Description */}
          <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
              {item.name}
            </h3>
            {item.description && (
              <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                {item.description}
              </p>
            )}
          </div>

          {/* Price Section */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              {item.isSurplus && item.surplusPrice ? (
                <div className="flex items-center space-x-2">
                  <span className="text-xl font-bold text-red-600">
                    ₦{item.surplusPrice.toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-500 line-through">
                    ₦{originalPrice.toFixed(2)}
                  </span>
                </div>
              ) : (
                <span className="text-xl font-bold text-gray-900">
                  ₦{effectivePrice.toFixed(2)}
                </span>
              )}
            </div>

            {item.isSurplus && (
              <div className="px-2 py-1 bg-red-50 text-red-600 rounded-lg text-xs font-medium">
                Surplus Deal
              </div>
            )}
          </div>

          {/* Add to Cart Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onAddToCart(item)}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 cursor-pointer text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-200 font-semibold group-hover:shadow-lg"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>Add to Cart</span>
          </motion.button>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Our Menu</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover delicious dishes crafted with care at {restaurantName}. From
          fresh ingredients to bold flavors, every meal is a culinary
          experience.
        </p>
      </motion.div>

      {/* Category Filters */}
      {categories.length > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <Tag className="h-5 w-5" />
            <span>Filter by Category</span>
          </h3>

          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <motion.button
                key={category}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onCategoryChange(category)}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white cursor-pointer shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category === "all" ? "All Items" : category}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Menu Items Grid */}
      {menuItems.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center"
        >
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Tag className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No items in this category
          </h3>
          <p className="text-gray-500 mb-4">
            Try selecting a different category or view all items
          </p>
          <button
            onClick={() => onCategoryChange("all")}
            className="px-6 py-3 bg-orange-500 cursor-pointer text-white rounded-xl hover:bg-orange-600 transition-colors"
          >
            View All Items
          </button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {menuItems.map((item, index) => (
            <MenuItem key={item._id} item={item} index={index} />
          ))}
        </motion.div>
      )}

      {/* Menu Summary */}
      {menuItems.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200 text-center"
        >
          <h4 className="font-semibold text-orange-900 mb-2">
            {selectedCategory === "all"
              ? `${menuItems.length} delicious items available`
              : `${menuItems.length} items in ${selectedCategory} category`}
          </h4>
          <p className="text-orange-700 text-sm">
            Can't decide? All our dishes are prepared fresh with quality
            ingredients!
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default MenuSection;
