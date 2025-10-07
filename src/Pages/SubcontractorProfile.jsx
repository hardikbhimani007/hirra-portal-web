import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FaCircleCheck } from "react-icons/fa6";
import { CiUser } from "react-icons/ci";
import { MdFlag } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Drawer, IconButton, Modal, Box } from "@mui/material";

import SmallLoader from "../Components/SmallLoader";
import Navbar from "../Components/Jobs/Navbar";
import BasicInfoModal from "../Components/Profile/BasicInfoModal";

import marker from "../assets/Jobs/marker.svg";
import icon2 from "../assets/Jobs/icon2.svg";
import icon3 from "../assets/Jobs/icon3.svg";
import selectedIcon2 from "../assets/Jobs/selectedIcon2.svg";
import selectedIcon3 from "../assets/Jobs/selectedIcon3.svg";

import { MyProfile, PostUserAbuseReport } from "../services/jobService";

export default function SubcontractorProfile() {
    const [userData, setUserData] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showReportModal, setShowReportModal] = useState(false);
    const [selectedReason, setSelectedReason] = useState("");
    const [customReason, setCustomReason] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const location = useLocation();
    const userIdFromState = location.state?.user_id;

    const reportReasons = [
        "Spam or misleading",
        "Inappropriate content",
        "Fraudulent profile",
        "Discriminatory language",
        "Incorrect user details",
        "Other (please specify)"
    ];

    const fetchUser = async () => {
        try {
            setLoading(true);
            const response = await MyProfile(userIdFromState);
            setUserData(response.data);
            await localStorage.setItem("profilepictures", response.data?.profile_pictures);
        } catch (error) {
            console.error("Failed to fetch profile:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, [userIdFromState]);

    const handleReportSubmit = async () => {
        if (!selectedReason) {
            toast.error("Please select a reason for reporting");
            return;
        }

        if (selectedReason === "Other (please specify)" && !customReason.trim()) {
            toast.error("Please provide details for your report");
            return;
        }

        setIsSubmitting(true);
        try {
            const reportPayload = {
                user_id: userIdFromState,
                report_reason: selectedReason === "Other (please specify)" ? customReason : selectedReason
            };

            await PostUserAbuseReport(reportPayload);

            toast.success("Report submitted successfully. Thank you for your feedback.");
            handleCloseReportModal();
        } catch (error) {
            console.error("Error submitting report:", error);
            toast.error(error?.message || "Failed to submit report");
        } finally {
            setIsSubmitting(false);
        }
    };


    const handleCloseReportModal = () => {
        setShowReportModal(false);
        setSelectedReason("");
        setCustomReason("");
    };

    if (loading) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
                <SmallLoader />
            </div>
        );
    }

    if (!userData) return null;

    const profile = {
        name: userData.name,
        image: userData.profile_pictures,
        location: userData.location,
        travelRadius: `${userData.radius}`,
        email: userData.email,
    };

    const verification = {
        cscsCard: userData.is_cscsfile_verified,
        jobsSaved: userData.saved_jobs_count,
        applications: userData.applied_jobs_count,
    };

    const skills = userData.skill || [];
    const availability = userData.availability || "Not specified";
    const job = {
        title: userData.title || "No title",
        rate: userData.min_hour_rate || 0,
        description: userData.description || "No description available",
    };

    const navItems = [
        { name: "Jobs", path: "/subcontractor/jobs", icon: icon3, iconActive: selectedIcon3 },
        { name: "Messages", path: "/subcontractor/messages", icon: icon2, iconActive: selectedIcon2 }
    ];

    return (
        <div>
            <Navbar navItems={navItems} userRole={"subcontractor"} />

            <div className="container mx-auto w-[90%] min-[1440px]:w-[60%] py-3 px-3 md:py-6 md:px-6 -mt-6 2xl:mt-0 border border-gray-300 rounded-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex flex-col sm:flex-row items-center gap-2 md:gap-6 w-full md:w-auto">
                    <div className="w-28 h-28 rounded-full shadow-lg overflow-hidden flex items-center justify-center bg-gray-100">
                        {profile.image ? (
                            <img
                                src={profile.image}
                                alt="User Profile"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <CiUser className="w-20 h-20 text-gray-400" />
                        )}
                    </div>

                    <div className="flex flex-col justify-center text-center sm:text-left flex-1">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 break-words">
                            {profile.name}
                        </h2>
                        <div className="flex mt-2 items-start gap-2 justify-center sm:justify-start">
                            <img src={marker} alt="Location" className="w-5 h-5 mt-1" />
                            <p className="text-[#718096] font-semibold text-base break-words max-w-[calc(90vw-60px)] sm:max-w-[calc(42vw-20px)]">
                                {profile.location || "No location provided"}
                            </p>
                        </div>
                    </div>
                </div>
                {userIdFromState && parseInt(userIdFromState) !== parseInt(localStorage.getItem("user_id")) && (
                    <button
                        className="text-red-500 border border-red-500 font-semibold px-5 py-2 rounded-lg cursor-pointer w-full md:w-auto flex items-center gap-1"
                        onClick={() => setShowReportModal(true)}
                    >
                        <MdFlag /> Report Abuse
                    </button>
                )}
            </div>

            <div className="container mx-auto w-[90%] min-[1440px]:w-[60%] mt-2 lg:mt-8 flex flex-col lg:flex-row gap-2 lg:gap-8 mb-4 lg:mb-6">
                <div className="lg:w-5/12 bg-white border border-gray-300 rounded-xl p-4 lg:p-6 shadow">
                    <p className="text-xl min-[1025px]:text-3xl font-semibold mb-4 md:mb-6">Basic Information</p>
                    <div className="flex flex-wrap gap-3 mb-3 md:gap-6 md:mb-6">
                        <div className="flex-1 min-w-[150px] flex flex-col font-semibold">
                            <span className="text-[#718096] text-base">Full Name</span>
                            <span className="text-[#1A202C] text-sm md:text-base break-words">{profile.name}</span>
                        </div>

                        <div className="flex-1 min-w-[150px] flex flex-col font-semibold">
                            <span className="text-[#718096] text-base">Travel Radius</span>
                            <span className="text-[#1A202C] text-sm md:text-base break-words">
                                {profile.travelRadius ?? ""}
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 md:gap-6 font-semibold pb-4 md:pb-6 border-b border-gray-300">
                        <div>
                            <span className="text-[#718096] text-base">Location</span>
                            <p className="text-[#1A202C] text-sm md:text-base break-words">{profile.location}</p>
                        </div>
                        <div>
                            <span className="text-[#718096] text-base">Email ID</span>
                            <p className="text-[#1A202C] text-sm md:text-base lowercase break-all">{profile.email}</p>
                        </div>
                    </div>

                    <p className="text-xl min-[1025px]:text-3xl font-semibold mb-4 md:mb-6 pt-6">Verification & Credential</p>
                    <div className="flex flex-wrap gap-3 md:gap-6 mb-6 pb-6 border-b border-gray-300">
                        <div className="flex-1 flex flex-col font-semibold min-w-[100px]">
                            <span className="text-[#718096] text-base">CSCS Card</span>
                            <span className="flex items-center text-[#1A202C] text-sm md:text-base gap-2">
                                {verification.cscsCard === "Verified" && <FaCircleCheck className="text-green-600" />}
                                {verification.cscsCard}
                            </span>
                        </div>

                        <div className="flex-1 flex flex-col font-semibold min-w-[100px]">
                            <span className="text-[#718096] text-base">Job Saved</span>
                            <span className="text-[#1A202C] text-sm md:text-base">{verification.jobsSaved}</span>
                        </div>

                        <div className="flex-1 flex flex-col font-semibold min-w-[100px]">
                            <span className="text-[#718096] text-base">Application</span>
                            <span className="text-[#1A202C] text-sm md:text-base">{verification.applications}</span>
                        </div>
                    </div>

                    <p className="text-xl min-[1025px]:text-3xl font-semibold mb-4 md:mb-6">Skills & Availability</p>
                    <div className="flex flex-col gap-4 md:gap-6 font-semibold pb-2">
                        <div>
                            <span className="text-[#718096] text-base">Skills</span>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {skills.map((skill, index) => (
                                    <span
                                        key={index}
                                        className="bg-gray-100 text-gray-500 px-3 py-2 rounded-full text-sm flex items-center justify-center break-words"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div>
                            <span className="text-[#718096] text-base">Availability</span>
                            <p className="text-[#1A202C] text-sm md:text-base mt-1 break-words">{availability}</p>
                        </div>
                    </div>
                </div>

                <div className="lg:w-7/12 bg-white border border-gray-300 rounded-xl p-4 lg:p-6 shadow">
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                        <p className="text-xl min-[1025px]:text-3xl font-semibold break-words flex-1 min-w-0">{job.title}</p>
                        <span className="font-semibold text-[#718096] text-sm md:text-base whitespace-nowrap flex-shrink-0">
                            <span className="text-black text-xl min-[1025px]:text-3xl font-bold">${job.rate}</span>/hour
                        </span>
                    </div>
                    <div className="text-[#718096] text-sm md:text-base font-semibold break-words mt-4 md:mt-6">
                        <p>{job.description}</p>
                    </div>
                </div>
            </div>

            <Modal
                open={showReportModal}
                onClose={handleCloseReportModal}
                aria-labelledby="report-modal-title"
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: { xs: "90%", sm: 500 },
                        maxHeight: "90vh",
                        overflow: "auto",
                        bgcolor: "background.paper",
                        borderRadius: 2,
                        boxShadow: 24,
                    }}
                >
                    <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
                        <h2 id="report-modal-title" className="text-lg sm:text-xl font-semibold text-[#1A202C]">
                            Report Abuse
                        </h2>
                        <IconButton onClick={handleCloseReportModal} size="small">
                            <IoClose className="w-5 h-5" />
                        </IconButton>
                    </div>

                    <div className="p-4 sm:p-6">
                        <p className="text-sm text-[#718096] mb-4">
                            Please select the reason for reporting. This helps us maintain quality and safety.
                        </p>

                        <div className="space-y-2 mb-4">
                            {reportReasons.map((reason) => (
                                <label
                                    key={reason}
                                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${selectedReason === reason
                                        ? "border-[#152A45] bg-blue-50"
                                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="reportReason"
                                        value={reason}
                                        checked={selectedReason === reason}
                                        onChange={(e) => setSelectedReason(e.target.value)}
                                        className="w-4 h-4 text-[#152A45] focus:ring-[#152A45] focus:ring-2"
                                    />
                                    <span className="ml-3 text-sm text-[#1A202C]">{reason}</span>
                                </label>
                            ))}
                        </div>

                        {selectedReason === "Other (please specify)" && (
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-[#1A202C] mb-2">
                                    Please provide details
                                </label>
                                <textarea
                                    value={customReason}
                                    onChange={(e) => setCustomReason(e.target.value)}
                                    placeholder="Describe the issue..."
                                    rows={4}
                                    maxLength={500}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#152A45] focus:border-transparent text-sm resize-none"
                                />
                                <p className="text-xs text-[#718096] mt-1">
                                    {customReason.length}/500 characters
                                </p>
                            </div>
                        )}

                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={handleCloseReportModal}
                                disabled={isSubmitting}
                                className="px-4 py-2 text-sm font-medium text-[#1A202C] bg-gray-100 hover:bg-gray-200 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleReportSubmit}
                                disabled={isSubmitting || !selectedReason}
                                className={`px-4 py-2 text-sm font-medium text-white rounded-md transition-colors cursor-pointer ${isSubmitting || !selectedReason
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-red-500 hover:bg-red-600"
                                    }`}
                            >
                                {isSubmitting ? "Submitting..." : "Submit Report"}
                            </button>
                        </div>
                    </div>
                </Box>
            </Modal>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
        </div>
    );
}
