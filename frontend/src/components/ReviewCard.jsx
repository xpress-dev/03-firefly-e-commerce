import {
  MdStar,
  MdThumbUp,
  MdThumbUpOffAlt,
  MdEdit,
  MdDelete,
} from "react-icons/md";

const ReviewCard = ({
  review,
  onEdit,
  onDelete,
  onToggleHelpful,
  isUserReview = false,
  isLoading = false,
}) => {
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getHelpfulCount = () => {
    return review.helpful?.length || 0;
  };

  const isHelpfulByCurrentUser = () => {
    // This would need to be passed from parent component based on current user
    return false; // Placeholder
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="font-semibold text-gray-900">{review.title}</h3>
            {review.isVerified && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Verified Purchase
              </span>
            )}
          </div>

          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              {renderStars(review.rating)}
              <span className="ml-1">{review.rating}/5</span>
            </div>
            <span>by {review.user?.name || "Anonymous"}</span>
            <span>{formatDate(review.createdAt)}</span>
          </div>
        </div>

        {/* Actions */}
        {isUserReview && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onEdit(review)}
              disabled={isLoading}
              className="p-2 text-gray-400 hover:text-blue-500 transition-colors disabled:opacity-50"
              title="Edit review"
            >
              <MdEdit className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(review._id)}
              disabled={isLoading}
              className="p-2 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
              title="Delete review"
            >
              <MdDelete className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Comment */}
      <div className="mb-4">
        <p className="text-gray-700 leading-relaxed">{review.comment}</p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <button
          onClick={() => onToggleHelpful(review._id)}
          disabled={isLoading}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors disabled:opacity-50 ${
            isHelpfulByCurrentUser()
              ? "bg-blue-50 text-blue-600"
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          {isHelpfulByCurrentUser() ? (
            <MdThumbUp className="w-4 h-4" />
          ) : (
            <MdThumbUpOffAlt className="w-4 h-4" />
          )}
          <span className="text-sm font-medium">
            Helpful ({getHelpfulCount()})
          </span>
        </button>

        {/* Updated date if different from created */}
        {review.updatedAt && review.updatedAt !== review.createdAt && (
          <span className="text-xs text-gray-500">
            Updated {formatDate(review.updatedAt)}
          </span>
        )}
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-600"></div>
        </div>
      )}
    </div>
  );
};

export default ReviewCard;
