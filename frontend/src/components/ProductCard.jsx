import { useState } from "react";
import { Link } from "react-router-dom";
import {
  MdFavorite,
  MdFavoriteBorder,
  MdShoppingCart,
  MdStar,
  MdRemoveRedEye,
} from "react-icons/md";
import useEcommerceStore from "../store/FireflyStore";

const ProductCard = ({ product }) => {
  const { addToCart, openCart } = useEcommerceStore();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleMouseEnter = () => {
    if (product.images && product.images.length > 1) {
      setCurrentImageIndex(1);
    }
  };

  const handleMouseLeave = () => {
    setCurrentImageIndex(0);
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLoading(true);

    try {
      // Add product to cart
      addToCart(product, 1);

      // Simulate loading for better UX
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Open cart to show the added item
      openCart();
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!product) {
    return null;
  }

  const hasMultipleImages = product.images && product.images.length > 1;

  return (
    <Link
      to={`/product/${product.slug}`}
      className="block group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2"
    >
      {/* Image Container */}
      <div
        className="relative overflow-hidden "
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Product Images */}
        <div className="relative w-full h-full">
          <img
            src={product.images[0] || "/placeholder-image.svg"}
            alt={product.name}
            className={`w-full h-full object-cover transition-all duration-700 ${
              currentImageIndex === 0
                ? "opacity-100 scale-100"
                : "opacity-0 scale-110"
            }`}
          />

          {hasMultipleImages && (
            <img
              src={product.images[1]}
              alt={product.name}
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${
                currentImageIndex === 1
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-110"
              }`}
            />
          )}
        </div>

        {/* Stock Badge */}
        {product.inventory <= 5 && product.inventory > 0 && (
          <div className="absolute top-4 left-4 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
            Only {product.inventory} left
          </div>
        )}

        {/* Out of Stock Badge */}
        {product.inventory === 0 && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="bg-red-500 text-white font-bold px-4 py-2 rounded-lg">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-5 space-y-3">
        {/* Product Name */}
        <h3 className="font-semibold text-gray-900 text-lg leading-tight line-clamp-2 group-hover:text-orange-600 transition-colors">
          {product.name}
        </h3>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-gray-900">
              ${product.price}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-gray-500 line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>

          {product.originalPrice && product.originalPrice > product.price && (
            <div className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded">
              -
              {Math.round(
                ((product.originalPrice - product.price) /
                  product.originalPrice) *
                  100
              )}
              %
            </div>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={product.inventory === 0 || isLoading}
          className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Adding...
            </>
          ) : product.inventory === 0 ? (
            "Out of Stock"
          ) : (
            <>
              <MdShoppingCart className="text-lg" />
              Add to Cart
            </>
          )}
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;
