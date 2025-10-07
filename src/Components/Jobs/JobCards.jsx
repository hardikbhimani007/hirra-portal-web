import React, { useState, useRef, useEffect } from "react";
import calendar from "../../assets/Jobs/calendar.svg";
import clock from "../../assets/Jobs/clock.svg";
import marker from "../../assets/Jobs/marker.svg";
import { IoHeartOutline, IoHeartSharp } from "react-icons/io5";

export default function JobCards({ job, onCardClick, toggleLike, showLike = true, isSaving = false }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showMoreButton, setShowMoreButton] = useState(false);
  const descRef = useRef(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Sample job data for demonstration
  const sampleJob = {
    title: "General Labourer",
    type: "Green Project",
    postedsince: "2 days ago",
    postedBy: "Construction Co.",
    rate: "25",
    description: "We're seeking a reliable general labourer to assist with site preparation, material handling, and clean-up on an upcoming residential project. You'll work alongside skilled trades to ensure the smooth progress of construction activities. Previous site experience is a plus but not essential. This role requires physical stamina, attention to safety protocols, and the ability to follow instructions precisely. You'll be involved in various tasks including moving materials, basic tool maintenance, site organization, and supporting different trade teams as needed.",
    skills: ["Physical Work", "Construction", "Safety Protocols"],
    location: "Toronto, ON",
    startDate: "March 1, 2024",
    duration: "3-6 months",
    application: 12,
    isLiked: false,
    Jid: "123"
  };

  const jobData = job || sampleJob;

  const [truncatedText, setTruncatedText] = useState(jobData.description);
  const [isTruncated, setIsTruncated] = useState(false);

  useEffect(() => {
    const maxChars = 320;
    if (jobData.description.length > maxChars) {
      setTruncatedText(jobData.description.slice(0, maxChars));
      setIsTruncated(true);
    } else {
      setTruncatedText(jobData.description);
      setIsTruncated(false);
    }
  }, [jobData.description]);

  const handleHeartClick = (e) => {
    e.stopPropagation();
    if (!isSaving && toggleLike) {
      toggleLike(jobData.Jid);
    }
  };

  const handleToggleDescription = (e) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const truncateTitle = (title) => {
    if (windowWidth < 1024) {
      return title.length > 20 ? title.slice(0, 20) + "..." : title;
    }
    return title;
  };

  return (
    <div
      className="border bg-[#FCFCFD] border-gray-200 rounded-lg p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow duration-200 my-2 md:my-4 font-semibold cursor-pointer"
      onClick={() => onCardClick && onCardClick(jobData)}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start mb-3 sm:mb-4">
        <div className="flex justify-between items-start w-full sm:w-auto mb-2 sm:mb-0">
          <h2 className="font-semibold text-lg sm:text-xl leading-6 sm:leading-7 text-[#1A202C] pr-2">
            {truncateTitle(jobData.title)}
          </h2>

          {showLike && (
            <div className="block sm:hidden relative flex-shrink-0">
              {jobData.isLiked ? (
                <IoHeartSharp
                  className={`text-green-600 w-5 h-5 cursor-pointer ${isSaving ? 'animate-pop' : ''}`}
                  onClick={handleHeartClick}
                />
              ) : (
                <IoHeartOutline
                  className={`text-gray-500 w-5 h-5 cursor-pointer ${isSaving ? 'animate-pop' : ''}`}
                  onClick={handleHeartClick}
                />
              )}
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 sm:gap-4 items-center w-full sm:w-auto justify-start sm:justify-end">
          {jobData.type && (
            <span
              className={`font-medium px-2 py-1 text-center rounded-full text-xs sm:text-sm border-1 min-w-[100px] sm:min-w-[112px] ${{
                Sent: "text-orange-500 border-orange-500",
                Viewed: "text-sky-500 border-sky-500",
                Shortlisted: "text-green-600 border-green-600",
                "Green Project": "text-green-600 border-green-600",
              }[jobData.type] || "text-gray-600 border-gray-300"
                }`}
            >
              {jobData.type}
            </span>
          )}

          {(jobData.postedsince || jobData.since_posted) && (
            <p className="text-gray-500 text-xs sm:text-sm whitespace-nowrap">
              Posted {jobData.postedsince || jobData.since_posted}
            </p>
          )}

          {showLike && (
            <div className="hidden sm:block relative">
              {jobData.isLiked ? (
                <IoHeartSharp
                  className={`text-green-600 w-5 h-5 cursor-pointer ${isSaving ? 'animate-pop' : ''}`}
                  onClick={handleHeartClick}
                />
              ) : (
                <IoHeartOutline
                  className={`text-gray-500 w-5 h-5 cursor-pointer ${isSaving ? 'animate-pop' : ''}`}
                  onClick={handleHeartClick}
                />
              )}
            </div>
          )}
        </div>
      </div>

      <div className="font-inter font-medium text-[#718096] text-sm leading-[22px] mb-3">
        {jobData.postedBy && (
          <>
            Posted by <span className="font-medium text-[#152A45]">{jobData.postedBy}</span>{" "}
          </>
        )}
        <span className="whitespace-nowrap">(Hourly Rate - ${jobData.rate}/hour)</span>
      </div>
      <div className="text-[#1A202C] text-sm sm:text-base font-medium leading-5 sm:leading-6 mb-4 break-words">
        <span>
          {isExpanded ? jobData.description : truncatedText}
          {isTruncated && (
            <button
              onClick={handleToggleDescription}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium ml-1 cursor-pointer"
            >
              {!isExpanded ? "...more" : "...less"}
            </button>
          )}
        </span>
      </div>

      <div className="flex flex-wrap gap-2 mb-4 items-center">
        <span className="text-[#718096] text-sm sm:text-[15px] font-medium leading-[22px] font-inter whitespace-nowrap">
          Required skills:
        </span>

        {jobData.skills && jobData.skills.map((skill, index) => (
          <span
            key={index}
            className="bg-gray-100 text-gray-500 px-2 sm:px-3 py-1 sm:py-2 rounded-full text-xs sm:text-sm flex items-center justify-center"
          >
            {skill}
          </span>
        ))}
      </div>

      <div className="border-t border-gray-300 pt-3 sm:pt-[24px] pb-[8px]">
        <div className="flex flex-col gap-3 sm:hidden">
          <div className="flex flex-wrap items-start">
            <div className="inline-flex items-center flex-shrink-0">
              <img src={marker} alt="Location" className="w-4 h-4 mr-1 mt-1" />
              <span className="font-medium text-sm text-[#718096]">Location:</span>
            </div>
            <span className="font-medium text-sm text-[#1A202C] ml-1 break-all">
              {jobData.location}
            </span>
          </div>
          <div className="flex flex-wrap items-center">
            <img src={calendar} alt="Start Date" className="w-4 h-4 flex-shrink-0" />
            <span className="font-medium text-sm leading-5 text-[#718096] ml-1">
              Start Date:
            </span>
            <span className="font-medium text-sm leading-5 text-[#1A202C] ml-2">
              {jobData.startDate}
            </span>
          </div>

          <div className="flex flex-wrap items-center">
            <img src={clock} alt="Duration" className="w-4 h-4 flex-shrink-0" />
            <span className="font-medium text-sm leading-5 text-[#718096] ml-1">
              Duration:
            </span>
            <span className="font-medium text-sm leading-5 text-[#1A202C] ml-2">
              {jobData.duration}
            </span>
          </div>

          {(jobData.application > 0 || jobData.applications_count > 0) && (
            <div className="flex items-center flex-wrap">
              <span className="text-[#1773E2] text-sm font-semibold">
                {jobData.applications_count || jobData.application}
              </span>
              <span className="text-[#1773E2] ml-2 text-sm font-semibold">Applications</span>
            </div>
          )}
        </div>

        <div className="hidden sm:flex flex-wrap items-start gap-x-8 gap-y-2 lg:gap-x-16 lg:gap-y-3 font-semibold">
          <div className="flex flex-col md:flex-row min-w-0">
            <div className="flex items-center gap-1 flex-shrink-0">
              <img src={marker} alt="Location" className="w-4 h-4 md:w-5 md:h-5" />
              <span className="text-[#718096] ml-1 text-sm md:text-base">Location:</span>
            </div>
            <span className="text-[#1A202C] ml-0 md:ml-3 text-sm md:text-base truncate">
              {jobData.location}
            </span>
          </div>

          <div className="flex flex-col md:flex-row min-w-0">
            <div className="flex items-center gap-1 flex-shrink-0">
              <img src={calendar} alt="Start Date" className="w-4 h-4 md:w-5 md:h-5" />
              <span className="text-[#718096] ml-1 text-sm md:text-base">Start Date:</span>
            </div>
            <span className="text-[#1A202C] ml-0 md:ml-3 text-sm md:text-base">
              {jobData.startDate}
            </span>
          </div>

          <div className="flex flex-col md:flex-row min-w-0">
            <div className="flex items-center gap-1 flex-shrink-0">
              <img src={clock} alt="Duration" className="w-4 h-4 md:w-5 md:h-5" />
              <span className="text-[#718096] ml-1 text-sm md:text-base">Duration:</span>
            </div>
            <span className="text-[#1A202C] ml-0 md:ml-3 text-sm md:text-base">
              {jobData.duration}
            </span>
          </div>

          {(jobData.application > 0 || jobData.applications_count > 0) && (
            <div className="flex items-center ml-auto">
              <span className="text-[#1773E2] text-base">
                {jobData.applications_count || jobData.application}
              </span>
              <span className="text-[#1773E2] ml-2 text-base">Applications</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
