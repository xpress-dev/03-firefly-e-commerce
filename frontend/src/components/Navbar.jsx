import { useState } from "react";
import {
  CgProfile,
  CgShoppingCart,
  CgSearch,
  CgMenu,
  CgClose,
} from "react-icons/cg";
import {
  MdDashboard,
  MdShoppingBag,
  MdSettings,
  MdLogout,
} from "react-icons/md";
import { Link } from "react-router-dom";
import Logo from "./Logo";
import Cart from "./Cart";
import Search from "./Search";
import useEcommerceStore from "../store/FireflyStore";

const Navbar = () => {
  const {
    isAuthenticated,
    user,
    cartItemsCount,
    toggleCart,
    toggleSearch,
    logout,
  } = useEcommerceStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleCartClick = () => {
    toggleCart();
    setIsMobileMenuOpen(false);
  };

  const handleSearchClick = () => {
    toggleSearch();
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="flex justify-between py-5 items-center relative">
        <Logo />

        {/* Desktop Controls */}
        <div className="hidden sm:flex items-center gap-5 text-2xl">
          {/* Search */}
          <button
            onClick={handleSearchClick}
            className="relative p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
            title="Search"
          >
            <CgSearch />
          </button>

          {/* Cart */}
          <button
            onClick={handleCartClick}
            className="relative p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
            title="Shopping Cart"
          >
            <CgShoppingCart />
            {cartItemsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {cartItemsCount > 99 ? "99+" : cartItemsCount}
              </span>
            )}
          </button>

          {/* Profile/Auth */}
          {isAuthenticated ? (
            <div className="relative group">
              <button className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-full transition-colors">
                <CgProfile />
                {user?.name && (
                  <span className="text-sm font-medium text-gray-700 hidden md:block">
                    {user.name.split(" ")[0]}
                  </span>
                )}
              </button>

              {/* Dropdown Menu */}
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-2">
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-2 px-4 py-3 text-gray-700 text-sm hover:bg-orange-50 hover:text-orange-600 transition-colors"
                  >
                    <MdDashboard className="text-lg" />
                    Dashboard
                  </Link>
                  <Link
                    to="/dashboard?tab=orders"
                    className="flex items-center gap-2 px-4 py-3 text-gray-700 text-sm hover:bg-orange-50 hover:text-orange-600 transition-colors"
                  >
                    <MdShoppingBag className="text-lg" />
                    My Orders
                  </Link>
                  <Link
                    to="/dashboard?tab=profile"
                    className="flex items-center gap-2 px-4 py-3 text-gray-700 text-sm hover:bg-orange-50 hover:text-orange-600 transition-colors"
                  >
                    <CgProfile className="text-lg" />
                    View Profile
                  </Link>
                  {user?.role === "admin" && (
                    <Link
                      to="/admin"
                      className="flex items-center gap-2 px-4 py-3 text-purple-700 text-sm hover:bg-purple-50 transition-colors font-medium"
                    >
                      <MdSettings className="text-lg" />
                      Admin Dashboard
                    </Link>
                  )}
                  <hr className="my-2" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 transition-colors text-sm cursor-pointer"
                  >
                    <MdLogout className="text-lg" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Link
              className="text-white bg-gradient-to-r from-orange-500 to-red-600  rounded-2xl px-4 py-2 font-semibold text-sm"
              to="/login"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Burger Menu */}
        <button
          onClick={toggleMobileMenu}
          className="sm:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {isMobileMenuOpen ? (
            <CgClose className="text-2xl" />
          ) : (
            <CgMenu className="text-2xl" />
          )}
        </button>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-2 sm:hidden z-50">
            <div className="p-4 space-y-4">
              {/* Mobile Search */}
              <button
                onClick={handleSearchClick}
                className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
              >
                <CgSearch className="text-xl" />
                <span>Search Products</span>
              </button>

              {/* Mobile Cart */}
              <button
                onClick={handleCartClick}
                className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
              >
                <div className="relative">
                  <CgShoppingCart className="text-xl" />
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
                      {cartItemsCount > 9 ? "9+" : cartItemsCount}
                    </span>
                  )}
                </div>
                <span>Shopping Cart ({cartItemsCount})</span>
              </button>

              {/* Mobile Navigation Links */}
              <Link
                to="/collections"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                All Products
              </Link>
              <Link
                to="/about"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                About Us
              </Link>
              <Link
                to="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Contact Us
              </Link>

              {/* Mobile Auth */}
              {isAuthenticated ? (
                <div className="border-t pt-4 space-y-2">
                  <div className="px-3 py-2 text-sm text-gray-600">
                    Hello, {user?.name?.split(" ")[0] || "User"}!
                  </div>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    My Orders
                  </Link>
                  {user?.role === "admin" && (
                    <Link
                      to="/admin"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block w-full text-left p-3 text-purple-700 hover:bg-purple-50 rounded-lg transition-colors font-medium"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="border-t pt-4 space-y-2">
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full text-center bg-gradient-to-r from-orange-500 to-red-600  text-white py-3 rounded-lg font-semibold  transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full text-center border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors mt-2"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Cart and Search Components */}
      <Cart />
      <Search />
    </>
  );
};

export default Navbar;
