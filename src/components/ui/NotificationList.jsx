import { Bell } from "lucide-react";

const NotificationList = ({ notifications, onMarkAsRead }) => {
  return (
    <div className="space-y-4">
      {notifications.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No notifications</div>
      ) : (
        notifications.map((notification) => (
          <div
            key={notification._id}
            className={`rounded-lg border p-4 ${
              notification.read ? "bg-gray-50" : "bg-white"
            }`}
          >
            <div className="flex items-start gap-3">
              <Bell className="h-5 w-5 text-orange-500 mt-1" />
              <div className="flex-1">
                <p className="font-medium">{notification.message}</p>
                <p className="text-sm text-gray-500">
                  Order #{notification.orderId.slice(-6)} - Placed on{" "}
                  {new Date(
                    notification.orderDetails.createdAt
                  ).toLocaleString()}
                </p>
                <div className="mt-2">
                  {notification.orderDetails.items.map((item) => (
                    <div
                      key={item._id}
                      className="flex justify-between text-sm text-gray-600"
                    >
                      <span>
                        {item.name} x {item.quantity}
                      </span>
                      <span>₦{item.price * item.quantity}</span>
                    </div>
                  ))}
                  <div className="mt-2 font-semibold">
                    Total: ₦{notification.orderDetails.total}
                  </div>
                </div>
                {!notification.read && (
                  <button
                    onClick={() => onMarkAsRead(notification._id)}
                    className="mt-2 text-sm text-orange-500 hover:underline cursor-pointer"
                  >
                    Mark as Read
                  </button>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default NotificationList;
