import { MdClose } from "react-icons/md";
import FilterSection from "./FilterSection";

const MobileFiltersModal = ({
  showMobileFilters,
  onClose,
  searchTerm,
  onSearchChange,
  filters,
  onFilterChange,
  expandedFilters,
  onToggleFilterExpansion,
  priceRange,
  onPriceChange,
  onClearFilters,
  categories,
  genders,
}) => {
  if (!showMobileFilters) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold">Filters</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <MdClose className="text-xl" />
          </button>
        </div>
        <div className="overflow-y-auto h-full pb-20">
          <FilterSection
            isMobile
            searchTerm={searchTerm}
            onSearchChange={onSearchChange}
            filters={filters}
            onFilterChange={onFilterChange}
            expandedFilters={expandedFilters}
            onToggleFilterExpansion={onToggleFilterExpansion}
            priceRange={priceRange}
            onPriceChange={onPriceChange}
            onClearFilters={onClearFilters}
            categories={categories}
            genders={genders}
          />
        </div>
      </div>
    </div>
  );
};

export default MobileFiltersModal;
