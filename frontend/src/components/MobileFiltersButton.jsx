import { MdFilterList } from "react-icons/md";

const MobileFiltersButton = ({ onClick, activeFiltersCount }) => {
  return (
    <div className="lg:hidden mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Products</h2>
        <button
          onClick={onClick}
          className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200"
        >
          <MdFilterList />
          Filters
          {activeFiltersCount > 0 && (
            <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default MobileFiltersButton;
