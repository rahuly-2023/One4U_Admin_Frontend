// admin_frontend/src/Components/Header.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaBell } from 'react-icons/fa';
import axios from 'axios';
import { toast, ToastContainer, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showAlarmMenu, setShowAlarmMenu] = useState(false);
  const [showACForm, setShowACForm] = useState(false);
  const [temperature, setTemperature] = useState(24);
  const [showCleanForm, setShowCleanForm] = useState(false);
  const [tableNumber, setTableNumber] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const updateLoginStatus = () => {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
    };

    updateLoginStatus();
    window.addEventListener('auth-changed', updateLoginStatus);

    if (localStorage.getItem('token')) {
      navigate('/home');
    }

    return () => window.removeEventListener('auth-changed', updateLoginStatus);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.dispatchEvent(new Event('auth-changed'));
    navigate('/login');
  };

  const handleTemperatureSubmit = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/specialrequest`, {
        data: temperature,
        requestType: "AC",
        Token: localStorage.getItem('token'),
      });

      toast(response.data, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
        transition: Bounce,
      });

      setShowACForm(false);
      setShowAlarmMenu(false);
    } catch (err) {
      toast.error("Failed to send AC request");
    }
  };

  const handleCleanSubmit = async (e) => {
    e.preventDefault();
    if (!tableNumber) return alert('Please enter a table number');

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/specialrequest`, {
        data: tableNumber,
        requestType: "clean",
        Token: localStorage.getItem('token'),
      });

      toast(response.data, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
        transition: Bounce,
      });

      setTableNumber('');
      setShowCleanForm(false);
      setShowAlarmMenu(false);
    } catch (err) {
      toast.error("Failed to send clean request");
    }
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-green-600">
          <a href='/home'>🍽️ One4U</a>
        </div>
        {/* <div className='justify-center'>ADMIN  PORTAL</div> */}

        {isLoggedIn ? (
          <div className='justify-center ml-5'>ADMIN  PORTAL</div>
        ) : (
          <div className='justify-center'>ADMIN  PORTAL</div>
        )}
        <ToastContainer />

        {isLoggedIn && (
          <nav className="hidden md:flex space-x-6">
            {/* <a href="#home" className="text-gray-700 hover:text-green-600">Home</a>
            <a href="#menu" className="text-gray-700 hover:text-green-600">Menu</a>
            <a href="#about" className="text-gray-700 hover:text-green-600">About</a>
            <a href="#contact" className="text-gray-700 hover:text-green-600">Contact</a> */}
          </nav>
        )}

        <div className="flex items-center gap-4 relative">
          {isLoggedIn ? (
            <>
              {/* <div className="relative">
                <FaBell
                  size={24}
                  className="cursor-pointer text-green-600"
                  onClick={() => {
                    setShowAlarmMenu(!showAlarmMenu);
                    setShowUserMenu(false);
                  }}
                />
                {showAlarmMenu && (
                  <div className="absolute right-0 mt-2 w-60 bg-white shadow-lg rounded-lg z-50 p-2">
                    <ul>
                      <li
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setShowACForm(!showACForm);
                          setShowCleanForm(false);
                        }}
                      >
                        AC
                      </li>
                      <li
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setShowCleanForm(!showCleanForm);
                          setShowACForm(false);
                        }}
                      >
                        Clean
                      </li>
                    </ul>

                    {showCleanForm && (
                      <form onSubmit={handleCleanSubmit} className="mt-2 p-3 border rounded bg-gray-50">
                        <input
                          type="text"
                          placeholder="Table No"
                          value={tableNumber}
                          onChange={(e) => setTableNumber(e.target.value)}
                          className="w-full p-2 mb-2 border border-gray-300 rounded"
                        />
                        <button
                          type="submit"
                          className="w-full bg-green-600 text-white py-1 rounded hover:bg-green-700"
                        >
                          Submit
                        </button>
                      </form>
                    )}

                    {showACForm && (
                      <div className="p-3 mt-2 border rounded-md bg-gray-50">
                        <div className="flex items-center justify-between mb-2">
                          <button
                            type="button"
                            className="px-2 py-1 bg-red-200 rounded hover:bg-red-300"
                            onClick={() => setTemperature(prev => Math.max(prev - 1, 16))}
                          >
                            -
                          </button>
                          <span className="text-lg font-semibold">{temperature}°C</span>
                          <button
                            type="button"
                            className="px-2 py-1 bg-green-200 rounded hover:bg-green-300"
                            onClick={() => setTemperature(prev => Math.min(prev + 1, 30))}
                          >
                            +
                          </button>
                        </div>
                        <button
                          className="w-full bg-green-600 text-white py-1 rounded hover:bg-green-700"
                          onClick={handleTemperatureSubmit}
                        >
                          Submit
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div> */}

              <div className="relative">
                <FaUserCircle
                  size={32}
                  className="cursor-pointer text-green-600"
                  onClick={() => {
                    setShowUserMenu(!showUserMenu);
                    setShowAlarmMenu(false);
                  }}
                />
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg z-50">
                    <ul>
                      {/* <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => navigate('/profile')}>Profile</li>
                      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => navigate('/orders')}>Orders</li>
                      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => navigate('/requests')}>Requests</li> */}
                      <li className="px-4 py-2 hover:bg-red-100 text-red-600 cursor-pointer" onClick={handleLogout}>Logout</li>
                    </ul>
                  </div>
                )}
              </div>
            </>
          ) : (
            // <button
            //   className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition"
            //   onClick={() => navigate('/login')}
            // >
            //   Order Now
            // </button>
            <div></div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
