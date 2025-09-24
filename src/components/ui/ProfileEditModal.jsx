import React, { useState, useEffect } from "react";
import {
  X,
  Upload,
  Leaf,
  Settings,
  Save,
  ImageIcon,
  AlertTriangle,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { getAuth } from "firebase/auth";
import { app } from "@/libs/firebase-client";
import { motion, AnimatePresence } from "framer-motion";

const ProfileEditModal = ({ isOpen, onClose, restaurant, onProfileUpdate }) => {
  const [formData, setFormData] = useState({
    image: null,
    isEcoFriendly: restaurant?.isEcoFriendly || false,
  });
  const [preview, setPreview] = useState(restaurant?.image || "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    setFormData({
      image: null,
      isEcoFriendly: restaurant?.isEcoFriendly || false,
    });
    setPreview(restaurant?.image || "");
    setError(null);
  }, [restaurant]);

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

    setFormData((prev) => ({ ...prev, image: file }));
    setPreview(URL.createObjectURL(file));
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

  const handleEcoFriendlyChange = (e) => {
    setFormData((prev) => ({ ...prev, isEcoFriendly: e.target.checked }));
  };

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, image: null }));
    setPreview(restaurant?.image || "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setError(null);

    try {
      const auth = getAuth(app);
      const user = auth.currentUser;
      if (!user) throw new Error("Please log in to update profile");

      const token = await user.getIdToken();
      const data = new FormData();
      if (formData.image) {
        data.append("image", formData.image);
      }
      data.append("isEcoFriendly", formData.isEcoFriendly);

      const response = await fetch("/api/restaurants/profile", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update profile");
      }

      const updatedProfile = await response.json();
      toast.success("Profile updated successfully!");
      onProfileUpdate(updatedProfile);
      onClose();
    } catch (err) {
      const errorMessage = err.message || "Failed to update profile";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                <Settings className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Edit Profile
                </h2>
                <p className="text-sm text-gray-500">
                  Update your restaurant information
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Form Content */}
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Profile Picture Section */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-4">
                  Restaurant Photo
                </label>

                {preview ? (
                  <div className="relative">
                    <img
                      src={preview}
                      alt="Restaurant Preview"
                      className="w-full h-48 object-cover rounded-xl border-2 border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <div className="absolute bottom-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700">
                      Current Image
                    </div>
                  </div>
                ) : (
                  <div
                    className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer ${
                      dragActive
                        ? "border-orange-400 bg-orange-50"
                        : "border-gray-300 hover:border-orange-400 hover:bg-orange-50"
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() =>
                      document.getElementById("file-input").click()
                    }
                  >
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <ImageIcon className="h-6 w-6 text-gray-400" />
                    </div>
                    <p className="font-medium text-gray-900 mb-1">
                      Drop your image here, or click to browse
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 5MB
                    </p>
                  </div>
                )}

                <input
                  id="file-input"
                  type="file"
                  accept="image/*"
                  onChange={handleFileInput}
                  className="hidden"
                />
              </div>

              {/* Eco-Friendly Toggle */}
              <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                      <Leaf className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <span className="font-semibold text-gray-900">
                        Eco-Friendly Restaurant
                      </span>
                      <p className="text-sm text-gray-600">
                        Show customers you care about the environment
                      </p>
                    </div>
                  </div>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={formData.isEcoFriendly}
                      onChange={handleEcoFriendlyChange}
                      className="sr-only"
                    />
                    <div
                      className={`w-12 h-6 rounded-full transition-colors duration-200 ${
                        formData.isEcoFriendly ? "bg-green-500" : "bg-gray-300"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                          formData.isEcoFriendly
                            ? "translate-x-6"
                            : "translate-x-0.5"
                        } mt-0.5`}
                      />
                    </div>
                  </div>
                </label>
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

              {/* Action Buttons */}
              <div className="flex space-x-4 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: submitting ? 1 : 1.02 }}
                  whileTap={{ scale: submitting ? 1 : 0.98 }}
                  type="submit"
                  disabled={submitting}
                  className={`flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl transition-all duration-200 font-medium ${
                    submitting
                      ? "opacity-70 cursor-not-allowed"
                      : "hover:from-orange-600 hover:to-orange-700 hover:shadow-lg"
                  }`}
                >
                  {submitting ? (
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
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProfileEditModal;
