// admin_frontend/src/Components/Admin/Ordermanagement.jsx

import React from 'react';
import { toast } from 'react-toastify';
// const axios=require('axios');
import axios from 'axios';

const OrderManagement = ({ pendingOrders, handleCompleteOrder, updateStatus }) => {

  // ✅ Sort orders by status priority
  const statusPriority = {
    pending: 0,
    preparing: 1,
    served: 2,
    delivered: 3,
    cancelled: 4
  };

  const sortedOrders = [...pendingOrders].sort((a, b) => {
    return statusPriority[a.status] - statusPriority[b.status];
  });




  return (
  <div className="overflow-x-auto px-4">
    {pendingOrders.length === 0 ? (
      <p className="py-6 text-center text-gray-500 text-lg">No pending orders found</p>
    ) : (
      <table className="min-w-full bg-white shadow-lg rounded-xl overflow-hidden">
        <thead className="bg-gray-100 text-sm text-gray-700 uppercase tracking-wider border-b">
          <tr>
            <th className="py-3 px-5 text-left">Order ID</th>
            <th className="py-3 px-5 text-left">User</th>
            <th className="py-3 px-5 text-left">Table</th>
            <th className="py-3 px-5 text-left">Items</th>
            <th className="py-3 px-5 text-left">Total</th>
            <th className="py-3 px-5 text-left">Instructions</th>
            <th className="py-3 px-5 text-left">Status</th>
            <th className="py-3 px-5 text-left">Action</th>
          </tr>
        </thead>
        <tbody className="text-sm divide-y divide-gray-100">
          {sortedOrders.map(order => (
            <tr
              key={order._id}
              className={`transition duration-150 hover:scale-[1.005] ${
                order.status === 'pending'
                  ? 'bg-yellow-50'
                  : order.status === 'preparing'
                  ? 'bg-blue-50'
                  : order.status === 'served'
                  ? 'bg-indigo-50'
                  : order.status === 'delivered'
                  ? 'bg-green-50'
                  : order.status === 'cancelled'
                  ? 'bg-red-50'
                  : 'bg-white'
              }`}
            >
              <td className="py-3 px-5 font-mono text-gray-800">{order._id.substring(18, 24)}</td>
              <td className="py-3 px-5 text-gray-900 font-medium">{order.user?.name}</td>
              <td className="py-3 px-5 text-gray-700">Table {order.tableNumber}</td>
              <td className="py-3 px-5">
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  {order.items.map((item, index) => (
                    <li key={index}>
                      <span className="font-semibold">{item.quantity}x</span> {item.item?.name}{' '}
                      <span className="text-gray-500 text-xs">(${item.item?.price})</span>
                    </li>
                  ))}
                </ul>
              </td>
              <td className="py-3 px-5 font-semibold text-green-700">${order.totalAmount.toFixed(2)}</td>

              <td className="py-3 px-5 text-gray-700">
                <div className="max-h-28 overflow-y-auto pr-1 custom-scrollbar">
                  {(() => {
                    const raw = order.specialInstructions || '';
                    try {
                      const parsed = JSON.parse(raw);
                      if (typeof parsed === 'object' && parsed !== null) {
                        return (
                          <>
                            {parsed.user && (
                              <div className="mb-1">
                                <span className="font-semibold text-blue-600">By User:</span>{' '}
                                {parsed.user}
                              </div>
                            )}
                            {parsed.gemini && (
                              <div>
                                <span className="font-semibold text-purple-600">Pro Tip:</span>{' '}
                                {parsed.gemini}
                              </div>
                            )}
                          </>
                        );
                      } else {
                        return <div>{raw}</div>;
                      }
                    } catch {
                      return <div>{raw}</div>;
                    }
                  })()}
                </div>
              </td>


              {/* ✅ STATUS BADGE COLUMN */}
              <td className="py-3 px-5">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium tracking-wide
                  ${
                    order.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : order.status === 'preparing'
                      ? 'bg-blue-100 text-blue-800'
                      : order.status === 'served'
                      ? 'bg-indigo-100 text-indigo-800'
                      : order.status === 'delivered'
                      ? 'bg-green-100 text-green-800'
                      : order.status === 'cancelled'
                      ? 'bg-red-100 text-red-800'
                      : ''
                  }`}
                >
                  {order.status === 'pending' && '🟡 Pending'}
                  {order.status === 'preparing' && '🛠️ Preparing'}
                  {order.status === 'served' && '🍽️ Served'}
                  {order.status === 'delivered' && '✔ Delivered'}
                  {order.status === 'cancelled' && '✖ Cancelled'}
                </span>
              </td>

              {/* ✅ ACTION BUTTONS */}
              <td className="py-3 px-5">
                {order.status === 'pending' && (
                  <button
                    onClick={() => updateStatus(order._id, 'preparing')}
                    className="bg-yellow-500 text-white px-4 py-1.5 rounded-full shadow hover:bg-yellow-600 transition"
                  >
                    Acknowledge
                  </button>
                )}

                {order.status === 'preparing' && (
                  <button
                    onClick={() => updateStatus(order._id, 'served')}
                    className="bg-blue-500 text-white px-4 py-1.5 rounded-full shadow hover:bg-blue-600 transition"
                  >
                    Serve
                  </button>
                )}

                {order.status === 'served' && (
                  <button
                    onClick={() => updateStatus(order._id, 'delivered')}
                    className="bg-green-600 text-white px-4 py-1.5 rounded-full shadow hover:bg-green-700 transition"
                  >
                    Mark as Paid
                  </button>
                )}

                {order.status === 'delivered' && (
                  <span className="text-sm text-gray-500 italic">Paid</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
);

};




// const updateStatus = async (orderId, newStatus) => {
//   try {
//     console.log("UPDATE gone")
//     await axios.put(`${import.meta.env.VITE_API_USER_BASE_URL}/api/orders/${orderId}/status`, {
//       status: newStatus
//     });
//     toast.success(`Order marked as ${newStatus}`);

//     // setPendingOrders(prev =>
//     //   prev.map(order =>
//     //     order._id === orderId ? { ...order, status } : order
//     //   )
//     // );
//     // Optional: re-fetch or update state manually
//   } catch(err) {
//     console.log(err);
//     toast.error('Status update failed');
//   }
// };


export default OrderManagement;

