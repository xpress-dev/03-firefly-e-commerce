import React from "react";

const AdminSidebar = ({ activeTab, setActiveTab, sidebarItems }) => (
  <div className="w-64 bg-white shadow-sm min-h-screen">
    <div className="p-6">
      <nav className="space-y-2">
        {sidebarItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors ${
              activeTab === item.id
                ? "bg-orange-100 text-orange-700 border-r-2 border-orange-600"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <item.icon className="text-xl" />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  </div>
);

export default AdminSidebar;
