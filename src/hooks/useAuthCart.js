import useCartStore from "@/store/cartStore";
import { useAuth } from "@/libs/AuthContext";

export default function useAuthCart() {
  const { user } = useAuth();
  const {
    items,
    status,
    addToCart: originalAddToCart,
    ...rest
  } = useCartStore();

  const addToCart = async (item) => {
    if (!user) {
      throw new Error("User not authenticated");
    }

    const token = await user.getIdToken();
    return originalAddToCart(item, token);
  };

  return {
    items,
    status,
    addToCart,
    ...rest,
  };
}
