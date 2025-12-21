"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  bindProfileSettingData,
  getMyProfile,
  getUserProfile,
  getUserProfileByUsername,
  storeProfileSetting,
} from "../store";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

const ProfileSettings = () => {
  const { profileSettingData, loading, profile } = useSelector(
    ({ settings }) => settings
  );

  const [profilePhotoPreview, setProfilePhotoPreview] = useState(
    profileSettingData?.image || null
  );
  const [coverPhotoPreview, setCoverPhotoPreview] = useState(
    profileSettingData?.cover_photo || null
  );
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useDispatch();
  const profilePhotoRef = useRef(null);
  const coverPhotoRef = useRef(null);

  const { cover_photo, image, profile_overview, tagline } = profileSettingData;

  useEffect(() => {
    setProfilePhotoPreview(
      process.env.NEXT_PUBLIC_CLIENT_FILE_PATH + profileSettingData?.image ||
        null
    );
    setCoverPhotoPreview(
      process.env.NEXT_PUBLIC_CLIENT_FILE_PATH +
        profileSettingData?.cover_photo || null
    );
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "profile_overview") {
      if (value?.length <= 300) {
        dispatch(
          bindProfileSettingData({ ...profileSettingData, [name]: value })
        );
      } else {
        toast.error("You can not write more then 300 charecter");
      }
    } else {
      if (value?.length <= 14) {
        dispatch(
          bindProfileSettingData({ ...profileSettingData, [name]: value })
        );
      } else {
        toast.error("You can not write more then 14 charecter");
      }
    }
  };

  const handleProfilePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      dispatch(bindProfileSettingData({ ...profileSettingData, image: file }));
      const reader = new FileReader();
      reader.onload = () => {
        setProfilePhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverPhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      dispatch(
        bindProfileSettingData({ ...profileSettingData, cover_photo: file })
      );
      const reader = new FileReader();
      reader.onload = () => {
        setCoverPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerProfilePhotoUpload = () => {
    profilePhotoRef.current.click();
  };

  const triggerCoverPhotoUpload = () => {
    coverPhotoRef.current.click();
  };

  const storeProfileSettings = async (e) => {
    e.preventDefault();

    try {
      // Create FormData object
      const formData = new FormData();

      // Add text fields
      formData.append("profile_overview", profile_overview);
      formData.append("tagline", tagline);

      // Add files if they exist
      if (image) {
        formData.append("image", image);
      }

      if (cover_photo) {
        formData.append("cover_photo", cover_photo);
      }

      const submittedData = {
        ...profileSettingData, // or ...profileData, or your full profile object
        profile_visibility: profileSettingData?.profile_visibility
      }


      dispatch(storeProfileSetting(submittedData)).then((res) => {
        toast.success("Successfully Updated");
        dispatch(getMyProfile());
        
        // Reload user profile by username if available
        const username = profileSettingData?.username || profile?.client?.username;
        if (username) {
          dispatch(getUserProfileByUsername(username));
        }
      });
    } catch (error) {
      console.error("Error saving profile settings:", error);
      setErrorMessage("Failed to save profile settings. Please try again.");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-8">Profile Settings</h2>

      <form onSubmit={storeProfileSettings}>
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-600">
              Profile Photo{" "}
              <span className="text-gray-500 text-sm font-normal">
                Recommended Size (128×128)
              </span>
            </label>
          </div>

          <div className="flex items-center gap-3">
            {(profilePhotoPreview && profileSettingData?.image) ? (
              <div className="w-16 h-16 rounded-full overflow-hidden mr-2">
                <img
                  src={profilePhotoPreview || "/common-avator.jpg"}
                  alt="Profile Preview"
                  className="w-full h-full object-cover"
                />

              </div>
            ):
            <div className="w-16 h-16 rounded-full overflow-hidden mr-2">
            <img
              src={"/common-avator.jpg"}
              alt="Profile Preview"
              className="w-full h-full object-cover"
            />

          </div>
            }
            <button
              type="button"
              onClick={triggerProfilePhotoUpload}
              className="px-4 py-2 border border-gray-300 rounded-md bg-white text-sm text-gray-700 hover:bg-gray-50 focus:outline-none"
            >
              Choose File
            </button>
            <span className="text-gray-500 text-sm">
              {image ? image.name : "No file chosen"}
            </span>
            <input
              type="file"
              ref={profilePhotoRef}
              className="hidden"
              accept="image/*"
              onChange={handleProfilePhotoChange}
            />
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-600">
              Cover Photo{" "}
              <span className="text-gray-500 text-sm font-normal">
                Recommended Size (1090×250)
              </span>
            </label>
          </div>

          <div className="flex items-center gap-3">
            {(profileSettingData?.cover_photo && coverPhotoPreview ) ? (
              <div className="w-24 h-12 rounded overflow-hidden mr-2">
                <img
                  src={coverPhotoPreview}
                  alt="Cover Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : 
            <div className="w-24 h-12 rounded overflow-hidden mr-2">
                <img
                  src={"/oldman-bg.jpg"}
                  alt="Cover Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            }
            <button
              type="button"
              onClick={triggerCoverPhotoUpload}
              className="px-4 py-2 border border-gray-300 rounded-md bg-white text-sm text-gray-700 hover:bg-gray-50 focus:outline-none"
            >
              Choose File
            </button>
            <span className="text-gray-500 text-sm">
              {cover_photo ? cover_photo.name : "No file chosen"}
            </span>
            <input
              type="file"
              name="cover_photo"
              ref={coverPhotoRef}
              className="hidden"
              accept="image/*"
              onChange={handleCoverPhotoChange}
            />
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label
              htmlFor="profileOverview"
              className="block text-sm font-medium text-gray-600"
            >
              Profile Overview{" "}
              <span className="text-gray-500 text-sm font-normal">
                (For Intro)
              </span>
            </label>
          </div>

          <textarea
            id="profile_overview"
            name="profile_overview"
            rows={5}
            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Profile Overview (Required)"
            value={profile_overview}
            onChange={handleChange}
            required
          ></textarea>

          <div className="text-right mt-1">
            <span className="text-sm text-gray-500">
              Character limit: {Number(300) - Number(profile_overview?.length)}
            </span>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label
              htmlFor="tagline"
              className="block text-sm font-medium text-gray-600"
            >
              Tagline{" "}
              <span className="text-gray-500 text-sm font-normal">
                (For Intro)
              </span>
            </label>
          </div>

          <textarea
            id="tagline"
            name="tagline"
            rows={3}
            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Tagline (Required)"
            value={tagline}
            onChange={handleChange}
            required
          ></textarea>

          <div className="text-right mt-1">
            <span className="text-sm text-gray-500">
              Character limit: {Number(14) - Number(tagline?.length)}
            </span>
          </div>
        </div>

        <div className="mt-8 text-right">
          <button
            type="submit"
            className={`${
              loading
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            } text-white cursor-pointer px-6 py-2.5 rounded-md transition`}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileSettings;
