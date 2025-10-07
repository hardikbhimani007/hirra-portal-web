import { RiFlashlightFill } from "react-icons/ri";
import benefits1 from '../../assets/Landing/benefits1.svg';
import benefits2 from '../../assets/Landing/benefits2.svg';
import benefits3 from '../../assets/Landing/benefits3.svg';
import bg4 from '../../assets/Landing/bg4.svg';
import BgSvg1 from '../../Components/Background/bg1';

function KeyBenefits() {
    return (
        <section className="relative w-full py-8 min-[1025px]:py-26 flex justify-center overflow-hidden bg-[#FEF9F6]">
            <BgSvg1 />

            <div className="container mx-auto flex flex-col items-center px-4 gap-2 md:gap-6 text-center relative z-10">
                <h2
                    className="text-xl md:text-4xl font-bold"
                    style={{ color: "var(--color-theme1)" }}
                >
                    Key Benefits
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 w-full z-20">
                    <div className="relative p-6 md:p-10 py-6 md:py-12 flex flex-col items-center rounded-[20px] bg-gradient-to-bl from-[#FF5800]/16 via-white to-white overflow-hidden shadow-[0_2px_6px_rgba(0,0,0,0.05)]">
                        <img
                            src={bg4}
                            alt="bg"
                            className="absolute right-0 -translate-y-1/2 w-54 h-auto pointer-events-none"
                        />

                        <img src={benefits1} alt="Step 1" className="mb-6 w-16 h-16 z-10" />
                        <h3
                            className="font-bold text-base lg:text-2xl mb-2 text-center z-10"
                            style={{ color: "var(--color-theme1)" }}
                        >
                            Local Job Matching
                        </h3>
                        <p
                            className="text-gray-600 text-sm lg:text-lg text-center z-10"
                            style={{ color: "var(--color-theme3)" }}
                        >
                            Find nearby work or workers using smart location and radius filters.
                        </p>
                    </div>

                    <div className="relative p-6 md:p-10 py-6 md:py-12 flex flex-col items-center rounded-[20px] bg-gradient-to-bl from-[#FF5800]/16 via-white to-white overflow-hidden shadow-[0_2px_6px_rgba(0,0,0,0.05)]">
                        <img
                            src={bg4}
                            alt="bg"
                            className="absolute right-0  -translate-y-1/2 w-54 h-auto pointer-events-none"
                        />

                        <img src={benefits2} alt="Step 2" className="mb-6 w-16 h-16 z-10" />
                        <h3
                            className="font-bold text-base lg:text-2xl mb-2 text-center z-10"
                            style={{ color: "var(--color-theme1)" }}
                        >
                            Easy Profiles & Messaging
                        </h3>
                        <p
                            className="text-gray-600 text-sm lg:text-lg text-center z-10"
                            style={{ color: "var(--color-theme3)" }}
                        >
                            Build a simple profile, connect instantly, and chat directly within the platform.
                        </p>
                    </div>

                    <div className="relative p-6 md:p-10 py-6 md:py-12 flex flex-col items-center rounded-[20px] bg-gradient-to-bl from-[#FF5800]/16 via-white to-white overflow-hidden shadow-[0_2px_6px_rgba(0,0,0,0.05)]">
                        <img
                            src={bg4}
                            alt="bg"
                            className="absolute right-0  -translate-y-1/2 w-54 h-auto pointer-events-none"
                        />
                        <img src={benefits3} alt="Step 3" className="mb-6 w-16 h-16 z-10" />
                        <h3
                            className="font-bold text-base lg:text-2xl mb-2 text-center z-10"
                            style={{ color: "var(--color-theme1)" }}
                        >
                            Fast Job Posting & Review
                        </h3>
                        <p
                            className="text-gray-600 text-sm lg:text-lg text-center z-10"
                            style={{ color: "var(--color-theme3)" }}
                        >
                            Post jobs in minutes, review applicants quickly, and hire without delays.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default KeyBenefits;
