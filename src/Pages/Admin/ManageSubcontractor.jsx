import React, { useState, useEffect } from 'react';
import Navbar from '../../Components/Jobs/Navbar';
import DeleteConfirmModal from '../../Components/DeleteConfirmModal';
import { Edit, Trash2, AlertCircle } from 'lucide-react';
import EditSubcontractorModal from '../../Components/EditSubcontractorModal';
import icon3 from '../../assets/Jobs/icon3.svg';
import usericon from '../../assets/Jobs/users.svg';
import icon4 from '../../assets/Jobs/icon4.svg';
import selectedIcon3 from '../../assets/Jobs/selectedIcon3.svg';
import selectedIcon4 from '../../assets/Jobs/selectedIcon4.svg';
import selectedIcon5 from '../../assets/Jobs/selectedIcon5.svg';
import selectedIcon6 from '../../assets/Jobs/selectedIcon6.svg';
import icon5 from '../../assets/Jobs/icon5.svg';
import categoryicon from '../../assets/Jobs/category.svg';
import { getsubcontractors, deletesubcontractor, updatesubcontractor, UpdateSubcontractorStatus } from '../../services/adminService';
import { toast } from 'react-toastify';
import { FaTimes } from "react-icons/fa";
import "react-loading-skeleton/dist/skeleton.css";
import Skeleton from 'react-loading-skeleton';
import { FiInbox } from 'react-icons/fi'

