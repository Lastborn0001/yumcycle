import React, { useState } from "react";
import {
  Upload,
  Image as ImageIcon,
  DollarSign,
  Tag,
  FileText,
  Plus,
  X,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

const MenuItemForm = ({ onSubmit, restaurantId }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    originalPrice: "",
    category: "Main",
    image: null,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const categories = [
    { value: "Main", label: "Main Course", icon: "🍽️" },
    { value: "Side", label: "Side Dish", icon: "🥗" },
    { value: "Drink", label: "Beverage", icon: "🥤" },
    { value: "Dessert", label: "Dessert", icon: "🍰" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      image: file,
    }));

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    handleImageChange(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files[0];
    handleImageChange(file);
  };

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, image: null }));
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    // Validation
    if (!formData.name.trim()) {
      toast.error("Please enter a menu item name");
      return;
    }
    if (!formData.originalPrice || parseFloat(formData.originalPrice) <= 0) {
      toast.error("Please enter a valid price");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("originalPrice", formData.originalPrice);
      data.append("category", formData.category);
      if (formData.image) {
        data.append("image", formData.image);
      }

      await onSubmit(data);

      // Reset form
      setFormData({
        name: "",
        description: "",
        originalPrice: "",
        category: "Main",
        image: null,
      });
      setImagePreview(null);

      toast.success("Menu item added successfully!");
    } catch (err) {
      const errorMessage = err.message || "Failed to add menu item";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4"
        >
          <Plus className="h-8 w-8 text-white" />
        </motion.div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Add New Menu Item
        </h2>
        <p className="text-gray-600">
          Create a delicious addition to your menu
        </p>
      </div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
      >
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-4">
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
                  onClick={removeImage}
                  className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                  dragActive
                    ? "border-orange-400 bg-orange-50"
                    : "border-gray-300 hover:border-orange-400 hover:bg-orange-50"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <ImageIcon className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-lg font-medium text-gray-900 mb-2">
                  Drop your image here, or{" "}
                  <label className="text-orange-600 cursor-pointer hover:text-orange-700">
                    browse
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileInput}
                      className="hidden"
                    />
                  </label>
                </p>
                <p className="text-sm text-gray-500">PNG, JPG, GIF up to 5MB</p>
              </div>
            )}
          </div>

          {/* Item Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Item Name *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Tag className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="e.g., Grilled Chicken Salad"
                className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-lg font-medium transition-all duration-200"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Description
            </label>
            <div className="relative">
              <div className="absolute top-4 left-4 pointer-events-none">
                <FileText className="h-5 w-5 text-gray-400" />
              </div>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="Describe your delicious dish..."
                className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none transition-all duration-200"
              />
            </div>
          </div>

          {/* Price and Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Price */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Price *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  name="originalPrice"
                  value={formData.originalPrice}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-lg font-medium transition-all duration-200"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Category *
              </label>
              <div className="grid grid-cols-2 gap-3">
                {categories.map((category) => (
                  <motion.label
                    key={category.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`relative flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                      formData.category === category.value
                        ? "border-orange-500 bg-orange-50"
                        : "border-gray-200 hover:border-orange-300 hover:bg-orange-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="category"
                      value={category.value}
                      checked={formData.category === category.value}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className="flex flex-col items-center text-center w-full">
                      <span className="text-2xl mb-1">{category.icon}</span>
                      <span className="text-sm font-medium text-gray-900">
                        {category.label}
                      </span>
                    </div>
                    {formData.category === category.value && (
                      <div className="absolute top-2 right-2">
                        <CheckCircle className="h-5 w-5 text-orange-500" />
                      </div>
                    )}
                  </motion.label>
                ))}
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-red-50 border border-red-200 rounded-xl"
            >
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-red-700 font-medium">{error}</p>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="text-red-600 underline hover:text-red-700 text-sm mt-1"
                  >
                    Try again
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: submitting ? 1 : 1.02 }}
            whileTap={{ scale: submitting ? 1 : 0.98 }}
            type="submit"
            disabled={submitting}
            className={`w-full cursor-pointer py-4 px-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-lg font-semibold rounded-xl transition-all duration-200 ${
              submitting
                ? "opacity-70 cursor-not-allowed"
                : "hover:from-orange-600 hover:to-orange-700 hover:shadow-lg"
            }`}
          >
            {submitting ? (
              <div className="flex items-center justify-center space-x-3">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Adding Item...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-3">
                <Plus className="h-5 w-5" />
                <span>Add Menu Item</span>
              </div>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};
export default MenuItemForm;
