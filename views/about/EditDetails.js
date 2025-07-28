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

const EditDetails = () => {
  const { profile, profileData } = useSelector(({ settings }) => settings);
  const { isPostModalOpen } = useSelector(({ gathering }) => gathering);
  const dispatch = useDispatch();
const workDataForShow = profile.client?.metas?.filter(dd => dd.meta_key === "WORK")
const educationDataShow = profile.client?.metas?.filter(dd => dd.meta_key === "EDUCATION")

const [previousWork, setPreviousWork] = useState(workDataForShow[0]?.meta_value);
console.log('workDataForShow',workDataForShow)
console.log('educationDataShow',educationDataShow)
console.log('previousWord',previousWork)
  
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
    
    // console.log('value for profile visibility', visibility, 'field:', field, 'isPublic:', isPublic, 'localVisibility:', localVisibility[field]);

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
            <button className="text-gray-400 ml-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>
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
      description: ""
    });

    const handleWorkPrivacyToggle = (id) => {
      setWorkEntries((prev) =>
        prev.map((work) => {
          if (work.id === id) {
            const newValue = !work.isPublic;
            
            // Call API to update work visibility
            const visibilityData = {
              profile_visibility: {
                work: newValue ? 'public' : 'private'
              }
            };
            dispatch(storeBsicInformation(visibilityData));
            
            return { ...work, isPublic: newValue };
          }
          return work;
        })
      );
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
        isPublic: true
      };

      if (editingWorkId) {
        // Update existing work
        setWorkEntries(prev => 
          prev.map(work => 
            work.id === editingWorkId ? newWork : work
          )
        );
      } else {
        // Add new work
        setWorkEntries(prev => [...prev, newWork]);
      }

      // Save to backend using metas structure
      const metas = [
        {
          meta_key: 'WORK',
          meta_value: [
            ...(typeof previousWork === 'string' ? JSON.parse(previousWork) : (previousWork || [])),
            newWork
          ],
          meta_status: '1'
        }
      ];

      // Include profile_visibility with the metas data
      const saveData = {
        ...profileData,
        metas: JSON.stringify(metas),
        profile_visibility: profileData?.profile_visibility
      };

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
          meta_status: '1'
        }
      ];

      const saveData = {
        ...profileData,
        metas: JSON.stringify(metas),
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
        {console.log('workDataForShow:', workDataForShow)}
        {workDataForShow && workDataForShow.length > 0 && workDataForShow.map((workData, index) => {
          const workEntries = typeof workData.meta_value === 'string' 
            ? JSON.parse(workData.meta_value) 
            : workData.meta_value || [];
          {console.log('workEntries:', workEntries)}
          
          return Array.isArray(workEntries) ? workEntries.map((entry, entryIndex) => {
            // Generate unique ID for each entry
            const uniqueId = entry.id || `work_${index}_${entryIndex}_${Date.now()}`;
            
            return (
              <div key={uniqueId} className="flex items-center mb-3 last:mb-0">
                {/* Privacy Toggle */}
                <div className="flex items-center mr-4">
                  <button
                    onClick={() => handleWorkPrivacyToggle(uniqueId)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      entry.isPublic !== false ? "bg-blue-600" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        entry.isPublic !== false ? "translate-x-6" : "translate-x-1"
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
                  onClick={() => handleEditWork({...entry, id: uniqueId})}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>

                {/* Delete Icon */}
                <button 
                  className="text-red-400 ml-2 hover:text-red-600"
                  onClick={() => handleDeleteWork(workEntries, uniqueId)}
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
      setEducationEntries((prev) =>
        prev.map((education) => {
          if (education.id === id) {
            const newValue = !education.isPublic;
            
            // Call API to update education visibility
            const visibilityData = {
              profile_visibility: {
                education: newValue ? 'public' : 'private'
              }
            };
            dispatch(storeBsicInformation(visibilityData));
            
            return { ...education, isPublic: newValue };
          }
          return education;
        })
      );
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
        isPublic: true
      };

      if (editingEducationId) {
        // Update existing education
        setEducationEntries(prev => 
          prev.map(education => 
            education.id === editingEducationId ? newEducation : education
          )
        );
      } else {
        // Add new education
        setEducationEntries(prev => [...prev, newEducation]);
      }

      // Save to backend using metas structure - include all previous education entries plus new one
      const metas = [
        {
          meta_key: 'EDUCATION',
          meta_value: [
            // Include all previous education entries from database
            ...(educationDataShow && educationDataShow.length > 0 ? educationDataShow.map(educationData => {
              let entries = [];
              try {
                if (typeof educationData.meta_value === 'string') {
                  entries = JSON.parse(educationData.meta_value);
                } else if (Array.isArray(educationData.meta_value)) {
                  entries = educationData.meta_value;
                } else if (educationData.meta_value) {
                  entries = [educationData.meta_value];
                }
              } catch (error) {
                console.error('Error parsing education data for save:', error);
                entries = [];
              }
              return entries;
            }).flat() : []),
            // Add the new education entry
            newEducation
          ],
          meta_status: '1'
        }
      ];

      // Include profile_visibility with the metas data
      const saveData = {
        ...profileData,
        metas: JSON.stringify(metas),
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
      console.log(data, id)
      // Remove the education entry with the specified ID
      const updatedEducationEntries = data?.filter(education => education.id !== id);
      setEducationEntries(updatedEducationEntries);
      
      // Save updated data to backend
      const metas = [
        {
          meta_key: 'EDUCATION',
          meta_value: updatedEducationEntries,
          meta_status: '1'
        }
      ];


      const saveData = {
        ...profileData,
        metas: JSON.stringify(metas),
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
        {console.log('educationDataShow:', educationDataShow)}
        {educationDataShow && educationDataShow.length > 0 && educationDataShow.map((educationData, index) => {
          console.log('Processing educationData:', educationData);
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
          
          console.log('Parsed educationEntries:', educationEntries);
          
          return Array.isArray(educationEntries) ? educationEntries.map((entry, entryIndex) => {
            // Generate unique ID for each entry
            const uniqueId = entry.id || `education_${index}_${entryIndex}_${Date.now()}`;
            
            return (
              <div key={uniqueId} className="flex items-center mb-3 last:mb-0">
                {/* Privacy Toggle */}
                <div className="flex items-center mr-4">
                  <button
                    onClick={() => handleEducationPrivacyToggle(uniqueId)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      entry.isPublic !== false ? "bg-blue-600" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        entry.isPublic !== false ? "translate-x-6" : "translate-x-1"
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
                  onClick={() => handleEditEducation({...entry, id: uniqueId})}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>

                {/* Delete Icon */}
                <button 
                  className="text-red-400 ml-2 hover:text-red-600"
                  onClick={() => handleDeleteEducation(educationEntries, uniqueId)}
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

  return (
    <>
      {/* Content Area - Responsive 3 Column Layout */}
      <div className="content-area pt-3">
  <div className="mx-auto h-[calc(90vh-100px)] overflow-y-auto">
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      {/* Center Content - PROFILE INFO - Full width on mobile, 12 cols on large screens */}
      <div className="col-span-1 lg:col-span-12">
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          

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

