import React from "react";

const ProductCard = () => {
  return (
    <div className="rounded-b-2xl">
      <img
        src="https://cdn.dsmcdn.com/ty1654/product/media/images/prod/PIM/20250324/13/2c577973-0c76-4ada-8a0c-587e7845f22e/1_org_zoom.jpg"
        alt="Product"
        className="rounded-t-2xl shadow-2xl"
      />
      <div className="flex justify-between font-semibold bg-gray-900 text-white rounded-b-2xl p-4 shadow-2xl text-sm">
        <h3 className="">Product Title</h3>
        <span className="">$19.99</span>
      </div>
    </div>
  );
};

export default ProductCard;
