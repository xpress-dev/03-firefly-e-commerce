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
}) => {
  if (loading) {
    return (
      <div
        className={`grid gap-6 ${
          isGridView
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            : "grid-cols-1"
        } ${className}`}
      >
        {[...Array(8)].map((_, index) => (
          <ProductSkeleton key={index} isGridView={isGridView} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-gray-400 text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No Products Found
        </h3>
        <p className="text-gray-600">
          Try adjusting your filters or search terms to find what you're looking
          for.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`grid gap-6 ${
        isGridView
          ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          : "grid-cols-1"
      } ${className}`}
    >
      {products.map((product) => (
        <div key={product._id}>
          {isGridView ? (
            <ProductCard product={product} />
          ) : (
            <ProductListItem product={product} />
          )}
        </div>
      ))}
    </div>
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
  const reviewCount =
    product.reviewCount || Math.floor(Math.random() * 100) + 10;

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
      <div className="flex">
        {/* Product Image */}
        <div className="w-48 h-48 flex-shrink-0">
          <img
            src={product.images[0] || "/placeholder-image.svg"}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Product Info */}
        <div className="flex-1 p-6 flex flex-col justify-between">
          <div>
            {/* Category */}
            {product.category && (
              <span className="inline-block bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded-full mb-2">
                {product.category}
              </span>
            )}

            {/* Product Name */}
            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
              {product.name}
            </h3>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <MdStar
                    key={i}
                    className={`text-sm ${
                      i < Math.floor(rating)
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                ({reviewCount} reviews)
              </span>
            </div>

            {/* Description (if available) */}
            {product.description && (
              <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                {product.description}
              </p>
            )}

            {/* Stock Status */}
            <div className="mb-4">
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
            </div>
          </div>

          {/* Price and Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900">
                ${product.price}
              </span>
              {product.originalPrice &&
                product.originalPrice > product.price && (
                  <>
                    <span className="text-sm text-gray-500 line-through">
                      ${product.originalPrice}
                    </span>
                    <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded">
                      -
                      {Math.round(
                        ((product.originalPrice - product.price) /
                          product.originalPrice) *
                          100
                      )}
                      %
                    </span>
                  </>
                )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleFavorite}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                title={
                  isFavorited ? "Remove from favorites" : "Add to favorites"
                }
              >
                {isFavorited ? (
                  <MdFavorite className="text-xl text-red-500" />
                ) : (
                  <MdFavoriteBorder className="text-xl text-gray-400" />
                )}
              </button>

              <button
                onClick={handleAddToCart}
                disabled={product.inventory === 0 || isLoading}
                className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
          </div>
        </div>
      </div>
    </div>
  );
};

// Skeleton Loading Component
const ProductSkeleton = ({ isGridView }) => {
  if (isGridView) {
    return (
      <div className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
        <div className="h-64 bg-gray-200"></div>
        <div className="p-4 space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
      <div className="flex">
        <div className="w-48 h-48 bg-gray-200"></div>
        <div className="flex-1 p-6 space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          <div className="flex justify-between items-center pt-4">
            <div className="h-8 bg-gray-200 rounded w-24"></div>
            <div className="h-10 bg-gray-200 rounded w-32"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsGrid;
