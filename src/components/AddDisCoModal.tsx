// @ts-nocheck
import React, { useState } from 'react';
import { X, Building2, Mail, MapPin, Users, Hash, Globe } from 'lucide-react';

const AddDisCoModal = ({ 
  isOpen, 
  onClose, 
  onSubmit 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    email: '',
    region: '',
    address: '',
    meterCount: '',
    customerCount: '',
    status: 'active'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Company name is required';
    }

    if (!formData.code.trim()) {
      newErrors.code = 'Company code is required';
    } else if (formData.code.length < 2) {
      newErrors.code = 'Code must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.region.trim()) {
      newErrors.region = 'Region is required';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!formData.meterCount || formData.meterCount < 0) {
      newErrors.meterCount = 'Please enter a valid meter count';
    }

    if (!formData.customerCount || formData.customerCount < 0) {
      newErrors.customerCount = 'Please enter a valid customer count';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const newDisco = {
        id: Date.now(), // Simple ID generation - you might want to use a better method
        ...formData,
        meterCount: parseInt(formData.meterCount),
        customerCount: parseInt(formData.customerCount),
        createdAt: new Date().toISOString()
      };

      await onSubmit(newDisco);
      
      // Reset form
      setFormData({
        name: '',
        code: '',
        email: '',
        region: '',
        address: '',
        meterCount: '',
        customerCount: '',
        status: 'active'
      });
      
      onClose();
    } catch (error) {
      console.error('Error adding DisCo:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      code: '',
      email: '',
      region: '',
      address: '',
      meterCount: '',
      customerCount: '',
      status: 'active'
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 w-full max-w-2xl max-h-screen overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Building2 className="w-6 h-6 text-emerald-400" />
            <h2 className="text-2xl font-bold text-white">Register New DisCo</h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Company Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Building2 className="w-4 h-4 inline mr-2" />
                Company Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 bg-gray-700 text-white rounded-lg border ${
                  errors.name ? 'border-red-500' : 'border-gray-600'
                } focus:border-emerald-400 focus:outline-none`}
                placeholder="e.g., Abuja Electricity Distribution Company"
              />
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Company Code */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Hash className="w-4 h-4 inline mr-2" />
                Company Code *
              </label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 bg-gray-700 text-white rounded-lg border ${
                  errors.code ? 'border-red-500' : 'border-gray-600'
                } focus:border-emerald-400 focus:outline-none`}
                placeholder="e.g., AEDC"
                maxLength="10"
              />
              {errors.code && <p className="text-red-400 text-xs mt-1">{errors.code}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 bg-gray-700 text-white rounded-lg border ${
                  errors.email ? 'border-red-500' : 'border-gray-600'
                } focus:border-emerald-400 focus:outline-none`}
                placeholder="contact@company.com"
              />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Region */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Globe className="w-4 h-4 inline mr-2" />
                Region *
              </label>
              <select
                name="region"
                value={formData.region}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 bg-gray-700 text-white rounded-lg border ${
                  errors.region ? 'border-red-500' : 'border-gray-600'
                } focus:border-emerald-400 focus:outline-none`}
              >
                <option value="">Select Region</option>
                <option value="North Central">North Central</option>
                <option value="North East">North East</option>
                <option value="North West">North West</option>
                <option value="South East">South East</option>
                <option value="South South">South South</option>
                <option value="South West">South West</option>
              </select>
              {errors.region && <p className="text-red-400 text-xs mt-1">{errors.region}</p>}
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <MapPin className="w-4 h-4 inline mr-2" />
              Address *
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              rows="3"
              className={`w-full px-3 py-2 bg-gray-700 text-white rounded-lg border ${
                errors.address ? 'border-red-500' : 'border-gray-600'
              } focus:border-emerald-400 focus:outline-none resize-none`}
              placeholder="Enter complete address"
            />
            {errors.address && <p className="text-red-400 text-xs mt-1">{errors.address}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Meter Count */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Hash className="w-4 h-4 inline mr-2" />
                Meter Count *
              </label>
              <input
                type="number"
                name="meterCount"
                value={formData.meterCount}
                onChange={handleInputChange}
                min="0"
                className={`w-full px-3 py-2 bg-gray-700 text-white rounded-lg border ${
                  errors.meterCount ? 'border-red-500' : 'border-gray-600'
                } focus:border-emerald-400 focus:outline-none`}
                placeholder="0"
              />
              {errors.meterCount && <p className="text-red-400 text-xs mt-1">{errors.meterCount}</p>}
            </div>

            {/* Customer Count */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Users className="w-4 h-4 inline mr-2" />
                Customer Count *
              </label>
              <input
                type="number"
                name="customerCount"
                value={formData.customerCount}
                onChange={handleInputChange}
                min="0"
                className={`w-full px-3 py-2 bg-gray-700 text-white rounded-lg border ${
                  errors.customerCount ? 'border-red-500' : 'border-gray-600'
                } focus:border-emerald-400 focus:outline-none`}
                placeholder="0"
              />
              {errors.customerCount && <p className="text-red-400 text-xs mt-1">{errors.customerCount}</p>}
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-emerald-400 focus:outline-none"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-700">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-300 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2 ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Adding...</span>
                </>
              ) : (
                <>
                  <Building2 className="w-4 h-4" />
                  <span>Add DisCo</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddDisCoModal;