// admin_frontend/src/pages/Login.jsx


import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer, Bounce } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate(); // ✅ Moved here

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    console.log('Login Data:', formData);

    axios.post(`${import.meta.env.VITE_API_BASE_URL}/login`, formData)
      .then((response) => {
        const reply = response.data.message;
        const token = response.data.token;

        localStorage.setItem('token', token);
        navigate('/home'); // ✅ navigate works here

        toast(reply, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
        });
      })
      .catch((error) => {
        console.error('Login error:', error);
        toast.error('Login failed!', {
          position: "top-right",
          autoClose: 5000,
          theme: "colored",
        });
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <ToastContainer />
        <h2 className="text-2xl font-bold text-green-600 mb-6 text-center">Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full border border-gray-300 px-4 py-2 rounded-lg"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full border border-gray-300 px-4 py-2 rounded-lg"
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
          >
            Log In
          </button>
        </form>
        <p className="mt-4 text-sm text-center">
          Don’t have an account? <a href="/signup" className="text-green-600 underline">Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
