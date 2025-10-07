import React, { useState, useEffect } from 'react'
import Navbar from '../../Components/Jobs/Navbar'
import icon3 from '../../assets/Jobs/icon3.svg'
import icon5 from '../../assets/Jobs/icon5.svg'
import usericon from '../../assets/Jobs/users.svg'
import icon4 from '../../assets/Jobs/icon4.svg'
import selectedIcon3 from '../../assets/Jobs/selectedIcon3.svg'
import selectedIcon4 from '../../assets/Jobs/selectedIcon4.svg'
import selectedIcon6 from '../../assets/Jobs/selectedIcon6.svg'
import categoryicon from '../../assets/Jobs/category.svg'
import EditTradepersonModal from '../../Components/EditTradePersonModel'
import { FileText as FileCsv, Check, X, Edit, Trash2, AlertCircle } from 'lucide-react'
import { gettradeperson, deletetradeperson, UpdateTradePersonStatus, UpdateCscsVerificationStatus } from '../../services/adminService'
import { toast } from 'react-toastify'
import DeleteConfirmModal from '../../Components/DeleteConfirmModal'
import { FaTimes } from 'react-icons/fa'
import { FiInbox } from 'react-icons/fi'
import Skeleton from 'react-loading-skeleton'
import "react-loading-skeleton/dist/skeleton.css"
import { BsPersonCircle } from "react-icons/bs";

