"use client";
import { Bell, CheckCircle, XCircle, Info } from "lucide-react";
import { Buttons } from "@/components/ui/Buttons";

export default function NotificationList({ notifications, onMarkAsRead }) {
  const getNotificationIcon = (type) => {
    switch (type) {
      case "order":
        return <Bell className="h-5 w-5 text-blue-500" />;
      case "system":
        return <Info className="h-5 w-5 text-yellow-500" />;
      case "promotion":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Notifications
        </h3>
      </div>
      <div className="divide-y divide-gray-200">
        {notifications.length === 0 ? (
          <div className="px-4 py-5 sm:p-6 text-center text-gray-500">
            No notifications
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification._id}
              className={`px-4 py-4 sm:px-6 ${
                !notification.read ? "bg-blue-50" : ""
              }`}
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-1">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex justify-between">
                    <p className="text-sm font-medium text-gray-900">
                      {notification.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(notification.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {notification.message}
                  </p>
                  {!notification.read && (
                    <Buttons
                      variant="ghost"
                      size="sm"
                      className="mt-2"
                      onClick={() => onMarkAsRead(notification._id)}
                    >
                      Mark as read
                    </Buttons>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
