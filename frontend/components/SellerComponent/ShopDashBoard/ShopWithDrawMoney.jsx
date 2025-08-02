"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfShop } from "@/redux/actions/order";
import { toast } from "react-toastify";
import axios from "axios";
import { server } from "@/lib/server";
import { 
  FiDollarSign, 
  FiClock, 
  FiCheckCircle, 
  FiXCircle,
  FiPlus,
  FiRefreshCw,
  FiCreditCard,
  FiBank
} from "react-icons/fi";
import { BsBank, BsWallet } from "react-icons/bs";
import { SiPaypal } from "react-icons/si";

function ShopWithDrawMoney() {
  const dispatch = useDispatch();
  const { orders } = useSelector((state) => state.orders);
  const { seller } = useSelector((state) => state.seller);
  const { user } = useSelector((state) => state.user);
  const isAdmin = user && user.role === "Admin";
  
  const [withdrawData, setWithdrawData] = useState({
    amount: "",
    paymentMethod: "Bank Transfer",
    bankAccount: {
      bankName: "",
      accountNumber: "",
      accountTitle: "",
      branchCode: "",
    },
    digitalWallet: {
      walletType: "",
      walletId: "",
      phoneNumber: "",
    },
  });
  
  const [showWithdrawForm, setShowWithdrawForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [withdrawHistory, setWithdrawHistory] = useState([]);
  const [stats, setStats] = useState({
    availableBalance: 0,
    totalWithdrawn: 0,
    pendingAmount: 0,
    totalRequests: 0,
  });

  useEffect(() => {
    if (seller?._id) {
      dispatch(getAllOrdersOfShop(seller._id));
      fetchWithdrawHistory();
    } else if (isAdmin) {
      // Admin users don't have seller data, show empty state or admin message
      setStats({
        availableBalance: 0,
        totalWithdrawn: 0,
        pendingAmount: 0,
        totalRequests: 0,
      });
    }
  }, [dispatch, seller?._id, isAdmin]);

  useEffect(() => {
    if (orders && Array.isArray(orders)) {
      const deliveredOrders = orders.filter((item) => item.status === "Delivered");
      const totalEarning = deliveredOrders.reduce((acc, item) => acc + (item.totalPrice || 0), 0);
      const serviceCharge = totalEarning * 0.1;
      const calculatedBalance = totalEarning - serviceCharge;
      
      // Note: The actual available balance should come from the server
      // This is just for display calculation
      setStats(prev => ({
        ...prev,
        calculatedEarnings: calculatedBalance.toFixed(2),
      }));
    }
  }, [orders]);

  const fetchWithdrawHistory = async () => {
    try {
      const response = await axios.get(`${server}/withdraw/get-seller-withdraws`, {
        withCredentials: true,
      });
      
      if (response.data.success) {
        setWithdrawHistory(response.data.withdraws);
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error("Error fetching withdraw history:", error);
      toast.error("Failed to fetch withdraw history");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setWithdrawData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setWithdrawData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!withdrawData.amount || parseFloat(withdrawData.amount) < 100) {
      toast.error("Minimum withdrawal amount is PKR 100");
      return;
    }
    
    if (parseFloat(withdrawData.amount) > stats.availableBalance) {
      toast.error("Insufficient balance for withdrawal");
      return;
    }

    setLoading(true);
    
    try {
      const response = await axios.post(
        `${server}/withdraw/create-withdraw-request`,
        withdrawData,
        { withCredentials: true }
      );
      
      if (response.data.success) {
        toast.success("Withdrawal request submitted successfully!");
        setShowWithdrawForm(false);
        setWithdrawData({
          amount: "",
          paymentMethod: "Bank Transfer",
          bankAccount: {
            bankName: "",
            accountNumber: "",
            accountTitle: "",
            branchCode: "",
          },
          digitalWallet: {
            walletType: "",
            walletId: "",
            phoneNumber: "",
          },
        });
        fetchWithdrawHistory();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit withdrawal request");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Processing":
        return <FiClock className="text-yellow-500" />;
      case "Succeed":
        return <FiCheckCircle className="text-green-500" />;
      case "Rejected":
        return <FiXCircle className="text-red-500" />;
      default:
        return <FiClock className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Processing":
        return "bg-yellow-100 text-yellow-800";
      case "Succeed":
        return "bg-green-100 text-green-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case "Bank Transfer":
        return <BsBank className="text-blue-600" />;
      case "PayPal":
        return <SiPaypal className="text-blue-600" />;
      case "Jazz Cash":
      case "Easypaisa":
        return <BsWallet className="text-purple-600" />;
      default:
        return <FiCreditCard className="text-gray-600" />;
    }
  };

  return isAdmin && !seller?._id ? (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-700 mb-2">Admin Access</h3>
        <p className="text-gray-500">Withdrawal management is available for seller accounts only.</p>
      </div>
    </div>
  ) : (
    <div className="h-full w-full p-6 bg-gray-50">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Withdraw Money</h1>
          <p className="text-gray-600">Manage your earnings and withdrawal requests</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchWithdrawHistory}
            className="flex items-center gap-2 px-4 py-2 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <FiRefreshCw size={18} />
            Refresh
          </button>
          <button
            onClick={() => setShowWithdrawForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FiPlus size={18} />
            New Withdrawal
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-600">Available Balance</h3>
              <p className="text-2xl font-bold text-green-600">PKR {stats.availableBalance?.toFixed(2) || "0.00"}</p>
            </div>
            <FiDollarSign className="text-3xl text-green-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-600">Pending Amount</h3>
              <p className="text-2xl font-bold text-yellow-600">PKR {stats.pendingAmount?.toFixed(2) || "0.00"}</p>
            </div>
            <FiClock className="text-3xl text-yellow-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-600">Total Withdrawn</h3>
              <p className="text-2xl font-bold text-blue-600">PKR {stats.totalWithdrawn?.toFixed(2) || "0.00"}</p>
            </div>
            <FiCheckCircle className="text-3xl text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-600">Total Requests</h3>
              <p className="text-2xl font-bold text-gray-900">{stats.totalRequests || 0}</p>
            </div>
            <FiRefreshCw className="text-3xl text-gray-600" />
          </div>
        </div>
      </div>

      {/* Withdrawal History */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Withdrawal History</h2>
          <p className="text-sm text-gray-600">Track your withdrawal requests and their status</p>
        </div>
        
        <div className="p-6">
          {withdrawHistory.length > 0 ? (
            <div className="space-y-4">
              {withdrawHistory.map((withdraw) => (
                <div key={withdraw._id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {getPaymentMethodIcon(withdraw.paymentMethod)}
                      <div>
                        <p className="font-medium text-gray-900">PKR {withdraw.amount}</p>
                        <p className="text-sm text-gray-600">{withdraw.paymentMethod}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(withdraw.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(withdraw.status)}`}>
                        {withdraw.status}
                      </span>
                      {getStatusIcon(withdraw.status)}
                    </div>
                  </div>
                  
                  {withdraw.transactionId && (
                    <div className="mt-2 text-xs text-gray-500">
                      Transaction ID: {withdraw.transactionId}
                    </div>
                  )}
                  
                  {withdraw.adminNote && (
                    <div className="mt-2 p-2 bg-blue-50 rounded text-sm text-blue-700">
                      <strong>Admin Note:</strong> {withdraw.adminNote}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FiDollarSign className="mx-auto text-5xl text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No withdrawal history</h3>
              <p className="text-gray-600 mb-4">You haven't made any withdrawal requests yet</p>
              <button
                onClick={() => setShowWithdrawForm(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FiPlus size={18} />
                Create First Withdrawal
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Withdrawal Form Modal */}
      {showWithdrawForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4 max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">New Withdrawal Request</h3>
              <button 
                onClick={() => setShowWithdrawForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiXCircle size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Withdrawal Amount (PKR)
                </label>
                <input
                  type="number"
                  name="amount"
                  value={withdrawData.amount}
                  onChange={handleInputChange}
                  min="100"
                  max={stats.availableBalance}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter amount (min PKR 100)"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Available: PKR {stats.availableBalance?.toFixed(2) || "0.00"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method
                </label>
                <select
                  name="paymentMethod"
                  value={withdrawData.paymentMethod}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="PayPal">PayPal</option>
                  <option value="Jazz Cash">Jazz Cash</option>
                  <option value="Easypaisa">Easypaisa</option>
                </select>
              </div>

              {withdrawData.paymentMethod === "Bank Transfer" && (
                <div className="space-y-3">
                  <input
                    type="text"
                    name="bankAccount.bankName"
                    value={withdrawData.bankAccount.bankName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Bank Name"
                    required
                  />
                  <input
                    type="text"
                    name="bankAccount.accountTitle"
                    value={withdrawData.bankAccount.accountTitle}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Account Title"
                    required
                  />
                  <input
                    type="text"
                    name="bankAccount.accountNumber"
                    value={withdrawData.bankAccount.accountNumber}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Account Number"
                    required
                  />
                  <input
                    type="text"
                    name="bankAccount.branchCode"
                    value={withdrawData.bankAccount.branchCode}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Branch Code (Optional)"
                  />
                </div>
              )}

              {["PayPal", "Jazz Cash", "Easypaisa"].includes(withdrawData.paymentMethod) && (
                <div className="space-y-3">
                  <input
                    type="text"
                    name="digitalWallet.walletId"
                    value={withdrawData.digitalWallet.walletId}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={`${withdrawData.paymentMethod} ID/Email`}
                    required
                  />
                  {["Jazz Cash", "Easypaisa"].includes(withdrawData.paymentMethod) && (
                    <input
                      type="tel"
                      name="digitalWallet.phoneNumber"
                      value={withdrawData.digitalWallet.phoneNumber}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Phone Number"
                      required
                    />
                  )}
                </div>
              )}

              <div className="flex gap-3 justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setShowWithdrawForm(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {loading ? "Submitting..." : "Submit Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ShopWithDrawMoney;