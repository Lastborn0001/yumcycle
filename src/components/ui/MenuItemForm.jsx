"use client";
import { useState } from "react";
import { toast } from "react-hot-toast";

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

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files[0]) {
      if (!files[0].type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }
      if (files[0].size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }
      // console.log("Selected image:", {
      //   name: files[0].name,
      //   size: files[0].size,
      //   type: files[0].type,
      // });
    }
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

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
      // for (let [key, value] of data.entries()) {
      //   // console.log(`FormData: ${key}=${value.name || value}`);
      // }

      await onSubmit(data);
      toast.success("Menu item added successfully!");
      setFormData({
        name: "",
        description: "",
        originalPrice: "",
        category: "Main",
        image: null,
      });
    } catch (err) {
      const errorMessage = err.message || "Failed to add menu item";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Menu item submission error:", {
        message: err.message,
        stack: err.stack,
        name: err.name,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 max-w-lg mx-auto">
      <h2 className="text-xl font-semibold mb-4">Add Menu Item</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 text-xl rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 ring-orange-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 text-orange-500 "
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="mt-1 block w-full p-2 text-xl rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 ring-orange-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 text-orange-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Price
          </label>
          <input
            type="number"
            name="originalPrice"
            value={formData.originalPrice}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className="mt-1 block w-full p-2 text-xl rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 ring-orange-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 text-orange-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 text-xl rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 ring-orange-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 text-orange-500"
          >
            <option value="Main">Main</option>
            <option value="Side">Side</option>
            <option value="Drink">Drink</option>
            <option value="Dessert">Dessert</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Image
          </label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-orange-100 file:text-orange-700 hover:file:bg-orange-200"
          />
          {formData.image && (
            <div>
              <p className="mt-1 text-sm text-gray-500">
                Selected: {formData.image.name}
              </p>
              <img
                src={URL.createObjectURL(formData.image)}
                alt="Preview"
                className="mt-2 w-full h-32 object-cover rounded-md"
              />
            </div>
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
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-2 px-4 bg-orange-500 cursor-pointer text-white rounded-md hover:bg-orange-600 disabled:bg-orange-300"
        >
          {submitting ? "Submitting..." : "Add Menu Item"}
        </button>
      </form>
    </div>
  );
};

export default MenuItemForm;
