"use client";
import React, { useEffect, useState, useRef } from "react";
import { FaBullhorn, FaDownload, FaImage } from "react-icons/fa";
import { QRCodeSVG } from "qrcode.react";
import { useDispatch, useSelector } from "react-redux";
import { getMyNfc, getNfcById, getVertualBackground } from "../store";
import html2canvas from "html2canvas";
import domtoimage from 'dom-to-image-more';
import Link from "next/link";
import NFCSidebar from '@/components/nfc/NFCSidebar';
import BodyLayout from "@/components/common/BodyLayout";

const featuredBackgrounds = [
  "/path/to/bg1.jpg",
  "/path/to/bg2.jpg",
  "/path/to/bg3.jpg",
  "/path/to/bg4.jpg",
  "/path/to/bg5.jpg",
  "/path/to/bg6.jpg",
];

const VertualDownload = () => {
  const [selectedBg, setSelectedBg] = useState(featuredBackgrounds[0]);
  const { nfcData, basicNfcData, loading } = useSelector(({ nfc }) => nfc);
  const { isPostModalOpen } = useSelector(({ gathering }) => gathering);

  const dispatch = useDispatch();

  const [cat, setCat] = useState([]);
  const [uploadedBg, setUploadedBg] = useState(null);

  const cardImageRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    dispatch(getMyNfc());
    dispatch(getVertualBackground())
    .then((res) => {
        console.log(res)
        setCat(res.payload.nfc_virtual_categories)
    })
  }, []);

  const handleClickOnCard = (id) => {
    dispatch(getNfcById(id));
  };

  const handleDownloadCardImage = async () => {
    // if (!cardImageRef.current) return;

    // // Wait for all images inside the card to load
    // const images = cardImageRef.current.querySelectorAll('img');
    // await Promise.all(Array.from(images).map(img => {
    //   if (img.complete) return Promise.resolve();
    //   return new Promise(resolve => {
    //     img.onload = img.onerror = resolve;
    //   });
    // }));

    // const canvas = await html2canvas(cardImageRef.current, { useCORS: true, scale: 2 });
    // const imgData = canvas.toDataURL('image/png');
    // const link = document.createElement('a');
    // link.href = imgData;
    // link.download = 'virtual-card.png';
    // link.click();

    if (!cardImageRef.current) return;
  try {
    const dataUrl = await domtoimage.toPng(cardImageRef.current);
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'virtual-card.png';
    link.click();
  } catch (error) {
    console.error('Download failed:', error);
  }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedBg(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <BodyLayout>
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
                    <h1 className="text-4xl font-bold mb-2">Virtual Backgrounds</h1>
                    <p className="text-blue-100 text-lg">
                      Download your NFC card as a virtual background for video calls
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
        <div className="flex flex-col lg:flex-row gap-8">
        <div className="grid grid-cols-10 gap-4">
          {nfcData?.nfc_cards?.data?.map((card, index) => {
            const fullCard = {
              ...card,
              ...card.nfc_info,
              ...card.nfc_design,
              display_nfc_color: card?.card_design?.color,
              profilePhotoUrl:
                process.env.NEXT_PUBLIC_CLIENT_FILE_PATH +
                card?.nfc_info?.image,
              logoUrl:
                process.env.NEXT_PUBLIC_CARD_FILE_PATH +
                card?.card_design?.logo,
            };

            return (
              <div
                className="col-span-1 rounded-xl hover:border hover:border-gray-300 cursor-pointer"
                onClick={() => handleClickOnCard(card?.id)}
              >
                <>
                  <div className="w-full">
                    <div className="bg-white rounded-xl shadow-md overflow-hidden relative">
                      {/* Profile Image with curved bottom edge */}
                      <div className="relative">
                        <div className="w-full h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
                          {fullCard?.profilePhotoUrl ? (
                            <img
                              src={fullCard?.profilePhotoUrl}
                              alt="Profile"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <svg
                              viewBox="0 0 200 200"
                              className="w-480 h-48"
                              style={{ background: "transparent" }}
                            >
                              <circle cx="100" cy="100" r="100" fill="#888" />
                              <ellipse
                                cx="100"
                                cy="90"
                                rx="60"
                                ry="60"
                                fill="#ccc"
                              />
                              <ellipse
                                cx="100"
                                cy="150"
                                rx="75"
                                ry="40"
                                fill="#ccc"
                              />
                            </svg>
                          )}
                        </div>
                        {/* Blue wave */}
                        <div className="absolute left-0 right-0 bottom-0 pointer-events-none">
                          <svg
                            preserveAspectRatio="xMinYMax meet"
                            viewBox="0 0 246 57"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              id="forground"
                              clipRule="evenodd"
                              d="M 214.7168,6.1113281 C 195.65271,5.9023124 172.37742,11.948182 137.87305,32.529297 110.16613,49.05604 86.980345,56.862784 65.015625,57 H 65 v 1 H 246 V 11.453125 C 236.0775,8.6129313 226.15525,6.2367376 214.7168,6.1113281 Z"
                              fill="white"
                              fillRule="evenodd"
                            ></path>
                            <path
                              id="background"
                              clipRule="evenodd"
                              d="M 0,35.773438 V 58 H 65 L 64.97852,57 C 43.192081,57.127508 22.605139,49.707997 0,35.773438 Z "
                              fill="white"
                              fillRule="evenodd"
                            ></path>
                            <path
                              id="wave"
                              clipRule="evenodd"
                              d="m 0,16.7221 v 19.052 C 45.4067,63.7643 82.6667,65.4583 137.873,32.5286 193.08,-0.401184 219.54,3.87965 246,11.4535 V 6.51403 C 185.24,-16.8661 135.913,29.331 97.6933,40.8564 59.4733,52.3818 33.6467,44.1494 0,16.7221 Z "
                              fill={fullCard?.display_nfc_color}
                              fillRule="evenodd"
                            ></path>
                          </svg>
                        </div>
                      </div>
                      {/* Card Info */}
                      <div className="p-4 text-nowrap">
                        {fullCard?.card_name}
                      </div>
                    </div>
                  </div>
                </>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-row gap-8 px-8 py-4">
        {/* Card Preview */}
        <div
          ref={cardImageRef}
          className="relative w-[700px] h-[400px] rounded-lg overflow-hidden shadow-lg"
          style={{
            background: `
              ${uploadedBg ? `url(${uploadedBg}) center/cover,` : `url(${selectedBg}) center/cover,`}
              radial-gradient(circle at 40% 60%, #bfae3c 0%, #6b8e23 100%)
            `,
          }}
        >
          {/* Card Content */}
          <div className="absolute top-6 left-8 text-white">
            {basicNfcData?.prefix && (
              <span className="font-bold">{basicNfcData.prefix} </span>
            )}
            {basicNfcData?.first_name && (
              <span className="font-bold">{basicNfcData.first_name} </span>
            )}
            {basicNfcData?.middle_name && (
              <span className="font-bold">{basicNfcData.middle_name} </span>
            )}
            {basicNfcData?.last_name && (
              <span className="font-bold">{basicNfcData.last_name} </span>
            )}
            {basicNfcData?.suffix && (
              <span className="font-bold">{basicNfcData.suffix} </span>
            )}
            {basicNfcData?.maiden_name && (
              <span className="font-bold">({basicNfcData.maiden_name})</span>
            )}

            <div className="text-base font-normal mt-1">
              {basicNfcData?.accreditations}
            </div>
            <div className="text-base font-normal mt-1">
              {basicNfcData?.title}
            </div>
            <div className="text-base font-normal mt-1">
              {basicNfcData?.company}
            </div>
            <div className="flex items-center mt-2 text-sm">
              <span className="mr-2">📢</span>
              Goes by{" "}
              <span className="font-bold ml-1">
                {basicNfcData.preferred_name}
              </span>{" "}
              <span className="italic text-gray-200 ml-1">
                ({basicNfcData.pronoun})
              </span>
            </div>
          </div>
          {/* QR Code */}
          <div className="absolute top-8 right-8 bg-white p-2 rounded-lg shadow">
            <QRCodeSVG value="https://hihello.me" size={100} />
            <div className="text-xs text-center mt-1 text-gray-700">Hi</div>
          </div>
          {/* Footer */}
          <div className="absolute bottom-4 right-8 text-xs text-white opacity-80">
            Created with{" "}
            <a href="https://hihello.me" className="underline">
              hihello.me
            </a>
          </div>
        </div>
        {/* Download Section */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <button
            className="bg-purple-600 cursor-pointer text-white px-8 py-2 rounded shadow hover:bg-purple-700 mb-2"
            onClick={handleDownloadCardImage}
          >
            Download
          </button>
          <div className="text-xs text-gray-500 text-center">
            Your custom background will show as a very large image.
            <br />
            <a href="#" className="underline">
              How do I use my hihello background?
            </a>
          </div>
        </div>
      </div>
      {/* Background selection */}
      <div className="px-8 py-4">
        <div className="mb-2 text-sm font-semibold">Use Your Own</div>
        <button
          className="border border-dashed border-gray-400 rounded-lg px-4 py-2 text-purple-600 flex items-center gap-2 mb-4"
          onClick={handleUploadClick}
          type="button"
        >
          <FaDownload /> UPLOAD IMAGE
        </button>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
        {cat?.map((dd) => {
            return(
                <div className="mb-5">
                <div className="mb-2 text-sm font-semibold">{dd?.category_name}</div>
                <div className="flex gap-4 ">
                {dd?.backgrounds?.map((bg, idx) => (
                    <button
                    key={idx}
                    className={`w-56 h-32 rounded-lg overflow-hidden border-2 cursor-pointer ${
                        selectedBg === bg ? "border-purple-500" : "border-transparent"
                    }`}
                    onClick={() => setSelectedBg(process.env.NEXT_PUBLIC_BACKGROUND_FILE_PATH + `${bg?.image}`)}
                    >
                    <img
                        src={process.env.NEXT_PUBLIC_BACKGROUND_FILE_PATH + `${bg?.image}`}
                        alt={`bg${idx}`}
                        className="w-full h-full object-cover"
                    />
                    </button>
                ))}
                </div>
                </div>
            )
        })}
        </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </BodyLayout>
  );
};

export default VertualDownload;
