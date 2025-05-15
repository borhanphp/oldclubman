import { setPostModalOpen } from "@/views/gathering/store";
import { getMyProfile } from "@/views/settings/store";
import React, { useEffect } from "react";
import { FaVideo } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";

const CreatePostBox = () => {
    const { profile } = useSelector(({ settings }) => settings);
  const dispatch = useDispatch();

  const openPostModal = () => {
    dispatch(setPostModalOpen(true));
  }

  useEffect(() => {
    dispatch(getMyProfile());
  }, []);

  return(
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
    <div className="flex items-center mb-3">
      <div className="w-8 h-8 rounded-full bg-red-400 flex items-center justify-center text-white mr-3 overflow-hidden">
      <img src={process.env.NEXT_PUBLIC_CLIENT_FILE_PATH + profile?.client?.image} className="w-full h-full object-cover" />
      </div>
      <div className="flex-grow">
        <input 
          type="text" 
          placeholder="Share your thoughts..." 
          className="focus:outline-none w-full bg-white px-4 py-2 text-sm cursor-text"
          onClick={() => {openPostModal()}}
          readOnly
        />
      </div>
    </div>
    <div className="flex border-gray-100 pt-3">
      <button 
        className="flex items-center text-gray-500 bg-gray-100 rounded-md px-3 py-1 text-sm"
        onClick={() => {openPostModal()}}
      >
        <FaVideo className="mr-2 text-blue-500" />
        <span>Video</span>
      </button>
    </div>
  </div>
  )

};

export default CreatePostBox;