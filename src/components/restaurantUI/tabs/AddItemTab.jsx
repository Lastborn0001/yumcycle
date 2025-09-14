import { motion } from "framer-motion";
import MenuItemForm from "@/components/ui/MenuItemForm";

export default function AddItemTab({ onSubmit, restaurantId }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Add New Menu Item</h2>
      <MenuItemForm onSubmit={onSubmit} restaurantId={restaurantId} />
    </div>
  );
}
