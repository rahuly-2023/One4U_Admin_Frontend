import React from 'react';

const OrderManagement = ({ pendingOrders, handleCompleteOrder }) => {
  return (
    <div className="overflow-x-auto">
      {pendingOrders.length === 0 ? (
        <p className="py-4 text-center">No pending orders found</p>
      ) : (
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 text-left">Order ID</th>
              <th className="py-2 px-4 text-left">User</th>
              <th className="py-2 px-4 text-left">Table</th>
              <th className="py-2 px-4 text-left">Items</th>
              <th className="py-2 px-4 text-left">Total</th>
              <th className="py-2 px-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {pendingOrders.map(order => (
              <tr key={order._id} className={`border-b ${order.status === 'delivered' ? 'bg-green-50' : ''}`}>
                <td className="py-3 px-4">{order._id.substring(18, 24)}</td>
                <td className="py-3 px-4">{order.user?.name}</td>
                <td className="py-3 px-4">Table {order.tableNumber}</td>
                <td className="py-3 px-4">
                  <ul className="list-disc pl-4">
                    {order.items.map((item, index) => (
                      <li key={index}>
                        {item.quantity}x {item.item?.name} (${item.item?.price})
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="py-3 px-4">${order.totalAmount.toFixed(2)}</td>
                <td className="py-3 px-4">
                  {/* <button
                    onClick={() => handleCompleteOrder(order._id)}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                  >
                    Mark as Paid
                  </button> */}
                  {order.status === 'delivered' ? (
                    <span className="text-sm text-gray-500 italic">Paid</span>
                  ) : (
                    <button
                      onClick={() => handleCompleteOrder(order._id)}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      Mark as Paid
                    </button>
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

export default OrderManagement;