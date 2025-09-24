import React from "react";
import {
  BarChart3,
  Package,
  Utensils,
  Plus,
  Bell,
  TrendingUp,
} from "lucide-react";
import { motion } from "framer-motion";

const ModernNavigation = ({ activeTab, onTabChange, notifications = [] }) => {
  const unreadCount = notifications.filter((n) => !n.read).length;

  const tabs = [
    {
      id: "analytics",
      label: "Analytics",
      icon: BarChart3,
      description: "View performance metrics",
      color: "from-blue-500 to-blue-600",
    },
    {
      id: "orders",
      label: "Orders",
      icon: Package,
      description: "Manage incoming orders",
      color: "from-green-500 to-green-600",
    },
    {
      id: "menu",
      label: "Menu",
      icon: Utensils,
      description: "View your menu items",
      color: "from-purple-500 to-purple-600",
    },
    {
      id: "add-item",
      label: "Add Item",
      icon: Plus,
      description: "Create new menu item",
      color: "from-orange-500 to-orange-600",
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
      description: "View all notifications",
      color: "from-red-500 to-red-600",
      badge: unreadCount,
    },
  ];

  return (
    <div className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile Navigation */}
        <div className="block sm:hidden">
          <select
            value={activeTab}
            onChange={(e) => onTabChange(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-sm font-medium"
          >
            {tabs.map((tab) => (
              <option key={tab.id} value={tab.id}>
                {tab.label}
                {tab.badge > 0 && ` (${tab.badge})`}
              </option>
            ))}
          </select>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden overflow-auto sm:block">
          <nav className="flex overflow-auto space-x-1 py-4" aria-label="Tabs">
            {tabs.map((tab, index) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;

              return (
                <motion.button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`relative group flex items-center cursor-pointer px-6 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                    isActive
                      ? `bg-gradient-to-r ${tab.color} text-white shadow-lg shadow-black/10`
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  {/* Icon */}
                  <Icon className="h-5 w-5 mr-3" />

                  {/* Label */}
                  <span className="whitespace-nowrap">{tab.label}</span>

                  {/* Badge */}
                  {tab.badge > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className={`ml-2 px-2 py-1 text-xs font-bold rounded-full ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {tab.badge > 99 ? "99+" : tab.badge}
                    </motion.span>
                  )}

                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 rounded-xl"
                      layoutId="activeTab"
                      style={{
                        background: `linear-gradient(to right, var(--tw-gradient-stops))`,
                      }}
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.6,
                      }}
                    />
                  )}

                  {/* Content (needs to be above the background) */}
                  {/* <div className="relative z-10 flex items-center">
                    <Icon className="h-5 w-5 mr-3" />
                    <span className="whitespace-nowrap">{tab.label}</span>
                    {tab.badge > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className={`ml-2 px-2 py-1 text-xs font-bold rounded-full ${
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {tab.badge > 99 ? "99+" : tab.badge}
                      </motion.span>
                    )}
                  </div> */}

                  {/* Hover tooltip */}
                  {!isActive && (
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
                      {tab.description}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900"></div>
                    </div>
                  )}
                </motion.button>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default ModernNavigation;
