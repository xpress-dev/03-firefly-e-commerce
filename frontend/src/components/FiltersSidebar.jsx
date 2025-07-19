import FilterSection from "./FilterSection";

const FiltersSidebar = ({
  activeFiltersCount,
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
  return (
    <div className="hidden lg:block w-80 bg-white rounded-xl shadow-sm p-6 h-fit sticky top-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Filters</h2>
        {activeFiltersCount > 0 && (
          <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
            {activeFiltersCount}
          </span>
        )}
      </div>
      <FilterSection
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
  );
};

export default FiltersSidebar;
