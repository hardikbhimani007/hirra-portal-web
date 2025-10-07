import Navbar from '../../Components/Jobs/Navbar'
import icon2 from '../../assets/Jobs/icon2.svg'
import icon3 from '../../assets/Jobs/icon3.svg'
import icon4 from '../../assets/Jobs/icon4.svg'
import icon5 from '../../assets/Jobs/icon5.svg'
import usericon from '../../assets/Jobs/users.svg'
import selectedIcon2 from '../../assets/Jobs/selectedIcon2.svg'
import selectedIcon3 from '../../assets/Jobs/selectedIcon3.svg'
import selectedIcon4 from '../../assets/Jobs/selectedIcon4.svg'
import selectedIcon5 from '../../assets/Jobs/selectedIcon5.svg'
import selectedIcon6 from '../../assets/Jobs/selectedIcon6.svg'
import filecsv from '../../assets/Jobs/file-csv.svg'
import categoryicon from '../../assets/Jobs/category.svg'
import React, { useState } from 'react';
import { Trash2, AlertCircle } from 'lucide-react';
import { FaTimes } from "react-icons/fa";
import PopTrashIcon from '../../assets/icons/Pop-trashicon';
import DeleteConfirmModal from '../../Components/DeleteConfirmModal'
import { useEffect } from 'react';
import { getjobmanagement, deletejob } from '../../services/adminService';
import { toast } from 'react-toastify';
import "react-loading-skeleton/dist/skeleton.css";
import Skeleton from 'react-loading-skeleton';
import { FiInbox } from 'react-icons/fi'

