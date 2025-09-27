import React, { useState } from "react";
import { motion } from "framer-motion";
import { Bell, BellRing, Settings, Check } from "lucide-react";

const NotificationSettings = () => {
  const [notifications, setNotifications] = useState({
    surplus: false,
    discounts: false,
    restaurants: false,
  });
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = (type) => {
    setNotifications((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const notificationTypes = [
    {
      key: "surplus",
      title: "New Surplus Items",
      description: "Get notified when restaurants add new surplus food",
      icon: Bell,
    },
    {
      key: "discounts",
      title: "Special Discounts",
      description: "Alerts for extra discounts and flash sales",
      icon: BellRing,
    },
    {
      key: "restaurants",
      title: "New Restaurants",
      description: "Know when new restaurants join our marketplace",
      icon: Settings,
    },
  ];

  const enabledCount = Object.values(notifications).filter(Boolean).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200 overflow-hidden"
    >
      {/* Header */}
      <div
        className="p-6 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <motion.div
              animate={{ rotate: isExpanded ? 360 : 0 }}
              transition={{ duration: 0.3 }}
              className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg"
            >
              <Bell className="h-6 w-6 text-white" />
            </motion.div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Surplus Notifications
              </h3>
              <p className="text-green-700 text-sm">
                Stay updated on new surplus food opportunities
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {enabledCount > 0 && (
              <div className="px-3 py-1 bg-green-500 text-white rounded-full text-sm font-medium">
                {enabledCount} active
              </div>
            )}
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="w-6 h-6 text-gray-400"
            >
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Expandable Content */}
      <motion.div
        initial={false}
        animate={{
          height: isExpanded ? "auto" : 0,
          opacity: isExpanded ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="px-6 pb-6 pt-0">
          <div className="space-y-4">
            {notificationTypes.map((type, index) => {
              const Icon = type.icon;
              const isEnabled = notifications[type.key];

              return (
                <motion.div
                  key={type.key}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl p-4 shadow-sm border border-green-100"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          isEnabled
                            ? "bg-green-500 text-white"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {type.title}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {type.description}
                        </p>
                      </div>
                    </div>

                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleToggle(type.key)}
                      className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                        isEnabled ? "bg-green-500" : "bg-gray-300"
                      }`}
                    >
                      <motion.div
                        animate={{
                          x: isEnabled ? 24 : 0,
                          backgroundColor: isEnabled ? "#ffffff" : "#ffffff",
                        }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md flex items-center justify-center"
                      >
                        {isEnabled && (
                          <Check className="h-3 w-3 text-green-500" />
                        )}
                      </motion.div>
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Quick Enable All */}
          <div className="mt-6 pt-4 border-t border-green-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                Enable all notifications for maximum savings
              </span>
              <button
                onClick={() => {
                  const allEnabled = enabledCount === notificationTypes.length;
                  const newState = !allEnabled;
                  setNotifications({
                    surplus: newState,
                    discounts: newState,
                    restaurants: newState,
                  });
                }}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  enabledCount === notificationTypes.length
                    ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    : "bg-green-500 text-white hover:bg-green-600"
                }`}
              >
                {enabledCount === notificationTypes.length
                  ? "Disable All"
                  : "Enable All"}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default NotificationSettings;
