import {
  MdSearch,
  MdFilterList,
  MdClear,
  MdExpandMore,
  MdExpandLess,
} from "react-icons/md";
import PriceRangeFilter from "./PriceRangeFilter";

const FilterSection = ({
  isMobile = false,
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
    <div className={`${isMobile ? "p-6" : "space-y-6"}`}>
      {/* Search Filter */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <MdSearch className="text-lg" />
          Search Products
        </h3>
        <div className="relative">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={onSearchChange}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
          <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Category Filter */}
      <div className="space-y-3">
        <button
          onClick={() => onToggleFilterExpansion("category")}
          className="w-full flex items-center justify-between font-semibold text-gray-900"
        >
          <span className="flex items-center gap-2">
            <MdFilterList className="text-lg" />
            Category
          </span>
          {expandedFilters.category ? <MdExpandLess /> : <MdExpandMore />}
        </button>
        {expandedFilters.category && (
          <div className="space-y-2 pl-6">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="category"
                value=""
                checked={filters.category === ""}
                onChange={(e) => onFilterChange("category", e.target.value)}
                className="text-orange-500 focus:ring-orange-500"
              />
              <span className="text-gray-700">All Categories</span>
            </label>
            {categories.map((category) => (
              <label
                key={category}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name="category"
                  value={category}
                  checked={filters.category === category}
                  onChange={(e) => onFilterChange("category", e.target.value)}
                  className="text-orange-500 focus:ring-orange-500"
                />
                <span className="text-gray-700">{category}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Gender Filter */}
      <div className="space-y-3">
        <button
          onClick={() => onToggleFilterExpansion("gender")}
          className="w-full flex items-center justify-between font-semibold text-gray-900"
        >
          <span>Gender</span>
          {expandedFilters.gender ? <MdExpandLess /> : <MdExpandMore />}
        </button>
        {expandedFilters.gender && (
          <div className="space-y-2 pl-6">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="gender"
                value=""
                checked={filters.gender === ""}
                onChange={(e) => onFilterChange("gender", e.target.value)}
                className="text-orange-500 focus:ring-orange-500"
              />
              <span className="text-gray-700">All Genders</span>
            </label>
            {genders.map((gender) => (
              <label
                key={gender}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name="gender"
                  value={gender}
                  checked={filters.gender === gender}
                  onChange={(e) => onFilterChange("gender", e.target.value)}
                  className="text-orange-500 focus:ring-orange-500"
                />
                <span className="text-gray-700">{gender}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price Filter */}
      <div className="space-y-3">
        <button
          onClick={() => onToggleFilterExpansion("price")}
          className="w-full flex items-center justify-between font-semibold text-gray-900"
        >
          <span>Price Range</span>
          {expandedFilters.price ? <MdExpandLess /> : <MdExpandMore />}
        </button>
        {expandedFilters.price && (
          <div className="pl-6">
            <PriceRangeFilter
              minPrice={priceRange.min}
              maxPrice={priceRange.max}
              onPriceChange={onPriceChange}
            />
          </div>
        )}
      </div>

      {/* Stock Filter */}
      <div className="space-y-3">
        <button
          onClick={() => onToggleFilterExpansion("stock")}
          className="w-full flex items-center justify-between font-semibold text-gray-900"
        >
          <span>Availability</span>
          {expandedFilters.stock ? <MdExpandLess /> : <MdExpandMore />}
        </button>
        {expandedFilters.stock && (
          <div className="space-y-2 pl-6">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="stock"
                value=""
                checked={filters.inStock === null}
                onChange={() => onFilterChange("inStock", null)}
                className="text-orange-500 focus:ring-orange-500"
              />
              <span className="text-gray-700">All Products</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="stock"
                value="true"
                checked={filters.inStock === true}
                onChange={() => onFilterChange("inStock", true)}
                className="text-orange-500 focus:ring-orange-500"
              />
              <span className="text-gray-700">In Stock Only</span>
            </label>
          </div>
        )}
      </div>

      {/* Clear Filters */}
      <button
        onClick={onClearFilters}
        className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
      >
        <MdClear />
        Clear All Filters
      </button>
    </div>
  );
};

export default FilterSection;