const JobManagement = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [open, setOpen] = useState(false);
    const [selectedJobId, setSelectedJobId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [jobsData, setJobsData] = useState([]);
    const [abuseModalOpen, setAbuseModalOpen] = useState(false);
    const [selectedAbuseReports, setSelectedAbuseReports] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [fetching, setFetching] = useState(false);
    const [searchText, setSearchText] = useState("");
    const jobsPerPage = 12;

    useEffect(() => {
        const fetchJobs = async (page = 1, search = "") => {
            setFetching(true);
            try {
                const res = await getjobmanagement(page, search);
                if (res && res.success) {
                    const mappedJobs = res.data.map(job => ({
                        id: job.id,
                        jobTitle: job.title,
                        subcontractor: job.user_name || "N/A",
                        location: job.location,
                        postedDate: new Date(job.created_at).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric"
                        }),
                        applications: job.application_count,
                        status: job.status ? "Live" : "Closed",
                        abuseCount: job.abuse_count || 0,
                        abuseReports: job.abuse_reports || []
                    }));
                    setJobsData(mappedJobs);
                    setTotalPages(res.pagination?.pages || 1);
                }
            } catch (error) {
                console.error("Error fetching jobs:", error);
            } finally {
                setFetching(false);
            }
        };

        fetchJobs(currentPage, searchText);
    }, [currentPage, searchText]);

    const handleExportCSV = async () => {
        try {
            const res = await getjobmanagement("all");
            if (res && res.success) {
                const allJobs = res.data.map(job => ({
                    JobTitle: job.title,
                    Subcontractor: job.user_name || "N/A",
                    Location: job.location,
                    Posted: new Date(job.created_at).toLocaleDateString("en-GB"),
                    Applications: job.application_count,
                    Status: job.status ? "Live" : "Closed"
                }));

                const csvRows = [
                    Object.keys(allJobs[0]).join(","),
                    ...allJobs.map(obj => Object.values(obj).join(","))
                ];
                const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");

                const link = document.createElement("a");
                link.href = encodeURI(csvContent);
                link.download = "jobs.csv";
                link.click();
            }
        } catch (error) {
            console.error("CSV Export Error:", error);
        }
    };

    const handleDeleteClick = (jobId) => {
        setSelectedJobId(jobId);
        setOpen(true);
    };

    const handleAbuseClick = (reports) => {
        setSelectedAbuseReports(reports);
        setAbuseModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!selectedJobId) return;

        setLoading(true);
        try {
            const res = await deletejob(selectedJobId);
            if (res.success) {
                toast.success("Job deleted successfully!");
                const jobsRes = await getjobmanagement(currentPage);
                if (jobsRes && jobsRes.success) {
                    const mappedJobs = jobsRes.data.map(job => ({
                        id: job.id,
                        jobTitle: job.title,
                        subcontractor: job.user_name || "N/A",
                        location: job.location,
                        postedDate: new Date(job.created_at).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric"
                        }),
                        applications: job.application_count,
                        status: job.status ? "Live" : "Closed",
                        abuseCount: job.abuse_count || 0,
                        abuseReports: job.abuse_reports || []
                    }));
                    setJobsData(mappedJobs);
                }
            } else {
                toast.error("Failed to delete job");
            }
        } catch (error) {
            console.error("Error deleting job:", error);
            toast.error("Something went wrong while deleting job");
        }
        setLoading(false);
        setOpen(false);
        setSelectedJobId(null);
    };

    // const jobsPerPage = 12;
    // const totalPages = Math.ceil(jobsData.length / jobsPerPage);
    const paginatedJobs = jobsData.slice((currentPage - 1) * jobsPerPage, currentPage * jobsPerPage);

    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    return (
        <div className="h-auto bg-[#ffffff]">
            <Navbar
                navItems={[
                    { name: "Jobs", path: "/admin/jobs", icon: icon3, iconActive: selectedIcon3 },
                    { name: "Tradepersons", path: "/admin/managetradeperson", icon: usericon, iconActive: selectedIcon4 },
                    { name: "Subcontractors", path: "/admin/managesubcontractor", icon: usericon, iconActive: selectedIcon4 },
                    { name: "Categories", path: "/admin/categories", icon: categoryicon, iconActive: icon4 },
                    { name: "All Chats", path: "/admin/messages", icon: selectedIcon6, iconActive: icon5 }
                ]}
                onSearch={(val) => setSearchText(val)}
                showProfile={false}
            />

            <div className="container mx-auto">
                <main className="w-full mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="container mx-auto flex items-center justify-between">
                        <p className="text-[#1A202C] text-lg md:text-2xl font-bold">
                            Jobs Management
                        </p>
                        <button
                            className="py-2 px-3 md:py-2 md:px-6 rounded-lg cursor-pointer text-white bg-[#152A45] text-sm md:text-base"
                            onClick={handleExportCSV}
                        >
                            Export (CSV)
                        </button>
                    </div>

                    <div className="overflow-x-auto rounded-lg py-4">
                        <table className="min-w-full text-sm">
                            <thead className="bg-[#F6F6F7] rounded-[7px]">
                                <tr>
                                    <th className="px-4 py-3 text-left font-semibold text-[#718096] text-[16px]">Job Title</th>
                                    <th className="px-4 py-3 text-left font-semibold text-[#718096] text-[16px]">Subcontractor</th>
                                    <th className="px-4 py-3 text-left font-semibold text-[#718096] text-[16px]">Location</th>
                                    <th className="px-4 py-3 text-left font-semibold text-[#718096] text-[16px]">Posted</th>
                                    <th className="px-4 py-3 text-center font-semibold text-[#718096] text-[16px]">Applications</th>
                                    <th className="px-4 py-3 text-center font-semibold text-[#718096] text-[16px]">Status</th>
                                    <th className="px-4 py-3 text-center font-semibold text-[#718096] text-[16px]">Abuse Reports</th>
                                    <th className="px-4 py-3 text-center font-semibold text-[#718096] text-[16px]">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-transparent">
                                {fetching ? (
                                    Array.from({ length: 4 }).map((_, idx) => (
                                        <tr key={idx} className="border-b border-dashed border-[#D8DDE6] bg-transparent">
                                            <td className="px-4 py-3"><Skeleton /></td>
                                            <td className="px-4 py-3"><Skeleton /></td>
                                            <td className="px-4 py-3"><Skeleton /></td>
                                            <td className="px-4 py-3"><Skeleton /></td>
                                            <td className="px-4 py-3 text-center"><Skeleton /></td>
                                            <td className="px-4 py-3 text-center"><Skeleton /></td>
                                            <td className="px-4 py-3 text-center"><Skeleton /></td>
                                            <td className="px-4 py-3 text-center"><Skeleton /></td>
                                        </tr>
                                    ))
                                ) : jobsData.length === 0 ? (
                                    <tr className="">
                                        <td colSpan={8}>
                                            <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                                                <FiInbox className="w-16 h-16 opacity-50 mb-2" />
                                                <span className="text-sm">No records found</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    jobsData.map((job) => (
                                        <tr key={job.id} className="border-b border-dashed border-[#D8DDE6] bg-transparent">
                                            <td className="px-4 py-3 font-medium text-sm leading-6 text-[#1A202C]">
                                                {job.jobTitle}
                                            </td>
                                            <td className="px-4 py-3 font-medium text-sm leading-6 text-[#1A202C]">{job.subcontractor}</td>
                                            <td className="px-4 py-3 font-medium text-sm leading-6 text-[#1A202C] max-w-xs truncate">{job.location}</td>
                                            <td className="px-4 py-3 font-medium text-sm leading-6 text-[#1A202C]">{job.postedDate}</td>
                                            <td className="px-4 py-3 font-medium text-sm leading-6 text-[#1A202C] text-center">{job.applications}</td>
                                            <td className="px-4 py-3 font-medium text-sm leading-6 text-[#1A202C] text-center">
                                                <span className={`px-4 py-1 text-[14px] w-[80px] h-[34px] font-semibold rounded-full ${job.status === "Live" ? "bg-[#E6F9E9] text-[#2C9D41]" :
                                                    "bg-[#FCEBEA] text-[#D32F2F]"
                                                    }`}>
                                                    {job.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                {job.abuseCount > 0 ? (
                                                    <button
                                                        onClick={() => handleAbuseClick(job.abuseReports)}
                                                        className="flex items-center justify-center gap-1 cursor-pointer mx-auto px-3 py-1 bg-[#FFF4E6] text-[#FF9800] rounded-full hover:bg-[#FFE0B2] transition-colors"
                                                    >
                                                        <AlertCircle size={16} />
                                                        <span className="font-semibold">{job.abuseCount}</span>
                                                    </button>
                                                ) : (
                                                    <span className="text-[#718096]">-</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <button
                                                    onClick={() => handleDeleteClick(job.id)}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <Trash2 size={18} className="cursor-pointer" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {jobsData.length > 0 && (
                        <div className="flex justify-center items-center gap-2 mt-[32px]">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="px-4 py-2 rounded-lg cursor-pointer bg-[#ffffff] border border-[#D1D5DC] text-Black hover:bg-[#152A45] hover:text-white disabled:opacity-50 text-sm"
                            >
                                Previous
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    className={`px-4 py-2 cursor-pointer rounded-lg text-sm ${currentPage === page ? 'bg-[#152A45] text-white' : 'bg-[#FFFFFF] text-[#718096] border border-[#D1D5DC]'} hover:bg-[#152A45] hover:text-white`}
                                >
                                    {page}
                                </button>
                            ))}
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="px-4 cursor-pointer py-2 rounded-lg bg-[#ffffff] border border-[#D1D5DC] text-Black hover:bg-[#152A45] hover:text-white disabled:opacity-50 text-sm"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </main>
            </div>

            {open && (
                <DeleteConfirmModal
                    isOpen={open}
                    onClose={() => setOpen(false)}
                    onConfirm={confirmDelete}
                    loading={loading}
                    title="Delete Job"
                    message="Are you sure you want to delete this job?"
                    confirmText="Delete"
                    cancelText="Cancel"
                />
            )}

            {abuseModalOpen && (
                <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-xl flex flex-col">
                        <div className="flex items-center justify-between p-6 border-b border-[#E2E8F0]">
                            <h2 className="text-xl font-bold text-[#1A202C]">Abuse Reports</h2>
                            <button
                                onClick={() => setAbuseModalOpen(false)}
                                className="text-[#718096] hover:text-[#1A202C] transition-colors"
                            >
                                <FaTimes size={20} className="cursor-pointer" />
                            </button>
                        </div>

                        <div className="overflow-y-auto max-h-[calc(80vh-140px)] p-6">
                            {selectedAbuseReports.length === 0 ? (
                                <p className="text-center text-[#718096] py-8">No abuse reports found</p>
                            ) : (
                                <div className="space-y-4">
                                    {selectedAbuseReports.map((report) => (
                                        <div key={report.id} className="border border-[#E2E8F0] rounded-lg p-4 hover:shadow-md transition-shadow">
                                            <div className="flex items-start gap-4">
                                                <img
                                                    src={report.profile_pictures || 'https://via.placeholder.com/50'}
                                                    alt={report.name}
                                                    className="w-12 h-12 rounded-full object-cover"
                                                    onError={(e) => { e.target.src = 'https://via.placeholder.com/50' }}
                                                />
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <h3 className="font-semibold text-[#1A202C]">{report.name}</h3>
                                                        <span className="text-xs text-[#718096]">
                                                            {new Date(report.created_at).toLocaleDateString("en-GB", {
                                                                day: "2-digit",
                                                                month: "short",
                                                                year: "numeric",
                                                                hour: "2-digit",
                                                                minute: "2-digit"
                                                            })}
                                                        </span>
                                                    </div>
                                                    <div className="bg-[#FFF4E6] border-l-4 border-[#FF9800] p-3 rounded">
                                                        <p className="text-sm text-[#1A202C]">
                                                            <span className="font-semibold">Reason: </span>
                                                            {report.report_reason}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end p-4 border-t border-[#E2E8F0]">
                            <button
                                onClick={() => setAbuseModalOpen(false)}
                                className="px-6 py-4 bg-[#152A45] text-white rounded-lg cursor-pointer hover:bg-[#1e3a5f] transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JobManagement;