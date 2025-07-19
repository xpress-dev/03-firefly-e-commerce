import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  MdArrowBack,
  MdShoppingCart,
  MdShare,
  MdStar,
  MdStarBorder,
  MdLocalShipping,
  MdSecurity,
  MdSwapHoriz,
  MdZoomIn,
  MdCheck,
  MdAdd,
  MdRemove,
  MdClose,
  MdNavigateBefore,
  MdNavigateNext,
} from "react-icons/md";
import useEcommerceStore from "../store/FireflyStore";
import ReviewsSection from "../components/ReviewsSection";
import FavoriteButton from "../components/FavoriteButton";

const ProductPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const {
    currentProduct,
    productsLoading,
    productsError,
    products,
    addToCart,
    openCart,
    getProductBySlug,
    clearCurrentProduct,
    reviewStats,
    getProductReviewStats,
  } = useEcommerceStore();

  // Local state
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [activeTab, setActiveTab] = useState("description");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // Remove scroll to top behavior - let user stay where they are
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showImageModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showImageModal]);

  // Related products
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    if (slug) {
      getProductBySlug(slug);
      // Scroll to top when product page loads
      window.scrollTo(0, 0);
    }

    return () => {
      clearCurrentProduct();
    };
  }, [slug, getProductBySlug, clearCurrentProduct]);

  // Load review stats when product changes
  useEffect(() => {
    if (currentProduct?._id) {
      getProductReviewStats(currentProduct._id);
    }
  }, [currentProduct?._id, getProductReviewStats]);

  useEffect(() => {
    if (currentProduct && products.length > 0) {
      // Set first available size as default
      if (currentProduct.sizes && currentProduct.sizes.length > 0) {
        setSelectedSize(currentProduct.sizes[0]);
      }

      // Find related products (same category, different product)
      const related = products
        .filter(
          (p) =>
            p.category === currentProduct.category &&
            p._id !== currentProduct._id &&
            p.isActive !== false
        )
        .slice(0, 4);
      setRelatedProducts(related);
    }
  }, [currentProduct, products]);

  const handleAddToCart = async () => {
    if (!currentProduct) return;

    if (
      currentProduct.sizes &&
      currentProduct.sizes.length > 0 &&
      !selectedSize
    ) {
      alert("Please select a size");
      return;
    }

    if (currentProduct.inventory === 0 || currentProduct.inventory < quantity) {
      alert("Not enough stock available");
      return;
    }

    setIsAddingToCart(true);

    try {
      addToCart(currentProduct, quantity, selectedSize);
      await new Promise((resolve) => setTimeout(resolve, 500));
      openCart();
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add to cart");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= (currentProduct?.inventory || 1)) {
      setQuantity(newQuantity);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: currentProduct?.name,
          text: `Check out this product: ${currentProduct?.name}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Product link copied to clipboard!");
    }
  };

  const handleImageModalClose = () => {
    setShowImageModal(false);
  };

  const handleImageModalKeyDown = (e) => {
    if (e.key === "Escape") {
      setShowImageModal(false);
    } else if (e.key === "ArrowLeft") {
      handlePreviousImage();
    } else if (e.key === "ArrowRight") {
      handleNextImage();
    }
  };

  const handlePreviousImage = () => {
    if (currentProduct?.images && currentProduct.images.length > 1) {
      setSelectedImage((prev) =>
        prev === 0 ? currentProduct.images.length - 1 : prev - 1
      );
    }
  };

  const handleNextImage = () => {
    if (currentProduct?.images && currentProduct.images.length > 1) {
      setSelectedImage((prev) =>
        prev === currentProduct.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const renderStars = (rating = 4.5) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<MdStar key={i} className="text-yellow-400" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<MdStar key={i} className="text-yellow-400" />);
      } else {
        stars.push(<MdStarBorder key={i} className="text-gray-300" />);
      }
    }
    return stars;
  };

  if (productsLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="bg-gray-300 rounded-xl"></div>
                <div className="grid grid-cols-4 gap-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-gray-300 rounded-lg"></div>
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <div className="h-8 bg-gray-300 rounded w-3/4"></div>
                <div className="h-6 bg-gray-300 rounded w-1/2"></div>
                <div className="h-12 bg-gray-300 rounded w-1/3"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-300 rounded"></div>
                  <div className="h-4 bg-gray-300 rounded w-4/5"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/5"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (productsError || !currentProduct) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl text-gray-300 mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Product Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/collections"
            className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Browse All Products
          </Link>
        </div>
      </div>
    );
  }

  const product = currentProduct;
  const isOutOfStock = product.inventory === 0;
  const isLowStock = product.inventory > 0 && product.inventory <= 5;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-gray-600 hover:text-orange-600">
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <Link
              to="/collections"
              className="text-gray-600 hover:text-orange-600"
            >
              Products
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <MdArrowBack />
          <span>Back</span>
        </button>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative bg-white rounded-xl overflow-hidden shadow-sm group">
              <img
                src={product.images[selectedImage] || "/placeholder-image.svg"}
                alt={product.name}
                className="w-full object-cover cursor-zoom-in group-hover:scale-105 transition-transform duration-300"
                onClick={() => setShowImageModal(true)}
              />
              <button
                onClick={() => setShowImageModal(true)}
                className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MdZoomIn className="text-xl" />
              </button>
            </div>

            {/* Thumbnail Images */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`bg-white rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index
                        ? "border-orange-500"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Title and Rating */}
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-3xl font-bold text-gray-900">
                  {product.name}
                </h1>
                <div className="flex items-center gap-2">
                  <FavoriteButton
                    productId={product._id}
                    size="md"
                    className="hover:bg-gray-100"
                  />
                  <button
                    onClick={handleShare}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <MdShare className="text-xl text-gray-400" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center">
                  {renderStars(reviewStats?.averageRating || 0)}
                </div>
                <span className="text-sm text-gray-600">
                  ({reviewStats?.totalReviews || 0} reviews)
                </span>
                <span className="text-sm text-gray-400">•</span>
                <span className="text-sm text-gray-600">
                  {product.category}
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-gray-900">
                ${product.price}
              </span>
              {product.originalPrice &&
                product.originalPrice > product.price && (
                  <>
                    <span className="text-xl text-gray-500 line-through">
                      ${product.originalPrice}
                    </span>
                    <span className="bg-red-100 text-red-600 text-sm font-bold px-2 py-1 rounded">
                      {Math.round(
                        ((product.originalPrice - product.price) /
                          product.originalPrice) *
                          100
                      )}
                      % OFF
                    </span>
                  </>
                )}
            </div>

            {/* Stock Status */}
            <div>
              {isOutOfStock ? (
                <div className="flex items-center gap-2 text-red-600">
                  <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                  <span className="font-medium">Out of Stock</span>
                </div>
              ) : isLowStock ? (
                <div className="flex items-center gap-2 text-orange-600">
                  <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                  <span className="font-medium">
                    Only {product.inventory} left in stock
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-green-600">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span className="font-medium">In Stock</span>
                </div>
              )}
            </div>

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Size
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border-2 rounded-lg font-medium transition-colors ${
                        selectedSize === size
                          ? "border-orange-500 bg-orange-50 text-orange-600"
                          : "border-gray-300 text-gray-700 hover:border-gray-400"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Quantity
              </h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <MdRemove />
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= (product.inventory || 1)}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <MdAdd />
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock || isAddingToCart}
              className="w-full bg-orange-500 text-white py-4 rounded-xl font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isAddingToCart ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Adding to Cart...
                </>
              ) : isOutOfStock ? (
                "Out of Stock"
              ) : (
                <>
                  <MdShoppingCart className="text-xl" />
                  Add to Cart
                </>
              )}
            </button>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t">
              <div className="flex items-center gap-3">
                <MdLocalShipping className="text-2xl text-orange-500" />
                <div>
                  <h4 className="font-medium text-gray-900">Free Shipping</h4>
                  <p className="text-sm text-gray-600">On orders over $100</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MdSecurity className="text-2xl text-orange-500" />
                <div>
                  <h4 className="font-medium text-gray-900">Secure Payment</h4>
                  <p className="text-sm text-gray-600">100% secure checkout</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MdSwapHoriz className="text-2xl text-orange-500" />
                <div>
                  <h4 className="font-medium text-gray-900">Easy Returns</h4>
                  <p className="text-sm text-gray-600">30-day return policy</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Tabs */}
        <div className="mt-16 bg-white rounded-xl shadow-sm">
          <div className="border-b border-gray-200">
            <div className="flex space-x-8 px-6">
              {["description", "specifications", "reviews"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleTabChange(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${
                    activeTab === tab
                      ? "border-orange-500 text-orange-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="p-8 tab-content">
            {activeTab === "description" && (
              <div className="prose max-w-none">
                <p className="text-gray-600 leading-relaxed">
                  {product.description ||
                    `Experience premium quality and style with our ${
                      product.name
                    }. Crafted with attention to detail and designed for comfort, this ${product.category.toLowerCase()} is perfect for ${product.gender.toLowerCase()}'s fashion needs. Made from high-quality materials that ensure durability and comfort throughout the day.`}
                </p>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Key Features
                    </h4>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-center gap-2">
                        <MdCheck className="text-green-600 flex-shrink-0" />
                        High-quality materials
                      </li>
                      <li className="flex items-center gap-2">
                        <MdCheck className="text-green-600 flex-shrink-0" />
                        Comfortable fit
                      </li>
                      <li className="flex items-center gap-2">
                        <MdCheck className="text-green-600 flex-shrink-0" />
                        Durable construction
                      </li>
                      <li className="flex items-center gap-2">
                        <MdCheck className="text-green-600 flex-shrink-0" />
                        Easy care instructions
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Care Instructions
                    </h4>
                    <ul className="space-y-2 text-gray-600">
                      <li>• Machine wash cold with like colors</li>
                      <li>• Do not bleach</li>
                      <li>• Tumble dry low heat</li>
                      <li>• Iron on low heat if needed</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "specifications" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">
                    Product Details
                  </h4>
                  <dl className="space-y-3">
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Category:</dt>
                      <dd className="font-medium">{product.category}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Gender:</dt>
                      <dd className="font-medium">{product.gender}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Available Sizes:</dt>
                      <dd className="font-medium">
                        {product.sizes?.join(", ") || "One Size"}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">SKU:</dt>
                      <dd className="font-medium">
                        {product._id.slice(-8).toUpperCase()}
                      </dd>
                    </div>
                  </dl>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">
                    Materials & Care
                  </h4>
                  <dl className="space-y-3">
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Material:</dt>
                      <dd className="font-medium">Premium Cotton Blend</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Weight:</dt>
                      <dd className="font-medium">200g</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Origin:</dt>
                      <dd className="font-medium">Made in USA</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Warranty:</dt>
                      <dd className="font-medium">1 Year Limited</dd>
                    </div>
                  </dl>
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <ReviewsSection productId={currentProduct?._id} />
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">
              You May Also Like
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct._id}
                  to={`/product/${relatedProduct.slug}`}
                  className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                >
                  <div className="overflow-hidden">
                    <img
                      src={relatedProduct.images[0] || "/placeholder-image.svg"}
                      alt={relatedProduct.name}
                      className="w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="font-medium text-gray-900 mb-1 line-clamp-2">
                      {relatedProduct.name}
                    </h4>
                    <p className="text-lg font-bold text-gray-900">
                      ${relatedProduct.price}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Image Modal */}
      <AnimatePresence>
        {showImageModal && (
          <motion.div
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleImageModalClose}
            onKeyDown={handleImageModalKeyDown}
            tabIndex={-1}
          >
            <div className="relative max-w-6xl max-h-full w-full h-full flex items-center justify-center">
              {/* Close Button */}
              <button
                onClick={handleImageModalClose}
                className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm text-white p-3 rounded-full hover:bg-black/90 transition-colors z-20 shadow-lg"
              >
                <MdClose className="text-2xl" />
              </button>

              {/* Navigation Buttons */}
              {product.images && product.images.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePreviousImage();
                    }}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/70 backdrop-blur-sm text-white p-3 rounded-full hover:bg-black/90 transition-colors z-20 shadow-lg"
                  >
                    <MdNavigateBefore className="text-2xl" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNextImage();
                    }}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/70 backdrop-blur-sm text-white p-3 rounded-full hover:bg-black/90 transition-colors z-20 shadow-lg"
                  >
                    <MdNavigateNext className="text-2xl" />
                  </button>
                </>
              )}

              {/* Main Image */}
              <motion.img
                src={product.images[selectedImage] || "/placeholder-image.svg"}
                alt={product.name}
                className="max-w-full max-h-full object-contain"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={(e) => e.stopPropagation()}
              />

              {/* Image Counter */}
              {product.images && product.images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium z-20">
                  {selectedImage + 1} / {product.images.length}
                </div>
              )}

              {/* Thumbnail Dots */}
              {product.images && product.images.length > 1 && (
                <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
                  {product.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedImage(index);
                      }}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        selectedImage === index
                          ? "bg-white"
                          : "bg-white/50 hover:bg-white/75"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductPage;
