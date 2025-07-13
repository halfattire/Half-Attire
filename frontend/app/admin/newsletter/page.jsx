"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { AdminProtected } from "../../hooks/AdminProtected";
import { FaEnvelope, FaUsers, FaDownload } from "react-icons/fa";
import { server } from "../../../lib/server";
import { toast } from "react-hot-toast";

export default function NewsletterPage() {
  const { user } = useSelector((state) => state.user);
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ total: 0, active: 0 });

  // Fetch newsletter subscribers
  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      const response = await fetch(`${server}/newsletter/subscribers`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSubscribers(data.subscribers || []);
        setStats({
          total: data.total || 0,
          active: data.active || 0
        });
      } else {
        throw new Error('Failed to fetch subscribers');
      }
    } catch (error) {
      console.error("Newsletter fetch error:", error);
      toast.error("Failed to load newsletter subscribers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === "admin") {
      fetchSubscribers();
    }
  }, [user]);

  // Export subscribers
  const exportSubscribers = () => {
    if (subscribers.length === 0) {
      toast.error("No subscribers to export");
      return;
    }

    const csvContent = [
      'Email,Status,Subscribed Date',
      ...subscribers.map(sub => 
        `${sub.email},${sub.status || 'active'},${new Date(sub.createdAt).toLocaleDateString()}`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'newsletter-subscribers.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <AdminProtected>
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Newsletter Management</h1>
            <p className="text-gray-600 mt-2">Manage newsletter subscribers and communications</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <FaUsers className="text-blue-600 text-2xl mr-4" />
                <div>
                  <p className="text-sm text-gray-600">Total Subscribers</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <FaEnvelope className="text-green-600 text-2xl mr-4" />
                <div>
                  <p className="text-sm text-gray-600">Active Subscribers</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <button
                onClick={exportSubscribers}
                className="flex items-center w-full text-center justify-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FaDownload className="mr-2" />
                Export CSV
              </button>
            </div>
          </div>

          {/* Subscribers Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Subscribers List</h2>
            </div>
            
            <div className="overflow-x-auto">
              {loading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <p className="mt-2 text-gray-600">Loading subscribers...</p>
                </div>
              ) : subscribers.length > 0 ? (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subscribed Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {subscribers.map((subscriber, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {subscriber.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            subscriber.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {subscriber.status || 'active'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(subscriber.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-8">
                  <FaEnvelope className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No subscribers</h3>
                  <p className="mt-1 text-sm text-gray-500">No newsletter subscribers found.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminProtected>
  );
}
