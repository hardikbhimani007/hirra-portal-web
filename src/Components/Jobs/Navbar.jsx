"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CiUser } from "react-icons/ci";

import Logo from "../../assets/Logo.svg";
import ProfileImg from "../../assets/Jobs/User1.webp";
import SearchIcon from "../../assets/Jobs/Search.svg";

import { RxPerson } from "react-icons/rx";
import { HiOutlineLogout } from "react-icons/hi";
import { FaUserCircle } from "react-icons/fa";
import { fetchUserById } from "../../services/userService";

export default function Navbar({ navItems, showProfile = true, showSearch = true, userRole, onSearch }) {
    const location = useLocation();
    const navigate = useNavigate();
    const [profilePicture, setProfilePicture] = useState();

    const [active, setActive] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const [userData, setUserData] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [username, setUsername] = useState("");
    const [usertype, setUserType] = useState("");
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const profileRef = useRef(null);

    useEffect(() => {
        if (!onSearch) return;

        const timeout = setTimeout(() => {
            onSearch(searchQuery);
        }, 300);

        return () => clearTimeout(timeout);
    }, [searchQuery, onSearch]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));

            const getUser = async () => {
                try {
                    // Load cached data first
                    const cachedPic = localStorage.getItem("profilepictures");
                    const cachedName = localStorage.getItem("username");
                    const cachedType = localStorage.getItem("usertype");

                    if (cachedPic) setProfilePicture(cachedPic);
                    if (cachedName) setUsername(cachedName);
                    if (cachedType) setUserType(cachedType);

                    // Fetch fresh data
                    const res = await fetchUserById(payload.id);
                    if (res.data) {
                        const { profile_pictures, name, user_type } = res.data;

                        if (profile_pictures && profile_pictures !== cachedPic) {
                            setProfilePicture(profile_pictures);
                            localStorage.setItem("profilepictures", profile_pictures);
                        }

                        if (name && name !== cachedName) {
                            setUsername(name);
                            localStorage.setItem("username", name);
                        }

                        if (user_type && user_type !== cachedType) {
                            setUserType(user_type);
                            localStorage.setItem("usertype", user_type);
                        }
                    }
                } catch (err) {
                    console.error("Error fetching user:", err);
                }
            };

            getUser();
        } catch (err) {
            console.error("Failed to decode token:", err);
            localStorage.removeItem("token");
        }
    }, []);

    useEffect(() => {
        const current = navItems.find((item) => item.path === location.pathname);
        setActive(current?.name || location.pathname.replace("/", "") || "");
    }, [location, navItems]);

    useEffect(() => {
        const handler = (e) => {
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setProfileMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const handleSearchChange = useCallback((e) => {
        setSearchQuery(e.target.value);
    }, []);

    const handleLogoutClick = () => {
        setProfileMenuOpen(false);
        setShowLogoutModal(true);
    };

    const handleLogoutConfirm = () => {
        localStorage.clear();
        setShowLogoutModal(false);
        navigate("/");
    };

    const handleLogoutCancel = () => {
        setShowLogoutModal(false);
    };

    return (
        <>
            <header
                className="fixed top-0 left-0 w-full z-40 pt-4 pb-2 2xl:py-6 transition-all duration-300 bg-white"
                style={{ boxShadow: "rgba(0, 0, 0, 0.04) 0px 3px 5px" }}
            >
                <div className="container mx-auto px-4 md:px-8 flex justify-between items-center relative">
                    <div className="flex items-center space-x-4 min-[1280px]:space-x-10">
                        <a href="/">
                            <img src={Logo} alt="Logo" className="h-6 cursor-pointer xl:h-9" loading="lazy" />
                        </a>

                        <nav className="hidden 2xl:flex text-base space-x-3 xl:space-x-4">
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    className={`flex items-center space-x-2 cursor-pointer font-semibold transition-all duration-200 px-2 py-0 group ${active === item.name ? "text-[#1773E2]" : "text-[#1A202C]"
                                        }`}
                                >
                                    <img
                                        src={active === item.name ? item.iconActive : item.icon}
                                        alt={`${item.name} icon`}
                                        className="h-5 w-5 group-hover:hidden"
                                    />
                                    <img
                                        src={item.iconActive}
                                        alt={`${item.name} hover icon`}
                                        className="h-5 w-5 hidden group-hover:inline"
                                    />
                                    <span className="group-hover:text-[#1773E2]">{item.name}</span>
                                </Link>
                            ))}
                        </nav>
                    </div>
                    <div className="flex items-center ml-auto space-x-4" ref={profileRef}>
                        {showSearch && (
                            <div className="hidden 2xl:block">
                                <div className="relative">
                                    <img src={SearchIcon} alt="Search" className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 md:h-5 md:w-5" />
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        className="h-10 w-60 md:h-12 md:w-64 pl-12 pr-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1773E2]"
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                    />
                                </div>
                            </div>
                        )}
                        {!showSearch && (
                            <div className="hidden sm:flex flex-col justify-center me-3 text-right">
                                <span className="text-sm font-semibold text-gray-700">{username || "Unknown"}</span>
                                <span className="text-xs text-gray-500">{usertype || "Unknown"}</span>
                            </div>
                        )}
                        <div className="relative">
                            {profilePicture && profilePicture !== "" && profilePicture !== "null" && profilePicture !== "undefined" ? (
                                <img
                                    src={profilePicture}
                                    alt="Profile"
                                    className="h-10 w-10 xl:h-12 xl:w-12 rounded-full object-cover cursor-pointer me-3"
                                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                                />
                            ) : (
                                <FaUserCircle
                                    className="h-10 w-10 xl:h-12 xl:w-12 text-gray-400 cursor-pointer me-3"
                                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                                />
                            )}
                            {profileMenuOpen && (
                                <div className="absolute right-0 mt-2 w-44 bg-white rounded-md shadow-lg border border-gray-200">
                                    {showProfile && (
                                        <Link
                                            to={userRole === "subcontractor" ? "/subcontractor/profile" : "/profile"}
                                            className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100"
                                            onClick={() => setProfileMenuOpen(false)}
                                        >
                                            <RxPerson className="h-5 w-5 text-gray-500" />
                                            <span>View Profile</span>
                                        </Link>
                                    )}
                                    <button
                                        className="flex items-center space-x-2 w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                                        onClick={handleLogoutClick}
                                    >
                                        <HiOutlineLogout className="h-5 w-5 text-gray-500" />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="2xl:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-2xl text-gray-800 focus:outline-none"
                            aria-label="Menu"
                        >
                            {isOpen ? <HiX /> : <HiMenu />}
                        </button>
                    </div> 
                </div>

                {isOpen && (
                    <div className="2xl:hidden bg-white w-full shadow-md mt-2">
                        <nav className="flex flex-col space-y-2 px-4 py-4">
                            {showSearch && (
                                <div className="mt-2">
                                    <div className="relative">
                                        <img src={SearchIcon} alt="Search" className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 md:h-5 md:w-5" />
                                        <input
                                            type="text"
                                            placeholder="Search..."
                                            className="h-10 w-60 md:h-12 md:w-64 pl-12 pr-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1773E2]"
                                            value={searchQuery}
                                            onChange={handleSearchChange}
                                        />
                                    </div>
                                </div>
                            )}
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    className={`flex items-center space-x-2 font-semibold py-2 px-2 transition-colors duration-200 ${active === item.name ? "text-[#152A45]" : "text-[#718096]"
                                        } hover:text-[#152A45]`}
                                    onClick={() => setIsOpen(false)}
                                >
                                    {item.icon && (
                                        <img src={item.icon} alt={`${item.name} icon`} className="h-5 w-5" />
                                    )}
                                    <span>{item.name}</span>
                                </Link>
                            ))}
                        </nav>
                    </div>
                )}
            </header>
            <div className="mb-28 md:mb-30"></div>

            {/* Logout Confirmation Modal */}
            {showLogoutModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40  bg-opacity-50  transition-opacity duration-300">
                    <div className="bg-white rounded-2xl shadow-2xl w-11/12 max-w-md mx-4 transform transition-all duration-300 scale-100 animate-fadeIn">
                        <div className="p-6">
                            <div className="flex items-center justify-center w-16 h-16 mx-auto bg-[#152A45] rounded-full mb-4">
                                <HiOutlineLogout className="w-8 h-8 text-white" />
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                                Confirm Logout
                            </h3>

                            <p className="text-gray-600 text-center mb-6">
                                Are you sure you want to log out? You will need to sign in again to access your account.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-3">
                                <button
                                    onClick={handleLogoutCancel}
                                    className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 cursor-pointer font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleLogoutConfirm}
                                    className="flex-1 px-6 py-3 bg-[#152A45] hover:bg-[#1A202C] text-white cursor-pointer font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}