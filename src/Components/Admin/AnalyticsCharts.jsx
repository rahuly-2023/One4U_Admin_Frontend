// admin_frontend/src/Components/Admin/AnalyticsCharts.jsx

import React from 'react';
import { Line, Bar } from 'react-chartjs-2';

const AnalyticsCharts = ({ hourlyOrderData, topItemsPerHour }) => {
  // Prepare Line Chart: Orders per hour
  const lineData = {
    labels: Object.keys(hourlyOrderData).sort((a, b) => a - b).map(h => `${h}:00`),
    datasets: [
      {
        label: 'Orders per Hour',
        data: Object.keys(hourlyOrderData).sort((a, b) => a - b).map(h => hourlyOrderData[h]),
        fill: true,
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderColor: 'rgba(59, 130, 246, 1)',
        tension: 0.4,
        pointBackgroundColor: 'rgba(59, 130, 246, 1)',
        pointBorderColor: '#fff',
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(59, 130, 246, 1)',
        pointHoverBorderColor: '#fff',
        pointHitRadius: 10,
        pointBorderWidth: 2
      },
    ],
  };

  // Prepare Bar Chart: Top item count per hour
  const barData = {
    labels: Object.keys(topItemsPerHour).sort((a, b) => a - b).map(h => `${h}:00`),
    datasets: [
      {
        label: 'Top Ordered Item per Hour',
        data: Object.values(topItemsPerHour).map(([item, count]) => count),
        backgroundColor: 'rgba(16, 185, 129, 0.7)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(16, 185, 129, 0.9)',
        hoverBorderColor: 'rgba(16, 185, 129, 1)'
      },
    ],
  };

  const chartOptions = {
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        titleFont: {
          size: 14
        },
        bodyFont: {
          size: 12
        },
        footerFont: {
          size: 10
        }
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Average Orders per Hour</h2>
        <div className="h-64">
          <Line data={lineData} options={chartOptions} />
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Most Ordered Items per Hour</h2>
        <div className="h-64">
          <Bar data={barData} options={chartOptions} />
        </div>
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Top Items by Hour:</h3>
          <ul className="grid grid-cols-2 gap-2">
            {Object.entries(topItemsPerHour).map(([hour, [item, count]]) => (
              <li key={hour} className="bg-gray-50 p-2 rounded text-sm">
                <span className="font-medium">{hour}:00</span> - {item} ({count})
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsCharts;