import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loginUser } from "../services/userService";
import onboardImage from "../assets/images/Onboard.png";
import onboardbackground from "../assets/images/Onboardbackground.png";
import logo from "../assets/images/logo.png";
import phoneicon from "../assets/images/iphone16.png";
import InstallButton from "../Components/InstallButton";

const Login = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [phoneOrEmail, setPhoneOrEmail] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSendCode = async () => {
        if (!phoneOrEmail.trim()) {
            setError("This field is required");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[0-9]{10,15}$/;

        let payload = {};

        if (emailRegex.test(phoneOrEmail)) {
            payload.email = phoneOrEmail;
        } else if (phoneRegex.test(phoneOrEmail)) {
            payload.phone = phoneOrEmail;
        } else {
            setError("Please enter a valid email or phone number");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const res = await loginUser(payload);

            if (res?.otp) {
                const userType = res?.user_type;
                toast.success(`OTP sent successfully!`);
                navigate(`/otp?phoneOrEmail=${phoneOrEmail}`, { state: { userType, phoneOrEmail, authType: "login" } });
            }
        } catch (err) {
            console.error("API Error:", err);
            toast.error(err.response?.data?.message || "Something went wrong. Please try again.");
            setError(err.response?.data?.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row h-screen w-full p-4 md:p-5 bg-gray-100 overflow-hidden">
            <div className="hidden min-[1025px]:flex flex-[1110] h-full items-center justify-center rounded-[20px] xl:rounded-[30px] overflow-hidden">
                <img
                    src={onboardImage}
                    alt="Onboarding illustration"
                    className="w-full h-full object-cover"
                />
            </div>

            <div
                className="flex-[750] flex items-center justify-center rounded-[15px] xl:rounded-[20px] 2xl:rounded-[30px] lg:ml-3 xl:ml-5 bg-cover bg-center relative min-h-screen lg:min-h-full"
                style={{ backgroundImage: `url(${onboardbackground})` }}
            >
                <div className="absolute inset-0 bg-white/80 rounded-[15px] xl:rounded-[20px] 2xl:rounded-[30px]" />

                <div className="w-full max-w-[90%] max-[768px]:w-full max-[1025px]:w-[60%] max-[1440px]:w-[100%] min-[1441px]:w-[72%] relative z-10 flex flex-col justify-between p-1 xs:p-5 sm:p-6 md:p-7 lg:p-5 xl:p-6 2xl:p-8 rounded-xl min-h-[90vh] lg:min-h-[85vh]">

                    <div className="flex items-center justify-center py-4">
                        <img
                            src={logo}
                            alt="Logo"
                            className="w-[140px] sm:w-[180px] md:w-[200px] lg:w-[180px] xl:w-[220px] 2xl:w-[240px] h-auto"
                        />
                    </div>

                    <div className="flex-1 flex flex-col justify-center py-4 xs:py-5 sm:py-6 md:py-8 lg:py-4 xl:py-6">
                        <h2 className="font-semibold text-[20px] xs:text-[24px] sm:text-[28px] md:text-[32px] lg:text-[26px] xl:text-[28px] 2xl:text-[32px] 3xl:text-[36px] leading-[1.3] xs:leading-[1.4] sm:leading-[1.5] text-center text-[#1A202C] mb-2 xs:mb-3 sm:mb-4">
                            Sign in<br /> with your phone/email
                        </h2>

                        <p className="font-medium text-[12px] xs:text-[14px] sm:text-[15px] md:text-[16px] lg:text-[14px] xl:text-[15px] 2xl:text-[16px] leading-[1.4] sm:leading-[1.5] text-center text-[#718096] mb-4 xs:mb-5 sm:mb-6 md:mb-7 lg:mb-5 xl:mb-6 px-1 xs:px-2">
                            Use your registered phone number or email to continue.
                        </p>

                        <div className="mb-3 xs:mb-4 sm:mb-5 lg:mb-4 xl:mb-5">
                            <label
                                htmlFor="phoneOrEmail"
                                className="block font-medium text-[13px] xs:text-[14px] sm:text-[15px] md:text-[16px] lg:text-[14px] xl:text-[15px] 2xl:text-[16px] text-[#1A202C] mb-1.5 xs:mb-2"
                            >
                                Phone or Email
                            </label>

                            <input
                                type="text"
                                id="phoneOrEmail"
                                placeholder="Enter phone or email"
                                value={phoneOrEmail}
                                onChange={(e) => setPhoneOrEmail(e.target.value)}
                                className={`w-full h-[42px] xs:h-[44px] sm:h-[48px] md:h-[50px] lg:h-[46px] xl:h-[48px] 2xl:h-[50px] border rounded-[8px] sm:rounded-[10px] px-3 py-2 text-[13px] xs:text-[14px] sm:text-[15px] md:text-[16px] lg:text-[14px] xl:text-[15px] 2xl:text-[16px] focus:ring-2 focus:outline-none placeholder:text-gray-400 transition-all duration-200 ${error
                                    ? "border-red-500 focus:ring-red-500"
                                    : "border-gray-300 focus:ring-[#1A202C]"
                                    }`}
                            />
                            {error && <p className="text-red-500 text-[11px] xs:text-[12px] mt-1">{error}</p>}
                        </div>

                        <button
                            onClick={handleSendCode}
                            disabled={loading}
                            className={`w-full h-[42px] xs:h-[44px] sm:h-[48px] md:h-[50px] lg:h-[46px] xl:h-[48px] 2xl:h-[50px] ${loading
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-[#152A45] hover:bg-gray-900 active:bg-gray-800"
                                } text-white rounded-[8px] sm:rounded-[10px] py-2 text-[13px] xs:text-[14px] sm:text-[15px] md:text-[16px] lg:text-[14px] xl:text-[15px] 2xl:text-[16px] font-medium mb-3 xs:mb-4 sm:mb-5 lg:mb-4 xl:mb-5 transition-all duration-200 cursor-pointer touch-manipulation`}
                        >
                            {loading ? "Sending..." : "Send Code"}
                        </button>

                        <div className="flex items-center mb-3 xs:mb-4 sm:mb-5 lg:mb-4 xl:mb-5">
                            <div className="flex-1 h-px bg-gray-300" />
                            <span className="px-2 xs:px-3 text-[10px] xs:text-[11px] sm:text-[12px] text-gray-500 font-medium">
                                Or
                            </span>
                            <div className="flex-1 h-px bg-gray-300" />
                        </div>

                        <button className="w-full h-[42px] xs:h-[44px] sm:h-[48px] md:h-[50px] lg:h-[46px] xl:h-[48px] 2xl:h-[50px] flex items-center justify-center border border-gray-300 rounded-[8px] sm:rounded-[10px] py-2 text-[13px] xs:text-[14px] sm:text-[15px] md:text-[16px] lg:text-[14px] xl:text-[15px] 2xl:text-[16px] font-medium hover:bg-gray-50 active:bg-gray-100 transition-all duration-200 cursor-pointer touch-manipulation">
                            <img
                                src="https://www.svgrepo.com/show/355037/google.svg"
                                alt="Google"
                                className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0"
                            />
                            <span className="truncate">Sign In With Google</span>
                        </button>

                        <div className="text-center mt-4">
                            <p className="text-sm xs:text-base text-gray-600">
                                Don’t have an account?{" "}
                                <button
                                    onClick={() => {
                                        localStorage.setItem("userType", "");
                                        localStorage.setItem("login", "false");
                                        navigate("/registerchoice");
                                    }}
                                    className="text-blue-600 font-medium hover:underline transition-colors duration-200 cursor-pointer"
                                >
                                    Sign Up
                                </button>
                            </p>
                        </div>
                    </div>

                    <div className="text-center py-4">
                        <div className="inline-flex items-start text-xs sm:text-sm text-gray-600">
                            <img
                                src={phoneicon}
                                alt="Hirra Logo"
                                className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 relative top-[2px]"
                            />
                            <p className="m-0 ml-[4px]">
                                Install Hirra to your Home Screen for quick access.{' '}
                                <InstallButton />
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
