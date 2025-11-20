"use client";

import React, { useState, useRef, useContext, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { SocialIcon } from "react-social-icons";
import { useDispatch, useSelector } from "react-redux";
import {
  bindNfcData,
  getMyNfc,
  getNfcField,
  storeNfc,
  updateNfc,
} from "../store";
import Display from "./Display";
import Information from "./Information";
import Fields from "./Fields";
import toast from "react-hot-toast";
import CardClassic from "../nfc-cards/CardClassic";
import CardModern from "../nfc-cards/CardModern";
import CardFlat from "../nfc-cards/CardFlat";
import CardSleek from "../nfc-cards/CardSleek";
import NFCSidebar from '@/components/nfc/NFCSidebar';

const NfcForm = () => {
  const { basicNfcData, fields } = useSelector(({ nfc }) => nfc);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Display");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const tabs = ["Display", "Information", "Fields", "Card"];
  const designOptions = [
    { id: 1, label: "Classic" },
    { id: 2, label: "Modern" },
    { id: 3, label: "Sleek" },
    { id: 4, label: "Flat" },
  ];
  const colorOptions = [
    "#ff0000",
    "#00ffff",
    "#9900ff",
    "#ff00f",
    "#ffff00",
    "#00ff00",
    "#0000ff",
    "#ff00ff",
  ];

  useEffect(() => {
    dispatch(getNfcField());
  }, []);

  const handleInfoChange = (e) => {
    const { name, value } = e.target;
    dispatch(bindNfcData({ ...basicNfcData, [name]: value }));
  };
  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    // Display
    formData.append("design_card_id", basicNfcData.design_card_id);
    formData.append("display_nfc_color", basicNfcData.display_nfc_color);
    formData.append("card_name", basicNfcData.card_name || "Business Card");
    if (basicNfcData.profilePhoto)
      formData.append("profile", basicNfcData.profilePhoto);
    if (basicNfcData.logo) formData.append("logo", basicNfcData.logo);
    // basicNfcData
    Object.entries(basicNfcData).forEach(([key, value]) => {
      formData.append(key, value);
    });
    // Add fields as arrays for backend
    fields.forEach((field) => {
      formData.append("nfc_id[]", field.id);
      formData.append("nfc_user_name[]", field.nfc_user_name || "");
      formData.append("nfc_label[]", field.nfc_label || field.label || "");
      formData.append("display_name[]", field.display_name || "");
    });

    const udatedData = {
      id: basicNfcData?.id,
      formData,
    };

    const action = basicNfcData?.id
      ? updateNfc(udatedData)
      : storeNfc(formData);

    dispatch(action).then((res) => {
      if (res.error) {
        setLoading(false);
        return;
      } else {
        dispatch(getMyNfc());
        router.push("/user/nfc");
        toast.success(
          basicNfcData?.id ? "Updated Successfully" : "NFC Card created"
        );
        setLoading(false);
      }
    });
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto md:p-5 md:px-10">
        <div className="flex flex-wrap">
          {/* Left Sidebar - Profile */}
          <NFCSidebar />
          
          {/* Right Content */}
          <div className="w-full lg:w-3/4">
            {/* Hero Section */}
            <div className="bg-gradient-to-r rounded-lg from-blue-600 to-purple-600 text-white">
              <div className="max-w-7xl mx-auto px-2 sm:px-2 lg:px-2 py-8">
                <div className="flex flex-col md:flex-row items-center justify-between">
                  <div className="mb-6 md:mb-0">
                    <h1 className="text-4xl font-bold mb-2">{basicNfcData?.id ? 'Edit NFC Card' : 'Create NFC Card'}</h1>
                    <p className="text-blue-100 text-lg">
                      Design and customize your digital business card
                    </p>
                  </div>
                  <Link
                    href="/user/nfc"
                    className="inline-flex items-center space-x-2 bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:shadow-xl transition-all"
                  >
                    <span>Back to Cards</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Main content */}
            <div className="mt-4">
              <div className="bg-white rounded-lg shadow-sm p-2">
                <div className="px-2 py-8">
                  <div className="bg-white rounded-lg overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
            {/* Center Content */}
            <div className="lg:col-span-12 bg-white">
              <div className="flex flex-col md:flex-row w-full">
                {/* Preview Card on the left */}
                <div className="w-full md:w-1/3 flex-shrink-0 p-5">
                  {+basicNfcData.design_card_id === 1 && (
                    <CardClassic basicNfcData={basicNfcData} />
                  )}
                  {+basicNfcData.design_card_id === 2 && (
                    <CardModern basicNfcData={basicNfcData} />
                  )}
                  {+basicNfcData.design_card_id === 3 && (
                    <CardSleek basicNfcData={basicNfcData} />
                  )}
                  {+basicNfcData.design_card_id === 4 && (
                    <CardFlat basicNfcData={basicNfcData} />
                  )}
                </div>
                {/* Tabs and content on the right */}
                <div className="w-full md:w-2/3">
                  <form
                    onSubmit={handleSubmit}
                    className="flex flex-col bg-white p-4 gap-4 w-full"
                  >
                    {/* Tabs */}
                    <div className="border-b border-gray-200">
                      <div className="flex">
                        {tabs?.map((tab) => (
                          <button
                            key={tab}
                            type="button"
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-3 cursor-pointer font-medium ${
                              activeTab === tab
                                ? "text-blue-500 border-b-2 border-blue-500"
                                : "text-gray-600"
                            }`}
                          >
                            {tab}
                          </button>
                        ))}
                      </div>
                    </div>
                    {/* Tab Content */}
                    <div className="">
                      {activeTab === "Display" && (
                        <Display
                          designOptions={designOptions}
                          colorOptions={colorOptions}
                        />
                      )}
                      {activeTab === "Information" && (
                        <Information
                          basicNfcData={basicNfcData}
                          handleInfoChange={basicNfcData.handleInfoChange}
                        />
                      )}
                      {activeTab === "Fields" && <Fields />}
                      {activeTab === "Card" && (
                        <div className="py-3">
                          <div
                            className="bg-blue-50 border border-blue-100 rounded-lg flex items-center gap-3 px-6 py-4 mb-6"
                            style={{ maxWidth: 500 }}
                          >
                            <SocialIcon
                              network="info"
                              style={{ height: 32, width: 32 }}
                              bgColor="transparent"
                              fgColor="#64748b"
                            />
                            <span className="text-gray-600 text-base">
                              This field does not appear on the card.
                            </span>
                          </div>
                          <div className="mb-2">
                            <label className="block text-gray-700 text-md mb-2">
                              Card Name
                            </label>
                            <input
                              type="text"
                              placeholder="Card Name"
                              className="w-full max-w-md border border-gray-300 rounded px-3 py-2 text-base"
                              name="card_name"
                              value={basicNfcData.card_name || ""}
                              onChange={handleInfoChange}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    {/* Save button always visible at the bottom */}
                    <div className="flex justify-end mt-4">
                      <Link
                        href="/user/nfc"
                        className="px-6 py-2 cursor-pointer bg-gray-500 text-white rounded mr-2"
                      >
                        Cancel
                      </Link>
                      {loading ? 
                       <div
                       className="px-6 py-2 cursor-pointer bg-blue-300 text-white rounded"
                     >
                       Loading...
                     </div>
                      :
                      <button
                        type="submit"
                        className="px-6 py-2 cursor-pointer bg-blue-600 text-white rounded"
                      >
                        {basicNfcData?.id ? "Update" : "Save"}
                      </button>}
                    </div>
                  </form>
                </div>
                </div>
              </div>
            </div>
          </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NfcForm;
