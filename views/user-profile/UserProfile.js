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
import { CiLocationOn } from "react-icons/ci";

const UserProfile = () => {
  const { userProfileData } = useSelector(({ settings }) => settings);
  const dispatch = useDispatch();
  const params = useParams();

  useEffect(() => {
    dispatch(getMyProfile());
    dispatch(getUserProfile(params?.id));
  }, []);

  return (
    <div className="about-content md:max-w-5xl mx-auto">
      <FeedHeader showMsgBtn={true} showFriends={true} userProfile={true} />

      {/* Content Area - 3 Column Layout */}
      <div className="content-area py-3">
        <div className="mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Left Sidebar - INTRO */}
            <div className="md:col-span-5">
              <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold">INTRO</h3>
                  <button className="text-blue-500 p-1 rounded">
                    <FaEllipsisH />
                  </button>
                </div>

                <div className="text-center">
                  <div>{userProfileData?.client?.profile_overview}</div>
                  <div>{userProfileData?.client?.tagline}</div>
                </div>
                <div className="mt-2 py-4 border-t text-gray-500">
                  <div className="flex items-center gap-3">
                    <FaRegCalendarPlus /> Joined on{" "}
                    {moment(userProfileData?.client?.created_at).format(
                      "DD MMM, YYYY"
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <CiLocationOn /> Lives in:{" "}
                    {userProfileData?.client?.current_country}
                  </div>
                </div>
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
              {/* Post */}
              <PostList postsData={userProfileData?.post} />
            </div>
          </div>
        </div>
      </div>

      {/* Floating Chat Button */}
      <div className="fixed bottom-5 right-5">
        <Link href="/messages">
          <button className="bg-blue-500 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg">
            <FaComment size={20} />
          </button>
        </Link>
      </div>
    </div>
  );
};

export default UserProfile;
