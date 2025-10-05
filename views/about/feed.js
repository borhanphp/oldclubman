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
import { getMyProfile, getUserProfile, setPrivacyDetailsModal, storeBsicInformation } from "../settings/store";
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
import { useParams } from "next/navigation";
import EditDetails from "./EditDetails";

const AboutContent = () => {
  const { profile, profileData, userProfileData, privacyDetailsModalOpen } = useSelector(({ settings }) => settings);
  const params = useParams();

  const isMyProfile = profile?.client?.id === userProfileData?.client?.id;
  const userData = params?.id ? userProfileData?.client : profile?.client;
  const { isPostModalOpen } = useSelector(({ gathering }) => gathering);
  const dispatch = useDispatch();

  const workData = userData?.metas?.filter(dd => dd.meta_key === "WORK")[0]?.meta_value;
  let workDataForShow = [];
  try {
    workDataForShow = workData ? JSON.parse(workData) : [];
  } catch (error) {
    console.error('Error parsing work data:', error);
    workDataForShow = [];
  }

  const educationData = userData?.metas?.filter(dd => dd.meta_key === "EDUCATION")[0]?.meta_value;
  let educationDataShow = [];
  try {
    educationDataShow = educationData ? JSON.parse(educationData) : [];
  } catch (error) {
    console.error('Error parsing educationDataShow data:', error);
    educationDataShow = [];
  }


//   console.log('workDataForShow from about', workDataForShow)
// console.log('educationDataShow from about',educationDataShow)


  // State for active section
  const [activeSection, setActiveSection] = useState('overview');



  useEffect(() => {
    dispatch(getMyProfile());
    dispatch(getUserProfile(params?.id));
  }, []);

const categoryData = userData?.metas?.filter(dd => dd.meta_key === "PROFILE")[0]?.meta_value;
let profileDataShow = [];
try {
  profileDataShow = categoryData ? JSON.parse(categoryData) : [];
} catch (error) {
  console.error('Error parsing educationDataShow data:', error);
  profileDataShow = [];
}
console.log('userData',userData)

 
  return (
    <FeedLayout showMsgBtn={true} showFriends={true} userProfile={true}>
      {/* Content Area - Two Column Layout */}
      <div className="content-area pt-3">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Left Sidebar - Navigation */}
            <div className="lg:col-span-2">
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
                  {isMyProfile && (
                      <button className="px-3 mr-2 py-1 bg-gray-300 text-black ml-1 rounded-sm hover:bg-gray-200 cursor-pointer">
                      <span className="flex gap-2" onClick={() => {dispatch(setPrivacyDetailsModal(!privacyDetailsModalOpen))}}>
                        <FaEdit className="mt-1" /> Edit details
                      </span>
                      </button>
                    )}
                  {/* <button 
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
                    onClick={() => setActiveSection('userData-transparency')}
                    className={`block w-full text-left px-3 py-2 rounded-md transition-colors ${
                      activeSection === 'userData-transparency' 
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
                  </button> */}
                </nav>
              </div>
             
            </div>



            {/* Right Content - Main Content Area */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-sm p-6">

                {/* Overview Section */}
                {activeSection === 'overview' && (
                  <div className="space-y-6">
                     <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <FaBriefcase className="text-gray-500 mr-3" />
                            <div>
                              <div className="text-gray-700 font-medium flex">Profile: 
                              <div className="flex flex-wrap gap-2 ml-2">
                                {profileDataShow?.map((item, index) => {
                                  return(
                                    <span key={index} className="inline-flex items-center px-2 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200 hover:bg-blue-200 transition-colors">
                                      {item?.category}
                                    </span>
                                  )
                                })} 
                              </div>
                              </div>
                            </div>
                          </div>
                      
                      
                      {/* <div className="flex items-center space-x-2">
                        <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                          <FaGlobe className="text-gray-600 text-sm" />
                        </button>
                        <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                          <FaEllipsisH className="text-gray-600 text-sm" />
                        </button>
                      </div> */}
                    </div>

                    <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <FaBriefcase className="text-gray-500 mr-3" />
                            <div>
                              <div className="text-gray-700 font-medium flex">Sex: {userData?.gender === 0 ? "Male" : userData?.gender === 1 ? "Female" : "Others"} 
                              
                              </div>
                            </div>
                          </div>
                      
                      
                      {/* <div className="flex items-center space-x-2">
                        <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                          <FaGlobe className="text-gray-600 text-sm" />
                        </button>
                        <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                          <FaEllipsisH className="text-gray-600 text-sm" />
                        </button>
                      </div> */}
                    </div>

                    <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <FaBriefcase className="text-gray-500 mr-3" />
                            <div>
                              <div className="text-gray-700 font-medium flex">Place of Birth: {userData?.fromcity?.name} 
                              
                              </div>
                            </div>
                          </div>
                      
                      
                      {/* <div className="flex items-center space-x-2">
                        <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                          <FaGlobe className="text-gray-600 text-sm" />
                        </button>
                        <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                          <FaEllipsisH className="text-gray-600 text-sm" />
                        </button>
                      </div> */}
                    </div>

                    {/* Work Section */}
                    <div className="flex items-center justify-between">
                      {workDataForShow?.slice(0, 1)?.map((item, index) => {
                        return(
                          <div className="flex items-center">
                            <FaBriefcase className="text-gray-500 mr-3" />
                            <div>
                              <div className="text-gray-700 font-medium">{item?.position} at {item?.company}</div>
                            </div>
                          </div>
                       )
                      })} 
                      
                      {/* <div className="flex items-center space-x-2">
                        <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                          <FaGlobe className="text-gray-600 text-sm" />
                        </button>
                        <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                          <FaEllipsisH className="text-gray-600 text-sm" />
                        </button>
                      </div> */}
                    </div>

                    {/* Education Section */}
                    {educationDataShow?.slice(0, 1)?.map((item, index) => {
                      return(
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <FaGraduationCap className="text-gray-500 mr-3" />
                          <div className="text-gray-700 font-medium">Studied at {item?.institution}</div>
                        </div>
                        {/* <div className="flex items-center space-x-2">
                          <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                            <FaGlobe className="text-gray-600 text-sm" />
                          </button>
                          <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                            <FaEllipsisH className="text-gray-600 text-sm" />
                          </button>
                        </div> */}
                      </div>
                      )
                    })}
                    

                    {/* Current City */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FaHome className="text-gray-500 mr-3" />
                        <div className="text-gray-700 font-medium">{`Lives in ${userData?.currentstate?.name}`}</div>
                      </div>
                      {/* {isMyProfile && (
                        <div className="flex items-center space-x-2">
                        <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                          <FaGlobe className="text-gray-600 text-sm" />
                        </button>
                        <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                          <FaEllipsisH className="text-gray-600 text-sm" />
                        </button>
                      </div>
                      ) } */}
                      
                    </div>

                    {/* Hometown */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FaMapMarkerAlt className="text-gray-500 mr-3" />
                        <div className="text-gray-700 font-medium">From {userData?.fromcity?.name}</div>
                      </div>
                      {/* {isMyProfile && (
                        <div className="flex items-center space-x-2">
                        <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                          <FaGlobe className="text-gray-600 text-sm" />
                        </button>
                        <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                          <FaEllipsisH className="text-gray-600 text-sm" />
                        </button>
                        </div>
                      )} */}
                     
                    </div>

                    {/* Relationship Status */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FaHeart className="text-gray-500 mr-3" />
                        <div className="text-gray-700 font-medium">{userData?.marital_status_name}</div>
                      </div>
                      {/* {isMyProfile && (
                        <div className="flex items-center space-x-2">
                        <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                          <FaUsers className="text-gray-600 text-sm" />
                        </button>
                        <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                          <FaEdit className="text-gray-600 text-sm" />
                        </button>
                        </div>
                      )} */}
                     
                    </div>

                    {/* Contact Info */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <LuPhone className="text-gray-500 mr-3" />
                        <div>
                          <div className="text-gray-700 font-medium">{userData?.contact_no}</div>
                          <div className="text-gray-500 text-sm">Mobile</div>
                        </div>
                      </div>
                      {/* {isMyProfile && (
                        <div className="flex items-center space-x-2">
                        <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                          <FaLock className="text-gray-600 text-sm" />
                        </button>
                        <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                          <FaEdit className="text-gray-600 text-sm" />
                        </button>
                      </div>
                      )} */}
                      
                    </div>
                  </div>
                )}



                {/* Work and Education Section */}
                {activeSection === 'work-education' && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold mb-4">Work</h4>
                      <div className="space-y-4">
                        {workDataForShow && workDataForShow.length > 0 ? (
                          workDataForShow.map((item, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <div className="flex items-center">
                                <FaBriefcase className="text-gray-500 mr-3" />
                                <div>
                                  <div className="text-gray-700 font-medium">{item.title || item.job_title || 'Job Title'}</div>
                                  <div className="text-gray-500 text-sm">{item.company || item.employer || 'Company'}</div>
                                  <div className="text-gray-400 text-xs">
                                    {item.start_date && item.end_date ? `${item.start_date} - ${item.end_date}` : 
                                     item.start_date ? `${item.start_date} - Present` : 'Date not specified'}
                                  </div>
                                </div>
                              </div>
                              {/* {isMyProfile && (
                                <div className="flex items-center space-x-2">
                                <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                                  <FaGlobe className="text-gray-600 text-sm" />
                                </button>
                                <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                                  <FaEdit className="text-gray-600 text-sm" />
                                </button>
                              </div>
                              )} */}
                              
                            </div>
                          ))
                        ) : (
                          <div className="text-gray-500 text-center py-4">
                            No work experience added yet
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold mb-4">Education</h4>
                      <div className="space-y-4">
                        {educationDataShow && educationDataShow.length > 0 ? (
                          educationDataShow?.map((item, index) => {
                            
                            return (
                              <div key={index} className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <FaGraduationCap className="text-gray-500 mr-3" />
                                  <div>
                                    <div className="text-gray-700 font-medium">{item.degree || item.title || 'Degree'}</div>
                                    <div className="text-gray-500 text-sm">{item.school || item.institution || 'Institution'}</div>
                                    <div className="text-gray-400 text-xs">
                                      {item.start_date && item.end_date ? `${item.start_date} - ${item.end_date}` : 
                                       item.start_date ? `${item.start_date} - Present` : 'Date not specified'}
                                    </div>
                                  </div>
                                </div>
                                {/* {isMyProfile && (
                                  <div className="flex items-center space-x-2">
                                  <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                                    <FaGlobe className="text-gray-600 text-sm" />
                                  </button>
                                  <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                                    <FaEdit className="text-gray-600 text-sm" />
                                  </button>
                                </div>

                                )} */}
                                
                              </div>
                            );
                          })
                        ) : (
                          <div className="text-gray-500 text-center py-4">
                            No education information added yet
                          </div>
                        )}
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
                          <div className="text-gray-500 text-sm">{userData?.currentstate?.name + ", " + userData?.currentcountry?.name }</div>
                        </div>
                      </div>
                      {/* {isMyProfile && (
                        <div className="flex items-center space-x-2">
                        <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                          <FaGlobe className="text-gray-600 text-sm" />
                        </button>
                        <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                          <FaEdit className="text-gray-600 text-sm" />
                        </button>
                      </div>
                      )} */}
                      
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FaMapMarkerAlt className="text-gray-500 mr-3" />
                        <div>
                          <div className="text-gray-700 font-medium">Hometown</div>
                          <div className="text-gray-500 text-sm">{userData?.fromcity?.name + ", " + userData?.fromcountry?.name}</div>
                        </div>
                      </div>
                      {/* {isMyProfile && (
                        <div className="flex items-center space-x-2">
                        <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                          <FaGlobe className="text-gray-600 text-sm" />
                        </button>
                        <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                          <FaEdit className="text-gray-600 text-sm" />
                        </button>
                      </div>
                      )} */}
                      
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
                          <div className="text-gray-500 text-sm">{userData?.contact_no}</div>
                        </div>
                      </div>
                      {/* {isMyProfile && (
                        <div className="flex items-center space-x-2">
                        <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                          <FaLock className="text-gray-600 text-sm" />
                        </button>
                        <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                          <FaEdit className="text-gray-600 text-sm" />
                        </button>
                      </div>
                      )} */}
                      
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FaEnvelope className="text-gray-500 mr-3" />
                        <div>
                          <div className="text-gray-700 font-medium">Email</div>
                          <div className="text-gray-500 text-sm">{userData?.email}</div>
                        </div>
                      </div>
                      {/* {isMyProfile && (
                        <div className="flex items-center space-x-2">
                        <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                          <FaLock className="text-gray-600 text-sm" />
                        </button>
                        <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                          <FaEdit className="text-gray-600 text-sm" />
                        </button>
                      </div>
                      )} */}
                      
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FaBirthdayCake className="text-gray-500 mr-3" />
                        <div>
                          <div className="text-gray-700 font-medium">Date of Birth</div>
                          <div className="text-gray-500 text-sm">{moment(userData?.dob).format("MMM dd, yyyy")}</div>
                        </div>
                      </div>
                      {/* {isMyProfile && (
                        <div className="flex items-center space-x-2">
                        <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                          <FaGlobe className="text-gray-600 text-sm" />
                        </button>
                        <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                          <FaEdit className="text-gray-600 text-sm" />
                        </button>
                      </div>
                      )} */}
                      
                    </div>
                  </div>
                )}

                {/* Privacy and Legal Info Section */}
                {activeSection === 'privacy-legal' && (
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Privacy Settings</h4>
                      <p className="text-gray-600 text-sm">Manage who can see your userData information and posts.</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Legal Information</h4>
                      <p className="text-gray-600 text-sm">Terms of service, privacy policy, and data usage information.</p>
                    </div>
                  </div>
                )}

                {/* Profile Transparency Section */}
                {activeSection === 'userData-transparency' && (
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Profile Transparency</h4>
                      <p className="text-gray-600 text-sm">Information about how your userData data is used and shared.</p>
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
                          <div className="text-gray-500 text-sm">{userData?.marital_status_name}</div>
                        </div>
                      </div>
                      {/* {isMyProfile && (
                        <div className="flex items-center space-x-2">
                        <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                          <FaUsers className="text-gray-600 text-sm" />
                        </button>
                        <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                          <FaEdit className="text-gray-600 text-sm" />
                        </button>
                      </div>
                      )} */}
                      
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
                      {/* {isMyProfile && (
                        <div className="flex items-center space-x-2">
                        <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                          <FaLock className="text-gray-600 text-sm" />
                        </button>
                        <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                          <FaEdit className="text-gray-600 text-sm" />
                        </button>
                      </div>
                      )} */}
                      
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

       {/* Edit Details Modal */}
       {privacyDetailsModalOpen && (
        <div className="fixed shadow inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">          
        <div className="bg-white border border-gray-300 rounded-md shadow w-full max-w-2xl max-h-[90vh] ">
            {/* Header */}
            <div className="relative shadow flex items-center justify-center px-4 py-2 border-b border-gray-200 ">
            <h3 className="absolute left-1/2 transform -translate-x-1/2 text-xl font-bold">
              Edit details
            </h3>
            <button 
              onClick={() => dispatch(setPrivacyDetailsModal(false))}
              className="ml-auto cursor-pointer text-xl px-3 bg-gray-100 text-gray-500 hover:text-gray-700 rounded-full p-2 hover:bg-gray-100"
            >
              ✕
            </button>
          </div>

            
            {/* Content */}
            <EditDetails/>
          </div>
        </div>
      )}
    </FeedLayout>
  );
};

export default AboutContent;

