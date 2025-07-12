/**
 * Enhanced shop rating calculation that ensures favorable ratings
 * @param {Array} products - Array of shop products with reviews
 * @returns {Object} - { rating: number, reviewCount: number, displayRating: string }
 */
export function calculateShopRating(products) {
  if (!products || products.length === 0) {
    return {
      rating: 4.5,
      reviewCount: 0,
      displayRating: "4.5"
    };
  }

  // Calculate total reviews and ratings
  const reviewData = products.reduce((acc, product) => {
    if (product.reviews && product.reviews.length > 0) {
      product.reviews.forEach(review => {
        acc.totalReviews++;
        acc.totalRating += review.rating;
      });
    }
    return acc;
  }, { totalReviews: 0, totalRating: 0 });

  // If no reviews, return default good rating
  if (reviewData.totalReviews === 0) {
    return {
      rating: 4.5,
      reviewCount: 0,
      displayRating: "4.5"
    };
  }

  // Calculate base average
  const baseAverage = reviewData.totalRating / reviewData.totalReviews;

  // Enhanced rating calculation with favorable adjustments
  let enhancedRating;
  
  if (reviewData.totalReviews <= 5) {
    // For new shops (few reviews), be more generous
    enhancedRating = Math.max(baseAverage * 1.1, 4.0);
  } else if (reviewData.totalReviews <= 20) {
    // For growing shops, slight boost
    enhancedRating = Math.max(baseAverage * 1.05, 4.0);
  } else {
    // For established shops, use actual average but ensure minimum
    enhancedRating = Math.max(baseAverage, 4.0);
  }

  // Cap at 5.0 and ensure it's reasonable
  enhancedRating = Math.min(enhancedRating, 5.0);

  return {
    rating: enhancedRating,
    reviewCount: reviewData.totalReviews,
    displayRating: enhancedRating.toFixed(1)
  };
}

/**
 * Get display text for shop rating
 * @param {number} reviewCount - Number of reviews
 * @returns {string} - Display text
 */
export function getShopRatingText(reviewCount) {
  if (reviewCount === 0) {
    return "New Shop";
  } else if (reviewCount === 1) {
    return "1 Review";
  } else {
    return `${reviewCount} Reviews`;
  }
}

/**
 * Simple enhanced rating for individual products
 * @param {number} currentRating - Current product rating
 * @param {number} reviewCount - Number of reviews for the product
 * @returns {string} - Enhanced rating string
 */
export function enhanceProductRating(currentRating, reviewCount = 0) {
  if (!currentRating || currentRating === 0) {
    return "4.2"; // Default good rating for new products
  }

  // For products with few reviews, be slightly more generous
  if (reviewCount <= 3) {
    const enhanced = Math.max(currentRating * 1.1, 4.0);
    return Math.min(enhanced, 5.0).toFixed(1);
  }

  // For products with more reviews, ensure minimum 3.8
  const enhanced = Math.max(currentRating, 3.8);
  return Math.min(enhanced, 5.0).toFixed(1);
}
