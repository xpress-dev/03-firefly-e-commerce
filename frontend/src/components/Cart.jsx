import { useState, useEffect, useRef } from "react";
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

  const [isAnimating, setIsAnimating] = useState(false);
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
    setIsAnimating(true);
    updateCartItemQuantity(itemId, newQuantity);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const handleRemoveItem = (itemId) => {
    setIsAnimating(true);
    removeFromCart(itemId);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const handleClearCart = () => {
    setIsAnimating(true);
    clearCart();
    setTimeout(() => setIsAnimating(false), 300);
  };

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300" />

      {/* Cart Panel */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform duration-300">
        <div ref={cartRef} className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <MdShoppingCart className="text-2xl text-orange-500" />
              <h2 className="text-xl font-bold text-gray-900">Shopping Cart</h2>
              {cartItemsCount > 0 && (
                <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                  {cartItemsCount}
                </span>
              )}
            </div>
            <button
              onClick={closeCart}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <MdClose className="text-xl text-gray-600" />
            </button>
          </div>

          {/* Cart Content */}
          {cartItems.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <MdShoppingBag className="text-6xl text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Your cart is empty
              </h3>
              <p className="text-gray-600 mb-6">
                Start shopping to add items to your cart
              </p>
              <Link
                to="/collections"
                onClick={closeCart}
                className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
              >
                Start Shopping
                <MdArrowRightAlt className="text-lg" />
              </Link>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className={`bg-gray-50 rounded-lg p-4 transition-all duration-300 ${
                      isAnimating
                        ? "scale-95 opacity-75"
                        : "scale-100 opacity-100"
                    }`}
                  >
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <Link
                        to={`/product/${item.product.slug}`}
                        className="w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0 cursor-pointer"
                        onClick={closeCart}
                      >
                        <img
                          src={
                            item.product.images[0] || "/placeholder-image.svg"
                          }
                          alt={item.product.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                        />
                      </Link>

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
                            <button
                              onClick={() =>
                                handleQuantityChange(item.id, item.quantity - 1)
                              }
                              className="p-1 hover:bg-gray-200 rounded transition-colors cursor-pointer"
                            >
                              <MdRemove className="text-gray-600" />
                            </button>
                            <span className="min-w-[2rem] text-center font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                handleQuantityChange(item.id, item.quantity + 1)
                              }
                              className="p-1 hover:bg-gray-200 rounded transition-colors"
                            >
                              <MdAdd className="text-gray-600" />
                            </button>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900">
                              ${(item.product.price * item.quantity).toFixed(2)}
                            </span>
                            <button
                              onClick={() => handleRemoveItem(item.id)}
                              className="p-1 hover:bg-red-100 text-red-500 rounded transition-colors"
                              title="Remove item"
                            >
                              <MdDelete className="text-lg" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Clear Cart Button */}
                {cartItems.length > 1 && (
                  <button
                    onClick={handleClearCart}
                    className="w-full text-center text-red-500 hover:text-red-700 text-sm py-2 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    Clear Cart
                  </button>
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 p-6 space-y-4">
                {/* Total */}
                <div className="flex items-center justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-orange-600">
                    ${cartTotal.toFixed(2)}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Link
                    to="/checkout"
                    onClick={closeCart}
                    className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors font-semibold text-center block"
                  >
                    Proceed to Checkout
                  </Link>
                  <Link
                    to="/collections"
                    onClick={closeCart}
                    className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium text-center block"
                  >
                    Continue Shopping
                  </Link>
                </div>

                {/* Additional Info */}
                <div className="text-center text-sm text-gray-500">
                  <p>Free shipping on orders over $100</p>
                  <p>Secure checkout • 30-day returns</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
