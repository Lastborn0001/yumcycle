"use client";
import React, { useState, useEffect, useRef, memo } from "react";
import {
  Menu,
  X,
  LogIn,
  LogOut,
  User,
  Search,
  ShoppingCartIcon,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { toast } from "react-hot-toast";
import { useAuth } from "@/libs/AuthContext";
import { useCartStore } from "@/store/cartStore";

const selectCartItemCount = (state) => {
  const items = state.items;
  return Array.isArray(items) ? items.length : 0;
};

const Nav = memo(() => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const { user, loading, auth } = useAuth();
  const cartItemCount = useCartStore(selectCartItemCount);
  const fetchCart = useCartStore((state) => state.fetchCart);
  const mergeCart = useCartStore((state) => state.mergeCart);
  const cartStatus = useCartStore((state) => state.status);
  const hasSyncedCart = useRef(false);
  const hasFetchedCart = useRef(false);
  const fetchFailed = useRef(false);
  const isMounted = useRef(true);

  // console.log("Nav: Rendered", {
  //   user: !!user,
  //   loading,
  //   cartItemCount,
  //   cartStatus,
  // });

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (loading || !user || cartStatus === "loading") {
      // console.log("Nav: Skipping syncCart", {
      //   loading,
      //   user: !!user,
      //   cartStatus,
      // });
      return;
    }

    const syncCart = async () => {
      try {
        const currentItems = useCartStore.getState().items;

        // Only sync if we have local items and haven't synced yet
        if (currentItems.length > 0 && !hasSyncedCart.current) {
          // console.log("Nav: Merging cart with", currentItems.length, "items");
          hasSyncedCart.current = true;
          await mergeCart(currentItems);
        }

        // Only fetch if we haven't fetched yet
        if (!hasFetchedCart.current) {
          // console.log("Nav: Fetching cart");
          hasFetchedCart.current = true;
          await fetchCart();
        }
      } catch (err) {
        console.error("Nav: Cart sync error:", err);
      }
    };

    // const timer = setTimeout(() => {
    // syncCart();
    // }, 20000);

    // return () => clearTimeout(timer);
  }, [user, loading]);

  const handleNavigation = (path) => {
    if (!user && path !== "/" && path !== "/login") {
      toast.error("Please log in to access this page");
      router.push("/login");
      return;
    }
    router.push(path);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      hasSyncedCart.current = false;
      hasFetchedCart.current = false;
      fetchFailed.current = false;
      useCartStore.getState().resetFetchAttempts();
      router.push("/");
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to log out");
    }
  };

  return (
    <nav className="border-b-2 border-gray-200 fixed w-full backdrop-blur-sm z-10">
      <div className="flex justify-between p-[15px] w-full navv m-auto">
        <div className="flex items-center justify-between">
          <h1
            onClick={() => handleNavigation("/dashboard")}
            className="text-orange-600 cursor-pointer font-bold text-[20px]"
          >
            Yumcycle
          </h1>
        </div>
        <div>
          <button
            onClick={() => handleNavigation("/cart")}
            className="relative lg:hidden rounded-full p-3 cursor-pointer border-[2px] border-gray-50 transition hover:bg-green-300"
          >
            <ShoppingCartIcon className="h-5 w-5" />
            {cartItemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center bg-orange-400 text-white justify-center rounded-full text-[10px]">
                {cartItemCount}
              </span>
            )}
          </button>
          <button
            className="lg:hidden mr-4"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
        <ul className="hidden lg:flex justify-around pt-2">
          <li
            onClick={() => handleNavigation("/dashboard")}
            className="m-[0_15px] font-semibold xl:text-[14px] text-[12px] cursor-pointer transition hover:text-orange-500"
          >
            Home
          </li>
          <li
            onClick={() => handleNavigation("/restaurants")}
            className="m-[0_15px] font-semibold xl:text-[14px] text-[12px] cursor-pointer transition hover:text-orange-500"
          >
            Restaurants
          </li>
          <li
            onClick={() => handleNavigation("/foodWaste")}
            className="m-[0_15px] font-semibold xl:text-[14px] text-[12px] cursor-pointer transition hover:text-orange-500"
          >
            Food Waste
          </li>
          <li
            onClick={() => handleNavigation("/orders")}
            className="m-[0_15px] font-semibold xl:text-[14px] text-[12px] cursor-pointer transition hover:text-orange-500"
          >
            My Orders
          </li>
        </ul>

        <div className="hidden lg:flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search..."
              className="flex h-10 rounded-md border border-input bg-gray-100 px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:text-sm w-[200px] pl-8 bg-muted/50 border-none ring-orange-300"
            />
          </div>

          <button
            onClick={() => handleNavigation("/cart")}
            className="relative rounded-full p-3 cursor-pointer border-[2px] border-gray-50 transition hover:bg-green-300"
          >
            <ShoppingCartIcon className="h-5 w-5" />
            {cartItemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center bg-orange-400 text-white justify-center rounded-full text-[10px]">
                {cartItemCount}
              </span>
            )}
          </button>

          {!loading && (
            <div className="relative">
              {user ? (
                <>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-1 p-2 rounded-full hover:bg-gray-100 transition"
                  >
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt="Profile"
                        className="h-6 w-6 rounded-full"
                      />
                    ) : (
                      <User className="h-5 w-5" />
                    )}
                    <ChevronDown className="h-4 w-4" />
                  </button>

                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200"
                    >
                      <button
                        onClick={() => {
                          router.push("/profile");
                          setIsDropdownOpen(false);
                        }}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      >
                        <User className="h-4 w-4 mr-2" />
                        Profile
                      </button>
                      <button
                        onClick={() => {
                          router.push("/orders");
                          setIsDropdownOpen(false);
                        }}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      >
                        <ShoppingCartIcon className="h-4 w-4 mr-2" />
                        My Orders
                      </button>
                      <hr className="border-gray-200" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center px-4 py-2 text-sm hover:bg-gray-100 w-full text-left text-red-500"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </>
              ) : (
                <button
                  onClick={() => router.push("/login")}
                  className="flex items-center gap-1 px-4 py-2 rounded-md bg-orange-500 text-white hover:bg-orange-600 transition"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Login</span>
                </button>
              )}
            </div>
          )}
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "tween" }}
                className="fixed top-0 right-0 h-full w-64 bg-white z-50 shadow-xl"
              >
                <div className="p-4 flex justify-end">
                  <button onClick={() => setIsMobileMenuOpen(false)}>
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <div className="p-4 space-y-6 bg-white">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="search"
                      placeholder="Search..."
                      className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300"
                    />
                  </div>
                  <ul className="space-y-4">
                    <li
                      onClick={() => handleNavigation("/dashboard")}
                      className="font-semibold text-[15px] cursor-pointer transition hover:text-orange-500"
                    >
                      Home
                    </li>
                    <li
                      onClick={() => handleNavigation("/restaurants")}
                      className="font-semibold text-[15px] cursor-pointer transition hover:text-orange-500"
                    >
                      Restaurants
                    </li>
                    <li
                      onClick={() => handleNavigation("/foodWaste")}
                      className="font-semibold text-[15px] cursor-pointer transition hover:text-orange-500"
                    >
                      Food Waste
                    </li>
                    <li
                      onClick={() => handleNavigation("/orders")}
                      className="font-semibold text-[15px] cursor-pointer transition hover:text-orange-500"
                    >
                      My Orders
                    </li>
                  </ul>
                  <div className="pt-4 border-t border-gray-200">
                    {user ? (
                      <>
                        <button
                          onClick={() => {
                            router.push("/profile");
                            setIsMobileMenuOpen(false);
                          }}
                          className="w-full flex items-center justify-between py-2"
                        >
                          <span className="flex items-center">
                            <User className="h-5 w-5 mr-2" />
                            Profile
                          </span>
                        </button>
                        <button
                          onClick={() => {
                            handleLogout();
                            setIsMobileMenuOpen(false);
                          }}
                          className="w-full flex items-center justify-between py-2 text-red-500"
                        >
                          <span className="flex items-center">
                            <LogOut className="h-5 w-5 mr-2" />
                            Logout
                          </span>
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => {
                          router.push("/login");
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full flex items-center justify-between py-2 text-orange-500"
                      >
                        <span className="flex items-center">
                          <LogIn className="h-5 w-5 mr-2" />
                          Login
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black z-40"
                onClick={() => setIsMobileMenuOpen(false)}
              />
            </>
          )}
        </AnimatePresence>

        {isDropdownOpen && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsDropdownOpen(false)}
          />
        )}
      </div>
    </nav>
  );
});

Nav.displayName = "Nav";

export default Nav;
