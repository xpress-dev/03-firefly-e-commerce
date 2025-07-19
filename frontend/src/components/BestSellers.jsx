import { useEffect, useState } from "react";
import { MdTrendingUp, MdFavorite } from "react-icons/md";
import useEcommerceStore from "../store/FireflyStore";
import ProductCard from "./ProductCard";

const BestSellers = () => {
  const { products, productsLoading, productsError } = useEcommerceStore();
  const [bestProducts, setBestProducts] = useState([]);

  useEffect(() => {
    const tempBestProducts = products
      .sort((a, b) => b.inventory - a.inventory)
      .slice(0, 4);
    setBestProducts(tempBestProducts);
  }, [products]);

  if (productsLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <MdTrendingUp className="text-3xl text-orange-500 animate-pulse" />
              <h2 className="oswald-font text-3xl sm:text-4xl font-bold text-gray-900">
                Best Sellers
              </h2>
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our most popular products loved by customers worldwide
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
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <MdTrendingUp className="text-3xl text-orange-500" />
              <h2 className="oswald-font text-3xl sm:text-4xl font-bold text-gray-900">
                Best Sellers
              </h2>
            </div>
          </div>

          <div className="text-center bg-white p-8 rounded-xl shadow-sm">
            <div className="text-red-500 text-lg font-medium mb-2">
              Oops! Something went wrong
            </div>
            <p className="text-gray-600">
              Error loading products: {productsError}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <MdTrendingUp className="text-3xl text-orange-500" />
            <h2 className="oswald-font text-3xl sm:text-4xl font-bold text-gray-900">
              Best Sellers
            </h2>
            <MdFavorite className="text-2xl text-red-500" />
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Discover our most popular products loved by thousands of customers
            worldwide
          </p>
          <div className="mt-4 w-24 h-1 bg-gradient-to-r from-orange-500 to-red-500 mx-auto rounded-full"></div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {bestProducts && bestProducts.length > 0 ? (
            bestProducts.map((product, index) => (
              <div
                key={product._id}
                className="transform hover:scale-105 transition-transform duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ProductCard product={product} />
              </div>
            ))
          ) : (
            <div className="col-span-full text-center bg-white p-12 rounded-xl shadow-sm">
              <div className="text-gray-400 text-6xl mb-4">🛍️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Products Available
              </h3>
              <p className="text-gray-600">
                We're working hard to bring you amazing products. Check back
                soon!
              </p>
            </div>
          )}
        </div>

        {/* View All Button */}
        {bestProducts && bestProducts.length > 0 && (
          <div className="text-center mt-12">
            <a
              href="/collections"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-full font-semibold hover:from-orange-600 hover:to-red-600 transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              View All Products
              <MdTrendingUp className="text-xl" />
            </a>
          </div>
        )}
      </div>
    </section>
  );
};

export default BestSellers;
