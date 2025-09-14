import React from "react";
import { Bell, Search, LogOut, Menu, User } from "lucide-react";

const Header = ({ onLogout, toggleSidebar, sidebarCollapsed }) => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          title="Toggle sidebar"
        >
          <Menu className="w-5 h-5 text-gray-600" />
        </button>

        <div className="hidden md:block">
          <h2 className="text-xl font-semibold text-gray-900">Dashboard</h2>
          <p className="text-sm text-gray-500">
            Manage your platform efficiently
          </p>
        </div>
      </div>

      {/* Center Section - Search */}
      <div className="hidden md:flex flex-1 max-w-md mx-8">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search restaurants, users..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
        </button>

        {/* User Profile */}
        <div className="flex items-center space-x-3">
          <div className="hidden sm:block text-right">
            <div className="text-sm font-medium text-gray-900">Admin User</div>
            <div className="text-xs text-gray-500">Administrator</div>
          </div>

          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={onLogout}
          className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="Logout"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:block">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
