import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 const handleSignup = (e) => {
  e.preventDefault();
  console.log('Signup Data:', formData);

  axios.post(`${import.meta.env.VITE_API_BASE_URL}/signup`, formData)
    .then((response) => {
      const reply = response.data.message;
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
      console.error('Signup error:', error);
      toast.error('Signup failed!', {
        position: "top-right",
        autoClose: 5000,
        theme: "colored",
      });
    });
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 px-4">
      <div className="flex flex-col md:flex-row bg-white rounded-xl shadow-md max-w-4xl w-full overflow-hidden">
        <ToastContainer
position="top-right"
autoClose={5000}
hideProgressBar={false}
newestOnTop={false}
closeOnClick={false}
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
theme="colored"
transition={Bounce}
/>
        {/* Left Side - Image */}
        <div className="md:w-1/2 flex items-center justify-center bg-green-100 p-6">
          <img
            src="../assets/canteen.png"
            alt="College"
             
          />
        </div>
        
        {/* Right Side - Form */}
        <div className="md:w-1/2 p-8">
          <h2 className="text-2xl font-bold text-green-600 mb-6 text-center">Create an Account</h2>
          <form onSubmit={handleSignup} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              className="w-full border border-gray-300 px-4 py-2 rounded-lg"
              onChange={handleChange}
              required
            />
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
              Sign Up
            </button>
          </form>
          <p className="mt-4 text-sm text-center">
            Already have an account?{' '}
            <a href="/login" className="text-green-600 underline">Log in</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
