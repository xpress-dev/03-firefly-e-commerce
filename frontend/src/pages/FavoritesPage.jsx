import React, { useEffect, useState } from "react";
import useEcommerceStore from "../store/FireflyStore";
import ProductCard from "../components/ProductCard";
import FavoriteButton from "../components/FavoriteButton";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";

const FavoritesPage = () => {
  const {
    favorites,
    favoritesLoading,
    favoritesError,
    getUserFavorites,
    removeFromFavorites,
    clearFavoritesError,
  } = useEcommerceStore();

  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    loadFavorites();
    return () => clearFavoritesError();
  }, [currentPage]);

  const loadFavorites = async () => {
    try {
      const response = await getUserFavorites({ page: currentPage, limit: 12 });
      if (response?.pagination) {
        setPagination(response.pagination);
      }
    } catch (error) {
      console.error("Failed to load favorites:", error);
    }
  };

  const handleRemoveFavorite = async (productId) => {
    try {
      await removeFromFavorites(productId);
      // Reload favorites to update pagination
      if (favorites.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        loadFavorites();
      }
    } catch (error) {
      console.error("Failed to remove favorite:", error);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  if (favoritesLoading && favorites.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your favorites...</p>
          </div>
        </div>
      </div>
    );
  }

  if (favoritesError) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Error Loading Favorites
            </h2>
            <p className="text-gray-600 mb-4">{favoritesError}</p>
            <button
              onClick={loadFavorites}
              className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">
              <MdFavoriteBorder className="mx-auto" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              No Favorites Yet
            </h2>
            <p className="text-gray-600 mb-6">
              Start building your collection by adding products to your
              favorites!
            </p>
            <a
              href="/collections"
              className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors inline-flex items-center"
            >
              Browse Products
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Favorites</h1>
              <p className="text-gray-600 mt-2">
                {pagination?.total || favorites.length} items in your collection
              </p>
            </div>
            <div className="flex items-center text-orange-500">
              <MdFavorite className="w-6 h-6 mr-2" />
              <span className="font-semibold">Favorites</span>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {favorites.map((favorite) => (
            <div key={favorite._id} className="relative group">
              <ProductCard product={favorite.product} />
              <div className="absolute top-3 right-3 z-10">
                <FavoriteButton
                  productId={favorite.product._id}
                  size="sm"
                  className="bg-white shadow-lg"
                />
              </div>
              <button
                onClick={() => handleRemoveFavorite(favorite.product._id)}
                className="absolute top-3 left-3 z-10 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                title="Remove from favorites"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex justify-center">
            <nav className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!pagination.hasPrevPage}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              {Array.from(
                { length: pagination.totalPages },
                (_, i) => i + 1
              ).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    page === currentPage
                      ? "bg-orange-500 text-white"
                      : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!pagination.hasNextPage}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </nav>
          </div>
        )}

        {/* Loading overlay for pagination */}
        {favoritesLoading && favorites.length > 0 && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
