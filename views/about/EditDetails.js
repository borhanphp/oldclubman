"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMyProfile, storeBsicInformation } from "../settings/store";
import moment from "moment";
import {
  CiCalendar,
  CiCalendarDate,
  CiHeart,
  CiLocationOn,
  CiMail,
  CiPhone,
  CiStopwatch,
  CiUser,
} from "react-icons/ci";
import toast from "react-hot-toast";

// Utility function to handle image loading with fallbacks
const getImageSrc = (imagePath, fallback = "/common-avator.jpg") => {
  if (!imagePath) return fallback;
  
  // Try different path combinations
  const paths = [
    process.env.NEXT_PUBLIC_CLIENT_FILE_PATH + imagePath,
    `/uploads/client/${imagePath}`,
    `/public/uploads/client/${imagePath}`,
    imagePath.startsWith('http') ? imagePath : null
  ].filter(Boolean);
  
  return paths[0] || fallback;
};

// Image component with error handling
const SafeImage = ({ src, alt, className, fallback = "/common-avator.jpg" }) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallback);
    }
  };

  useEffect(() => {
    setImgSrc(src);
    setHasError(false);
  }, [src]);

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={handleError}
    />
  );
};

const EditDetails = () => {
  const { profile, profileData } = useSelector(({ settings }) => settings);
  const { isPostModalOpen } = useSelector(({ gathering }) => gathering);
  const dispatch = useDispatch();
const workDataForShow = profile.client?.metas?.filter(dd => dd.meta_key === "WORK")
const educationDataShow = profile.client?.metas?.filter(dd => dd.meta_key === "EDUCATION")
const profileDataForShow = profile.client?.metas?.filter(dd => dd.meta_key === "PROFILE")

const [previousWork, setPreviousWork] = useState(workDataForShow[0]?.meta_value);

  
// State for privacy settings
  const [privacySettings, setPrivacySettings] = useState({
    marital_status: true,
    dob: true,
    location: true,
    city: true,
    status: true,
    contact_no: false,
    email: false,
  });

  // State for immediate UI updates
  const [localVisibility, setLocalVisibility] = useState({});

  useEffect(() => {
    dispatch(getMyProfile());
  }, []);

  // Initialize privacy settings from profile data
  useEffect(() => {
    if (profile?.client?.profile_visibility) {
      try {
        const visibilityData = typeof profile.client.profile_visibility === 'string' 
          ? JSON.parse(profile.client.profile_visibility) 
          : profile.client.profile_visibility;
        
        setPrivacySettings(prev => ({
          ...prev,
          ...visibilityData
        }));
      } catch (error) {
        console.error('Error parsing profile visibility:', error);
      }
    }
  }, [profile]);

  // Handle privacy toggle
  const handlePrivacyToggle = (field) => {
    // Get current profile visibility data
    let currentVisibility = {};
    if (profile?.client?.profile_visibility) {
      try {
        currentVisibility = typeof profile.client.profile_visibility === 'string' 
          ? JSON.parse(profile.client.profile_visibility) 
          : profile.client.profile_visibility;
      } catch (error) {
        console.error('Error parsing profile visibility:', error);
        currentVisibility = {};
      }
    }

    // Toggle the specific field
    const newVisibility = {
      ...currentVisibility,
      [field]: currentVisibility[field] === 'public' ? 'private' : 'public'
    };

    // Update local state
    setPrivacySettings(prev => ({
      ...prev,
      [field]: newVisibility[field] === 'public'
    }));

    // Update local visibility for immediate UI update
    setLocalVisibility(prev => ({
      ...prev,
      [field]: newVisibility[field]
    }));

    // Send to backend
    dispatch(storeBsicInformation({
      ...profileData,
      metas: JSON.stringify(profileData?.metas),
      profile_visibility: JSON.stringify(newVisibility)
    }))
    .then(() => {
    dispatch(getMyProfile());
    toast.success("Updated")
    })
  };

  const OverViewBlock = (props) => {
    const { icon, title, value, field, visibility } = props;
    
    // Use local visibility for immediate updates, then props, then fallback to privacySettings
    const isPublic = localVisibility[field] !== undefined 
      ? localVisibility[field] === 'public' 
      : (visibility !== undefined ? visibility === 'public' : privacySettings[field]);
    

    return (
      <>
        <div className="bg-white rounded-lg p-4 mb-3">
          <div className="flex items-center">
            {/* Privacy Toggle - Positioned to the left */}
            <div className="flex items-center mr-4">
              <button
                onClick={() => handlePrivacyToggle(field)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  isPublic ? "bg-blue-600" : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isPublic ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Content */}
            <div className="flex items-center min-w-0 flex-1">
              <span className="mr-3">{icon}</span>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 min-w-0">
                <div className="text-sm text-gray-500 flex-shrink-0">
                  {title}:
                </div>
                <div className="text-sm text-gray-700 font-medium truncate">
                  {value}
                </div>
              </div>
            </div>

            {/* Edit Icon - Pencil icon like in work section */}
            {/* <button className="text-gray-400 ml-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button> */}
          </div>
        </div>
      </>
    );
  };

  // Work Section Component
  const WorkSection = () => {
    const [workEntries, setWorkEntries] = useState([]);
    const [isAddingWork, setIsAddingWork] = useState(false);
    const [editingWorkId, setEditingWorkId] = useState(null);
    const [workFormData, setWorkFormData] = useState({
      id: "",
      title: "",
      company: "",
      position: "",
      start_date: "",
      end_date: "",
      description: "",
      gender: ""
    });

    const handleWorkPrivacyToggle = (id) => {
      // Get current work data from profile
      const currentWorkData = workDataForShow && workDataForShow.length > 0 ? workDataForShow[0] : null;
      if (!currentWorkData) return;

      let workEntries = [];
      try {
        workEntries = typeof currentWorkData.meta_value === 'string' 
          ? JSON.parse(currentWorkData.meta_value) 
          : currentWorkData.meta_value || [];
      } catch (error) {
        console.error('Error parsing work data:', error);
        return;
      }
      

      // Update the specific work entry's status
      const updatedWorkEntries = workEntries.map(work => {
        if (work.id === id) {
          const currentStatus = work.status || 'public';
          return {
            ...work,
            status: currentStatus === 'public' ? 'private' : 'public'
          };
        }
        return work;
      });


      // Save updated data to backend
      const metas = [
        {
          meta_key: 'WORK',
          meta_value: JSON.stringify(updatedWorkEntries),

          meta_status: '1'
        }
      ];

      const saveData = {
        ...profileData,
        metas: JSON.stringify(metas).replace(/"/g, "'"),
        profile_visibility: profileData?.profile_visibility
      };



      dispatch(storeBsicInformation(saveData))
        .then(() => {
          dispatch(getMyProfile());
          toast.success("Work privacy updated");
        });
    };

    const handleAddWork = () => {
      const workId = `work_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      setIsAddingWork(true);
      setWorkFormData({
        id: workId,
        title: "",
        company: "",
        position: "",
        start_date: "",
        end_date: "",
        description: ""
      });
    };

    const handleEditWork = (work) => {
      const workId = editingWorkId || `work_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      setEditingWorkId(work.id);
      setWorkFormData({
        id: workId,
        title: work.title || "",
        company: work.company || "",
        position: work.position || "",
        start_date: work.start_date || "",
        end_date: work.end_date || "",
        description: work.description || ""
      });
    };

    const handleSaveWork = () => {
      // Generate unique ID for new work or use existing ID for editing
      const workId = editingWorkId || `work_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const newWork = {
        id: workId,
        ...workFormData,
        status: 'public' // Add status property with default 'public'
      };

      // Get current work entries from profile
      let currentWorkEntries = [];
      if (workDataForShow && workDataForShow.length > 0) {
        try {
          currentWorkEntries = typeof workDataForShow[0].meta_value === 'string' 
            ? JSON.parse(workDataForShow[0].meta_value) 
            : workDataForShow[0].meta_value || [];
        } catch (error) {
          console.error('Error parsing current work data:', error);
          currentWorkEntries = [];
        }
      }

      let updatedWorkEntries;
      if (editingWorkId) {
        // Update existing work
        updatedWorkEntries = currentWorkEntries.map(work => 
          work.id === editingWorkId ? newWork : work
        );
      } else {
        // Add new work
        updatedWorkEntries = [...currentWorkEntries, newWork];
      }

      // Save to backend using metas structure
      const metas = [
        {
          meta_key: 'WORK',
          meta_value: JSON.stringify(updatedWorkEntries),
          meta_status: '1'
        }
      ];

      // Include profile_visibility with the metas data
      const saveData = {
        ...profileData,
        metas: JSON.stringify(metas).replace(/"/g, "'"),
        profile_visibility: profileData?.profile_visibility
      };
      console.log('saveData', JSON.stringify(saveData, null, 2))

      dispatch(storeBsicInformation(saveData))
      .then(() => {
        dispatch(getMyProfile());
        toast.success("Updated")
        })

      // Reset form
      setIsAddingWork(false);
      setEditingWorkId(null);
      setWorkFormData({
        id: "",
        title: "",
        company: "",
        position: "",
        start_date: "",
        end_date: "",
        description: ""
      });
    };

    const handleCancelWork = () => {
      setIsAddingWork(false);
      setEditingWorkId(null);
      setWorkFormData({
        id: "",
        title: "",
        company: "",
        position: "",
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

    const handleDeleteWork = (data, id) => {
      // Remove the work entry with the specified ID
      const updatedWorkEntries = data?.filter(work => work.id !== id);
      setWorkEntries(updatedWorkEntries);
      
      // Save updated data to backend
      const metas = [
        {
          meta_key: 'WORK',
          meta_value: updatedWorkEntries,
          meta_value: JSON.stringify(updatedWorkEntries),

          meta_status: '1'
        }
      ];

      const saveData = {
        ...profileData,
        metas: JSON.stringify(metas).replace(/"/g, "'"),
        profile_visibility: profileData?.profile_visibility
      };


      dispatch(storeBsicInformation(saveData))
        .then(() => {
          dispatch(getMyProfile());
          toast.success("Work entry deleted");
        });
    };

    return (
      <div className="bg-white rounded-lg border border-gray-100 p-4 mb-4 ">
        <h4 className="text-base font-bold text-gray-800 mb-4">WORK</h4>

        {/* Display work entries in clean design */}
        {workDataForShow && workDataForShow.length > 0 && workDataForShow.map((workData, index) => {
          const workEntries = typeof workData.meta_value === 'string' 
            ? JSON.parse(workData.meta_value) 
            : workData.meta_value || [];
          
          return Array.isArray(workEntries) ? workEntries.map((entry, entryIndex) => {
            // Use the actual entry ID, or generate one if it doesn't exist
            const uniqueId = entry.id || `work_${index}_${entryIndex}_${Date.now()}`;
            
            
            return (
              <div key={uniqueId} className="flex items-center mb-3 last:mb-0">
                {/* Privacy Toggle */}
                <div className="flex items-center mr-4">
                  <button
                    onClick={() => handleWorkPrivacyToggle(entry.id || uniqueId)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      (entry.status || 'public') === 'public' ? "bg-blue-600" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        (entry.status || 'public') === 'public' ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                {/* Work Title and Company */}
                <div className="flex-1 text-sm text-gray-700">
                  {entry.position && entry.company 
                    ? `${entry.position} at ${entry.company}`
                    : entry.title || entry.position || 'Work Entry'
                  }
                </div>

                {/* Edit Icon */}
                <button 
                  className="text-gray-400 ml-2 hover:text-gray-600"
                  onClick={() => handleEditWork({...entry, id: entry.id || uniqueId})}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>

                {/* Delete Icon */}
                <button 
                  className="text-red-400 ml-2 hover:text-red-600"
                  onClick={() => handleDeleteWork(workEntries, entry.id || uniqueId)}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            );
          }) : null;
        })}

        {/* Show message when no work data */}
        {(!workDataForShow || workDataForShow.length === 0) && (
          <div className="text-gray-500 text-sm py-2">No work data found</div>
        )}

      

        {/* Add/Edit Work Form */}
        {(isAddingWork || editingWorkId) && (
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h5 className="font-semibold mb-3">
              {editingWorkId ? 'Edit Work' : 'Add Work'}
            </h5>
            <div className="space-y-3">
              <input
                type="text"
                name="position"
                placeholder="Position"
                value={workFormData.position}
                onChange={handleWorkFormChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <input
                type="text"
                name="company"
                placeholder="Company"
                value={workFormData.company}
                onChange={handleWorkFormChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  name="start_date"
                  placeholder="Start Date"
                  value={workFormData.start_date}
                  onChange={handleWorkFormChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                <input
                  type="date"
                  name="end_date"
                  placeholder="End Date"
                  value={workFormData.end_date}
                  onChange={handleWorkFormChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <textarea
                name="description"
                placeholder="Description"
                value={workFormData.description}
                onChange={handleWorkFormChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                rows="3"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSaveWork}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                > 
                  Save
                </button>
                <button
                  onClick={handleCancelWork}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Workplace Button */}
        {!isAddingWork && !editingWorkId && (
          <div className="flex items-center mt-4">
            <button 
              className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
              onClick={handleAddWork}
            >
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
              <span className="text-sm font-medium">Add a workplace</span>
            </button>
          </div>
        )}
      </div>
    );
  };

  const EducationSection = () => {
    const [educationEntries, setEducationEntries] = useState([]);
    const [isAddingEducation, setIsAddingEducation] = useState(false);
    const [editingEducationId, setEditingEducationId] = useState(null);
    const [educationFormData, setEducationFormData] = useState({
      id: "",
      title: "",
      institution: "",
      degree: "",
      field_of_study: "",
      start_date: "",
      end_date: "",
      description: ""
    });

    const handleEducationPrivacyToggle = (id) => {
      // Get current education data from profile
      const currentEducationData = educationDataShow && educationDataShow.length > 0 ? educationDataShow[0] : null;
      if (!currentEducationData) return;

      let educationEntries = [];
      try {
        educationEntries = typeof currentEducationData.meta_value === 'string' 
          ? JSON.parse(currentEducationData.meta_value) 
          : currentEducationData.meta_value || [];
      } catch (error) {
        console.error('Error parsing education data:', error);
        return;
      }

      // Update the specific education entry's status
      const updatedEducationEntries = educationEntries.map(education => {
        if (education.id === id) {
          const currentStatus = education.status || 'public';
          return {
            ...education,
            status: currentStatus === 'public' ? 'private' : 'public'
          };
        }
        return education;
      });

      // Save updated data to backend
      const metas = [
        {
          meta_key: 'EDUCATION',
          meta_value: JSON.stringify(updatedEducationEntries),

          meta_status: '1'
        }
      ];

      const saveData = {
        ...profileData,
        metas: JSON.stringify(metas).replace(/"/g, "'"),
        profile_visibility: profileData?.profile_visibility
      };

      dispatch(storeBsicInformation(saveData))
        .then(() => {
          dispatch(getMyProfile());
          toast.success("Education privacy updated");
        });
    };

    const handleAddEducation = () => {
      const educationId = `education_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      setIsAddingEducation(true);
      setEducationFormData({
        id: educationId,
        title: "",
        institution: "",
        degree: "",
        field_of_study: "",
        start_date: "",
        end_date: "",
        description: ""
      });
    };

    const handleEditEducation = (education) => {
      const educationId = editingEducationId || `education_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      setEditingEducationId(education.id);
      setEducationFormData({
        id: educationId,
        title: education.title || "",
        institution: education.institution || "",
        degree: education.degree || "",
        field_of_study: education.field_of_study || "",
        start_date: education.start_date || "",
        end_date: education.end_date || "",
        description: education.description || ""
      });
    };

    const handleSaveEducation = () => {
      // Generate unique ID for new education or use existing ID for editing
      const educationId = editingEducationId || `education_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const newEducation = {
        id: educationId,
        ...educationFormData,
        status: 'public' // Add status property with default 'public'
      };

      // Get current education entries from profile
      let currentEducationEntries = [];
      if (educationDataShow && educationDataShow.length > 0) {
        try {
          currentEducationEntries = typeof educationDataShow[0].meta_value === 'string' 
            ? JSON.parse(educationDataShow[0].meta_value) 
            : educationDataShow[0].meta_value || [];
        } catch (error) {
          console.error('Error parsing current education data:', error);
          currentEducationEntries = [];
        }
      }

      let updatedEducationEntries;
      if (editingEducationId) {
        // Update existing education
        updatedEducationEntries = currentEducationEntries.map(education => 
          education.id === editingEducationId ? newEducation : education
        );
      } else {
        // Add new education
        updatedEducationEntries = [...currentEducationEntries, newEducation];
      }

      // Save to backend using metas structure
      const metas = [
        {
          meta_key: 'EDUCATION',
          meta_value: JSON.stringify(updatedEducationEntries),

          meta_status: '1'
        }
      ];

      // Include profile_visibility with the metas data
      const saveData = {
        ...profileData,
        metas: JSON.stringify(metas).replace(/"/g, "'"),
        profile_visibility: profileData?.profile_visibility
      };

      dispatch(storeBsicInformation(saveData))
      .then(() => {
        dispatch(getMyProfile());
        toast.success("Updated")
        })

      // Reset form
      setIsAddingEducation(false);
      setEditingEducationId(null);
      setEducationFormData({
        id: "",
        title: "",
        institution: "",
        degree: "",
        field_of_study: "",
        start_date: "",
        end_date: "",
        description: ""
      });
    };

    const handleCancelEducation = () => {
      setIsAddingEducation(false);
      setEditingEducationId(null);
      setEducationFormData({
      id: "",
        title: "",
        institution: "",
        degree: "",
        field_of_study: "",
        start_date: "",
        end_date: "",
        description: ""
      });
    };

    const handleEducationFormChange = (e) => {
      const { name, value } = e.target;
      setEducationFormData(prev => ({
        ...prev,
        [name]: value
      }));
    };

    const handleDeleteEducation = (data, id) => {
      // Remove the education entry with the specified ID
      const updatedEducationEntries = data?.filter(education => education.id !== id);
      setEducationEntries(updatedEducationEntries);
      
      // Save updated data to backend
      const metas = [
        {
          meta_key: 'EDUCATION',
          meta_value: JSON.stringify(updatedEducationEntries),

          meta_status: '1'
        }
      ];


      const saveData = {
        ...profileData,
        metas: JSON.stringify(metas).replace(/"/g, "'"),
        profile_visibility: profileData?.profile_visibility
      };

      dispatch(storeBsicInformation(saveData))
        .then(() => {
          dispatch(getMyProfile());
          toast.success("Education entry deleted");
        });
    };

    return (
      <div className="bg-white rounded-lg border border-gray-100 p-4 mb-4">
        <h4 className="text-base font-bold text-gray-800 mb-4">EDUCATION</h4>

        {/* Display education entries in clean design */}
        {educationDataShow && educationDataShow.length > 0 && educationDataShow.map((educationData, index) => {
          let educationEntries = [];
          
          try {
            if (typeof educationData.meta_value === 'string') {
              educationEntries = JSON.parse(educationData.meta_value);
            } else if (Array.isArray(educationData.meta_value)) {
              educationEntries = educationData.meta_value;
            } else if (educationData.meta_value) {
              educationEntries = [educationData.meta_value];
            }
          } catch (error) {
            console.error('Error parsing education data:', error);
            educationEntries = [];
          }
          
          
          return Array.isArray(educationEntries) ? educationEntries.map((entry, entryIndex) => {
            // Use the actual entry ID, or generate one if it doesn't exist
            const uniqueId = entry.id || `education_${index}_${entryIndex}_${Date.now()}`;
            
            
            return (
              <div key={uniqueId} className="flex items-center mb-3 last:mb-0">
                {/* Privacy Toggle */}
                <div className="flex items-center mr-4">
                  <button
                    onClick={() => handleEducationPrivacyToggle(entry.id || uniqueId)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      (entry.status || 'public') === 'public' ? "bg-blue-600" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        (entry.status || 'public') === 'public' ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                {/* Education Title and Institution */}
                <div className="flex-1 text-sm text-gray-700">
                  {entry.degree && entry.institution 
                    ? `${entry.degree} at ${entry.institution}`
                    : entry.title || entry.degree || entry.institution || 'Education Entry'
                  }
                </div>

                {/* Edit Icon */}
                <button 
                  className="text-gray-400 ml-2 hover:text-gray-600"
                  onClick={() => handleEditEducation({...entry, id: entry.id || uniqueId})}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>

                {/* Delete Icon */}
                <button 
                  className="text-red-400 ml-2 hover:text-red-600"
                  onClick={() => handleDeleteEducation(educationEntries, entry.id || uniqueId)}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            );
          }) : null;
        })}

        {/* Show message when no education data */}
        {(!educationDataShow || educationDataShow.length === 0) && (
          <div className="text-gray-500 text-sm py-2">No education data found</div>
        )}

       

       

        {/* Add/Edit Education Form */}
        {(isAddingEducation || editingEducationId) && (
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h5 className="font-semibold mb-3">
              {editingEducationId ? 'Edit Education' : 'Add Education'}
            </h5>
            <div className="space-y-3">
              <input
                type="text"
                name="institution"
                placeholder="Institution"
                value={educationFormData.institution}
                onChange={handleEducationFormChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <input
                type="text"
                name="degree"
                placeholder="Degree"
                value={educationFormData.degree}
                onChange={handleEducationFormChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <input
                type="text"
                name="field_of_study"
                placeholder="Field of Study"
                value={educationFormData.field_of_study}
                onChange={handleEducationFormChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  name="start_date"
                  placeholder="Start Date"
                  value={educationFormData.start_date}
                  onChange={handleEducationFormChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                <input
                  type="date"
                  name="end_date"
                  placeholder="End Date"
                  value={educationFormData.end_date}
                  onChange={handleEducationFormChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <textarea
                name="description"
                placeholder="Description"
                value={educationFormData.description}
                onChange={handleEducationFormChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                rows="3"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSaveEducation}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Save
                </button>
                <button
                  onClick={handleCancelEducation}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Education Button */}
        {!isAddingEducation && !editingEducationId && (
          <div className="flex items-center mt-4">
            <button 
              className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
              onClick={handleAddEducation}
            >
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
              <span className="text-sm font-medium">Add education</span>
            </button>
          </div>
        )}
      </div>
    );
  };

  const ProfileSection = () => {
    const [profileEntries, setProfileEntries] = useState([]);
    const [isAddingProfile, setIsAddingProfile] = useState(false);
    const [editingProfileId, setEditingProfileId] = useState(null);
    const [profileFormData, setProfileFormData] = useState({
      id: "",
      category: ""
    });
    const [categoryInput, setCategoryInput] = useState("");
    const [isFormVisible, setIsFormVisible] = useState(false);

    // Use profileDataForShow from parent component
    // const profileDataForShow = profile.client?.metas?.filter(dd => dd.meta_key === "PROFILE");

    const handleProfilePrivacyToggle = (id) => {
      // Get current profile data from profile
      const currentProfileData = profileDataForShow && profileDataForShow.length > 0 ? profileDataForShow[0] : null;
      if (!currentProfileData) return;

      let profileEntries = [];
      try {
        profileEntries = typeof currentProfileData.meta_value === 'string' 
          ? JSON.parse(currentProfileData.meta_value) 
          : currentProfileData.meta_value || [];
      } catch (error) {
        console.error('Error parsing profile data:', error);
        return;
      }

      

      // Update the specific profile entry's status
      const updatedProfileEntries = profileEntries.map(profile => {
        if (profile.id === id) {
          const currentStatus = profile.status || 'public';
          return {
            ...profile,
            status: currentStatus === 'public' ? 'private' : 'public'
          };
        }
        return profile;
      });


      // Save updated data to backend - preserve existing metas
      const existingMetas = profile.client?.metas || [];
      const otherMetas = existingMetas.filter(meta => meta.meta_key !== 'PROFILE');
      
      const newMetas = [
        ...otherMetas,
        {
          meta_key: 'PROFILE',
          meta_value: JSON.stringify(updatedProfileEntries),
          meta_status: '1'
        }
      ];

      const saveData = {
        ...profileData,
        metas: JSON.stringify(newMetas).replace(/"/g, "'"),
        profile_visibility: profileData?.profile_visibility
      };

      dispatch(storeBsicInformation(saveData))
        .then(() => {
          dispatch(getMyProfile());
          toast.success("Profile privacy updated");
        });
    };

    const handleAddProfile = () => {
      setIsFormVisible(true);
      setCategoryInput("");
      setProfileFormData({
        id: "",
        category: ""
      });
    };

    const handleAddCategory = () => {
      if (categoryInput.trim()) {
        const profileId = `profile_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        setProfileFormData({
          id: profileId,
          category: categoryInput.trim()
        });
        setCategoryInput("");
      }
    };

    const handleRemoveCategory = () => {
      setProfileFormData({
        id: "",
        category: ""
      });
    };

    const handleEditProfile = (profile) => {
      const profileId = editingProfileId || `profile_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      setEditingProfileId(profile.id);
      setProfileFormData({
        id: profileId,
        category: profile.category || ""
      });
    };

    const handleSaveProfile = () => {
      // Generate unique ID for new profile or use existing ID for editing
      const profileId = editingProfileId || `profile_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const newProfile = {
        id: profileId,
        ...profileFormData,
        status: 'public' // Add status property with default 'public'
      };

      // Get current profile entries from profile
      let currentProfileEntries = [];
      if (profileDataForShow && profileDataForShow.length > 0) {
        try {
          currentProfileEntries = typeof profileDataForShow[0].meta_value === 'string' 
            ? JSON.parse(profileDataForShow[0].meta_value) 
            : profileDataForShow[0].meta_value || [];
        } catch (error) {
          console.error('Error parsing current profile data:', error);
          currentProfileEntries = [];
        }
      }

      let updatedProfileEntries;
      if (editingProfileId) {
        // Update existing profile
        updatedProfileEntries = currentProfileEntries.map(profile => 
          profile.id === editingProfileId ? newProfile : profile
        );
      } else {
        // Add new profile
        updatedProfileEntries = [...currentProfileEntries, newProfile];
      }

      // Save to backend using metas structure - preserve existing metas
      const existingMetas = profile.client?.metas || [];
      const otherMetas = existingMetas.filter(meta => meta.meta_key !== 'PROFILE');
      
      const newMetas = [
        ...otherMetas,
        {
          meta_key: 'PROFILE',
          meta_value: JSON.stringify(updatedProfileEntries),
          meta_status: '1'
        }
      ];


      // Include profile_visibility with the metas data
      const saveData = {
        ...profileData,
        metas: JSON.stringify(newMetas).replace(/"/g, "'"),
        profile_visibility: profileData?.profile_visibility
      };

      dispatch(storeBsicInformation(saveData))
      .then(() => {
        dispatch(getMyProfile());
        toast.success("Updated")
        })

      // Reset form
      setIsAddingProfile(false);
      setEditingProfileId(null);
      setProfileFormData({
        id: "",
        category: ""
      });
    };

    const handleCancelProfile = () => {
      setIsFormVisible(false);
      setIsAddingProfile(false);
      setEditingProfileId(null);
      setProfileFormData({
        id: "",
        category: ""
      });
      setCategoryInput("");
    };

    const handleProfileFormChange = (e) => {
      const { name, value } = e.target;
      setProfileFormData(prev => ({
        ...prev,
        [name]: value
      }));
    };

    const handleCategoryInputChange = (e) => {
      setCategoryInput(e.target.value);
    };

    const handleCategoryInputKeyPress = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleAddCategory();
      }
    };

    const handleDeleteProfile = (data, id) => {
      // Remove the profile entry with the specified ID
      const updatedProfileEntries = data?.filter(profile => profile.id !== id);
      setProfileEntries(updatedProfileEntries);
      
      // Save updated data to backend - preserve existing metas
      const existingMetas = profile.client?.metas || [];
      const otherMetas = existingMetas.filter(meta => meta.meta_key !== 'PROFILE');
      
      const newMetas = [
        ...otherMetas,
        {
          meta_key: 'PROFILE',
          meta_value: JSON.stringify(updatedProfileEntries),
          meta_status: '1'
        }
      ];

      const saveData = {
        ...profileData,
        metas: JSON.stringify(newMetas).replace(/"/g, "'"),
        profile_visibility: profileData?.profile_visibility
      };

      dispatch(storeBsicInformation(saveData))
        .then(() => {
          dispatch(getMyProfile());
          toast.success("Profile entry deleted");
        });
    };

    return (
      <div className="bg-white rounded-lg border border-gray-100 p-4 mb-4">
        <h4 className="text-base font-bold text-gray-800 mb-4">Categories</h4>

        {/* Display existing profile entries */}
        {profileDataForShow && profileDataForShow.length > 0 && profileDataForShow.map((profileData, index) => {
          const profileEntries = typeof profileData.meta_value === 'string' 
            ? JSON.parse(profileData.meta_value) 
            : profileData.meta_value || [];
          
          return Array.isArray(profileEntries) ? profileEntries.map((entry, entryIndex) => {
            const uniqueId = entry.id || `profile_${index}_${entryIndex}_${Date.now()}`;
            
            return (
              <div key={uniqueId} className="mb-3">
                {/* Category Entry */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {/* Folder Icon */}
                      <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                      </svg>
                      
                      {/* Category Text */}
                      <span className="text-gray-900 font-medium">
                        {entry.category || 'Category'}
                      </span>
                    </div>
                    
                    {/* Action Icons */}
                    <div className="flex items-center space-x-2">
                      {/* Privacy Toggle (Globe Icon) */}
                      <button
                        onClick={() => handleProfilePrivacyToggle(entry.id || uniqueId)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                          (entry.status || 'public') === 'public' 
                            ? "bg-gray-200 text-gray-600 hover:bg-gray-300" 
                            : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                        }`}
                        title={(entry.status || 'public') === 'public' ? 'Public' : 'Private'}
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                      
                      {/* Edit Icon */}
                      <button 
                        className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 flex items-center justify-center transition-colors"
                        onClick={() => handleEditProfile({...entry, id: entry.id || uniqueId})}
                        title="Edit category"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          }) : null;
        })}

        {/* Add New Category Form */}
        {isFormVisible && (
          <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-500">Categories</span>
            </div>
            
            {/* Category Input Field */}
            <div className="border border-gray-200 rounded-lg p-3 min-h-[60px] bg-white">
              <div className="flex flex-wrap gap-2 items-center">
                {profileFormData.category && (
                  <div className="inline-flex items-center bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                    <span>{profileFormData.category}</span>
                    <button 
                      onClick={handleRemoveCategory}
                      className="ml-2 text-white hover:text-gray-200"
                    >
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                )}
                <input
                  type="text"
                  placeholder="Type category and press Enter"
                  value={categoryInput}
                  onChange={handleCategoryInputChange}
                  onKeyPress={handleCategoryInputKeyPress}
                  className="flex-1 outline-none text-sm"
                />
              </div>
            </div>
            
            {/* Required Label */}
            <div className="mt-3 text-sm text-gray-500">Required</div>
            <hr className="my-3 border-gray-200" />
            
            {/* Privacy Toggle and Action Buttons */}
            <div className="flex items-center justify-between">
              <button className="flex items-center px-3 py-1 rounded-full text-sm bg-gray-200 text-gray-700 hover:bg-gray-300">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                Public
              </button>
              
              <div className="flex space-x-2">
                <button
                  onClick={handleCancelProfile}
                  className="px-3 py-1 rounded-full text-sm bg-gray-200 text-gray-700 hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  className={`px-3 py-1 rounded-full text-sm ${
                    profileFormData.category 
                      ? "bg-blue-500 text-white hover:bg-blue-600" 
                      : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  }`}
                  disabled={!profileFormData.category}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Show message when no profile data */}
        {(!profileDataForShow || profileDataForShow.length === 0 || !profileDataForShow) && !isFormVisible && (
          <div className="text-gray-500 text-sm py-2">
            No categories found
            <br />
            <button 
              onClick={() => {
                // Create initial profile data for testing
                const testProfile = {
                  id: `profile_${Date.now()}`,
                  category: "Digital creator",
                  status: 'public'
                };
                
                // Get existing metas and add new profile meta
                const existingMetas = profile.client?.metas || [];
                const newMetas = [
                  ...existingMetas,
                  {
                    meta_key: 'PROFILE',
                    meta_value: JSON.stringify([testProfile]),
                    meta_status: '1'
                  }
                ];

                const saveData = {
                  ...profileData,
                  metas: JSON.stringify(newMetas),
                  profile_visibility: profileData?.profile_visibility
                };

                dispatch(storeBsicInformation(saveData))
                  .then(() => {
                    dispatch(getMyProfile());
                    toast.success("Test category created");
                  });
              }}
              className="mt-2 bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600"
            >
              Create Test Category
            </button>
          </div>
        )}

        {/* Add Category Button */}
        {!isFormVisible && (
          <div className="flex items-center mt-4">
            <button 
              className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
              onClick={handleAddProfile}
            >
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
              <span className="text-sm font-medium">Add category</span>
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Content Area - Responsive 3 Column Layout */}
      <div className="content-area pt-3">
  <div className="mx-auto h-[calc(90vh-100px)] overflow-y-auto">
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      {/* Center Content - PROFILE INFO - Full width on mobile, 12 cols on large screens */}
      <div className="col-span-1 lg:col-span-12">
        <div className="bg-white  p-4 mb-4">
          

          {/* Profile Information */}
          <div className="mb-4">
            <OverViewBlock
              icon={<CiUser size={20} />}
              title="Sex"
              value={profile?.client?.gender}
              field="marital_status"
              visibility={profile?.client?.profile_visibility?.gender}
            />

            <OverViewBlock
              icon={<CiCalendar size={20} />}
              title="Date of Birth"
              value={moment(profile?.client?.dob).format("MMM-DD-YYYY")}
              field="dob"
              visibility={profile?.client?.profile_visibility?.dob}

            />

            <OverViewBlock
              icon={<CiLocationOn size={20} />}
              title="Place of Birth"
              value={profile?.client?.fromcity?.name}
              field="location"
              visibility={profile?.client?.profile_visibility?.location}
            />

            <OverViewBlock
              icon={<CiLocationOn size={20} />}
              title="Current City"
              value={profile?.client?.currentstate?.name}
              field="city"
              visibility={profile?.client?.profile_visibility?.city}
            />

            <OverViewBlock
              icon={<CiHeart size={20} />}
              title="Relationship Status"
              value={profile?.client?.marital_status_name}
              field="status"
              visibility={profile?.client?.profile_visibility?.marital_status}

            />

            {/* Work Section */}
            <WorkSection />

            {/* Education Section */}
            <EducationSection />

            {/* Profile Section */}
            <ProfileSection />

            <OverViewBlock
              icon={<CiPhone size={20} />}
              title="Contact"
              value={profile?.client?.contact_no}
              field="contact_no"
              visibility={profile?.client?.profile_visibility?.contact_no}
            />

            <OverViewBlock
              icon={<CiMail size={20} />}
              title="Email"
              value={profile?.client?.email}
              field="email"
              visibility={profile?.client?.profile_visibility?.email}
            />

            <OverViewBlock
              icon={<CiUser size={20} />}
              title="Blood Group"
              value={"A+"}
              field="blood"
              visibility={profile?.client?.profile_visibility?.blood_group}
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

    </>
  );
};

export default EditDetails;

