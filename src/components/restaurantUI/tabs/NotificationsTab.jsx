import { motion } from "framer-motion";
import NotificationList from "@/components/ui/NotificationList";

export default function NotificationsTab({ notifications, onMarkAsRead }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Notifications</h2>
      <NotificationList
        notifications={notifications}
        onMarkAsRead={onMarkAsRead}
      />
    </div>
  );
}
