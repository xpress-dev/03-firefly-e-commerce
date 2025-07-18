import { useState, useEffect } from "react";
import { MdAttachMoney } from "react-icons/md";

const PriceRangeFilter = ({
  minPrice = "",
  maxPrice = "",
  onPriceChange,
  className = "",
}) => {
  const [localMinPrice, setLocalMinPrice] = useState(minPrice);
  const [localMaxPrice, setLocalMaxPrice] = useState(maxPrice);

  // Predefined price ranges
  const priceRanges = [
    { label: "Under $25", min: "", max: "25" },
    { label: "$25 - $50", min: "25", max: "50" },
    { label: "$50 - $100", min: "50", max: "100" },
    { label: "$100 - $200", min: "100", max: "200" },
    { label: "$200 - $500", min: "200", max: "500" },
    { label: "Over $500", min: "500", max: "" },
  ];

  useEffect(() => {
    setLocalMinPrice(minPrice);
    setLocalMaxPrice(maxPrice);
  }, [minPrice, maxPrice]);

  const handleApplyFilter = () => {
    onPriceChange({
      minPrice: localMinPrice,
      maxPrice: localMaxPrice,
    });
  };

  const handlePredefinedRange = (range) => {
    setLocalMinPrice(range.min);
    setLocalMaxPrice(range.max);
    onPriceChange({
      minPrice: range.min,
      maxPrice: range.max,
    });
  };

  const handleClearRange = () => {
    setLocalMinPrice("");
    setLocalMaxPrice("");
    onPriceChange({
      minPrice: "",
      maxPrice: "",
    });
  };

  const isCurrentRange = (range) => {
    return localMinPrice === range.min && localMaxPrice === range.max;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Predefined Ranges */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700 flex items-center gap-1">
          <MdAttachMoney className="text-green-600" />
          Quick Ranges
        </h4>
        <div className="space-y-1">
          {priceRanges.map((range, index) => (
            <button
              key={index}
              onClick={() => handlePredefinedRange(range)}
              className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                isCurrentRange(range)
                  ? "bg-orange-100 text-orange-800 border border-orange-300"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Range */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-700">Custom Range</h4>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs text-gray-500 mb-1">
              Min Price
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                $
              </span>
              <input
                type="number"
                placeholder="0"
                value={localMinPrice}
                onChange={(e) => setLocalMinPrice(e.target.value)}
                className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                min="0"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">
              Max Price
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                $
              </span>
              <input
                type="number"
                placeholder="∞"
                value={localMaxPrice}
                onChange={(e) => setLocalMaxPrice(e.target.value)}
                className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                min="0"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleApplyFilter}
            className="flex-1 bg-orange-500 text-white py-2 px-3 rounded-md hover:bg-orange-600 transition-colors text-sm font-medium"
          >
            Apply
          </button>
          <button
            onClick={handleClearRange}
            className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm text-gray-600"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Current Filter Display */}
      {(localMinPrice || localMaxPrice) && (
        <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded-md">
          <span className="font-medium">Current filter: </span>
          {localMinPrice && localMaxPrice
            ? `$${localMinPrice} - $${localMaxPrice}`
            : localMinPrice
            ? `Over $${localMinPrice}`
            : `Under $${localMaxPrice}`}
        </div>
      )}
    </div>
  );
};

export default PriceRangeFilter;
