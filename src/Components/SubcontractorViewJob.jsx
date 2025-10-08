import { useState, useEffect, useRef, useCallback } from "react";
import JobCardDetails from '../Components/Jobs/JobCardDetails';
import ApplicationsCards from '../Components/Jobs/ApplicationsCards';
import { HiArrowSmLeft } from "react-icons/hi";
import { GetJobById, GetApplications } from "../services/jobService";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { FiInbox } from 'react-icons/fi'

export default function SubcontractorViewJob({ job, onClose, searchText }) {
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [jobDetails, setJobDetails] = useState(null);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState(null);
    const [hasMore, setHasMore] = useState(true);

    const observer = useRef();

    useEffect(() => {
        const fetchJobData = async () => {
            if (!job?.Jid) {
                setError("No job ID provided");
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                setError(null);

                const jobResponse = await GetJobById(job.Jid);
                if (jobResponse && jobResponse.data) {
                    const mappedJob = {
                        title: jobResponse.data.title || job.title,
                        Jid: jobResponse.data.id || job.Jid,
                        userId: jobResponse.data.userId || job.userId,
                        type: jobResponse.data.is_greeen_project ? "Green Project" : job.type || "",
                        postedBy: jobResponse.data.name || job.postedBy || "Subcontractor",
                        rate: jobResponse.data.hourly_rate || job.rate,
                        description: jobResponse.data.description || job.description,
                        skills: JSON.parse(jobResponse.data.skills) || JSON.parse(job.skills) || [],
                        location: jobResponse.data.location || job.location,
                        startDate: jobResponse.data.start_date || job.startDate,
                        duration: jobResponse.data.duration || job.duration,
                        isLiked: jobResponse.data.saved || job.isLiked || false,
                        application: jobResponse.data.applications_count || job.application || 0,
                        postedsince: jobResponse.data.since_posted || job.postedsince,
                        applications_count: jobResponse.data.applications_count || job.applications_count || 0
                    };
                    setJobDetails(mappedJob);
                }
            } catch (err) {
                setError(err.message || "Failed to load job details");
            } finally {
                setLoading(false);
            }
        };

        fetchJobData();
    }, [job]);

    const fetchApplications = async (last_id = null) => {
        if (!jobDetails) return;
        try {
            if (last_id) setLoadingMore(true);

            const params = { last_id };
            if (searchText && searchText.trim() !== "") {
                params.search = searchText.trim();
            }

            const applicationsResponse = await GetApplications(jobDetails.Jid, params);

            if (applicationsResponse?.success && applicationsResponse.data?.length > 0) {
                const newApps = applicationsResponse.data.map(app => ({
                    id: app.id,
                    Jid: app.id,
                    userId: app.userId,
                    applicationId: app.application_id,
                    name: app.name || "Applicant",
                    image: app.profile_picture,
                    location: app.location || "Location not specified",
                    description: app.description || "No description provided",
                    travelRadius: app.radius,
                    availability: app.availability,
                    application_status: app.application_status,
                    since_applied: app.since_applied,
                    hourly_rate: app.hourly_rate,
                    skills: JSON.parse(app.skills) || [],
                    is_greeen_project: app.is_greeen_project,
                    start_date: app.start_date,
                    duration: app.duration,
                    user_type: app.user_type,
                    title: app.title
                }));

                setApplications(prev => {
                    const allApps = last_id ? [...prev, ...newApps] : newApps;
                    const uniqueApps = [];
                    const userIds = new Set();
                    allApps.forEach(app => {
                        if (!userIds.has(app.userId)) {
                            userIds.add(app.userId);
                            uniqueApps.push(app);
                        }
                    });
                    return uniqueApps;
                });

                setHasMore(applicationsResponse.data.length > 0);
            } else {
                setHasMore(false);
            }
        } catch (err) {
            console.error("Error fetching applications:", err);
            setHasMore(false);
        } finally {
            setLoadingMore(false);
        }
    };

    useEffect(() => {
        if (!jobDetails) return;

        setApplications([]);
        // setHasMore(true);

        fetchApplications();
    }, [jobDetails, searchText]);

    const lastApplicationRef = useCallback(
        node => {
            if (loadingMore) return;
            if (!node) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver(entries => {
                if (entries[0].isIntersecting && hasMore) {
                    const lastApp = applications[applications.length - 1];
                    if (lastApp) {
                        console.log("lastApp ", lastApp.applicationId)
                        fetchApplications(lastApp.applicationId);
                    }
                }
            });
            observer.current.observe(node);
        },
        [loadingMore, hasMore, applications]
    );


    const handleCardClick = (application) => {
        setSelectedApplication(application);
    };

    const exportToCSV = async () => {
        try {
            const applicationsResponse = await GetApplications(jobDetails.Jid, { last_id: "all" });
            if (!applicationsResponse || !applicationsResponse.data || applicationsResponse.data.length === 0) {
                alert("No applications to export");
                return;
            }

            const allApplications = applicationsResponse.data;

            const headers = [
                "Application ID",
                "Applicant Name",
                "Job Title",
                "Location",
                "Hourly Rate",
                "Application Status",
                "Date Applied",
                "Skills",
                "Availability",
                "Travel Radius",
                "User Type",
                "Green Project"
            ];

            const csvRows = allApplications.map(application => [
                application.application_id || "N/A",
                `"${application.name?.replace(/"/g, '""') || "Applicant"}"`,
                `"${application.title?.replace(/"/g, '""') || "N/A"}"`,
                `"${application.location?.replace(/"/g, '""') || "N/A"}"`,
                application.hourly_rate || "N/A",
                application.application_status || "N/A",
                application.since_applied || "N/A",
                `"${(JSON.parse(application.skills) || []).join(', ').replace(/"/g, '""')}"`,
                application.availability || "N/A",
                application.radius || "N/A",
                application.user_type || "N/A",
                application.is_greeen_project ? "Yes" : "No"
            ]);

            const csvContent = [
                headers.join(","),
                ...csvRows.map(row => row.join(","))
            ].join("\n");

            const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.setAttribute("href", url);
            link.setAttribute(
                "download",
                `applications_${jobDetails.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${new Date().toISOString().split('T')[0]}.csv`
            );
            link.style.visibility = "hidden";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Error exporting CSV:", error);
            alert("Failed to export applications");
        }
    };


    if (loading) {
        return (
            <div className="overflow-hidden">
                <div className='container mx-auto px-1 md:px-8 flex items-center justify-between'>
                    <div className="flex items-center gap-2 md:gap-4">
                        <button
                            className="text-gray-500 bg-[#F6F6F7] p-1 md:p-2 hover:text-gray-800 text-2xl cursor-pointer rounded-lg"
                            onClick={onClose}
                        >
                            <HiArrowSmLeft />
                        </button>
                        <p className='text-[#1A202C] text-base md:text-2xl font-semibold'></p>
                    </div>
                    <button
                        className='py-2 px-6 rounded-lg font-semibold cursor-pointer text-white bg-[#152A45]'
                        disabled
                    >
                        Export (CSV)
                    </button>
                </div>
                <div className="container mx-auto px-4 flex flex-col lg:flex-row gap-0 md:gap-6">
                    <p className="text-gray-500 text-center mt-10 w-full">
                        <p className="text-gray-500 text-center mt-10">
                            <p className="text-gray-500 text-start mt-10">
                                <div className="flex flex-col gap-4 mt-4">
                                    {Array(1).fill(0).map((_, index) => (
                                        <div key={index} className="w-full bg-[#fcfcfd] p-4 rounded-md">
                                            <Skeleton
                                                height={20}
                                                width={`60%`}
                                                baseColor="#ebebebff"
                                                highlightColor="#ebebebff"
                                                className="mb-2"
                                            />
                                            <Skeleton
                                                height={14}
                                                width={`80%`}
                                                baseColor="#ebebebff"
                                                highlightColor="#ebebebff"
                                                className="mb-1"
                                            />
                                            <Skeleton
                                                height={14}
                                                width={`90%`}
                                                baseColor="#ebebebff"
                                                highlightColor="#ebebebff"
                                                className="mb-1"
                                            />
                                            <Skeleton
                                                height={14}
                                                width={`50%`}
                                                baseColor="#ebebebff"
                                                highlightColor="#ebebebff"
                                                className="mt-2"
                                            />
                                            <Skeleton
                                                height={30}
                                                width={`40%`}
                                                baseColor="#ebebebff"
                                                highlightColor="#ebebebff"
                                                className="mt-4 rounded-md"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </p>
                        </p>
                    </p>
                </div>
            </div>
        );
    }

    if (error || !jobDetails) {
        return (
            <div className="overflow-hidden">
                <div className='container mx-auto px-1 md:px-8 flex items-center justify-between'>
                    <div className="flex items-center gap-2 md:gap-4">
                        <button
                            className="text-gray-500 bg-[#F6F6F7] p-1 md:p-2 hover:text-gray-800 text-2xl cursor-pointer rounded-lg"
                            onClick={onClose}
                        >
                            <HiArrowSmLeft />
                        </button>
                        <p className='text-[#1A202C] text-base md:text-2xl font-semibold'>Error</p>
                    </div>
                    <button
                        className='py-2 px-6 rounded-lg font-semibold cursor-pointer text-white bg-[#152A45]'
                        disabled
                    >
                        Export (CSV)
                    </button>
                </div>
                <div className="container mx-auto px-4 flex flex-col lg:flex-row gap-0 md:gap-6">
                    <p className="text-red-500 text-center mt-10 w-full">{error || "No job data available"}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="overflow-hidden">
            <div className="container mx-auto px-4 md:px-8 flex flex-col xl:flex-row gap-2 xl:items-center justify-between">
                <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
                    <button
                        className="text-gray-500 bg-[#F6F6F7] p-1 md:p-2 hover:text-gray-800 text-2xl cursor-pointer rounded-lg"
                        onClick={onClose}
                    >
                        <HiArrowSmLeft />
                    </button>
                    <p className="text-[#1A202C] font-semibold text-base md:text-lg xl:text-2xl truncate max-w-[calc(200vw-160px)]">
                        {jobDetails.title}
                    </p>
                </div>

                <div className="flex xl:flex-none w-full xl:w-auto mt-2 xl:mt-0">
                    <button
                        className="py-1.5 px-4 md:py-2 md:px-6 rounded-lg font-semibold text-sm md:text-base cursor-pointer text-white bg-[#152A45] hover:bg-[#0f1f33] transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        onClick={exportToCSV}
                        disabled={applications.length === 0}
                    >
                        Export (CSV)
                    </button>
                </div>
            </div>

            <div className="container mx-auto px-4 flex flex-col lg:flex-row gap-0 md:gap-6">
                <h2 className="text-xl font-bold text-gray-800"></h2>

                <div className="lg:w-5/12 w-full my-2 lg:my-7">
                    <JobCardDetails
                        job={jobDetails}
                        onCardClick={handleCardClick}
                        showLike={false}
                    />
                </div>

                <div className="lg:w-7/12 w-full flex flex-col">
                    <h2 className="text-base md:text-2xl font-bold text-gray-800">Applications</h2>
                    <div className="overflow-y-auto h-[calc(100vh-200px)] min-h-[400px] pr-2 no-scrollbar scroll-smooth">
                        {applications.map((application, index) => {
                            if (index === applications.length - 1) {
                                return (
                                    <div ref={lastApplicationRef} key={application.id}>
                                        <ApplicationsCards
                                            job={application}
                                            onCardClick={handleCardClick}
                                            showLike={false}
                                        />
                                    </div>
                                );
                            } else {
                                return (
                                    <ApplicationsCards
                                        key={application.id}
                                        job={application}
                                        onCardClick={handleCardClick}
                                        showLike={false}
                                    />
                                );
                            }
                        })}

                        {loadingMore && (
                            <p className="text-center text-gray-500 my-2">Loading more...</p>
                        )}

                        {/* {!hasMore && applications.length > 0 && (
                            <p className="text-center text-gray-400 my-2">No more applications</p>
                        )} */}

                        {applications.length === 0 && !loading && (
                            <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                                <FiInbox className="w-16 h-16 opacity-50 mb-2" />
                                <span className="text-sm">No records found</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}