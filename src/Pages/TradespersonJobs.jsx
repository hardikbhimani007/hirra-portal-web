import React, { useState, useEffect } from "react";
import Navbar from '../Components/Jobs/Navbar';
import JobCards from '../Components/Jobs/JobCards';
import JobDetailsDrawer from '../Components/Jobs/JobDetailsDrawer';
import { HiArrowSmLeft } from "react-icons/hi";
import icon1 from "../assets/Jobs/icon1.svg";
import icon2 from "../assets/Jobs/icon2.svg";
import icon3 from "../assets/Jobs/icon3.svg";
import selectedIcon1 from "../assets/Jobs/selectedIcon1.svg";
import selectedIcon2 from "../assets/Jobs/selectedIcon2.svg";
import selectedIcon3 from "../assets/Jobs/selectedIcon3.svg";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { GetTradePersonJobs, Savejobs } from "../services/jobService";
import { FiInbox } from 'react-icons/fi'

const GridButton = ({ children, className, disabled, onClick, ...props }) => (
    <button className={className} disabled={disabled} onClick={onClick} {...props}>
        {children}
    </button>
);

const DataTablePagination = ({ page, setPage, totalPages }) => {
    const getPageNumbers = (page, totalPages) => {
        const pages = [];

        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            if (page <= 2) {
                pages.push(1, 2, 3, '...', totalPages);
            } else if (page >= totalPages - 2) {
                pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push(1, '...', page - 1, page, page + 1, '...', totalPages);
            }
        }

        return pages;
    };

    const pages = getPageNumbers(page, totalPages);

    if (totalPages <= 1) return null;

    return (
        <div className="py-[24px] flex items-center justify-center">
            <div className="hidden sm:flex items-center justify-center gap-2">
                {/* <GridButton
                    disabled={page === 1}
                    onClick={() => setPage(1)}
                    className="rounded-[10px] px-3 py-2 text-sm font-medium border-2 border-[#E5E7EB] bg-white text-[#1A202C] hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer "
                >
                    <MdKeyboardDoubleArrowLeft size={18} />
                </GridButton> */}

                <GridButton
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="rounded-[10px] px-4 py-2 text-sm font-medium border-2 border-[#E5E7EB] bg-white text-[#1A202C] hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer "
                >
                    Previous
                </GridButton>

                {pages.map((p, i) =>
                    p === '...' ? (
                        <span key={`ellipsis-${i}`} className="px-2 text-gray-500">...</span>
                    ) : (
                        <GridButton
                            key={i}
                            onClick={() => setPage(p)}
                            className={`h-[37px] w-[42px] rounded-[10px] text-sm font-medium cursor-pointer ${p === page
                                ? 'bg-[#152A45] text-white'
                                : 'border-2 border-[#E5E7EB] bg-white text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            {p}
                        </GridButton>
                    )
                )}

                <GridButton
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                    className="rounded-[8px] px-6 py-2 text-sm font-medium border-2 border-[#E5E7EB] bg-white text-[#1A202C] hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer "
                >
                    Next
                </GridButton>

                {/* <GridButton
                    disabled={page === totalPages}
                    onClick={() => setPage(totalPages)}
                    className="rounded-[10px] px-3 py-2 text-sm font-medium border-2 border-[#E5E7EB] bg-white text-[#1A202C] hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer "
                >
                    <MdKeyboardDoubleArrowRight size={18} />
                </GridButton> */}
            </div>

            <div className="flex w-full items-center justify-center sm:hidden gap-2">
                {/* <GridButton disabled={page === 1} onClick={() => setPage(1)} className="px-3 py-2 text-xs border-2 border-[#E5E7EB] rounded-md bg-white text-[#1A202C] disabled:opacity-50 disabled:cursor-not-allowed">{'<<'}</GridButton> */}
                <GridButton disabled={page === 1} onClick={() => setPage(page - 1)} className="px-3 py-2 text-xs border-2 border-[#E5E7EB] rounded-md bg-white text-[#1A202C] disabled:opacity-50 disabled:cursor-not-allowed">Prev</GridButton>
                <span className="text-xs mx-2 font-medium text-gray-600 whitespace-nowrap">Page <span className="text-[#1773E2]">{page}</span> of <span className="text-[#1773E2]">{totalPages}</span></span>
                <GridButton disabled={page === totalPages} onClick={() => setPage(page + 1)} className="px-3 py-2 text-xs border-2 border-[#E5E7EB] rounded-md bg-white text-[#1A202C] disabled:opacity-50 disabled:cursor-not-allowed">Next</GridButton>
                {/* <GridButton disabled={page === totalPages} onClick={() => setPage(totalPages)} className="px-3 py-2 text-xs border-2 border-[#E5E7EB] rounded-md bg-white text-[#1A202C] disabled:opacity-50 disabled:cursor-not-allowed">{'>>'}</GridButton> */}
            </div>
        </div>
    );
};

const SkeletonLoader = ({ count = 2 }) => (
    <div className="flex flex-col gap-4 mt-4">
        {Array(count).fill(0).map((_, index) => (
            <div key={index} className="w-full bg-[#fcfcfd] p-4 rounded-md">
                <Skeleton height={20} width="60%" className="mb-2" />
                <Skeleton height={14} width="80%" className="mb-1" />
                <Skeleton height={14} width="90%" className="mb-1" />
                <Skeleton height={14} width="50%" className="mt-2" />
                <Skeleton height={30} width="40%" className="mt-4 rounded-md" />
            </div>
        ))}
    </div>
);

function TradespersonJobs() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [savingJobs, setSavingJobs] = useState(new Set());
    const [selectedJob, setSelectedJob] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [showSaved, setShowSaved] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchText, setSearchText] = useState("");

    const fetchJobs = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await GetTradePersonJobs(currentPage, searchText, showSaved);

            const jobsData = response.data || [];
            setJobs(jobsData.map(job => ({
                Jid: job.id,
                title: job.title,
                description: job.description,
                location: job.location,
                rate: job.hourly_rate,
                startDate: job.start_date,
                duration: job.duration,
                skills: JSON.parse(job.skills) || [],
                isLiked: job.saved,
                postedBy: job.name,
                type: job.is_greeen_project ? "Green Project" : "",
                is_applied: job.is_applied,
                since_posted: job.since_posted
            })));

            setTotalPages(response.total_pages || 1);
        } catch (err) {
            console.error(err);
            setError(err.response?.message || err.message || "Error fetching jobs");
            setJobs([]);
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchJobs(); }, [currentPage, searchText, showSaved]);
    useEffect(() => { setCurrentPage(1); }, [searchText, showSaved]);

    const toggleLike = async (jobId) => {
        if (savingJobs.has(jobId)) return;

        setSavingJobs(prev => new Set(prev).add(jobId));

        try {
            setJobs(prev => prev.map(job => job.Jid === jobId ? { ...job, isLiked: !job.isLiked } : job));
            setSelectedJob(prev => prev && prev.Jid === jobId ? { ...prev, isLiked: !prev.isLiked } : prev);
            await Savejobs({ job_id: jobId });
        } catch (err) {
            console.error(err);
            alert("Failed to update saved status");
        } finally {
            setSavingJobs(prev => { const s = new Set(prev); s.delete(jobId); return s; });
        }
    };

    return (
        <>
            <Navbar
                navItems={[
                    { name: "Jobs", path: "/tradesperson/jobs", icon: icon3, iconActive: selectedIcon3 },
                    { name: "Messages", path: "/tradesperson/messages", icon: icon2, iconActive: selectedIcon2 },
                    { name: "My Applications", path: "/tradesperson/myapplications", icon: icon1, iconActive: selectedIcon1 }
                ]}
                userRole="tradesperson"
                onSearch={setSearchText}
            />

            <div className='container mx-auto px-4 md:px-8 flex items-center justify-between -mt-8 2xl:mt-4'>
                <div className="flex items-center gap-2">
                    {showSaved && (
                        <button
                            className="text-gray-500 bg-[#F6F6F7] p-1 md:p-2 hover:text-gray-800 text-2xl cursor-pointer rounded-lg"
                            onClick={() => setShowSaved(false)}
                        >
                            <HiArrowSmLeft />
                        </button>
                    )}
                    <p className='text-[#1A202C] text-2xl font-bold'>{showSaved ? "Saved Jobs" : "Jobs"}</p>
                </div>
                {!showSaved && (
                    <button
                        className="py-2 px-4 rounded-md font-semibold cursor-pointer bg-[#152A45] text-white"
                        onClick={() => setShowSaved(true)}
                    >
                        Saved Jobs
                    </button>
                )}
            </div>

            <div className='container mx-auto px-4 md:px-8 mt-4 md:mt-6'>
                {loading ? (
                    <SkeletonLoader count={2} />
                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-16">
                        <FiInbox className="w-16 h-16 opacity-30 mb-2" />
                        <span className="text-base text-gray-500">No records found</span>
                    </div>
                ) : jobs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16">
                        <FiInbox className="w-16 h-16 opacity-30 mb-2" />
                        <span className="text-base text-gray-500">No records found</span>
                    </div>
                ) : (
                    jobs.map((job, index) => (
                        <JobCards
                            key={index}
                            job={job}
                            onCardClick={job => { setSelectedJob(job); setIsDrawerOpen(true); }}
                            toggleLike={toggleLike}
                            isSaving={savingJobs.has(job.Jid)}
                        />
                    ))
                )}
            </div>

            {jobs.length > 0 && totalPages > 1 && (
                <DataTablePagination page={currentPage} setPage={setCurrentPage} totalPages={totalPages} />
            )}

            <JobDetailsDrawer
                job={selectedJob}
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                toggleLike={toggleLike}
                showHeart
                isSaving={selectedJob ? savingJobs.has(selectedJob.Jid) : false}
                onApplySuccess={jobId => setJobs(prev => prev.map(job => job.Jid === jobId ? { ...job, is_applied: true } : job))}
            />
        </>
    );
}

export default TradespersonJobs;
