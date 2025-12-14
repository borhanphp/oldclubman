"use client";

import React from 'react';

const StatusBadge = ({ status }) => {
  const statusConfig = {
    completed: {
      label: 'Completed',
      className: 'bg-green-100 text-green-800 border-green-200'
    },
    pending: {
      label: 'Pending',
      className: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    },
    failed: {
      label: 'Failed',
      className: 'bg-red-100 text-red-800 border-red-200'
    },
    approved: {
      label: 'Approved',
      className: 'bg-blue-100 text-blue-800 border-blue-200'
    },
    rejected: {
      label: 'Rejected',
      className: 'bg-red-100 text-red-800 border-red-200'
    },
    processing: {
      label: 'Processing',
      className: 'bg-purple-100 text-purple-800 border-purple-200'
    },
    active: {
      label: 'Active',
      className: 'bg-green-100 text-green-800 border-green-200'
    },
    used: {
      label: 'Used',
      className: 'bg-gray-100 text-gray-800 border-gray-200'
    },
    expired: {
      label: 'Expired',
      className: 'bg-gray-100 text-gray-800 border-gray-200'
    },
    gifted: {
      label: 'Gifted',
      className: 'bg-blue-100 text-blue-800 border-blue-200'
    }
  };

  const config = statusConfig[status?.toLowerCase()] || {
    label: status || 'Unknown',
    className: 'bg-gray-100 text-gray-800 border-gray-200'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.className}`}>
      {config.label}
    </span>
  );
};

export default StatusBadge;

