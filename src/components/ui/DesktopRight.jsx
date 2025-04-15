"use client";
import React, { useState } from "react";
import {
  LogOut,
  User,
  Search,
  ShoppingCartIcon,
  ChevronDown,
} from "lucide-react";
import { motion } from "framer-motion";
const DesktopRight = ({ onClick, logout, dropFalse }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  return (
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
          onClick={onClick}
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
                {
                  dropFalse;
                }
              }}
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
            >
              <User className="h-4 w-4 mr-2" />
              Profile
            </button>
            <button
              onClick={() => {
                router.push("/orders");
                {
                  dropFalse;
                }
              }}
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
            >
              <ShoppingCartIcon className="h-4 w-4 mr-2" />
              My Orders
            </button>
            <button
              onClick={logout}
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DesktopRight;
