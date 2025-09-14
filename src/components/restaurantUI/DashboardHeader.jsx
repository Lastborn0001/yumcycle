import { motion } from "framer-motion";
import { Bell, LogOut } from "lucide-react";

export default function DashboardHeader({
  restaurant,
  notifications,
  onProfileOpen,
  onLogout,
}) {
  return (
    <header className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-bold text-gray-900"
        >
          {restaurant.name} Dashboard
        </motion.h1>
        <HeaderControls
          notifications={notifications}
          onProfileOpen={onProfileOpen}
          onLogout={onLogout}
        />
      </div>
    </header>
  );
}
