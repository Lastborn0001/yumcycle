"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bell, BellRing, Settings, Check } from "lucide-react";
import { getAuth } from "firebase/auth";
import { app } from "@/libs/firebase-client";
import { toast } from "react-hot-toast";

const NotificationSettings = ({ userEmail }) => {
  const [notifications, setNotifications] = useState({
    surplus: false,
    discounts: false,
    restaurants: false,
  });
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch user's notification preferences
  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const auth = getAuth(app);
        const user = auth.currentUser;
        if (!user) {
          setLoading(false);
          return;
        }

        const token = await user.getIdToken();
        const response = await fetch("/api/notifications/preferences/get", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch preferences");
        }

        const data = await response.json();
        setNotifications({
          surplus: data.notificationPreferences?.surplus || false,
          discounts: data.notificationPreferences?.discounts || false,
          restaurants: data.notificationPreferences?.restaurants || false,
        });
      } catch (error) {
        console.error("Error fetching preferences:", error);
        toast.error("Failed to load notification preferences");
      } finally {
        setLoading(false);
      }
    };

    fetchPreferences();
  }, []);

  const sendNotification = async (type) => {
    try {
      const auth = getAuth(app);
      const user = auth.currentUser;
      if (!user) return;

      const token = await user.getIdToken();
      const response = await fetch("/api/notifications/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type,
          title: `${type.charAt(0).toUpperCase() + type.slice(1)} Notification`,
          message: `You have enabled ${type} notifications on YumCycle.`,
        }),
      });

      if (!response.ok) {
        console.error(
          `Failed to send ${type} notification:`,
          await response.text()
        );
      }
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  };

  const handleToggle = async (type) => {
    try {
      const auth = getAuth(app);
      const user = auth.currentUser;
      if (!user) {
        toast.error("Please log in to update notifications");
        return;
      }

      const newValue = !notifications[type];

      // Optimistically update UI
      setNotifications((prev) => ({
        ...prev,
        [type]: newValue,
      }));

      const token = await user.getIdToken();
      const response = await fetch("/api/notifications/preferences", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type,
          enabled: newValue,
        }),
      });

      if (!response.ok) {
        // Revert on error
        setNotifications((prev) => ({
          ...prev,
          [type]: !newValue,
        }));
        throw new Error("Failed to update notification settings");
      }

      // Send notification only if enabling the type
      if (newValue) {
        await sendNotification(type);
      }

      toast.success(
        `${type.charAt(0).toUpperCase() + type.slice(1)} notifications ${
          newValue ? "enabled" : "disabled"
        }`
      );
    } catch (error) {
      console.error("Error updating notification:", error);
      toast.error(error.message || "Failed to update notification settings");
    }
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

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl border border-orange-200 p-6 animate-pulse">
        <div className="h-12 bg-orange-100 rounded-xl w-32 mb-4"></div>
        <div className="h-4 bg-orange-100 rounded w-3/4"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl border border-orange-200 overflow-hidden"
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
              className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center shadow-lg"
            >
              <Bell className="h-6 w-6 text-white" />
            </motion.div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Surplus Notifications
              </h3>
              <p className="text-orange-700 text-sm">
                Stay updated on new surplus food opportunities
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {enabledCount > 0 && (
              <div className="px-3 py-1 bg-orange-500 text-white rounded-full text-sm font-medium">
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
                  className="bg-white rounded-xl p-4 shadow-sm border border-orange-100"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          isEnabled
                            ? "bg-orange-500 text-white"
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
                        isEnabled ? "bg-orange-500" : "bg-gray-300"
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
                          <Check className="h-3 w-3 text-orange-500" />
                        )}
                      </motion.div>
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Quick Enable All */}
          <div className="mt-6 pt-4 border-t border-orange-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                Enable all notifications for maximum savings
              </span>
              <button
                onClick={async () => {
                  const allEnabled = enabledCount === notificationTypes.length;
                  const newState = !allEnabled;
                  setNotifications({
                    surplus: newState,
                    discounts: newState,
                    restaurants: newState,
                  });

                  try {
                    const auth = getAuth(app);
                    const user = auth.currentUser;
                    if (!user) {
                      toast.error("Please log in to update notifications");
                      return;
                    }

                    const token = await user.getIdToken();
                    for (const type of notificationTypes.map((t) => t.key)) {
                      const response = await fetch(
                        "/api/notifications/preferences",
                        {
                          method: "PUT",
                          headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                          },
                          body: JSON.stringify({
                            type,
                            enabled: newState,
                          }),
                        }
                      );

                      if (!response.ok) {
                        throw new Error(
                          `Failed to update ${type} notification`
                        );
                      }

                      if (newState) {
                        await sendNotification(type);
                      }
                    }

                    toast.success(
                      `All notifications ${newState ? "enabled" : "disabled"}`
                    );
                  } catch (error) {
                    console.error("Error updating all notifications:", error);
                    setNotifications(notifications); // Revert to previous state
                    toast.error("Failed to update all notifications");
                  }
                }}
                className={`px-4 py-2 rounded-lg cursor-pointer font-medium text-sm transition-colors ${
                  enabledCount === notificationTypes.length
                    ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    : "bg-orange-500 text-white hover:bg-orange-600"
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
