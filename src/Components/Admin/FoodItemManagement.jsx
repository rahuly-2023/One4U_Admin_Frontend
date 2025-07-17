// admin_frontend/src/Components/Admin/FoodItemManagement.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FoodItemManagement = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newFoodItem, setNewFoodItem] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    imageUrl: '',
    isAvailable: true
  });
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchFoodItems();
    fetchCategories();
  }, [token, navigate]);

  const fetchFoodItems = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/fooditems`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFoodItems(response.data);
    } catch (err) {
      setError('Failed to fetch food items');
      console.error('Error fetching food items:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/categories`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCategories(response.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewFoodItem(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const payload = {
        ...newFoodItem,
        price: parseFloat(newFoodItem.price)
      };
      
      if (editingId) {
        await axios.put(`${import.meta.env.VITE_API_BASE_URL}/fooditems/${editingId}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEditingId(null);
      } else {
        await axios.post(`${import.meta.env.VITE_API_BASE_URL}/fooditems`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      setNewFoodItem({
        name: '',
        description: '',
        price: '',
        category: '',
        imageUrl: '',
        isAvailable: true
      });
      fetchFoodItems();
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving food item');
      console.error('Error saving food item:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setNewFoodItem({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category: item.category?._id || '',
      imageUrl: item.imageUrl,
      isAvailable: item.isAvailable
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this food item?')) return;
    
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/fooditems/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchFoodItems();
    } catch (err) {
      setError('Failed to delete food item');
      console.error('Error deleting food item:', err);
    }
  };

  const toggleAvailability = async (id) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/fooditems/${id}/toggle`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchFoodItems();
    } catch (err) {
      setError('Failed to toggle availability');
      console.error('Error toggling availability:', err);
    }
  };

  const FormField = ({ label, name, value, onChange, ...props }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
    <input
      type={props.type || 'text'}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
      {...props}
    />
  </div>
);

  return (
  <div className="min-h-screen bg-gradient-to-tr from-blue-50 to-gray-100 py-10 px-4">
    <div className="max-w-7xl mx-auto bg-white p-8 rounded-2xl shadow-xl">
      <h2 className="text-4xl font-extrabold text-gray-800 mb-8 border-b pb-4">🍽️ Food Item Management</h2>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-800 border border-red-200 rounded-lg">
          {error}
        </div>
      )}

      {/* FORM SECTION */}
      <form onSubmit={handleSubmit} className="space-y-6 mb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <FormField label="Name*" name="name" value={newFoodItem.name} onChange={handleInputChange} />
          <FormField label="Description" name="description" value={newFoodItem.description} onChange={handleInputChange} />
          <FormField label="Price*" name="price" value={newFoodItem.price} onChange={handleInputChange} type="number" min="0" step="0.01" />

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Category*</label>
            <select
              name="category"
              value={newFoodItem.category}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <FormField label="Image URL" name="imageUrl" value={newFoodItem.imageUrl} onChange={handleInputChange} />
          <div className="flex items-center space-x-3 pt-6">
            <input
              id="isAvailable"
              name="isAvailable"
              type="checkbox"
              checked={newFoodItem.isAvailable}
              onChange={(e) => setNewFoodItem(prev => ({ ...prev, isAvailable: e.target.checked }))}
              className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isAvailable" className="text-sm font-medium text-gray-700">Available</label>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition font-medium shadow disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : editingId ? 'Update Item' : 'Add Item'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setNewFoodItem({
                  name: '',
                  description: '',
                  price: '',
                  category: '',
                  imageUrl: '',
                  isAvailable: true
                });
              }}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition font-medium shadow"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* TABLE SECTION */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-800 text-sm uppercase tracking-wider">
              {['Name', 'Description', 'Price', 'Category', 'Image', 'Status', 'Actions'].map((title) => (
                <th key={title} className="px-5 py-3 border-b">{title}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading && !foodItems.length ? (
              <tr><td colSpan="7" className="text-center py-8 text-gray-500">Loading...</td></tr>
            ) : foodItems.length === 0 ? (
              <tr><td colSpan="7" className="text-center py-8 text-gray-500">No food items found</td></tr>
            ) : (
              foodItems.map(item => (
                <tr key={item._id} className="bg-white border-b hover:bg-gray-50 transition">
                  <td className="px-5 py-3">{item.name}</td>
                  <td className="px-5 py-3">{item.description || '-'}</td>
                  <td className="px-5 py-3 font-semibold text-gray-700">${item.price.toFixed(2)}</td>
                  <td className="px-5 py-3">{item.category?.name || 'Uncategorized'}</td>
                  <td className="px-5 py-3">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="h-12 w-12 object-cover rounded-md border" />
                    ) : '-'}
                  </td>
                  <td className="px-5 py-3">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${item.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {item.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex flex-wrap gap-2 min-w-[250px]">
                        <button
                        onClick={() => handleEdit(item)}
                        className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-md text-sm min-w-[110px] text-center"
                        >
                        Edit
                        </button>
                        <button
                        onClick={() => toggleAvailability(item._id)}
                        className={`text-white px-3 py-1 rounded-md text-sm min-w-[140px] text-center ${
                            item.isAvailable ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                        }`}
                        >
                        {item.isAvailable ? 'Make Unavailable' : 'Make Available'}
                        </button>
                        <button
                        onClick={() => handleDelete(item._id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm min-w-[90px] text-center"
                        >
                        Delete
                        </button>
                    </div>
                    </td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

};

export default FoodItemManagement;