import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  MdFavorite,
  MdFavoriteBorder,
  MdShoppingCart,
  MdStar,
  MdRemoveRedEye,
  MdCheck,
} from "react-icons/md";
import useEcommerceStore from "../store/FireflyStore";
import FavoriteButton from "./FavoriteButton";

const ProductCard = ({ product }) => {
  const { addToCart, openCart } = useEcommerceStore();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

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

      // Show success feedback
      setShowSuccess(true);

      // Wait a bit then open cart
      setTimeout(() => {
        openCart();
        setShowSuccess(false);
        setIsLoading(false);
      }, 800);
    } catch (error) {
      console.error("Error adding to cart:", error);
      setIsLoading(false);
    }
  };

  if (!product) {
    return null;
  }

  const hasMultipleImages = product.images && product.images.length > 1;

  return (
    <motion.div
      className="block group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Link to={`/product/${product.slug}`}>
        {/* Image Container */}
        <div
          className="relative overflow-hidden"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Product Images */}
          <div className="relative w-full h-full">
            <motion.img
              src={product.images[0] || "/placeholder-image.svg"}
              alt={product.name}
              className="w-full h-full object-cover"
              animate={{
                opacity: currentImageIndex === 0 ? 1 : 0,
              }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            />

            {hasMultipleImages && (
              <motion.img
                src={product.images[1]}
                alt={product.name}
                className="absolute inset-0 w-full h-full object-cover"
                animate={{
                  opacity: currentImageIndex === 1 ? 1 : 0,
                }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              />
            )}
          </div>

          {/* Stock Badge */}
          {product.inventory <= 5 && product.inventory > 0 && (
            <motion.div
              className="absolute top-4 left-4 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", damping: 15 }}
            >
              Only {product.inventory} left
            </motion.div>
          )}

          {/* Out of Stock Badge */}
          {product.inventory === 0 && (
            <motion.div
              className="absolute inset-0 bg-black/60 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <span className="bg-red-500 text-white font-bold px-4 py-2 rounded-lg">
                Out of Stock
              </span>
            </motion.div>
          )}

          {/* Favorite Button */}
          <div className="absolute top-4 right-4 z-10">
            <FavoriteButton
              productId={product._id}
              size="sm"
              className="bg-white shadow-lg"
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="p-5 space-y-3">
          {/* Product Name */}
          <h3 className="font-semibold text-gray-900 text-lg leading-tight line-clamp-2 group-hover:text-orange-600 transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          {product.averageRating > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.div
                    key={star}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      delay: star * 0.1,
                      type: "spring",
                      damping: 15,
                    }}
                  >
                    <MdStar
                      className={`w-4 h-4 ${
                        star <= product.averageRating
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </motion.div>
                ))}
              </div>
              <span className="text-sm text-gray-600">
                ({product.totalReviews || 0})
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <motion.span
                className="text-2xl font-bold text-gray-900"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, type: "spring", damping: 15 }}
              >
                ${product.price}
              </motion.span>
              {product.originalPrice &&
                product.originalPrice > product.price && (
                  <motion.span
                    className="text-sm text-gray-500 line-through"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.4, type: "spring", damping: 15 }}
                  >
                    ${product.originalPrice}
                  </motion.span>
                )}
            </div>

            {product.originalPrice && product.originalPrice > product.price && (
              <motion.div
                className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.5, type: "spring", damping: 15 }}
              >
                -
                {Math.round(
                  ((product.originalPrice - product.price) /
                    product.originalPrice) *
                    100
                )}
                %
              </motion.div>
            )}
          </div>
        </div>
      </Link>

      {/* Add to Cart Button */}
      <div className="px-5 pb-5">
        <motion.button
          onClick={handleAddToCart}
          disabled={product.inventory === 0 || isLoading}
          className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 relative overflow-hidden"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.3 }}
        >
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-2"
              >
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Adding...
              </motion.div>
            ) : showSuccess ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-2"
              >
                <MdCheck className="text-lg" />
                Added to Cart!
              </motion.div>
            ) : product.inventory === 0 ? (
              <motion.span
                key="out-of-stock"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                Out of Stock
              </motion.span>
            ) : (
              <motion.div
                key="add-to-cart"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-2"
              >
                <MdShoppingCart className="text-lg" />
                Add to Cart
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