const ManageTradeperson = () => {
  const [selectedRows, setSelectedRows] = useState(new Set())
  const [currentPage, setCurrentPage] = useState(1)
  const [tradepersons, setTradepersons] = useState([])
  const [loading, setLoading] = useState(true)
  const [abuseModalOpen, setAbuseModalOpen] = useState(false)
  const [selectedAbuseReports, setSelectedAbuseReports] = useState([])
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [totalPages, setTotalPages] = useState(1)
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchTradepersons(currentPage)
  }, [])

  useEffect(() => {
    fetchTradepersons(currentPage, searchTerm.trim());
  }, [searchTerm]);

  const handleSuspendUser = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === "Active" ? 0 : 1
      const res = await UpdateTradePersonStatus(id, newStatus)

      if (res.success) {
        setTradepersons(prev =>
          prev.map(user =>
            user.id === id
              ? { ...user, is_active: newStatus === 1 ? "Active" : "Inactive" }
              : user
          )
        )
        toast.success(`User ${newStatus === 1 ? "activated" : "suspended"} successfully.`)
      } else {
        toast.error(res.message || "Failed to update status.")
      }
    } catch (error) {
      console.error("Error updating status:", error)
      toast.error("Error updating status. Please try again.")
    }
  }

  const fetchTradepersons = async (page = 1, search = "") => {
    try {
      setLoading(true);
      const res = await gettradeperson(page, search);
      if (res.success) {
        const mapped = res.data.map(user => ({
          id: user.id,
          name: user.name,
          email: user.email,
          profile: user.profile_pictures,
          cscsFile: user.cscs_file,
          status: user.is_cscsfile_verified,
          uploadDate: new Date(user.created_at).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric"
          }),
          abuseCount: user.abuse_count || 0,
          abuseReports: user.abuse_reports || [],
          is_active: user.is_active === 1 ? "Active" : "Inactive"
        }));
        setTradepersons(mapped);
        setTotalPages(res.pagination?.pages || 1);
      }
    } catch (error) {
      console.error("Error fetching tradepersons:", error);
      toast.error("Failed to load tradepersons");
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = async () => {
    try {
      const response = await gettradeperson("all")
      if (!response.success || !response.data) {
        toast.error("No data available for export.")
        return
      }

      const rows = response.data.map(user => ({
        ID: user.id,
        Name: user.name,
        Email: user.email,
        Status: user.is_cscsfile_verified,
        UploadDate: new Date(user.created_at).toLocaleDateString("en-GB"),
        UserStatus: user.is_active === 1 ? "Active" : "Inactive",
        AbuseReports: user.abuse_count || 0,
      }))

      const header = Object.keys(rows[0]).join(",") + "\n"
      const csvData = rows.map(row => Object.values(row).map(val => `"${val || ""}"`).join(",")).join("\n")
      const blob = new Blob([header + csvData], { type: "text/csv;charset=utf-8;" })

      const link = document.createElement("a")
      link.href = URL.createObjectURL(blob)
      link.download = "tradepersons.csv"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error(error)
      toast.error("Failed to export CSV.")
    }
  }

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return
    setCurrentPage(page)
    fetchTradepersons(page)
  }

  const paginatedData = tradepersons

  const handleVerificationUpdate = async (id, status) => {
    try {
      const res = await UpdateCscsVerificationStatus(id, status)
      if (res.success) {
        setTradepersons(prev =>
          prev.map(user =>
            user.id === id
              ? { ...user, status: status ? "Verified" : "Rejected" }
              : user
          )
        )
        toast.success(`User CSCS file ${status ? "verified" : "rejected"} successfully.`)
      } else {
        toast.error(res.message || "Failed to update verification status.")
      }
    } catch (error) {
      console.error("Error updating verification:", error)
      toast.error("Error updating verification status. Please try again.")
    }
  }

  const handleEdit = (item) => {
    if (!item) return
    setEditTarget(item)
    setEditModalOpen(true)
  }

  const handleEditSave = async (updatedData) => {
    try {
      setTradepersons(prev =>
        prev.map(user =>
          user.id === updatedData.id
            ? { ...user, name: updatedData.name, email: updatedData.email, profile: updatedData.profile_pictures }
            : user
        )
      )
      setEditModalOpen(false)
      setEditTarget(null)
      fetchTradepersons(currentPage)
    } catch (error) {
      console.error("Error updating tradeperson:", error)
      toast.error("Failed to update tradeperson. Please try again.")
    }
  }

  const handleDeleteClick = (item) => {
    setDeleteTarget(item)
    setDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return
    try {
      await deletetradeperson(deleteTarget.id)
      toast.success("Tradeperson deleted successfully.")
      fetchTradepersons(currentPage)
    } catch (error) {
      console.error("Error deleting tradeperson:", error)
      toast.error("Failed to delete tradeperson. Please try again.")
    } finally {
      setDeleteModalOpen(false)
      setDeleteTarget(null)
    }
  }

  const getStatusBadge = (status) => {
    const statusStyles = {
      Pending: "bg-orange-100 text-orange-600 border border-orange-200",
      Verified: "bg-green-100 text-green-600 border border-green-200",
      Rejected: "bg-red-100 text-red-600 border border-red-200"
    }
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusStyles[status] || "bg-gray-100 text-gray-600 border border-gray-200"}`}>
        {status}
      </span>
    )
  }

  const getBase64Image = (imageUrl) => {
    if (!imageUrl) return null
    if (imageUrl.startsWith('data:image')) return imageUrl
    return imageUrl
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
        onSearch={(value) => {
          setSearchTerm(value);
        }}
      />

      <div className="container mx-auto">
        <main className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4">
            <p className="text-[#1A202C] text-lg sm:text-2xl font-bold">
              Manage Tradeperson
            </p>

            <button
              onClick={exportCSV}
              className="py-1.5 px-4 sm:py-2 sm:px-6 rounded-lg cursor-pointer text-sm sm:text-base text-white bg-[#152A45] hover:bg-[#1E3A5F] self-start sm:self-auto"
            >
              Export (CSV)
            </button>
          </div>

          {/* Desktop Table View */}
       {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto rounded-lg py-4">
            <table className="min-w-full text-sm">
              <thead className="bg-[#F6F6F7] rounded-[7px]">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-[#718096] text-[16px]">User</th>
                  <th className="px-4 py-3 text-left font-semibold text-[#718096] text-[16px]">Email</th>
                  <th className="px-4 py-3 text-left font-semibold text-[#718096] text-[16px]">CSCS File</th>
                  <th className="px-4 py-3 text-left font-semibold text-[#718096] text-[16px]">Uploaded Date</th>
                  <th className="px-4 py-3 text-left font-semibold text-[#718096] text-[16px]">Verification Status</th>
                  <th className="px-4 py-3 text-left font-semibold text-[#718096] text-[16px]">User Status</th>
                  <th className="px-4 py-3 text-left font-semibold text-[#718096] text-[16px]">Abuse Reports</th>
                  <th className="px-4 py-3 text-left font-semibold text-[#718096] text-[16px]">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-transparent">
                {loading ? (
                  Array.from({ length: 4 }).map((_, idx) => (
                    <tr key={idx} className="border-b border-dashed border-[#D8DDE6] bg-transparent">
                      <td className="px-4 py-3"><Skeleton /></td>
                      <td className="px-4 py-3"><Skeleton /></td>
                      <td className="px-4 py-3"><Skeleton /></td>
                      <td className="px-4 py-3"><Skeleton /></td>
                      <td className="px-4 py-3"><Skeleton /></td>
                      <td className="px-4 py-3"><Skeleton /></td>
                      <td className="px-4 py-3"><Skeleton /></td>
                      <td className="px-4 py-3"><Skeleton /></td>
                    </tr>
                  ))
                ) : tradepersons.length === 0 ? (
                  <tr className="">
                    <td colSpan={8}>
                      <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                        <FiInbox className="w-16 h-16 opacity-50 mb-2" />
                        <span className="text-sm">No records found</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((item) => (
                    <tr key={item.id} className="border-b border-dashed border-[#D8DDE6] bg-transparent">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {item.profile ? (
                            <img
                              src={getBase64Image(item.profile)}
                              alt={item.name}
                              className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white flex-shrink-0">
                              <BsPersonCircle className="w-8 h-8" />
                            </div>
                          )}
                          <span className="font-medium text-sm leading-6 text-[#1A202C]">{item.name || '-'}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium text-sm leading-6 text-[#1A202C] lowercase">{item.email}</td>
                      <td className="px-4 py-3">
                        {item.cscsFile ? (
                          <a href={item.cscsFile} target="_blank" rel="noreferrer">
                            <FileCsv className="h-5 w-5 text-blue-600 cursor-pointer" />
                          </a>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 font-medium text-sm leading-6 text-[#1A202C]">{item.uploadDate}</td>
                      <td className="px-4 py-3">{getStatusBadge(item.status)}</td>
                      <td className="px-4 py-2 font-medium text-sm leading-6 text-[#1A202C] text-center">
                        <span className={`block px-4 py-1.5 w-[110px] text-[14px] font-semibold rounded-full mx-auto ${item.is_active === "Active"
                          ? "bg-[#E6F9E9] text-[#2C9D41]"
                          : "bg-[#FFE6E6] text-[#D32F2F]"
                          }`}>
                          {item.is_active}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {item.abuseCount > 0 ? (
                          <button
                            onClick={() => {
                              setSelectedAbuseReports(item.abuseReports)
                              setAbuseModalOpen(true)
                            }}
                            className="flex items-center justify-center gap-1 cursor-pointer mx-auto px-3 py-1 bg-[#FFF4E6] text-[#FF9800] rounded-full hover:bg-[#FFE0B2] transition-colors"
                          >
                            <AlertCircle size={16} />
                            <span className="font-semibold">{item.abuseCount}</span>
                          </button>
                        ) : (
                          <span className="text-[#718096]">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleSuspendUser(item.id, item.is_active)}
                            className={`px-3 py-1.5 text-[13px] font-semibold rounded-[6px] cursor-pointer transition-colors ${item.is_active === "Active"
                              ? "bg-red-200 text-red-800 hover:bg-red-300 w-[80px]"
                              : "bg-green-200 text-green-800 hover:bg-green-300 w-[80px]"
                              }`}
                          >
                            {item.is_active === "Active" ? "Suspend" : "Activate"}
                          </button>

                          <button
                            onClick={() => handleVerificationUpdate(item.id, true)}
                            className="p-1.5 rounded hover:bg-green-50 text-green-600 cursor-pointer transition-colors"
                            title="Approve"
                          >
                            <Check className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleVerificationUpdate(item.id, false)}
                            className="p-1.5 rounded hover:bg-red-50 text-red-600 cursor-pointer transition-colors"
                            title="Reject"
                          >
                            <X className="h-5 w-5" />
                          </button>

                          <button
                            onClick={() => handleEdit(item)}
                            className="p-1.5 rounded text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
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
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden py-4 space-y-4">
            {loading ? (
              Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="border border-[#D8DDE6] rounded-lg p-4 bg-white">
                  <Skeleton height={60} />
                  <Skeleton height={20} className="mt-2" count={3} />
                </div>
              ))
            ) : tradepersons.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                <FiInbox className="w-16 h-16 opacity-50 mb-2" />
                <span className="text-sm">No records found</span>
              </div>
            ) : (
              paginatedData.map((item) => (
                <div key={item.id} className="border border-[#D8DDE6] rounded-lg p-4 bg-white shadow-sm">
                  <div className="flex items-start gap-3 mb-3">
                    {item.profile ? (
                      <img
                        src={getBase64Image(item.profile)}
                        alt={item.name}
                        className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-white flex-shrink-0">
                        <BsPersonCircle className="w-12 h-12" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-[#1A202C] text-base truncate">{item.name || '-'}</h3>
                      <p className="text-sm text-[#718096] truncate">{item.email}</p>
                    </div>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full flex-shrink-0 ${item.is_active === "Active"
                      ? "bg-[#E6F9E9] text-[#2C9D41]"
                      : "bg-[#FFE6E6] text-[#D32F2F]"
                      }`}>
                      {item.is_active}
                    </span>
                  </div>

                  <div className="space-y-2 mb-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#718096]">CSCS File:</span>
                      {item.cscsFile ? (
                        <a href={item.cscsFile} target="_blank" rel="noreferrer">
                          <FileCsv className="h-5 w-5 text-blue-600 cursor-pointer" />
                        </a>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#718096]">Uploaded Date:</span>
                      <span className="text-[#1A202C] font-medium">{item.uploadDate}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#718096]">Verification:</span>
                      {getStatusBadge(item.status)}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#718096]">Abuse Reports:</span>
                      {item.abuseCount > 0 ? (
                        <button
                          onClick={() => {
                            setSelectedAbuseReports(item.abuseReports)
                            setAbuseModalOpen(true)
                          }}
                          className="flex items-center gap-1 cursor-pointer px-3 py-1 bg-[#FFF4E6] text-[#FF9800] rounded-full hover:bg-[#FFE0B2] transition-colors"
                        >
                          <AlertCircle size={14} />
                          <span className="font-semibold text-xs">{item.abuseCount}</span>
                        </button>
                      ) : (
                        <span className="text-[#718096]">-</span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-[#E2E8F0]">
                    <button
                      onClick={() => handleSuspendUser(item.id, item.is_active)}
                      className={`flex-1 min-w-[100px] px-3 py-1.5 text-xs font-semibold rounded-[6px] cursor-pointer transition-colors ${item.is_active === "Active"
                        ? "bg-red-200 text-red-800 hover:bg-red-300"
                        : "bg-green-200 text-green-800 hover:bg-green-300"
                        }`}
                    >
                      {item.is_active === "Active" ? "Suspend" : "Activate"}
                    </button>

                    <button
                      onClick={() => handleVerificationUpdate(item.id, true)}
                      className="p-2 rounded hover:bg-green-50 text-green-600 cursor-pointer transition-colors border border-green-200"
                      title="Approve"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleVerificationUpdate(item.id, false)}
                      className="p-2 rounded hover:bg-red-50 text-red-600 cursor-pointer transition-colors border border-red-200"
                      title="Reject"
                    >
                      <X className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => handleEdit(item)}
                      className="p-2 rounded text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer border border-gray-200"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(item)}
                      className="p-2 rounded hover:bg-red-50 text-red-500 cursor-pointer transition-colors border border-red-200"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Mobile Card View */}
          {/* <div className="lg:hidden py-4 space-y-4">
            {loading ? (
              Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="border border-[#D8DDE6] rounded-lg p-4 bg-white">
                  <Skeleton height={60} />
                  <Skeleton height={20} className="mt-2" count={3} />
                </div>
              ))
            ) : tradepersons.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                <FiInbox className="w-16 h-16 opacity-50 mb-2" />
                <span className="text-sm">No records found</span>
              </div>
            ) : (
              paginatedData.map((item) => (
                <div key={item.id} className="border border-[#D8DDE6] rounded-lg p-4 bg-white shadow-sm">
                  <div className="flex items-start gap-3 mb-3">
                    {item.profile ? (
                      <img
                        src={getBase64Image(item.profile)}
                        alt={item.name}
                        className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-white flex-shrink-0">
                        <BsPersonCircle className="w-12 h-12" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-[#1A202C] text-base truncate">{item.name || '-'}</h3>
                      <p className="text-sm text-[#718096] truncate">{item.email}</p>
                    </div>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full flex-shrink-0 ${item.is_active === "Active"
                      ? "bg-[#E6F9E9] text-[#2C9D41]"
                      : "bg-[#FFE6E6] text-[#D32F2F]"
                      }`}>
                      {item.is_active}
                    </span>
                  </div>

                  <div className="space-y-2 mb-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#718096]">CSCS File:</span>
                      {item.cscsFile ? (
                        <a href={item.cscsFile} target="_blank" rel="noreferrer">
                          <FileCsv className="h-5 w-5 text-blue-600 cursor-pointer" />
                        </a>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#718096]">Uploaded Date:</span>
                      <span className="text-[#1A202C] font-medium">{item.uploadDate}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#718096]">Verification:</span>
                      {getStatusBadge(item.status)}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#718096]">Abuse Reports:</span>
                      {item.abuseCount > 0 ? (
                        <button
                          onClick={() => {
                            setSelectedAbuseReports(item.abuseReports)
                            setAbuseModalOpen(true)
                          }}
                          className="flex items-center gap-1 cursor-pointer px-3 py-1 bg-[#FFF4E6] text-[#FF9800] rounded-full hover:bg-[#FFE0B2] transition-colors"
                        >
                          <AlertCircle size={14} />
                          <span className="font-semibold text-xs">{item.abuseCount}</span>
                        </button>
                      ) : (
                        <span className="text-[#718096]">-</span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-[#E2E8F0]">
                    <button
                      onClick={() => handleSuspendUser(item.id, item.is_active)}
                      className={`flex-1 min-w-[100px] px-3 py-1.5 text-xs font-semibold rounded-[6px] cursor-pointer transition-colors ${item.is_active === "Active"
                        ? "bg-red-200 text-red-800 hover:bg-red-300"
                        : "bg-green-200 text-green-800 hover:bg-green-300"
                        }`}
                    >
                      {item.is_active === "Active" ? "Suspend" : "Activate"}
                    </button>

                    <button
                      onClick={() => handleVerificationUpdate(item.id, true)}
                      className="p-2 rounded hover:bg-green-50 text-green-600 cursor-pointer transition-colors border border-green-200"
                      title="Approve"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleVerificationUpdate(item.id, false)}
                      className="p-2 rounded hover:bg-red-50 text-red-600 cursor-pointer transition-colors border border-red-200"
                      title="Reject"
                    >
                      <X className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => handleEdit(item)}
                      className="p-2 rounded text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer border border-gray-200"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(item)}
                      className="p-2 rounded hover:bg-red-50 text-red-500 cursor-pointer transition-colors border border-red-200"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div> */}

          {!loading && tradepersons.length > 0 && (
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

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Tradeperson"
        message={deleteTarget ? `Are you sure you want to delete "${deleteTarget.name}"?` : "Are you sure?"}
        confirmText="Delete"
        cancelText="Cancel"
      />

      <EditTradepersonModal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false)
          setEditTarget(null)
        }}
        tradeperson={editTarget || {}}
        onSave={handleEditSave}
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
                          src={getBase64Image(report.reporter_profile_pictures) || 'https://via.placeholder.com/50'}
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
  )
}

export default ManageTradeperson