import { useEffect, useState } from "react";
import { MdNewReleases, MdAccessTime, MdAutorenew } from "react-icons/md";
import useEcommerceStore from "../store/FireflyStore";
import ProductCard from "./ProductCard";

const LatestProducts = () => {
  const { products, productsLoading, productsError } = useEcommerceStore();
  const [latestProducts, setLatestProducts] = useState([]);

  useEffect(() => {
    if (!productsLoading && products) {
      const tempLatestProducts = products
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 4);
      setLatestProducts(tempLatestProducts);
    }
  }, [products, productsLoading]);

  if (productsLoading) {
    return (
      <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-right mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <MdAccessTime className="text-3xl text-blue-500 animate-spin" />
              <h2 className="oswald-font text-3xl sm:text-4xl font-bold text-gray-900">
                Latest Products
              </h2>
            </div>
            <p className="text-gray-600 max-w-2xl ml-auto">
              Fresh arrivals and newest additions to our collection
            </p>
          </div>

          {/* Loading Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse"
              >
                <div className="h-64 bg-gray-200"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (productsError) {
    return (
      <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-right mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <MdNewReleases className="text-3xl text-blue-500" />
              <h2 className="oswald-font text-3xl sm:text-4xl font-bold text-gray-900">
                Latest Products
              </h2>
            </div>
          </div>

          <div className="text-center bg-white p-8 rounded-xl shadow-sm">
            <div className="text-red-500 text-lg font-medium mb-2">
              Unable to Load Latest Products
            </div>
            <p className="text-gray-600">
              Error loading products: {productsError}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors inline-flex items-center gap-2"
            >
              <MdAutorenew className="text-lg" />
              Refresh
            </button>
          </div>
        </div>
      </section>
    );
  }

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const productDate = new Date(dateString);
    const diffInHours = Math.floor((now - productDate) / (1000 * 60 * 60));

    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInHours < 168) {
      return `${Math.floor(diffInHours / 24)}d ago`;
    } else {
      return `${Math.floor(diffInHours / 168)}w ago`;
    }
  };

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-right mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <MdAccessTime className="text-3xl text-blue-500" />
            <h2 className="oswald-font text-3xl sm:text-4xl font-bold text-gray-900">
              Latest Products
            </h2>
            <MdNewReleases className="text-2xl text-green-500" />
          </div>
          <p className="text-gray-600 max-w-2xl ml-auto text-lg">
            Discover our newest arrivals and fresh additions to the collection
          </p>
          <div className="mt-4 w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 ml-auto rounded-full"></div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {latestProducts && latestProducts.length > 0 ? (
            latestProducts.map((product, index) => (
              <div
                key={product._id}
                className="transform hover:scale-105 transition-transform duration-300"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="relative">
                  <ProductCard product={product} />

                  {/* New Badge */}
                  <div className="absolute -top-2 -left-2 z-10">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
                      NEW
                    </div>
                  </div>

                  {/* Time Badge */}
                  {product.createdAt && (
                    <div className="absolute -top-2 -right-2 z-10">
                      <div className="bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded-full shadow-lg">
                        {formatTimeAgo(product.createdAt)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center bg-white p-12 rounded-xl shadow-sm">
              <div className="text-gray-400 text-6xl mb-4">🆕</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No New Products
              </h3>
              <p className="text-gray-600">
                Stay tuned! We're constantly adding new and exciting products to
                our collection.
              </p>
              <button className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors inline-flex items-center gap-2">
                <MdAutorenew className="text-lg" />
                Check Again
              </button>
            </div>
          )}
        </div>

        {/* View All Button */}
        {latestProducts && latestProducts.length > 0 && (
          <div className="text-right mt-12">
            <a
              href="/collections"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-8 py-3 rounded-full font-semibold hover:from-blue-600 hover:to-indigo-600 transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              <MdNewReleases className="text-xl" />
              Explore All New Arrivals
            </a>
          </div>
        )}
      </div>
    </section>
  );
};

export default LatestProducts;
