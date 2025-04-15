"use client";
import React, { useState } from "react";
import {
  Menu,
  X,
  LogIn,
  LogOut,
  User,
  Search,
  Home,
  ShoppingCartIcon,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { getAuth, signOut } from "firebase/auth";
import { app } from "@/libs/firebase-client";

const Nav = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const auth = getAuth(app);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav className="flex justify-between p-[15px] border-b-2 border-gray-200 relative">
      <div className="flex items-center justify-between">
        <h1 className="text-orange-600 font-bold text-[20px]">Yumcycle</h1>
      </div>
      <button
        className="md:hidden mr-4"
        onClick={() => setIsMobileMenuOpen(true)}
      >
        <Menu className="h-6 w-6" />
      </button>
      {/* Desktop Navigation */}
      <ul className="hidden md:flex justify-around pt-2">
        <li className="m-[0_15px] font-semibold text-[15px] cursor-pointer transition hover:text-orange-500 ">
          Home
        </li>
        <li className="m-[0_15px] font-semibold text-[15px] cursor-pointer transition hover:text-orange-500 ">
          Restaurants
        </li>
        <li className="m-[0_15px] font-semibold text-[15px] cursor-pointer transition hover:text-orange-500 ">
          Food Waste
        </li>
        <li className="m-[0_15px] font-semibold text-[15px] cursor-pointer transition hover:text-orange-500 ">
          My Orders
        </li>
      </ul>

      {/* Desktop Right Side */}
      <div className="hidden md:flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search..."
            className="flex h-10 rounded-md border border-input bg-gray-100 px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:text-sm w-[200px] pl-8 bg-muted/50 border-none ring-orange-300"
          />
        </div>

        <button className="relative rounded-full p-3 cursor-pointer border-[2px] border-gray-50 transition hover:bg-green-300">
          <ShoppingCartIcon className="h-5 w-5" />
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center bg-orange-400 text-white justify-center rounded-full text-[10px]">
            3
          </span>
        </button>

        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-1 p-2 rounded-full hover:bg-gray-100 transition"
          >
            <User className="h-5 w-5" />
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
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Mobile Offcanvas Menu */}
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

              <div className="p-4 space-y-6">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="search"
                    placeholder="Search..."
                    className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300"
                  />
                </div>

                <ul className="space-y-4">
                  <li className="font-semibold text-[15px] cursor-pointer transition hover:text-orange-500">
                    Home
                  </li>
                  <li className="font-semibold text-[15px] cursor-pointer transition hover:text-orange-500">
                    Restaurants
                  </li>
                  <li className="font-semibold text-[15px] cursor-pointer transition hover:text-orange-500">
                    Food Waste
                  </li>
                  <li className="font-semibold text-[15px] cursor-pointer transition hover:text-orange-500">
                    My Orders
                  </li>
                </ul>

                <div className="pt-4 border-t border-gray-200">
                  <button className="w-full flex items-center justify-between py-2">
                    <span className="flex items-center">
                      <User className="h-5 w-5 mr-2" />
                      Profile
                    </span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-between py-2"
                  >
                    <span className="flex items-center">
                      <LogOut className="h-5 w-5 mr-2" />
                      Logout
                    </span>
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Overlay */}
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

      {/* Click outside to close dropdown */}
      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </nav>
  );
};

export default Nav;
