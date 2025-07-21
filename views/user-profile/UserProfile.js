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

const UserProfile = () => {
  const { userProfileData, profileData } = useSelector(({ settings }) => settings);
  const { isPostModalOpen} = useSelector(({gathering}) => gathering);
  const dispatch = useDispatch();
  const params = useParams();

  useEffect(() => {
    dispatch(getMyProfile());
    dispatch(getUserProfile(params?.id));
  }, []);

  console.log('userProfileData from intro',userProfileData)

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
                <h3 className="text-2xl font-semibold mb-1">Intro</h3>
                <div className="text-gray-700 text-center mb-2">
                  {userProfileData?.client?.profile_overview || ""}
                </div>
                <div className="text-gray-700 text-center mb-2">
                  {userProfileData?.client?.tagline || userProfileData?.client?.profile_overview || ""}
                </div>
               
                <div className="border mb-2"></div>
                <ul className="space-y-2 text-md">
                  <li className="flex items-center gap-2">
                    <FaInfoCircle className="text-gray-500" />
                    <span>
                      <span className="font-semibold">Profile</span>
                      {userProfileData?.client?.profile_overview ? ` · ${userProfileData.client.profile_overview}` : ""}
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <FaBriefcase className="text-gray-500" />
                    <span>
                     {userProfileData?.client?.designation}
                    </span>
                  </li>
                  {/* <li className="flex items-center gap-2">
                    <FaBriefcase className="text-gray-500" />
                    <span>
                      Former Frontend Software Developer at <span className="font-bold">Quadron Technologies</span>
                    </span>
                  </li> */}
                  {/* <li className="flex items-center gap-2">
                    <FaGraduationCap className="text-gray-500" />
                    <span>
                      Studied at <span className="font-bold">University of Chittagong</span>
                    </span>
                  </li> */}
                  {userProfileData?.client?.profile_visibility?.city === "public" && (
                    <li className="flex items-center gap-2">
                    <FaHome className="text-gray-500" />
                    <span>
                      Lives in <span className="font-bold">{userProfileData?.client?.currentstate?.name}</span>
                    </span>
                  </li>
                  )}
                  {userProfileData?.client?.profile_visibility?.location === "public" && (
                  <li className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-gray-500" />
                    <span>
                      From <span className="font-bold">{userProfileData?.client?.fromcity?.name}</span>
                    </span>
                  </li>)}
                  {userProfileData?.client?.profile_visibility?.dob === "public" && (
                  <li className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-gray-500" />
                    <span>
                      Born <span className="font-bold">{userProfileData?.client?.dob}</span>
                    </span>
                  </li>)}
                  {userProfileData?.client?.profile_visibility?.marital_status === "public" && (
                  <li className="flex items-center gap-2">
                    <FaHeart className="text-gray-500" />
                    <span>
                      Relationship <span className="font-bold">{userProfileData?.client?.marital_status_name}</span>
                    </span>
                  </li>)}
                 
                </ul>
                {/* <button className="w-full bg-gray-100 text-gray-700 py-1 rounded mt-3 font-medium hover:bg-gray-200 flex items-center justify-center gap-2">
                  <FaEdit /> Edit details
                </button> */}
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
                            process.env.NEXT_PUBLIC_FILE_PATH +
                            "/" +
                            photo
                          }
                          alt={`Photo ${index + 1}`}
                          className="w-full h-full object-cover"
                          // onError={(e) => {
                          //   e.target.onerror = null;
                          //   e.target.src = "/placeholder-image.jpg";
                          // }}
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
    </div>
    </FeedLayout>
  );
};

export default UserProfile;
