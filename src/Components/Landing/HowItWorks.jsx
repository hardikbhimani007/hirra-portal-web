import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RiFlashlightFill } from "react-icons/ri";

import step1 from '../../assets/Landing/step1.svg';
import step2 from '../../assets/Landing/step2.svg';
import step3 from '../../assets/Landing/step3.svg';

import step1con from '../../assets/Landing/step1con.svg';
import step2con from '../../assets/Landing/step2con.svg';
import step3con from '../../assets/Landing/step3con.svg';

function HowItWorks() {
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState('contractor');

    const steps = {
        contractor: [
            {
                title: "1. Post a Job",
                img: step1con,
                desc: "Quickly create job postings with all the details—location, skills required, and timelines. Attract qualified tradespeople instantly."
            },
            {
                title: "2. Review Applications",
                img: step2con,
                desc: "Go through applicants' profiles, see their experience, certifications, and reviews to pick the right fit for your project."
            },
            {
                title: "3. Hire & Track Progress",
                img: step3con,
                desc: "Hire your preferred tradesperson and monitor the job progress in real-time for a smooth workflow."
            }
        ],
        tradespeople: [
            {
                title: "1. Sign Up",
                img: step1,
                desc: "Create your free worker profile in minutes and start your journey towards finding reliable work."
            },
            {
                title: "2. Upload CSCS / Certifications",
                img: step2,
                desc: "Verify your professional skills by uploading a valid CSCS card or other certifications to strengthen your credibility."
            },
            {
                title: "3. Apply for Jobs",
                img: step3,
                desc: "Search and apply instantly for local jobs that match your skills, availability, and preferences."
            }
        ]
    };

    return (
        <section className="w-full py-8 md:py-20 flex justify-center bg-[#FEF9F6]">
            <div className="container mx-auto flex flex-col items-center px-4 gap-2 md:gap-6 text-center">
                <h2 className="text-xl md:text-4xl font-bold" style={{ color: "var(--color-theme1)" }}>
                    How It Works?
                </h2>
                <p className="text-sm md:text-lg" style={{ color: "var(--color-theme3)" }}>
                    Quick and easy process to connect with jobs.
                </p>
                <div
                    className="flex rounded-full bg-white p-1 my-2 md:my-4 text-xs md:text-lg"
                    style={{ boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px" }}
                >
                    <button
                        className={`px-6 py-2 rounded-full font-semibold transition-colors cursor-pointer ${activeTab === 'contractor' ? 'bg-[#152A45] text-white' : 'text-gray-500'}`}
                        onClick={() => { localStorage.setItem("login", "false"); setActiveTab('contractor'); }}
                    >
                        For Contractor
                    </button>
                    <button
                        className={`px-6 py-2 rounded-full font-semibold transition-colors cursor-pointer ${activeTab === 'tradespeople' ? 'bg-[#152A45] text-white' : 'text-gray-500'}`}
                        onClick={() => { localStorage.setItem("login", "false"); setActiveTab('tradespeople'); }}
                    >
                        For Tradespeople
                    </button>
                </div>

                <div className="flex flex-col md:flex-row w-full gap-0 md:gap-4 mt-0 md:mt-8 text-left relative">
                    {steps[activeTab].map((step, index) => (
                        <div key={index} className="flex-1 p-0 md:p-6 pt-8 md:pt-0 rounded-lg flex flex-col items-center relative">
                            <img src={step.img} alt={step.title} className="mb-2 md:mb-6 w-16 h-16 lg:w-20 lg:h-20" />
                            <h3 className="font-bold text-base lg:text-2xl mb-2 text-center" style={{ color: "var(--color-theme1)" }}>
                                {step.title}
                            </h3>
                            <p className="text-gray-600 text-sm lg:text-lg text-center" style={{ color: "var(--color-theme3)" }}>
                                {step.desc}
                            </p>
                            {index !== steps[activeTab].length - 1 && (
                                <div className="hidden md:block absolute right-0 top-16 bottom-16 w-px bg-gray-300"></div>
                            )}
                        </div>
                    ))}
                </div>

                <div className='py-3 md:py-4'>
                    <button
                        className="flex items-center gap-2 bg-[#E7B900] text-sm sm:text-base md:text-lg text-white py-3 md:py-4 px-4 md:px-6 rounded-md font-semibold whitespace-nowrap cursor-pointer"
                        style={{ backgroundColor: "var(--color-theme1)" }}
                        onClick={() => {
                            if (activeTab === 'contractor') {
                                localStorage.setItem("userType", "subcontractor");
                            } else {
                                localStorage.setItem("userType", "tradesperson");
                            }
                            navigate("/registerchoice");
                        }}
                    >
                        <RiFlashlightFill />
                        <span>{activeTab === 'contractor' ? 'Post a Job Today' : 'Start Applying Today'}</span>
                    </button>
                </div>

            </div>
        </section>
    );
}

export default HowItWorks;
