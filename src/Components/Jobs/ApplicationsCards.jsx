import { useState, useRef, useEffect } from "react";
import marker from "../../assets/Jobs/marker.svg";
import { UpdateApplicationStatus } from "../../services/jobService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function ApplicationsCards({ job, onCardClick }) {
    const navigate = useNavigate();
    const [isExpanded, setIsExpanded] = useState(false);
    const [showMore, setShowMore] = useState(false);
    const [status, setStatus] = useState(job.application_status);
    const descRef = useRef(null);

    useEffect(() => {
        const el = descRef.current;
        if (el) {
            setShowMore(el.scrollHeight > el.clientHeight);
        }
    }, [job.description]);
    // {
    //     console.log(job, 'dsddfasf');
    // }
    const handleShortlist = async (e) => {
        e.stopPropagation();
        try {
            await UpdateApplicationStatus(job.applicationId, "Shortlisted");
            setStatus("Shortlisted");
            toast.success(`${job.name} has been shortlisted`);
        } catch (err) {
            toast.error("Failed to update status");
            console.error(err);
        }
    };

    const handleMessage = (e) => {
        e.stopPropagation();
        navigate('/subcontractor/messages', { state: { job } });
        // navigate(`/subcontractor/messages?jobId=${job.id}`);
    };

    const handleCardClick = async () => {
        try {
            if (onCardClick) onCardClick(job);
            await UpdateApplicationStatus(job.applicationId, "Viewed");
            setStatus("Viewed");
        } catch (err) {
            console.error("Failed to update status:", err);
        }
    };

    return (
        <div
            className={`border rounded-lg p-4 shadow-sm transition-shadow duration-200 font-semibold cursor-pointer my-2
        ${status === "Shortlisted"
                    ? "bg-[#f2f2f2] border-gray-300 hover:shadow-sm"
                    : "bg-[#FCFCFD] border-gray-200 hover:shadow-md"
                }`}
            onClick={status === "Shortlisted" ? (e) => e.stopPropagation() : handleCardClick}
        >

            <div className='rounded-xl flex flex-col xl:flex-row xl:items-center xl:justify-between gap-0 md:gap-4'>
                <div className="flex flex-col sm:flex-row items-center xl:items-start gap-4 md:gap-6 w-full md:w-auto">
                    <img
                        src={job.image || "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='72' height='72'><circle cx='36' cy='36' r='36' fill='%23E0E0E0'/><path fill='%239E9E9E' d='M36 36c5 0 9-4 9-9s-4-9-9-9-9 4-9 9 4 9 9 9zm0 4c-6 0-18 3-18 9v5h36v-5c0-6-12-9-18-9z'/></svg>"}
                        alt="User Profile"
                        className="w-18 h-18 rounded-full object-cover shadow-lg"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='72' height='72'><circle cx='36' cy='36' r='36' fill='%23E0E0E0'/><path fill='%239E9E9E' d='M36 36c5 0 9-4 9-9s-4-9-9-9-9 4-9 9 4 9 9 9zm0 4c-6 0-18 3-18 9v5h36v-5c0-6-12-9-18-9z'/></svg>";
                        }}
                    />

                    <div className="text-center sm:text-left">
                        <h2 className="text-lg md:text-xl font-bold text-gray-800 break-words max-w-[250px]">
                            {job.name}
                        </h2>
                        <div className="flex items-start justify-center sm:justify-start mt-2 gap-2">
                            <img
                                src={marker}
                                alt="Location"
                                className="hidden sm:block w-4 h-4 flex-shrink-0 mt-1"
                            />
                            <p className="text-[#718096] font-semibold text-sm md:text-base break-words">
                                {job.location}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex flex-wrap gap-3 w-full xl:w-auto justify-start mt-4 xl:mt-0 text-sm md:text-base">
                    <button onClick={handleMessage} className="font-semibold px-3 md:px-5 py-2 rounded-lg border border-gray-400 text-gray-700 hover:bg-gray-100 cursor-pointer">
                        Message
                    </button>
                    <button
                        onClick={handleShortlist}
                        disabled={status === "Shortlisted"}
                        className={`${status === "Shortlisted"
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-[#152A45] hover:bg-slate-900 cursor-pointer"
                            } text-white border border-gray-300 font-semibold px-3 md:px-5 py-2 rounded-lg transition-colors`}
                    >
                        {status === "Shortlisted" ? "Shortlisted" : "Shortlist"}
                    </button>
                </div>
            </div>

            <div className="text-gray-700 text-sm mb-4 relative pt-5">
                <p className="break-words inline">
                    {isExpanded || job.description.length <= 140
                        ? job.description
                        : job.description.slice(0, 140)}

                    {job.description.length > 140 && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsExpanded(!isExpanded);
                            }}
                            className="text-[#155dfc] font-semibold ml-1 cursor-pointer"
                        >
                            {isExpanded ? "...less" : "...more"}
                        </button>
                    )}
                </p>
            </div>

            <div className="flex flex-wrap items-start gap-5 min-[1280px]:gap-4 font-semibold border-t border-gray-300 pt-4">
                <div className="flex items-start gap-2 flex-wrap">
                    <div className="flex items-center gap-2 shrink-0">
                        <img src={marker} alt="Location" className="w-4 h-4 md:w-5 md:h-5" />
                        <span className="text-[#718096] text-sm md:text-base">Location:</span>
                    </div>
                    <span className="text-[#1A202C] text-sm md:text-base break-words flex-1 min-w-full sm:min-w-0">
                        {job.location}
                    </span>
                </div>

                <div className="flex flex-col min-[640px]:flex-row">
                    <div className="flex items-center gap-1">
                        <span className="text-[#718096] md:ml-2 text-sm md:text-base">Availability:</span>
                    </div>
                    <span className="text-[#1A202C] md:ml-2 min-[640px]:ml-4 text-sm md:text-base">{job.availability}</span>
                </div>
            </div>
        </div>
    );
}
