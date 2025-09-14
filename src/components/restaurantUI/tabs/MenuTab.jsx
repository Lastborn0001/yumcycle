import { motion } from "framer-motion";
import MenuItemList from "@/components/ui/MenuItemList";

export default function MenuTab({ items, restaurantId }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Menu Items</h2>
      <MenuItemList items={items} restaurantId={restaurantId} />
    </div>
  );
}
