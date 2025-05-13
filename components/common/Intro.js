import { getAllFollowers, getMyProfile } from "@/views/settings/store";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";
import { FaEllipsisH } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";

const Intro = () => {
  const {profileData, myFollowers, personalPosts, totalFollowers} = useSelector(({settings}) => settings)

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getMyProfile());
    dispatch(getAllFollowers())
  }, [])

  console.log(profileData)
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold">INTRO</h3>
        <button className="text-blue-500 p-1 rounded">
          <FaEllipsisH />
        </button>
      </div>

      <div className="text-center">
        <div>
        {profileData?.profile_overview}
        </div>
        <div>
        {profileData?.tagline}
        </div>
      </div>
      <div className="text-center py-4">
        <div className="stats flex justify-between px-8 mb-4">
          <div className="text-center">
            <div className="font-semibold">{personalPosts?.length}</div>
            <div className="text-sm text-gray-500">Post</div>
          </div>
          <div className="text-center">
            <div className="font-semibold">{totalFollowers && totalFollowers}</div>
            <div className="text-sm text-gray-500">Followers</div>
          </div>
          <div className="text-center">
            <div className="font-semibold">0</div>
            <div className="text-sm text-gray-500">Following</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Intro;
