import React, { useState } from "react";
import {
  Edit2,
  Trash2,
  DollarSign,
  Tag,
  FileText,
  X,
  Save,
  AlertTriangle,
  CheckCircle,
  Utensils,
  Upload,
  ImageIcon,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { getAuth } from "firebase/auth";
import { motion, AnimatePresence } from "framer-motion";

const MenuItemList = ({ items = [], restaurantId, app, refreshMenuItems }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    originalPrice: "",
    surplusPrice: "",
    isSurplus: false,
    category: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [updating, setUpdating] = useState(false);

  const categories = [
    { value: "Main", label: "Main Course", icon: "🍽️" },
    { value: "Side", label: "Side Dish", icon: "🥗" },
    { value: "Drink", label: "Beverage", icon: "🥤" },
    { value: "Dessert", label: "Dessert", icon: "🍰" },
  ];

  const getCategoryInfo = (category) => {
    return categories.find((cat) => cat.value === category) || categories[0];
  };

  const handleDelete = async (itemId) => {
    if (!confirm("Are you sure you want to delete this menu item?")) return;

    try {
      const response = await fetch(`/api/restaurants/menu?itemId=${itemId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${await getAuth(
            app
          ).currentUser.getIdToken()}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete menu item");
      }

      toast.success("Menu item deleted successfully");
      if (refreshMenuItems) await refreshMenuItems();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleEditClick = (item) => {
    setCurrentItem(item);
    setFormData({
      name: item.name,
      description: item.description || "",
      originalPrice: item.originalPrice.toString(),
      surplusPrice: item.surplusPrice ? item.surplusPrice.toString() : "",
      isSurplus: item.isSurplus || false,
      category: item.category,
      image: null,
    });
    setImagePreview(item.image || null);
    setIsEditing(true);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "file" && files[0]) {
      const file = files[0];
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }

      setFormData((prev) => ({ ...prev, [name]: file }));

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (
      formData.isSurplus &&
      (!formData.surplusPrice ||
        parseFloat(formData.surplusPrice) >= parseFloat(formData.originalPrice))
    ) {
      toast.error(
        "Surplus price must be lower than original price and non-zero"
      );
      return;
    }

    setUpdating(true);

    try {
      const data = new FormData();
      data.append("itemId", currentItem._id);
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("originalPrice", formData.originalPrice);
      data.append(
        "surplusPrice",
        formData.isSurplus ? formData.surplusPrice : ""
      );
      data.append("isSurplus", formData.isSurplus.toString());
      data.append("category", formData.category);
      if (formData.image) data.append("image", formData.image);

      const response = await fetch("/api/restaurants/menu", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${await getAuth(
            app
          ).currentUser.getIdToken()}`,
        },
        body: data,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update menu item");
      }

      toast.success("Menu item updated successfully");
      setIsEditing(false);
      setCurrentItem(null);
      setImagePreview(null);
      if (refreshMenuItems) await refreshMenuItems();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUpdating(false);
    }
  };

  if (!items || items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100"
      >
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Utensils className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No menu items yet
        </h3>
        <p className="text-gray-500">
          Start adding delicious items to your menu
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Menu Items</h2>
        <div className="text-sm text-gray-500">
          {items.length} {items.length === 1 ? "item" : "items"}
        </div>
      </div>

      {/* Items Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {items.map((item, index) => {
            const categoryInfo = getCategoryInfo(item.category);

            return (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-200"
              >
                {/* Image */}
                <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="h-12 w-12 text-gray-400" />
                    </div>
                  )}

                  {/* Category Badge */}
                  <div className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700 flex items-center space-x-1">
                    <span>{categoryInfo.icon}</span>
                    <span>{categoryInfo.label}</span>
                  </div>

                  {/* Surplus Badge */}
                  {item.isSurplus && (
                    <div className="absolute top-3 right-3 px-2 py-1 bg-red-500 text-white rounded-full text-xs font-bold">
                      SURPLUS
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
                    {item.name}
                  </h3>

                  {item.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {item.description}
                    </p>
                  )}

                  {/* Price */}
                  <div className="mb-4">
                    {item.isSurplus && item.surplusPrice ? (
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-red-600">
                          ₦{item.surplusPrice.toFixed(2)}
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                          ₦{item.originalPrice.toFixed(2)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-lg font-bold text-gray-900">
                        ₦{item.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleEditClick(item)}
                      className="flex-1 flex items-center cursor-pointer justify-center space-x-2 px-4 py-3 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors font-medium"
                    >
                      <Edit2 className="h-4 w-4" />
                      <span>Edit</span>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDelete(item._id)}
                      className="flex-1 flex items-center cursor-pointer justify-center space-x-2 px-4 py-3 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition-colors font-medium"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Delete</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">
                  Edit Menu Item
                </h2>
                <button
                  onClick={() => setIsEditing(false)}
                  className="p-2 cursor-pointer text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Modal Content */}
              <form onSubmit={handleEditSubmit} className="p-6 space-y-6">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Item Photo
                  </label>
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-xl border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => setImagePreview(null)}
                        className="absolute top-3 right-3 cursor-pointer p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition-colors">
                      <Upload className="h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">
                        Click to upload new image
                      </p>
                      <input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleFormChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Item Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none transition-all duration-200"
                  />
                </div>

                {/* Price and Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                      Original Price (₦)
                    </label>
                    <input
                      type="number"
                      name="originalPrice"
                      value={formData.originalPrice}
                      onChange={handleFormChange}
                      step="0.01"
                      min="0"
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                      Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleFormChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                    >
                      {categories.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.icon} {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Surplus Options */}
                <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
                  <label className="flex items-center space-x-3 mb-4">
                    <input
                      type="checkbox"
                      name="isSurplus"
                      checked={formData.isSurplus}
                      onChange={handleFormChange}
                      className="w-5 h-5 text-orange-500 border-2 border-gray-300 rounded focus:ring-orange-500"
                    />
                    <span className="font-semibold text-gray-900">
                      Mark as Surplus Item
                    </span>
                  </label>

                  {formData.isSurplus && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-3">
                        Surplus Price (₦)
                      </label>
                      <input
                        type="number"
                        name="surplusPrice"
                        value={formData.surplusPrice}
                        onChange={handleFormChange}
                        step="0.01"
                        min="0"
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                      />
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex-1 cursor-pointer px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updating}
                    className="flex-1 cursor-pointer px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-colors font-medium disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {updating ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Saving...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <Save className="h-4 w-4" />
                        <span>Save Changes</span>
                      </div>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MenuItemList;
