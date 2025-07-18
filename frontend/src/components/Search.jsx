import { useState, useEffect, useRef } from "react";
import {
  MdSearch,
  MdClose,
  MdHistory,
  MdTrendingUp,
  MdArrowRightAlt,
  MdClear,
} from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import useEcommerceStore from "../store/FireflyStore";

const Search = () => {
  const {
    searchResults,
    searchLoading,
    searchError,
    isSearchOpen,
    searchProducts,
    clearSearch,
    closeSearch,
    setFilters,
  } = useEcommerceStore();

  const [localQuery, setLocalQuery] = useState("");
  const [searchHistory, setSearchHistory] = useState([]);
  const [recentSearches] = useState([
    "Men's Shirts",
    "Women's Shoes",
    "Casual Wear",
    "Formal Suits",
    "T-Shirts",
  ]);

  const searchRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Load search history from localStorage
    const saved = localStorage.getItem("searchHistory");
    if (saved) {
      setSearchHistory(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        closeSearch();
      }
    };

    if (isSearchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSearchOpen, closeSearch]);

  useEffect(() => {
    if (localQuery.trim()) {
      const delayedSearch = setTimeout(() => {
        searchProducts(localQuery);
      }, 300);
      return () => clearTimeout(delayedSearch);
    } else {
      clearSearch();
    }
  }, [localQuery, searchProducts, clearSearch]);

  const handleSearchSubmit = (query) => {
    if (!query.trim()) return;

    // Add to search history
    const newHistory = [
      query,
      ...searchHistory.filter((item) => item !== query),
    ].slice(0, 5);
    setSearchHistory(newHistory);
    localStorage.setItem("searchHistory", JSON.stringify(newHistory));

    // Navigate to collections with search filter
    setFilters({ search: query });
    navigate("/collections");
    closeSearch();
  };

  const handleProductClick = () => {
    closeSearch();
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem("searchHistory");
  };

  if (!isSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50">
      <div
        className="max-w-2xl mx-auto mt-20 bg-white rounded-xl shadow-2xl overflow-hidden"
        ref={searchRef}
      >
        {/* Search Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <MdSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search for products..."
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleSearchSubmit(localQuery);
                  }
                }}
                className="w-full pl-12 pr-4 py-4 text-lg border-0 focus:ring-0 focus:outline-none"
              />
            </div>
            <button
              onClick={closeSearch}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <MdClose className="text-xl text-gray-600" />
            </button>
          </div>

          {/* Search Actions */}
          {localQuery && (
            <div className="flex items-center gap-2 mt-4">
              <button
                onClick={() => handleSearchSubmit(localQuery)}
                className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
              >
                <MdSearch />
                Search "{localQuery}"
              </button>
              <button
                onClick={() => setLocalQuery("")}
                className="text-gray-500 hover:text-gray-700 p-2"
              >
                <MdClear />
              </button>
            </div>
          )}
        </div>

        {/* Search Content */}
        <div className="max-h-96 overflow-y-auto">
          {searchLoading ? (
            <div className="p-6 text-center">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
              <p className="mt-2 text-gray-600">Searching...</p>
            </div>
          ) : searchError ? (
            <div className="p-6 text-center text-red-500">
              <p>Error: {searchError}</p>
            </div>
          ) : localQuery && searchResults.length > 0 ? (
            /* Search Results */
            <div className="p-4 space-y-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Search Results</h3>
                <span className="text-sm text-gray-500">
                  {searchResults.length} results
                </span>
              </div>
              {searchResults.map((product) => (
                <Link
                  key={product._id}
                  to={`/product/${product._id}`}
                  onClick={handleProductClick}
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <img
                    src={product.images[0] || "/placeholder-image.svg"}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {product.name}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>${product.price}</span>
                      {product.category && (
                        <>
                          <span>•</span>
                          <span>{product.category}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <MdArrowRightAlt className="text-gray-400" />
                </Link>
              ))}

              {searchResults.length >= 10 && (
                <div className="pt-4 border-t border-gray-100">
                  <button
                    onClick={() => handleSearchSubmit(localQuery)}
                    className="w-full text-orange-500 hover:text-orange-600 font-medium py-2"
                  >
                    View all results for "{localQuery}"
                  </button>
                </div>
              )}
            </div>
          ) : localQuery && searchResults.length === 0 ? (
            /* No Results */
            <div className="p-6 text-center">
              <MdSearch className="text-4xl text-gray-300 mx-auto mb-2" />
              <p className="text-gray-600 mb-4">
                No products found for "{localQuery}"
              </p>
              <button
                onClick={() => handleSearchSubmit(localQuery)}
                className="text-orange-500 hover:text-orange-600 font-medium"
              >
                Search in all products
              </button>
            </div>
          ) : (
            /* Default State */
            <div className="p-4 space-y-6">
              {/* Search History */}
              {searchHistory.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <MdHistory className="text-lg" />
                      Recent Searches
                    </h3>
                    <button
                      onClick={clearSearchHistory}
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="space-y-1">
                    {searchHistory.map((item, index) => (
                      <button
                        key={index}
                        onClick={() => setLocalQuery(item)}
                        className="w-full text-left p-2 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-3"
                      >
                        <MdHistory className="text-gray-400" />
                        <span className="text-gray-700">{item}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Searches */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <MdTrendingUp className="text-lg" />
                  Popular Searches
                </h3>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => setLocalQuery(item)}
                      className="px-3 py-2 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">
                  Browse Categories
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    "Men's Fashion",
                    "Women's Fashion",
                    "Shoes",
                    "Accessories",
                  ].map((category) => (
                    <Link
                      key={category}
                      to="/collections"
                      onClick={() => {
                        setFilters({ category: category.split("'s")[0] });
                        closeSearch();
                      }}
                      className="p-3 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-colors text-center"
                    >
                      <span className="text-gray-700 font-medium">
                        {category}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
