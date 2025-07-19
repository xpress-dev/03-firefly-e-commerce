import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useReducer,
  useMemo,
} from "react";
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

// Filter state reducer
const filterReducer = (state, action) => {
  switch (action.type) {
    case "SET_SEARCH":
      return { ...state, search: action.payload };
    case "SET_FILTER":
      return { ...state, [action.filterType]: action.value };
    case "SET_PRICE_RANGE":
      return {
        ...state,
        minPrice: action.payload.minPrice,
        maxPrice: action.payload.maxPrice,
      };
    case "CLEAR_ALL":
      return {
        search: "",
        category: "",
        gender: "",
        minPrice: "",
        maxPrice: "",
        inStock: null,
      };
    case "SYNC_WITH_STORE":
      return {
        search: action.payload.search || "",
        category: action.payload.category || "",
        gender: action.payload.gender || "",
        minPrice: action.payload.minPrice || "",
        maxPrice: action.payload.maxPrice || "",
        inStock: action.payload.inStock ?? null,
      };
    default:
      return state;
  }
};

const initialFilterState = {
  search: "",
  category: "",
  gender: "",
  minPrice: "",
  maxPrice: "",
  inStock: null,
};

const CollectionsPage = () => {
  const {
    products,
    productsLoading,
    productsError,
    filters: storeFilters,
    pagination,
    getAllProducts,
    setFilters,
    clearFilters,
    setPagination,
  } = useEcommerceStore();

  // Use reducer for local filter state
  const [localFilters, dispatchFilter] = useReducer(
    filterReducer,
    initialFilterState
  );

  // Other local state
  const [isGridView, setIsGridView] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [expandedFilters, setExpandedFilters] = useState({
    category: true,
    gender: true,
    price: false,
    stock: false,
  });
  const [sortBy, setSortBy] = useState("newest");

  // Ref to track if we've already loaded products initially
  const hasInitiallyLoaded = useRef(false);
  const debounceTimerRef = useRef(null);

  // Filter options - memoized to prevent unnecessary re-renders
  const categories = useMemo(
    () => ["Shirt", "T-Shirt", "Trouser", "Shoes", "Jacket", "Suit"],
    []
  );
  const genders = useMemo(() => ["Men", "Women", "Unisex"], []);
  const sortOptions = useMemo(
    () => [
      { value: "newest", label: "Newest First" },
      { value: "oldest", label: "Oldest First" },
      { value: "price-low", label: "Price: Low to High" },
      { value: "price-high", label: "Price: High to Low" },
      { value: "name-asc", label: "Name: A to Z" },
      { value: "name-desc", label: "Name: Z to A" },
    ],
    []
  );

  // Sync local filters with store filters on component mount
  useEffect(() => {
    dispatchFilter({ type: "SYNC_WITH_STORE", payload: storeFilters });
  }, []); // Only run once on mount

  const getSortParams = useCallback((sortValue) => {
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
  }, []);

  // Load products function - memoized to prevent re-creation on every render
  const loadProducts = useCallback(async () => {
    try {
      const params = {
        ...storeFilters,
        page: pagination.page,
        limit: pagination.limit,
        sort: getSortParams(sortBy),
      };
      await getAllProducts(params);
    } catch (error) {
      console.error("Error loading products:", error);
    }
  }, [
    storeFilters,
    pagination.page,
    pagination.limit,
    sortBy,
    getAllProducts,
    getSortParams,
  ]);

  // Effect to sync local filters with store and trigger product loading
  useEffect(() => {
    // Clear any existing debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // For initial load, sync immediately
    if (!hasInitiallyLoaded.current) {
      hasInitiallyLoaded.current = true;
      setFilters(localFilters);
      return;
    }

    // Check if filters have actually changed
    const filtersChanged =
      localFilters.search !== storeFilters.search ||
      localFilters.category !== storeFilters.category ||
      localFilters.gender !== storeFilters.gender ||
      localFilters.minPrice !== storeFilters.minPrice ||
      localFilters.maxPrice !== storeFilters.maxPrice ||
      localFilters.inStock !== storeFilters.inStock;

    if (!filtersChanged) return;

    // Determine if this is a search operation
    const isSearchUpdate = localFilters.search !== storeFilters.search;
    const delay = isSearchUpdate ? 500 : 0;

    debounceTimerRef.current = setTimeout(() => {
      setFilters(localFilters);
    }, delay);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [localFilters, setFilters, storeFilters]);

  // Effect to load products when store filters change
  useEffect(() => {
    if (hasInitiallyLoaded.current) {
      loadProducts();
    }
  }, [loadProducts]);

  // Handler functions using reducer - memoized to prevent re-creation
  const handleSearchChange = useCallback((e) => {
    const value = e.target.value;
    dispatchFilter({ type: "SET_SEARCH", payload: value });
  }, []);

  const handleFilterChange = useCallback(
    (filterType, value) => {
      dispatchFilter({ type: "SET_FILTER", filterType, value });
      // Reset to first page when filters change
      setPagination({ page: 1 });
    },
    [setPagination]
  );

  const handlePriceRangeChange = useCallback(
    (newRange) => {
      dispatchFilter({
        type: "SET_PRICE_RANGE",
        payload: {
          minPrice: newRange.minPrice,
          maxPrice: newRange.maxPrice,
        },
      });
      setPagination({ page: 1 });
    },
    [setPagination]
  );

  const handleClearFilters = useCallback(() => {
    // Clear both local and store filters
    dispatchFilter({ type: "CLEAR_ALL" });
    clearFilters();
    setSortBy("newest");
    setPagination({ page: 1 });
  }, [clearFilters, setPagination]);

  const handlePageChange = useCallback(
    (newPage) => {
      setPagination({ page: newPage });
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [setPagination]
  );

  const toggleFilterExpansion = useCallback((filterType) => {
    setExpandedFilters((prev) => ({
      ...prev,
      [filterType]: !prev[filterType],
    }));
  }, []);

  const getActiveFiltersCount = useCallback(() => {
    let count = 0;
    if (localFilters.category) count++;
    if (localFilters.gender) count++;
    if (localFilters.minPrice || localFilters.maxPrice) count++;
    if (localFilters.search) count++;
    if (localFilters.inStock !== null) count++;
    return count;
  }, [localFilters]);

  // Memoized Filter Component to prevent unnecessary re-renders
  const FilterSection = useMemo(
    () =>
      ({ isMobile = false }) =>
        (
          <div className={`${isMobile ? "p-6 space-y-6" : "space-y-6"}`}>
            {/* Category Filter */}
            <div className="space-y-3">
              <button
                onClick={() => toggleFilterExpansion("category")}
                className="w-full flex items-center justify-between font-semibold text-gray-900 cursor-pointer"
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
                      checked={localFilters.category === ""}
                      onChange={(e) =>
                        handleFilterChange("category", e.target.value)
                      }
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
                        checked={localFilters.category === category}
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
                className="w-full flex items-center justify-between font-semibold text-gray-900 cursor-pointer"
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
                      checked={localFilters.gender === ""}
                      onChange={(e) =>
                        handleFilterChange("gender", e.target.value)
                      }
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
                        checked={localFilters.gender === gender}
                        onChange={(e) =>
                          handleFilterChange("gender", e.target.value)
                        }
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
                className="w-full flex items-center justify-between font-semibold text-gray-900 cursor-pointer"
              >
                <span>Price Range</span>
                {expandedFilters.price ? <MdExpandLess /> : <MdExpandMore />}
              </button>
              {expandedFilters.price && (
                <div className="pl-6">
                  <PriceRangeFilter
                    minPrice={localFilters.minPrice}
                    maxPrice={localFilters.maxPrice}
                    onPriceChange={handlePriceRangeChange}
                  />
                </div>
              )}
            </div>

            {/* Stock Filter */}
            <div className="space-y-3">
              <button
                onClick={() => toggleFilterExpansion("stock")}
                className="w-full flex items-center justify-between font-semibold text-gray-900 cursor-pointer"
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
                      checked={localFilters.inStock === null}
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
                      checked={localFilters.inStock === true}
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
              className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <MdClear />
              Clear All Filters
            </button>
          </div>
        ),
    [
      localFilters,
      expandedFilters,
      categories,
      genders,
      handleSearchChange,
      handleFilterChange,
      handlePriceRangeChange,
      handleClearFilters,
      toggleFilterExpansion,
    ]
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
                  className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 cursor-pointer"
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
                      className={`p-2 cursor-pointer ${
                        isGridView
                          ? "bg-orange-500 text-white"
                          : "bg-white text-gray-600"
                      }`}
                    >
                      <MdGridView />
                    </button>
                    <button
                      onClick={() => setIsGridView(false)}
                      className={`p-2 cursor-pointer ${
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
              onClearFilters={handleClearFilters}
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
                  className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors cursor-pointer"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                {" "}
                {/* Reduced margin */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
                          className={`px-4 py-2 rounded-lg cursor-pointer ${
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
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowMobileFilters(false)}
          />
          <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold">Filters</h2>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
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
