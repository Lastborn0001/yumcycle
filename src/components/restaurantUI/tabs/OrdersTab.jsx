import { motion } from "framer-motion";
import { Package } from "lucide-react";
import OrderCard from "@/components/ui/OrderCard";

export default function OrdersTab({ orders, onUpdateStatus }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Orders</h2>
      {orders.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8 bg-white rounded-xl shadow-sm"
        >
          <Package className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
          <p>No orders yet</p>
        </motion.div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {orders.map((order) => (
            <motion.div
              key={order._id}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <OrderCard order={order} onUpdateStatus={onUpdateStatus} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
