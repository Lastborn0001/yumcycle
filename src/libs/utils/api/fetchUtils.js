export const fetchData = async (user) => {
  try {
    const token = await user.getIdToken();
    const [profileRes, ordersRes, menuRes, notificationsRes] =
      await Promise.all([
        fetch("/api/restaurants/profile", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("/api/restaurants/orders", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("/api/restaurants/menu", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("/api/restaurants/notifications", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

    // Process and return responses
    return await processApiResponses(
      profileRes,
      ordersRes,
      menuRes,
      notificationsRes
    );
  } catch (err) {
    throw new Error(err.message);
  }
};
