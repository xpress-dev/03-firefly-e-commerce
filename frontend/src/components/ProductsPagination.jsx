const ProductsPagination = ({ pagination, onPageChange }) => {
  if (pagination.totalPages <= 1) return null;

  return (
    <div className="mt-12 flex justify-center">
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onPageChange(pagination.page - 1)}
          disabled={pagination.page === 1}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        {[...Array(pagination.totalPages)].map((_, index) => {
          const pageNumber = index + 1;
          const isCurrentPage = pageNumber === pagination.page;

          // Show first page, last page, current page and adjacent pages
          if (
            pageNumber === 1 ||
            pageNumber === pagination.totalPages ||
            (pageNumber >= pagination.page - 1 &&
              pageNumber <= pagination.page + 1)
          ) {
            return (
              <button
                key={pageNumber}
                onClick={() => onPageChange(pageNumber)}
                className={`px-4 py-2 rounded-lg ${
                  isCurrentPage
                    ? "bg-orange-500 text-white"
                    : "border border-gray-300 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {pageNumber}
              </button>
            );
          } else if (
            pageNumber === pagination.page - 2 ||
            pageNumber === pagination.page + 2
          ) {
            return (
              <span key={pageNumber} className="px-2 text-gray-400">
                ...
              </span>
            );
          }
          return null;
        })}

        <button
          onClick={() => onPageChange(pagination.page + 1)}
          disabled={pagination.page === pagination.totalPages}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ProductsPagination;
