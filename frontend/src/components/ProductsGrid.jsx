import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "./ProductCard";
import {
  MdStar,
  MdShoppingCart,
  MdFavorite,
  MdFavoriteBorder,
} from "react-icons/md";
import { useState } from "react";
import useEcommerceStore from "../store/FireflyStore";

const ProductsGrid = ({
  products = [],
  isGridView = true,
  loading = false,
  className = "",
  onClearFilters,
}) => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
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
  };

  const emptyStateVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 300,
      },
    },
  };

  if (loading) {
    return (
      <motion.div
        className={`grid gap-6 ${
          isGridView
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            : "grid-cols-1"
        } ${className}`}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {[...Array(8)].map((_, index) => (
          <ProductSkeleton key={index} isGridView={isGridView} index={index} />
        ))}
      </motion.div>
    );
  }

  if (products.length === 0) {
    return (
      <motion.div
        className="text-center"
        variants={emptyStateVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="text-gray-400 text-6xl mb-4"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: "spring", damping: 15 }}
        >
          🔍
        </motion.div>
        <motion.h3
          className="text-xl font-semibold text-gray-900 mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
        >
          No Products Found
        </motion.h3>
        <motion.p
          className="text-gray-600 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.3 }}
        >
          Try adjusting your filters or search terms to find what you're looking
          for.
        </motion.p>
        {onClearFilters && (
          <motion.button
            onClick={onClearFilters}
            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.3 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Clear Filters
          </motion.button>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`grid gap-6 ${
        isGridView
          ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          : "grid-cols-1"
      } ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      layout
    >
      <AnimatePresence mode="popLayout">
        {products.map((product, index) => (
          <motion.div
            key={product._id}
            variants={itemVariants}
            layout
            initial="hidden"
            animate="visible"
            exit={{
              opacity: 0,
              scale: 0.8,
              y: -20,
              transition: { duration: 0.2 },
            }}
            transition={{
              type: "spring",
              damping: 20,
              stiffness: 300,
              delay: index * 0.05,
            }}
          >
            {isGridView ? (
              <ProductCard product={product} />
            ) : (
              <ProductListItem product={product} />
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

// Product List Item for List View
const ProductListItem = ({ product }) => {
  const { addToCart, openCart } = useEcommerceStore();

  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  const rating = product.rating || 4.5;

  return (
    <motion.div
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
      whileHover={{ y: -2 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex">
        {/* Product Image */}
        <motion.div
          className="w-48 h-48 flex-shrink-0"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", damping: 15 }}
        >
          <img
            src={product.images[0] || "/placeholder-image.svg"}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Product Info */}
        <div className="flex-1 p-6 flex flex-col justify-between">
          <div>
            {/* Category */}
            {product.category && (
              <motion.span
                className="inline-block bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded-full mb-2"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, type: "spring", damping: 15 }}
              >
                {product.category}
              </motion.span>
            )}

            {/* Product Name */}
            <motion.h3
              className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              {product.name}
            </motion.h3>

            {/* Rating */}
            <motion.div
              className="flex items-center gap-2 mb-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
            >
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      delay: 0.4 + i * 0.1,
                      type: "spring",
                      damping: 15,
                    }}
                  >
                    <MdStar
                      className={`text-sm ${
                        i < Math.floor(rating)
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </motion.div>
                ))}
              </div>
              <span className="text-sm text-gray-600">
                ({product.totalReviews || 0} reviews)
              </span>
            </motion.div>

            {/* Description (if available) */}
            {product.description && (
              <motion.p
                className="text-gray-600 text-sm line-clamp-2 mb-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.3 }}
              >
                {product.description}
              </motion.p>
            )}

            {/* Stock Status */}
            <motion.div
              className="mb-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.3 }}
            >
              {product.inventory > 10 ? (
                <span className="text-green-600 text-sm font-medium">
                  In Stock
                </span>
              ) : product.inventory > 0 ? (
                <span className="text-orange-600 text-sm font-medium">
                  Only {product.inventory} left
                </span>
              ) : (
                <span className="text-red-600 text-sm font-medium">
                  Out of Stock
                </span>
              )}
            </motion.div>
          </div>

          {/* Price and Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <motion.span
                className="text-2xl font-bold text-gray-900"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.7, type: "spring", damping: 15 }}
              >
                ${product.price}
              </motion.span>
              {product.originalPrice &&
                product.originalPrice > product.price && (
                  <>
                    <motion.span
                      className="text-sm text-gray-500 line-through"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.8, type: "spring", damping: 15 }}
                    >
                      ${product.originalPrice}
                    </motion.span>
                    <motion.div
                      className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.9, type: "spring", damping: 15 }}
                    >
                      -
                      {Math.round(
                        ((product.originalPrice - product.price) /
                          product.originalPrice) *
                          100
                      )}
                      %
                    </motion.div>
                  </>
                )}
            </div>

            <div className="flex items-center gap-2">
              <motion.button
                onClick={toggleFavorite}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                title={
                  isFavorited ? "Remove from favorites" : "Add to favorites"
                }
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {isFavorited ? (
                  <MdFavorite className="text-xl text-red-500" />
                ) : (
                  <MdFavoriteBorder className="text-xl text-gray-400" />
                )}
              </motion.button>

              <motion.button
                onClick={handleAddToCart}
                disabled={product.inventory === 0 || isLoading}
                className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
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
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Skeleton Loading Component
const ProductSkeleton = ({ isGridView, index }) => {
  if (isGridView) {
    return (
      <motion.div
        className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1, duration: 0.3 }}
      >
        <div className="w-full h-48 bg-gray-200"></div>
        <div className="p-5 space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
    >
      <div className="flex">
        <div className="w-48 h-48 bg-gray-200"></div>
        <div className="flex-1 p-6 space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="flex justify-between items-center">
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductsGrid;
