import React from "react";

const MenuItemList = ({ items, restaurantId }) => {
  if (!items || items.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">No menu items found</div>
    );
  }
  const handleDelete = async (itemId) => {
    if (!confirm("Are you sure you want to delete this menu item?")) return;
    try {
      const response = await fetch(`/api/restaurant/menu/${itemId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${await getAuth(
            app
          ).currentUser.getIdToken()}`,
        },
      });
      if (!response.ok) throw new Error("Failed to delete menu item");
      // Update state or refetch menu items
    } catch (err) {
      toast.error(err.message);
    }
  };
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
              ${item.price.toFixed(2)}
            </p>
            <p className="mt-1 text-xs text-gray-500 capitalize">
              {item.category}
            </p>
          </div>
        </div>
      ))}
      <button
        onClick={() => handleDelete(item._id)}
        className="mt-2 px-4 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200"
      >
        Delete
      </button>
    </div>
  );
};

export default MenuItemList;
