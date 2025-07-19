const EmptyState = ({
  type = "no-results",
  onRetry,
  onClearFilters,
  error,
}) => {
  if (type === "error") {
    return (
      <div className="text-center py-16">
        <div className="text-red-500 text-lg font-medium mb-2">
          Error Loading Products
        </div>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={onRetry}
          className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (type === "no-results") {
    return (
      <div className="text-center py-16">
        <div className="text-gray-400 text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No Products Found
        </h3>
        <p className="text-gray-600 mb-4">
          Try adjusting your filters or search terms to find what you're looking
          for.
        </p>
        <button
          onClick={onClearFilters}
          className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
        >
          Clear Filters
        </button>
      </div>
    );
  }

  return null;
};

export default EmptyState;
