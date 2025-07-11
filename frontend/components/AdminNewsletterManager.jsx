"use client";

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { server } from '../lib/server';
import { toast } from 'react-hot-toast';
import { 
  FaEnvelope, 
  FaUsers, 
  FaChartLine, 
  FaEdit, 
  FaTrash,
  FaDownload,
  FaSearch,
  FaFilter,
  FaPaperPlane,
  FaSpinner,
  FaCheck,
  FaTimes
} from 'react-icons/fa';

const AdminNewsletterManager = () => {
  const { user } = useSelector((state) => state.user);
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    unsubscribed: 0
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalSubscribers: 0
  });
  const [filters, setFilters] = useState({
    status: 'active',
    search: '',
    page: 1,
    limit: 20
  });
  const [selectedSubscribers, setSelectedSubscribers] = useState([]);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailData, setEmailData] = useState({
    subject: '',
    message: '',
    htmlMessage: ''
  });
  const [sendingEmail, setSendingEmail] = useState(false);

  // Fetch subscribers
  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      
      // Build query parameters
      const params = new URLSearchParams({
        status: filters.status,
        page: filters.page.toString(),
        limit: filters.limit.toString()
      });
      
      // Add search parameter if there's a search term
      if (filters.search && filters.search.trim()) {
        params.append('search', filters.search.trim());
      }
      
      const response = await fetch(
        `${server}/newsletter/subscribers?${params.toString()}`,
        {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      const data = await response.json();

      if (data.success) {
        setSubscribers(data.subscribers);
        setPagination(data.pagination);
        
        // Calculate stats
        const active = data.subscribers.filter(s => s.status === 'active').length;
        const unsubscribed = data.subscribers.filter(s => s.status === 'unsubscribed').length;
        setStats({
          total: data.pagination.totalSubscribers,
          active,
          unsubscribed
        });
      } else {
        toast.error(data.message || 'Failed to fetch subscribers');
      }
    } catch (error) {
      console.error('Error fetching subscribers:', error);
      toast.error('Failed to fetch subscribers');
    } finally {
      setLoading(false);
    }
  };

  // Send newsletter
  const sendNewsletter = async () => {
    if (!emailData.subject || !emailData.message) {
      toast.error('Please provide both subject and message');
      return;
    }

    try {
      setSendingEmail(true);
      const response = await fetch(`${server}/newsletter/send`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData)
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        setShowEmailModal(false);
        setEmailData({ subject: '', message: '', htmlMessage: '' });
      } else {
        toast.error(data.message || 'Failed to send newsletter');
      }
    } catch (error) {
      console.error('Error sending newsletter:', error);
      toast.error('Failed to send newsletter');
    } finally {
      setSendingEmail(false);
    }
  };

  // Export subscribers
  const exportSubscribers = () => {
    const csvContent = [
      ['Email', 'Status', 'Subscribed At', 'Source'].join(','),
      ...subscribers.map(sub => [
        sub.email,
        sub.status,
        new Date(sub.subscribedAt).toLocaleDateString(),
        sub.source || 'website'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `newsletter_subscribers_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  useEffect(() => {
    fetchSubscribers();
  }, [filters]);

  return (
    <div className="p-3 sm:p-4 lg:p-6">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Newsletter Management</h1>
        <p className="text-sm sm:text-base text-gray-600">Manage your newsletter subscribers and send campaigns</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Total Subscribers</p>
              <p className="text-xl sm:text-2xl font-bold text-blue-600">{stats.total}</p>
            </div>
            <FaUsers className="text-blue-500 text-lg sm:text-xl" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Active Subscribers</p>
              <p className="text-xl sm:text-2xl font-bold text-green-600">{stats.active}</p>
            </div>
            <FaCheck className="text-green-500 text-lg sm:text-xl" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 border border-gray-200 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Unsubscribed</p>
              <p className="text-xl sm:text-2xl font-bold text-red-600">{stats.unsubscribed}</p>
            </div>
            <FaTimes className="text-red-500 text-lg sm:text-xl" />
          </div>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 mb-4 border border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value, page: 1})}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm"
            >
              <option value="active">Active Subscribers</option>
              <option value="unsubscribed">Unsubscribed</option>
              <option value="all">All Subscribers</option>
            </select>
            
            <div className="relative w-full sm:w-auto">
              <FaSearch className="absolute left-3 top-2.5 sm:top-3 text-gray-400 text-xs sm:text-sm" />
              <input
                type="text"
                placeholder="Search by email..."
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value, page: 1})}
                className="pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm w-full sm:w-auto"
              />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <button
              onClick={exportSubscribers}
              className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-xs sm:text-sm w-full sm:w-auto justify-center"
            >
              <FaDownload className="text-xs sm:text-sm" />
              <span className="hidden sm:inline">Export CSV</span>
              <span className="sm:hidden">Export</span>
            </button>
            
            <button
              onClick={() => setShowEmailModal(true)}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-xs sm:text-sm w-full sm:w-auto justify-center"
            >
              <FaPaperPlane className="text-xs sm:text-sm" />
              <span className="hidden sm:inline">Send Newsletter</span>
              <span className="sm:hidden">Send</span>
            </button>
          </div>
        </div>
      </div>

      {/* Subscribers Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  Subscribed At
                </th>
                <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Source
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-3 sm:px-4 py-6 sm:py-8 text-center">
                    <FaSpinner className="animate-spin mx-auto text-lg sm:text-xl text-gray-400 mb-3" />
                    <p className="text-gray-500 text-xs sm:text-sm">Loading subscribers...</p>
                  </td>
                </tr>
              ) : subscribers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-3 sm:px-4 py-6 sm:py-8 text-center">
                    <FaEnvelope className="mx-auto text-2xl sm:text-3xl text-gray-400 mb-3" />
                    <p className="text-gray-500 text-xs sm:text-sm">No subscribers found</p>
                  </td>
                </tr>
              ) : (
                subscribers.map((subscriber) => (
                  <tr key={subscriber._id} className="hover:bg-gray-50">
                    <td className="px-3 sm:px-4 py-3 whitespace-nowrap">
                      <div className="text-xs sm:text-sm font-medium text-gray-900 truncate max-w-xs">
                        {subscriber.email}
                      </div>
                    </td>
                    <td className="px-3 sm:px-4 py-3 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        subscriber.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {subscriber.status}
                      </span>
                    </td>
                    <td className="px-3 sm:px-4 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-500 hidden sm:table-cell">
                      {new Date(subscriber.subscribedAt).toLocaleDateString()}
                    </td>
                    <td className="px-3 sm:px-4 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-500 hidden md:table-cell">
                      {subscriber.source || 'website'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="bg-white px-3 sm:px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between border-t border-gray-200 gap-4">
            <div className="text-xs sm:text-sm text-gray-700">
              Showing {((pagination.currentPage - 1) * filters.limit) + 1} to {Math.min(pagination.currentPage * filters.limit, pagination.totalSubscribers)} of {pagination.totalSubscribers} results
            </div>
            <div className="flex items-center justify-center sm:justify-end space-x-2">
              <button
                onClick={() => setFilters({...filters, page: filters.page - 1})}
                disabled={!pagination.hasPrev}
                className="px-3 py-1 text-xs sm:text-sm bg-gray-200 text-gray-700 rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-xs sm:text-sm text-gray-700">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <button
                onClick={() => setFilters({...filters, page: filters.page + 1})}
                disabled={!pagination.hasNext}
                className="px-3 py-1 text-xs sm:text-sm bg-gray-200 text-gray-700 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-2xl font-bold text-gray-900">Send Newsletter</h2>
                <button
                  onClick={() => setShowEmailModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes className="text-lg sm:text-xl" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={emailData.subject}
                    onChange={(e) => setEmailData({...emailData, subject: e.target.value})}
                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="Enter email subject"
                  />
                </div>
                
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    value={emailData.message}
                    onChange={(e) => setEmailData({...emailData, message: e.target.value})}
                    rows={6}
                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="Enter your message"
                  />
                </div>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between pt-4 gap-4">
                  <div className="text-xs sm:text-sm text-gray-600">
                    This will be sent to {stats.active} active subscribers
                  </div>
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                      onClick={() => setShowEmailModal(false)}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm flex-1 sm:flex-initial"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={sendNewsletter}
                      disabled={sendingEmail}
                      className="flex items-center gap-2 px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm flex-1 sm:flex-initial justify-center"
                    >
                      {sendingEmail ? (
                        <>
                          <FaSpinner className="animate-spin" />
                          <span className="hidden sm:inline">Sending...</span>
                          <span className="sm:hidden">Sending...</span>
                        </>
                      ) : (
                        <>
                          <FaPaperPlane />
                          <span className="hidden sm:inline">Send Newsletter</span>
                          <span className="sm:hidden">Send</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNewsletterManager;