const ManageSubcontractor = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [editUser, setEditUser] = useState(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [editModalOpen, setEditModalOpen] = useState(false);

    const [abuseModalOpen, setAbuseModalOpen] = useState(false);
    const [selectedAbuseReports, setSelectedAbuseReports] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    const usersPerPage = 10;
    const paginatedUsers = users;

    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchSubcontractors();
    }, []);

    useEffect(() => {
        fetchSubcontractors(currentPage, searchTerm.trim());
    }, [searchTerm]);

    const fetchSubcontractors = async (page = 1, search = "") => {
        try {
            setLoading(true);
            const response = await getsubcontractors(page, search);
            if (response.success && response.data) {
                const transformedData = response.data.map(user => ({
                    ...user,
                    status: user.is_active === 1 ? "Active" : "Inactive"
                }));
                setUsers(transformedData);
                setTotalPages(response.pagination?.pages || 1);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch subcontractors.");
        } finally {
            setLoading(false);
        }
    };

    const exportCSV = async () => {
        try {
            const response = await getsubcontractors("all");
            if (!response.success || !response.data) {
                toast.error("No data available for export.");
                return;
            }

            const rows = response.data.map(user => ({
                ID: user.id,
                Name: user.name,
                Email: user.email,
                Phone: user.phone,
                Location: user.location,
                Role: user.role,
                Status: user.is_active === 1 ? "Active" : "Inactive",
                AbuseReports: user.abuse_count,
            }));

            const header = Object.keys(rows[0]).join(",") + "\n";
            const csvData = rows.map(row => Object.values(row).map(val => `"${val || ""}"`).join(",")).join("\n");
            const blob = new Blob([header + csvData], { type: "text/csv;charset=utf-8;" });

            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "subcontractors.csv";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // toast.success("CSV exported successfully!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to export CSV.");
        }
    };

    const handleSuspendUser = async (id, currentStatus) => {
        try {
            const newStatus = currentStatus === "Active" ? 0 : 1;
            const res = await UpdateSubcontractorStatus(id, newStatus);

            if (res.success) {
                setUsers(prev =>
                    prev.map(user =>
                        user.id === id
                            ? { ...user, status: newStatus === 1 ? "Active" : "Inactive", is_active: newStatus }
                            : user
                    )
                );
                toast.success(`User ${newStatus === 1 ? "activated" : "suspended"} successfully.`);
            } else {
                toast.error(res.message || "Failed to update status.");
            }
        } catch (error) {
            toast.error("Error updating status. Please try again.");
        }
    };

    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
        fetchSubcontractors(page);
    };

    const handleDeleteClick = (user) => {
        setDeleteTarget(user);
        setDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!deleteTarget) return;
        try {
            await deletesubcontractor(deleteTarget.id);
            toast.success("Subcontractor deleted successfully.");
            fetchSubcontractors(currentPage);
        } catch (error) {
            toast.error("Failed to delete subcontractor.");
        } finally {
            setDeleteModalOpen(false);
            setDeleteTarget(null);
        }
    };

    const handleEdit = (user) => {
        setEditUser(user);
        setEditModalOpen(true);
    };

    const handleSaveEdit = async (formData) => {
        try {
            const payload = {
                id: editUser.id,
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                location: formData.location
            };
            const res = await updatesubcontractor(payload);

            if (res.success) {
                setUsers((prev) =>
                    prev.map((user) =>
                        user.id === editUser.id ? { ...user, ...payload } : user
                    )
                );
                toast.success("Subcontractor updated successfully.");
            } else {
                toast.error(res.message || "Failed to update subcontractor.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error updating subcontractor.");
        } finally {
            setEditModalOpen(false);
            setEditUser(null);
        }
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
                showProfile={false}
                onSearch={(value) => setSearchTerm(value)}
            />

            <div className="container mx-auto">
                <main className="w-full mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="container mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4">
                        <p className="text-[#1A202C] text-lg sm:text-2xl font-bold">
                            Manage Subcontractors
                        </p>

                        <button
                            onClick={exportCSV}
                            className="py-1.5 px-4 sm:py-2 sm:px-6 rounded-lg cursor-pointer text-sm sm:text-base text-white bg-[#152A45] hover:bg-[#1E3A5F] self-start sm:self-auto"
                        >
                            Export (CSV)
                        </button>
                    </div>

                    <div className="overflow-x-auto rounded-lg py-4">
                        <table className="min-w-full text-sm">
                            <thead className="bg-[#F6F6F7] rounded-[7px]">
                                <tr>
                                    <th className="px-4 py-3 text-left font-semibold text-[#718096] text-[16px]">Name</th>
                                    <th className="px-4 py-3 text-left font-semibold text-[#718096] text-[16px]">Email</th>
                                    <th className="px-4 py-3 text-left font-semibold text-[#718096] text-[16px]">Phone</th>
                                    <th className="px-4 py-3 text-left font-semibold text-[#718096] text-[16px]">Address</th>
                                    <th className="px-4 py-3 text-left font-semibold text-[#718096] text-[16px]">Role</th>
                                    <th className="px-4 py-3 text-center font-semibold text-[#718096] text-[16px]">Status</th>
                                    <th className="px-4 py-3 text-center font-semibold text-[#718096] text-[16px]">Abuse Reports</th>
                                    <th className="px-4 py-3 text-center font-semibold text-[#718096] text-[16px]">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-transparent">
                                {loading ? (
                                    Array.from({ length: 4 }).map((_, idx) => (
                                        <tr key={idx} className="border-b border-dashed border-[#D8DDE6] bg-transparent">
                                            <td className="px-4 py-2"><Skeleton /></td>
                                            <td className="px-4 py-2"><Skeleton /></td>
                                            <td className="px-4 py-2"><Skeleton /></td>
                                            <td className="px-4 py-2"><Skeleton /></td>
                                            <td className="px-4 py-2"><Skeleton /></td>
                                            <td className="px-4 py-2 text-center"><Skeleton /></td>
                                            <td className="px-4 py-2 text-center"><Skeleton /></td>
                                            <td className="px-4 py-2 text-center"><Skeleton /></td>
                                        </tr>
                                    ))
                                ) : users.length === 0 ? (
                                    <tr>
                                        <td colSpan={8}>
                                            <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                                                <FiInbox className="w-16 h-16 opacity-50 mb-2" />
                                                <span className="text-sm">No records found</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (paginatedUsers.map((user) => (
                                    <tr key={user.id} className="border-b border-dashed border-[#D8DDE6] bg-transparent">
                                        <td className="px-4 py-2 font-medium text-sm leading-6 text-[#1A202C]">{user.name || "-"}</td>
                                        <td className="px-4 py-2 font-medium text-sm leading-6 text-[#1A202C] lowercase">{user.email || "-"}</td>
                                        <td className="px-4 py-2 font-medium text-sm leading-6 text-[#1A202C]">{user.phone || "-"}</td>
                                        <td className="px-4 py-2 font-medium text-sm leading-6 text-[#1A202C] max-w-[200px] truncate" title={user.location}>{user.location || "-"}</td>
                                        <td className="px-4 py-2 font-medium text-sm leading-6 text-[#1A202C]">{user.role}</td>
                                        <td className="px-4 py-2 font-medium text-sm leading-6 text-[#1A202C] text-center">
                                            <span className={`block px-4 py-1.5 w-[110px] text-[14px] font-semibold rounded-full mx-auto ${user.status === "Active"
                                                ? "bg-[#E6F9E9] text-[#2C9D41]"
                                                : "bg-[#FFE6E6] text-[#D32F2F]"
                                                }`}>
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            {user.abuse_count > 0 ? (
                                                <button
                                                    onClick={() => {
                                                        setSelectedAbuseReports(user.abuse_reports);
                                                        setAbuseModalOpen(true);
                                                    }}
                                                    className="flex items-center justify-center gap-1 cursor-pointer mx-auto px-3 py-1 bg-[#FFF4E6] text-[#FF9800] rounded-full hover:bg-[#FFE0B2] transition-colors"
                                                >
                                                    <AlertCircle size={16} />
                                                    <span className="font-semibold">{user.abuse_count}</span>
                                                </button>
                                            ) : (
                                                <span className="text-[#718096]">-</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-2 text-center">
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    onClick={() => handleSuspendUser(user.id, user.status)}
                                                    className={`px-3 py-1.5 text-[13px] font-semibold rounded-[6px] cursor-pointer transition-colors ${user.status === "Active"
                                                        ? "bg-red-200 text-red-800 hover:bg-red-300 w-[80px]"
                                                        : "bg-green-200 text-green-800 hover:bg-green-300 w-[80px]"
                                                        }`}
                                                >
                                                    {user.status === "Active" ? "Suspend" : "Activate"}
                                                </button>
                                                <button
                                                    onClick={() => handleEdit(user)}
                                                    className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                                                    title="Edit"
                                                >
                                                    <Edit className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(user)}
                                                    className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {!loading && users.length > 0 && (
                        <div className="flex justify-center items-center gap-2 mt-[32px]">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="px-4 py-2 rounded-lg cursor-pointer bg-[#ffffff] border border-[#D1D5DC] hover:bg-[#152A45] hover:text-white disabled:opacity-50 text-sm"
                            >
                                Previous
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    className={`px-4 py-2 cursor-pointer rounded-lg text-sm ${currentPage === page
                                        ? "bg-[#152A45] text-white"
                                        : "bg-[#FFFFFF] text-[#718096] border border-[#D1D5DC]"
                                        } hover:bg-[#152A45] hover:text-white`}
                                >
                                    {page}
                                </button>
                            ))}
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 rounded-lg cursor-pointer bg-[#ffffff] border border-[#D1D5DC] hover:bg-[#152A45] hover:text-white disabled:opacity-50 text-sm"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </main>
            </div>

            {/* Delete Confirmation Modal */}
            <DeleteConfirmModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Subcontractor"
                message={deleteTarget ? `Are you sure you want to delete "${deleteTarget.name}"?` : "Are you sure?"}
                confirmText="Delete"
                cancelText="Cancel"
            />

            {/* Edit Modal */}
            <EditSubcontractorModal
                isOpen={editModalOpen}
                onClose={() => {
                    setEditModalOpen(false);
                    setEditUser(null);
                }}
                onSubmit={handleSaveEdit}
                initialData={editUser}
            />

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
                                        <div
                                            key={report.id}
                                            className="border border-[#E2E8F0] rounded-lg p-4 hover:shadow-md transition-shadow"
                                        >
                                            <div className="flex items-start gap-4">
                                                <img
                                                    src={report.reporter_profile_pictures || 'https://via.placeholder.com/50'}
                                                    alt={report.reporter_name}
                                                    className="w-12 h-12 rounded-full object-cover"
                                                    onError={(e) => { e.target.src = 'https://via.placeholder.com/50' }}
                                                />
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <h3 className="font-semibold text-[#1A202C]">{report.reporter_name}</h3>
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
                                className="px-6 py-2 bg-[#152A45] text-white rounded-lg cursor-pointer hover:bg-[#1e3a5f] transition-colors"
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

export default ManageSubcontractor;
