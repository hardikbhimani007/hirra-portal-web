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

            <div className="container mx-auto w-[90%] min-[1440px]:w-[60%] py-3 px-3 md:py-6 md:px-6 -mt-8 2xl:mt-4 border border-gray-300 rounded-xl flex flex-wrap md:flex-nowrap items-center gap-4">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 md:gap-6 flex-1 min-w-0">
                    <div className="w-28 h-28 rounded-full shadow-lg overflow-hidden flex items-center justify-center bg-gray-100 flex-shrink-0">
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

                    <div className="flex flex-row items-center w-full min-w-0">
                        <div className="flex flex-col justify-center text-center sm:text-left flex-1 min-w-0">
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 break-words whitespace-normal">
                                {profile.name}
                            </h2>
                            <div className="flex mt-2 items-start gap-2 justify-center sm:justify-start">
                                <img src={marker} alt="Location" className="w-5 h-5 mt-1 flex-shrink-0" />
                                <p className="text-[#718096] font-semibold text-sm sm:text-base break-words whitespace-normal max-w-[calc(90vw-60px)] sm:max-w-[calc(42vw-20px)]">
                                    {profile.location || "No location provided"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {!userIdFromState && (
                    <div className="w-full md:w-auto flex justify-center md:justify-start">
                        <button
                            className="text-black border border-gray-300 font-semibold px-5 py-2 rounded-lg cursor-pointer"
                            onClick={() => setIsModalOpen(true)}
                        >
                            Edit Profile
                        </button>
                    </div>
                )}
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

            <div className="container mx-auto w-[90%] min-[1440px]:w-[60%] mt-2 md:mt-8 flex flex-col md:flex-row gap-2 md:gap-8 mb-4 md:mb-6">
                <div className="md:w-5/12 bg-white border border-gray-300 rounded-xl p-4 md:p-6 shadow">
                    <p className="text-xl min-[769px]:text-3xl font-semibold mb-4 md:mb-6">Basic Information</p>
                    <div className="flex flex-wrap gap-3 mb-3 md:gap-6 md:mb-6">
                        <div className="flex-1 min-w-[150px] flex flex-col font-semibold">
                            <span className="text-[#718096] text-base">Full Name</span>
                            <span className="text-[#1A202C] text-base break-words">{profile.name}</span>
                        </div>

                        <div className="flex-1 min-w-[150px] flex flex-col font-semibold">
                            <span className="text-[#718096] text-base">Travel Radius</span>
                            <span className="text-[#1A202C] text-base break-words">
                                {profile.travelRadius ?? ""}
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 md:gap-6 font-semibold pb-4 md:pb-6 border-b border-gray-300">
                        <div>
                            <span className="text-[#718096] text-base">Location</span>
                            <p className="text-[#1A202C] text-base break-words">{profile.location}</p>
                        </div>
                        <div>
                            <span className="text-[#718096] text-base">Email ID</span>
                            <p className="text-[#1A202C] text-base lowercase break-all">{profile.email}</p>
                        </div>
                    </div>

                    <p className="text-xl min-[769px]:text-3xl font-semibold mb-4 md:mb-6 pt-6">Verification & Credential</p>
                    <div className="flex flex-wrap gap-3 md:gap-6 mb-6 pb-6 border-b border-gray-300">
                        <div className="flex-1 flex flex-col font-semibold min-w-[100px]">
                            <span className="text-[#718096] text-base">CSCS Card</span>
                            <span className="flex items-center text-[#1A202C] text-base gap-2">
                                {verification.cscsCard === "Verified" && <FaCircleCheck className="text-green-600" />}
                                {verification.cscsCard}
                            </span>
                        </div>

                        <div className="flex-1 flex flex-col font-semibold min-w-[100px]">
                            <span className="text-[#718096] text-base">Job Saved</span>
                            <span className="text-[#1A202C] text-base">{verification.jobsSaved}</span>
                        </div>

                        <div className="flex-1 flex flex-col font-semibold min-w-[100px]">
                            <span className="text-[#718096] text-base">Application</span>
                            <span className="text-[#1A202C] text-base">{verification.applications}</span>
                        </div>
                    </div>

                    <p className="text-xl min-[769px]:text-3xl font-semibold mb-4 md:mb-6">Skills & Availability</p>
                    <div className="flex flex-col gap-4 md:gap-6 font-semibold pb-2">
                        <div>
                            <span className="text-[#718096] text-base">Skills</span>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {skills.map((skill, index) => (
                                    <span
                                        key={index}
                                        className="bg-gray-100 text-gray-500 px-3 py-2 rounded-full text-sm flex items-center justify-center break-words"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div>
                            <span className="text-[#718096] text-base">Availability</span>
                            <p className="text-[#1A202C] text-base mt-1 break-words">{availability}</p>
                        </div>
                    </div>
                </div>

                <div className="md:w-7/12 bg-white border border-gray-300 rounded-xl p-4 md:p-6 shadow">
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                        <p className="text-xl min-[769px]:text-3xl font-semibold break-words flex-1 min-w-0">{job.title}</p>
                        <span className="font-semibold text-[#718096] whitespace-nowrap flex-shrink-0">
                            <span className="text-black text-xl min-[769px]:text-3xl font-bold">${job.rate}</span>/hour
                        </span>
                    </div>
                    <div className="text-[#718096] text-base font-semibold break-words mt-4 md:mt-6">
                        <p>{job.description}</p>
                    </div>
                </div>
            </div>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
        </div>
    );
}

export default Profile;
