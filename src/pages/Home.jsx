// admin_frontend/src/pages/Home.jsx

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import FoodCategoryManagement from '../Components/Admin/FoodCategoryManagement';
import FoodItemManagement from '../Components/Admin/FoodItemManagement';
import { useNavigate } from 'react-router-dom';
import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  PointElement,
  ArcElement
} from 'chart.js';
import OrderManagement from '../Components/Admin/OrderManagement';
import RequestManagement from '../Components/Admin/RequestManagement';
import SummaryCards from '../Components/Admin/SummaryCards';
import AnalyticsCharts from '../Components/Admin/AnalyticsCharts';
import WasteMetrics from '../Components/Admin/WasteMetrics';
import { toast } from 'react-toastify';
import { io } from 'socket.io-client';

ChartJS.register(
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  PointElement,
  ArcElement
);

const AdminDashboard = () => {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [requests, setRequests] = useState([]);
  const [hourlyOrderData, setHourlyOrderData] = useState({});
  const [topItemsPerHour, setTopItemsPerHour] = useState({});
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [todayOrders, setTodayOrders] = useState([]);
  const [foodWasteMetrics, setFoodWasteMetrics] = useState({
    cancelledOrders: 0,
    popularItems: [],
    unpopularItems: []
  });

  const socketRef = useRef(null);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    if (!socketRef.current) {
      const socket = io(import.meta.env.VITE_API_USER_BASE_URL);
      socketRef.current = socket;

      socket.on('connect', () => {
        console.log('✅ Connected to socket server');
        socket.emit('register-admin');
      });

      socket.on('new-order', (order) => {
        setPendingOrders(prev => {
          const exists = prev.some(o => o._id === order._id);
          return exists ? prev : [order, ...prev];
        });
        toast.info('📦 New order received!');
      });


      socket.on('order-updated', ({ orderId, status }) => {
        setPendingOrders((prev) =>
          prev.map((order) =>
            order._id === orderId ? { ...order, status } : order
          )
        );
        if(status=="cancelled"){
          toast.error(`Order ${orderId} is cancelled`);
        }
      });

      return () => {
        socket.disconnect();
        socketRef.current = null;
      };
    }
  }, [token, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (activeTab === 'orders') {
          const todayStart = new Date();
          todayStart.setHours(0, 0, 0, 0);
          const todayEnd = new Date();
          todayEnd.setHours(23, 59, 59, 999);

          const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/orders`, {
            params: {
              startDate: todayStart.toISOString(),
              endDate: todayEnd.toISOString()
            },
            headers: { Authorization: `Bearer ${token}` }
          });

          const sorted = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setPendingOrders(sorted);
        } else if (activeTab === 'requests') {
          const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/requests`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setRequests(res.data);
        } else if (activeTab === 'analytics') {
          const todayStart = new Date();
          todayStart.setHours(0, 0, 0, 0);
          todayStart.setMinutes(todayStart.getMinutes() - todayStart.getTimezoneOffset());

          const todayEnd = new Date();
          todayEnd.setHours(23, 59, 59, 999);
          todayEnd.setMinutes(todayEnd.getMinutes() - todayEnd.getTimezoneOffset());

          const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/allorders`, {
            params: {
              startDate: todayStart.toISOString(),
              endDate: todayEnd.toISOString()
            },
            headers: { Authorization: `Bearer ${token}` }
          });

          setTodayOrders(res.data);
          processChartData(res.data);
          calculateWasteMetrics(res.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [orders, activeTab, token]);

  const calculateWasteMetrics = (orders) => {
    const itemCounts = {};
    const cancelledOrders = orders.filter(o => o.status === 'cancelled').length;

    orders.forEach(order => {
      if (order.status !== 'cancelled') {
        order.items.forEach(item => {
          const itemName = item.item?.name || 'Unknown';
          itemCounts[itemName] = (itemCounts[itemName] || 0) + item.quantity;
        });
      }
    });

    const allItems = Object.entries(itemCounts).map(([name, count]) => ({ name, count }));
    allItems.sort((a, b) => b.count - a.count);

    setFoodWasteMetrics({
      cancelledOrders,
      popularItems: allItems.slice(0, 5),
      unpopularItems: allItems.slice(-5).reverse()
    });
  };

  const processChartData = (orders) => {
    const ordersPerHour = {};
    const itemsByHour = {};

    orders.forEach(order => {
      const hour = new Date(order.createdAt).getHours();
      ordersPerHour[hour] = (ordersPerHour[hour] || 0) + 1;

      order.items.forEach(item => {
        if (!itemsByHour[hour]) itemsByHour[hour] = {};
        const itemName = item.item?.name || 'Unknown';
        itemsByHour[hour][itemName] = (itemsByHour[hour][itemName] || 0) + item.quantity;
      });
    });

    setHourlyOrderData(ordersPerHour);

    const topItems = {};
    Object.keys(itemsByHour).forEach(hour => {
      const items = itemsByHour[hour];
      const topItem = Object.entries(items).reduce((a, b) => (a[1] > b[1] ? a : b), ['', 0]);
      topItems[hour] = topItem;
    });

    setTopItemsPerHour(topItems);
  };

  const handleCompleteOrder = async (orderId) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/orders/${orderId}/complete`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPendingOrders(prev => {
        const updated = prev.map(o =>
          o._id === orderId ? { ...o, status: 'delivered' } : o
        );

        const sorted = [
          ...updated.filter(o => o.status !== 'delivered'),
          ...updated.filter(o => o.status === 'delivered')
        ];

        return sorted;
      });
    } catch (error) {
      console.error('Error completing order:', error);
    }
  };

  const handleCompleteRequest = async (requestId) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/requests/${requestId}/complete`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRequests(requests.filter(req => req._id !== requestId));
    } catch (error) {
      console.error('Error completing request:', error);
    }
  };



  // NOW
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_USER_BASE_URL}/api/orders/${orderId}/status`, {
        status: newStatus
      });

      toast.success(`Order marked as ${newStatus}`);

      // ✅ Inline update to avoid full refresh
      setPendingOrders(prev =>
        prev.map(order =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      console.error(err);
      toast.error('Status update failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-grow container mx-auto px-4 py-8">
        <div className="flex mb-6 border-b border-gray-200 ">
          <button
            className={`cursor-pointer px-4 py-2 font-medium text-sm ${activeTab === 'orders' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('orders')}
          >
            Orders
          </button>
          <button
            className={`cursor-pointer px-4 py-2 font-medium text-sm ${activeTab === 'requests' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('requests')}
          >
            Special Requests
          </button>
          <button
            className={`cursor-pointer px-4 py-2 font-medium text-sm ${activeTab === 'categories' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('categories')}
          >
            Food Categories
          </button>
          <button
            className={`cursor-pointer px-4 py-2 font-medium text-sm ${activeTab === 'items' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('items')}
          >
            Food Items
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${activeTab === 'analytics' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('analytics')}
          >
            Analytics
          </button>
        </div>

        {activeTab === 'orders' ? (
          <OrderManagement 
            pendingOrders={pendingOrders} 
            handleCompleteOrder={handleCompleteOrder} 
            updateStatus={handleStatusChange}       //NOW
          />
        ) : activeTab === 'requests' ? (
          <RequestManagement 
            requests={requests} 
            handleCompleteRequest={handleCompleteRequest} 
          />
        ) : activeTab === 'categories' ? (
          <FoodCategoryManagement />
        ) : activeTab === 'items' ? (
          <FoodItemManagement />
        ) : (
          <div className="space-y-6">
            <SummaryCards 
              todayOrders={todayOrders} 
              foodWasteMetrics={foodWasteMetrics} 
            />
            <AnalyticsCharts 
              hourlyOrderData={hourlyOrderData} 
              topItemsPerHour={topItemsPerHour} 
            />
            <WasteMetrics 
              foodWasteMetrics={foodWasteMetrics} 
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
