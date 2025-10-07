import { useState, useEffect } from "react";
import Navbar from '../Components/Jobs/Navbar';
import JobCards from '../Components/Jobs/JobCards';
import AddJobModal from '../Components/Jobs/AddJobModal';
import SubcontractorViewJob from '../Components/SubcontractorViewJob';
import icon2 from "../assets/Jobs/icon2.svg";
import icon3 from "../assets/Jobs/icon3.svg";
import selectedIcon2 from "../assets/Jobs/selectedIcon2.svg";
import selectedIcon3 from "../assets/Jobs/selectedIcon3.svg";
import { GetJobs } from "../services/jobService";
import { MdKeyboardDoubleArrowRight, MdKeyboardDoubleArrowLeft } from "react-icons/md";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { FiInbox } from "react-icons/fi";

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
                <GridButton
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="rounded-[10px] px-4 py-2 text-sm font-medium border-2 border-[#E5E7EB] bg-white text-[#1A202C] hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
                    className="rounded-[8px] px-6 py-2 text-sm font-medium border-2 border-[#E5E7EB] bg-white text-[#1A202C] hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
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

function SubcontractorJobs() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchText, setSearchText] = useState("");

    const fetch = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await GetJobs(currentPage, searchText);
            if (response.success) {
                const mappedJobs = response.data.map(job => ({
                    Jid: job.id,
                    title: job.title,
                    userId: job.user_id,
                    description: job.description,
                    location: job.location,
                    rate: job.hourly_rate,
                    startDate: job.start_date,
                    duration: job.duration,
                    skills: job.skills,
                    isLiked: job.saved,
                    application: job.applications_count,
                    postedsince: job.since_posted,
                    type: job.is_greeen_project ? "Green Project" : "",
                    applications_count: job.applications_count
                }));
                setJobs(mappedJobs);
                setTotalPages(response.total_pages || 1);
            } else {
                setJobs([]);
            }
        } catch (err) {
            console.error(err);
            setError("Failed to load jobs");
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetch();
    }, [currentPage, searchText]);

    const handlePageChange = (pageNumber) => {
        if (pageNumber < 1 || pageNumber > totalPages) return;
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleCardClick = (job) => setSelectedJob(job);
    const toggleLike = (jobId) => setJobs(prev => prev.map(job => job.Jid === jobId ? { ...job, isLiked: !job.isLiked } : job));

    return (
        <>
            <Navbar
                navItems={[
                    { name: "Jobs", path: "/subcontractor/jobs", icon: icon3, iconActive: selectedIcon3 },
                    { name: "Messages", path: "/subcontractor/messages", icon: icon2, iconActive: selectedIcon2 }
                ]}
                userRole={"subcontractor"}
                onSearch={(text) => {
                    setSearchText(text);
                    // setCurrentPage(1);
                }}
            />

            {selectedJob ? (
                <SubcontractorViewJob job={selectedJob} onClose={() => setSelectedJob(null)} searchText={searchText} />
            ) : (
                <>
                    <div className='container mx-auto px-4 md:px-8 flex items-center justify-between -mt-8 2xl:mt-4'>
                        <p className='text-[#1A202C] text-2xl font-bold'>Jobs</p>
                        <button className='py-2 px-4 rounded-lg font-semibold cursor-pointer text-white bg-[#152A45]' onClick={() => setIsModalOpen(true)}>Add New Job</button>
                    </div>

                    {isModalOpen && <AddJobModal onClose={() => setIsModalOpen(false)} setStateJobs={setJobs} onSave={() => {
                        setIsModalOpen(false);
                        fetch(currentPage);
                    }} />}

                    <div className='container mx-auto px-4 md:px-8 mt-4 md:mt-6'>
                        {loading ? (
                            <div className="flex flex-col gap-4 mt-4">
                                {Array(2).fill(0).map((_, index) => (
                                    <div key={index} className="w-full bg-[#fcfcfd] p-4 rounded-md">
                                        <Skeleton height={20} width={`60%`} baseColor="#ebebebff" highlightColor="#ebebebff" className="mb-2" />
                                        <Skeleton height={14} width={`80%`} baseColor="#ebebebff" highlightColor="#ebebebff" className="mb-1" />
                                        <Skeleton height={14} width={`90%`} baseColor="#ebebebff" highlightColor="#ebebebff" className="mb-1" />
                                        <Skeleton height={14} width={`50%`} baseColor="#ebebebff" highlightColor="#ebebebff" className="mt-2" />
                                        <Skeleton height={30} width={`40%`} baseColor="#ebebebff" highlightColor="#ebebebff" className="mt-4 rounded-md" />
                                    </div>
                                ))}
                            </div>
                        ) : jobs.length === 0 && searchText.length > 0 ? (
                            <div className="flex flex-col items-center justify-center py-16">
                                <FiInbox className="w-16 h-16 opacity-30 mb-2" />
                                <span className="text-base text-gray-500">No records found</span>
                            </div>
                        ) : jobs.length > 0 ? (
                            jobs.map(job => (
                                <JobCards key={job.id} job={job} onCardClick={handleCardClick} toggleLike={toggleLike} showLike={false} />
                            ))
                        ) : (
                            <p className="text-gray-500 text-center my-30">
                                Looks like you haven’t posted any jobs for tradespersons yet. <br /> Click the <span className="text-black font-semibold">Add Job Post</span> button above to get started and connect with skilled professionals ready to work!
                            </p>
                        )}
                    </div>

                    {jobs.length > 0 && totalPages > 1 && !error && (
                        <DataTablePagination page={currentPage} setPage={handlePageChange} totalPages={totalPages} />
                    )}
                </>
            )}
        </>
    );
}

export default SubcontractorJobs;
