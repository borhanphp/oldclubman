"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";
import {
  FaUserEdit,
  FaImage,
  FaDownload,
  FaEnvelope,
  FaTrash,
  FaCopy,
  FaCode,
  FaEnvelopeOpenText,
  FaCommentDots,
  FaApple,
  FaEdit,
  FaBullhorn,
  FaFilePdf,
  FaQrcode,
  FaRegFilePdf,
} from "react-icons/fa";
import { IoIosList } from "react-icons/io";
import { MdEmail } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { SocialIcon } from "react-social-icons";
import { deleteNfc, duplicateNfc, getNfcById } from "../store";
import moment from "moment";
import toast from "react-hot-toast";
import { QRCodeSVG } from 'qrcode.react';
import CardClassic from "../nfc-cards/CardClassic";
import CardModern from "../nfc-cards/CardModern";
import CardSleek from "../nfc-cards/CardSleek";
import CardFlat from "../nfc-cards/CardFlat";
import { IoQrCodeOutline } from "react-icons/io5";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
const DownloadDropdown = ({ onDownloadPDF, onDownloadQR }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        className="cursor-pointer p-2 sm:p-3 rounded-lg hover:bg-blue-50 transition-colors"
        onClick={() => setOpen((prev) => !prev)}
      >
        <FaDownload size={18} className="sm:w-6 sm:h-6 text-blue-500" />
      </button>
      {open && (
        <div className="absolute left-0 mt-2 w-48 sm:w-52 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          {/* <button
            className="flex items-center cursor-pointer text-sm gap-2 w-full px-4 py-2 text-gray-700 hover:bg-gray-100"
            onClick={() => { setOpen(false); onDownloadPDF(); }}
          >
            <FaRegFilePdf size={13} />  Download PDF of Card
          </button> */}
          <button
            className="flex items-center cursor-pointer w-full text-nowrap text-sm gap-2 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg"
            onClick={() => { setOpen(false); onDownloadQR(); }}
          >
           <IoQrCodeOutline size={14} /> Download QR Code
          </button>
        </div>
      )}
    </div>
  );
};

const NfcDetails = () => {
  const {basicNfcData} = useSelector(({nfc}) => nfc);
  const params = useParams();
  const dispatch = useDispatch();
  console.log('basicNfcData afasdf', basicNfcData)

  const [activeTab, setActiveTab] = useState("code");
  const cardRef = useRef(null);
  const qrRef = useRef(null);

  useEffect(() => {
    dispatch(getNfcById(params?.id))
  }, [])


const handleNfcEdit = () => {
  dispatch(getNfcById(params?.id))
}

const handleDuplicate = () => {
  dispatch(duplicateNfc(params?.id))
}

const handleDelete = () => {
  dispatch(deleteNfc(basicNfcData?.id))
}

const handleCopyLink = () => {
  const url = `${window.location.origin}/card/fb_share/${basicNfcData?.id}`;
  navigator.clipboard.writeText(url)
    .then(() => {
      toast.success("Link copied to clipboard!"); // Optional feedback
    })
    .catch(() => {
      toast.error("Failed to copy link.");
    });
};

const handleDownloadPDF = async () => {
  if (!cardRef.current) return;
  // Use html2canvas to capture the card as an image
  const canvas = await html2canvas(cardRef.current, { useCORS: true, scale: 2 });
  const imgData = canvas.toDataURL('image/png');

  // Create a PDF and add the image
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: [canvas.width, canvas.height]
  });
  pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);

  // Download the PDF
  pdf.save('nfc-card.pdf');
};

const handleDownloadQR = () => {
  const svg = qrRef.current?.querySelector('svg');
  if (!svg) return;

  // Serialize SVG to string
  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(svg);

  // Create a canvas and draw the SVG onto it
  const canvas = document.createElement('canvas');
  canvas.width = 180;
  canvas.height = 180;
  const ctx = canvas.getContext('2d');

  const img = new window.Image();
  const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);

  img.onload = function () {
    ctx.drawImage(img, 0, 0);
    URL.revokeObjectURL(url);

    // Create a link and trigger download
    const a = document.createElement('a');
    a.download = 'qr-code.png';
    a.href = canvas.toDataURL('image/png');
    a.click();
  };
  img.src = url;
};

const cardUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/card/fb_share/${basicNfcData?.id}`;

const handleShareFacebook = () => {
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(cardUrl)}`, '_blank');
};

const handleShareLinkedIn = () => {
  window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(cardUrl)}`, '_blank');
};

const handleShareWhatsApp = () => {
  window.open(`https://wa.me/?text=${encodeURIComponent(cardUrl)}`, '_blank');
};

