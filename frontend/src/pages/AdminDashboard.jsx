import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  MdDashboard,
  MdShoppingBag,
  MdPeople,
  MdAssignment,
  MdSettings,
  MdLogout,
  MdTrendingUp,
  MdShoppingCart,
  MdAttachMoney,
  MdInventory,
  MdAdd,
  MdEdit,
  MdDelete,
  MdVisibility,
  MdMoreVert,
  MdSearch,
  MdFilterList,
  MdRefresh,
  MdClose,
} from "react-icons/md";
import useEcommerceStore from "../store/FireflyStore";

const AdminDashboard = () => {
  const {
    user,
    logout,
    adminStats,
    allUsers,
    products,
    orders,
    getAdminStats,
    getAllUsers,
    getAllProducts,
    getAllOrders,
    updateUserRole,
    deleteUser,
    deleteProduct,
    updateOrderStatus,
    adminError,
  } = useEcommerceStore();

  const [activeTab, setActiveTab] = useState("overview");
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [userFilter, setUserFilter] = useState("all");
  const [orderFilter, setOrderFilter] = useState("all");

  useEffect(() => {
    // Load admin data
    getAdminStats();
    getAllUsers();
    getAllProducts();
    getAllOrders();
  }, [getAdminStats, getAllUsers, getAllProducts, getAllOrders]);

  const handleUserRoleChange = async (userId, newRole) => {
    try {
      await updateUserRole(userId, newRole);
      setShowUserModal(false);
    } catch (error) {
      console.error("Error updating user role:", error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(userId);
        setShowUserModal(false);
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(productId);
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  const handleOrderStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const filteredUsers = allUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = userFilter === "all" || user.role === userFilter;
    return matchesSearch && matchesFilter;
  });

  const filteredOrders = orders.filter((order) => {
    const matchesFilter = orderFilter === "all" || order.status === orderFilter;
    return matchesFilter;
  });

  const sidebarItems = [
    { id: "overview", label: "Overview", icon: MdDashboard },
    { id: "products", label: "Products", icon: MdShoppingBag },
    { id: "orders", label: "Orders", icon: MdAssignment },
    { id: "users", label: "Users", icon: MdPeople },
    { id: "settings", label: "Settings", icon: MdSettings },
  ];

  const statCards = [
    {
      title: "Total Revenue",
      value: `$${adminStats.totalRevenue?.toLocaleString() || 0}`,
      icon: MdAttachMoney,
      color: "bg-green-500",
      change: "+12.5%",
    },
    {
      title: "Total Orders",
      value: adminStats.totalOrders || 0,
      icon: MdShoppingCart,
      color: "bg-blue-500",
      change: "+8.2%",
    },
    {
      title: "Total Products",
      value: adminStats.totalProducts || products.length,
      icon: MdInventory,
      color: "bg-purple-500",
      change: "+3.1%",
    },
    {
      title: "Total Users",
      value: adminStats.totalUsers || allUsers.length,
      icon: MdPeople,
      color: "bg-orange-500",
      change: "+15.3%",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-orange-600">
                Firefly Admin
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user?.name}</span>
              <button
                onClick={logout}
                className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <MdLogout />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
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

        {/* Main Content */}
        <div className="flex-1 p-8">
          {adminError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{adminError}</p>
            </div>
          )}

          {/* Overview Tab */}
          {activeTab === "overview" && (
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
                        <p className="text-gray-600 text-sm font-medium">
                          {stat.title}
                        </p>
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
                  <h2 className="text-xl font-semibold text-gray-900">
                    Recent Orders
                  </h2>
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
                        <p className="font-medium text-gray-900">
                          ${order.totalAmount}
                        </p>
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
          )}

          {/* Products Tab */}
          {activeTab === "products" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Products</h1>
                <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-2">
                  <MdAdd />
                  <span>Add Product</span>
                </button>
              </div>

              {/* Products Table */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center space-x-4">
                    <div className="relative flex-1">
                      <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search products..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <button
                      onClick={() => getAllProducts()}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                    >
                      <MdRefresh />
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Product
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Stock
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {products
                        .filter((product) =>
                          product.name
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase())
                        )
                        .map((product) => (
                          <tr key={product._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <img
                                  className="h-10 w-10 rounded-lg object-cover"
                                  src={
                                    product.images?.[0] ||
                                    "/placeholder-image.svg"
                                  }
                                  alt={product.name}
                                />
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {product.name}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {product.slug}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              ${product.price}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {product.category}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  product.inventory > 10
                                    ? "bg-green-100 text-green-800"
                                    : product.inventory > 0
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {product.inventory} in stock
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex items-center space-x-2">
                                {/* Edit button removed: setSelectedProduct/setShowProductModal no longer used */}
                                <button
                                  onClick={() =>
                                    handleDeleteProduct(product._id)
                                  }
                                  className="text-red-600 hover:text-red-900"
                                >
                                  <MdDelete />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
                <div className="flex items-center space-x-4">
                  <select
                    value={orderFilter}
                    onChange={(e) => setOrderFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <button
                    onClick={() => getAllOrders()}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    <MdRefresh />
                  </button>
                </div>
              </div>

              {/* Orders Table */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Order ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredOrders.map((order) => (
                        <tr key={order._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            #{order._id.slice(-6)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {order.user?.name || "Unknown User"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${order.totalAmount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              value={order.status}
                              onChange={(e) =>
                                handleOrderStatusChange(
                                  order._id,
                                  e.target.value
                                )
                              }
                              className={`text-xs rounded-full px-2 py-1 border-none ${
                                order.status === "delivered"
                                  ? "bg-green-100 text-green-800"
                                  : order.status === "shipped"
                                  ? "bg-blue-100 text-blue-800"
                                  : order.status === "processing"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              <option value="pending">Pending</option>
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-orange-600 hover:text-orange-900">
                              <MdVisibility />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === "users" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Users</h1>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <select
                    value={userFilter}
                    onChange={(e) => setUserFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="all">All Roles</option>
                    <option value="user">Users</option>
                    <option value="admin">Admins</option>
                  </select>
                  <button
                    onClick={() => getAllUsers()}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    <MdRefresh />
                  </button>
                </div>
              </div>

              {/* Users Table */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Joined
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredUsers.map((user) => (
                        <tr key={user._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                                <span className="text-orange-600 font-medium">
                                  {user.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {user.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {user.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                user.role === "admin"
                                  ? "bg-purple-100 text-purple-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                user.isActive
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {user.isActive ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => {
                                  setSelectedUser(user);
                                  setShowUserModal(true);
                                }}
                                className="text-orange-600 hover:text-orange-900"
                              >
                                <MdEdit />
                              </button>
                              {user._id !== user._id && (
                                <button
                                  onClick={() => handleDeleteUser(user._id)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  <MdDelete />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-8">
                Settings
              </h1>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Admin Settings
                </h2>
                <p className="text-gray-600">
                  Settings and configuration options will be available here.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* User Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Edit User</h3>
              <button
                onClick={() => setShowUserModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <MdClose />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={selectedUser.name}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={selectedUser.email}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  defaultValue={selectedUser.role}
                  onChange={(e) => {
                    setSelectedUser({
                      ...selectedUser,
                      role: e.target.value,
                    });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() =>
                    handleUserRoleChange(selectedUser._id, selectedUser.role)
                  }
                  className="flex-1 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setShowUserModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
