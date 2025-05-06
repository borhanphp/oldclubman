"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import OldInput from '@/components/custom/OldInput';
import OldSelect from '@/components/custom/OldSelect';
import api from '@/helpers/axios';
import errorResponse from '@/utility';

const BasicInformation = () => {
  const [formData, setFormData] = useState({
    fname: '',
    middle_name: '',
    last_name: '',
    display_name: '',
    username: '',
    email: '',
    dob: '',
    nationality: '',
    phone_code: '',
    contact_no: '',
    id_no_type: '',
    id_no: '',
    address_line_1: '',
    address_line_2: '',
    current_country_id: '',
    current_state_id: '',
    from_country_id: '',
    from_state_id: '',
    from_city_id: '',
    zip_code: '',
    marital_status: '',
    designation: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  
  // Fetch user data on component mount
  useEffect(() => {
    fetchUserData();
    fetchCountries();
  }, []);
  
  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/client/profile');
      
      if (response.data && response.data.data) {
        const userData = response.data.data;
        setFormData({
          fname: userData.fname || '',
          middle_name: userData.middle_name || '',
          last_name: userData.last_name || '',
          display_name: userData.display_name || '',
          username: userData.username || '',
          email: userData.email || '',
          dob: userData.dob || '',
          nationality: userData.nationality || '',
          phone_code: userData.phone_code || '',
          contact_no: userData.contact_no || '',
          id_no_type: userData.id_no_type || '',
          id_no: userData.id_no || '',
          address_line_1: userData.address_line_1 || '',
          address_line_2: userData.address_line_2 || '',
          current_country_id: userData.current_country_id || '',
          current_state_id: userData.current_state_id || '',
          from_country_id: userData.from_country_id || '',
          from_state_id: userData.from_state_id || '',
          from_city_id: userData.from_city_id || '',
          zip_code: userData.zip_code || '',
          marital_status: userData.marital_status || '',
          designation: userData.designation || ''
        });
        
        // Fetch states related to the selected countries
        if (userData.current_country_id) {
          fetchStates(userData.current_country_id);
        }
        if (userData.from_country_id) {
          fetchStates(userData.from_country_id, 'from');
        }
        
        // Fetch cities for the selected state
        if (userData.from_state_id) {
          fetchCities(userData.from_state_id);
        }
      }
    } catch (error) {
      errorResponse(error);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchCountries = async () => {
    try {
      const response = await api.get('/api/countries');
      if (response.data && response.data.data) {
        const countryOptions = response.data.data.map(country => ({
          value: country.id.toString(),
          label: country.name
        }));
        setCountries(countryOptions);
      }
    } catch (error) {
      errorResponse(error);
    }
  };
  
  const fetchStates = async (countryId, type = 'current') => {
    try {
      const response = await api.get(`/api/states/${countryId}`);
      if (response.data && response.data.data) {
        const stateOptions = response.data.data.map(state => ({
          value: state.id.toString(),
          label: state.name
        }));
        setStates(prev => ({
          ...prev,
          [type]: stateOptions
        }));
      }
    } catch (error) {
      errorResponse(error);
    }
  };
  
  const fetchCities = async (stateId) => {
    try {
      const response = await api.get(`/api/cities/${stateId}`);
      if (response.data && response.data.data) {
        const cityOptions = response.data.data.map(city => ({
          value: city.id.toString(),
          label: city.name
        }));
        setCities(cityOptions);
      }
    } catch (error) {
      errorResponse(error);
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Handle dependent dropdowns
    if (name === 'current_country_id') {
      fetchStates(value, 'current');
    } else if (name === 'from_country_id') {
      fetchStates(value, 'from');
      // Reset dependent fields
      setFormData(prev => ({
        ...prev,
        from_state_id: '',
        from_city_id: ''
      }));
    } else if (name === 'from_state_id') {
      fetchCities(value);
      // Reset city field
      setFormData(prev => ({
        ...prev,
        from_city_id: ''
      }));
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await api.post('/client/save_profile', formData);
      if (response.data) {
        toast.success('Profile updated successfully');
      }
    } catch (error) {
      errorResponse(error);
    } finally {
      setLoading(false);
    }
  };
  
  // ID type options
  const idTypeOptions = [
    { value: 'passport', label: 'Passport' },
    { value: 'national_id', label: 'National ID' },
    { value: 'driving_license', label: 'Driving License' }
  ];
  
  // Marital status options
  const maritalStatusOptions = [
    { value: 'single', label: 'Single' },
    { value: 'married', label: 'Married' },
    { value: 'divorced', label: 'Divorced' },
    { value: 'widowed', label: 'Widowed' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-8">Basic Information</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <OldInput
            label="First name"
              type="text"
              name="fname"
              value={formData.fname}
              onChange={handleInputChange}
              placeholder="First name"
              className="w-full"
            />
          </div>
          
          <div>
           
            <OldInput
            label="Middle name"
              type="text"
              name="middle_name"
              value={formData.middle_name}
              onChange={handleInputChange}
              placeholder="Middle name"
              className="w-full"
            />
          </div>
          
          <div>
            <OldInput
            label="Last name"
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleInputChange}
              placeholder="Last name"
              className="w-full"
            />
          </div>
        </div>
        
        <div className="mb-6">
          <OldInput
            label="Display name"
            type="text"
            name="display_name"
            value={formData.display_name}
            onChange={handleInputChange}
            placeholder="Display name"
            className="w-full"
          />
        </div>
        
        <div className="mb-6">
          <OldInput
            label="User name"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            placeholder="Username"
            className="w-full"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <OldInput
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email address"
              className="w-full"
            />
          </div>
          
          <div>
            <div className="relative">
              <OldInput
                label="Date of Birth"
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleInputChange}
                placeholder="YYYY-MM-DD"
                className="w-full"
              />
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <OldInput
              label="Nationality"
              type="text"
              name="nationality"
              value={formData.nationality}
              onChange={handleInputChange}
              placeholder="Nationality"
              className="w-full"
            />
          </div>
          
          <div>
            <OldInput
              label="Country Code"
              type="text"
              name="phone_code"
              value={formData.phone_code}
              onChange={handleInputChange}
              placeholder="+1"
              className="w-full"
            />
          </div>
          
          <div>
            <OldInput
              label="Contact"
              type="text"
              name="contact_no"
              value={formData.contact_no}
              onChange={handleInputChange}
              placeholder="Phone number"
              className="w-full"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <OldSelect
              label="Photo ID Type"
              name="id_no_type"
              value={formData.id_no_type}
              onChange={handleInputChange}
              options={idTypeOptions}
              placeholder="Select ID Type"
              className="w-full"
            />
          </div>
          
          <div>
            <OldInput
              label="Photo ID Number"
              type="text"
              name="id_no"
              value={formData.id_no}
              onChange={handleInputChange}
              placeholder="ID Number"
              className="w-full"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <OldInput
              label="Address Line 1"
              type="text"
              name="address_line_1"
              value={formData.address_line_1}
              onChange={handleInputChange}
              placeholder="Address Line 1"
              className="w-full"
            />
          </div>
          
          <div>
            <OldInput
              label="Address Line 2"
              type="text"
              name="address_line_2"
              value={formData.address_line_2}
              onChange={handleInputChange}
              placeholder="Address Line 2"
              className="w-full"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <OldSelect
              label="Current Country"
              name="current_country_id"
              value={formData.current_country_id}
              onChange={handleInputChange}
              options={countries}
              placeholder="Select Country"
              className="w-full"
            />
          </div>
          
          <div>
            <OldSelect
              label="Current State"
              name="current_state_id"
              value={formData.current_state_id}
              onChange={handleInputChange}
              options={states.current || []}
              placeholder="Select State"
              className="w-full"
            />
          </div>
          
          <div>
            <OldInput
              label="Zip Code"
              type="text"
              name="zip_code"
              value={formData.zip_code}
              onChange={handleInputChange}
              placeholder="Zip Code"
              className="w-full"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <OldSelect
              label="From Country"
              name="from_country_id"
              value={formData.from_country_id}
              onChange={handleInputChange}
              options={countries}
              placeholder="Select Country"
              className="w-full"
            />
          </div>
          
          <div>
            <OldSelect
              label="From State"
              name="from_state_id"
              value={formData.from_state_id}
              onChange={handleInputChange}
              options={states.from || []}
              placeholder="Select State"
              className="w-full"
            />
          </div>
          
          <div>
            <OldSelect
              label="From City"
              name="from_city_id"
              value={formData.from_city_id}
              onChange={handleInputChange}
              options={cities}
              placeholder="Select City"
              className="w-full"
            />
          </div>
        </div>
        
       
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <OldSelect
              label="Marital Status"
              name="marital_status"
              value={formData.marital_status}
              onChange={handleInputChange}
              options={maritalStatusOptions}
              placeholder="Select Marital Status"
              className="w-full"
            />
          </div>
          
          <div>
            <OldInput
              label="Designation"
              type="text"
              name="designation"
              value={formData.designation}
              onChange={handleInputChange}
              placeholder="Designation"
              className="w-full"
            />
          </div>
        </div>
        
        <div className="mt-8">
          <button 
            type="submit" 
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BasicInformation;
