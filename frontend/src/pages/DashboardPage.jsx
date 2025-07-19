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
  MdMenu,
  MdClose,
  MdArrowBack,
  MdEmail,
  MdPhone,
  MdCalendarToday,
} from "react-icons/md";
import useEcommerceStore from "../store/FireflyStore";
import AddressesManager from "../components/AddressesManager";
import FavoritesPage from "./FavoritesPage";

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
    authLoading,
    resendVerificationEmail,
    addresses,
    getUserAddresses,
    favoriteCount,
    getFavoriteCount,
  } = useEcommerceStore();

  // Get tab from URL params or default to overview
  const urlParams = new URLSearchParams(location.search);
  const tabFromUrl = urlParams.get("tab") || "overview";

  const [activeTab, setActiveTab] = useState(tabFromUrl);
  const [greeting, setGreeting] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    // Fetch user orders, addresses, and favorite count
    getMyOrders();
    getUserAddresses();
    getFavoriteCount();

    // Set greeting based on time
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, [
    isAuthenticated,
    navigate,
    getMyOrders,
    getUserAddresses,
    getFavoriteCount,
  ]);

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

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
    // Update URL without page reload
    const newUrl = new URL(window.location);
    newUrl.searchParams.set("tab", tab);
    window.history.pushState({}, "", newUrl);
  };

  const getOrderStats = () => {
    const stats = {
      total: myOrders.length,
      pending: myOrders.filter((order) => order.status === "Pending").length,
      delivered: myOrders.filter((order) => order.status === "Delivered")
        .length,
      cancelled: myOrders.filter((order) => order.status === "Cancelled")
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
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Processing":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Shipped":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "Cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const sidebarItems = [
    { id: "overview", label: "Overview", icon: MdDashboard },
    { id: "orders", label: "My Orders", icon: MdShoppingBag },
    {
      id: "favorites",
      label: `Favorites (${favoriteCount})`,
      icon: MdFavorite,
    },
    { id: "profile", label: "Profile", icon: MdPerson },
    { id: "addresses", label: "Addresses", icon: MdLocationOn },
  ];

  const quickActions = [
    {
      title: "Track Order",
      description: "Track your recent orders",
      icon: MdLocalShipping,
      action: () => handleTabChange("orders"),
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "My Favorites",
      description: `${favoriteCount} saved products`,
      icon: MdFavorite,
      action: () => handleTabChange("favorites"),
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-50",
      iconColor: "text-red-600",
    },
    {
      title: "View Profile",
      description: "View your account details",
      icon: MdPerson,
      action: () => handleTabChange("profile"),
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      title: "Manage Addresses",
      description: "Add or edit delivery addresses",
      icon: MdLocationOn,
      action: () => handleTabChange("addresses"),
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      title: "View Cart",
      description: `${cartItemsCount} items in cart`,
      icon: MdShoppingCart,
      action: () => navigate("/collections"),
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
    },
    {
      title: "Continue Shopping",
      description: "Browse our products",
      icon: MdShoppingBag,
      action: () => navigate("/collections"),
      color: "from-indigo-500 to-indigo-600",
      bgColor: "bg-indigo-50",
      iconColor: "text-indigo-600",
    },
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 text-white p-6 lg:p-8 rounded-2xl shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold mb-2">
              {greeting}, {user?.name}! 👋
            </h2>
            <p className="text-orange-100 text-lg">
              Welcome back to your dashboard. Here's what's happening with your
              account.
            </p>
          </div>
          <div className="hidden lg:block">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold">
                {user?.name?.charAt(0) || "U"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Email Verification Notice */}
      {user && !user.isEmailVerified && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 p-6 rounded-2xl shadow-sm">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <MdEmail className="text-yellow-600 text-xl" />
              </div>
            </div>
            <div className="ml-4 flex-1">
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                Email Verification Required
              </h3>
              <p className="text-yellow-700 mb-4">
                Please verify your email address to place orders. Check your
                inbox for a verification email.
              </p>
              <button
                onClick={async () => {
                  try {
                    await resendVerificationEmail();
                    alert("Verification email sent! Please check your inbox.");
                  } catch (error) {
                    alert(
                      error.message || "Failed to send verification email."
                    );
                  }
                }}
                disabled={authLoading}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                {authLoading ? "Sending..." : "Resend Verification Email"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-xl">
              <MdShoppingBag className="text-2xl text-white" />
            </div>
            <span className="text-3xl font-bold text-gray-900">
              {getOrderStats().total}
            </span>
          </div>
          <h3 className="font-semibold text-gray-900 text-lg">Total Orders</h3>
          <p className="text-gray-600">All time purchases</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-3 rounded-xl">
              <MdReceipt className="text-2xl text-white" />
            </div>
            <span className="text-3xl font-bold text-gray-900">
              ${getTotalSpent().toFixed(2)}
            </span>
          </div>
          <h3 className="font-semibold text-gray-900 text-lg">Total Spent</h3>
          <p className="text-gray-600">Lifetime value</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-3 rounded-xl">
              <MdShoppingCart className="text-2xl text-white" />
            </div>
            <span className="text-3xl font-bold text-gray-900">
              {cartItemsCount}
            </span>
          </div>
          <h3 className="font-semibold text-gray-900 text-lg">Cart Items</h3>
          <p className="text-gray-600">Ready to checkout</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-gradient-to-r from-red-500 to-red-600 p-3 rounded-xl">
              <MdFavorite className="text-2xl text-white" />
            </div>
            <span className="text-3xl font-bold text-gray-900">
              {favoriteCount}
            </span>
          </div>
          <h3 className="font-semibold text-gray-900 text-lg">Favorites</h3>
          <p className="text-gray-600">Saved products</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <div className="w-8 h-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 text-left group hover:scale-105"
            >
              <div
                className={`inline-flex p-3 rounded-xl ${action.bgColor} mb-4 group-hover:scale-110 transition-transform`}
              >
                <action.icon className={`text-2xl ${action.iconColor}`} />
              </div>
              <h4 className="font-semibold text-gray-900 text-lg mb-2">
                {action.title}
              </h4>
              <p className="text-gray-600">{action.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Orders */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-8 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
            Recent Orders
          </h3>
          <button
            onClick={() => handleTabChange("orders")}
            className="text-orange-600 hover:text-orange-500 text-sm font-semibold hover:underline transition-colors"
          >
            View All
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {ordersLoading ? (
            <div className="p-12 text-center">
              <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg">Loading orders...</p>
            </div>
          ) : getRecentOrders().length > 0 ? (
            <div className="divide-y divide-gray-100">
              {getRecentOrders().map((order) => (
                <div
                  key={order._id}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900 text-lg">
                        Order #{order._id.slice(-8)}
                      </p>
                      <p className="text-gray-600 flex items-center gap-2 mt-1">
                        <MdCalendarToday className="text-sm" />
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900 text-lg">
                        ${order.totalPrice.toFixed(2)}
                      </p>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <MdShoppingBag className="text-6xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg mb-6">No orders yet</p>
              <Link
                to="/collections"
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-200 shadow-md"
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
        <h2 className="text-3xl font-bold text-gray-900">My Orders</h2>
        <Link
          to="/collections"
          className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-200 shadow-md"
        >
          Shop More
        </Link>
      </div>

      {/* Order Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 text-center shadow-sm">
          <div className="text-3xl font-bold text-gray-900 mb-2">
            {getOrderStats().total}
          </div>
          <div className="text-gray-600 font-medium">Total</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 text-center shadow-sm">
          <div className="text-3xl font-bold text-yellow-600 mb-2">
            {getOrderStats().pending}
          </div>
          <div className="text-gray-600 font-medium">Pending</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 text-center shadow-sm">
          <div className="text-3xl font-bold text-green-600 mb-2">
            {getOrderStats().delivered}
          </div>
          <div className="text-gray-600 font-medium">Delivered</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 text-center shadow-sm">
          <div className="text-3xl font-bold text-red-600 mb-2">
            {getOrderStats().cancelled}
          </div>
          <div className="text-gray-600 font-medium">Cancelled</div>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        {ordersLoading ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading orders...</p>
          </div>
        ) : myOrders.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {myOrders.map((order) => (
              <div key={order._id} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">
                      Order #{order._id.slice(-8)}
                    </h3>
                    <p className="text-gray-600 flex items-center gap-2 mt-1">
                      <MdCalendarToday className="text-sm" />
                      Ordered on{" "}
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900 text-lg">
                      ${order.totalPrice.toFixed(2)}
                    </p>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
                {/* Order items would go here */}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <MdShoppingBag className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg mb-6">No orders yet</p>
            <Link
              to="/collections"
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-200 shadow-md"
            >
              Start Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );

  const renderProfile = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-gray-900">Profile</h2>
          <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-200 shadow-md flex items-center gap-2">
            <MdEdit />
            Edit Profile
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
                  {user?.name?.charAt(0) || "U"}
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  {user?.name}
                </h3>
                <p className="text-gray-600">{user?.email}</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <MdEmail className="text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium text-gray-900">{user?.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <MdPhone className="text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium text-gray-900">
                      {user?.phone || "Not provided"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <MdCalendarToday className="text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Member Since</p>
                    <p className="font-medium text-gray-900">
                      {user?.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Account Stats */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Account Statistics
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                      <MdShoppingBag className="text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-blue-900">
                        {getOrderStats().total}
                      </p>
                      <p className="text-blue-700 font-medium">Total Orders</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                      <MdReceipt className="text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-green-900">
                        ${getTotalSpent().toFixed(2)}
                      </p>
                      <p className="text-green-700 font-medium">Total Spent</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                      <MdFavorite className="text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-orange-900">
                        {favoriteCount}
                      </p>
                      <p className="text-orange-700 font-medium">Favorites</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                      <MdLocationOn className="text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-purple-900">
                        {addresses.length}
                      </p>
                      <p className="text-purple-700 font-medium">Addresses</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Information */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Security Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <MdSecurity className="text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        Email Verification
                      </p>
                      <p className="text-sm text-gray-600">
                        {user?.isEmailVerified ? "Verified" : "Not verified"}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`w-3 h-3 rounded-full ${
                      user?.isEmailVerified ? "bg-green-500" : "bg-red-500"
                    }`}
                  ></div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <MdSecurity className="text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        Password Security
                      </p>
                      <p className="text-sm text-gray-600">
                        Secure password set
                      </p>
                    </div>
                  </div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <MdSecurity className="text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        Two-Factor Authentication
                      </p>
                      <p className="text-sm text-gray-600">Disabled</p>
                    </div>
                  </div>
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Access Denied
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            Please sign in to access your dashboard.
          </p>
          <Link
            to="/login"
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-200 shadow-md text-lg"
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
      case "favorites":
        return <FavoritesPage />;
      case "profile":
        return renderProfile();
      case "addresses":
        return <AddressesManager />;
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? (
                <MdClose className="text-2xl" />
              ) : (
                <MdMenu className="text-2xl" />
              )}
            </button>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-sm text-gray-600">
                Welcome back, {user?.name}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <MdLogout className="text-xl text-gray-600" />
          </button>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent"
              >
                Firefly
              </Link>
              <span className="text-gray-400">|</span>
              <span className="text-gray-600 text-lg">Dashboard</span>
            </div>

            <div className="flex items-center gap-6">
              <Link
                to="/collections"
                className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
              >
                Continue Shopping
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors font-medium"
              >
                <MdLogout />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="flex gap-6 lg:gap-8">
          {/* Mobile Sidebar Overlay */}
          {isMobileMenuOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          )}

          {/* Sidebar */}
          <div
            className={`fixed lg:relative inset-y-0 left-0 z-50 w-64 bg-white shadow-lg lg:shadow-none transform transition-transform duration-300 ease-in-out lg:transform-none ${
              isMobileMenuOpen
                ? "translate-x-0"
                : "-translate-x-full lg:translate-x-0"
            }`}
          >
            <div className="h-full flex flex-col">
              {/* Mobile Sidebar Header */}
              <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <MdClose className="text-xl" />
                </button>
              </div>

              {/* User Profile */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {user?.name?.charAt(0) || "U"}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{user?.name}</p>
                    <p className="text-sm text-gray-600">Member</p>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <nav className="flex-1 p-4 space-y-2">
                {sidebarItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleTabChange(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                      activeTab === item.id
                        ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <item.icon className="text-xl" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}
              </nav>

              {/* Mobile Sidebar Footer */}
              <div className="lg:hidden p-4 border-t border-gray-200">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <MdLogout className="text-xl" />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
