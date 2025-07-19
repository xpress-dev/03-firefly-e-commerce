import { MdStar } from "react-icons/md";

const ReviewStats = ({ stats, totalReviews }) => {
  if (!stats) return null;

  const { averageRating, ratingDistribution } = stats;

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <MdStar
          key={i}
          className={`w-4 h-4 ${
            i <= rating ? "text-yellow-400" : "text-gray-300"
          }`}
        />
      );
    }
    return stars;
  };

  const getPercentage = (count) => {
    if (totalReviews === 0) return 0;
    return Math.round((count / totalReviews) * 100);
  };

  const renderRatingBar = (rating, count) => {
    const percentage = getPercentage(count);
    return (
      <div key={rating} className="flex items-center space-x-3">
        <div className="flex items-center space-x-1 w-12">
          <span className="text-sm text-gray-600">{rating}</span>
          <MdStar className="w-3 h-3 text-yellow-400" />
        </div>
        <div className="flex-1 bg-gray-200 rounded-full h-2">
          <div
            className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Customer Reviews
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Overall Rating */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 mb-2">
            {renderStars(averageRating)}
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {averageRating.toFixed(1)}
          </div>
          <div className="text-sm text-gray-600 mb-2">out of 5 stars</div>
          <div className="text-sm text-gray-500">
            Based on {totalReviews} review{totalReviews !== 1 ? "s" : ""}
          </div>
        </div>

        {/* Rating Distribution */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">
            Rating Distribution
          </h4>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) =>
              renderRatingBar(rating, ratingDistribution[rating] || 0)
            )}
          </div>
        </div>
      </div>

      {/* Summary */}
      {totalReviews > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="text-sm text-gray-600">
            {averageRating >= 4.5 &&
              "Excellent product with outstanding reviews!"}
            {averageRating >= 4.0 &&
              averageRating < 4.5 &&
              "Great product with positive reviews."}
            {averageRating >= 3.5 &&
              averageRating < 4.0 &&
              "Good product with mixed reviews."}
            {averageRating >= 3.0 &&
              averageRating < 3.5 &&
              "Average product with some concerns."}
            {averageRating < 3.0 &&
              "Product has received mixed to negative feedback."}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewStats;
