import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FaCircleCheck } from "react-icons/fa6";
import { CiUser } from "react-icons/ci";
import { MdFlag } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Modal, Box, IconButton } from "@mui/material";

import { MyProfile, PostUserAbuseReport } from "../services/jobService";
import SmallLoader from "../Components/SmallLoader";
import marker from "../assets/Jobs/marker.svg";

export default function SubcontractorProfileStandalone({ user_id }) {
    const location = useLocation();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showReportModal, setShowReportModal] = useState(false);
    const [selectedReason, setSelectedReason] = useState("");
    const [customReason, setCustomReason] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const reportReasons = [
        "Spam or misleading",
        "Inappropriate content",
        "Fraudulent profile",
        "Discriminatory language",
        "Incorrect user details",
        "Other (please specify)"
    ];

    useEffect(() => {
        console.log(user_id)
        if (!user_id) return;

        const fetchUser = async () => {
            try {
                setLoading(true);
                const response = await MyProfile(user_id);
                setUserData(response.data);
            } catch (err) {
                console.error("Failed to fetch profile:", err);
                toast.error("Failed to load user data.");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [user_id]);

    const handleReportSubmit = async () => {
        if (!selectedReason) return toast.error("Please select a reason for reporting");
        if (selectedReason === "Other (please specify)" && !customReason.trim())
            return toast.error("Please provide details for your report");

        setIsSubmitting(true);

        const payload = {
            user_id: user_id,
            report_reason: selectedReason,
            // details: selectedReason === "Other (please specify)" ? customReason.trim() : ""
        };

        try {
            const res = await PostUserAbuseReport(payload);
            console.log("Report submitted:", res);
            toast.success("Report submitted successfully!");
            setShowReportModal(false);
            setSelectedReason("");
            setCustomReason("");
        } catch (err) {
            console.error("Failed to submit report:", err);
            toast.error("You have already reported this user!");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCloseReportModal = () => {
        setShowReportModal(false);
        setSelectedReason("");
        setCustomReason("");
    };

    if (loading) return <SmallLoader />;

    if (!userData) return <p className="text-center mt-10">No user data found.</p>;

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

    return (
        <div className="min-h-screen -mt-2 2xl:-mt-0">
            <div className="container mx-auto w-[90%] min-[1440px]:w-[80%] px-4 md:px-6 py-6 border border-gray-300 rounded-xl bg-white shadow-sm">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 items-center">

                    <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-4 md:gap-6 items-center justify-items-center sm:justify-items-start">
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

                        <div className="flex flex-col justify-center text-center sm:text-left flex-1 min-w-0">
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 break-all whitespace-normal">
                                {profile.name}
                            </h2>
                            <div className="flex mt-2 items-start gap-2 justify-center sm:justify-start">
                                <img src={marker} alt="Location" className="w-5 h-5 mt-1 flex-shrink-0" />
                                <p className="text-[#718096] font-semibold text-sm sm:text-base break-all whitespace-normal max-w-[calc(90vw-60px)] sm:max-w-[calc(42vw-20px)]">
                                    {profile.location || "No location provided"}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center lg:justify-end mt-2 lg:mt-0">
                        <button
                            className="text-sm sm:text-base text-red-500 border border-red-500 font-semibold px-5 py-2 rounded-lg cursor-pointer flex items-center gap-2 shrink-0"
                            onClick={() => setShowReportModal(true)}
                        >
                            <MdFlag className="flex-shrink-0" /> Report Abuse
                        </button>
                    </div>

                </div>
            </div>

            <div className="container mx-auto w-[90%] min-[1440px]:w-[80%] mt-6 md:mt-8 mb-6">
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 xl:gap-6">
                    <div className="xl:col-span-5 bg-white border border-gray-300 rounded-xl p-4 md:p-6 shadow-sm">
                        <h3 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6">Basic Information</h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 pb-6 border-b border-gray-300">
                            <div className="flex flex-col font-semibold">
                                <span className="text-[#718096] text-base mb-1">Full Name</span>
                                <span className="text-[#1A202C] text-base break-words">{profile.name}</span>
                            </div>

                            <div className="flex flex-col font-semibold">
                                <span className="text-[#718096] text-base mb-1">Travel Radius</span>
                                <span className="text-[#1A202C] text-base break-words">
                                    {profile.travelRadius ?? ""}
                                </span>
                            </div>

                            <div className="flex flex-col font-semibold col-span-1 sm:col-span-2">
                                <span className="text-[#718096] text-base mb-1">Location</span>
                                <p className="text-[#1A202C] text-base break-words">{profile.location}</p>
                            </div>

                            <div className="flex flex-col font-semibold col-span-1 sm:col-span-2">
                                <span className="text-[#718096] text-base mb-1">Email ID</span>
                                <p className="text-[#1A202C] text-base lowercase break-all">{profile.email}</p>
                            </div>
                        </div>

                        <h3 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6">Verification & Credential</h3>

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
                        <h3 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6">Skills & Availability</h3>

                        <div className="grid gap-4 md:gap-6">
                            <div>
                                <span className="text-[#718096] text-base font-semibold block mb-2">Skills</span>
                                <div className="flex flex-wrap gap-2">
                                    {skills.map((skill, index) => (
                                        <span className="bg-gray-100 text-gray-500 px-3 py-2 rounded-full text-sm flex items-center justify-center break-words break-all">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <span className="text-[#718096] text-base font-semibold block mb-2">Availability</span>
                                <p className="text-[#1A202C] text-base break-words">{availability}</p>
                            </div>
                        </div>
                    </div>

                    <div className="xl:col-span-7 bg-white border border-gray-300 rounded-xl p-4 md:p-6 shadow-sm">
                        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4 items-start mb-6">
                            <h3 className="text-xl md:text-2xl font-semibold break-all">{job.title}</h3>
                            <span className="font-semibold text-[#718096]">
                                <span className="text-black text-xl md:text-2xl font-bold">${job.rate}</span>/hour
                            </span>
                        </div>

                        <div className="text-[#718096] text-sm md:text-base font-medium leading-relaxed break-all">
                            <p>{job.description}</p>
                        </div>
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
                                <p className="text-xs text-[#718096] mt-1">{customReason.length}/500 characters</p>
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
