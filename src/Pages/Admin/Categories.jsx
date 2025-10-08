import { useState, useEffect } from 'react';
import Navbar from '../../Components/Jobs/Navbar';
import TradeSkillsModal from '../../Components/TradeSkillsModal';
import DeleteConfirmModal from '../../Components/DeleteConfirmModal';
import { toast } from 'react-toastify';
import icon3 from '../../assets/Jobs/icon3.svg';
import icon4 from '../../assets/Jobs/icon4.svg';
import icon5 from '../../assets/Jobs/icon5.svg';
import selectedIcon3 from '../../assets/Jobs/selectedIcon3.svg';
import selectedIcon4 from '../../assets/Jobs/selectedIcon4.svg';
import selectedIcon6 from '../../assets/Jobs/selectedIcon6.svg';
import categoryicon from '../../assets/Jobs/category.svg';
import usericon from '../../assets/Jobs/users.svg';
import { Edit, Trash2 } from 'lucide-react';
import { FiInbox } from 'react-icons/fi'
import { getCategories, DeleteCategory } from '../../services/adminService';
import "react-loading-skeleton/dist/skeleton.css";

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [selectedRows, setSelectedRows] = useState(new Set());
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editData, setEditData] = useState(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchCategories = async (page = 1, search = "") => {
        try {
            setLoading(true);
            const response = await getCategories(page, search);
            setCategories(response.data);
            setTotalPages(response.pagination.pages);
        } catch (err) {
            console.error("Error fetching categories:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories(currentPage);
    }, [currentPage]);

    useEffect(() => {
        fetchCategories(currentPage, searchQuery);
    }, [currentPage, searchQuery]);

    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    const handleSelectAll = (checked) => {
        if (checked) {
            setSelectedRows(new Set(categories.map(cat => cat.id)));
        } else {
            setSelectedRows(new Set());
        }
    };

    const handleSelectRow = (id, checked) => {
        const newSelected = new Set(selectedRows);
        checked ? newSelected.add(id) : newSelected.delete(id);
        setSelectedRows(newSelected);
    };

    const handleEdit = (cat) => {
        setEditData(cat);
        setIsModalOpen(true);
    };

    const handleDeleteClick = (cat) => {
        setDeleteTarget(cat);
        setDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!deleteTarget) return;
        setLoading(true);
        try {
            await DeleteCategory(deleteTarget.id);
            toast.success(`Category deleted successfully!`);
            fetchCategories(currentPage);
        } catch (err) {
            console.error("Delete error:", err);
            // toast.error(err?.message || 'Failed to delete category');
        } finally {
            setLoading(false);
            setDeleteModalOpen(false);
            setDeleteTarget(null);
        }
    };

    const isAllSelected = selectedRows.size === categories.length;
    const isIndeterminate = selectedRows.size > 0 && selectedRows.size < categories.length;

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
                onSearch={(query) => {
                    setSearchQuery(query);
                }}
                showProfile={false}
            />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-6 2xl:-mt-0">
                <div className="flex items-center justify-between">
                    <p className="text-[#1A202C] text-lg md:text-2xl font-bold">Categories</p>
                    <button
                        className="py-2 px-3 md:py-2 md:px-6 rounded-lg text-white bg-[#152A45] text-sm md:text-base"
                        onClick={() => setIsModalOpen(true)}
                    >
                        Add Trade & Skills
                    </button>
                </div>

                <div className="overflow-x-auto rounded-lg py-4">
                    <table className="w-full">
                        <thead className="bg-[#F6F6F7]">
                            <tr>
                                <th className="w-12 px-4 py-3 text-left">
                                    <input
                                        type="checkbox"
                                        checked={isAllSelected}
                                        ref={input => { if (input) input.indeterminate = isIndeterminate; }}
                                        onChange={(e) => handleSelectAll(e.target.checked)}
                                        className="w-4 h-4 border-2 border-blue-500 rounded accent-[#152A45]"
                                    />
                                </th>
                                <th className="px-4 py-3 text-left text-base font-medium text-[#718096]">Trade (Category)</th>
                                <th className="px-4 py-3 text-left text-base font-medium text-[#718096]">Skill Count</th>
                                <th className="px-4 py-3 text-left text-base font-medium text-[#718096]">Skills</th>
                                <th className="px-4 py-3 text-right text-base font-medium text-[#718096]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                Array.from({ length: 4 }).map((_, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50">
                                        <td className="px-4 py-3"><div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div></td>
                                        <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div></td>
                                        <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div></td>
                                        <td className="px-4 py-3">
                                            <div className="flex flex-wrap gap-1">
                                                {Array.from({ length: 3 }).map((_, i) => (
                                                    <div key={i} className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex gap-2 justify-end">
                                                <div className="h-5 w-5 bg-gray-200 rounded-full animate-pulse"></div>
                                                <div className="h-5 w-5 bg-gray-200 rounded-full animate-pulse"></div>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : categories.length === 0 ? (
                                <tr className="">
                                    <td colSpan={8}>
                                        <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                                            <FiInbox className="w-16 h-16 opacity-50 mb-2" />
                                            <span className="text-sm">No records found</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                categories.map(cat => (
                                    <tr key={cat.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3">
                                            <input
                                                type="checkbox"
                                                checked={selectedRows.has(cat.id)}
                                                onChange={(e) => handleSelectRow(cat.id, e.target.checked)}
                                                className="w-4 h-4 border-2 border-blue-500 rounded accent-[#152A45]"
                                            />
                                        </td>
                                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{cat.trade}</td>
                                        <td className="px-4 py-3 text-sm text-gray-700">{cat.skills_count}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex flex-wrap gap-1 min-w-[500px]">
                                                {cat.skills ? cat.skills.split(',').map((skill, i) => (
                                                    <span key={i} className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium bg-[#F0F0F1] text-[#718096]">
                                                        {skill.trim()}
                                                    </span>
                                                )) : 'No skills'}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => handleEdit(cat)} className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors cursor-pointer">
                                                    <Edit className="w-5 h-5" />
                                                </button>
                                                <button onClick={() => handleDeleteClick(cat)} className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer">
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    {categories.length > 0 && (
                        <div className="flex justify-center items-center gap-2 mt-6">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="px-4 py-2 rounded-lg cursor-pointer bg-[#ffffff] border border-[#D1D5DC] hover:bg-[#152A45] hover:text-white disabled:opacity-50 text-sm"
                            >
                                Previous
                            </button>

                            {totalPages > 3 && (
                                <>
                                    {currentPage > 2 && <span className="px-2 text-gray-500">...</span>}

                                    {Array.from({ length: 3 }, (_, i) => currentPage - 1 + i)
                                        .map(p => Math.min(Math.max(p, 1), totalPages))
                                        .filter((v, idx, arr) => arr.indexOf(v) === idx)
                                        .map(page => (
                                            <button
                                                key={page}
                                                onClick={() => handlePageChange(page)}
                                                className={`px-4 py-2 rounded-lg text-sm cursor-pointer ${currentPage === page ? 'bg-[#152A45] text-white' : 'bg-white text-[#718096] border border-[#D1D5DC]'} hover:bg-[#152A45] hover:text-white`}
                                            >
                                                {page}
                                            </button>
                                        ))
                                    }

                                    {currentPage < totalPages - 1 && <span className="px-2 text-gray-500">...</span>}
                                </>
                            )}

                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 rounded-lg cursor-pointer bg-[#ffffff] border border-[#D1D5DC] hover:bg-[#152A45] hover:text-white disabled:opacity-50 text-sm"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <TradeSkillsModal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setEditData(null); }}
                onSubmit={(data) => {
                    console.log(editData ? "Updated Trade:" : "New Trade Added:", data);
                    setIsModalOpen(false);
                    setEditData(null);
                    fetchCategories(currentPage);
                }}
                initialData={editData}
            />

            <DeleteConfirmModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                loading={loading}
                title="Delete Category"
                message={deleteTarget ? `Are you sure you want to delete "${deleteTarget.name}"?` : "Are you sure?"}
                confirmText="Delete"
                cancelText="Cancel"
            />
        </div>
    );
};

export default Categories;
