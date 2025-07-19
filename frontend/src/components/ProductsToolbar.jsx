import { MdGridView, MdViewList } from "react-icons/md";
import SortDropdown from "./SortDropdown";

const ProductsToolbar = ({
  productsLoading,
  productsCount,
  totalProducts,
  sortBy,
  onSortChange,
  sortOptions,
  isGridView,
  onViewToggle,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Results Info */}
        <div className="text-gray-600">
          {productsLoading
            ? "Loading..."
            : `Showing ${productsCount} of ${totalProducts} products`}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          {/* Sort */}
          <SortDropdown
            value={sortBy}
            onChange={onSortChange}
            options={sortOptions}
          />

          {/* View Toggle */}
          <div className="hidden sm:flex border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => onViewToggle(true)}
              className={`p-2 ${
                isGridView
                  ? "bg-orange-500 text-white"
                  : "bg-white text-gray-600"
              }`}
            >
              <MdGridView />
            </button>
            <button
              onClick={() => onViewToggle(false)}
              className={`p-2 ${
                !isGridView
                  ? "bg-orange-500 text-white"
                  : "bg-white text-gray-600"
              }`}
            >
              <MdViewList />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsToolbar;
