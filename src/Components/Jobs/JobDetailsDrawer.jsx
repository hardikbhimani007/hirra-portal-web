import React, { useState } from "react";
import { Drawer, IconButton, Modal, Box } from "@mui/material";
import { HiArrowSmLeft } from "react-icons/hi";
import { IoHeartOutline, IoHeartSharp, IoClose } from "react-icons/io5";
import { MdFlag } from "react-icons/md";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import calendar from "../../assets/Jobs/calendar.svg";
import clock from "../../assets/Jobs/clock.svg";
import marker from "../../assets/Jobs/marker.svg";

import { ApplyJob, PostAbuseReport } from "../../services/jobService";

export default function JobDetailsDrawer({
    job,
    isOpen,
    onClose,
    toggleLike,
    showHeart,
    isSaving = false,
    onApplySuccess,
    showapplybtn = true,
}) {
    const [loading, setLoading] = useState(false);
    const [showFullDesc, setShowFullDesc] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [selectedReason, setSelectedReason] = useState("");
    const [customReason, setCustomReason] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const reportReasons = [
        "Spam or misleading",
        "Inappropriate content",
        "Fraudulent job posting",
        "Discriminatory language",
        "Incorrect job details",
        "Other (please specify)"
    ];

    const handleApply = async () => {
        if (!job) return;
        setLoading(true);
        try {
            await ApplyJob({ job_id: job.Jid });
            toast.success("Applied successfully!");
            if (onApplySuccess) onApplySuccess(job.Jid);
            onClose();
        } catch (error) {
            toast.error(error?.message || "Failed to apply for job");
        } finally {
            setLoading(false);
        }
    };

    const handleHeartClick = (e) => {
        e.stopPropagation();
        if (!isSaving) {
            toggleLike(job.Jid);
        }
    };

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
                job_id: job.Jid,
                report_reason:
                    selectedReason === "Other (please specify)"
                        ? customReason
                        : selectedReason,
            };

            await PostAbuseReport(reportPayload);

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

    if (!job) return null;

    const desc = job.description || "";
    const maxChars = 1200;
    const isLong = desc.length > maxChars;

    return (
        <>
            <Drawer
                anchor="right"
                open={isOpen}
                onClose={onClose}
                PaperProps={{
                    sx: {
                        width: { xs: "100%", sm: 600, md: 750 },
                        borderRadius: "8px 0 0 8px",
                    },
                }}
            >
                {/* Header */}
                <div className="p-2 sm:p-4 flex justify-between items-center border-b border-gray-200">
                    <IconButton onClick={onClose} sx={{ bgcolor: "#F6F6F7" }}>
                        <HiArrowSmLeft size={20} className="text-gray-600 sm:w-6 sm:h-6" />
                    </IconButton>

                    <button
                        onClick={() => setShowReportModal(true)}
                        className="flex items-center gap-1 text-red-500 hover:text-red-600 text-xs sm:text-sm font-medium transition-colors cursor-pointer"
                    >
                        <MdFlag className="w-4 h-4" />
                        Report Abuse
                    </button>
                </div>

                {/* Body */}
                <div className="p-3 sm:p-6 overflow-y-auto flex-1 text-sm sm:text-base">
                    <div className="flex justify-between items-center mb-2">
                        <p className="font-medium text-xs sm:text-sm text-[#718096]">
                            #{job.Jid}
                        </p>
                        <div className="flex items-center gap-1 sm:gap-2">
                            {job.since_posted && (
                                <p className="text-xs sm:text-sm text-[#718096]">
                                    Posted {job.since_posted}
                                </p>
                            )}
                            {showHeart &&
                                (job.isLiked ? (
                                    <IoHeartSharp
                                        className={`text-green-600 w-4 h-4 sm:w-5 sm:h-5 cursor-pointer ${isSaving ? "animate-pop" : ""}`}
                                        onClick={handleHeartClick}
                                    />
                                ) : (
                                    <IoHeartOutline
                                        className={`text-gray-500 w-4 h-4 sm:w-5 sm:h-5 cursor-pointer ${isSaving ? "animate-pop" : ""}`}
                                        onClick={handleHeartClick}
                                    />
                                ))}
                        </div>
                    </div>

                    <div className="mb-3 sm:mb-4 flex flex-col sm:flex-row sm:flex-wrap sm:items-start gap-2">
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-base sm:text-lg md:text-xl text-[#1A202C] mb-1 break-words leading-tight">
                                {job.title}
                            </h3>
                            <p className="text-xs sm:text-sm text-[#718096]">
                                {job.postedBy && (
                                    <>
                                        Posted by <span className="text-[#152A45]">{job.postedBy}</span>{" "}
                                    </>
                                )}
                                <span>(Hourly Rate - ${job.rate}/hour)</span>
                            </p>
                        </div>

                        {job.type && (
                            <span
                                className={`flex-shrink-0 self-start font-medium px-2 py-1 text-center rounded-full text-xs sm:text-sm border ${{
                                    Sent: "text-orange-500 border-orange-500",
                                    Viewed: "text-sky-500 border-sky-500",
                                    Shortlisted: "text-green-600 border-green-600",
                                    "Green Project": "text-green-600 border-green-600",
                                }[job.type] || "text-gray-600 border-gray-300"}`}
                            >
                                {job.type}
                            </span>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-3 sm:gap-6 my-4 sm:my-6 text-xs sm:text-sm">
                        <div>
                            <div className="flex items-center gap-1 sm:gap-2">
                                <img src={marker} alt="Location" className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span className="text-[#718096]">Location</span>
                            </div>
                            <span className="text-[#1A202C] break-all">{job.location}</span>
                        </div>
                        <div>
                            <div className="flex items-center gap-1 sm:gap-2">
                                <img src={calendar} alt="Start Date" className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span className="text-[#718096]">Start Date</span>
                            </div>
                            <span className="text-[#1A202C]">{job.startDate}</span>
                        </div>
                        <div>
                            <div className="flex items-center gap-1 sm:gap-2">
                                <img src={clock} alt="Duration" className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span className="text-[#718096]">Duration</span>
                            </div>
                            <span className="text-[#1A202C]">{job.duration}</span>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mb-4 sm:mb-6">
                        {/* <span className="text-[#718096] text-xs sm:text-sm">Description</span> */}
                        <div className="mb-4 sm:mb-6">
                            <span className="text-[#718096] text-xs sm:text-sm">Description</span>
                            <p className="text-[#1A202C] mt-1 text-sm sm:text-base break-words whitespace-pre-line">
                                {showFullDesc || desc.length <= maxChars
                                    ? desc
                                    : desc.slice(0, maxChars)
                                }
                                {desc.length > maxChars && (
                                    <button
                                        onClick={() => setShowFullDesc(!showFullDesc)}
                                        className="ml-1 text-[#3182CE] text-xs sm:text-sm cursor-pointer"
                                    >
                                        {showFullDesc ? "...Less" : "...More"}
                                    </button>
                                )}
                            </p>
                        </div>
                    </div>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-1 sm:gap-2 mb-4 sm:mb-6">
                        <span className="text-[#718096] text-xs sm:text-sm">
                            Required skills:
                        </span>
                        {job.skills.map((skill, index) => (
                            <span
                                key={index}
                                className="bg-gray-100 text-gray-500 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm"
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-3 sm:p-4 border-t border-gray-200 flex justify-between items-center">
                    <div>
                        <span className="text-[#718096] text-xs sm:text-sm">
                            <span className="text-black text-xl sm:text-2xl md:text-3xl font-bold">
                                ${job.rate}
                            </span>
                            /hour
                        </span>
                    </div>
                    {showapplybtn && (
                        <button
                            onClick={handleApply}
                            disabled={loading || job.is_applied}
                            className={`px-3 py-1 sm:px-6 sm:py-2 text-xs sm:text-sm text-white rounded-md cursor-pointer ${loading || job.is_applied
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-[#152A45] hover:bg-[#1e3a5f] transition-colors"
                                }`}
                        >
                            {job.is_applied ? "Applied" : loading ? "Applying..." : "Apply Now"}
                        </button>
                    )}
                </div>
            </Drawer>

            {/* Report Abuse Modal */}
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
                            Report Job Posting
                        </h2>
                        <IconButton onClick={handleCloseReportModal} size="small">
                            <IoClose className="w-5 h-5" />
                        </IconButton>
                    </div>

                    <div className="p-4 sm:p-6">
                        <p className="text-sm text-[#718096] mb-4">
                            Please select the reason for reporting this job posting. Your report will help us maintain the quality of our platform.
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
        </>
    );
}
