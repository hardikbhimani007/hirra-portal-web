import React, { useState, useEffect } from "react";
import Navbar from '../Components/Jobs/Navbar';
import JobCards from '../Components/Jobs/JobCards';
import JobDetailsDrawer from '../Components/Jobs/JobDetailsDrawer';
import { MdKeyboardDoubleArrowRight, MdKeyboardDoubleArrowLeft } from "react-icons/md";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { MyApplications } from "../services/jobService";
import { FiInbox } from 'react-icons/fi'

import icon1 from "../assets/Jobs/icon1.svg";
import icon2 from "../assets/Jobs/icon2.svg";
import icon3 from "../assets/Jobs/icon3.svg";
import selectedIcon1 from "../assets/Jobs/selectedIcon1.svg";
import selectedIcon2 from "../assets/Jobs/selectedIcon2.svg";
import selectedIcon3 from "../assets/Jobs/selectedIcon3.svg";

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
            if (page <= 2) pages.push(1, 2, 3, '...', totalPages);
            else if (page >= totalPages - 2) pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
            else pages.push(1, '...', page - 1, page, page + 1, '...', totalPages);
        }
        return pages;
    };

    const pages = getPageNumbers(page, totalPages);
    if (totalPages <= 1) return null;

    return (
        <div className="py-[24px] flex items-center justify-center">
            <div className="hidden sm:flex items-center justify-center gap-2">
                <GridButton disabled={page === 1} onClick={() => setPage(page - 1)} className="rounded-[10px] px-4 py-2 text-sm font-medium border-2 border-[#E5E7EB] bg-white text-[#1A202C] hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                    Previous
                </GridButton>

                {pages.map((p, i) =>
                    p === '...' ? (
                        <span key={`ellipsis-${i}`} className="px-2 text-gray-500">...</span>
                    ) : (
                        <GridButton key={i} onClick={() => setPage(p)} className={`h-[37px] w-[42px] rounded-[10px] text-sm font-medium cursor-pointer ${p === page ? 'bg-[#152A45] text-white' : 'border-2 border-[#E5E7EB] bg-white text-gray-600 hover:bg-gray-100'}`}>
                            {p}
                        </GridButton>
                    )
                )}

                <GridButton disabled={page === totalPages} onClick={() => setPage(page + 1)} className="rounded-[8px] px-6 py-2 text-sm font-medium border-2 border-[#E5E7EB] bg-white text-[#1A202C] hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                    Next
                </GridButton>
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

function Applications() {
    const [selectedJob, setSelectedJob] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("All");
    const [jobs, setJobs] = useState([]);
    const [counts, setCounts] = useState({ total: 0, viewed: 0, shortlisted: 0 });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchText, setSearchText] = useState("");

    const handleCardClick = (job) => {
        setSelectedJob(job);
        setIsDrawerOpen(true);
    };

    const closeDrawer = () => {
        setIsDrawerOpen(false);
        setSelectedJob(null);
    };

    const fetchApplications = async (page = 1, search = "", status = activeTab) => {
        try {
            setLoading(true);
            setError(null);

            const response = await MyApplications({
                page,
                status: status === "All" ? "" : status.toLowerCase(),
                search
            });

            if (response.success) {
                setJobs(response.data);
                setCounts({
                    total: response.total_applications,
                    viewed: response.viewed_count,
                    shortlisted: response.shortlisted_count
                });
                setTotalPages(response.total_pages);
            } else {
                setJobs([]);
                setError("No applications found");
            }
        } catch (err) {
            console.error(err);
            setError("Failed to load applications");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setCurrentPage(1);
        fetchApplications(1, searchText, activeTab);
    }, [activeTab, searchText]);

    useEffect(() => {
        fetchApplications(currentPage, searchText, activeTab);
    }, [currentPage]);

    const handlePageChange = (pageNumber) => {
        if (pageNumber < 1 || pageNumber > totalPages) return;
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <>
            <Navbar
                navItems={[
                    { name: "Jobs", path: "/tradesperson/jobs", icon: icon3, iconActive: selectedIcon3 },
                    { name: "Messages", path: "/tradesperson/messages", icon: icon2, iconActive: selectedIcon2 },
                    { name: "My Applications", path: "/tradesperson/myapplications", icon: icon1, iconActive: selectedIcon1 },
                ]}
                onSearch={(text) => setSearchText(text)}
            />

            <div className='container mx-auto px-4 md:px-8 -mt-8 2xl:mt-4'>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <p className='text-[#1A202C] text-2xl font-bold mb-4 md:mb-0'>My Applications</p>
                    <div className="flex border-b border-gray-300">
                        {[
                            { label: `All (${counts.total})`, value: "All" },
                            { label: `Viewed (${counts.viewed})`, value: "Viewed" },
                            { label: `Shortlisted (${counts.shortlisted})`, value: "Shortlisted" },
                        ].map(tab => (
                            <button
                                key={tab.value}
                                className={`px-2 md:px-4 py-2 font-medium text-sm md:text-base -mb-px border-b-2 transition-colors cursor-pointer
                  ${activeTab === tab.value ? "border-black text-black" : "border-transparent text-gray-500 hover:text-black hover:border-gray-400"}`}
                                onClick={() => setActiveTab(tab.value)}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className='container mx-auto px-4 md:px-8 mt-6'>
                {loading ? (
                    <div className="flex flex-col gap-4 mt-4">
                        {Array(2).fill(0).map((_, index) => (
                            <div key={index} className="w-full bg-[#fcfcfd] p-4 rounded-md">
                                <Skeleton height={20} width={`60%`} className="mb-2" />
                                <Skeleton height={14} width={`80%`} className="mb-1" />
                                <Skeleton height={14} width={`90%`} className="mb-1" />
                                <Skeleton height={14} width={`50%`} className="mt-2" />
                                <Skeleton height={30} width={`40%`} className="mt-4 rounded-md" />
                            </div>
                        ))}
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-16">
                        <FiInbox className="w-16 h-16 opacity-30 mb-2" />
                        <span className="text-base text-gray-500">No records found</span>
                    </div>
                ) : jobs.length > 0 ? (
                    jobs.map(job => (
                        <JobCards
                            key={job.id}
                            job={{
                                Jid: job.job_id,
                                title: job.title,
                                type: job.application_status,
                                postedBy: job?.Poster?.name,
                                rate: job.hourly_rate,
                                description: job.description,
                                skills: job.skills,
                                location: job.location,
                                appliedAt: job.since_applied,
                                startDate: job.start_date,
                                duration: job.duration,
                                isLiked: false
                            }}
                            onCardClick={handleCardClick}
                            toggleLike={() => { }}
                            showLike={false}
                        />
                    ))
                ) : (
                    <p className="text-gray-500 text-center mt-10">No applications found.</p>
                )}
            </div>

            {jobs.length > 0 && totalPages > 1 && currentPage <= totalPages && (
                <DataTablePagination page={currentPage} setPage={handlePageChange} totalPages={totalPages} />
            )}

            <JobDetailsDrawer job={selectedJob} isOpen={isDrawerOpen} onClose={closeDrawer} toggleLike={() => { }} showHeart={false} showapplybtn={false} />
        </>
    );
}

export default Applications;
