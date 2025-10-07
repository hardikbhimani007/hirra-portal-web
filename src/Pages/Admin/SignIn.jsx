import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import onboardbackground from "../../assets/images/Onboardbackground.png";
import logo from "../../assets/images/logo.png";
import phoneicon from "../../assets/Images/iphone16.png";
import { toast } from "react-toastify";
import adminonboard from "../../assets/Images/adminsignin.webp"
import { verifyUser } from "../../services/userService";

const SignIn = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        localStorage.clear();
    }, []);

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;

        if (!email.trim()) return 'Email is required';
        if (!emailRegex.test(email) && !phoneRegex.test(email.replace(/[\s\-\(\)]/g, ''))) {
            return 'Please enter a valid email address';
        }
        return '';
    };

    const validatePassword = (password) => {
        if (!password) return 'Password is required';
        if (password.length < 6) return 'Password must be at least 6 characters long';
        return '';
    };

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);
        if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
    };

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);
        if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
    };

    const handleLogin = async () => {
        const emailError = validateEmail(email);
        const passwordError = validatePassword(password);

        const newErrors = { email: emailError, password: passwordError };
        setErrors(newErrors);

        if (emailError || passwordError) return;

        setLoading(true); // start loading
        try {
            const response = await verifyUser({ email, otp: "121212" });

            if (response.success) {
                toast.success("Login successful!", {
                    position: "top-right",
                    autoClose: 3000,
                });
                navigate("/admin/jobs");
            } else {
                toast.error(response.message || "Invalid email or OTP!", {
                    position: "top-right",
                    autoClose: 3000,
                });
            }
        } catch (error) {
            toast.error(error.message || "Something went wrong!", {
                position: "top-right",
                autoClose: 3000,
            });
        } finally {
            setLoading(false); // stop loading
        }
    };

    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    return (
        <div className="flex flex-col lg:flex-row h-screen w-full p-2 sm:p-4 md:p-5 bg-gray-100">
            <div className="hidden lg:flex flex-[1110] h-full items-center justify-center rounded-[15px] xl:rounded-[20px] 2xl:rounded-[30px] overflow-hidden">
                <img src={adminonboard} alt="Onboarding illustration" className="w-full h-full object-cover" />
            </div>

            <div
                className="flex-[750] lg:mt-0 flex items-center justify-center rounded-[20px] xl:rounded-[30px] lg:ml-5 bg-cover bg-center relative h-full lg:h-full"
                style={{ backgroundImage: `url(${onboardbackground})` }}
            >
                <div className="absolute inset-0 bg-white/80 rounded-[20px] xl:rounded-[30px]" />

                <div className="w-full max-w-[95%] sm:max-w-[420px] md:max-w-[480px] lg:max-w-[85%] xl:max-w-[520px] relative z-10 flex flex-col h-full justify-between p-4 sm:p-5 md:p-6 lg:p-5 xl:p-8 rounded-xl">
                    <div className="flex items-center justify-center pt-2 sm:pt-4">
                        <img src={logo} alt="Logo" className="w-[120px] sm:w-[140px] md:w-[160px] lg:w-[140px] xl:w-[180px] 2xl:w-[220px] h-auto" />
                    </div>

                    <div className="flex-1 flex flex-col justify-center py-4 sm:py-6">
                        <h2 className="font-semibold text-[24px] sm:text-[28px] md:text-[32px] lg:text-[28px] xl:text-[32px] 2xl:text-[32px] leading-[1.4] sm:leading-[1.5] md:leading-[50px] text-center text-[#1A202C] mb-3 sm:mb-4">
                            Sign in with your email
                        </h2>

                        <p className="font-medium text-[16px] sm:text-[15px] md:text-[16px] lg:text-[15px] xl:text-[16px] leading-[1.4] sm:leading-[1.5] md:leading-[24px] text-center text-[#718096] mb-4 sm:mb-5 md:mb-6 px-2">
                            Use your registered email address to continue.
                        </p>

                        <div className="mb-3 sm:mb-4">
                            <label htmlFor="email" className="block font-medium text-[14px] sm:text-[15px] md:text-[16px] lg:text-[15px] xl:text-[16px] leading-[1.4] sm:leading-[1.5] md:leading-[24px] text-[#1A202C] mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                placeholder="Enter email"
                                value={email}
                                onChange={handleEmailChange}
                                className={`w-full h-[44px] sm:h-[48px] md:h-[50px] border rounded-[10px] px-3 py-2 text-[14px] sm:text-[15px] md:text-[16px] focus:ring-2 focus:outline-none placeholder:text-gray-400 ${errors.email ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-[#1A202C]"}`}
                            />
                            {errors.email && <p className="text-red-500 text-[12px] mt-1">{errors.email}</p>}
                        </div>

                        <div className="mb-3 sm:mb-4">
                            <label htmlFor="password" className="block font-medium text-[14px] sm:text-[15px] md:text-[16px] lg:text-[15px] xl:text-[16px] leading-[1.4] sm:leading-[1.5] md:leading-[24px] text-[#1A202C] mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    placeholder="Enter password"
                                    value={password}
                                    onChange={handlePasswordChange}
                                    className={`w-full h-[44px] sm:h-[48px] md:h-[50px] border rounded-[10px] px-3 py-2 pr-10 text-[14px] sm:text-[15px] md:text-[16px] focus:ring-2 focus:outline-none placeholder:text-gray-400 ${errors.password ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-[#1A202C]"}`}
                                />
                                <button type="button" onClick={togglePasswordVisibility} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none">
                                    {showPassword ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            {errors.password && <p className="text-red-500 text-[12px] mt-1">{errors.password}</p>}
                        </div>

                        <button
                            onClick={handleLogin}
                            disabled={loading}
                            className={`w-full h-[44px] sm:h-[48px] md:h-[50px] bg-[#152A45] hover:bg-gray-900 text-white rounded-[10px] py-2 text-[14px] sm:text-[15px] md:text-[16px] font-medium transition-colors duration-200 cursor-pointer ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                                    </svg>
                                    Loading...
                                </span>
                            ) : (
                                "Log in"
                            )}
                        </button>

                    </div>

                    <div className="text-center py-4">
                        <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-gray-600">
                            <img src={phoneicon} alt="Hirra Logo" className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span>Install Hirra to your Home Screen for quick access.</span>
                            <button className="text-blue-600 text-xs sm:text-sm font-medium hover:underline">Add</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignIn;
