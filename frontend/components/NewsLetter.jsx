"use client";

import React, { useState } from 'react';
import { server } from '../lib/server';
import { toast } from 'react-hot-toast';
import { FaEnvelope, FaCheckCircle, FaSpinner } from 'react-icons/fa';

const NewsLetter = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${server}/newsletter/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        setIsSubscribed(true);
        setEmail('');
      } else {
        toast.error(data.message || 'Something went wrong');
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      toast.error('Failed to subscribe. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-emerald-500 to-teal-600 py-12">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-3 rounded-full">
              <FaEnvelope className="text-white text-2xl" />
            </div>
          </div>
          
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
            Stay Updated with Our Newsletter
          </h2>
          
          <p className="text-gray-600 text-base mb-6 max-w-2xl mx-auto">
            Get exclusive deals, early access to new products, and special offers 
            delivered straight to your inbox. Join thousands of happy customers!
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-6 text-sm text-gray-700">
            <div className="flex items-center gap-2">
              <span className="text-emerald-500">✓</span>
              <span>Exclusive Discounts up to 50%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-emerald-500">✓</span>
              <span>Early Access to Sales</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-emerald-500">✓</span>
              <span>New Product Alerts</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-emerald-500">✓</span>
              <span>Special Birthday Offers</span>
            </div>
          </div>

          {!isSubscribed ? (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Subscribing...
                    </>
                  ) : (
                    'Subscribe Now'
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="max-w-md mx-auto">
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 text-center">
                <FaCheckCircle className="text-emerald-500 text-4xl mx-auto mb-3" />
                <h3 className="text-xl font-semibold text-emerald-800 mb-2">
                  Successfully Subscribed!
                </h3>
                <p className="text-emerald-700">
                  Thank you for subscribing! Check your email for a welcome message with your exclusive discount code.
                </p>
              </div>
            </div>
          )}

          <p className="text-sm text-gray-500 mt-4">
            We respect your privacy. Unsubscribe at any time with one click.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NewsLetter;
