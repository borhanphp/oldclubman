"use client";

import React, { useState } from 'react';
import { FaUpload, FaMobileAlt } from 'react-icons/fa';

const MobileBankingDeposit = ({ amount, onSuccess, onError, loading }) => {
  const [provider, setProvider] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [receipt, setReceipt] = useState(null);
  const [receiptPreview, setReceiptPreview] = useState(null);
  const [errors, setErrors] = useState({});

  const providers = [
    { value: 'bKash', label: 'bKash' },
    { value: 'Nagad', label: 'Nagad' },
    { value: 'Rocket', label: 'Rocket' },
    { value: 'Other', label: 'Other Bank Transfer' }
  ];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, receipt: 'File size must be less than 5MB' });
        return;
      }
      setReceipt(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!provider) {
      newErrors.provider = 'Please select a payment provider';
    }
    
    if (!transactionId || transactionId.trim().length < 3) {
      newErrors.transactionId = 'Please enter a valid transaction ID';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const formData = {
        provider,
        transactionId: transactionId.trim(),
        amount,
        receipt: receipt || null
      };

      onSuccess(formData);
    } catch (error) {
      onError(error.message || 'Failed to submit deposit');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
        <p className="text-sm text-yellow-800">
          <strong>Note:</strong> Your deposit will be verified by our admin team. This may take 24-48 hours.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Payment Provider <span className="text-red-500">*</span>
        </label>
        <select
          value={provider}
          onChange={(e) => setProvider(e.target.value)}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
            errors.provider
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-blue-500'
          }`}
        >
          <option value="">Select Provider</option>
          {providers.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
        {errors.provider && (
          <p className="text-red-500 text-xs mt-1">{errors.provider}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Transaction ID / Reference Number <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <FaMobileAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              errors.transactionId
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500'
            }`}
            placeholder="Enter transaction ID or reference number"
          />
        </div>
        {errors.transactionId && (
          <p className="text-red-500 text-xs mt-1">{errors.transactionId}</p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          Enter the transaction ID or reference number from your mobile banking app
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Amount
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
          <input
            type="text"
            value={amount.toFixed(2)}
            disabled
            className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Receipt (Optional)
        </label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
          <div className="space-y-1 text-center">
            {receiptPreview ? (
              <div className="relative">
                <img
                  src={receiptPreview}
                  alt="Receipt Preview"
                  className="mx-auto h-32 w-auto object-contain rounded"
                />
                <button
                  type="button"
                  onClick={() => {
                    setReceipt(null);
                    setReceiptPreview(null);
                    setErrors({ ...errors, receipt: null });
                  }}
                  className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full text-xs"
                >
                  ×
                </button>
              </div>
            ) : (
              <>
                <FaUpload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="receipt-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                  >
                    <span>Upload receipt</span>
                    <input
                      id="receipt-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="sr-only"
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, PDF up to 5MB</p>
              </>
            )}
          </div>
        </div>
        {errors.receipt && (
          <p className="text-red-500 text-xs mt-1">{errors.receipt}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Submitting...' : 'Submit Deposit Request'}
      </button>
    </form>
  );
};

export default MobileBankingDeposit;

