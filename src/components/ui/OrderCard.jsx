"use client";
import { Clock, CheckCircle, XCircle, Truck, Package } from "lucide-react";
import { Buttons } from "@/components/ui/Buttons";

export default function OrderCard({ order, onUpdateStatus }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "preparing":
        return "bg-blue-100 text-blue-800";
      case "ready":
        return "bg-green-100 text-green-800";
      case "delivered":
        return "bg-purple-100 text-purple-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Order #{order._id.slice(-6).toUpperCase()}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {formatDate(order.createdAt)}
          </p>
        </div>
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
            order.status
          )}`}
        >
          {order.status}
        </span>
      </div>
      <div className="px-4 py-5 sm:p-6">
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-500">Customer</h4>
          <p className="mt-1 text-sm text-gray-900">
            {order.user.name} ({order.user.email})
          </p>
          <p className="mt-1 text-sm text-gray-900">{order.deliveryAddress}</p>
        </div>

        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-500">Items</h4>
          <ul className="mt-1 divide-y divide-gray-200">
            {order.items.map((item, index) => (
              <li key={index} className="py-2 flex justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {item.quantity}x {item.menuItem.name}
                  </p>
                  {item.specialInstructions && (
                    <p className="text-xs text-gray-500">
                      Note: {item.specialInstructions}
                    </p>
                  )}
                </div>
                <p className="text-sm text-gray-900">
                  ₦{(item.price * item.quantity).toFixed(2)}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex justify-between items-center border-t border-gray-200 pt-4">
          <p className="text-sm font-medium text-gray-900">
            Total: ₦{order.totalAmount.toFixed(2)}
          </p>
          <div className="flex space-x-2">
            {order.status === "pending" && (
              <>
                <Buttons
                  variant="outline"
                  onClick={() => onUpdateStatus(order._id, "preparing")}
                >
                  <CheckCircle className="mr-2 h-4 w-4" /> Accept
                </Buttons>
                <Buttons
                  variant="outline"
                  onClick={() => onUpdateStatus(order._id, "cancelled")}
                >
                  <XCircle className="mr-2 h-4 w-4" /> Reject
                </Buttons>
              </>
            )}
            {order.status === "preparing" && (
              <Buttons onClick={() => onUpdateStatus(order._id, "ready")}>
                <Package className="mr-2 h-4 w-4" /> Ready for Pickup
              </Buttons>
            )}
            {order.status === "ready" && (
              <Buttons onClick={() => onUpdateStatus(order._id, "delivered")}>
                <Truck className="mr-2 h-4 w-4" /> Mark as Delivered
              </Buttons>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
