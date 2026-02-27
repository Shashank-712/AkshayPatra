// src/pages/donor/CreateFood.js
import React, { useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const CreateFood = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    type: '',
    subType: '',
    quantity: '',
    expiry: '',
    address: '',
    description: '',
    image: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'image') {
      setFormData({
        ...formData,
        image: files[0],
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log('Food Submitted:', formData);

    toast.success('Food posted successfully! 🎉');
    navigate('/donor/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 py-10">
        <Card className="dark:bg-gray-800">
          <h2 className="text-2xl font-bold mb-6 dark:text-white">
            Post Surplus Food
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Food Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Food Title
              </label>
              <input
                type="text"
                name="title"
                required
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md px-3 py-2"
              />
            </div>

            {/* Veg / Non-Veg */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Category
              </label>
              <div className="mt-2 flex gap-6">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="type"
                    value="Veg"
                    onChange={handleChange}
                    required
                  />
                  <span className="dark:text-gray-300">Veg</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="type"
                    value="Non-Veg"
                    onChange={handleChange}
                    required
                  />
                  <span className="dark:text-gray-300">Non-Veg</span>
                </label>
              </div>
            </div>

            {/* Sub Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Food Type
              </label>
              <select
                name="subType"
                required
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md px-3 py-2"
              >
                <option value="">Select Type</option>
                <option value="Packaged">Packaged</option>
                <option value="Cooked">Cooked</option>
                <option value="Fruits & Vegetables">Fruits & Vegetables</option>
                <option value="Raw Ingredients">Raw Ingredients</option>
              </select>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Quantity (e.g. 20 meals)
              </label>
              <input
                type="text"
                name="quantity"
                required
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md px-3 py-2"
              />
            </div>

            {/* Expiry */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Expiry Date & Time
              </label>
              <input
                type="datetime-local"
                name="expiry"
                required
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md px-3 py-2"
              />
            </div>

            {/* Pickup Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Pickup Address
              </label>
              <input
                type="text"
                name="address"
                required
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md px-3 py-2"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Description (Optional)
              </label>
              <textarea
                name="description"
                rows="3"
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md px-3 py-2"
              ></textarea>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Upload Food Image
              </label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                className="mt-1 w-full text-gray-700 dark:text-gray-300"
              />
            </div>

            <Button type="submit" fullWidth>
              Submit Food
            </Button>

          </form>
        </Card>
      </div>
    </div>
  );
};

export default CreateFood;