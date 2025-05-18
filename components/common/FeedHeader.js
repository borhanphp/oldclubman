import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaEllipsisH, FaBookmark, FaEdit, FaMegaphone } from "react-icons/fa";
import { usePathname } from "next/navigation";
import { followTo, getAllFollowers, getMyProfile } from "@/views/settings/store";
import { useDispatch, useSelector } from "react-redux";

function FeedHeader({ userProfile = false }) {
  const { profile, userProfileData } = useSelector(({ settings }) => settings);
  const data = userProfile ? userProfileData : profile;
  const pathname = usePathname();
  const dispatch = useDispatch();
  const [showDropdown, setShowDropdown] = useState(false);
  useEffect(() => {
    dispatch(getMyProfile());
  }, [dispatch]);

  const isLinkActive = (path) => {
    return pathname.startsWith(path);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleFollow = (following_id) => {
    console.log('following_id',following_id)
    dispatch(followTo({following_id}));
  }

  return (
    <div className="">
      {/* Cover Photo */}
      <div className="cover-photo rounded-t-md relative w-full h-60 overflow-hidden">
        <div className="absolute inset-0 w-full">
          <img
            src={
              data?.client?.cover_photo
                ? process.env.NEXT_PUBLIC_CLIENT_FILE_PATH +
                  data.client.cover_photo
                : "/oldman-bg.jpg"
            }
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/oldman-bg.jpg";
            }}
          />
        </div>
      </div>

      {/* Profile Section */}
      <div className="data-section bg-white px-6 py-4 relative">
        <div className="flex justify-between ">
          <div className="flex items-end">
            {/* Profile Picture */}
            <div className="data-pic relative -mt-16 mr-4">
              <div className="w-28 h-28 rounded-xl border-4 border-white overflow-hidden bg-white flex items-center justify-center text-white text-2xl">
                <img
                  src={
                    data?.client?.image
                      ? process.env.NEXT_PUBLIC_CLIENT_FILE_PATH +
                        data.client.image
                      : "/common-avator.jpg"
                  }
                  className="w-full h-full object-cover rounded-full"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/common-avator.jpg";
                  }}
                />
              </div>
            </div>

            {/* Profile Info */}
            <div className="data-info mb-2">
              <h2 className="text-xl font-bold">

                {data?.client ? data?.client?.fname + " " + data?.client?.last_name : "Loading..."}
              </h2>
              <p className="text-gray-600 text-sm">
                <span>{data.followers && data.followers} Followers</span> ·{" "}
                <span>{data.following && data.following} Following</span>
              </p>
            </div>
          </div>

          {/* More Options */}
          {userProfile ? (
            <div className="relative ">
              <button
                className={`px-4 py-2 bg-blue-200 mt-2 cursor-pointer rounded font-semibold transition`}
                onClick={() => {handleFollow(data?.client?.id)}}
              >
                Follow
              </button>
            </div>
          ) : (
            <div className="relative ">
              <button
                className="text-gray-600 bg-gray-200 hover:bg-gray-300 p-2 rounded-md cursor-pointer"
                onClick={toggleDropdown}
              >
                <FaEllipsisH />
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-10">
                  <div className="py-2">
                    <button className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-gray-100">
                      <span className="text-gray-700">View As</span>
                    </button>
                    <button className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-gray-100">
                      <span className="text-gray-700">Edit Profile</span>
                    </button>
                    <button className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-gray-100">
                      <span className="text-gray-700">Promote Profile</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="data-nav rounded-b-md bg-white border-t border-b border-gray-200">
        <div className="mx-auto">
          <div className="flex">
            <Link
              href="/user/nfc"
              className={`px-6 py-3 font-medium ${
                isLinkActive("/user/nfc")
                  ? "text-blue-500 border-b-2 border-blue-500"
                  : "text-gray-600"
              }`}
            >
              NFC
            </Link>
            <Link
              href="/user/about"
              className={`px-6 py-3 font-medium ${
                isLinkActive("/user/about")
                  ? "text-blue-500 border-b-2 border-blue-500"
                  : "text-gray-600"
              }`}
            >
              ABOUT
            </Link>
            <Link
              href="/user/gathering"
              className={`px-6 py-3 font-medium ${
                isLinkActive("/user/gathering")
                  ? "text-blue-500 border-b-2 border-blue-500"
                  : "text-gray-600"
              }`}
            >
              GATHERING
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FeedHeader;
