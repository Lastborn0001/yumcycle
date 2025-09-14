import { motion, AnimatePresence } from "framer-motion";
import TabNavigation from "./TabNavigation";
import OrdersTab from "./tabs/OrdersTab";
import MenuTab from "./tabs/MenuTab";
import AddItemTab from "./tabs/AddItemTab";
import NotificationsTab from "./tabs/NotificationsTab";

export default function DashboardContent({ state, setState, handlers }) {
  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <RestaurantProfile restaurant={state.restaurant} />
      <TabNavigation
        activeTab={state.activeTab}
        onTabChange={(tab) => setState((prev) => ({ ...prev, activeTab: tab }))}
      />

      <div className="mt-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={state.activeTab}
            variants={tabVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            {renderActiveTab(state, handlers)}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}
