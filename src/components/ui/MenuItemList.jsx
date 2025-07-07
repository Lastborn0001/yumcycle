import React, { useState } from "react";
import toast from "react-hot-toast";
import { getAuth } from "firebase/auth";

const MenuItemList = ({ items, restaurantId, app, refreshMenuItems }) => {
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
    setIsEditing(true);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? checked : type === "file" ? files[0] : value,
    }));
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
      if (refreshMenuItems) await refreshMenuItems();
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (!items || items.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">No menu items found</div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <div
          key={item._id}
          className="bg-white shadow rounded-lg overflow-hidden"
        >
          {item.image && (
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-48 object-cover"
            />
          )}
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
            <p className="mt-1 text-sm text-gray-600">{item.description}</p>
            <p className="mt-2 text-sm font-medium text-gray-900">
              {item.isSurplus && item.surplusPrice ? (
                <>
                  <span className="line-through text-gray-500">
                    ₦{item.originalPrice.toFixed(2)}
                  </span>{" "}
                  <span>₦{item.surplusPrice.toFixed(2)} (Surplus)</span>
                </>
              ) : (
                `₦${item.originalPrice}`
              )}
            </p>
            <p className="mt-1 text-xs text-gray-500 capitalize">
              {item.category}
            </p>
            <div className="mt-4 flex space-x-2">
              <button
                onClick={() => handleEditClick(item)}
                className="px-4 py-1 bg-blue-100 text-blue-800 cursor-pointer rounded hover:bg-blue-200"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(item._id)}
                className="px-4 py-1 bg-red-100 text-red-800 cursor-pointer rounded hover:bg-red-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Edit Menu Item</h2>
            <form onSubmit={handleEditSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Original Price (₦)
                </label>
                <input
                  type="number"
                  name="originalPrice"
                  value={formData.originalPrice}
                  onChange={handleFormChange}
                  step="0.01"
                  min="0"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isSurplus"
                    checked={formData.isSurplus}
                    onChange={handleFormChange}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Mark as Surplus
                  </span>
                </label>
              </div>
              {formData.isSurplus && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Surplus Price (₦)
                  </label>
                  <input
                    type="number"
                    name="surplusPrice"
                    value={formData.surplusPrice}
                    onChange={handleFormChange}
                    step="0.01"
                    min="0"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    required
                  />
                </div>
              )}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleFormChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  required
                >
                  <option value="Main">Main</option>
                  <option value="Side">Side</option>
                  <option value="Drink">Drink</option>
                  <option value="Dessert">Dessert</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Image
                </label>
                <input
                  type="file"
                  name="image"
                  onChange={handleFormChange}
                  className="mt-1 block w-full"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuItemList;
