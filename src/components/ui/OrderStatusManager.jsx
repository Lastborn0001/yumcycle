import { CheckCircle, Clock, Truck, UtensilsCrossed } from "lucide-react";

const statusOptions = [
  { value: "pending", label: "Pending", icon: Clock, color: "text-yellow-500" },
  {
    value: "preparing",
    label: "Preparing",
    icon: UtensilsCrossed,
    color: "text-blue-500",
  },
  {
    value: "in-transit",
    label: "In Transit",
    icon: Truck,
    color: "text-purple-500",
  },
  {
    value: "delivered",
    label: "Delivered",
    icon: CheckCircle,
    color: "text-green-500",
  },
];

export default function OrderStatusManager({
  currentStatus,
  onStatusChange,
  className = "",
}) {
  const getStatusIndex = (status) => {
    return statusOptions.findIndex((opt) => opt.value === status);
  };

  const currentIndex = getStatusIndex(currentStatus);

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <div className="flex items-center justify-between w-full">
        {statusOptions.map((status, index) => {
          const StatusIcon = status.icon;
          const isCompleted = index <= currentIndex;
          const isActive = index === currentIndex;

          return (
            <div
              key={status.value}
              className="flex flex-col items-center gap-2"
            >
              <button
                onClick={() => onStatusChange(status.value)}
                disabled={index > currentIndex + 1}
                className={`relative flex items-center justify-center w-10 h-10 rounded-full transition-all
                  ${
                    isCompleted
                      ? "bg-black text-white"
                      : "bg-gray-100 text-gray-400"
                  }
                  ${isActive ? "ring-2 ring-black ring-offset-2" : ""}
                  ${
                    index <= currentIndex + 1
                      ? "hover:bg-gray-800 hover:text-white cursor-pointer"
                      : "cursor-not-allowed"
                  }
                `}
              >
                <StatusIcon className="w-5 h-5" />
              </button>
              <span
                className={`text-xs font-medium ${
                  isCompleted ? "text-black" : "text-gray-400"
                }`}
              >
                {status.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
