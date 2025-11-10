"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { FaArrowLeft, FaMobileAlt, FaUniversity } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { createWithdrawalRequest, getWalletBalance } from './store';

const WithdrawForm = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { balance } = useSelector(({ wallet }) => wallet);
  const [withdrawalMethod, setWithdrawalMethod] = useState('bank');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Bank transfer fields
  const [accountHolderName, setAccountHolderName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [routingNumber, setRoutingNumber] = useState('');
  const [swiftCode, setSwiftCode] = useState('');
  const [accountType, setAccountType] = useState('checking');

  // Mobile banking fields
  const [provider, setProvider] = useState('');
  const [mobileAccountNumber, setMobileAccountNumber] = useState('');
  const [mobileAccountHolderName, setMobileAccountHolderName] = useState('');

  const providers = [
    { value: 'bKash', label: 'bKash' },
    { value: 'Nagad', label: 'Nagad' },
    { value: 'Rocket', label: 'Rocket' },
    { value: 'Other', label: 'Other' }
  ];

  useEffect(() => {
    dispatch(getWalletBalance());
  }, [dispatch]);

  const validateAmount = (value) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue < 10) {
      return 'Minimum withdrawal amount is $10';
    }
    if (numValue > balance) {
      return 'Insufficient balance';
    }
    return null;
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    setAmount(value);
    const error = validateAmount(value);
    setErrors({ ...errors, amount: error });
  };

  const validateForm = () => {
    const newErrors = {};
    
    const amountError = validateAmount(amount);
    if (amountError) {
      newErrors.amount = amountError;
    }

    if (withdrawalMethod === 'bank') {
      if (!accountHolderName.trim()) {
        newErrors.accountHolderName = 'Account holder name is required';
      }
      if (!accountNumber.trim()) {
        newErrors.accountNumber = 'Account number is required';
      }
      if (!bankName.trim()) {
        newErrors.bankName = 'Bank name is required';
      }
      if (!routingNumber.trim()) {
        newErrors.routingNumber = 'Routing number is required';
      }
    } else {
      if (!provider) {
        newErrors.provider = 'Please select a provider';
      }
      if (!mobileAccountNumber.trim()) {
        newErrors.mobileAccountNumber = 'Account number is required';
      }
      if (!mobileAccountHolderName.trim()) {
        newErrors.mobileAccountHolderName = 'Account holder name is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const withdrawalData = {
        amount: parseFloat(amount),
        method: withdrawalMethod,
        ...(withdrawalMethod === 'bank' ? {
          account_holder_name: accountHolderName,
          account_number: accountNumber,
          bank_name: bankName,
          routing_number: routingNumber,
          swift_code: swiftCode || null,
          account_type: accountType
        } : {
          provider,
          account_number: mobileAccountNumber,
          account_holder_name: mobileAccountHolderName
        })
      };

      await dispatch(createWithdrawalRequest(withdrawalData)).unwrap();
      router.push('/user/wallet');
    } catch (error) {
      toast.error(error.message || 'Failed to create withdrawal request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="mx-auto max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center mb-6">
            <button
              onClick={() => router.back()}
              className="text-blue-500 mr-4 hover:text-blue-600"
            >
              <FaArrowLeft className="text-xl" />
            </button>
            <h1 className="text-2xl font-bold text-gray-800">Withdraw Money</h1>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              <strong>Available Balance:</strong> ${balance?.toFixed(2) || '0.00'}
            </p>
            <p className="text-xs text-blue-700 mt-1">
              Withdrawal requests are subject to admin approval and may take 2-5 business days to process.
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Withdrawal Amount (USD) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg">$</span>
              <input
                type="number"
                value={amount}
                onChange={handleAmountChange}
                min="10"
                max={balance}
                step="0.01"
                className={`w-full pl-8 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 text-lg ${
                  errors.amount
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="0.00"
              />
            </div>
            {errors.amount && (
              <p className="text-red-500 text-xs mt-1">{errors.amount}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">Minimum withdrawal: $10.00</p>
          </div>

          {/* Withdrawal Method Selector */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              type="button"
              onClick={() => setWithdrawalMethod('bank')}
              className={`p-4 rounded-lg border-2 transition-all ${
                withdrawalMethod === 'bank'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex flex-col items-center text-center">
                <FaUniversity
                  className={`text-3xl mb-2 ${
                    withdrawalMethod === 'bank' ? 'text-blue-600' : 'text-gray-400'
                  }`}
                />
                <p
                  className={`font-semibold ${
                    withdrawalMethod === 'bank' ? 'text-blue-600' : 'text-gray-700'
                  }`}
                >
                  Bank Transfer
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setWithdrawalMethod('mobile')}
              className={`p-4 rounded-lg border-2 transition-all ${
                withdrawalMethod === 'mobile'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex flex-col items-center text-center">
                <FaMobileAlt
                  className={`text-3xl mb-2 ${
                    withdrawalMethod === 'mobile' ? 'text-blue-600' : 'text-gray-400'
                  }`}
                />
                <p
                  className={`font-semibold ${
                    withdrawalMethod === 'mobile' ? 'text-blue-600' : 'text-gray-700'
                  }`}
                >
                  Mobile Banking
                </p>
              </div>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {withdrawalMethod === 'bank' ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Holder Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={accountHolderName}
                    onChange={(e) => setAccountHolderName(e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.accountHolderName
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                    placeholder="John Doe"
                  />
                  {errors.accountHolderName && (
                    <p className="text-red-500 text-xs mt-1">{errors.accountHolderName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.accountNumber
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                    placeholder="1234567890"
                  />
                  {errors.accountNumber && (
                    <p className="text-red-500 text-xs mt-1">{errors.accountNumber}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bank Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.bankName
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                    placeholder="Bank of America"
                  />
                  {errors.bankName && (
                    <p className="text-red-500 text-xs mt-1">{errors.bankName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Routing Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={routingNumber}
                    onChange={(e) => setRoutingNumber(e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.routingNumber
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                    placeholder="123456789"
                  />
                  {errors.routingNumber && (
                    <p className="text-red-500 text-xs mt-1">{errors.routingNumber}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SWIFT Code (Optional)
                  </label>
                  <input
                    type="text"
                    value={swiftCode}
                    onChange={(e) => setSwiftCode(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="BOFAUS3N"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={accountType}
                    onChange={(e) => setAccountType(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="checking">Checking</option>
                    <option value="savings">Savings</option>
                  </select>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Provider <span className="text-red-500">*</span>
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
                    Account Number / Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={mobileAccountNumber}
                    onChange={(e) => setMobileAccountNumber(e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.mobileAccountNumber
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                    placeholder="01XXXXXXXXX"
                  />
                  {errors.mobileAccountNumber && (
                    <p className="text-red-500 text-xs mt-1">{errors.mobileAccountNumber}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Holder Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={mobileAccountHolderName}
                    onChange={(e) => setMobileAccountHolderName(e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.mobileAccountHolderName
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                    placeholder="John Doe"
                  />
                  {errors.mobileAccountHolderName && (
                    <p className="text-red-500 text-xs mt-1">{errors.mobileAccountHolderName}</p>
                  )}
                </div>
              </>
            )}

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting Request...' : 'Submit Withdrawal Request'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WithdrawForm;

