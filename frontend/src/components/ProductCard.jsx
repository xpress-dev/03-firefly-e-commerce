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
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (product.images && product.images.length > 1) {
      setCurrentImageIndex(1);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
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

  const toggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorited(!isFavorited);
    // TODO: Implement actual favorite functionality
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // TODO: Implement quick view modal
  };

  if (!product) {
    return null;
  }

  const hasMultipleImages = product.images && product.images.length > 1;
  const rating = product.rating || 4.5; // Default rating if not available
  const reviewCount =
    product.reviewCount || Math.floor(Math.random() * 100) + 10;

  return (
    <Link
      to={`/product/${product.slug}`}
      className="block group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2"
    >
      {/* Image Container */}
      <div
        className="relative overflow-hidden aspect-square"
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

        {/* Overlay Actions */}
        <div
          className={`absolute inset-0 bg-black/30 flex items-center justify-center gap-3 transition-all duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <button
            onClick={handleQuickView}
            className="bg-white/90 p-3 rounded-full hover:bg-white transform hover:scale-110 transition-all duration-200 shadow-lg"
            title="Quick View"
          >
            <MdRemoveRedEye className="text-xl text-gray-800" />
          </button>

          <button
            onClick={handleAddToCart}
            disabled={isLoading}
            className="bg-orange-500 text-white p-3 rounded-full hover:bg-orange-600 transform hover:scale-110 transition-all duration-200 shadow-lg disabled:opacity-70"
            title="Add to Cart"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <MdShoppingCart className="text-xl" />
            )}
          </button>
        </div>

        {/* Favorite Button */}
        <button
          onClick={toggleFavorite}
          className="absolute top-4 right-4 bg-white/90 p-2 rounded-full hover:bg-white transform hover:scale-110 transition-all duration-200 shadow-lg z-10"
          title={isFavorited ? "Remove from favorites" : "Add to favorites"}
        >
          {isFavorited ? (
            <MdFavorite className="text-lg text-red-500" />
          ) : (
            <MdFavoriteBorder className="text-lg text-gray-600" />
          )}
        </button>

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

        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <MdStar
                key={i}
                className={`text-sm ${
                  i < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">({reviewCount})</span>
        </div>

        {/* Category */}
        {product.category && (
          <span className="inline-block bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1 rounded-full">
            {product.category}
          </span>
        )}

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
          className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
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
