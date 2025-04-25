import { create } from "zustand";
import { auth } from "@/libs/firebaseClient";

export const useCartStore = create((set, get) => ({
  items: [],
  status: "idle",
  error: null,

  addToCart: async (item, userToken) => {
    try {
      set({ status: "loading" });

      if (!item || !item._id) {
        throw new Error("Invalid item: Missing _id");
      }

      // Ensure items is an array
      const currentItems = Array.isArray(get().items) ? get().items : [];

      // Optimistic update
      const existingItemIndex = currentItems.findIndex(
        (i) => i._id === item._id
      );

      if (existingItemIndex !== -1) {
        set({
          items: currentItems.map((i, idx) =>
            idx === existingItemIndex ? { ...i, quantity: i.quantity + 1 } : i
          ),
        });
      } else {
        set({
          items: [...currentItems, { ...item, quantity: 1 }],
        });
      }

      // API call with token
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({ item }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update cart");
      }

      const { cart } = await response.json();
      set({ items: cart, status: "succeeded" });

      return { success: true, cart };
    } catch (error) {
      console.error("addToCart error:", error.message);

      const currentItems = Array.isArray(get().items) ? get().items : [];

      // Rollback optimistic update
      set({
        status: "failed",
        error: error.message,
        items: currentItems.filter((i) => i._id !== item?._id),
      });

      return { success: false, error: error.message };
    }
  },

  updateCartItem: async ({ itemId, action }) => {
    try {
      const { getUserToken } = get();
      const token = await getUserToken();
      if (!token) throw new Error("User not authenticated");

      set({ status: "loading" });

      const response = await fetch("/api/cart", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ itemId, action }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update cart");
      }

      const { cart } = await response.json();
      set({ items: cart, status: "succeeded" });

      return { success: true, cart };
    } catch (error) {
      console.error("updateCartItem error:", error.message);
      set({ status: "failed", error: error.message });
      return { success: false, error: error.message };
    }
  },

  clearCart: async () => {
    try {
      const { getUserToken } = get();
      const token = await getUserToken();
      if (!token) throw new Error("User not authenticated");

      set({ status: "loading" });

      const response = await fetch("/api/cart", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to clear cart");
      }

      set({ items: [], status: "succeeded" });
      return { success: true };
    } catch (error) {
      console.error("clearCart error:", error.message);
      set({ status: "failed", error: error.message });
      return { success: false, error: error.message };
    }
  },

  getUserToken: async () => {
    const user = auth.currentUser;
    return user ? await user.getIdToken() : null;
  },

  initializeCart: async () => {
    try {
      set({ status: "loading" });

      const { getUserToken } = get();
      const token = await getUserToken();

      if (!token) throw new Error("User not authenticated");

      const response = await fetch("/api/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch cart");
      }

      const { cart } = await response.json();
      set({ items: cart || [], status: "succeeded" });
    } catch (error) {
      console.error("initializeCart error:", error.message);
      set({ error: error.message, status: "failed" });
    }
  },
  resetFetchAttempts: () => {
    set({
      status: "idle",
      error: null,
    });
  },
}));
