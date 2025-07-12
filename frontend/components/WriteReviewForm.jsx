"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import axios from "axios";
import { server } from "../lib/server";
import Ratings from "./Ratings";
import { getAvatarUrl, handleAvatarError } from "../lib/utils/avatar";
import SafeAvatar from "./SafeAvatar";

function WriteReviewForm({ productId, onReviewSubmitted, isEvent = false }) {
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error("Please login to write a review");
      return;
    }

    if (!rating || rating < 1 || rating > 5) {
      toast.error("Please select a rating between 1 and 5 stars");
      return;
    }

    if (!comment.trim()) {
      toast.error("Please write a comment for your review");
      return;
    }

    setIsSubmitting(true);

    try {
      const config = {
        headers: {  
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };

      const endpoint = isEvent 
        ? `${server}/event/create-new-review`
        : `${server}/product/create-new-review`;

      const { data } = await axios.put(
        endpoint,
        {
          rating,
          comment: comment.trim(),
          productId,
        },
        config
      );

      if (data.success) {
        toast.success("Review submitted successfully!");
        setRating(1);
        setComment("");
        if (onReviewSubmitted) {
          onReviewSubmitted();
        }
      }
    } catch (error) {
      console.error("Review submission error:", error);
      const errorMessage = error.response?.data?.message || "Failed to submit review";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 text-center">
        <p className="text-gray-600 mb-4">Please login to write a review</p>
        <a 
          href="/login" 
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Login to Review
        </a>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mt-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        Write a Review for this {isEvent ? 'Event' : 'Product'}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rating Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Rating *
          </label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`text-2xl transition-colors ${
                  star <= rating ? "text-yellow-400" : "text-gray-300"
                } hover:text-yellow-400`}
              >
                ★
              </button>
            ))}
            <span className="ml-2 text-sm text-gray-600">({rating} star{rating !== 1 ? 's' : ''})</span>
          </div>
        </div>

        {/* Comment Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Review *
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with this product..."
            rows={4}
            maxLength={500}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            disabled={isSubmitting}
          />
          <div className="text-right text-xs text-gray-500 mt-1">
            {comment.length}/500 characters
          </div>
        </div>

        {/* User Info Display */}
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <SafeAvatar
            src={user?.avatar}
            alt={user?.name || "User"}
            width={40}
            height={40}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p className="font-medium text-gray-900">{user?.name}</p>
            <p className="text-sm text-gray-600">Posting as {user?.email}</p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting || !comment.trim() || rating < 1}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Submitting...
              </>
            ) : (
              "Submit Review"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default WriteReviewForm;
