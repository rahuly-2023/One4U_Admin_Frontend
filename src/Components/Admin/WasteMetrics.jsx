// admin_frontend/src/Components/Admin/WasteNetrics.jsx

import React from 'react';
import { Pie } from 'react-chartjs-2';

const WasteMetrics = ({ foodWasteMetrics }) => {
  const popularItemsData = {
    labels: foodWasteMetrics.popularItems.map(item => item.name),
    datasets: [{
      data: foodWasteMetrics.popularItems.map(item => item.count),
      backgroundColor: [
        'rgba(59, 130, 246, 0.7)',
        'rgba(16, 185, 129, 0.7)',
        'rgba(245, 158, 11, 0.7)',
        'rgba(139, 92, 246, 0.7)',
        'rgba(20, 184, 166, 0.7)'
      ],
      borderColor: [
        'rgba(59, 130, 246, 1)',
        'rgba(16, 185, 129, 1)',
        'rgba(245, 158, 11, 1)',
        'rgba(139, 92, 246, 1)',
        'rgba(20, 184, 166, 1)'
      ],
      borderWidth: 1
    }]
  };

  const unpopularItemsData = {
    labels: foodWasteMetrics.unpopularItems.map(item => item.name),
    datasets: [{
      data: foodWasteMetrics.unpopularItems.map(item => item.count),
      backgroundColor: [
        'rgba(239, 68, 68, 0.7)',
        'rgba(249, 115, 22, 0.7)',
        'rgba(234, 179, 8, 0.7)',
        'rgba(220, 38, 38, 0.7)',
        'rgba(217, 119, 6, 0.7)'
      ],
      borderColor: [
        'rgba(239, 68, 68, 1)',
        'rgba(249, 115, 22, 1)',
        'rgba(234, 179, 8, 1)',
        'rgba(220, 38, 38, 1)',
        'rgba(217, 119, 6, 1)'
      ],
      borderWidth: 1
    }]
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Most Popular Items</h2>
        <p className="mb-4 text-gray-600">Items to stock up on based on today's orders</p>
        <div className="h-64 mb-4">
          <Pie 
            data={popularItemsData} 
            options={{ 
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'right'
                }
              }
            }} 
          />
        </div>
        <ul className="space-y-2">
          {foodWasteMetrics.popularItems.map((item, i) => (
            <li key={i} className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span className="font-medium text-gray-700">{item.name}</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                {item.count} orders
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Least Popular Items</h2>
        <p className="mb-4 text-gray-600">Potential waste candidates based on today's orders</p>
        <div className="h-64 mb-4">
          <Pie 
            data={unpopularItemsData} 
            options={{ 
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'right'
                }
              }
            }} 
          />
        </div>
        <ul className="space-y-2">
          {foodWasteMetrics.unpopularItems.map((item, i) => (
            <li key={i} className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span className="font-medium text-gray-700">{item.name}</span>
              <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-full">
                {item.count} orders
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default WasteMetrics;