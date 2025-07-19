import { useState, useEffect, useCallback } from "react";
import { MdStar, MdAdd, MdFilterList, MdSort } from "react-icons/md";
import useEcommerceStore from "../store/FireflyStore";
import ReviewStats from "./ReviewStats";
import ReviewCard from "./ReviewCard";
import ReviewForm from "./ReviewForm";

const ReviewsSection = ({ productId }) => {
  const {
    reviews,
    reviewStats,
    userReview,
    reviewsLoading,
    reviewsError,
    getProductReviews,
    getProductReviewStats,
    getUserProductReview,
    createReview,
    updateReview,
    deleteReview,
    toggleReviewHelpful,
    clearReviewsError,
    isAuthenticated,
  } = useEcommerceStore();

  const [showForm, setShowForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    sort: "newest",
    rating: "",
  });

  const loadReviews = useCallback(async () => {
    try {
      await getProductReviews(productId, filters);
    } catch (error) {
      console.error("Failed to load reviews:", error);
    }
  }, [productId, filters, getProductReviews]);

  const loadReviewStats = useCallback(async () => {
    try {
      await getProductReviewStats(productId);
    } catch (error) {
      console.error("Failed to load review stats:", error);
    }
  }, [productId, getProductReviewStats]);

  const loadUserReview = useCallback(async () => {
    try {
      await getUserProductReview(productId);
    } catch (error) {
      console.error("Failed to load user review:", error);
    }
  }, [productId, getUserProductReview]);

  useEffect(() => {
    if (productId) {
      loadReviews();
      loadReviewStats();
      if (isAuthenticated) {
        loadUserReview();
      }
    }
  }, [
    productId,
    isAuthenticated,
    loadReviews,
    loadReviewStats,
    loadUserReview,
  ]);

  useEffect(() => {
    if (productId) {
      loadReviews();
    }
  }, [filters, loadReviews]);

  const handleCreateReview = async (reviewData) => {
    try {
      await createReview({
        productId,
        ...reviewData,
      });
      setShowForm(false);
      clearReviewsError();
    } catch (error) {
      console.error("Failed to create review:", error);
    }
  };

  const handleUpdateReview = async (reviewData) => {
    try {
      await updateReview(editingReview._id, reviewData);
      setShowForm(false);
      setEditingReview(null);
      clearReviewsError();
    } catch (error) {
      console.error("Failed to update review:", error);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        await deleteReview(reviewId);
      } catch (error) {
        console.error("Failed to delete review:", error);
      }
    }
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setShowForm(true);
  };

  const handleToggleHelpful = async (reviewId) => {
    try {
      await toggleReviewHelpful(reviewId);
    } catch (error) {
      console.error("Failed to toggle helpful:", error);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to first page when filters change
    }));
  };

  const handlePageChange = (page) => {
    setFilters((prev) => ({
      ...prev,
      page,
    }));
  };

  const canUserReview = () => {
    return isAuthenticated && !userReview;
  };

  const renderFilters = () => (
    <div className="flex flex-wrap items-center gap-4 mb-6">
      {/* Sort */}
      <div className="flex items-center space-x-2">
        <MdSort className="w-4 h-4 text-gray-500" />
        <select
          value={filters.sort}
          onChange={(e) => handleFilterChange("sort", e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="rating">Highest Rated</option>
          <option value="helpful">Most Helpful</option>
        </select>
      </div>

      {/* Rating Filter */}
      <div className="flex items-center space-x-2">
        <MdFilterList className="w-4 h-4 text-gray-500" />
        <select
          value={filters.rating}
          onChange={(e) => handleFilterChange("rating", e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
        >
          <option value="">All Ratings</option>
          <option value="5">5 Stars</option>
          <option value="4">4 Stars</option>
          <option value="3">3 Stars</option>
          <option value="2">2 Stars</option>
          <option value="1">1 Star</option>
        </select>
      </div>
    </div>
  );

  const renderPagination = () => {
    if (!reviews || reviews.length === 0) return null;

    const totalPages = Math.ceil((reviews.length || 0) / filters.limit);
    if (totalPages <= 1) return null;

    return (
      <div className="flex items-center justify-center space-x-2 mt-6">
        <button
          onClick={() => handlePageChange(filters.page - 1)}
          disabled={filters.page <= 1}
          className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        <span className="px-3 py-2 text-sm text-gray-600">
          Page {filters.page} of {totalPages}
        </span>

        <button
          onClick={() => handlePageChange(filters.page + 1)}
          disabled={filters.page >= totalPages}
          className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    );
  };

  if (showForm) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <ReviewForm
            review={editingReview}
            onSubmit={editingReview ? handleUpdateReview : handleCreateReview}
            onCancel={() => {
              setShowForm(false);
              setEditingReview(null);
              clearReviewsError();
            }}
            isLoading={reviewsLoading}
            error={reviewsError}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Review Stats */}
      <ReviewStats stats={reviewStats} totalReviews={reviews?.length || 0} />

      {/* User Review Section */}
      {isAuthenticated && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          {userReview ? (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Your Review
              </h3>
              <ReviewCard
                review={userReview}
                onEdit={handleEditReview}
                onDelete={handleDeleteReview}
                onToggleHelpful={handleToggleHelpful}
                isUserReview={true}
                isLoading={reviewsLoading}
              />
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="flex items-center justify-center space-x-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <MdStar key={star} className="w-6 h-6 text-gray-300" />
                ))}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Share Your Experience
              </h3>
              <p className="text-gray-600 mb-4">
                Help other customers by writing a review for this product.
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors flex items-center mx-auto"
              >
                <MdAdd className="w-4 h-4 mr-2" />
                Write a Review
              </button>
            </div>
          )}
        </div>
      )}

      {/* All Reviews Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Customer Reviews ({reviews?.length || 0})
          </h3>
          {canUserReview() && (
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center"
            >
              <MdAdd className="w-4 h-4 mr-2" />
              Write Review
            </button>
          )}
        </div>

        {/* Filters */}
        {renderFilters()}

        {/* Reviews List */}
        {reviewsLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
          </div>
        ) : reviews && reviews.length > 0 ? (
          <div className="space-y-6">
            {reviews.map((review) => (
              <ReviewCard
                key={review._id}
                review={review}
                onEdit={handleEditReview}
                onDelete={handleDeleteReview}
                onToggleHelpful={handleToggleHelpful}
                isUserReview={userReview?._id === review._id}
                isLoading={reviewsLoading}
              />
            ))}
            {renderPagination()}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="flex items-center justify-center space-x-1 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <MdStar key={star} className="w-8 h-8 text-gray-300" />
              ))}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Reviews Yet
            </h3>
            <p className="text-gray-600 mb-4">
              Be the first to review this product and help other customers.
            </p>
            {isAuthenticated && (
              <button
                onClick={() => setShowForm(true)}
                className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors"
              >
                Write the First Review
              </button>
            )}
          </div>
        )}

        {/* Error Display */}
        {reviewsError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 text-sm">{reviewsError}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsSection;
