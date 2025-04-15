"use client";
import React, { useState } from "react";
import { X, LogOut, User, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
const MobileOffCanva = ({ onClick }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  return (
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
              <button onClick={onClick}>
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
            onClick={onClick}
          />
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileOffCanva;
