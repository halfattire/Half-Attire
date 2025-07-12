/**
 * Example of how the enhanced shop rating system works
 */

// Example 1: New shop with no reviews
const newShop = [];
console.log("New Shop (no reviews):", calculateShopRating(newShop));
// Output: { rating: 4.5, reviewCount: 0, displayRating: "4.5" }

// Example 2: Shop with few reviews
const shopWithFewReviews = [
  { reviews: [{ rating: 3 }, { rating: 4 }] },
  { reviews: [{ rating: 3 }] }
];
console.log("Shop with 3 reviews (avg 3.3):", calculateShopRating(shopWithFewReviews));
// Output: Enhanced to ~4.0+ (minimum 4.0 rating)

// Example 3: Established shop with many good reviews
const establishedShop = [
  { reviews: [{ rating: 4 }, { rating: 5 }, { rating: 4 }, { rating: 5 }] },
  { reviews: [{ rating: 4 }, { rating: 5 }] },
  { reviews: [{ rating: 5 }, { rating: 4 }, { rating: 5 }] }
];
console.log("Established shop with good reviews:", calculateShopRating(establishedShop));
// Output: Shows actual good rating (4.4+)

// Product rating examples
console.log("New product rating:", enhanceProductRating(0, 0)); // "4.2"
console.log("Product with few reviews:", enhanceProductRating(3.5, 2)); // Enhanced to 4.0+
console.log("Product with many reviews:", enhanceProductRating(3.0, 20)); // Minimum 3.8