const handleShareXing = () => {
  window.open(`https://www.xing.com/spi/shares/new?url=${encodeURIComponent(cardUrl)}`, '_blank');
};

const handleShareEmail = () => {
  window.open(`mailto:?subject=Check out my NFC card&body=${encodeURIComponent(cardUrl)}`);
};
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h1 className="text-4xl font-bold mb-2">Preview NFC Card</h1>
              <p className="text-blue-100 text-lg">
                View and manage your digital business card
              </p>
            </div>
            <Link
              href="/user/nfc"
              className="inline-flex items-center space-x-2 bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:shadow-xl transition-all"
            >
              <span>All NFC Cards</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white rounded-lg shadow-lg">
            <div className="p-3 sm:p-4 md:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
                <h2 className="text-lg sm:text-xl font-bold">PREVIEW NFC CARD</h2>
                <Link href="/user/nfc" className="flex items-center gap-2 px-3 sm:px-4 py-2 cursor-pointer bg-blue-50 hover:text-white text-blue-600 rounded hover:bg-blue-600 transition-colors text-sm">
                  <span className="text-base sm:text-lg hover:text-white">
                    <IoIosList />
                  </span>
                  <span className="font-medium">All NFC CARD</span>
                </Link>
              </div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-4 md:gap-6 lg:gap-8 mb-4 w-full">
                <Link href="/user/nfc/create" className="cursor-pointer p-2 sm:p-3 rounded-lg hover:bg-blue-50 transition-colors" onClick={() => {handleNfcEdit()}}>
                  <FaEdit size={18} className="sm:w-6 sm:h-6 text-blue-500" />
                </Link>
                <Link href="/user/nfc" className="cursor-pointer p-2 sm:p-3 rounded-lg hover:bg-blue-50 transition-colors" onClick={() => {handleDuplicate()}}>
                  <FaCopy size={18} className="sm:w-6 sm:h-6 text-blue-500" />
                </Link>
                <Link href={`/user/nfc/${params?.id}/virtual-background`}>
                <button className="cursor-pointer p-2 sm:p-3 rounded-lg hover:bg-blue-50 transition-colors">
                  <FaImage size={18} className="sm:w-6 sm:h-6 text-blue-500" />
                </button>
                </Link>
                <div className="relative">
                  <DownloadDropdown
                    onDownloadPDF={handleDownloadPDF}
                    onDownloadQR={handleDownloadQR}
                  />
                </div>
                <Link href={`/user/nfc/${params?.id}/email-signature`} className="cursor-pointer p-2 sm:p-3 rounded-lg hover:bg-blue-50 transition-colors">
                  <MdEmail size={18} className="sm:w-6 sm:h-6 text-blue-500" />
                </Link>
                <Link href="/user/nfc" className="cursor-pointer p-2 sm:p-3 rounded-lg hover:bg-red-50 transition-colors" onClick={() => {handleDelete()}}>
                  <FaTrash size={16} className="sm:w-5 sm:h-5 text-red-500" />
                </Link>
              </div>
              <div className="flex gap-6 flex-col lg:flex-row items-stretch">
                {/* Left: Card Preview */}
                <div
                  ref={cardRef}
                  style={{ backgroundColor: "#fff" }}
                  className="bg-white rounded-lg border border-gray-100 p-4 flex flex-col items-center relative w-full max-w-md mx-auto lg:mx-0 lg:w-1/2"
                >
                  {/* Card Content */}
                  {+basicNfcData?.design_card_id === 1 ?
                    <CardClassic basicNfcData={basicNfcData}/>
                    :
                    +basicNfcData?.design_card_id === 2 ?
                    <CardModern basicNfcData={basicNfcData}/>
                    :
                    +basicNfcData?.design_card_id === 3 ?
                    <CardSleek basicNfcData={basicNfcData}/>
                    :
                    <CardFlat basicNfcData={basicNfcData}/>
                  }
                </div>
                {/* Right: QR and Send Card */}
                <div className="bg-white rounded-lg border border-gray-100 p-4 flex flex-col items-center w-full max-w-md mx-auto lg:mx-0 lg:w-1/2 mt-6 lg:mt-0">
                  <h3 className="font-semibold text-lg mb-2">Send Card</h3>
                  {/* Tab Content */}
                  {activeTab === "code" && (
                    <>
                      <div ref={qrRef} className="bg-gray-100 rounded-lg p-4 mb-2 w-full flex justify-center">
                        <QRCodeSVG
                          value={`${typeof window !== 'undefined' ? window.location.origin : ''}/card/fb_share/${basicNfcData?.id}`}
                          size={180}
                          bgColor="#f3f4f6"
                          fgColor="#222"
                          level="H"
                          includeMargin={true}
                        />
                      </div>
                      <div className="text-center text-gray-500 text-xs mb-2">
                        Scan Or Click to Preview
                      </div>
                      <div className="flex justify-center gap-2 mb-3 flex-wrap">
                        <button className="cursor-pointer" onClick={handleShareFacebook} title="Share on Facebook">
                          <SocialIcon network="facebook" style={{ height: 32, width: 32 }} />
                        </button>
                        <button className="cursor-pointer" onClick={handleShareXing} title="Share on Xing">
                          <SocialIcon network="xing" style={{ height: 32, width: 32 }} />
                        </button>
                        <button className="cursor-pointer" onClick={handleShareLinkedIn} title="Share on LinkedIn">
                          <SocialIcon network="linkedin" style={{ height: 32, width: 32 }} />
                        </button>
                        <button className="cursor-pointer" onClick={handleShareWhatsApp} title="Share on WhatsApp">
                          <SocialIcon network="whatsapp" style={{ height: 32, width: 32 }} />
                        </button>
                        <button className="cursor-pointer" onClick={handleShareEmail} title="Share via Email">
                          <SocialIcon network="email" style={{ height: 32, width: 32 }} />
                        </button>
                      </div>
                      <button
                       className="flex items-center cursor-pointer gap-2 px-4 py-2 bg-white border rounded mb-4 hover:bg-gray-50 w-full max-w-xs justify-center"
                       onClick={handleCopyLink}
                       >
                        <FaCopy />
                        <span>Copy Link</span>
                      </button>
                    </>
                  )}
                  {activeTab === "email" && (
                    <>
                      <div className="w-full mb-4">
                        <div className="mb-2 text-gray-700">Email your Work card to:</div>
                        <input type="text" placeholder="Name" className="w-full border rounded px-3 py-2 mb-2" />
                        <input type="email" placeholder="Email" className="w-full border rounded px-3 py-2 mb-2" />
                        <textarea placeholder="Message" className="w-full border rounded px-3 py-2 mb-2" rows={4} />
                        <button className="bg-blue-600 text-white px-4 py-2 rounded">Send Email</button>
                      </div>
                    </>
                  )}
                  {activeTab === "text" && (
                    <>
                      <div className="w-full mb-4">
                        <div className="mb-2 text-gray-700">You'll need a text message application installed on your computer to send your card via SMS.</div>
                        <div className="mb-2 font-semibold">Text your Work card to:</div>
                        <input type="text" placeholder="Name" className="w-full border rounded px-3 py-2 mb-2" />
                        <div className="flex gap-2 mb-2">
                          <input type="text" placeholder="61" className="w-1/4 border rounded px-3 py-2" />
                          <input type="text" placeholder="Phone Number" className="w-3/4 border rounded px-3 py-2" />
                        </div>
                        <button className="flex items-center gap-2 border border-blue-600 text-blue-600 px-4 py-2 rounded">
                          <FaCommentDots />
                          <span>Send SMS</span>
                        </button>
                      </div>
                    </>
                  )}
                  {activeTab === "apple" && (
                    <>
                      <div className="w-full mb-4 text-center text-gray-500">Apple Wallet integration coming soon.</div>
                    </>
                  )}
                  {/* Tab Buttons */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full mt-2 border rounded-lg overflow-hidden">
                    <button onClick={() => setActiveTab("code")} className={`flex flex-col items-center justify-center py-2 ${activeTab === "code" ? "bg-purple-600 text-white" : "bg-white text-purple-700"} border-r border-b sm:border-b-0 sm:border-r last:border-r-0 transition-all`}>
                      <FaCode />
                      <span className="text-xs mt-1">Code</span>
                    </button>
                    <button onClick={() => setActiveTab("email")} className={`flex flex-col items-center justify-center py-2 ${activeTab === "email" ? "bg-purple-600 text-white" : "bg-white text-purple-700"} border-r border-b sm:border-b-0 sm:border-r last:border-r-0 transition-all`}>
                      <FaEnvelopeOpenText />
                      <span className="text-xs mt-1">Email</span>
                    </button>
                    <button onClick={() => setActiveTab("text")} className={`flex flex-col items-center justify-center py-2 ${activeTab === "text" ? "bg-purple-600 text-white" : "bg-white text-purple-700"} border-r border-b sm:border-b-0 sm:border-r last:border-r-0 transition-all`}>
                      <FaCommentDots />
                      <span className="text-xs mt-1">Text</span>
                    </button>
                    <button onClick={() => setActiveTab("apple")} className={`flex flex-col items-center justify-center py-2 ${activeTab === "apple" ? "bg-purple-600 text-white" : "bg-white text-purple-700"} transition-all`}>
                      <FaApple />
                      <span className="text-xs mt-1">Apple</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
};

export default NfcDetails;
