import React, { useEffect, useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import useEcommerceStore from "../store/FireflyStore";

const OrderConfirmationPage = () => {
  const { orderId } = useParams();
  const location = useLocation();
  const { getOrderById, ordersLoading, ordersError } = useEcommerceStore();
  const [order, setOrder] = useState(null);

  console.log("OrderConfirmationPage: Component rendered");
  console.log("OrderConfirmationPage: orderId from params =", orderId);
  console.log("OrderConfirmationPage: location state =", location.state);

  useEffect(() => {
    console.log("OrderConfirmationPage: orderId =", orderId);
    if (orderId) {
      getOrderById(orderId)
        .then((response) => {
          console.log("OrderConfirmationPage: response =", response);
          if (response.success) {
            setOrder(response.data);
          }
        })
        .catch((error) => {
          console.error("Failed to fetch order:", error);
        });
    }
  }, [orderId, getOrderById]);

  if (ordersLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (ordersError || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Order Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            We couldn't find the order you're looking for.
          </p>
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Message */}
        {location.state?.orderSuccess && (
          <div className="mb-8 bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-8 w-8 text-green-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-green-800">
                  Order Placed Successfully!
                </h3>
                <p className="mt-1 text-sm text-green-700">
                  Thank you for your order. We've sent a confirmation email with
                  your order details.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Order Details */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">
              Order #{order._id.slice(-8).toUpperCase()}
            </h1>
            <p className="text-gray-600">
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>

          <div className="p-6">
            {/* Order Status */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Order Status
                </h2>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    order.status === "Pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : order.status === "Processing"
                      ? "bg-blue-100 text-blue-800"
                      : order.status === "Shipped"
                      ? "bg-purple-100 text-purple-800"
                      : order.status === "Delivered"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {order.status}
                </span>
              </div>
            </div>

            {/* Order Items */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Order Items
              </h2>
              <div className="space-y-4">
                {order.orderItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 py-3 border-b border-gray-200 last:border-b-0"
                  >
                    <div className="flex-shrink-0">
                      <img
                        src={item.image || "/placeholder-image.svg"}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Size: {item.size} | Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <p className="text-sm font-medium text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Shipping Address
              </h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-900">
                  {order.shippingAddress.address}
                </p>
                <p className="text-sm text-gray-900">
                  {order.shippingAddress.city},{" "}
                  {order.shippingAddress.postalCode}
                </p>
                <p className="text-sm text-gray-900">
                  {order.shippingAddress.country}
                </p>
                <p className="text-sm text-gray-900">
                  Phone: {order.shippingAddress.phone}
                </p>
              </div>
            </div>

            {/* Payment Information */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Payment Information
              </h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-900">
                  <span className="font-medium">Payment Method:</span>{" "}
                  {order.paymentMethod}
                </p>
                <p className="text-sm text-gray-900">
                  <span className="font-medium">Payment Status:</span>{" "}
                  <span
                    className={
                      order.isPaid ? "text-green-600" : "text-yellow-600"
                    }
                  >
                    {order.isPaid ? "Paid" : "Pending"}
                  </span>
                </p>
                {order.isPaid && order.paidAt && (
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">Paid on:</span>{" "}
                    {formatDate(order.paidAt)}
                  </p>
                )}
              </div>
            </div>

            {/* Order Notes */}
            {order.notes && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Order Notes
                </h2>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-900">{order.notes}</p>
                </div>
              </div>
            )}

            {/* Order Summary */}
            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Order Summary
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">
                    ${order.itemsPrice.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax (10%)</span>
                  <span className="text-gray-900">
                    ${order.taxPrice.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900">
                    {order.shippingPrice === 0
                      ? "Free"
                      : `$${order.shippingPrice.toFixed(2)}`}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-lg font-semibold">
                    <span className="text-gray-900">Total</span>
                    <span className="text-gray-900">
                      ${order.totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Link
            to="/"
            className="flex-1 sm:flex-none inline-flex justify-center items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Continue Shopping
          </Link>
          <Link
            to="/dashboard"
            className="flex-1 sm:flex-none inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            View My Orders
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
