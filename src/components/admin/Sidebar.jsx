import React from "react";
import {
  Users,
  Utensils,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Leaf,
} from "lucide-react";

const Sidebar = ({ activeView, setActiveView, collapsed, setCollapsed }) => {
  const menuItems = [
    {
      id: "restaurants",
      label: "Restaurants",
      icon: Utensils,
      description: "Manage restaurant approvals",
    },
    {
      id: "users",
      label: "Users",
      icon: Users,
      description: "Manage user accounts",
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: BarChart3,
      description: "View platform statistics",
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      description: "System configuration",
    },
  ];

  return (
    <div
      className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 shadow-sm transition-all duration-300 z-30 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Logo Section */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!collapsed && (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">Yumcycle</h1>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4 text-gray-600" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          )}
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="mt-6 px-3">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeView === item.id;

            return (
              <li key={item.id}>
                <button
                  onClick={() => {
                    console.log("Setting activeView to:", item.id); // Debug log
                    setActiveView(item.id);
                  }}
                  className={`w-full flex items-center px-3 py-3 rounded-lg text-left transition-all duration-200 group ${
                    isActive
                      ? "bg-orange-50 text-orange-700 border-r-2 border-orange-500"
                      : "text-gray-700 hover:bg-gray-50 hover:text-orange-600"
                  }`}
                  title={collapsed ? item.label : ""}
                >
                  <IconComponent
                    className={`w-5 h-5 ${
                      isActive
                        ? "text-orange-600"
                        : "text-gray-500 group-hover:text-orange-600"
                    } ${collapsed ? "mx-auto" : "mr-3"}`}
                  />

                  {!collapsed && (
                    <div className="flex-1">
                      <div className="font-medium text-sm">{item.label}</div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {item.description}
                      </div>
                    </div>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom Section */}
      {!collapsed && (
        <div className="absolute bottom-6 left-0 right-0 px-3">
          <div className="bg-orange-50 rounded-lg p-4">
            <div className="text-sm font-medium text-orange-900 mb-1">
              Need Help?
            </div>
            <div className="text-xs text-orange-700 mb-3">
              Contact support for assistance
            </div>
            <button className="text-xs text-orange-600 hover:text-orange-700 font-medium">
              Get Support →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
