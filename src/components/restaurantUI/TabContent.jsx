import { motion, AnimatePresence } from "framer-motion";
import OrdersTab from "./tabs/OrdersTab";
import MenuTab from "./tabs/MenuTab";
import AddItemTab from "./tabs/AddItemTab";
import NotificationsTab from "./tabs/NotificationsTab";

const tabVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export default function TabContent({
  activeTab,
  orders,
  menuItems,
  notifications,
  restaurant,
  handlers,
}) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeTab}
        variants={tabVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ duration: 0.3 }}
      >
        {activeTab === "orders" && (
          <OrdersTab
            orders={orders}
            onUpdateStatus={handlers.handleUpdateOrderStatus}
          />
        )}
        {activeTab === "menu" && (
          <MenuTab items={menuItems} restaurantId={restaurant._id} />
        )}
        {activeTab === "add-item" && (
          <AddItemTab
            onSubmit={handlers.addMenuItem}
            restaurantId={restaurant._id}
          />
        )}
        {activeTab === "notifications" && (
          <NotificationsTab
            notifications={notifications}
            onMarkAsRead={handlers.markNotificationAsRead}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
}
