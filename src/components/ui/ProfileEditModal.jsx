"use client";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { getAuth } from "firebase/auth";
import { app } from "@/libs/firebase-client"; // Adjust path to your Firebase config

const ProfileEditModal = ({ isOpen, onClose, restaurant, onProfileUpdate }) => {
  const [formData, setFormData] = useState({
    image: null,
    isEcoFriendly: restaurant?.isEcoFriendly || false,
  });
  const [preview, setPreview] = useState(restaurant?.image || "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setFormData({
      image: null,
      isEcoFriendly: restaurant?.isEcoFriendly || false,
    });
    setPreview(restaurant?.image || "");
    setError(null);
  }, [restaurant]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
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
    // console.log("Selected image:", {
    //   name: file.name,
    //   size: file.size,
    //   type: file.type,
    // });
  };

  const handleEcoFriendlyChange = (e) => {
    setFormData((prev) => ({ ...prev, isEcoFriendly: e.target.checked }));
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

      // for (let [key, value] of data.entries()) {
      //   console.log(`FormData: ${key}=${value.name || value}`);
      // }

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
      console.error("Profile update error:", {
        message: err.message,
        stack: err.stack,
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Edit Restaurant Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Profile Picture
            </label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-orange-100 file:text-orange-700 hover:file:bg-orange-200"
            />
            {preview && (
              <img
                src={preview}
                alt="Profile Preview"
                className="mt-2 w-full h-32 object-cover rounded-md"
              />
            )}
          </div>
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.isEcoFriendly}
                onChange={handleEcoFriendlyChange}
                className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
              />
              <span className="text-sm font-medium text-gray-700">
                Eco-Friendly
              </span>
            </label>
          </div>
          {error && (
            <div className="text-red-500 text-sm">
              {error}
              <button
                onClick={handleSubmit}
                className="ml-2 text-orange-500 underline"
              >
                Retry
              </button>
            </div>
          )}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="py-2 px-4 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:bg-orange-300"
            >
              {submitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileEditModal;
