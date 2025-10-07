import React, { useState } from 'react'
import Navbar from '../../Components/Jobs/Navbar'
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
import { Edit, FileText, Trash2 } from 'lucide-react'
import FileCsv from '../../assets/icons/File_CSV'
import CheckIcon from '../../assets/icons/Check'
import CrossIcon from '../../assets/icons/Cross'

const CSCSverification = () => {
    const [selectedRows, setSelectedRows] = useState(new Set())
    const [currentPage, setCurrentPage] = useState(1)

    const tableData = [
        { id: 1, name: "John Doe", email: "test122@gmail.com", uploadDate: "12 Sep, 2025", status: "Pending" },
        { id: 2, name: "Courtney Henry", email: "test122@gmail.com", uploadDate: "12 Sep, 2025", status: "Verified" },
        { id: 3, name: "Esther Howard", email: "test122@gmail.com", uploadDate: "12 Sep, 2025", status: "Rejected" },
        { id: 4, name: "Leslie Alexander", email: "test122@gmail.com", uploadDate: "12 Sep, 2025", status: "Pending" },
        { id: 5, name: "Darlene Robertson", email: "test122@gmail.com", uploadDate: "12 Sep, 2025", status: "Verified" },
        { id: 6, name: "Guy Hawkins", email: "test122@gmail.com", uploadDate: "12 Sep, 2025", status: "Rejected" },
        { id: 7, name: "Jane Cooper", email: "test122@gmail.com", uploadDate: "12 Sep, 2025", status: "Pending" },
        { id: 8, name: "Robert Fox", email: "test122@gmail.com", uploadDate: "12 Sep, 2025", status: "Verified" },
        { id: 9, name: "Ralph Edwards", email: "test122@gmail.com", uploadDate: "12 Sep, 2025", status: "Rejected" },
        { id: 10, name: "Floyd Miles", email: "test122@gmail.com", uploadDate: "12 Sep, 2025", status: "Pending" },
        { id: 11, name: "Floyd Miles", email: "test122@gmail.com", uploadDate: "12 Sep, 2025", status: "Pending" },
    ]

    const rowsPerPage = 10
    const totalPages = Math.ceil(tableData.length / rowsPerPage)

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page)
        }
    }

    const paginatedData = tableData.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    )

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedRows(new Set(paginatedData.map(item => item.id)))
        } else {
            setSelectedRows(new Set())
        }
    }

    const handleSelectRow = (id) => {
        const newSelected = new Set(selectedRows)
        if (newSelected.has(id)) {
            newSelected.delete(id)
        } else {
            newSelected.add(id)
        }
        setSelectedRows(newSelected)
    }

    const getStatusBadge = (status) => {
        const statusStyles = {
            Pending: "bg-orange-100 text-orange-600 border border-orange-200",
            Verified: "bg-green-100 text-green-600 border border-green-200",
            Rejected: "bg-red-100 text-red-600 border border-red-200"
        }

        return (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusStyles[status]}`}>
                {status}
            </span>
        )
    }

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
            />
            <div className="container mx-auto">
                <main className="w-full mx-auto px-4 sm:px-6 lg:px-8 ">
                    <div className='container mx-auto flex items-center justify-between'>
                        <p className='text-[#1A202C] text-lg md:text-2xl font-bold'>
                            Tradeperson CSCS verifications
                        </p>
                    </div>

                    <div className="overflow-x-auto rounded-lg  py-4">
                        <table className="min-w-full text-sm">
                            <thead className="bg-[#F6F6F7] rounded-[7px]">
                                <tr>
                                    <th className="px-4 py-3 text-left">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                            onChange={handleSelectAll}
                                            checked={selectedRows.size === paginatedData.length}
                                        />
                                    </th>
                                    <th className="px-4 py-3 text-left font-semibold text-[#718096] text-[16px]">User Name</th>
                                    <th className="px-4 py-3 text-left font-semibold text-[#718096] text-[16px]">Email</th>
                                    <th className="px-4 py-3 text-left font-semibold text-[#718096] text-[16px]">Uploaded File</th>
                                    <th className="px-4 py-3 text-left font-semibold text-[#718096] text-[16px]">Uploaded Date</th>
                                    <th className="px-4 py-3 text-left font-semibold text-[#718096] text-[16px]">Status</th>
                                    <th className="px-4 py-3 text-left font-semibold text-[#718096] text-[16px]">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-transparent">
                                {paginatedData.map((item) => (
                                    <tr key={item.id} className="border-b border-dashed border-[#D8DDE6] bg-transparent">
                                        <td className="px-4 py-3">
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                checked={selectedRows.has(item.id)}
                                                onChange={() => handleSelectRow(item.id)}
                                            />
                                        </td>
                                        <td className="px-4 py-3 font-medium text-sm leading-6 text-[#1A202C]">{item.name}</td>
                                        <td className="px-4 py-3 font-medium text-sm leading-6 text-[#1A202C]">{item.email}</td>
                                        <td className="px-4 py-3"><FileCsv className="h-5 w-5 text-black cursor-pointer" /></td>
                                        <td className="px-4 py-3 font-medium text-sm leading-6 text-[#1A202C]">{item.uploadDate}</td>
                                        <td className="px-4 py-3">{getStatusBadge(item.status)}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <button
                                                    className="p-1.5 rounded hover:bg-green-50 text-green-600 cursor-pointer transition-colors"
                                                    title="Approve"
                                                >
                                                    <CheckIcon className="h-5 w-5" />
                                                </button>
                                                <button
                                                    className="p-1.5 rounded hover:bg-red-50 text-red-600 cursor-pointer transition-colors"
                                                    title="Reject"
                                                >
                                                    <CrossIcon className="h-5 w-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleEdit(item)}
                                                    className="p-1.5 rounded text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                                                    title="Edit"
                                                >
                                                    <Edit className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(item)}
                                                    className="p-1.5 rounded hover:bg-red-50 text-red-500 cursor-pointer transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>

                                        {/* 9313023071 */}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

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
                                className={`px-4 py-2 cursor-pointer rounded-lg  text-sm ${currentPage === page ? 'bg-[#152A45] text-white' : 'bg-[#FFFFFF] text-[#718096] border border-[#D1D5DC]'} hover:bg-[#152A45] hover:text-white`}
                            >
                                {page}
                            </button>
                        ))}
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-4 cursor-pointer py-2 rounded-lg bg-[#ffffff] border border-[#D1D5DC] text-Black hover:bg-[#152A45] hover:text-white disabled:opacity-50  text-sm"
                        >
                            Next
                        </button>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default CSCSverification
// +91 70695 93732
// +91 74052 53839