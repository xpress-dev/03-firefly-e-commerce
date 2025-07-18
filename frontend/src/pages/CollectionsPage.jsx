import { useEffect, useState } from "react";
import {
  MdSearch,
  MdFilterList,
  MdClear,
  MdGridView,
  MdViewList,
  MdExpandMore,
  MdExpandLess,
  MdClose,
} from "react-icons/md";
import useEcommerceStore from "../store/FireflyStore";
import ProductsGrid from "../components/ProductsGrid";
import PriceRangeFilter from "../components/PriceRangeFilter";
import SortDropdown from "../components/SortDropdown";

const CollectionsPage = () => {
  const {
    products,
    productsLoading,
    productsError,
    filters,
    pagination,
    getAllProducts,
    setFilters,
    clearFilters,
    setPagination,
  } = useEcommerceStore();

  // Local state for UI
  const [searchTerm, setSearchTerm] = useState(filters.search || "");
  const [isGridView, setIsGridView] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [expandedFilters, setExpandedFilters] = useState({
    category: true,
    gender: true,
    price: true,
    stock: false,
  });
  const [sortBy, setSortBy] = useState("newest");
  const [priceRange, setPriceRange] = useState({
    min: filters.minPrice || "",
    max: filters.maxPrice || "",
  });

  // Filter options
  const categories = ["Shirt", "T-Shirt", "Trouser", "Shoes", "Jacket", "Suit"];
  const genders = ["Men", "Women", "Unisex"];
  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "name-asc", label: "Name: A to Z" },
    { value: "name-desc", label: "Name: Z to A" },
  ];

  // Load products function
  const loadProducts = async () => {
    try {
      const params = {
        ...filters,
        page: pagination.page,
        limit: pagination.limit,
        sort: getSortParams(sortBy),
      };
      await getAllProducts(params);
    } catch (error) {
      console.error("Error loading products:", error);
    }
  };

  // Load products on component mount
  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load products when filters or pagination change
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      loadProducts();
    }, 500);

    return () => clearTimeout(delayedSearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, pagination.page, sortBy]);

  const getSortParams = (sortValue) => {
    switch (sortValue) {
      case "newest":
        return "-createdAt";
      case "oldest":
        return "createdAt";
      case "price-low":
        return "price";
      case "price-high":
        return "-price";
      case "name-asc":
        return "name";
      case "name-desc":
        return "-name";
      default:
        return "-createdAt";
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setFilters({ search: value });
  };

  const handleFilterChange = (filterType, value) => {
    setFilters({ [filterType]: value });
    // Reset to first page when filters change
    setPagination({ page: 1 });
  };

  const handleClearFilters = () => {
    clearFilters();
    setSearchTerm("");
    setPriceRange({ min: "", max: "" });
    setSortBy("newest");
    setPagination({ page: 1 });
  };

  const handlePageChange = (newPage) => {
    setPagination({ page: newPage });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleFilterExpansion = (filterType) => {
    setExpandedFilters((prev) => ({
      ...prev,
      [filterType]: !prev[filterType],
    }));
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.category) count++;
    if (filters.gender) count++;
    if (filters.minPrice || filters.maxPrice) count++;
    if (filters.search) count++;
    if (filters.inStock !== null) count++;
    return count;
  };

  // Filter Component
  const FilterSection = ({ isMobile = false }) => (
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
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
          <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Category Filter */}
      <div className="space-y-3">
        <button
          onClick={() => toggleFilterExpansion("category")}
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
                onChange={(e) => handleFilterChange("category", e.target.value)}
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
                  onChange={(e) =>
                    handleFilterChange("category", e.target.value)
                  }
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
          onClick={() => toggleFilterExpansion("gender")}
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
                onChange={(e) => handleFilterChange("gender", e.target.value)}
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
                  onChange={(e) => handleFilterChange("gender", e.target.value)}
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
          onClick={() => toggleFilterExpansion("price")}
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
              onPriceChange={(newRange) => {
                setPriceRange(newRange);
                setFilters({
                  minPrice: newRange.minPrice,
                  maxPrice: newRange.maxPrice,
                });
                setPagination({ page: 1 });
              }}
            />
          </div>
        )}
      </div>

      {/* Stock Filter */}
      <div className="space-y-3">
        <button
          onClick={() => toggleFilterExpansion("stock")}
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
                onChange={() => handleFilterChange("inStock", null)}
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
                onChange={() => handleFilterChange("inStock", true)}
                className="text-orange-500 focus:ring-orange-500"
              />
              <span className="text-gray-700">In Stock Only</span>
            </label>
          </div>
        )}
      </div>

      {/* Clear Filters */}
      <button
        onClick={handleClearFilters}
        className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
      >
        <MdClear />
        Clear All Filters
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Our Collections
          </h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Discover our curated selection of premium fashion and lifestyle
            products
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block w-80 bg-white rounded-xl shadow-sm p-6 h-fit sticky top-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Filters</h2>
              {getActiveFiltersCount() > 0 && (
                <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                  {getActiveFiltersCount()}
                </span>
              )}
            </div>
            <FilterSection />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Header */}
            <div className="lg:hidden mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Products</h2>
                <button
                  onClick={() => setShowMobileFilters(true)}
                  className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200"
                >
                  <MdFilterList />
                  Filters
                  {getActiveFiltersCount() > 0 && (
                    <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                      {getActiveFiltersCount()}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Toolbar */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                {/* Results Info */}
                <div className="text-gray-600">
                  {productsLoading
                    ? "Loading..."
                    : `Showing ${products.length} of ${pagination.total} products`}
                </div>

                {/* Controls */}
                <div className="flex items-center gap-4">
                  {/* Sort */}
                  <SortDropdown
                    value={sortBy}
                    onChange={setSortBy}
                    options={sortOptions}
                  />

                  {/* View Toggle */}
                  <div className="hidden sm:flex border border-gray-300 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setIsGridView(true)}
                      className={`p-2 ${
                        isGridView
                          ? "bg-orange-500 text-white"
                          : "bg-white text-gray-600"
                      }`}
                    >
                      <MdGridView />
                    </button>
                    <button
                      onClick={() => setIsGridView(false)}
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

            {/* Products Grid/List */}
            <ProductsGrid
              products={products}
              isGridView={isGridView}
              loading={productsLoading}
            />

            {/* Error State */}
            {productsError && !productsLoading && (
              <div className="text-center py-16">
                <div className="text-red-500 text-lg font-medium mb-2">
                  Error Loading Products
                </div>
                <p className="text-gray-600 mb-4">{productsError}</p>
                <button
                  onClick={loadProducts}
                  className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* No Results */}
            {!productsLoading && !productsError && products.length === 0 && (
              <div className="text-center py-16">
                <div className="text-gray-400 text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No Products Found
                </h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your filters or search terms to find what you're
                  looking for.
                </p>
                <button
                  onClick={handleClearFilters}
                  className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="mt-12 flex justify-center">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
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
                          onClick={() => handlePageChange(pageNumber)}
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
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setShowMobileFilters(false)}
          />
          <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold">Filters</h2>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <MdClose className="text-xl" />
              </button>
            </div>
            <div className="overflow-y-auto h-full pb-20">
              <FilterSection isMobile />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollectionsPage;
