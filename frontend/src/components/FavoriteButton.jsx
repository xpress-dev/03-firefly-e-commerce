import React, { useState, useEffect } from "react";
import useEcommerceStore from "../store/FireflyStore";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";

const FavoriteButton = ({ productId, className = "", size = "md" }) => {
  const {
    toggleFavorite,
    checkIfFavorited,
    favoritesLoading,
    isAuthenticated,
  } = useEcommerceStore();

  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check if product is favorited on mount
  useEffect(() => {
    if (isAuthenticated && productId) {
      checkIfFavorited(productId).then(setIsFavorited);
    }
  }, [productId, isAuthenticated, checkIfFavorited]);

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      // Redirect to login or show login modal
      return;
    }

    setIsLoading(true);
    try {
      await toggleFavorite(productId);
      setIsFavorited(!isFavorited);
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <button
      onClick={handleToggleFavorite}
      disabled={isLoading || favoritesLoading}
      className={`
        ${sizeClasses[size]}
        flex items-center justify-center
        rounded-full border-2 transition-all duration-200
        hover:scale-105 active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed
        ${
          isFavorited
            ? "border-red-500 bg-red-50 hover:bg-red-100"
            : "border-gray-300 bg-white hover:border-gray-400"
        }
        ${className}
      `}
      title={isFavorited ? "Remove from favorites" : "Add to favorites"}
    >
      {isLoading || favoritesLoading ? (
        <div
          className={`${iconSizes[size]} animate-spin rounded-full border-2 border-gray-300 border-t-red-500`}
        />
      ) : (
        <>
          {isFavorited ? (
            <MdFavorite className={`${iconSizes[size]} text-red-500`} />
          ) : (
            <MdFavoriteBorder className={`${iconSizes[size]} text-gray-500`} />
          )}
        </>
      )}
    </button>
  );
};

export default FavoriteButton;
