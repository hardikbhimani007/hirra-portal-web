import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FaCircleCheck } from "react-icons/fa6";
import { CiUser } from "react-icons/ci";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SmallLoader from "../Components/SmallLoader";
import Navbar from '../Components/Jobs/Navbar';
import BasicInfoModal from '../Components/Profile/BasicInfoModal';

import marker from "../assets/Jobs/marker.svg";

import icon1 from "../assets/Jobs/icon1.svg";
import icon2 from "../assets/Jobs/icon2.svg";
import icon3 from "../assets/Jobs/icon3.svg";

import selectedIcon1 from "../assets/Jobs/selectedIcon1.svg";
import selectedIcon2 from "../assets/Jobs/selectedIcon2.svg";
import selectedIcon3 from "../assets/Jobs/selectedIcon3.svg";

import { MyProfile } from "../services/jobService";

function Profile() {
    const [userData, setUserData] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true); // <-- Add loading state
    const location = useLocation();
    const userIdFromState = location.state?.user_id;

    const fetchUser = async () => {
        try {
            setLoading(true); // start loader
            const response = await MyProfile(userIdFromState);
            setUserData(response.data);
            await localStorage.setItem("profilepictures", response.data?.profile_pictures)
        } catch (error) {
            console.error("Failed to fetch profile:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, [userIdFromState]);

    if (loading) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
                <SmallLoader />
            </div>
        );
    }

    if (!userData) return null;

    const profile = {
        name: userData.name,
        image: userData.profile_pictures,
        location: userData.location,
        travelRadius: `${userData.radius}`,
        email: userData.email,
    };

    const verification = {
        cscsCard: userData.is_cscsfile_verified,
        jobsSaved: userData.saved_jobs_count,
        applications: userData.applied_jobs_count,
    };

    const skills = userData.skill || [];
    const availability = userData.availability || "Not specified";
    const job = {
        title: userData.title || "No title",
        rate: userData.min_hour_rate || 0,
        description: userData.description || "No description available",
    };

    const navItems = [
        { name: "Jobs", path: "/tradesperson/jobs", icon: icon3, iconActive: selectedIcon3 },
        { name: "Messages", path: "/tradesperson/messages", icon: icon2, iconActive: selectedIcon2 },
        { name: "My Applications", path: "/tradesperson/myapplications", icon: icon1, iconActive: selectedIcon1 }
    ];

    return (
        <div>
            <Navbar navItems={navItems} />

            <div className="min-h-screen -mt-6 2xl:-mt-0">
                <div className="container mx-auto w-[90%] min-[1440px]:w-[60%] px-4 md:px-6 py-6 border border-gray-300 rounded-xl bg-white shadow-sm">
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 items-center">
                        <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-4 md:gap-6 items-center justify-items-center sm:justify-items-start">
                            <div className="w-28 h-28 rounded-full shadow-lg overflow-hidden flex items-center justify-center bg-gray-100">
                                {profile.image ? (
                                    <img
                                        src={profile.image}
                                        alt="User Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <CiUser className="w-20 h-20 text-gray-400" />
                                )}
                            </div>

                            <div className="flex flex-col justify-center text-center sm:text-left flex-1 min-w-0">
                                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 break-all whitespace-normal">
                                    {profile.name}
                                </h2>
                                <div className="flex mt-2 items-start gap-2 justify-center sm:justify-start">
                                    <img src={marker} alt="Location" className="w-5 h-5 mt-1 flex-shrink-0" />
                                    <p className="text-[#718096] font-semibold text-sm sm:text-base break-all whitespace-normal max-w-[calc(90vw-60px)] sm:max-w-[calc(42vw-20px)]">
                                        {profile.location || "No location provided"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {!userIdFromState && (
                            <div className="mt-4 lg:mt-0 flex justify-center lg:justify-end">
                                <button
                                    className="text-black border border-gray-300 font-semibold px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                                    onClick={() => setIsModalOpen(true)}
                                >
                                    Edit Profile
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="container mx-auto w-[90%] min-[1440px]:w-[60%] mt-6 md:mt-8 mb-6">
                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 xl:gap-6">
                        <div className="xl:col-span-5 bg-white border border-gray-300 rounded-xl p-4 md:p-6 shadow-sm">
                            <h3 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6">Basic Information</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 pb-6 border-b border-gray-300">
                                <div className="flex flex-col font-semibold">
                                    <span className="text-[#718096] text-base mb-1">Full Name</span>
                                    <span className="text-[#1A202C] text-base break-words">{profile.name}</span>
                                </div>

                                <div className="flex flex-col font-semibold">
                                    <span className="text-[#718096] text-base mb-1">Travel Radius</span>
                                    <span className="text-[#1A202C] text-base break-words">
                                        {profile.travelRadius ?? ""}
                                    </span>
                                </div>

                                <div className="flex flex-col font-semibold col-span-1 sm:col-span-2">
                                    <span className="text-[#718096] text-base mb-1">Location</span>
                                    <p className="text-[#1A202C] text-base break-words">{profile.location}</p>
                                </div>

                                <div className="flex flex-col font-semibold col-span-1 sm:col-span-2">
                                    <span className="text-[#718096] text-base mb-1">Email ID</span>
                                    <p className="text-[#1A202C] text-base lowercase break-all">{profile.email}</p>
                                </div>
                            </div>
                            <h3 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6">Verification & Credential</h3>

                            <div className="flex flex-wrap gap-3 md:gap-6 mb-6 pb-6 border-b border-gray-300">
                                <div className="flex-1 flex flex-col font-semibold min-w-[100px]">
                                    <span className="text-[#718096] text-base">CSCS Card</span>
                                    <span className="flex items-center text-[#1A202C] text-sm md:text-base gap-2">
                                        {verification.cscsCard === "Verified" && <FaCircleCheck className="text-green-600" />}
                                        {verification.cscsCard}
                                    </span>
                                </div>

                                <div className="flex-1 flex flex-col font-semibold min-w-[100px]">
                                    <span className="text-[#718096] text-base">Job Saved</span>
                                    <span className="text-[#1A202C] text-sm md:text-base">{verification.jobsSaved}</span>
                                </div>

                                <div className="flex-1 flex flex-col font-semibold min-w-[100px]">
                                    <span className="text-[#718096] text-base">Application</span>
                                    <span className="text-[#1A202C] text-sm md:text-base">{verification.applications}</span>
                                </div>
                            </div>
                            <h3 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6">Skills & Availability</h3>

                            <div className="grid gap-4 md:gap-6">
                                <div>
                                    <span className="text-[#718096] text-base font-semibold block mb-2">Skills</span>
                                    <div className="flex flex-wrap gap-2">
                                        {skills.map((skill, index) => (
                                            <span className="bg-gray-100 text-gray-500 px-3 py-2 rounded-full text-sm flex items-center justify-center break-words break-all">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <span className="text-[#718096] text-base font-semibold block mb-2">Availability</span>
                                    <p className="text-[#1A202C] text-base break-words">{availability}</p>
                                </div>
                            </div>
                        </div>

                        <div className="xl:col-span-7 bg-white border border-gray-300 rounded-xl p-4 md:p-6 shadow-sm">
                            <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4 items-start mb-6">
                                <h3 className="text-xl md:text-2xl font-semibold break-all">{job.title}</h3>
                                <span className="font-semibold text-[#718096]">
                                    <span className="text-black text-xl md:text-2xl font-bold">${job.rate}</span>/hour
                                </span>
                            </div>

                            <div className="text-[#718096] text-base font-medium leading-relaxed  break-all">
                                <p>{job.description}</p>
                            </div>
                        </div>
                    </div>
                </div>
                {isModalOpen && (
                    <BasicInfoModal
                        onClose={() => setIsModalOpen(false)}
                        userData={userData}
                        onSaveSuccess={() => {
                            fetchUser();
                            toast.success("Profile updated successfully!");
                        }}
                    />
                )}
                <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
            </div>
        </div>
    );
}

export default Profile;