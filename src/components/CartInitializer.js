"use client";
import { useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "@/libs/firebase-client";
import { useCartStore } from "@/store/cartStore";

export default function CartInitializer() {
  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await useCartStore.getState().initializeCart();
      } else {
        useCartStore.setState({ items: [], status: "idle" });
      }
    });
    return () => unsubscribe();
  }, []);

  return null;
}
