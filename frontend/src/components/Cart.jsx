import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MdClose,
  MdShoppingCart,
  MdAdd,
  MdRemove,
  MdDelete,
  MdShoppingBag,
  MdArrowRightAlt,
} from "react-icons/md";
import { Link } from "react-router-dom";
import useEcommerceStore from "../store/FireflyStore";

const Cart = () => {
  const {
    cartItems,
    cartTotal,
    cartItemsCount,
    isCartOpen,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    closeCart,
  } = useEcommerceStore();

  const cartRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        closeCart();
      }
    };

    if (isCartOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isCartOpen, closeCart]);

  const handleQuantityChange = (itemId, newQuantity) => {
    updateCartItemQuantity(itemId, newQuantity);
  };

  const handleRemoveItem = (itemId) => {
    removeFromCart(itemId);
  };

  const handleClearCart = () => {
    clearCart();
  };

  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const cartVariants = {
    hidden: { x: "100%" },
    visible: {
      x: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 200,
      },
    },
    exit: {
      x: "100%",
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 200,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 300,
      },
    },
    exit: {
      opacity: 0,
      x: -100,
      scale: 0.8,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/50"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.3 }}
          />

          {/* Cart Panel */}
          <motion.div
            className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl"
            variants={cartVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            ref={cartRef}
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <motion.div
                className="flex items-center justify-between p-6 border-b border-gray-200"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                <div className="flex items-center gap-3">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.3, type: "spring", damping: 15 }}
                  >
                    <MdShoppingCart className="text-2xl text-orange-500" />
                  </motion.div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Shopping Cart
                  </h2>
                  {cartItemsCount > 0 && (
                    <motion.span
                      className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.4, type: "spring", damping: 15 }}
                    >
                      {cartItemsCount}
                    </motion.span>
                  )}
                </div>
                <motion.button
                  onClick={closeCart}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <MdClose className="text-xl text-gray-600" />
                </motion.button>
              </motion.div>

              {/* Cart Content */}
              {cartItems.length === 0 ? (
                <motion.div
                  className="flex-1 flex flex-col items-center justify-center p-6 text-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.4, type: "spring", damping: 15 }}
                  >
                    <MdShoppingBag className="text-6xl text-gray-300 mb-4" />
                  </motion.div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Your cart is empty
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Start shopping to add items to your cart
                  </p>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to="/collections"
                      onClick={closeCart}
                      className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
                    >
                      Start Shopping
                      <MdArrowRightAlt className="text-lg" />
                    </Link>
                  </motion.div>
                </motion.div>
              ) : (
                <>
                  {/* Cart Items */}
                  <motion.div
                    className="flex-1 overflow-y-auto p-6 space-y-4"
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                  >
                    <AnimatePresence mode="popLayout">
                      {cartItems.map((item) => (
                        <motion.div
                          key={item.id}
                          variants={itemVariants}
                          layout
                          className="bg-gray-50 rounded-lg p-4"
                        >
                          <div className="flex gap-4">
                            {/* Product Image */}
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              transition={{ type: "spring", damping: 15 }}
                            >
                              <Link
                                to={`/product/${item.product.slug}`}
                                className="w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0 cursor-pointer block"
                                onClick={closeCart}
                              >
                                <img
                                  src={
                                    item.product.images[0] ||
                                    "/placeholder-image.svg"
                                  }
                                  alt={item.product.name}
                                  className="w-full h-full object-cover"
                                />
                              </Link>
                            </motion.div>

                            {/* Product Details */}
                            <div className="flex-1 min-w-0">
                              <Link
                                to={`/product/${item.product.slug}`}
                                onClick={closeCart}
                                className="cursor-pointer"
                              >
                                <h4 className="font-medium text-gray-900 truncate hover:text-orange-600 transition-colors">
                                  {item.product.name}
                                </h4>
                              </Link>
                              <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                                <span>${item.product.price}</span>
                                {item.size && (
                                  <>
                                    <span>•</span>
                                    <span>Size: {item.size}</span>
                                  </>
                                )}
                              </div>

                              {/* Quantity Controls */}
                              <div className="flex items-center justify-between mt-3">
                                <div className="flex items-center gap-2">
                                  <motion.button
                                    onClick={() =>
                                      handleQuantityChange(
                                        item.id,
                                        item.quantity - 1
                                      )
                                    }
                                    className="p-1 hover:bg-gray-200 rounded transition-colors cursor-pointer"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                  >
                                    <MdRemove className="text-gray-600" />
                                  </motion.button>
                                  <motion.span
                                    className="min-w-[2rem] text-center font-medium"
                                    key={item.quantity}
                                    initial={{ scale: 1.2, color: "#f97316" }}
                                    animate={{ scale: 1, color: "#374151" }}
                                    transition={{ duration: 0.2 }}
                                  >
                                    {item.quantity}
                                  </motion.span>
                                  <motion.button
                                    onClick={() =>
                                      handleQuantityChange(
                                        item.id,
                                        item.quantity + 1
                                      )
                                    }
                                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                  >
                                    <MdAdd className="text-gray-600" />
                                  </motion.button>
                                </div>

                                <div className="flex items-center gap-2">
                                  <motion.span
                                    className="font-semibold text-gray-900"
                                    key={`${item.id}-${item.quantity}`}
                                    initial={{ scale: 1.2, color: "#f97316" }}
                                    animate={{ scale: 1, color: "#111827" }}
                                    transition={{ duration: 0.2 }}
                                  >
                                    $
                                    {(
                                      item.product.price * item.quantity
                                    ).toFixed(2)}
                                  </motion.span>
                                  <motion.button
                                    onClick={() => handleRemoveItem(item.id)}
                                    className="p-1 hover:bg-red-100 text-red-500 rounded transition-colors"
                                    title="Remove item"
                                    whileHover={{
                                      scale: 1.1,
                                      backgroundColor: "#fef2f2",
                                    }}
                                    whileTap={{ scale: 0.9 }}
                                  >
                                    <MdDelete className="text-lg" />
                                  </motion.button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    {/* Clear Cart Button */}
                    {cartItems.length > 1 && (
                      <motion.button
                        onClick={handleClearCart}
                        className="w-full text-center text-red-500 hover:text-red-700 text-sm py-2 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Clear Cart
                      </motion.button>
                    )}
                  </motion.div>

                  {/* Footer */}
                  <motion.div
                    className="border-t border-gray-200 p-6 space-y-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.3 }}
                  >
                    {/* Total */}
                    <div className="flex items-center justify-between text-lg font-bold">
                      <span>Total:</span>
                      <motion.span
                        className="text-orange-600"
                        key={cartTotal}
                        initial={{ scale: 1.2, color: "#f97316" }}
                        animate={{ scale: 1, color: "#ea580c" }}
                        transition={{ duration: 0.3 }}
                      >
                        ${cartTotal.toFixed(2)}
                      </motion.span>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Link
                          to="/checkout"
                          onClick={closeCart}
                          className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors font-semibold text-center block"
                        >
                          Proceed to Checkout
                        </Link>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Link
                          to="/collections"
                          onClick={closeCart}
                          className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium text-center block"
                        >
                          Continue Shopping
                        </Link>
                      </motion.div>
                    </div>

                    {/* Additional Info */}
                    <div className="text-center text-sm text-gray-500">
                      <p>Free shipping on orders over $100</p>
                      <p>Secure checkout • 30-day returns</p>
                    </div>
                  </motion.div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Cart;
