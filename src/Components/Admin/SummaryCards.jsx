import React from 'react';

const SummaryCards = ({ todayOrders, foodWasteMetrics }) => {
  const completionRate = todayOrders.length > 0 
    ? Math.round(((todayOrders.length - foodWasteMetrics.cancelledOrders) / todayOrders.length) * 100)
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div>
            <h3 className="font-medium text-gray-500">Today's Orders</h3>
            <p className="text-2xl font-semibold text-gray-800">{todayOrders.length}</p>
          </div>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-red-100 text-red-600 mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <div>
            <h3 className="font-medium text-gray-500">Cancelled Orders</h3>
            <p className="text-2xl font-semibold text-gray-800">{foodWasteMetrics.cancelledOrders}</p>
          </div>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="font-medium text-gray-500">Order Completion Rate</h3>
            <p className="text-2xl font-semibold text-gray-800">
              {completionRate}%
              <span className={`ml-2 text-sm ${completionRate > 90 ? 'text-green-500' : completionRate > 75 ? 'text-yellow-500' : 'text-red-500'}`}>
                {completionRate > 90 ? 'Excellent' : completionRate > 75 ? 'Good' : 'Needs Improvement'}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryCards;