import React from "react";

const AdminOverview = ({ statCards, orders }) => (
  <div>
    <h1 className="text-3xl font-bold text-gray-900 mb-8">
      Dashboard Overview
    </h1>
    {/* Stats Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((stat, index) => (
        <div
          key={index}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stat.value}
              </p>
              <p className="text-green-600 text-sm mt-1">
                {stat.change} from last month
              </p>
            </div>
            <div className={`p-3 rounded-lg ${stat.color}`}>
              <stat.icon className="text-white text-2xl" />
            </div>
          </div>
        </div>
      ))}
    </div>
    {/* Recent Orders */}
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
      </div>
      <div className="p-6">
        {orders.slice(0, 5).map((order) => (
          <div
            key={order._id}
            className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
          >
            <div>
              <p className="font-medium text-gray-900">
                Order #{order._id.slice(-6)}
              </p>
              <p className="text-gray-600 text-sm">
                {order.user?.name || "Unknown User"}
              </p>
            </div>
            <div className="text-right">
              <p className="font-medium text-gray-900">${order.totalAmount}</p>
              <span
                className={`inline-block px-2 py-1 text-xs rounded-full ${
                  order.status === "delivered"
                    ? "bg-green-100 text-green-800"
                    : order.status === "shipped"
                    ? "bg-blue-100 text-blue-800"
                    : order.status === "processing"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {order.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default AdminOverview;
