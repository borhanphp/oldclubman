"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import OldInput from "@/components/custom/OldInput";
import OldSelect from "@/components/custom/OldSelect";
import api from "@/helpers/axios";
import errorResponse from "@/utility";
import { useDispatch, useSelector } from "react-redux";
import { bindProfileData, getMyProfile, storeBsicInformation } from "../store";

const BasicInformation = () => {
  const { profileData, loading } = useSelector(({ settings }) => settings);
  const dispatch = useDispatch();

  const {
    fname,
    middle_name,
    last_name,
    display_name,
    username,
    email,
    dob,
    gender,
    nationality,
    phone_code,
    contact_no,
    id_no_type,
    id_no,
    address_line_1,
    address_line_2,
    current_country_id,
    current_state_id,
    from_country_id,
    from_state_id,
    from_city_id,
    zip_code,
    marital_status,
    designation,
    blood_group,
    is_blood_donor,
    is_spouse_need
  } = profileData;

  console.log('profileData from basick form',profileData)

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  // Fetch user data on component mount
  useEffect(() => {
    dispatch(getMyProfile());
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      const response = await api.get(
        `${process.env.NEXT_PUBLIC_API_URL}/location/country`
      );
      if (response.data && response.data.data) {
        const countryOptions = response.data.data.map((country) => ({
          value: country.id.toString(),
          label: country.name,
        }));
        setCountries(countryOptions);
      }
    } catch (error) {
      errorResponse(error);
    }
  };

  const fetchStates = async (countryId, type = "current") => {
    try {
      const response = await api.get(
        `${process.env.NEXT_PUBLIC_API_URL}/location/state?country_id=${countryId}`
      );
      if (response.data && response.data.data) {
        const stateOptions = response.data.data.map((state) => ({
          value: state.id.toString(),
          label: state.name,
        }));
        setStates((prev) => ({
          ...prev,
          [type]: stateOptions,
        }));
      }
    } catch (error) {
      errorResponse(error);
    }
  };

  const fetchCities = async (stateId) => {
    try {
      const response = await api.get(
        `${process.env.NEXT_PUBLIC_API_URL}/location/city?state_id=${stateId}`
      );
      if (response.data && response.data.data) {
        const cityOptions = response.data.data.map((city) => ({
          value: city.id.toString(),
          label: city.name,
        }));
        setCities(cityOptions);
      }
    } catch (error) {
      errorResponse(error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;
    dispatch(bindProfileData({ ...profileData, [name]: inputValue }));

    // Handle dependent dropdowns
    if (name === "current_country_id") {
      fetchStates(value, "current");
    } else if (name === "from_country_id") {
      fetchStates(value, "from");
      dispatch(
        bindProfileData({
          ...profileData,
          from_country_id: value,
          from_state_id: "",
          from_city_id: "",
        })
      );
    } else if (name === "from_state_id") {
      fetchCities(value);
      dispatch(
        bindProfileData({
          ...profileData,
          from_city_id: "",
        })
      );
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const submittedData = {
      ...profileData,
      metas: JSON.stringify(profileData?.metas),
      profile_visibility: profileData?.profile_visibility
    }

    console.log('submittedData', JSON.stringify(submittedData, null, 2))
    try {
      dispatch(storeBsicInformation(submittedData)).then((res) => {
        toast.success("Profile updated successfully");
        dispatch(getMyProfile());
      });
    } catch (error) {
      errorResponse(error);
    }
  };

  // ID type options
  const idTypeOptions = [
    { value: "passport", label: "Passport" },
    { value: "national_id", label: "National ID" },
    { value: "driving_license", label: "Driving License" },
  ];

  // Marital status options
  const maritalStatusOptions = [
    { value: 1, label: "Single" },
    { value: 2, label: "Married" },
    { value: 3, label: "Divorced" },
    { value: 4, label: "Widowed" },
  ];

  const bloodGroupOptions = [
    {
      label: "A+",
      value: "A+",
      "abo_group": "A",
      "rh_factor": "Positive",
      "antigens": ["A", "Rh"],
      "antibodies": ["Anti-B"],
      "description": "Has A and Rh antigens on red cells, with Anti-B antibodies in plasma."
    },
    {
      label: "A-",
      value: "A-",
      "abo_group": "A",
      "rh_factor": "Negative",
      "antigens": ["A"],
      "antibodies": ["Anti-B", "Anti-Rh"],
      "description": "Has A antigens on red cells, with Anti-B and Anti-Rh antibodies in plasma."
    },
    {
      label: "B+",
      value: "B+",
      "abo_group": "B",
      "rh_factor": "Positive",
      "antigens": ["B", "Rh"],
      "antibodies": ["Anti-A"],
      "description": "Has B and Rh antigens on red cells, with Anti-A antibodies in plasma."
    },
    {
      label: "B-",
      value: "B-",
      "abo_group": "B",
      "rh_factor": "Negative",
      "antigens": ["B"],
      "antibodies": ["Anti-A", "Anti-Rh"],
      "description": "Has B antigens on red cells, with Anti-A and Anti-Rh antibodies in plasma."
    },
    {
      label: "AB+",
      value: "AB+",
      "abo_group": "AB",
      "rh_factor": "Positive",
      "antigens": ["A", "B", "Rh"],
      "antibodies": [],
      "description": "Has A, B, and Rh antigens on red cells, with no A or B antibodies in plasma (universal recipient)."
    },
    {
      label: "AB-",
      value: "AB-",
      "abo_group": "AB",
      "rh_factor": "Negative",
      "antigens": ["A", "B"],
      "antibodies": ["Anti-Rh"],
      "description": "Has A and B antigens on red cells, with Anti-Rh antibodies in plasma."
    },
    {
      label: "O+",
      value: "O+",
      "abo_group": "O",
      "rh_factor": "Positive",
      "antigens": ["Rh"],
      "antibodies": ["Anti-A", "Anti-B"],
      "description": "Has Rh antigens on red cells, with Anti-A and Anti-B antibodies in plasma."
    },
    {
      label: "O-",
      value: "O-",
      "abo_group": "O",
      "rh_factor": "Negative",
      "antigens": [],
      "antibodies": ["Anti-A", "Anti-B", "Anti-Rh"],
      "description": "Has no A, B, or Rh antigens on red cells, with Anti-A, Anti-B, and Anti-Rh antibodies in plasma (universal donor)."
    }
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
              value={fname}
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
              value={middle_name}
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
              value={last_name}
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
            value={display_name}
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
            value={username}
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
              value={email}
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
                value={dob}
                onChange={handleInputChange}
                placeholder="YYYY-MM-DD"
                className="w-full"
              />
            </div>
          </div>

          <div>
            <OldSelect
              label="Gender"
              name="gender"
              value={gender}
              onChange={handleInputChange}
              options={[
                { value: 0, label: "Male" },
                { value: 1, label: "Female" },
                { value: 2, label: "Other" },
              ]}
              placeholder="Select Gender"
              className="w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <OldInput
              label="Nationality"
              type="text"
              name="nationality"
              value={nationality}
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
              value={phone_code}
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
              value={contact_no}
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
              value={id_no_type}
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
              value={id_no}
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
              value={address_line_1}
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
              value={address_line_2}
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
              value={current_country_id}
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
              value={current_state_id}
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
              value={zip_code}
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
              value={from_country_id}
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
              value={from_state_id}
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
              value={from_city_id}
              onChange={handleInputChange}
              options={cities}
              placeholder="Select City"
              className="w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <OldSelect
              label="Marital Status"
              name="marital_status"
              value={marital_status}
              onChange={handleInputChange}
              options={maritalStatusOptions}
              placeholder="Select Marital Status"
              className="w-full"
            />
            <div className="mt-1 ml-2">
            <div className="flex items-center space-x-3 mb-4">
              <input
                type="checkbox"
                id="is_spouse_need"
                name="is_spouse_need"
                checked={is_spouse_need || false}
                onChange={handleInputChange}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              />
              <label htmlFor="is_spouse_need" className="text-sm font-medium text-gray-700">
                Searching for spouse
              </label>
            </div>
          </div>
          </div>

          <div>
            <OldSelect
              label="Blood Group"
              name="blood_group"
              value={blood_group}
              onChange={handleInputChange}
              options={bloodGroupOptions}
              placeholder="Select Marital Status"
              className="w-full"
            />
            <div className="mt-1 ml-2">
            <div className="flex items-center space-x-3 mb-4">
              <input
                type="checkbox"
                id="is_blood_donor"
                name="is_blood_donor"
                checked={is_blood_donor || false}
                onChange={handleInputChange}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              />
              <label htmlFor="is_blood_donor" className="text-sm font-medium text-gray-700">
                I am a blood donor
              </label>
            </div>
          </div>
          </div>

          

          <div>
            <OldInput
              label="Designation"
              type="text"
              name="designation"
              value={designation}
              onChange={handleInputChange}
              placeholder="Designation"
              className="w-full"
            />
          </div>
        </div>

        <div className="mt-8">
          <button
            type="submit"
            className="bg-blue-500 cursor-pointer text-white px-6 py-2 rounded-md hover:bg-blue-600 transition"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BasicInformation;
