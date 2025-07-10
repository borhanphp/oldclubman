import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  FaEllipsisH,
  FaBookmark,
  FaEdit,
  FaMegaphone,
  FaUserTie,
  FaCamera,
} from "react-icons/fa";
import toast from "react-hot-toast";
import { useParams, usePathname } from "next/navigation";
import {
  followTo,
  getAllFollowers,
  getMyProfile,
  getUserFollowers,
  getUserFollowing,
  getUserProfile,
  unFollowTo,
  bindProfileSettingData,
  storeProfileSetting,
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
  const { profile, userProfileData, followLoading, profileSettingData } = useSelector(
    ({ settings }) => settings
  );
  const data = userProfile ? userProfileData : profile;
  const pathname = usePathname();
  const params = useParams();
  const dispatch = useDispatch();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showChatBox, setShowChatBox] = useState(false);
  const [currentChat, setCurrentChat] = useState(false);
  const [showEditPhotoModal, setShowEditPhotoModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showEditCoverModal, setShowEditCoverModal] = useState(false);
  const [selectedCoverImage, setSelectedCoverImage] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState(null);

  useEffect(() => {
    dispatch(getMyProfile());
  }, [dispatch]);

  const isMyProfile = Number(data?.client?.id) === Number(profile?.client?.id);

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

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      dispatch(bindProfileSettingData({ ...profileSettingData, image: file }));
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveImage = () => {
    if (selectedImage) {
      const formData = new FormData();
      
      // Add the image file to FormData
      if (profileSettingData?.image) {
        formData.append("image", profileSettingData.image);
      }

      // Dispatch the storeProfileSetting action
      dispatch(storeProfileSetting(formData)).then((res) => {
        toast.success("Profile photo updated successfully");
        dispatch(getMyProfile());
        // Close modal and reset local state
        setShowEditPhotoModal(false);
        setSelectedImage(null);
        setImagePreview(null);
      }).catch((error) => {
        toast.error("Failed to update profile photo");
        console.error("Error updating profile photo:", error);
      });
    }
  };

  const handleCancelEdit = () => {
    setShowEditPhotoModal(false);
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleCoverImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedCoverImage(file);
      dispatch(bindProfileSettingData({ ...profileSettingData, cover_photo: file }));
      const reader = new FileReader();
      reader.onload = (e) => {
        setCoverImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveCoverImage = () => {
    if (selectedCoverImage) {
      const formData = new FormData();
      
      // Add the cover photo file to FormData
      if (profileSettingData?.cover_photo) {
        formData.append("cover_photo", profileSettingData.cover_photo);
      }

      // Dispatch the storeProfileSetting action
      dispatch(storeProfileSetting(formData)).then((res) => {
        toast.success("Cover photo updated successfully");
        dispatch(getMyProfile());
        dispatch(getUserProfile())
        // Close modal and reset local state
        setShowEditCoverModal(false);
        setSelectedCoverImage(null);
        setCoverImagePreview(null);
      }).catch((error) => {
        toast.error("Failed to update cover photo");
        console.error("Error updating cover photo:", error);
      });
    }
  };

  const handleCancelCoverEdit = () => {
    setShowEditCoverModal(false);
    setSelectedCoverImage(null);
    setCoverImagePreview(null);
  };

  return (
    <div className="">
      {/* Cover Photo */}
      <div className="cover-photo rounded-t-md relative w-full h-60 overflow-hidden group">
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
        
        {/* Edit Cover Photo Button */}
        {data?.client && isMyProfile && (
          <div className="absolute bottom-4 right-4">
            <button
              onClick={() => setShowEditCoverModal(true)}
              className="bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-700 px-3 py-2 rounded-md flex items-center gap-2 shadow-md transition-all duration-200 opacity-0 group-hover:opacity-100"
            >
              <FaCamera className="text-sm" />
              <span className="text-sm font-medium">Edit Cover</span>
            </button>
          </div>
        )}
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
              {/* Edit Photo Overlay */}
              {data?.client && isMyProfile && (
                <div 
                className="absolute cursor-pointer flex items-center justify-center bottom-3 right-2 w-7 h-7 bg-gray-400 rounded-full"
                onClick={() => setShowEditPhotoModal(true)}
              >
                <div className="text-black text-sm font-medium flex flex-col items-center">
                  <FaCamera className="" />
                </div>
              </div>
              )}
              
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
             <>
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
                <Link
                href={`/user/account-settings`}
                className={`px-6 py-3 font-medium ${
                  isLinkActive(
                    `/user/account-settings`
                  )
                    ? "text-blue-500 border-b-2 border-blue-500"
                    : "text-gray-600"
                }`}
              >
                SETTINGS
              </Link>
             </>
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

      {/* Edit Photo Modal */}
      {showEditPhotoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Edit Profile Photo</h2>
              <button
                onClick={handleCancelEdit}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="mb-4">
              <div className="flex flex-col items-center">
                {/* Current/Preview Image */}
                <div className="w-32 h-32 rounded-full border-4 border-gray-200 overflow-hidden mb-4">
                  <img
                    src={
                      imagePreview || 
                      (data?.client?.image
                        ? process.env.NEXT_PUBLIC_CLIENT_FILE_PATH + data.client.image
                        : "/common-avator.jpg")
                    }
                    className="w-full h-full object-cover"
                    alt="Profile Preview"
                  />
                </div>
                
                {/* File Input */}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                  id="photo-upload"
                />
                <label
                  htmlFor="photo-upload"
                  className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600 transition-colors"
                >
                  Choose Photo
                </label>
              </div>
            </div>
            
            {/* Modal Actions */}
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveImage}
                disabled={!selectedImage}
                className={`px-4 py-2 rounded ${
                  selectedImage
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Save Photo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Cover Photo Modal */}
      {showEditCoverModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Edit Cover Photo</h2>
              <button
                onClick={handleCancelCoverEdit}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="mb-4">
              <div className="flex flex-col items-center">
                {/* Current/Preview Cover Image */}
                <div className="w-full h-40 rounded-lg border-4 border-gray-200 overflow-hidden mb-4">
                  <img
                    src={
                      coverImagePreview || 
                      (data?.client?.cover_photo
                        ? process.env.NEXT_PUBLIC_CLIENT_FILE_PATH + data.client.cover_photo
                        : "/oldman-bg.jpg")
                    }
                    className="w-full h-full object-cover"
                    alt="Cover Preview"
                  />
                </div>
                
                {/* File Input */}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverImageSelect}
                  className="hidden"
                  id="cover-photo-upload"
                />
                <label
                  htmlFor="cover-photo-upload"
                  className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600 transition-colors"
                >
                  Choose Cover Photo
                </label>
              </div>
            </div>
            
            {/* Modal Actions */}
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancelCoverEdit}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCoverImage}
                disabled={!selectedCoverImage}
                className={`px-4 py-2 rounded ${
                  selectedCoverImage
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Save Cover Photo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FeedHeader;
