import React from "react";
import { Bell, LogOut, Settings, Star, MapPin } from "lucide-react";
import { motion } from "framer-motion";

const ModernHeader = ({
  restaurant,
  notifications = [],
  onEditProfile,
  onLogout,
  onNotificationClick,
}) => {
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-40 backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Restaurant info */}
          <div className="flex items-center space-x-4">
            <motion.div
              className="flex items-center space-x-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Restaurant Logo */}
              {restaurant?.image ? (
                <div className="relative">
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-10 h-10 rounded-xl object-cover ring-2 ring-orange-100"
                  />
                  {restaurant.isEcoFriendly && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-xs">🌱</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center relative">
                  <span className="text-white font-bold text-sm">
                    {restaurant?.name?.charAt(0) || "R"}
                  </span>
                  {restaurant?.isEcoFriendly && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-xs">🌱</span>
                    </div>
                  )}
                </div>
              )}

              {/* Restaurant Name & Info */}
              <div>
                <h1 className="text-lg font-bold text-gray-900 leading-tight">
                  {restaurant?.name || "Restaurant Dashboard"}
                </h1>
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  {restaurant?.location && (
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-3 w-3" />
                      <span>{restaurant.location}</span>
                    </div>
                  )}
                  {restaurant?.rating && (
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span>{restaurant.rating}</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right side - Actions */}
          <motion.div
            className="flex items-center space-x-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {/* Edit Profile Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onEditProfile}
              className="inline-flex items-center cursor-pointer px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-medium rounded-xl hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </motion.button>

            {/* Notifications */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onNotificationClick}
              className="relative p-2.5 text-gray-400 cursor-pointer hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium"
                >
                  {unreadCount > 9 ? "9+" : unreadCount}
                </motion.span>
              )}
            </motion.button>

            {/* Logout */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onLogout}
              className="p-2.5 cursor-pointer text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              title="Sign Out"
            >
              <LogOut className="h-5 w-5" />
            </motion.button>
          </motion.div>
        </div>
      </div>
      {/* </div> */}
    </header>
  );
};

export default ModernHeader;
