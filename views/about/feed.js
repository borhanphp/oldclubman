"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  FaEllipsisH,
  FaVideo,
  FaGlobe,
  FaComment,
  FaMapMarkerAlt,
  FaEnvelope,
  FaBirthdayCake,
  FaCalendarAlt,
  FaBriefcase,
  FaGraduationCap,
  FaHome,
  FaHeart,
  FaUsers,
  FaEdit,
  FaLock,
} from "react-icons/fa";
import PostModal from "@/components/custom/PostModal";
import FeedHeader from "@/components/common/FeedHeader";
import Intro from "@/components/common/Intro";
import { useDispatch, useSelector } from "react-redux";
import { getMyProfile, storeBsicInformation } from "../settings/store";
import moment from "moment";
import CreatePostBox from "@/components/common/CreatePostBox";
import PostList from "@/components/common/PostList";
import FeedLayout from "@/components/common/FeedLayout";
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
import { LuPhone } from "react-icons/lu";

const AboutContent = () => {
  const { profile, profileData } = useSelector(({ settings }) => settings);
  const { isPostModalOpen } = useSelector(({ gathering }) => gathering);
  const dispatch = useDispatch();

  // State for active section
  const [activeSection, setActiveSection] = useState('overview');

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

  useEffect(() => {
    dispatch(getMyProfile());
  }, []);

  // Handle privacy toggle
  const handlePrivacyToggle = (field) => {
    setPrivacySettings((prev) => {
      const newSettings = {
        ...prev,
        [field]: !prev[field],
      };

      // Build the full profile_visibility object
      const profile_visibility = {};
      Object.keys(newSettings).forEach((key) => {
        profile_visibility[key] = newSettings[key] ? 'public' : 'private';
      });

      // Send the full object as a JSON string if needed
      dispatch(storeBsicInformation({
        ...profileData,
        profile_visibility: JSON.stringify(profile_visibility)
      }));

      return newSettings;
    });
  };

  const OverViewBlock = (props) => {
    const { icon, title, value, field } = props;
    const isPublic = privacySettings[field];

    return (
      <>
        <div className="bg-white rounded-lg border border-gray-100 p-4 mb-3">
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
      setIsAddingWork(true);
      setWorkFormData({
        title: "",
        company: "",
        position: "",
        start_date: "",
        end_date: "",
        description: ""
      });
    };

    const handleEditWork = (work) => {
      setEditingWorkId(work.id);
      setWorkFormData({
        title: work.title || "",
        company: work.company || "",
        position: work.position || "",
        start_date: work.start_date || "",
        end_date: work.end_date || "",
        description: work.description || ""
      });
    };

    const handleSaveWork = () => {
      const newWork = {
        id: editingWorkId || Date.now(),
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
          meta_value: JSON.stringify(workEntries),
          meta_status: '1'
        }
      ];

      // Include profile_visibility with the metas data
      const saveData = {
        ...profileData,
        metas,
        profile_visibility: profileData?.profile_visibility
      };

      dispatch(storeBsicInformation(saveData));

      // Reset form
      setIsAddingWork(false);
      setEditingWorkId(null);
      setWorkFormData({
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

    return (
      <div className="bg-white rounded-lg border border-gray-100 p-4 mb-4">
        <h4 className="text-base font-bold text-gray-800 mb-4">WORK</h4>

        {workEntries.map((work) => (
          <div key={work.id} className="flex items-center mb-3 last:mb-0">
            {/* Privacy Toggle */}
            <div className="flex items-center mr-4">
              <button
                onClick={() => handleWorkPrivacyToggle(work.id)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  work.isPublic ? "bg-blue-600" : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    work.isPublic ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Work Title */}
            <div className="flex-1 text-sm text-gray-700">{work.title}</div>

            {/* Edit Icon */}
            <button 
              className="text-gray-400 ml-2"
              onClick={() => handleEditWork(work)}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>
          </div>
        ))}

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
      setIsAddingEducation(true);
      setEducationFormData({
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
      setEditingEducationId(education.id);
      setEducationFormData({
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
      const newEducation = {
        id: editingEducationId || Date.now(),
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

      // Save to backend using metas structure
      const metas = [
        {
          meta_key: 'EDUCATION',
          meta_value: JSON.stringify(educationEntries),
          meta_status: '1'
        }
      ];

      // Include profile_visibility with the metas data
      const saveData = {
        ...profileData,
        metas,
        profile_visibility: profileData?.profile_visibility
      };

      dispatch(storeBsicInformation(saveData));

      // Reset form
      setIsAddingEducation(false);
      setEditingEducationId(null);
      setEducationFormData({
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

    return (
      <div className="bg-white rounded-lg border border-gray-100 p-4 mb-4">
        <h4 className="text-base font-bold text-gray-800 mb-4">EDUCATION</h4>

        {educationEntries.map((education) => (
          <div key={education.id} className="flex items-center mb-3 last:mb-0">
            {/* Privacy Toggle */}
            <div className="flex items-center mr-4">
              <button
                onClick={() => handleEducationPrivacyToggle(education.id)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  education.isPublic ? "bg-blue-600" : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    education.isPublic ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Education Title */}
            <div className="flex-1 text-sm text-gray-700">
              {education.title}
            </div>

            {/* Edit Icon */}
            <button 
              className="text-gray-400 ml-2"
              onClick={() => handleEditEducation(education)}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>
          </div>
        ))}

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
    <FeedLayout>
      {/* Content Area - Two Column Layout */}
      <div className="content-area pt-3">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Sidebar - Navigation */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-4 sticky top-4">
                <h3 className="text-xl font-bold mb-4">About</h3>
                
                {/* Navigation Menu */}
                <nav className="space-y-1">
                  <button 
                    onClick={() => setActiveSection('overview')}
                    className={`block w-full text-left px-3 py-2 rounded-md transition-colors ${
                      activeSection === 'overview' 
                        ? 'text-blue-600 font-medium bg-blue-50' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Overview
                  </button>
                  <button 
                    onClick={() => setActiveSection('work-education')}
                    className={`block w-full text-left px-3 py-2 rounded-md transition-colors ${
                      activeSection === 'work-education' 
                        ? 'text-blue-600 font-medium bg-blue-50' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Work and education
                  </button>
                  <button 
                    onClick={() => setActiveSection('places-lived')}
                    className={`block w-full text-left px-3 py-2 rounded-md transition-colors ${
                      activeSection === 'places-lived' 
                        ? 'text-blue-600 font-medium bg-blue-50' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Places lived
                  </button>
                  <button 
                    onClick={() => setActiveSection('contact-info')}
                    className={`block w-full text-left px-3 py-2 rounded-md transition-colors ${
                      activeSection === 'contact-info' 
                        ? 'text-blue-600 font-medium bg-blue-50' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Contact and basic info
                  </button>
                  <button 
                    onClick={() => setActiveSection('privacy-legal')}
                    className={`block w-full text-left px-3 py-2 rounded-md transition-colors ${
                      activeSection === 'privacy-legal' 
                        ? 'text-blue-600 font-medium bg-blue-50' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Privacy and legal info
                  </button>
                  <button 
                    onClick={() => setActiveSection('profile-transparency')}
                    className={`block w-full text-left px-3 py-2 rounded-md transition-colors ${
                      activeSection === 'profile-transparency' 
                        ? 'text-blue-600 font-medium bg-blue-50' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Profile transparency
                  </button>
                  <button 
                    onClick={() => setActiveSection('family-relationships')}
                    className={`block w-full text-left px-3 py-2 rounded-md transition-colors ${
                      activeSection === 'family-relationships' 
                        ? 'text-blue-600 font-medium bg-blue-50' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Family and relationships
                  </button>
                  <button 
                    onClick={() => setActiveSection('details-about')}
                    className={`block w-full text-left px-3 py-2 rounded-md transition-colors ${
                      activeSection === 'details-about' 
                        ? 'text-blue-600 font-medium bg-blue-50' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Details about you
                  </button>
                  <button 
                    onClick={() => setActiveSection('life-events')}
                    className={`block w-full text-left px-3 py-2 rounded-md transition-colors ${
                      activeSection === 'life-events' 
                        ? 'text-blue-600 font-medium bg-blue-50' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Life events
                  </button>
                </nav>
              </div>
            </div>

            {/* Right Content - Main Content Area */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-bold mb-6">About</h3>

                {/* Overview Section */}
                {activeSection === 'overview' && (
                  <div className="space-y-6">
                    {/* Work Section */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FaBriefcase className="text-gray-500 mr-3" />
                        <div>
                          <div className="text-gray-700 font-medium">Software Developer at Clutchit.com.au</div>
                          <div className="text-gray-500 text-sm">Past: Quadrion Technologies</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                          <FaGlobe className="text-gray-600 text-sm" />
                        </button>
                        <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                          <FaEllipsisH className="text-gray-600 text-sm" />
                        </button>
                      </div>
                    </div>

                    {/* Education Section */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FaGraduationCap className="text-gray-500 mr-3" />
                        <div className="text-gray-700 font-medium">Studied at University of Chittagong</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                          <FaGlobe className="text-gray-600 text-sm" />
                        </button>
                        <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                          <FaEllipsisH className="text-gray-600 text-sm" />
                        </button>
                      </div>
                    </div>

                    {/* Current City */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FaHome className="text-gray-500 mr-3" />
                        <div className="text-gray-700 font-medium">Lives in Chittagong</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                          <FaGlobe className="text-gray-600 text-sm" />
                        </button>
                        <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                          <FaEllipsisH className="text-gray-600 text-sm" />
                        </button>
                      </div>
                    </div>

                    {/* Hometown */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FaMapMarkerAlt className="text-gray-500 mr-3" />
                        <div className="text-gray-700 font-medium">From Chittagong</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                          <FaGlobe className="text-gray-600 text-sm" />
                        </button>
                        <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                          <FaEllipsisH className="text-gray-600 text-sm" />
                        </button>
                      </div>
                    </div>

                    {/* Relationship Status */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FaHeart className="text-gray-500 mr-3" />
                        <div className="text-gray-700 font-medium">Married since January 16, 2025</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                          <FaUsers className="text-gray-600 text-sm" />
                        </button>
                        <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                          <FaEdit className="text-gray-600 text-sm" />
                        </button>
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <LuPhone className="text-gray-500 mr-3" />
                        <div>
                          <div className="text-gray-700 font-medium">01829-521200</div>
                          <div className="text-gray-500 text-sm">Mobile</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                          <FaLock className="text-gray-600 text-sm" />
                        </button>
                        <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                          <FaEdit className="text-gray-600 text-sm" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Work and Education Section */}
                {activeSection === 'work-education' && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold mb-4">Work</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <FaBriefcase className="text-gray-500 mr-3" />
                            <div>
                              <div className="text-gray-700 font-medium">Software Developer</div>
                              <div className="text-gray-500 text-sm">Clutchit.com.au</div>
                              <div className="text-gray-400 text-xs">2023 - Present</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                              <FaGlobe className="text-gray-600 text-sm" />
                            </button>
                            <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                              <FaEdit className="text-gray-600 text-sm" />
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <FaBriefcase className="text-gray-500 mr-3" />
                            <div>
                              <div className="text-gray-700 font-medium">Frontend Developer</div>
                              <div className="text-gray-500 text-sm">Quadrion Technologies</div>
                              <div className="text-gray-400 text-xs">2021 - 2023</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                              <FaGlobe className="text-gray-600 text-sm" />
                            </button>
                            <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                              <FaEdit className="text-gray-600 text-sm" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold mb-4">Education</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <FaGraduationCap className="text-gray-500 mr-3" />
                            <div>
                              <div className="text-gray-700 font-medium">Bachelor of Computer Science</div>
                              <div className="text-gray-500 text-sm">University of Chittagong</div>
                              <div className="text-gray-400 text-xs">2017 - 2021</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                              <FaGlobe className="text-gray-600 text-sm" />
                            </button>
                            <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                              <FaEdit className="text-gray-600 text-sm" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Places Lived Section */}
                {activeSection === 'places-lived' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FaHome className="text-gray-500 mr-3" />
                        <div>
                          <div className="text-gray-700 font-medium">Current City</div>
                          <div className="text-gray-500 text-sm">Chittagong, Bangladesh</div>
                          <div className="text-gray-400 text-xs">2020 - Present</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                          <FaGlobe className="text-gray-600 text-sm" />
                        </button>
                        <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                          <FaEdit className="text-gray-600 text-sm" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FaMapMarkerAlt className="text-gray-500 mr-3" />
                        <div>
                          <div className="text-gray-700 font-medium">Hometown</div>
                          <div className="text-gray-500 text-sm">Chittagong, Bangladesh</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                          <FaGlobe className="text-gray-600 text-sm" />
                        </button>
                        <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                          <FaEdit className="text-gray-600 text-sm" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Contact and Basic Info Section */}
                {activeSection === 'contact-info' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <LuPhone className="text-gray-500 mr-3" />
                        <div>
                          <div className="text-gray-700 font-medium">Mobile</div>
                          <div className="text-gray-500 text-sm">01829-521200</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                          <FaLock className="text-gray-600 text-sm" />
                        </button>
                        <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                          <FaEdit className="text-gray-600 text-sm" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FaEnvelope className="text-gray-500 mr-3" />
                        <div>
                          <div className="text-gray-700 font-medium">Email</div>
                          <div className="text-gray-500 text-sm">borhanidb@gmail.com</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                          <FaLock className="text-gray-600 text-sm" />
                        </button>
                        <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                          <FaEdit className="text-gray-600 text-sm" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FaBirthdayCake className="text-gray-500 mr-3" />
                        <div>
                          <div className="text-gray-700 font-medium">Date of Birth</div>
                          <div className="text-gray-500 text-sm">September 20, 1996</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                          <FaGlobe className="text-gray-600 text-sm" />
                        </button>
                        <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                          <FaEdit className="text-gray-600 text-sm" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Privacy and Legal Info Section */}
                {activeSection === 'privacy-legal' && (
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Privacy Settings</h4>
                      <p className="text-gray-600 text-sm">Manage who can see your profile information and posts.</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Legal Information</h4>
                      <p className="text-gray-600 text-sm">Terms of service, privacy policy, and data usage information.</p>
                    </div>
                  </div>
                )}

                {/* Profile Transparency Section */}
                {activeSection === 'profile-transparency' && (
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Profile Transparency</h4>
                      <p className="text-gray-600 text-sm">Information about how your profile data is used and shared.</p>
                    </div>
                  </div>
                )}

                {/* Family and Relationships Section */}
                {activeSection === 'family-relationships' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FaHeart className="text-gray-500 mr-3" />
                        <div>
                          <div className="text-gray-700 font-medium">Relationship Status</div>
                          <div className="text-gray-500 text-sm">Married since January 16, 2025</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                          <FaUsers className="text-gray-600 text-sm" />
                        </button>
                        <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                          <FaEdit className="text-gray-600 text-sm" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Details About You Section */}
                {activeSection === 'details-about' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <CiUser className="text-gray-500 mr-3" />
                        <div>
                          <div className="text-gray-700 font-medium">Blood Group</div>
                          <div className="text-gray-500 text-sm">A+</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                          <FaLock className="text-gray-600 text-sm" />
                        </button>
                        <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                          <FaEdit className="text-gray-600 text-sm" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Life Events Section */}
                {activeSection === 'life-events' && (
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Life Events</h4>
                      <p className="text-gray-600 text-sm">Share important moments and milestones in your life.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Post Modal */}
      {isPostModalOpen && <PostModal />}
    </FeedLayout>
  );
};

export default AboutContent;

