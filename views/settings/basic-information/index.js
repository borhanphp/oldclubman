"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import OldInput from "@/components/custom/OldInput";
import OldSelect from "@/components/custom/OldSelect";
import api from "@/helpers/axios";
import errorResponse from "@/utility";
import { useDispatch, useSelector } from "react-redux";
import { bindProfileData, getMyProfile, storeBsicInformation, saveEducation, saveWork } from "../store";

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
    is_spouse_need,
    relationship_status,
    pronounce_name,
    current_city,
    employment_name,
    language_name,
    website,
    member_of_group,
    cell_number
  } = profileData;

  console.log('profileData from basick form',profileData)

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  
  // Education form state
  const [educationFormData, setEducationFormData] = useState({
    institution: "",
    degree: "",
    field_of_study: "",
    start_date: "",
    end_date: "",
    description: ""
  });

  // Work form state
  const [workFormData, setWorkFormData] = useState({
    position: "",
    company: "",
    start_date: "",
    end_date: "",
    description: ""
  });

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

  const handleEducationFormChange = (e) => {
    const { name, value } = e.target;
    setEducationFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEducationSave = () => {
    const submittedData = {
      institution: educationFormData?.institution,
      field_of_study: educationFormData?.field_of_study,
      degree: educationFormData?.degree,
      start_date: educationFormData?.start_date,
      end_date: educationFormData?.end_date,
      description: educationFormData?.description,
      status: 1,
    };
    
    dispatch(saveEducation(submittedData))
      .then(() => {
        toast.success("Education saved successfully");
        // Reset form
        setEducationFormData({
          institution: "",
          degree: "",
          field_of_study: "",
          start_date: "",
          end_date: "",
          description: ""
        });
        // Refresh profile data
        dispatch(getMyProfile());
      })
      .catch((error) => {
        errorResponse(error);
      });
  };

  const handleEducationCancel = () => {
    // Reset form
    setEducationFormData({
      institution: "",
      degree: "",
      field_of_study: "",
      start_date: "",
      end_date: "",
      description: ""
    });
  };

  const handleWorkFormChange = (e) => {
    const { name, value } = e.target;
    setWorkFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleWorkSave = () => {
    const submittedData = {
      company_name: workFormData?.company,
      position: workFormData?.position,
      start_date: workFormData?.start_date,
      end_date: workFormData?.end_date,
      description: workFormData?.description,
      status: 1,
    };
    
    dispatch(saveWork(submittedData))
      .then(() => {
        toast.success("Work saved successfully");
        // Reset form
        setWorkFormData({
          position: "",
          company: "",
          start_date: "",
          end_date: "",
          description: ""
        });
        // Refresh profile data
        dispatch(getMyProfile());
      })
      .catch((error) => {
        errorResponse(error);
      });
  };

  const handleWorkCancel = () => {
    // Reset form
    setWorkFormData({
      position: "",
      company: "",
      start_date: "",
      end_date: "",
      description: ""
    });
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

  // Languages options for Languages field
  const languageOptions = [
    { value: "English", label: "English" },
    { value: "Bengali", label: "Bengali" },
    { value: "Hindi", label: "Hindi" },
    { value: "Spanish", label: "Spanish" },
    { value: "Arabic", label: "Arabic" },
    { value: "French", label: "French" },
    { value: "German", label: "German" },
    { value: "Chinese", label: "Chinese" },
    { value: "Japanese", label: "Japanese" },
    { value: "Korean", label: "Korean" },
    { value: "Portuguese", label: "Portuguese" },
    { value: "Russian", label: "Russian" },
    { value: "Urdu", label: "Urdu" },
    { value: "Turkish", label: "Turkish" },
    { value: "Italian", label: "Italian" },
    { value: "Dutch", label: "Dutch" },
    { value: "Indonesian", label: "Indonesian" },
    { value: "Thai", label: "Thai" },
    { value: "Vietnamese", label: "Vietnamese" },
    { value: "Persian", label: "Persian" }
  ];

  // Profession options for Employment field
  const professionOptions = [
    { value: "software_engineer", label: "Software Engineer" },
    { value: "web_developer", label: "Web Developer" },
    { value: "mobile_developer", label: "Mobile App Developer" },
    { value: "data_scientist", label: "Data Scientist" },
    { value: "product_manager", label: "Product Manager" },
    { value: "project_manager", label: "Project Manager" },
    { value: "ui_ux_designer", label: "UI/UX Designer" },
    { value: "graphic_designer", label: "Graphic Designer" },
    { value: "system_admin", label: "System Administrator" },
    { value: "devops_engineer", label: "DevOps Engineer" },
    { value: "qa_engineer", label: "QA/Test Engineer" },
    { value: "network_engineer", label: "Network Engineer" },
    { value: "doctor", label: "Doctor" },
    { value: "nurse", label: "Nurse" },
    { value: "pharmacist", label: "Pharmacist" },
    { value: "dentist", label: "Dentist" },
    { value: "surgeon", label: "Surgeon" },
    { value: "psychologist", label: "Psychologist" },
    { value: "teacher", label: "Teacher" },
    { value: "professor", label: "Professor" },
    { value: "architect", label: "Architect" },
    { value: "civil_engineer", label: "Civil Engineer" },
    { value: "mechanical_engineer", label: "Mechanical Engineer" },
    { value: "electrical_engineer", label: "Electrical Engineer" },
    { value: "banker", label: "Banker" },
    { value: "financial_analyst", label: "Financial Analyst" },
    { value: "accountant", label: "Accountant" },
    { value: "lawyer", label: "Lawyer" },
    { value: "hr_specialist", label: "HR Specialist" },
    { value: "sales_representative", label: "Sales Representative" },
    { value: "marketing_manager", label: "Marketing Manager" },
    { value: "business_analyst", label: "Business Analyst" },
    { value: "entrepreneur", label: "Entrepreneur" },
    { value: "consultant", label: "Consultant" },
    { value: "journalist", label: "Journalist" },
    { value: "writer", label: "Writer" },
    { value: "editor", label: "Editor" },
    { value: "photographer", label: "Photographer" },
    { value: "videographer", label: "Videographer" },
    { value: "pilot", label: "Pilot" },
    { value: "flight_attendant", label: "Flight Attendant" },
    { value: "chef", label: "Chef" },
    { value: "cook", label: "Cook" },
    { value: "driver", label: "Driver" },
    { value: "police_officer", label: "Police Officer" },
    { value: "firefighter", label: "Firefighter" },
    { value: "social_worker", label: "Social Worker" },
    { value: "scientist", label: "Scientist" },
    { value: "researcher", label: "Researcher" },
    { value: "farmer", label: "Farmer" },
    { value: "student", label: "Student" },
    { value: "retired", label: "Retired" },
    { value: "unemployed", label: "Unemployed" },
    { value: "other", label: "Other" }
  ];

  console.log('nationality',nationality)

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

          <div>
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

          <div>
            <OldInput
              label={`User name (Link: oldclubman.com/${username})`}
              type="text"
              name="username"
              value={username}
              onChange={handleInputChange}
              placeholder="Username"
              className="w-full"
            />
          </div>

          <div>
            <OldInput
              label="Pronounces name"
              type="text"
              name="pronounce_name"
              value={pronounce_name}
              onChange={handleInputChange}
              className="w-full"
            />
          </div>

          <div className="">
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

          <div>
            <OldSelect
              label="Sex"
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

          {/* nationality */}
          <div>
            {/* <OldInput
              label="Nationality"
              type="text"
              name="nationality"
              value={nationality}
              onChange={handleInputChange}
              placeholder="Nationality"
              className="w-full"
            /> */}

            <OldSelect
              label="Nationality"
              name="nationality"
              value={nationality}
              onChange={handleInputChange}
              options={countries}
              placeholder=""
              className="w-full"
            />
          </div>

          <div>
            <OldSelect
              label={
                <div className="">
                  <div>
                    <div className="flex items-center space-x-3">
                      Relationship Status{" "}
                      <span className="relative inline-block group">
                        <span className="ml-1 inline-flex h-5 w-5 bg-gray-100 items-center justify-center rounded-full  text-gray-700 text-xs font-semibold hover:cursor-pointer">
                          {"?"}
                        </span>
                        <div className="pointer-events-none absolute z-10 hidden w-72 -translate-x-1/2 rounded-md bg-gray-900 px-3 py-2 text-xs text-white shadow-lg group-hover:block left-1/2 top-6">
                          Your profile will be visible to individuals seeking a
                          long-term friendship or relationship.
                          <span className="absolute -top-1 left-1/2 -translate-x-1/2 h-2 w-2 rotate-45 bg-gray-900"></span>
                        </div>
                      </span>
                      <button
                        type="button"
                        onClick={() => dispatch(bindProfileData({ ...profileData, is_spouse_need: !is_spouse_need }))}
                        role="switch"
                        aria-checked={is_spouse_need ? 'true' : 'false'}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full ${is_spouse_need ? 'bg-blue-600' : 'bg-gray-300'}`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${is_spouse_need ? 'translate-x-6' : 'translate-x-1'}`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              }
              name="marital_status"
              value={marital_status}
              onChange={handleInputChange}
              options={maritalStatusOptions}
              placeholder="Select Marital Status"
              className="w-full"
            />
          </div>

          <div>
            <OldSelect
              label={
                <div className="">
                  <div>
                    <div className="flex items-center space-x-3">
                      Blood Group{" "}
                      <span className="relative inline-block group">
                        <span className="ml-1 bg-gray-100 inline-flex h-5 w-5 items-center justify-center rounded-full  text-gray-700 text-xs font-semibold hover:cursor-pointer">
                          {"?"}
                        </span>
                        <div className="pointer-events-none absolute z-10 hidden w-72 -translate-x-1/2 rounded-md bg-gray-900 px-3 py-2 text-xs text-white shadow-lg group-hover:block left-1/2 top-6">
                          Human for human — together, we can make a difference.
                          If you’d like, you can donate your blood to help save
                          lives. Would you like to register as a blood donor?{" "}
                          <span className="absolute -top-1 left-1/2 -translate-x-1/2 h-2 w-2 rotate-45 bg-gray-900"></span>
                        </div>
                      </span>
                      <button
                        type="button"
                        onClick={() => dispatch(bindProfileData({ ...profileData, is_blood_donor: !is_blood_donor }))}
                        role="switch"
                        aria-checked={is_blood_donor ? 'true' : 'false'}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full ${is_blood_donor ? 'bg-blue-600' : 'bg-gray-300'}`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${is_blood_donor ? 'translate-x-6' : 'translate-x-1'}`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              }
              name="blood_group"
              value={blood_group}
              onChange={handleInputChange}
              options={bloodGroupOptions}
              placeholder="Select Marital Status"
              className="w-full"
            />
          </div>

         

          <div>
            <OldInput
              label="Current City"
              type="text"
              name="current_city"
              value={current_city}
              onChange={handleInputChange}
              placeholder=""
              className="w-full"
            />
          </div>

          <div>
            <OldInput
              label="State/Provinence"
              type="text"
              name="current_city"
              value={current_city}
              onChange={handleInputChange}
              placeholder=""
              className="w-full"
            />
          </div>

          <div>
            <OldSelect
              label="Country of Residence"
              name="current_country_id"
              value={current_country_id}
              onChange={handleInputChange}
              options={countries}
              placeholder="Select Country"
              className="w-full"
            />
          </div>

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

          {/* <div>
            <OldInput
              label="Country Code"
              type="text"
              name="phone_code"
              value={phone_code}
              onChange={handleInputChange}
              placeholder=""
              className="w-full"
            />
          </div> */}
          <div>
            <OldInput
              label="Phone"
              type="text"
              name="contact_no"
              value={contact_no}
              onChange={handleInputChange}
              placeholder="+880"
              className="w-full"
            />
          </div>

          <div>
            <OldInput
              label="Cell"
              type="text"
              name="cell_number"
              value={cell_number}
              onChange={handleInputChange}
              placeholder=""
              className="w-full"
            />
          </div>

          <div>
            <OldSelect
              label="Identity"
              name="id_no_type"
              value={id_no_type}
              onChange={handleInputChange}
              options={idTypeOptions}
              placeholder="Select ID Type"
              className="w-full"
            />
          </div>

          <div>
            <OldSelect
              label="Issuing Authority"
              name="current_country_id"
              value={current_country_id}
              onChange={handleInputChange}
              options={countries}
              placeholder="Select Country"
              className="w-full"
            />
          </div>

          <div>
            <OldInput
              label="ID Number"
              type="text"
              name="id_no"
              value={id_no}
              onChange={handleInputChange}
              placeholder=""
              className="w-full"
            />
          </div>

{/* education section start */}
       
         <div className="col-span-1 md:col-span-3 ">
            <h3 className="text-lg font-semibold mb-4">Add Education</h3>
            <div className="grid-cols-3 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                <OldInput
                  label="Institution"
                  type="text"
                  name="institution"
                  value={educationFormData.institution}
                  onChange={handleEducationFormChange}
                  placeholder="Institution"
                  className="w-full"
                />
                </div>
                <div>
                <OldInput
                  label="Degree"
                  type="text"
                  name="degree"
                  value={educationFormData.degree}
                  onChange={handleEducationFormChange}
                  placeholder="Degree"
                  className="w-full"
                />
                </div>
               <div>
               <OldInput
                  label="Field of Study"
                  type="text"
                  name="field_of_study"
                  value={educationFormData.field_of_study}
                  onChange={handleEducationFormChange}
                  placeholder="Field of Study"
                  className="w-full"
                />
               </div>
               <div>
                  <OldInput
                    label="Start Date"
                    type="date"
                    name="start_date"
                    value={educationFormData.start_date}
                    onChange={handleEducationFormChange}
                    placeholder="mm/dd/yyyy"
                    className="w-full"
                  />
                </div>
                <div>
                  <OldInput
                    label="End Date"
                    type="date"
                    name="end_date"
                    value={educationFormData.end_date}
                    onChange={handleEducationFormChange}
                    placeholder="mm/dd/yyyy"
                    className="w-full"
                  />
                </div>
                <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-600 mb-2">
                  Description
                </label>
                <OldInput
                  name="description"
                  id="description"
                  value={educationFormData.description}
                  onChange={handleEducationFormChange}
                  placeholder="Description"
                  rows={4}
                  className="w-full border border-slate-200 rounded-md px-[1rem] py-[0.3rem] focus:border-[#155DFC] focus:outline-none resize-y"
                />
              </div>
              </div>

             

             

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleEducationSave}
                  className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition cursor-pointer"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={handleEducationCancel}
                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
      
{/* education section end */}
         

         

          {/* work section start here */}
          <div className="col-span-1 md:col-span-3">
            <h3 className="text-lg font-semibold mb-4">Add Work</h3>
            <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <OldInput
                  label="Position"
                  type="text"
                  name="position"
                  value={workFormData.position}
                  onChange={handleWorkFormChange}
                  placeholder="Position"
                  className="w-full"
                />
              </div>

              <div>
                <OldInput
                  label="Company"
                  type="text"
                  name="company"
                  value={workFormData.company}
                  onChange={handleWorkFormChange}
                  placeholder="Company"
                  className="w-full"
                />
              </div>

             
                <div>
                  <OldInput
                    label="Start Date"
                    type="date"
                    name="start_date"
                    value={workFormData.start_date}
                    onChange={handleWorkFormChange}
                    placeholder="mm/dd/yyyy"
                    className="w-full"
                  />
                </div>
                <div>
                  <OldInput
                    label="End Date"
                    type="date"
                    name="end_date"
                    value={workFormData.end_date}
                    onChange={handleWorkFormChange}
                    placeholder="mm/dd/yyyy"
                    className="w-full"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="work_description" className="block text-sm font-medium text-gray-600 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  id="work_description"
                  value={workFormData.description}
                  onChange={handleWorkFormChange}
                  placeholder="Description"
                  rows={4}
                  className="w-full border border-slate-200 rounded-md px-[1rem] py-[0.3rem] focus:border-[#155DFC] focus:outline-none resize-y"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleWorkSave}
                  className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition cursor-pointer"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={handleWorkCancel}
                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
          {/* work section end here */}

        

         

          <div>
            <OldSelect
              label="Employment"
              name="employment_name"
              value={employment_name}
              onChange={handleInputChange}
              options={professionOptions}
              placeholder="Select Profession"
              className="w-full"
            />
          </div>

          <div>
            <OldSelect
              label="Languages"
              name="language_name"
              value={language_name}
              onChange={handleInputChange}
              options={languageOptions}
              placeholder="Select Language"
              className="w-full"
            />
          </div>

          <div>
            <OldSelect
              label="Places lived"
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
              label="Profile Categories"
              name="from_country_id"
              value={from_country_id}
              onChange={handleInputChange}
              options={countries}
              placeholder="Select Country"
              className="w-full"
            />
          </div>

          <div>
            <OldInput
              label="Website"
              type="text"
              name="website"
              value={website}
              onChange={handleInputChange}
              placeholder=""
              className="w-full"
            />
          </div>

          <div>
            <OldInput
              label="Member (Perticuler Group)"
              type="text"
              name="member_of_group"
              value={member_of_group}
              onChange={handleInputChange}
              placeholder=""
              className="w-full"
            />
          </div>

        </div>


        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
         

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

         
        </div> */}

        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
         

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
        </div> */}

        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
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
        </div> */}

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
