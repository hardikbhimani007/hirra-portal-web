import React, { useState } from 'react';
import Navbar from '../../Components/Jobs/Navbar';
import icon3 from '../../assets/Jobs/icon3.svg';
import usericon from '../../assets/Jobs/users.svg';
import icon4 from '../../assets/Jobs/icon4.svg'
import icon5 from '../../assets/Jobs/icon5.svg'
import selectedIcon2 from '../../assets/Jobs/selectedIcon2.svg';
import selectedIcon3 from '../../assets/Jobs/selectedIcon3.svg';
import selectedIcon4 from '../../assets/Jobs/selectedIcon4.svg'
import selectedIcon5 from '../../assets/Jobs/selectedIcon5.svg'
import selectedIcon6 from '../../assets/Jobs/selectedIcon6.svg'
import filecsv from '../../assets/Jobs/file-csv.svg';
import categoryicon from '../../assets/Jobs/category.svg';

const UserManagement = () => {
    const [activeTab, setActiveTab] = useState('Tradesperson');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 11;

    const usersData = {
        Tradesperson: [
            { id: 1, name: 'John Doe', email: 'test22@gmail.com', role: 'Tradesperson', status: 'Active' },
            { id: 2, name: 'Darlene Robertson', email: 'test22@gmail.com', role: 'Tradesperson', status: 'Suspended' },
            { id: 3, name: 'Annette Black', email: 'test22@gmail.com', role: 'Tradesperson', status: 'Active' },
            { id: 4, name: 'Ralph Edwards', email: 'test22@gmail.com', role: 'Tradesperson', status: 'Suspended' },
            { id: 5, name: 'Kathryn Murphy', email: 'test22@gmail.com', role: 'Tradesperson', status: 'Active' },
            { id: 6, name: 'Floyd Miles', email: 'test22@gmail.com', role: 'Tradesperson', status: 'Suspended' },
            { id: 7, name: 'Marvin McKinney', email: 'test22@gmail.com', role: 'Tradesperson', status: 'Active' },
            { id: 8, name: 'Cody Fisher', email: 'test22@gmail.com', role: 'Tradesperson', status: 'Suspended' },
            { id: 9, name: 'Devon Lane', email: 'test22@gmail.com', role: 'Tradesperson', status: 'Active' },
            { id: 10, name: 'Cameron Williamson', email: 'test22@gmail.com', role: 'Tradesperson', status: 'Suspended' },
            { id: 11, name: 'Jane Smith', email: 'jane@example.com', role: 'Tradesperson', status: 'Active' },
            { id: 12, name: 'Mike Johnson', email: 'mike@example.com', role: 'Tradesperson', status: 'Active' },
            { id: 13, name: 'Mike Johnson', email: 'mike@example.com', role: 'Tradesperson', status: 'Active' },
            { id: 14, name: 'Mike Johnson', email: 'mike@example.com', role: 'Tradesperson', status: 'Active' },
            { id: 15, name: 'Mike Johnson', email: 'mike@example.com', role: 'Tradesperson', status: 'Active' },
            { id: 16, name: 'Mike Johnson', email: 'mike@example.com', role: 'Tradesperson', status: 'Active' },
        ],
        Subcontractor: [
            { id: 11, name: 'Jane Smith', email: 'jane@example.com', role: 'Subcontractor', status: 'Active' },
            { id: 12, name: 'Mike Johnson', email: 'mike@example.com', role: 'Subcontractor', status: 'Active' },
        ],
    };

    const handleExportCSV = () => {
        console.log('Export CSV clicked');
    };

    const handleSuspendUser = (userId) => {
        console.log('Suspend user:', userId);
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const currentUsers = usersData[activeTab] || [];
    const totalPages = Math.ceil(currentUsers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedUsers = currentUsers.slice(startIndex, startIndex + itemsPerPage);

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
                <main className="w-full mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="container mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4">
                        <p className="text-[#1A202C] text-lg sm:text-2xl font-bold">
                            Users Management
                        </p>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 w-full sm:w-auto">
                            <div className="flex w-full sm:w-auto overflow-x-auto sm:overflow-visible border-b border-gray-200 scrollbar-hidden">
                                {['Tradesperson', 'Subcontractor'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => {
                                            setActiveTab(tab);
                                            setCurrentPage(1);
                                        }}
                                        className={`flex-shrink-0 px-2 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base font-medium cursor-pointer transition-colors duration-200 ${activeTab === tab
                                            ? 'text-black border-b-2 border-black'
                                            : 'text-gray-500 hover:text-gray-700'
                                            } whitespace-nowrap`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>

                            <button
                                className="py-1.5 px-4 sm:py-2 sm:px-6 rounded-lg cursor-pointer text-sm sm:text-base text-white bg-[#152A45]"
                                onClick={handleExportCSV}
                            >
                                Export (CSV)
                            </button>
                        </div>
                    </div>


                    <div className="overflow-x-auto rounded-lg  py-4">
                        <table className="min-w-full text-sm">
                            <thead className="bg-[#F6F6F7] rounded-[7px]">
                                <tr>
                                    <th className="px-4 py-3 text-left font-semibold text-[#718096] text-[16px]">Name</th>
                                    <th className="px-4 py-3 text-left font-semibold text-[#718096] text-[16px]">Email</th>
                                    <th className="px-4 py-3 text-left font-semibold text-[#718096] text-[16px]">Role</th>
                                    <th className="px-4 py-3 text-center font-semibold text-[#718096] text-[16px]">Status</th>
                                    <th className="px-4 py-3 text-center font-semibold text-[#718096] text-[16px]">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-transparent">
                                {paginatedUsers.map((user) => (
                                    <tr
                                        key={user.id}
                                        className="border-b border-dashed border-[#D8DDE6] bg-transparent"
                                    >
                                        <td className="px-4 py-2 font-medium text-sm leading-6 text-[#1A202C]">
                                            {user.name}
                                        </td>
                                        <td className="px-4 py-2 font-medium text-sm leading-6 text-[#1A202C]">
                                            {user.email}
                                        </td>
                                        <td className="px-4 py-2 font-medium text-sm leading-6 text-[#1A202C]">
                                            {user.role}
                                        </td>
                                        <td className="px-4 py-2 font-medium text-sm leading-6 text-[#1A202C] text-center">
                                            <span
                                                className={`block px-4 py-1.5 w-[110px] text-[14px] font-semibold rounded-full mx-auto ${user.status === 'Active'
                                                    ? 'bg-[#E6F9E9] text-[#2C9D41]'
                                                    : 'bg-[#FFE6E6] text-[#D32F2F]'
                                                    }`}
                                            >
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-2 text-center">
                                            <button
                                                onClick={() => handleSuspendUser(user.id)}
                                                className={`px-4 py-2 w-[110px] text-[14px] font-semibold rounded-[6px] cursor-pointer ${user.status === 'Active'
                                                    ? 'bg-[#E53E3E] text-[#FFFFFF] hover:bg-[#D32F2F]'
                                                    : 'bg-[#F69090] text-[#FFFFFF] hover:bg-[#D32F2F]'
                                                    }`}
                                            >
                                                {user.status === 'Active' ? 'Suspend' : 'Suspended'}
                                            </button>
                                        </td>
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
    );
};

export default UserManagement;