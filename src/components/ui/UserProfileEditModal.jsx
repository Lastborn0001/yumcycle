"use client";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { getAuth, updateProfile, updateEmail } from "firebase/auth";
import { app } from "@/libs/firebase-client";

const UserProfileEditModal = ({ isOpen, onClose, user, onProfileUpdate }) => {
  const [formData, setFormData] = useState({
    name: user?.name || user?.displayName || "",
    email: user?.email || "",
    image: null,
  });
  const [preview, setPreview] = useState(user?.photoURL || "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [removeImage, setRemoveImage] = useState(false);

  useEffect(() => {
    setFormData({
      name: user?.name || user?.displayName || "",
      email: user?.email || "",
      image: null,
    });
    setPreview(user?.photoURL || "");
    setRemoveImage(false);
    setError(null);
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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
    setRemoveImage(false);
    console.log("Selected image:", {
      name: file.name,
      size: file.size,
      type: file.type,
    });
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, image: null }));
    setPreview("");
    setRemoveImage(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setError(null);

    try {
      const auth = getAuth(app);
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error("Please log in to update profile");

      const token = await currentUser.getIdToken();
      const data = new FormData();
      if (formData.name) data.append("name", formData.name);
      if (formData.email) data.append("email", formData.email);
      if (formData.image) data.append("image", formData.image);
      if (removeImage) data.append("removeImage", "true");

      for (let [key, value] of data.entries()) {
        console.log(`FormData: ${key}=${value.name || value}`);
      }

      // Update Firebase Authentication
      if (formData.name !== (currentUser.displayName || "")) {
        await updateProfile(currentUser, { displayName: formData.name });
        console.log("Firebase displayName updated");
      }
      if (formData.email !== currentUser.email) {
        await updateEmail(currentUser, formData.email);
        console.log("Firebase email updated");
      }

      // Update MongoDB and Cloudinary
      const response = await fetch("/api/users/profile", {
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

      const updatedUser = await response.json();
      toast.success("Profile updated successfully!");
      onProfileUpdate(updatedUser);
      onClose();
    } catch (err) {
      const errorMessage = err.message || "Failed to update profile";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Profile update error:", {
        message: err.message,
        code: err.code,
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
        <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
              placeholder="Enter your name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
              placeholder="Enter your email"
            />
          </div>
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
                className="mt-2 w-24 h-24 object-cover rounded-full"
              />
            )}
            {preview && (
              <button
                type="button"
                onClick={handleRemoveImage}
                className="mt-2 text-red-500 underline text-sm"
              >
                Remove Profile Picture
              </button>
            )}
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

export default UserProfileEditModal;
