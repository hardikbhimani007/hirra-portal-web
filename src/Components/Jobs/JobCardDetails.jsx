import React, { useState, useRef, useEffect } from "react";
import calendar from "../../assets/Jobs/calendar.svg";
import clock from "../../assets/Jobs/clock.svg";
import marker from "../../assets/Jobs/marker.svg";
import { IoHeartOutline, IoHeartSharp } from "react-icons/io5";

export default function JobCardDetails({ job, onCardClick, toggleLike, showLike = true }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [showMore, setShowMore] = useState(false);
    const descRef = useRef(null);

    useEffect(() => {
        setShowMore(job.description && job.description.length > 140);
    }, [job.description]);

    function truncateTextByLetters(text, maxLetters) {
        if (!text) return "";
        if (text.length <= maxLetters) return text;
        return text.substring(0, maxLetters);
    }

    return (
        <div
            className="border bg-[#FCFCFD] border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200 my-4 font-semibold cursor-pointer"
            onClick={() => onCardClick && onCardClick(job)}
        >
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-3 gap-0 md:gap-2">
                <h2 className="text-lg md:text-xl font-semibold break-all max-w-full">
                    {job.title}
                </h2>

                <div className="flex gap-2 items-center mt-2 xl:mt-0 flex-nowrap">
                    {job.type && (
                        <span
                            className={`font-medium px-2 py-1 w-28 text-center rounded-full text-xs md:text-sm border ${{
                                Sent: "text-orange-500 border-orange-500",
                                Viewed: "text-sky-500 border-sky-500",
                                Shortlisted: "text-green-600 border-green-600",
                                "Green Project": "text-green-600 border-green-600",
                            }[job.type] || "text-gray-600 border-gray-300"
                                }`}
                        >
                            {job.type}
                        </span>
                    )}

                    <p className="text-gray-500 text-xs md:text-sm whitespace-nowrap">Posted {job.postedsince}</p>

                    {showLike &&
                        (job.isLiked ? (
                            <IoHeartSharp
                                className="text-green-600 w-5 h-5 cursor-pointer"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleLike(job.Jid);
                                }}
                            />
                        ) : (
                            <IoHeartOutline
                                className="text-gray-500 w-5 h-5 cursor-pointer"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleLike(job.Jid);
                                }}
                            />
                        ))}
                </div>

            </div>

            <div className="text-gray-400 text-sm md:text-base mb-3">
                {job.postedBy &&
                    <> Posted by <span className="font-medium text-[#152A45]">{job.postedBy}</span> </>
                }
                (Hourly Rate - ${job.rate}/hour)
            </div>
            <div className="text-gray-700 text-sm md:text-base mb-4 relative">
                <span className="break-words">
                    {isExpanded ? (
                        <>
                            {job.description}{" "}
                            {showMore && (
                                <button
                                    onClick={(e) => { e.stopPropagation(); setIsExpanded(false); }}
                                    className="text-blue-600 font-semibold cursor-pointer"
                                >
                                    ...Less
                                </button>
                            )}
                        </>
                    ) : (
                        <>
                            {truncateTextByLetters(job.description, 140)}{" "}
                            {showMore && (
                                <button
                                    onClick={(e) => { e.stopPropagation(); setIsExpanded(true); }}
                                    className="text-blue-600 font-semibold cursor-pointer"
                                >
                                    ...More
                                </button>
                            )}
                        </>
                    )}
                </span>
            </div>

            <div className="flex flex-wrap gap-2 text-sm md:text-base mb-4 items-center">
                <span className="text-[#718096]">Required skills:</span>
                {job.skills.map((skill, index) => (
                    <span
                        key={index}
                        className="bg-gray-100 text-gray-500 px-3 py-2 rounded-full text-sm flex items-center justify-center"
                    >
                        {skill}
                    </span>
                ))}
            </div>

            <div className="flex flex-col gap-4 font-semibold border-t border-gray-300 pt-4">
                <div className="flex items-start gap-2 flex-wrap">
                    <div className="flex items-center gap-2 shrink-0">
                        <img src={marker} alt="Location" className="w-4 h-4 md:w-5 md:h-5" />
                        <span className="text-[#718096] text-sm md:text-base">Location:</span>
                    </div>
                    <span className="text-[#1A202C] text-sm md:text-base break-words flex-1 min-w-full sm:min-w-0">
                        {job.location}
                    </span>
                </div>
                <div className="flex max-[425px]:flex-col max-[425px]:items-start gap-2">
                    <div className="flex items-center gap-2">
                        <img src={calendar} alt="Start Date" className="w-4 h-4 md:w-5 md:h-5" />
                        <span className="text-[#718096] text-sm md:text-base">Start Date:</span>
                    </div>
                    <span className="text-[#1A202C] text-sm md:text-base">{job.startDate}</span>
                </div>

                <div className="flex flex-col sm:flex-row sm:justify-between gap-2 max-[425px]:flex-col">
                    <div className="flex max-[425px]:flex-col max-[425px]:items-start gap-2">
                        <div className="flex items-center gap-2">
                            <img src={clock} alt="Duration" className="w-4 h-4 md:w-5 md:h-5" />
                            <span className="text-[#718096] text-sm md:text-base">Duration:</span>
                        </div>
                        <span className="text-[#1A202C] text-sm md:text-base">{job.duration}</span>
                    </div>

                    {job.application > 0 && (
                        <div className="flex items-center gap-2 text-[#1773E2]">
                            <span>{job.application}</span>
                            <span>Applications</span>
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
}
