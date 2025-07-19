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
  MdSave,
  MdCancel,
} from "react-icons/md";
import useEcommerceStore from "../store/FireflyStore";

// Loading Skeleton Components
const StatCardSkeleton = () => (
  <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
        <div className="h-8 bg-gray-200 rounded w-16"></div>
      </div>
      <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
    </div>
  </div>
);

const TableSkeleton = () => (
  <div className="bg-white rounded-lg shadow-sm animate-pulse">
    <div className="p-6 border-b border-gray-200">
      <div className="h-6 bg-gray-200 rounded w-32"></div>
    </div>
    <div className="p-6">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center space-x-4 py-4">
          <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="h-8 bg-gray-200 rounded w-20"></div>
        </div>
      ))}
    </div>
  </div>
);

const ProductCardSkeleton = () => (
  <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
    <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
    <div className="space-y-2">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      <div className="h-6 bg-gray-200 rounded w-16"></div>
    </div>
  </div>
);

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
    createProduct,
    updateProduct,
    updateUserRole,
    deleteUser,
    deleteProduct,
    updateOrderStatus,
    adminError,
    adminLoading,
    productsLoading,
    ordersLoading,
  } = useEcommerceStore();

  const [activeTab, setActiveTab] = useState("overview");
  const [showUserModal, setShowUserModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [userFilter, setUserFilter] = useState("all");
  const [orderFilter, setOrderFilter] = useState("all");
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);
  const [actionLoading, setActionLoading] = useState({
    userRole: null,
    userDelete: null,
    productDelete: null,
    orderStatus: null,
    productSave: false,
  });

  useEffect(() => {
    // Load admin data
    getAdminStats();
    getAllUsers();
    getAllProducts();
    getAllOrders();
  }, [getAdminStats, getAllUsers, getAllProducts, getAllOrders]);

  const handleUserRoleChange = async (userId, newRole) => {
    try {
      setActionLoading((prev) => ({ ...prev, userRole: userId }));
      await updateUserRole(userId, newRole);
      setShowUserModal(false);
    } catch (error) {
      console.error("Error updating user role:", error);
    } finally {
      setActionLoading((prev) => ({ ...prev, userRole: null }));
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        setActionLoading((prev) => ({ ...prev, userDelete: userId }));
        await deleteUser(userId);
        setShowUserModal(false);
      } catch (error) {
        console.error("Error deleting user:", error);
      } finally {
        setActionLoading((prev) => ({ ...prev, userDelete: null }));
      }
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        setActionLoading((prev) => ({ ...prev, productDelete: productId }));
        await deleteProduct(productId);
      } catch (error) {
        console.error("Error deleting product:", error);
      } finally {
        setActionLoading((prev) => ({ ...prev, productDelete: null }));
      }
    }
  };

  const handleOrderStatusChange = async (orderId, newStatus) => {
    try {
      setActionLoading((prev) => ({ ...prev, orderStatus: orderId }));
      await updateOrderStatus(orderId, newStatus);
    } catch (error) {
      console.error("Error updating order status:", error);
    } finally {
      setActionLoading((prev) => ({ ...prev, orderStatus: null }));
    }
  };

  const handleCreateProduct = () => {
    setSelectedProduct({
      name: "",
      description: "",
      price: "",
      category: "",
      gender: "",
      inventory: "",
      images: [],
      sizes: [],
      colors: [],
    });
    setIsCreatingProduct(true);
    setShowProductModal(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct({ ...product });
    setIsCreatingProduct(false);
    setShowProductModal(true);
  };

  const handleSaveProduct = async () => {
    try {
      setActionLoading((prev) => ({ ...prev, productSave: true }));
      if (isCreatingProduct) {
        await createProduct(selectedProduct);
      } else {
        await updateProduct(selectedProduct._id, selectedProduct);
      }
      setShowProductModal(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error("Error saving product:", error);
    } finally {
      setActionLoading((prev) => ({ ...prev, productSave: false }));
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
                {adminLoading
                  ? // Show skeleton loaders while loading
                    [...Array(4)].map((_, index) => (
                      <StatCardSkeleton key={index} />
                    ))
                  : statCards.map((stat, index) => (
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
                  {ordersLoading
                    ? // Show skeleton loader while loading
                      [...Array(5)].map((_, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
                        >
                          <div className="flex-1">
                            <div className="h-4 bg-gray-200 rounded w-24 mb-2 animate-pulse"></div>
                            <div className="h-3 bg-gray-200 rounded w-32 animate-pulse"></div>
                          </div>
                          <div className="text-right">
                            <div className="h-4 bg-gray-200 rounded w-16 mb-2 animate-pulse"></div>
                            <div className="h-6 bg-gray-200 rounded w-20 animate-pulse"></div>
                          </div>
                        </div>
                      ))
                    : orders.slice(0, 5).map((order) => (
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
                              ${order.totalPrice?.toFixed(2) || "0.00"}
                            </p>
                            <span
                              className={`inline-block px-2 py-1 text-xs rounded-full ${
                                order.status === "Delivered"
                                  ? "bg-green-100 text-green-800"
                                  : order.status === "Shipped"
                                  ? "bg-blue-100 text-blue-800"
                                  : order.status === "Processing"
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
                <button
                  onClick={handleCreateProduct}
                  className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-2"
                >
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
                      {productsLoading
                        ? // Show skeleton loaders while loading
                          [...Array(5)].map((_, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="h-10 w-10 rounded-lg bg-gray-200 animate-pulse"></div>
                                  <div className="ml-4">
                                    <div className="h-4 bg-gray-200 rounded w-32 mb-2 animate-pulse"></div>
                                    <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="h-6 bg-gray-200 rounded w-24 animate-pulse"></div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center space-x-2">
                                  <div className="h-6 w-6 bg-gray-200 rounded animate-pulse"></div>
                                  <div className="h-6 w-6 bg-gray-200 rounded animate-pulse"></div>
                                </div>
                              </td>
                            </tr>
                          ))
                        : products
                            .filter((product) =>
                              product.name
                                .toLowerCase()
                                .includes(searchTerm.toLowerCase())
                            )
                            .map((product) => (
                              <tr
                                key={product._id}
                                className="hover:bg-gray-50"
                              >
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
                                    <button
                                      onClick={() => handleEditProduct(product)}
                                      className="text-orange-600 hover:text-orange-900"
                                    >
                                      <MdEdit />
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleDeleteProduct(product._id)
                                      }
                                      disabled={
                                        actionLoading.productDelete ===
                                        product._id
                                      }
                                      className={`text-red-600 hover:text-red-900 ${
                                        actionLoading.productDelete ===
                                        product._id
                                          ? "opacity-50 cursor-not-allowed"
                                          : ""
                                      }`}
                                    >
                                      {actionLoading.productDelete ===
                                      product._id ? (
                                        <div className="animate-spin h-4 w-4 border-2 border-red-600 border-t-transparent rounded-full"></div>
                                      ) : (
                                        <MdDelete />
                                      )}
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
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
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
                      {ordersLoading
                        ? // Show skeleton loaders while loading
                          [...Array(5)].map((_, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="h-6 bg-gray-200 rounded w-20 animate-pulse"></div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
                              </td>
                            </tr>
                          ))
                        : filteredOrders.map((order) => (
                            <tr key={order._id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                #{order._id.slice(-6)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {order.user?.name || "Unknown User"}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                ${order.totalPrice?.toFixed(2) || "0.00"}
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
                                  disabled={
                                    actionLoading.orderStatus === order._id
                                  }
                                  className={`text-xs rounded-full px-2 py-1 border-none ${
                                    actionLoading.orderStatus === order._id
                                      ? "opacity-50 cursor-not-allowed"
                                      : ""
                                  } ${
                                    order.status === "Delivered"
                                      ? "bg-green-100 text-green-800"
                                      : order.status === "Shipped"
                                      ? "bg-blue-100 text-blue-800"
                                      : order.status === "Processing"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-gray-100 text-gray-800"
                                  }`}
                                >
                                  {actionLoading.orderStatus === order._id ? (
                                    <option>Updating...</option>
                                  ) : (
                                    <>
                                      <option value="Pending">Pending</option>
                                      <option value="Processing">
                                        Processing
                                      </option>
                                      <option value="Shipped">Shipped</option>
                                      <option value="Delivered">
                                        Delivered
                                      </option>
                                      <option value="Cancelled">
                                        Cancelled
                                      </option>
                                    </>
                                  )}
                                </select>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <Link
                                  to={`/order/${order._id}`}
                                  className="text-orange-600 hover:text-orange-900"
                                >
                                  <MdVisibility />
                                </Link>
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
                      {adminLoading
                        ? // Show skeleton loaders while loading
                          [...Array(5)].map((_, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse"></div>
                                  <div className="ml-4">
                                    <div className="h-4 bg-gray-200 rounded w-24 mb-2 animate-pulse"></div>
                                    <div className="h-3 bg-gray-200 rounded w-32 animate-pulse"></div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="h-6 bg-gray-200 rounded w-20 animate-pulse"></div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center space-x-2">
                                  <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
                                  <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
                                </div>
                              </td>
                            </tr>
                          ))
                        : filteredUsers.map((user) => (
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
                                    user.isEmailVerified
                                      ? "bg-green-100 text-green-800"
                                      : "bg-yellow-100 text-yellow-800"
                                  }`}
                                >
                                  {user.isEmailVerified
                                    ? "Verified"
                                    : "Unverified"}
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
                                      disabled={
                                        actionLoading.userDelete === user._id
                                      }
                                      className={`text-red-600 hover:text-red-900 ${
                                        actionLoading.userDelete === user._id
                                          ? "opacity-50 cursor-not-allowed"
                                          : ""
                                      }`}
                                    >
                                      {actionLoading.userDelete === user._id ? (
                                        <div className="animate-spin h-4 w-4 border-2 border-red-600 border-t-transparent rounded-full"></div>
                                      ) : (
                                        <MdDelete />
                                      )}
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
                Admin Settings
              </h1>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* General Settings */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    General Settings
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Store Name
                      </label>
                      <input
                        type="text"
                        defaultValue="Firefly E-commerce"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contact Email
                      </label>
                      <input
                        type="email"
                        defaultValue="admin@firefly.com"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors">
                      Save Changes
                    </button>
                  </div>
                </div>

                {/* Order Settings */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Order Settings
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Auto-cancel orders after (hours)
                      </label>
                      <input
                        type="number"
                        defaultValue="24"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Low stock threshold
                      </label>
                      <input
                        type="number"
                        defaultValue="10"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors">
                      Save Changes
                    </button>
                  </div>
                </div>

                {/* System Information */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:col-span-2">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    System Information
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Total Products</p>
                      <p className="text-lg font-semibold">{products.length}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Orders</p>
                      <p className="text-lg font-semibold">{orders.length}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Users</p>
                      <p className="text-lg font-semibold">{allUsers.length}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">System Status</p>
                      <p className="text-lg font-semibold text-green-600">
                        Online
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* User Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
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
                  disabled={actionLoading.userRole === selectedUser._id}
                  className={`flex-1 px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2 ${
                    actionLoading.userRole === selectedUser._id
                      ? "bg-orange-400 text-white cursor-not-allowed"
                      : "bg-orange-600 text-white hover:bg-orange-700"
                  }`}
                >
                  {actionLoading.userRole === selectedUser._id ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save Changes</span>
                  )}
                </button>
                <button
                  onClick={() => setShowUserModal(false)}
                  disabled={actionLoading.userRole === selectedUser._id}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Product Modal */}
      {showProductModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {isCreatingProduct ? "Add New Product" : "Edit Product"}
              </h3>
              <button
                onClick={() => setShowProductModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <MdClose />
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    value={selectedProduct.name}
                    onChange={(e) =>
                      setSelectedProduct({
                        ...selectedProduct,
                        name: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={selectedProduct.price}
                    onChange={(e) =>
                      setSelectedProduct({
                        ...selectedProduct,
                        price: parseFloat(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={selectedProduct.category}
                    onChange={(e) =>
                      setSelectedProduct({
                        ...selectedProduct,
                        category: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Select Category</option>
                    <option value="clothing">Clothing</option>
                    <option value="shoes">Shoes</option>
                    <option value="accessories">Accessories</option>
                    <option value="electronics">Electronics</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender
                  </label>
                  <select
                    value={selectedProduct.gender}
                    onChange={(e) =>
                      setSelectedProduct({
                        ...selectedProduct,
                        gender: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Select Gender</option>
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                    <option value="unisex">Unisex</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Inventory *
                  </label>
                  <input
                    type="number"
                    value={selectedProduct.inventory}
                    onChange={(e) =>
                      setSelectedProduct({
                        ...selectedProduct,
                        inventory: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Images (URLs, comma-separated)
                  </label>
                  <input
                    type="text"
                    value={selectedProduct.images?.join(", ") || ""}
                    onChange={(e) =>
                      setSelectedProduct({
                        ...selectedProduct,
                        images: e.target.value
                          .split(",")
                          .map((url) => url.trim())
                          .filter((url) => url),
                      })
                    }
                    placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={selectedProduct.description}
                  onChange={(e) =>
                    setSelectedProduct({
                      ...selectedProduct,
                      description: e.target.value,
                    })
                  }
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={handleSaveProduct}
                  disabled={actionLoading.productSave}
                  className={`flex-1 px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2 ${
                    actionLoading.productSave
                      ? "bg-orange-400 text-white cursor-not-allowed"
                      : "bg-orange-600 text-white hover:bg-orange-700"
                  }`}
                >
                  {actionLoading.productSave ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <MdSave />
                      <span>
                        {isCreatingProduct ? "Create Product" : "Save Changes"}
                      </span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => setShowProductModal(false)}
                  disabled={actionLoading.productSave}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors flex items-center justify-center space-x-2"
                >
                  <MdCancel />
                  <span>Cancel</span>
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
