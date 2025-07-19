import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  MdDashboard,
  MdShoppingBag,
  MdPerson,
  MdLocationOn,
  MdLogout,
  MdEdit,
  MdVisibility,
  MdLocalShipping,
  MdPayment,
  MdStar,
  MdTrendingUp,
  MdSettings,
  MdHistory,
  MdFavorite,
  MdShoppingCart,
  MdReceipt,
  MdSecurity,
} from "react-icons/md";
import useEcommerceStore from "../store/FireflyStore";

const DashboardPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    user,
    isAuthenticated,
    logout,
    myOrders,
    getMyOrders,
    ordersLoading,
    cartItemsCount,
  } = useEcommerceStore();

  // Get tab from URL params or default to overview
  const urlParams = new URLSearchParams(location.search);
  const tabFromUrl = urlParams.get("tab") || "overview";

  const [activeTab, setActiveTab] = useState(tabFromUrl);
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    // Fetch user orders
    getMyOrders();

    // Set greeting based on time
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, [isAuthenticated, navigate, getMyOrders]);

  // Update active tab when URL changes
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab") || "overview";
    setActiveTab(tabFromUrl);
  }, [location.search]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getOrderStats = () => {
    const stats = {
      total: myOrders.length,
      pending: myOrders.filter((order) => order.status === "pending").length,
      delivered: myOrders.filter((order) => order.status === "delivered")
        .length,
      cancelled: myOrders.filter((order) => order.status === "cancelled")
        .length,
    };
    return stats;
  };

  const getTotalSpent = () => {
    return myOrders
      .filter((order) => order.status === "delivered")
      .reduce((total, order) => total + order.totalAmount, 0);
  };

  const getRecentOrders = () => {
    return myOrders
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 3);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const sidebarItems = [
    { id: "overview", label: "Overview", icon: MdDashboard },
    { id: "orders", label: "My Orders", icon: MdShoppingBag },
    { id: "profile", label: "Profile", icon: MdPerson },
    { id: "addresses", label: "Addresses", icon: MdLocationOn },
  ];

  const quickActions = [
    {
      title: "Track Order",
      description: "Track your recent orders",
      icon: MdLocalShipping,
      action: () => setActiveTab("orders"),
      color: "bg-blue-500",
    },
    {
      title: "View Profile",
      description: "View your account details",
      icon: MdPerson,
      action: () => setActiveTab("profile"),
      color: "bg-green-500",
    },
    {
      title: "View Cart",
      description: `${cartItemsCount} items in cart`,
      icon: MdShoppingCart,
      action: () => navigate("/collections"),
      color: "bg-orange-500",
    },
    {
      title: "Browse Products",
      description: "Discover new arrivals",
      icon: MdTrendingUp,
      action: () => navigate("/collections"),
      color: "bg-purple-500",
    },
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-6 rounded-xl">
        <h2 className="text-2xl font-bold mb-2">
          {greeting}, {user?.name}! 👋
        </h2>
        <p className="text-orange-100">
          Welcome back to your dashboard. Here's what's happening with your
          account.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <MdShoppingBag className="text-xl text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              {getOrderStats().total}
            </span>
          </div>
          <h3 className="font-semibold text-gray-900">Total Orders</h3>
          <p className="text-sm text-gray-600">All time purchases</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <MdReceipt className="text-xl text-green-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              ${getTotalSpent().toFixed(2)}
            </span>
          </div>
          <h3 className="font-semibold text-gray-900">Total Spent</h3>
          <p className="text-sm text-gray-600">Lifetime value</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-orange-100 p-3 rounded-lg">
              <MdShoppingCart className="text-xl text-orange-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              {cartItemsCount}
            </span>
          </div>
          <h3 className="font-semibold text-gray-900">Cart Items</h3>
          <p className="text-sm text-gray-600">Ready to checkout</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <MdStar className="text-xl text-purple-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">4.8</span>
          </div>
          <h3 className="font-semibold text-gray-900">Member Rating</h3>
          <p className="text-sm text-gray-600">Customer satisfaction</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow text-left group"
            >
              <div
                className={`inline-flex p-3 rounded-lg ${action.color} text-white mb-4 group-hover:scale-110 transition-transform`}
              >
                <action.icon className="text-xl" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">
                {action.title}
              </h4>
              <p className="text-sm text-gray-600">{action.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Orders */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
          <button
            onClick={() => setActiveTab("orders")}
            className="text-orange-600 hover:text-orange-500 text-sm font-medium"
          >
            View All
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          {ordersLoading ? (
            <div className="p-8 text-center">
              <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading orders...</p>
            </div>
          ) : getRecentOrders().length > 0 ? (
            <div className="divide-y divide-gray-200">
              {getRecentOrders().map((order) => (
                <div
                  key={order._id}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">
                        Order #{order._id.slice(-8)}
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        ${order.totalAmount.toFixed(2)}
                      </p>
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <MdShoppingBag className="text-4xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No orders yet</p>
              <Link
                to="/collections"
                className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
              >
                Start Shopping
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">My Orders</h2>
        <Link
          to="/collections"
          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
        >
          Shop More
        </Link>
      </div>

      {/* Order Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border text-center">
          <div className="text-2xl font-bold text-gray-900">
            {getOrderStats().total}
          </div>
          <div className="text-sm text-gray-600">Total</div>
        </div>
        <div className="bg-white p-4 rounded-lg border text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {getOrderStats().pending}
          </div>
          <div className="text-sm text-gray-600">Pending</div>
        </div>
        <div className="bg-white p-4 rounded-lg border text-center">
          <div className="text-2xl font-bold text-green-600">
            {getOrderStats().delivered}
          </div>
          <div className="text-sm text-gray-600">Delivered</div>
        </div>
        <div className="bg-white p-4 rounded-lg border text-center">
          <div className="text-2xl font-bold text-red-600">
            {getOrderStats().cancelled}
          </div>
          <div className="text-sm text-gray-600">Cancelled</div>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-xl shadow-sm border">
        {ordersLoading ? (
          <div className="p-8 text-center">
            <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading orders...</p>
          </div>
        ) : myOrders.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {myOrders.map((order) => (
              <div key={order._id} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Order #{order._id.slice(-8)}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Ordered on{" "}
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      ${order.totalAmount.toFixed(2)}
                    </p>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  {order.items?.slice(0, 2).map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 text-sm text-gray-600"
                    >
                      <span>•</span>
                      <span>{item.productName || `Product ${index + 1}`}</span>
                      <span>x{item.quantity}</span>
                    </div>
                  ))}
                  {order.items?.length > 2 && (
                    <p className="text-sm text-gray-500">
                      + {order.items.length - 2} more items
                    </p>
                  )}
                </div>

                <div className="mt-4 flex gap-2">
                  <button className="text-orange-600 hover:text-orange-500 text-sm font-medium">
                    View Details
                  </button>
                  {order.status === "delivered" && (
                    <button className="text-green-600 hover:text-green-500 text-sm font-medium">
                      Write Review
                    </button>
                  )}
                  {order.status === "pending" && (
                    <button className="text-red-600 hover:text-red-500 text-sm font-medium">
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <MdShoppingBag className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No orders yet
            </h3>
            <p className="text-gray-600 mb-6">
              You haven't placed any orders yet. Start shopping to see your
              orders here.
            </p>
            <Link
              to="/collections"
              className="bg-orange-500 text-white px-8 py-3 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );

  const renderProfile = () => {
    const memberSince = user?.createdAt
      ? new Date(user.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "Not available";

    const totalOrdersCount = myOrders?.length || 0;
    const completedOrders =
      myOrders?.filter((order) => order.status === "Delivered")?.length || 0;
    const totalSpent =
      myOrders?.reduce((sum, order) => sum + (order.totalAmount || 0), 0) || 0;

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <MdPerson className="text-orange-500" />
          Account Profile
        </h2>

        {/* Profile Header Card */}
        <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl p-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <MdPerson className="text-3xl text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">{user?.name || "User"}</h3>
              <p className="text-orange-100">
                {user?.email || "No email provided"}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-sm text-orange-100">Active Member</span>
              </div>
            </div>
          </div>
        </div>

        {/* Account Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MdPerson className="text-orange-500" />
              Personal Information
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Full Name
                </label>
                <div className="text-gray-900 font-medium">
                  {user?.name || "Not provided"}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Email Address
                </label>
                <div className="text-gray-900 font-medium">
                  {user?.email || "Not provided"}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Account Type
                </label>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user?.role === "admin"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {user?.role === "admin" ? "Administrator" : "Customer"}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Member Since
                </label>
                <div className="text-gray-900 font-medium">{memberSince}</div>
              </div>
            </div>
          </div>

          {/* Account Statistics */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MdTrendingUp className="text-orange-500" />
              Account Statistics
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <MdReceipt className="text-blue-500" />
                  <span className="text-gray-700">Total Orders</span>
                </div>
                <span className="font-semibold text-gray-900">
                  {totalOrdersCount}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <MdLocalShipping className="text-green-500" />
                  <span className="text-gray-700">Completed Orders</span>
                </div>
                <span className="font-semibold text-gray-900">
                  {completedOrders}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <MdPayment className="text-orange-500" />
                  <span className="text-gray-700">Total Spent</span>
                </div>
                <span className="font-semibold text-gray-900">
                  ${totalSpent.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <MdShoppingCart className="text-purple-500" />
                  <span className="text-gray-700">Items in Cart</span>
                </div>
                <span className="font-semibold text-gray-900">
                  {cartItemsCount}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Account Status & Security */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <MdSecurity className="text-orange-500" />
            Account Security & Status
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Account Status</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Account Active</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Email Verified</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">
                    Regular Customer
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">
                Security Information
              </h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">
                    Secure Password Set
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">
                    Two-Factor Authentication: Disabled
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">
                    Account Recovery Enabled
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <MdSettings className="text-orange-500" />
            Quick Actions
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              onClick={() => setActiveTab("orders")}
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <MdHistory className="text-xl text-blue-500" />
              <div>
                <div className="font-medium text-gray-900">Order History</div>
                <div className="text-sm text-gray-500">
                  View all your orders
                </div>
              </div>
            </button>

            <Link
              to="/collections"
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <MdShoppingBag className="text-xl text-green-500" />
              <div>
                <div className="font-medium text-gray-900">Shop Now</div>
                <div className="text-sm text-gray-500">Browse our products</div>
              </div>
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-red-50 transition-colors text-left"
            >
              <MdLogout className="text-xl text-red-500" />
              <div>
                <div className="font-medium text-gray-900">Sign Out</div>
                <div className="text-sm text-gray-500">Logout from account</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Access Denied
          </h2>
          <p className="text-gray-600 mb-6">
            Please sign in to access your dashboard.
          </p>
          <Link
            to="/login"
            className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return renderOverview();
      case "orders":
        return renderOrders();
      case "profile":
        return renderProfile();
      case "addresses":
        return (
          <div className="text-center py-12 text-gray-500">
            Address management coming soon...
          </div>
        );
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link
                to="/"
                className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent"
              >
                Firefly
              </Link>
              <span className="ml-4 text-gray-400">|</span>
              <span className="ml-4 text-gray-600">Dashboard</span>
            </div>

            <div className="flex items-center gap-4">
              <Link
                to="/collections"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Continue Shopping
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors"
              >
                <MdLogout />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {user?.name?.charAt(0) || "U"}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{user?.name}</p>
                  <p className="text-sm text-gray-600">Member</p>
                </div>
              </div>

              <nav className="space-y-2">
                {sidebarItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === item.id
                        ? "bg-orange-50 text-orange-600 border border-orange-200"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <item.icon className="text-xl" />
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
