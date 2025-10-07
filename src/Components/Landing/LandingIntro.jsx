import { useNavigate } from "react-router-dom";
import image1 from '../../assets/Landing/image1.webp';
import image2 from '../../assets/Landing/image2.webp';
import image3 from '../../assets/Landing/image3.webp';
import Background from "../Background/bg"

function LandingIntro() {
    const navigate = useNavigate();
    return (
        <section className="w-full pt-10 min-[769px]:pt-24 flex justify-center bg-white z-20">
            {/* <Background /> */}
            <div className="flex flex-col-reverse md:flex-row items-center">
                <div className="w-full lg:w-1/2 flex flex-col items-start text-left py-10 sm:py-20 mx-0 lg:mx-6 2xl:mx-0 pl-0 2xl:pl-50 pt-12 lg:pt-10 
                lg:items-center lg:text-start lg:pl-0">
                    <h1 className="text-[#152A45] text-2xl sm:text-4xl md:text-5xl lg:text-5xl leading-relaxed mb-4 px-4" style={{ fontWeight: "600" }}>
                        Connecting
                        <svg
                            className="hidden sm:inline-block h-10 sm:h-10 md:h-14 w-auto rounded-md align-top mx-2 -mt-3 -ml-1"
                            width="102"
                            height="74"
                            viewBox="0 0 102 74"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <g clipPath="url(#clip0_854_9884)">
                                <path d="M19 58.9124C38.4556 55.9193 57.8374 57.5943 76.5217 64.0429C82.9619 66.2656 89.6134 68.3415 95.7826 71.2603C97.361 72.007 98.6211 72.9994 100.391 72.9994" stroke="#1773E2" strokeWidth="2" strokeLinecap="round" />
                                <path d="M8.82608 49.5217C12.8544 36.9892 11.6759 20.3885 6.47826 8.26087C5.23076 5.35005 3.19482 3.19482 1 1" stroke="#1773E2" strokeWidth="2" strokeLinecap="round" />
                                <path d="M22.1309 44.8253C27.4687 39.4875 32.5629 34.131 39.3483 30.7383" stroke="#1773E2" strokeWidth="2" strokeLinecap="round" />
                            </g>
                            <defs>
                                <clipPath id="clip0_854_9884">
                                    <rect width="102" height="74" fill="white" />
                                </clipPath>
                            </defs>
                        </svg>
                        <br />
                        Subcontractors With Verified Tradespeople.
                    </h1>
                    <p className="text-[#718096] text-sm sm:text-base mt-4 px-4">
                        Find skilled tradespeople in minutes or get hired for local jobs—all in one simple platform.
                    </p>

                    <div className="flex flex-row gap-1 mt-6 w-full gap-1 md:gap-6 px-3 lg:text-start">
                        <button
                            onClick={() => { localStorage.setItem("userType", "tradesperson"); navigate("/registerchoice"); }}
                            className="bg-[#FF5800] text-[13px] sm:text-base md:text-lg text-white py-2 sm:py-3 md:py-4 px-3 md:px-6 rounded-md font-semibold whitespace-nowrap cursor-pointer"
                        >
                            I’m a Tradesperson
                        </button>
                        <button
                            onClick={() => { localStorage.setItem("userType", "subcontractor"); navigate("/registerchoice"); }}
                            className="bg-[#E7B900] text-[13px] sm:text-base md:text-lg text-white py-2 sm:py-3 md:py-4 px-3 md:px-6 rounded-md font-semibold whitespace-nowrap cursor-pointer"
                            style={{ backgroundColor: "var(--color-theme1)" }}
                        >
                            I’m a Subcontractor
                        </button>
                    </div>
                </div>

                <div className="w-full lg:w-1/2 flex h-[90vh] justify-center lg:flex hidden">
                    <img
                        src={image3}
                        alt="Landing Visual"
                        className="w-full max-w-md sm:max-w-lg md:max-w-full h-auto rounded-md object-cover"
                    />
                </div>

            </div>
        </section>
    );
}

export default LandingIntro;
