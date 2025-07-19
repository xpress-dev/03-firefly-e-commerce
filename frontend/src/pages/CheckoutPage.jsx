import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import useEcommerceStore from "../store/FireflyStore";
import AddressSelector from "../components/AddressSelector";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    cartTotal,
    user,
    isAuthenticated,
    createOrder,
    clearCart,
    ordersLoading,
    ordersError,
    resendVerificationEmail,
    defaultAddress,
  } = useEcommerceStore();

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [formData, setFormData] = useState({
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
    notes: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if cart is empty (but not immediately after order creation)
  useEffect(() => {
    if (cartItems.length === 0 && !isSubmitting) {
      navigate("/");
      return;
    }
  }, [cartItems.length, navigate, isSubmitting]);

  // Set default address when available
  useEffect(() => {
    if (defaultAddress && !selectedAddress) {
      setSelectedAddress(defaultAddress);
    }
  }, [defaultAddress, selectedAddress]);

  // Calculate order totals
  const taxPrice = Number((cartTotal * 0.1).toFixed(2)); // 10% tax
  const shippingPrice = cartTotal > 100 ? 0 : 10; // Free shipping over $100
  const totalPrice = Number((cartTotal + taxPrice + shippingPrice).toFixed(2));

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    // Clear any address-related errors when an address is selected
    setErrors((prev) => ({
      ...prev,
      address: "",
      city: "",
      postalCode: "",
      country: "",
      phone: "",
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Check if an address is selected
    if (!selectedAddress) {
      newErrors.address = "Please select a delivery address";
    }

    // Validate notes if provided
    if (formData.notes && formData.notes.length > 500) {
      newErrors.notes = "Notes cannot exceed 500 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare order data
      const orderData = {
        orderItems: cartItems.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
          size: item.size || "Standard",
        })),
        shippingAddress: {
          firstName: selectedAddress.firstName,
          lastName: selectedAddress.lastName,
          address: selectedAddress.addressLine1,
          addressLine2: selectedAddress.addressLine2,
          city: selectedAddress.city,
          state: selectedAddress.state,
          postalCode: selectedAddress.postalCode,
          country: selectedAddress.country,
          phone: selectedAddress.phone,
        },
        paymentMethod: "Cash on Delivery", // For now, all orders go through without payment
        notes: formData.notes,
      };

      console.log("CheckoutPage: Creating order with data =", orderData);
      const response = await createOrder(orderData);
      console.log("CheckoutPage: Order creation response =", response);

      if (response && response.success) {
        console.log(
          "CheckoutPage: Order created successfully, order ID =",
          response.data._id
        );

        // Redirect to order confirmation first
        const orderUrl = `/order/${response.data._id}`;
        console.log(
          "CheckoutPage: Redirecting to order confirmation =",
          orderUrl
        );

        // Use replace: true to prevent back button issues
        navigate(orderUrl, {
          replace: true,
          state: {
            orderSuccess: true,
            orderId: response.data._id,
          },
        });

        // Clear cart after a short delay to ensure navigation happens first
        setTimeout(() => {
          clearCart();
        }, 500);

        // Fallback redirect in case navigate doesn't work
        setTimeout(() => {
          if (window.location.pathname !== orderUrl) {
            console.log("CheckoutPage: Fallback redirect to", orderUrl);
            window.location.href = orderUrl;
          }
        }, 1000);
      } else {
        console.error(
          "CheckoutPage: Order creation failed - no success response"
        );
      }
    } catch (error) {
      console.error("Order creation failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return null; // Will redirect
  }

  // Show login prompt for non-authenticated users
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Sign in to Continue
              </h1>
              <p className="text-gray-600 mb-6">
                Please sign in to your account to complete your checkout.
              </p>
            </div>

            {/* Order Summary Preview */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Order Summary
              </h2>
              <div className="space-y-3">
                {cartItems.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-gray-600">
                      {item.product.name} x {item.quantity}
                    </span>
                    <span className="font-medium">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
                {cartItems.length > 3 && (
                  <p className="text-sm text-gray-500">
                    + {cartItems.length - 3} more items
                  </p>
                )}
                <div className="border-t pt-3">
                  <div className="flex justify-between font-semibold">
                    <span>Total:</span>
                    <span className="text-orange-600">
                      ${totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Link
                to="/login"
                state={{ from: "/checkout" }}
                className="w-full bg-orange-500 text-white py-3 px-6 rounded-lg hover:bg-orange-600 transition-colors font-semibold inline-block"
              >
                Sign In to Continue
              </Link>
              <Link
                to="/signup"
                state={{ from: "/checkout" }}
                className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors font-medium inline-block"
              >
                Create Account
              </Link>
              <Link
                to="/collections"
                className="text-orange-600 hover:text-orange-500 text-sm font-medium"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show email verification prompt for unverified users
  if (user && !user.isEmailVerified) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Email Verification Required
              </h1>
              <p className="text-gray-600 mb-6">
                Please verify your email address before placing an order. Check
                your inbox for a verification email.
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={async () => {
                  try {
                    await resendVerificationEmail();
                    alert("Verification email sent! Please check your inbox.");
                  } catch {
                    alert(
                      "Failed to send verification email. Please try again."
                    );
                  }
                }}
                className="w-full bg-orange-500 text-white py-3 px-6 rounded-lg hover:bg-orange-600 transition-colors font-semibold"
              >
                Resend Verification Email
              </button>
              <Link
                to="/dashboard"
                className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors font-medium inline-block"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="mt-2 text-gray-600">Complete your order</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Shipping Information
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Address Selection */}
              <AddressSelector
                selectedAddress={selectedAddress}
                onAddressSelect={handleAddressSelect}
              />

              {errors.address && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-sm text-red-600">{errors.address}</p>
                </div>
              )}

              {/* Selected Address Summary */}
              {selectedAddress && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-medium text-green-800 mb-2">
                    Selected Delivery Address:
                  </h4>
                  <div className="text-sm text-green-700 space-y-1">
                    <p className="font-medium">
                      {selectedAddress.firstName} {selectedAddress.lastName}
                    </p>
                    <p>{selectedAddress.addressLine1}</p>
                    {selectedAddress.addressLine2 && (
                      <p>{selectedAddress.addressLine2}</p>
                    )}
                    <p>
                      {selectedAddress.city}, {selectedAddress.state}{" "}
                      {selectedAddress.postalCode}
                    </p>
                    <p>{selectedAddress.country}</p>
                    <p>{selectedAddress.phone}</p>
                  </div>
                </div>
              )}

              {/* Manage Addresses Link */}
              <div className="text-center">
                <Link
                  to="/dashboard?tab=addresses"
                  className="text-sm text-orange-600 hover:text-orange-500 font-medium"
                >
                  Manage all addresses in dashboard
                </Link>
              </div>

              <div>
                <label
                  htmlFor="notes"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Order Notes (Optional)
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Any special instructions or notes for your order..."
                />
              </div>

              {ordersError && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <p className="text-sm text-red-600">{ordersError}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting || ordersLoading}
                className="w-full bg-orange-500 text-white py-3 px-4 rounded-md font-medium hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting || ordersLoading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing Order...
                  </span>
                ) : (
                  `Place Order - $${totalPrice.toFixed(2)}`
                )}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-sm p-6 h-fit">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Order Summary
            </h2>

            {/* Selected Address Display */}
            {selectedAddress && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium text-gray-900 mb-2">
                  Delivery Address:
                </h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p className="font-medium">
                    {selectedAddress.firstName} {selectedAddress.lastName}
                  </p>
                  <p>{selectedAddress.addressLine1}</p>
                  {selectedAddress.addressLine2 && (
                    <p>{selectedAddress.addressLine2}</p>
                  )}
                  <p>
                    {selectedAddress.city}, {selectedAddress.state}{" "}
                    {selectedAddress.postalCode}
                  </p>
                  <p>{selectedAddress.country}</p>
                  <p>{selectedAddress.phone}</p>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center space-x-4 py-3 border-b border-gray-200"
                >
                  <div className="flex-shrink-0">
                    <img
                      src={item.product.images[0] || "/placeholder-image.svg"}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {item.product.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Size: {item.size || "Standard"} | Qty: {item.quantity}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <p className="text-sm font-medium text-gray-900">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900">${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax (10%)</span>
                <span className="text-gray-900">${taxPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="text-gray-900">
                  {shippingPrice === 0
                    ? "Free"
                    : `$${shippingPrice.toFixed(2)}`}
                </span>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between text-lg font-semibold">
                  <span className="text-gray-900">Total</span>
                  <span className="text-gray-900">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-orange-50 rounded-md">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-orange-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-orange-800">
                    Payment Information
                  </h3>
                  <p className="mt-1 text-sm text-orange-700">
                    Orders will be processed without payment for now. You'll
                    receive an order confirmation once your order is placed.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
