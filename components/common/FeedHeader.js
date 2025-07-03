import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  FaEllipsisH,
  FaBookmark,
  FaEdit,
  FaMegaphone,
  FaUserTie,
} from "react-icons/fa";
import { useParams, usePathname } from "next/navigation";
import {
  followTo,
  getAllFollowers,
  getMyProfile,
  getUserFollowers,
  getUserFollowing,
  getUserProfile,
  unFollowTo,
} from "@/views/settings/store";
import { useDispatch, useSelector } from "react-redux";
import { LuMessageCircleMore } from "react-icons/lu";
import ChatBox from "./ChatBox";
import { getMessage, startConversation } from "@/views/message/store";

function FeedHeader({
  userProfile = false,
  friendsTab = false,
  showMsgBtn = false,
  showFriends = false,
  showEditBtn = false,
}) {
  const { profile, userProfileData, followLoading } = useSelector(
    ({ settings }) => settings
  );
  const data = userProfile ? userProfileData : profile;
  const pathname = usePathname();
  const params = useParams();
  const dispatch = useDispatch();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showChatBox, setShowChatBox] = useState(false);
  const [currentChat, setCurrentChat] = useState(false);

  useEffect(() => {
    dispatch(getMyProfile());
  }, [dispatch]);

  const isMyProfile = Number(params?.id) === Number(profile?.client?.id);

  const isLinkActive = (path) => {
    return pathname.startsWith(path);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleFollow = (following_id) => {
    const action =
      userProfileData?.isfollowed === 1
        ? unFollowTo({ following_id })
        : followTo({ following_id });
    dispatch(action).then((res) => {
      dispatch(getUserProfile(params?.id));
    });
  };

  const handleMsgButtonSelect = async (contactId) => {
    try {
      const profileResponse = await dispatch(getUserProfile(contactId)).unwrap();
      const userData = profileResponse?.client;
      
      if (!userData) {
        console.error('No user data received');
        return;
      }

      const newChat = {
        is_group: 0,
        name: userData?.fname + " " + userData?.last_name,
        avatar: userData?.image ? process.env.NEXT_PUBLIC_CLIENT_FILE_PATH + userData?.image : "/common-avator.jpg",
        user_ids: userData?.id
      };

      const conversationResponse = await dispatch(startConversation(newChat)).unwrap();
      
      if (conversationResponse?.conversation) {
        setCurrentChat(conversationResponse.conversation);
        await dispatch(getMessage({ id: conversationResponse.conversation.id }));
        setShowChatBox(true);
      }
    } catch (error) {
      console.error('Error starting conversation:', error);
      alert('Failed to start conversation. Please try again.');
    }
  };

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
              <div className="w-28 -mt-30 h-28 rounded-full border-4 border-white overflow-hidden bg-white flex items-center justify-center text-white text-2xl">
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
                {data?.client
                  ? data?.client?.fname + " " + data?.client?.last_name
                  : "Loading..."}
              </h2>
              <p className="text-gray-600 text-sm">
                <Link
                  href={`/user/user-profile/${
                    userProfile ? params?.id : profile?.client?.id
                  }/friends`}
                >
                  <span className="hover:underline">
                    {data.followers && data.followers} Followers
                  </span>
                </Link>{" "}
                ·{" "}
                <Link
                  href={`/user/user-profile/${
                    userProfile ? params?.id : profile?.client?.id
                  }/friends`}
                >
                  <span className="hover:underline">
                    {data.following && data.following} Following
                  </span>
                </Link>
              </p>
              {showFriends && (
                <div className="flex items-center mt-2">
                  {data?.latest_eight_followers?.map((res, index) => {
                    return (
                      <div
                        key={index}
                        className={`${
                          index !== 0 ? "-ml-2" : ""
                        } cursor-pointer rounded-full w-8 h-8 border-2 border-white overflow-hidden`}
                      >
                        <Link
                          href={`/user/user-profile/${
                            userProfile ? params?.id : profile?.client?.id
                          }/friends`}
                        >
                          <img
                            src={
                              res?.follower_client?.image
                                ? process.env.NEXT_PUBLIC_CLIENT_FILE_PATH +
                                  res.follower_client.image
                                : "/common-avator.jpg"
                            }
                            alt={`Profile ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "/common-avator.jpg";
                            }}
                          />
                        </Link>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* More Options */}
{data?.client && (
          <div className="relative ">
            {userProfile && !isMyProfile && (
              <button
                className={`px-3 py-1 ${
                  userProfileData?.isfollowed === 1
                    ? "bg-red-200"
                    : "bg-blue-200"
                } mt-2 cursor-pointer rounded font-semibold transition`}
                onClick={() => {
                  handleFollow(data?.client?.id);
                }}
              >
                <span className="flex gap-2">
                  <FaUserTie className="mt-1" />{" "}
                  {followLoading
                    ? "Loading..."
                    : userProfileData?.isfollowed === 1
                    ? "UnFollow"
                    : "Follow"}
                </span>
              </button>
            )}
            {showMsgBtn && !isMyProfile && (
              <button
                onClick={() => {handleMsgButtonSelect(data?.client?.id)} }
                className="px-3 py-1 bg-blue-600 text-white ml-1 rounded-sm hover:bg-blue-700 cursor-pointer"
              >
                <span className="flex gap-2">
                  <LuMessageCircleMore className="mt-1" /> Message
                </span>
              </button>
            )}
            {(showEditBtn || isMyProfile) && (
              <button className="px-3 mr-2 py-1 bg-gray-300 text-black ml-1 rounded-sm hover:bg-gray-200 cursor-pointer">
              <Link href="/user/account-settings" className="flex gap-2">
                <FaEdit className="mt-1" /> Edit Profile
              </Link>
              </button>
            )}
           

            {/* <button>
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
                    <Link
                      href="/user/account-settings"
                      className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-gray-100"
                    >
                      <span className="text-gray-700">Edit Profile</span>
                    </Link>
                    <Link
                      href="/user/account-settings"
                      className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-gray-100"
                    >
                      <span className="text-gray-700">Promote Profile</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
            </button> */}
           
          </div>)}
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
            {(userProfile || friendsTab) && (
              <Link
                href={`/user/user-profile/${
                  userProfile ? params?.id : profile?.client?.id
                }/friends`}
                className={`px-6 py-3 font-medium ${
                  isLinkActive(
                    `/user/user-profile/${
                      params?.id || profile?.client?.id
                    }/friends`
                  )
                    ? "text-blue-500 border-b-2 border-blue-500"
                    : "text-gray-600"
                }`}
              >
                FOLLOWERS
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Chat Box */}
      {showChatBox && currentChat && (
        <ChatBox 
          user={data?.client}
          currentChat={currentChat}
          onClose={() => {
            setShowChatBox(false);
            setCurrentChat(null);
          }}
        />
      )}
    </div>
  );
}

export default FeedHeader;
