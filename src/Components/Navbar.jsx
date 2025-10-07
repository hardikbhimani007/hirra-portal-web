"use client";
import { useState, useEffect, useRef } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Logo from "../assets/Logo.svg";
import ProfileImg from "../assets/Jobs/User1.webp";
import { fetchUserById } from "../services/userService";
import { FaUserCircle } from "react-icons/fa";

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [active, setActive] = useState("How it works?");
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const menuRef = useRef(null);
    const [userData, setUserData] = useState(null);

    const navItems = [
        { name: "How it works?", path: "/" },
        { name: "Trust & Compliance", path: "/trustcompliance" },
        { name: "Benefits", path: "/benefits" },
        { name: "Contact Us", path: "/contactus" }
    ];

    const activePath = navItems.find(item => item.path === location.pathname)?.name;
    
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [location.pathname]);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const currentActive = navItems.find(item => item.path === location.pathname)?.name;
        setActive(currentActive || "How it works?");
    }, [location.pathname]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) setIsOpen(false);
        };
        if (isOpen) document.addEventListener("mousedown", handleClickOutside);
        else document.removeEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    useEffect(() => {
        const cachedUser = localStorage.getItem("token");
        if (cachedUser) {
            // setUserData(JSON.parse(cachedUser));
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));

            const getUser = async () => {
                try {
                    const res = await fetchUserById(payload.id);

                    setUserData(res.data);
                    // localStorage.setItem("userData", JSON.stringify(res.data));

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

    return (
        <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 bg-white ${scrolled ? "shadow-md" : ""}`}>
            <div className="container mx-auto px-4 md:px-8 flex justify-between items-center relative py-6">

                <div className="flex items-center">
                    <div
                        onClick={() => {
                            if (!userData) {
                                navigate("/");
                                return;
                            }

                            const type = userData.user_type?.toLowerCase();
                            if (type === "admin") {
                                navigate("/admin/jobs");
                            } else {
                                navigate("/");
                            }
                        }}
                        className="cursor-pointer"
                    >
                        <img
                            src={Logo}
                            alt="Logo"
                            className="h-6 cursor-pointer xl:h-9"
                            loading="lazy"
                        />
                    </div>
                </div>


                <nav className="hidden lg:flex text-base space-x-0 xl:space-x-4 absolute left-110 xl:left-1/2 transform -translate-x-1/2">
                    {navItems.map(item => (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={`cursor-pointer font-semibold transition-all duration-200 px-2 py-0 ${activePath === item.name
                                ? "text-[#152A45] border-l-4 border-[#1773E2] rounded-none"
                                : "text-[#718096] border-l-4 border-transparent"
                                } hover:text-[#152A45}`}
                        >
                            {item.name}
                        </Link>
                    ))}
                </nav>

                <div className="hidden lg:flex items-center space-x-4 ml-auto">
                    {userData ? (
                        <div className="flex items-center space-x-2"
                            onClick={() => {
                                if (!userData) return;
                                const type = userData.user_type.toLowerCase();
                                if (userData.profile_status?.toLowerCase() === "pending") {
                                    if (type === "tradesperson") navigate("/tradeInfo");
                                    else if (type === "subcontractor") navigate("/subcontractorInfo");
                                } else {
                                    if (type === "tradesperson") navigate("/profile");
                                    else if (type === "subcontractor") navigate("/subcontractor/jobs");
                                    else if (type === "admin") navigate("/admin/jobs");
                                }
                            }}>
                            <div className="text-sm text-[#152A45] text-right">
                                <div className="font-semibold">{userData.name}</div>
                                <div className="text-[#718096]">{userData.email || userData.phone}</div>
                            </div>
                            {userData.profile_pictures ? (
                                <img
                                    src={userData.profile_pictures}
                                    alt="Profile"
                                    className="h-10 w-10 xl:h-12 xl:w-12 rounded-full object-cover cursor-pointer"
                                />
                            ) : (
                                <FaUserCircle className="h-10 w-10 xl:h-12 xl:w-12 text-gray-400 cursor-pointer" />
                            )}
                        </div>
                    ) : (
                        <>
                            <button
                                className="relative w-30 h-10 xl:w-30 xl:h-11 overflow-hidden rounded-[8px] border border-[#152A45] font-semibold text-[#152A45] text-base group cursor-pointer hover:bg-[#0c1a2b] transition"
                                onClick={() => { localStorage.setItem("userType", ""); localStorage.setItem("login", "true"); navigate("/login"); }}
                            >
                                <span className="relative z-10 transition-colors duration-500 group-hover:text-white">Login</span>
                            </button>
                            <button
                                className="relative w-30 h-10 xl:w-30 xl:h-11 overflow-hidden rounded-[8px] bg-[#152A45] font-semibold text-white text-base group cursor-pointer hover:bg-[#0c1a2b] transition"
                                onClick={() => { localStorage.setItem("userType", ""); localStorage.setItem("login", "false"); navigate("/registerchoice"); }}
                            >
                                <span className="relative z-10 transition-colors duration-500 group-hover:text-white">Register</span>
                            </button>
                        </>
                    )}
                </div>

                <div className="lg:hidden flex items-center space-x-2">
                    {userData ? (
                        <div
                            className="flex items-center space-x-1"
                            onClick={() => {
                                if (userData.user_type.toLowerCase() === "tradesperson") navigate("/profile");
                                else if (userData.user_type.toLowerCase() === "subcontractor") navigate("/subcontractor/jobs");
                                else if (userData.user_type.toLowerCase() === "admin") navigate("/admin/jobs");
                            }}
                        >
                            {userData.profile_pictures ? (
                                <img
                                    src={userData.profile_pictures}
                                    alt="Profile"
                                    className="h-10 w-10 xl:h-12 xl:w-12 rounded-full object-cover cursor-pointer"
                                />
                            ) : (
                                <FaUserCircle className="h-10 w-10 xl:h-12 xl:w-12 text-gray-400 cursor-pointer" />
                            )}
                        </div>
                    ) : null}

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
                <div ref={menuRef} className="lg:hidden bg-white w-full shadow-md mt-2">
                    <nav className="flex flex-col space-y-2 px-4 pb-4">
                        {navItems.map(item => (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`text-left font-semibold py-2 px-2 transition-colors duration-200 ${active === item.name ? "text-[#152A45] bg-gray-100 rounded-md" : "text-[#718096]"} hover:text-[#152A45]`}
                                onClick={() => setIsOpen(false)}
                            >
                                {item.name}
                            </Link>
                        ))}

                        {!userData && (
                            <div className="flex space-x-2 mt-2 justify-start">
                                <button
                                    className="px-4 py-2 rounded-lg border border-[#152A45] font-semibold text-[#152A45] hover:bg-[#0c1a2b] hover:text-white transition"
                                    onClick={() => {
                                        localStorage.setItem("userType", "");
                                        localStorage.setItem("login", "true");
                                        navigate("/login");
                                        setIsOpen(false);
                                    }}
                                >
                                    Login
                                </button>
                                <button
                                    className="px-4 py-2 rounded-lg bg-[#152A45] font-semibold text-white hover:bg-[#0c1a2b] transition"
                                    onClick={() => {
                                        localStorage.setItem("userType", "");
                                        localStorage.setItem("login", "false");
                                        navigate("/registerchoice");
                                        setIsOpen(false);
                                    }}
                                >
                                    Register
                                </button>
                            </div>
                        )}

                    </nav>
                </div>
            )}
        </header>
    );
}
