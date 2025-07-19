import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

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

  // Animation variants
  const mobileMenuVariants = {
    hidden: { opacity: 0, y: -20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300,
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.95,
      transition: {
        duration: 0.2,
      },
    },
  };

  const menuItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 300,
      },
    },
  };

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300,
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const dropdownItemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 300,
      },
    },
  };

  return (
    <>
      <nav className="flex justify-between py-5 items-center relative">
        <Logo />

        {/* Desktop Controls */}
        <div className="hidden sm:flex items-center gap-5 text-2xl">
          {/* Search */}
          <motion.button
            onClick={handleSearchClick}
            className="relative p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
            title="Search"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <CgSearch />
          </motion.button>

          {/* Cart */}
          <motion.button
            onClick={handleCartClick}
            className="relative p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
            title="Shopping Cart"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <CgShoppingCart />
            <AnimatePresence>
              {cartItemsCount > 0 && (
                <motion.span
                  className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                  transition={{ type: "spring", damping: 15, stiffness: 300 }}
                  key={cartItemsCount}
                >
                  {cartItemsCount > 99 ? "99+" : cartItemsCount}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Profile/Auth */}
          {isAuthenticated ? (
            <div
              className="relative"
              onMouseEnter={() => setIsProfileDropdownOpen(true)}
              onMouseLeave={() => setIsProfileDropdownOpen(false)}
            >
              <motion.button
                className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-full transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <CgProfile />
                {user?.name && (
                  <span className="text-sm font-medium text-gray-700 hidden md:block">
                    {user.name.split(" ")[0]}
                  </span>
                )}
              </motion.button>

              {/* Dropdown Menu */}
              <motion.div
                className={`absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 transition-all duration-200 z-50 ${
                  isProfileDropdownOpen
                    ? "opacity-100 visible"
                    : "opacity-0 invisible"
                }`}
                variants={dropdownVariants}
                initial="hidden"
                animate={isProfileDropdownOpen ? "visible" : "hidden"}
              >
                <div className="py-2">
                  <motion.div variants={dropdownItemVariants}>
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-2 px-4 py-3 text-gray-700 text-sm hover:bg-orange-50 hover:text-orange-600 transition-colors"
                    >
                      <MdDashboard className="text-lg" />
                      Dashboard
                    </Link>
                  </motion.div>
                  <motion.div variants={dropdownItemVariants}>
                    <Link
                      to="/dashboard?tab=orders"
                      className="flex items-center gap-2 px-4 py-3 text-gray-700 text-sm hover:bg-orange-50 hover:text-orange-600 transition-colors"
                    >
                      <MdShoppingBag className="text-lg" />
                      My Orders
                    </Link>
                  </motion.div>
                  <motion.div variants={dropdownItemVariants}>
                    <Link
                      to="/dashboard?tab=profile"
                      className="flex items-center gap-2 px-4 py-3 text-gray-700 text-sm hover:bg-orange-50 hover:text-orange-600 transition-colors"
                    >
                      <CgProfile className="text-lg" />
                      View Profile
                    </Link>
                  </motion.div>
                  {user?.role === "admin" && (
                    <motion.div variants={dropdownItemVariants}>
                      <Link
                        to="/admin"
                        className="flex items-center gap-2 px-4 py-3 text-purple-700 text-sm hover:bg-purple-50 transition-colors font-medium"
                      >
                        <MdSettings className="text-lg" />
                        Admin Dashboard
                      </Link>
                    </motion.div>
                  )}
                  <hr className="my-2" />
                  <motion.div variants={dropdownItemVariants}>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 transition-colors text-sm cursor-pointer"
                    >
                      <MdLogout className="text-lg" />
                      Logout
                    </button>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          ) : (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                className="text-white bg-gradient-to-r from-orange-500 to-red-600  rounded-2xl px-4 py-2 font-semibold text-sm"
                to="/login"
              >
                Login
              </Link>
            </motion.div>
          )}
        </div>

        {/* Mobile Burger Menu */}
        <motion.button
          onClick={toggleMobileMenu}
          className="sm:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <AnimatePresence mode="wait">
            {isMobileMenuOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <CgClose className="text-2xl" />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <CgMenu className="text-2xl" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-2 sm:hidden z-50"
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="p-4 space-y-4">
                {/* Mobile Search */}
                <motion.button
                  onClick={handleSearchClick}
                  className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                  variants={menuItemVariants}
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <CgSearch className="text-xl" />
                  <span>Search Products</span>
                </motion.button>

                {/* Mobile Cart */}
                <motion.button
                  onClick={handleCartClick}
                  className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                  variants={menuItemVariants}
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="relative">
                    <CgShoppingCart className="text-xl" />
                    <AnimatePresence>
                      {cartItemsCount > 0 && (
                        <motion.span
                          className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold"
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          exit={{ scale: 0, rotate: 180 }}
                          transition={{
                            type: "spring",
                            damping: 15,
                            stiffness: 300,
                          }}
                          key={cartItemsCount}
                        >
                          {cartItemsCount > 9 ? "9+" : cartItemsCount}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                  <span>Shopping Cart ({cartItemsCount})</span>
                </motion.button>

                {/* Mobile Navigation Links */}
                <motion.div variants={menuItemVariants}>
                  <Link
                    to="/collections"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    All Products
                  </Link>
                </motion.div>
                <motion.div variants={menuItemVariants}>
                  <Link
                    to="/about"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    About Us
                  </Link>
                </motion.div>
                <motion.div variants={menuItemVariants}>
                  <Link
                    to="/contact"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    Contact Us
                  </Link>
                </motion.div>

                {/* Mobile Auth */}
                {isAuthenticated ? (
                  <motion.div
                    className="border-t pt-4 space-y-2"
                    variants={menuItemVariants}
                  >
                    <div className="px-3 py-2 text-sm text-gray-600">
                      Hello, {user?.name?.split(" ")[0] || "User"}!
                    </div>
                    <motion.div
                      whileHover={{ x: 5 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link
                        to="/dashboard"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        Dashboard
                      </Link>
                    </motion.div>
                    <motion.div
                      whileHover={{ x: 5 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link
                        to="/dashboard"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        My Orders
                      </Link>
                    </motion.div>
                    {user?.role === "admin" && (
                      <motion.div
                        whileHover={{ x: 5 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Link
                          to="/admin"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block w-full text-left p-3 text-purple-700 hover:bg-purple-50 rounded-lg transition-colors font-medium"
                        >
                          Admin Dashboard
                        </Link>
                      </motion.div>
                    )}
                    <motion.button
                      onClick={handleLogout}
                      className="block w-full text-left p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      whileHover={{ x: 5 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Logout
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.div
                    className="border-t pt-4 space-y-2"
                    variants={menuItemVariants}
                  >
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link
                        to="/login"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block w-full text-center bg-gradient-to-r from-orange-500 to-red-600  text-white py-3 rounded-lg font-semibold  transition-colors"
                      >
                        Login
                      </Link>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link
                        to="/signup"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block w-full text-center border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors mt-2"
                      >
                        Sign Up
                      </Link>
                    </motion.div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Cart and Search Components */}
      <Cart />
      <Search />
    </>
  );
};

export default Navbar;
