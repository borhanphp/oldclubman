"use client"

import {  getMyProfile } from "@/views/settings/store";
import Link from "next/link";
import React, { useEffect } from "react";
import { FaEllipsisH } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";

const Intro = () => {
  const {profile} = useSelector(({settings}) => settings)
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getMyProfile());
  }, [dispatch])

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold">INTRO</h3>
        <Link href="/user/account-settings" className="text-blue-500 p-1 rounded">
          <FaEllipsisH />
        </Link>
      </div>

      <div className="text-center">
        <div>
        {profile?.client?.profile_overview}
        </div>
        <div>
        {profile?.client?.tagline}
        </div>
      </div>
      <div className="text-center py-4">
        <div className="stats flex justify-between px-8 mb-4">
          <div className="text-center">
            <div className="font-semibold">{profile?.post?.total || 0}</div>
            <div className="text-sm text-gray-500">Post</div>
          </div>
          <div className="text-center">
            <div className="font-semibold">{profile.followers && profile.followers || 0}</div>
            <div className="text-sm text-gray-500">Followers</div>
          </div>
          <div className="text-center">
            <div className="font-semibold">{profile.following && profile.following || 0}</div>
            <div className="text-sm text-gray-500">Following</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Intro;
