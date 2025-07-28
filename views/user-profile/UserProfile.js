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
  FaRegCalendarPlus,
  FaPlus,
  FaInfoCircle,
  FaBriefcase,
  FaGraduationCap,
  FaHome,
  FaInstagram,
  FaEdit,
  FaHeart
} from "react-icons/fa";
import PostModal from "@/components/custom/PostModal";
import FeedHeader from "@/components/common/FeedHeader";
import Intro from "@/components/common/Intro";
import { useDispatch, useSelector } from "react-redux";
import { getMyProfile, getUserProfile } from "../settings/store";
import moment from "moment";
import CreatePostBox from "@/components/common/CreatePostBox";
import PostList from "@/components/common/PostList";
import { useParams } from "next/navigation";
import { CiHeart, CiLocationOn } from "react-icons/ci";
import FeedLayout from "@/components/common/FeedLayout";
import EditDetails from "../about/EditDetails";

const UserProfile = () => {
  const { userProfileData, profileData } = useSelector(({ settings }) => settings);
  const { isPostModalOpen} = useSelector(({gathering}) => gathering);
  const dispatch = useDispatch();
  const params = useParams();

  const isMyProfile = Number(params?.id) === Number(profileData?.id);
  
  // State for edit bio modal
  const [isEditBioOpen, setIsEditBioOpen] = useState(false);
  const [bioText, setBioText] = useState("");
  const [bioPrivacy, setBioPrivacy] = useState("public");
  
  // State for edit details modal
  const [isEditDetailsOpen, setIsEditDetailsOpen] = useState(false);
  const [profileInfo, setProfileInfo] = useState({
    sex: "",
    dateOfBirth: "",
    placeOfBirth: "",
    currentCity: "",
    relationshipStatus: "",
    contact: "",
    email: "",
    bloodGroup: ""
  });
  const [visibilitySettings, setVisibilitySettings] = useState({
    sex: true,
    dateOfBirth: true,
    placeOfBirth: true,
    currentCity: true,
    relationshipStatus: true,
    contact: false,
    email: false,
    bloodGroup: false
  });

  // Handle privacy toggle
  const handlePrivacyToggle = (field) => {
    setVisibilitySettings((prev) => {
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
      // dispatch(storeBsicInformation({
      //   ...profileData,
      //   profile_visibility: JSON.stringify(profile_visibility)
      // }));

      return newSettings;
    });
  };

  useEffect(() => {
    dispatch(getMyProfile());
    dispatch(getUserProfile(params?.id));
  }, []);

  // Set bio text when userProfileData changes
  useEffect(() => {
    if (userProfileData?.client?.tagline || userProfileData?.client?.profile_overview) {
      setBioText(userProfileData?.client?.tagline || userProfileData?.client?.profile_overview || "");
    }
  }, [userProfileData]);

  return (
    <FeedLayout showMsgBtn={true} showFriends={true} userProfile={true}>
      <div className="about-content">

      {/* Content Area - 3 Column Layout */}
      <div className="content-area py-3">
        <div className="mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Left Sidebar - INTRO */}
            <div className="md:col-span-5">
              <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                <h3 className="text-2xl font-semibold mb-3">Intro</h3>
                
                {/* Bio Section */}
                {!isEditBioOpen ? (
                  <>
                    <div className="text-gray-700 text-center mb-3">
                      {userProfileData?.client?.tagline || userProfileData?.client?.profile_overview || "Software Developer | Entrepreneur | Digital Marketer"}
                    </div>
                     
                     {/* Edit Bio Button */}
                    {isMyProfile && (
                      <div className="text-center mb-4">
                      <button 
                        onClick={() => setIsEditBioOpen(true)}
                        className="w-full bg-gray-100 text-gray-700 py-1 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                      >
                        Edit bio
                      </button>
                    </div>
                    )}
                   
                    
                  </>
                ) : (
                  <>
                    {/* Bio Input */}
                    <div className="mb-4">
                      <textarea
                        value={bioText}
                        onChange={(e) => setBioText(e.target.value)}
                        placeholder="Software Developer | Entrepreneur | Digital Marketer"
                        className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        rows={3}
                        maxLength={150}
                      />
                      <div className="text-right mt-1">
                        <span className="text-sm text-gray-500">
                          {150 - bioText.length} characters remaining
                        </span>
                      </div>
                    </div>
                    
                    {/* Privacy Setting */}
                    <div className="flex items-center gap-2 mb-4">
                      <FaGlobe className="text-gray-500 text-sm" />
                      <span className="text-sm text-gray-700">Public</span>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-3 justify-end">
                      <button
                        onClick={() => setIsEditBioOpen(false)}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          // Here you would typically save the bio to your backend
                          console.log('Saving bio:', bioText);
                          setIsEditBioOpen(false);
                        }}
                        disabled={!bioText.trim()}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          bioText.trim() 
                            ? 'bg-blue-500 text-white hover:bg-blue-600' 
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        Save
                      </button>
                    </div>
                  </>
                )}
                
                {/* Profile Info List */}
                <ul className="space-y-3 text-sm">
                  {/* Profile Type */}
                  <li className="flex items-center gap-3">
                    <FaInfoCircle className="text-gray-500 text-base" />
                    <span className="text-gray-700">
                      <span className="font-semibold">Profile</span>
                      {userProfileData?.client?.profile_overview ? ` · ${userProfileData.client.profile_overview}` : " · Digital creator"}
                    </span>
                  </li>
                  
                  {/* Current Work */}
                  {userProfileData?.client?.designation && (
                    <li className="flex items-center gap-3">
                      <FaBriefcase className="text-gray-500 text-base" />
                      <span className="text-gray-700">
                        {userProfileData?.client?.designation}
                        {userProfileData?.client?.company && ` at ${userProfileData.client.company}`}
                      </span>
                    </li>
                  )}
                  
                  {/* Previous Work - You can add this if you have the data */}
                  {/* <li className="flex items-center gap-3">
                    <FaBriefcase className="text-gray-500 text-base" />
                    <span className="text-gray-700">
                      Former Frontend Software Developer at <span className="font-bold">Quadrion Technologies</span>
                    </span>
                  </li> */}
                  
                  {/* Education - You can add this if you have the data */}
                  {/* <li className="flex items-center gap-3">
                    <FaGraduationCap className="text-gray-500 text-base" />
                    <span className="text-gray-700">
                      Studied at <span className="font-bold">University of Chittagong</span>
                    </span>
                  </li> */}
                  
                  {/* Location - Lives in */}
                  {userProfileData?.client?.profile_visibility?.city === "public" && userProfileData?.client?.currentstate?.name && (
                    <li className="flex items-center gap-3">
                      <FaHome className="text-gray-500 text-base" />
                      <span className="text-gray-700">
                        Lives in <span className="font-bold">{userProfileData?.client?.currentstate?.name}</span>
                      </span>
                    </li>
                  )}
                  
                  {/* Location - From */}
                  {userProfileData?.client?.profile_visibility?.location === "public" && userProfileData?.client?.fromcity?.name && (
                    <li className="flex items-center gap-3">
                      <FaMapMarkerAlt className="text-gray-500 text-base" />
                      <span className="text-gray-700">
                        From <span className="font-bold">{userProfileData?.client?.fromcity?.name}</span>
                      </span>
                    </li>
                  )}
                  
                  {/* Date of Birth */}
                  {userProfileData?.client?.profile_visibility?.dob === "public" && userProfileData?.client?.dob && (
                    <li className="flex items-center gap-3">
                      <FaBirthdayCake className="text-gray-500 text-base" />
                      <span className="text-gray-700">
                        Born <span className="font-bold">{userProfileData?.client?.dob}</span>
                      </span>
                    </li>
                  )}
                  
                  {/* Marital Status */}
                  {userProfileData?.client?.profile_visibility?.marital_status === "public" && userProfileData?.client?.marital_status_name && (
                    <li className="flex items-center gap-3">
                      <FaHeart className="text-gray-500 text-base" />
                      <span className="text-gray-700">
                        Relationship <span className="font-bold">{userProfileData?.client?.marital_status_name}</span>
                      </span>
                    </li>
                  )}
                  
                  {/* Social Media - You can add this if you have the data */}
                  {/* <li className="flex items-center gap-3">
                    <FaInstagram className="text-gray-500 text-base" />
                    <span className="text-gray-700">
                      <span className="text-blue-600 font-semibold">borhanclick</span> · 675 followers
                    </span>
                    <div className="text-xs text-gray-500 mt-1">Confirmed link</div>
                  </li> */}
                </ul>
                
                {/* Edit Details Button */}
                {isMyProfile && (
                  <div className="text-center mt-4">
                  <button 
                    onClick={() => setIsEditDetailsOpen(true)}
                    className="w-full bg-gray-100 text-gray-700 py-1 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <FaEdit className="text-xs" /> Edit details
                  </button>
                </div>
                )}
                
              </div>

              {/* Photos Section */}
              <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                <h3 className="text-lg font-semibold mb-3">Photos</h3>
                {userProfileData?.photos &&
                userProfileData?.photos?.length > 0 ? (
                  <div className="grid grid-cols-3 gap-2">
                    {userProfileData?.photos?.map((photo, index) => (
                      <div
                        key={index}
                        className="aspect-square overflow-hidden rounded-md cursor-pointer hover:opacity-90 transition-opacity"
                      >
                        <img
                          src={
                            (process.env.NEXT_PUBLIC_CLIENT_FILE_PATH ? process.env.NEXT_PUBLIC_CLIENT_FILE_PATH + photo : "/uploads/" + photo)
                          }
                          alt={`Photo ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Try alternative paths
                            const currentSrc = e.target.src;
                            if (!currentSrc.includes('/uploads/') && !photo.startsWith('http')) {
                              e.target.src = `/uploads/${photo}`;
                            } else if (!currentSrc.includes('/public/') && !photo.startsWith('http')) {
                              e.target.src = `/public/uploads/client/${photo}`;
                            } else {
                              e.target.onerror = null;
                              e.target.src = "/profile-avatar.png";
                            }
                          }}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state text-gray-400 text-sm py-4 text-center">
                    <p>No photos to display</p>
                  </div>
                )}
              </div>

              {/* Who to follow Widget */}
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="text-lg font-semibold mb-3">Who to follow</h3>
                <div className="empty-state text-gray-400 text-sm py-4">
                  {/* Empty state */}
                </div>
              </div>
            </div>

            {/* Center Content - PROFILE INFO */}
            <div className="md:col-span-7">
            {+profileData?.id === +params?.id && ( <CreatePostBox /> )}

              {/* Post */}
              <PostList postsData={userProfileData?.post} />
            </div>
          </div>
        </div>
      </div>

      {/* Post Modal for Edit functionality */}
      {isPostModalOpen && <PostModal />}
      
      {/* Edit Details Modal */}
      {isEditDetailsOpen && (
        <div className="fixed shadow inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">          
        <div className="bg-white  rounded-lg w-full max-w-2xl max-h-[90vh] ">
            {/* Header */}
            <div className="relative shadow flex items-center justify-center px-4 py-2 border-b border-gray-200 ">
            <h3 className="absolute left-1/2 transform -translate-x-1/2 text-xl font-bold">
              Edit details
            </h3>
            <button 
              onClick={() => setIsEditDetailsOpen(false)}
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
      
    </div>
    </FeedLayout>
  );
};

export default UserProfile;
