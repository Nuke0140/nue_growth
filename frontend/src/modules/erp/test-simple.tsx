'use client';

import React from 'react';

export default function SimpleTestPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">ERP Test Page</h1>
      <p className="text-gray-600">If you can see this, the ERP module is loading.</p>
      <div className="mt-4 p-4 bg-blue-100 rounded">
        <p>Current time: {new Date().toLocaleString()}</p>
      </div>
    </div>
  );
}
