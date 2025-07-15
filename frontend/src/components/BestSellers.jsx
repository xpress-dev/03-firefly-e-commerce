import React from "react";
import ProductCard from "./ProductCard";

const BestSellers = () => {
  return (
    <div className="py-10">
      <h2 className="oswald-font text-2xl sm:text-3xl mb-5">Best Sellers</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {/* Product Cards */}
        <ProductCard />
        <ProductCard />
        <ProductCard />
        <ProductCard />
      </div>
    </div>
  );
};

export default BestSellers;
